"use client";

import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";
import { CATEGORY_ICONS } from "@/components/CategoryFilter";
import { getTrendingCategories } from "@/lib/homeStats";
import RegionAdSlot, { RegionAdContent } from "@/components/RegionAdSlot";

interface HomeSidebarProps {
  reports: Doc<"reports">[];
  sidebarAd?: RegionAdContent | null;
  regionName?: string;
}

const WHY_ITEMS = [
  {
    icon: "👁️",
    title: "See It First",
    text: "Know about traffic, safety, and community events before they hit the news.",
  },
  {
    icon: "🤝",
    title: "Confirm Together",
    text: "Multiple neighbors confirming a report builds trust in what you see.",
  },
  {
    icon: "🔒",
    title: "Stay Anonymous",
    text: "Report without an account. Your privacy comes first.",
  },
] as const;

export default function HomeSidebar({ reports, sidebarAd, regionName }: HomeSidebarProps) {
  const trending = getTrendingCategories(reports);

  return (
    <aside className="space-y-6">
      {/* Trending Today */}
      <div
        className="rounded-xl p-5 shadow-sm border"
        style={{ background: "var(--white)", borderColor: "var(--gray-200)" }}
      >
        <h3
          className="text-lg font-bold mb-4 flex items-center gap-2"
          style={{ fontFamily: "Merriweather, serif", color: "var(--navy)" }}
        >
          🔥 Trending Today
        </h3>
        {trending.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--gray-500)" }}>
            No reports in the last 24 hours yet. Be the first to share what&apos;s happening.
          </p>
        ) : (
          <ul className="space-y-3">
            {trending.map((item) => (
              <li key={item.category} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg flex-shrink-0">
                    {CATEGORY_ICONS[item.category] ?? "📋"}
                  </span>
                  <span
                    className="text-sm font-semibold truncate"
                    style={{ color: "var(--navy)" }}
                  >
                    {item.category}
                  </span>
                </div>
                <span
                  className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--gray-100)", color: "var(--gray-700)" }}
                >
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <RegionAdSlot
        ad={sidebarAd ?? null}
        regionName={regionName}
        placement="sidebar"
        compact
      />

      {/* Why LocalWatch */}
      <div
        className="rounded-xl p-5 shadow-sm border"
        style={{ background: "var(--white)", borderColor: "var(--gray-200)" }}
      >
        <h3
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "Merriweather, serif", color: "var(--navy)" }}
        >
          Why LocalWatch?
        </h3>
        <div className="space-y-4">
          {WHY_ITEMS.map((item) => (
            <div key={item.title} className="flex gap-3">
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: "var(--gray-100)" }}
              >
                {item.icon}
              </span>
              <div>
                <h4 className="text-sm font-bold" style={{ color: "var(--navy)" }}>
                  {item.title}
                </h4>
                <p className="text-xs leading-relaxed mt-0.5" style={{ color: "var(--gray-500)" }}>
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick submit CTA (desktop sidebar) */}
      <Link
        href="/submit"
        className="hidden lg:flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 no-underline shadow-md"
        style={{ background: "var(--red)", color: "white" }}
      >
        + Report Something
      </Link>
    </aside>
  );
}
