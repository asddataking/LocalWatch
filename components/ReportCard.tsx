"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "./CategoryFilter";
import { getStatusDisplay } from "@/app/utils/reportStatus";
import { useLocalWatchUser } from "@/hooks/useLocalWatchUser";

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
  const { label, cls, icon } = getStatusDisplay(status);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}
    >
      {icon} {label}
    </span>
  );
}

function PhotoThumbnail({
  storageId,
  className = "",
}: {
  storageId: Id<"_storage">;
  className?: string;
}) {
  const url = useQuery(api.reports.getPhotoUrl, { storageId });
  if (!url) {
    return (
      <div
        className={`bg-gray-100 animate-pulse ${className}`}
        style={{ background: "var(--gray-100)" }}
      />
    );
  }
  return (
    <img
      src={url}
      alt="Report photo"
      className={`object-cover ${className}`}
    />
  );
}

interface ReportCardProps {
  report: Doc<"reports">;
  index?: number;
  variant?: "default" | "compact";
}

export default function ReportCard({
  report,
  index = 0,
  variant = "default",
}: ReportCardProps) {
  const interact = useMutation(api.reports.interactWithReport);
  const { user, ready } = useLocalWatchUser();
  const [interacting, setInteracting] = useState(false);
  const [interactionError, setInteractionError] = useState("");

  const color = CATEGORY_COLORS[report.category] ?? "#0D1B3E";
  const icon = CATEGORY_ICONS[report.category] ?? "📋";
  const abuseCount = report.abuseReports ?? report.disputes ?? 0;
  const hasPhoto = !!report.photoStorageId;

  async function handleInteraction(type: "confirm" | "abuse") {
    if (!user || !ready || interacting) return;

    setInteracting(true);
    setInteractionError("");

    try {
      await interact({
        reportId: report._id,
        userId: user._id,
        type,
      });
    } catch (err) {
      setInteractionError(
        err instanceof Error ? err.message : "Could not submit interaction"
      );
    } finally {
      setInteracting(false);
    }
  }

  if (variant === "compact") {
    return (
      <div
        className="report-card bg-white rounded-xl shadow-sm border overflow-hidden animate-fadein h-full flex flex-col"
        style={{
          borderColor: "var(--gray-200)",
          animationDelay: `${index * 60}ms`,
        }}
      >
        {hasPhoto && (
          <div className="relative h-36 w-full">
            <PhotoThumbnail
              storageId={report.photoStorageId!}
              className="w-full h-full"
            />
            <div
              className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: `${color}ee`, color: "white" }}
            >
              {icon} {report.category}
            </div>
          </div>
        )}

        <div className="p-4 flex flex-col flex-1">
          {!hasPhoto && (
            <span
              className="inline-flex self-start items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold mb-2"
              style={{ background: `${color}18`, color, border: `1px solid ${color}44` }}
            >
              {icon} {report.category}
            </span>
          )}

          <h3
            className="text-base font-bold mb-1 leading-snug line-clamp-2"
            style={{ fontFamily: "Merriweather, serif", color: "var(--navy)" }}
          >
            {report.title}
          </h3>

          <p className="text-xs font-semibold mb-2 truncate" style={{ color: "var(--gray-500)" }}>
            📍 {report.locationText}
          </p>

          <p className="text-sm leading-relaxed line-clamp-2 mb-3 flex-1" style={{ color: "var(--gray-700)" }}>
            {report.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-2 border-t" style={{ borderColor: "var(--gray-200)" }}>
            <StatusBadge status={report.status} />
            <span className="text-xs" style={{ color: "var(--gray-500)" }}>
              {timeAgo(report.createdAt)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="report-card bg-white rounded-xl shadow-sm border-l-4 overflow-hidden animate-fadein"
      style={{
        borderLeftColor: color,
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Photo hero when available */}
      {hasPhoto && (
        <div className="relative h-44 w-full">
          <PhotoThumbnail
            storageId={report.photoStorageId!}
            className="w-full h-full"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(13,27,62,0.6) 0%, transparent 50%)",
            }}
          />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: "rgba(255,255,255,0.95)", color }}
            >
              {icon} {report.category}
            </span>
            <StatusBadge status={report.status} />
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Header row (when no photo) */}
        {!hasPhoto && (
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
        )}

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

        {/* Timestamp when photo present */}
        {hasPhoto && (
          <p className="text-xs mb-3" style={{ color: "var(--gray-500)" }}>
            {timeAgo(report.createdAt)}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t" style={{ borderColor: "var(--gray-200)" }}>
          <button
            onClick={() => handleInteraction("confirm")}
            disabled={interacting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
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
            onClick={() => handleInteraction("abuse")}
            disabled={interacting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            style={{
              background: "#C8102E10",
              color: "var(--red)",
              border: "1px solid #C8102E22",
            }}
            title="Report this as inaccurate or abusive"
          >
            ✗ Report Abuse
            <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: "var(--red)", color: "white" }}>
              {abuseCount}
            </span>
          </button>
        </div>
        {interactionError && (
          <p className="text-xs mt-2" style={{ color: "var(--red)" }}>
            {interactionError}
          </p>
        )}
      </div>
    </div>
  );
}
