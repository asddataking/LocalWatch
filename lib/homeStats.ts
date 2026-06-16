import { Doc } from "@/convex/_generated/dataModel";
import { isVerifiedStatus } from "@/app/utils/reportStatus";

const MS_IN_24H = 24 * 60 * 60 * 1000;

export interface HomeStats {
  totalReports: number;
  uniqueLocations: number;
  verifiedCount: number;
  reportsToday: number;
}

export function computeHomeStats(reports: Doc<"reports">[]): HomeStats {
  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  return {
    totalReports: reports.length,
    uniqueLocations: new Set(reports.map((r) => r.locationText)).size,
    verifiedCount: reports.filter((r) => isVerifiedStatus(r.status)).length,
    reportsToday: reports.filter((r) => r.createdAt >= todayStart.getTime()).length,
  };
}

export interface TrendingCategory {
  category: string;
  count: number;
}

export function getTrendingCategories(
  reports: Doc<"reports">[],
  limit = 5
): TrendingCategory[] {
  const now = Date.now();
  const cutoff = now - MS_IN_24H;
  const recent = reports.filter((r) => r.createdAt >= cutoff);

  const counts = new Map<string, number>();
  for (const report of recent) {
    counts.set(report.category, (counts.get(report.category) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getLatestReports(
  reports: Doc<"reports">[],
  limit = 10
): Doc<"reports">[] {
  return [...reports]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
}

export function filterReportsByTown(
  reports: Doc<"reports">[],
  town: string | null
): Doc<"reports">[] {
  if (!town) return reports;
  const needle = town.toLowerCase();
  return reports.filter((r) => r.locationText.toLowerCase().includes(needle));
}
