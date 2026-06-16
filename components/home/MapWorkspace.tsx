"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Doc } from "@/convex/_generated/dataModel";
import CategoryFilter from "@/components/CategoryFilter";
import ReportFeed from "@/components/ReportFeed";

const ReportMap = dynamic(() => import("@/components/ReportMap"), {
  ssr: false,
  loading: () => (
    <div
      className="map-container flex items-center justify-center"
      style={{ background: "var(--gray-100)" }}
    >
      <div className="text-center">
        <div className="text-4xl mb-2 animate-pulse">🗺️</div>
        <p className="text-sm font-semibold" style={{ color: "var(--gray-500)" }}>
          Loading map…
        </p>
      </div>
    </div>
  ),
});

type ViewMode = "map" | "list";

interface MapWorkspaceProps {
  reports: Doc<"reports">[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  region: Doc<"regions"> | null | undefined;
  totalReports: number;
}

export default function MapWorkspace({
  reports,
  activeCategory,
  onCategoryChange,
  region,
  totalReports,
}: MapWorkspaceProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("map");

  const filteredCount =
    activeCategory === "all"
      ? totalReports
      : reports.filter((r) => r.category === activeCategory).length;

  return (
    <section id="map" className="scroll-mt-20">
      {/* Map | List toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-xl font-bold"
          style={{ fontFamily: "Merriweather, serif", color: "var(--navy)" }}
        >
          📍 Reports Near You
        </h2>
        <div
          className="flex rounded-lg overflow-hidden border"
          style={{ borderColor: "var(--gray-300)" }}
        >
          <ToggleButton
            active={viewMode === "map"}
            onClick={() => setViewMode("map")}
            label="Map"
            icon="🗺️"
          />
          <ToggleButton
            active={viewMode === "list"}
            onClick={() => setViewMode("list")}
            label="List"
            icon="📋"
          />
        </div>
      </div>

      {/* Sticky category filter */}
      <div
        className="sticky top-16 z-40 py-3 -mx-1 px-1 mb-4"
        style={{ background: "var(--off-white)" }}
      >
        <CategoryFilter active={activeCategory} onChange={onCategoryChange} />
      </div>

      {/* Map or List view */}
      {viewMode === "map" ? (
        <ReportMap reports={reports} activeCategory={activeCategory} region={region} />
      ) : (
        <div>
          <div className="flex items-center justify-end mb-3">
            <span className="text-sm" style={{ color: "var(--gray-500)" }}>
              {filteredCount} report{filteredCount !== 1 ? "s" : ""}
            </span>
          </div>
          <ReportFeed reports={reports} activeCategory={activeCategory} />
        </div>
      )}
    </section>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-colors cursor-pointer border-none"
      style={{
        background: active ? "var(--navy)" : "var(--white)",
        color: active ? "white" : "var(--navy)",
      }}
    >
      {icon} {label}
    </button>
  );
}
