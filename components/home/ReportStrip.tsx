"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import ReportCard from "@/components/ReportCard";
import { getLatestReports } from "@/lib/homeStats";

interface ReportStripProps {
  reports: Doc<"reports">[];
  activeCategory: string;
  onSelectReport?: (id: Id<"reports">) => void;
}

export default function ReportStrip({ reports, activeCategory, onSelectReport }: ReportStripProps) {
  const filtered =
    activeCategory === "all"
      ? reports
      : reports.filter((r) => r.category === activeCategory);

  const latest = getLatestReports(filtered, 8);

  if (latest.length === 0) return null;

  return (
    <section className="mt-8">
      <h2
        className="text-lg font-bold mb-4"
        style={{ fontFamily: "Merriweather, serif", color: "var(--navy)" }}
      >
        Latest Reports
      </h2>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
        {latest.map((report, i) => (
          <div key={report._id} className="flex-shrink-0 w-72 md:w-80">
            <ReportCard
              report={report}
              index={i}
              variant="compact"
              onSelect={onSelectReport}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
