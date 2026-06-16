"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import { Doc } from "@/convex/_generated/dataModel";
import { getStatusDisplay } from "@/app/utils/reportStatus";

const CATEGORY_COLORS: Record<string, string> = {
  "Public Safety": "#C8102E",
  "Fire & EMS": "#E03C31",
  "Traffic": "#D4A200",
  "Lost & Found Pets": "#7B2D8B",
  "Power Outages": "#666666",
  "Weather": "#0077CC",
  "School Alerts": "#009688",
  "Community Alerts": "#E07B00",
};

const CATEGORY_ICONS: Record<string, string> = {
  "Public Safety": "🚓",
  "Fire & EMS": "🚒",
  "Traffic": "🚧",
  "Lost & Found Pets": "🐕",
  "Power Outages": "⚡",
  "Weather": "🌪",
  "School Alerts": "🏫",
  "Community Alerts": "📢",
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

async function loadLeaflet() {
  const leafletModule = await import("leaflet");
  const L = leafletModule.default;

  // markercluster attaches to the global Leaflet namespace
  (window as Window & { L?: typeof L }).L = L;
  await import("leaflet.markercluster");

  return L as typeof L & {
    markerClusterGroup: (options?: object) => LayerGroup;
  };
}

interface ReportMapProps {
  reports: Doc<"reports">[];
  activeCategory: string;
  region?: Doc<"regions"> | null;
}

export default function ReportMap({ reports, activeCategory, region }: ReportMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const clusterGroupRef = useRef<LayerGroup | null>(null);

  const filtered =
    activeCategory === "all"
      ? reports
      : reports.filter((r) => r.category === activeCategory);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapRef.current || mapInstanceRef.current) return;

        const centerLat = region ? (region.minLat + region.maxLat) / 2 : 42.5;
        const centerLng = region ? (region.minLng + region.maxLng) / 2 : -83.1;

        const map = L.map(mapRef.current).setView([centerLat, centerLng], 10);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(map);

        const clusterGroup = L.markerClusterGroup({
          chunkedLoading: true,
          showCoverageOnHover: false,
          maxClusterRadius: 40,
          iconCreateFunction(cluster) {
            return L.divIcon({
              html: `<div style="background-color:#0D1B3E;color:white;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)">${cluster.getChildCount()}</div>`,
              className: "custom-cluster-icon",
              iconSize: L.point(30, 30),
            });
          },
        });
        map.addLayer(clusterGroup);

        mapInstanceRef.current = map;
        clusterGroupRef.current = clusterGroup;

        requestAnimationFrame(() => map.invalidateSize());
      })
      .catch((error) => {
        console.error("Failed to initialize map:", error);
      });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        clusterGroupRef.current = null;
      }
    };
  }, [region]);

  useEffect(() => {
    if (!mapInstanceRef.current || !clusterGroupRef.current) return;

    loadLeaflet().then((L) => {
      if (!clusterGroupRef.current) return;

      clusterGroupRef.current.clearLayers();

      filtered.forEach((report) => {
        const color = CATEGORY_COLORS[report.category] ?? "#0D1B3E";
        const icon = CATEGORY_ICONS[report.category] ?? "📋";

        const marker = L.circleMarker([report.latitude, report.longitude], {
          radius: 10,
          fillColor: color,
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        }).bindPopup(
          `<div style="font-family:Inter,sans-serif;min-width:200px;max-width:260px">
            <div style="font-size:11px;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">
              ${icon} ${report.category}
            </div>
            <div style="font-size:15px;font-weight:800;font-family:Merriweather,serif;color:#0D1B3E;margin-bottom:6px;line-height:1.3">
              ${report.title}
            </div>
            <div style="font-size:11px;color:#6C757D;margin-bottom:6px">
              📍 ${report.locationText} &nbsp;·&nbsp; ${timeAgo(report.createdAt)}
            </div>
            <div style="font-size:12px;color:#495057;line-height:1.5;margin-bottom:8px">
              ${report.description.slice(0, 140)}${report.description.length > 140 ? "…" : ""}
            </div>
            <div style="display:inline-block;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:700;background:#E9ECEF;color:#495057">
              ${getStatusDisplay(report.status).icon} ${getStatusDisplay(report.status).label}
            </div>
          </div>`,
          { maxWidth: 280 }
        );

        clusterGroupRef.current?.addLayer(marker);
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, activeCategory, JSON.stringify(filtered.map((r) => r._id))]);

  return (
    <div className="map-container relative">
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
      {filtered.length === 0 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl pointer-events-none z-[1000]"
          style={{ background: "rgba(248,249,250,0.55)" }}
        >
          <div className="text-4xl mb-2">🗺️</div>
          <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>
            No reports to show in this region
          </p>
        </div>
      )}
    </div>
  );
}
