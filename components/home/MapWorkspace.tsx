"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Doc, Id } from "@/convex/_generated/dataModel";
import CategoryFilter from "@/components/CategoryFilter";
import ReportFeed from "@/components/ReportFeed";
import RegionAdSlot, { RegionAdContent } from "@/components/RegionAdSlot";

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
  selectedReportId?: Id<"reports"> | null;
  onSelectReport?: (id: Id<"reports">) => void;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  feedAd?: RegionAdContent | null;
}

export default function MapWorkspace({
  reports,
  activeCategory,
  onCategoryChange,
  region,
  totalReports,
  selectedReportId,
  onSelectReport,
  viewMode: controlledViewMode,
  onViewModeChange,
  feedAd,
}: MapWorkspaceProps) {
  const [internalViewMode, setInternalViewMode] = useState<ViewMode>("map");
  const viewMode = controlledViewMode ?? internalViewMode;

  function setViewMode(mode: ViewMode) {
    if (onViewModeChange) onViewModeChange(mode);
    else setInternalViewMode(mode);
  }

  const filteredCount =
    activeCategory === "all"
      ? totalReports
      : reports.filter((r) => r.category === activeCategory).length;

  return (
    <section id="map" className="scroll-mt-[calc(3.5rem+var(--safe-top)+0.5rem)]">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-lg md:text-xl font-bold"
          style={{ fontFamily: "Merriweather, serif", color: "var(--navy)" }}
        >
          📍 Reports Near You
        </h2>
        <div className="segmented-control">
          <div
            className={`segmented-control-slider ${viewMode === "list" ? "segmented-control-slider-right" : ""}`}
          />
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

      <div
        className="sticky z-40 py-3 -mx-1 px-1 mb-4"
        style={{
          background: "var(--off-white)",
          top: "calc(3.5rem + var(--safe-top))",
        }}
      >
        <CategoryFilter active={activeCategory} onChange={onCategoryChange} />
      </div>

      {viewMode === "map" ? (
        <div key="map" className="animate-scale-in">
          <ReportMap
            reports={reports}
            activeCategory={activeCategory}
            region={region}
            selectedReportId={selectedReportId}
          />
        </div>
      ) : (
        <div key="list" className="animate-fadein">
          <div className="flex items-center justify-end mb-3">
            <span className="text-sm" style={{ color: "var(--gray-500)" }}>
              {filteredCount} report{filteredCount !== 1 ? "s" : ""}
            </span>
          </div>
          <ReportFeed
            reports={reports}
            activeCategory={activeCategory}
            onSelectReport={onSelectReport}
            feedAd={feedAd}
            regionName={region?.name}
          />
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
      className={`segmented-control-btn ${active ? "segmented-control-btn-active" : ""}`}
    >
      {icon} {label}
    </button>
  );
}
