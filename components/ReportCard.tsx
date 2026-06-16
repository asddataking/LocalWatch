"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { CATEGORY_ICONS } from "./CategoryFilter";

const CATEGORY_COLORS: Record<string, string> = {
  "Crime": "#C8102E",
  "Suspicious Activity": "#E07B00",
  "Missing Pet": "#7B2D8B",
  "Traffic": "#D4A200",
  "Hazard": "#D45500",
  "Weather": "#0077CC",
  "Scam Alert": "#009688",
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; icon: string }> = {
    "Community Reported": { cls: "status-reported", icon: "📢" },
    "Multiple Witnesses": { cls: "status-witnesses", icon: "👥" },
    "Needs Review": { cls: "status-review", icon: "🔍" },
  };
  const entry = map[status] ?? { cls: "status-reported", icon: "📢" };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${entry.cls}`}
    >
      {entry.icon} {status}
    </span>
  );
}

function PhotoDisplay({ storageId }: { storageId: Id<"_storage"> }) {
  const url = useQuery(api.reports.getPhotoUrl, { storageId });
  if (!url) return null;
  return (
    <img
      src={url}
      alt="Report photo"
      className="w-full h-40 object-cover rounded-lg mt-2"
    />
  );
}

interface ReportCardProps {
  report: Doc<"reports">;
  index?: number;
}

export default function ReportCard({ report, index = 0 }: ReportCardProps) {
  const confirm = useMutation(api.reports.confirmReport);
  const dispute = useMutation(api.reports.disputeReport);
  const color = CATEGORY_COLORS[report.category] ?? "#0D1B3E";
  const icon = CATEGORY_ICONS[report.category] ?? "📋";

  return (
    <div
      className="report-card bg-white rounded-xl shadow-sm border-l-4 p-5 animate-fadein"
      style={{
        borderLeftColor: color,
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{
              background: `${color}18`,
              color,
              border: `1px solid ${color}44`,
            }}
          >
            {icon} {report.category}
          </span>
          <StatusBadge status={report.status} />
        </div>
        <span className="text-xs" style={{ color: "var(--gray-500)" }}>
          {timeAgo(report.createdAt)}
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-lg font-bold mb-1 leading-snug"
        style={{ fontFamily: "Merriweather, serif", color: "var(--navy)" }}
      >
        {report.title}
      </h3>

      {/* Location */}
      <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: "var(--gray-500)" }}>
        📍 {report.locationText}
        {report.anonymous && (
          <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: "#F1F3F5", color: "#6C757D" }}>
            Anonymous
          </span>
        )}
      </p>

      {/* Description */}
      <p
        className="text-sm leading-relaxed line-clamp-3 mb-3"
        style={{ color: "var(--gray-700)" }}
      >
        {report.description}
      </p>

      {/* Photo */}
      {report.photoStorageId && (
        <PhotoDisplay storageId={report.photoStorageId} />
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3 mt-4 pt-3 border-t" style={{ borderColor: "var(--gray-200)" }}>
        <button
          onClick={() => confirm({ id: report._id })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{
            background: "#0D1B3E12",
            color: "var(--navy)",
            border: "1px solid #0D1B3E22",
          }}
          title="Confirm you witnessed this"
        >
          ✓ Confirm
          <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: "var(--navy)", color: "white" }}>
            {report.confirmations}
          </span>
        </button>
        <button
          onClick={() => dispute({ id: report._id })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{
            background: "#C8102E10",
            color: "var(--red)",
            border: "1px solid #C8102E22",
          }}
          title="Dispute this report"
        >
          ✗ Dispute
          <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: "var(--red)", color: "white" }}>
            {report.disputes}
          </span>
        </button>
      </div>
    </div>
  );
}
