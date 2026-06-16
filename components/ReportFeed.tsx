"use client";

import { Doc } from "@/convex/_generated/dataModel";
import ReportCard from "./ReportCard";
import SponsoredResource from "./SponsoredResource";

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
      {filtered.map((report, i) => {
        // Inject an ad every 5 reports based on the category of the preceding report
        const showAd = i > 0 && i % 5 === 0;
        
        return (
          <div key={report._id} className="contents">
            {showAd && (
              <div className="col-span-1 md:col-span-2 my-2">
                <SponsoredResource category={report.category} />
              </div>
            )}
            <ReportCard report={report} index={i} />
          </div>
        );
      })}
    </div>
  );
}
