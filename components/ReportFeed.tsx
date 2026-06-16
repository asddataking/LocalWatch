"use client";

import { Doc } from "@/convex/_generated/dataModel";
import ReportCard from "./ReportCard";

interface ReportFeedProps {
  reports: Doc<"reports">[];
  activeCategory: string;
}

export default function ReportFeed({ reports, activeCategory }: ReportFeedProps) {
  const filtered =
    activeCategory === "all"
      ? reports
      : reports.filter((r) => r.category === activeCategory);

  if (filtered.length === 0) {
    return (
      <div
        className="text-center py-16 rounded-2xl"
        style={{ background: "var(--gray-100)", color: "var(--gray-500)" }}
      >
        <div className="text-5xl mb-3">🔭</div>
        <p className="text-lg font-semibold" style={{ fontFamily: "Merriweather, serif", color: "var(--navy)" }}>
          No reports yet
        </p>
        <p className="text-sm mt-1">
          {activeCategory === "all"
            ? "Be the first to report something in your neighborhood."
            : `No ${activeCategory} reports yet.`}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filtered.map((report, i) => (
        <ReportCard key={report._id} report={report} index={i} />
      ))}
    </div>
  );
}
