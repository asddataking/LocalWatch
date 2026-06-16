"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site";

interface AreaChipsProps {
  currentRegionSlug?: string | null;
  activeTown?: string | null;
  onTownChange?: (town: string | null) => void;
}

export default function AreaChips({
  currentRegionSlug,
  activeTown,
  onTownChange,
}: AreaChipsProps) {
  const towns =
    currentRegionSlug && siteConfig.regionTowns[currentRegionSlug]
      ? siteConfig.regionTowns[currentRegionSlug]
      : [];

  return (
    <section className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <div>
        <h2
          className="text-sm font-bold uppercase tracking-widest mb-3"
          style={{ color: "var(--gray-500)" }}
        >
          Browse Your Area
        </h2>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {siteConfig.regions.map((region) => {
            const isActive = currentRegionSlug === region.slug;
            return (
              <Link
                key={region.slug}
                href={`/?region=${region.slug}`}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-150 hover:scale-105 no-underline whitespace-nowrap"
                style={{
                  background: isActive ? "var(--navy)" : "var(--white)",
                  color: isActive ? "white" : "var(--navy)",
                  borderColor: isActive ? "var(--navy)" : "var(--gray-300)",
                  boxShadow: isActive ? "0 2px 8px rgba(13,27,62,0.2)" : "none",
                }}
              >
                {region.name}
              </Link>
            );
          })}
        </div>
      </div>

      {towns.length > 0 && onTownChange && (
        <div>
          <h3
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "var(--gray-500)" }}
          >
            Neighborhoods
          </h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => onTownChange(null)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all"
              style={{
                background: !activeTown ? "var(--red)" : "white",
                color: !activeTown ? "white" : "var(--navy)",
                borderColor: !activeTown ? "var(--red)" : "var(--gray-300)",
              }}
            >
              All areas
            </button>
            {towns.map((town) => {
              const isActive = activeTown === town;
              return (
                <button
                  key={town}
                  type="button"
                  onClick={() => onTownChange(isActive ? null : town)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all hover:scale-105"
                  style={{
                    background: isActive ? "var(--navy)" : "white",
                    color: isActive ? "white" : "var(--navy)",
                    borderColor: isActive ? "var(--navy)" : "var(--gray-300)",
                  }}
                >
                  {town}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
