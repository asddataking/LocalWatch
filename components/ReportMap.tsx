"use client";

import { useEffect, useRef } from "react";
import { Doc } from "@/convex/_generated/dataModel";

const CATEGORY_COLORS: Record<string, string> = {
  "Crime": "#C8102E",
  "Suspicious Activity": "#E07B00",
  "Missing Pet": "#7B2D8B",
  "Traffic": "#D4A200",
  "Hazard": "#D45500",
  "Weather": "#0077CC",
  "Scam Alert": "#009688",
};

const CATEGORY_ICONS: Record<string, string> = {
  "Crime": "🚨",
  "Suspicious Activity": "👁️",
  "Missing Pet": "🐾",
  "Traffic": "🚗",
  "Hazard": "⚠️",
  "Weather": "🌩️",
  "Scam Alert": "🛡️",
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

interface ReportMapProps {
  reports: Doc<"reports">[];
  activeCategory: string;
}

export default function ReportMap({ reports, activeCategory }: ReportMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<import("leaflet").CircleMarker[]>([]);

  const filtered =
    activeCategory === "all"
      ? reports
      : reports.filter((r) => r.category === activeCategory);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix default icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!).setView([43.0009, -82.4249], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);
      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when reports or filter changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      // Clear old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

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
        })
          .bindPopup(
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
                ${report.status}
              </div>
            </div>`,
            { maxWidth: 280 }
          )
          .addTo(mapInstanceRef.current!);

        markersRef.current.push(marker);
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, activeCategory, JSON.stringify(filtered.map(r => r._id))]);

  return (
    <div className="map-container relative">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
      {filtered.length === 0 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl pointer-events-none"
          style={{ background: "rgba(248,249,250,0.85)" }}
        >
          <div className="text-4xl mb-2">🗺️</div>
          <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>
            No reports to show on map
          </p>
        </div>
      )}
    </div>
  );
}
