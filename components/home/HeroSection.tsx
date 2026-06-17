"use client";

import Link from "next/link";
import { HomeStats } from "@/lib/homeStats";
import { siteConfig } from "@/lib/site";
import { useCountUp } from "@/hooks/useCountUp";

interface CommunityStats {
  communityMembers: number;
  activeToday: number;
}

interface HeroSectionProps {
  stats: HomeStats;
  communityStats?: CommunityStats | null;
  regionName?: string;
}

export default function HeroSection({ stats, communityStats, regionName }: HeroSectionProps) {
  const headlineRegion = regionName ? `In ${regionName}` : "In Your Community";

  function scrollToMap() {
    document.getElementById("map")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="hero-section relative text-white overflow-hidden">
      {/* Background layers */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${siteConfig.ogImage}')` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, rgba(8, 18, 40, 0.88) 0%, rgba(13, 27, 62, 0.82) 50%, rgba(26, 45, 90, 0.85) 100%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, var(--gold) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, var(--red) 0%, transparent 40%)`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-8 md:py-16">
        <div className="grid md:grid-cols-5 gap-6 md:gap-8 items-start">
          <div className="md:col-span-3">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 animate-fadein"
              style={{ background: "var(--red)", color: "white" }}
            >
              🇺🇸 Free Community Tool
            </span>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-tight animate-fadein stagger-1"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              Know What&apos;s Happening{" "}
              <span style={{ color: "var(--gold)" }}>{headlineRegion}</span>
            </h1>

            <p className="text-base md:text-xl mb-6 md:mb-8 opacity-90 leading-relaxed max-w-xl animate-fadein stagger-2">
              Real-time local awareness powered by neighbors like you. Report what you see,
              confirm what others share — no login required.
            </p>

            {/* Stats bar */}
            <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-4 sm:gap-6 md:gap-10 mb-6 md:mb-8 animate-fadein stagger-3">
              <StatItem value={stats.totalReports} label="Total Reports" />
              <StatItem value={stats.uniqueLocations} label="Locations" />
              <StatItem value={stats.verifiedCount} label="Verified" />
              {stats.reportsToday > 0 && (
                <StatItem value={stats.reportsToday} label="Today" accent />
              )}
              {communityStats && communityStats.communityMembers > 0 && (
                <StatItem value={communityStats.communityMembers} label="Community Members" />
              )}
              {communityStats && communityStats.activeToday > 0 && (
                <StatItem value={communityStats.activeToday} label="Active Today" accent />
              )}
            </div>

            {/* Dual CTAs — hidden on mobile (bottom nav handles report) */}
            <div className="hidden md:flex flex-wrap gap-4 animate-fadein stagger-4">
              <Link
                href="/submit"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-lg no-underline"
                style={{ background: "var(--red)", color: "white" }}
              >
                + Report Something
              </Link>
              <button
                type="button"
                onClick={scrollToMap}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 active:scale-95 border-2 cursor-pointer"
                style={{
                  borderColor: "var(--gold)",
                  color: "var(--gold)",
                  background: "transparent",
                }}
              >
                View Map
              </button>
            </div>

            {/* Mobile-only quick action */}
            <button
              type="button"
              onClick={scrollToMap}
              className="md:hidden w-full py-3.5 rounded-xl text-base font-bold border-2 cursor-pointer transition-all active:scale-[0.98] animate-fadein stagger-4"
              style={{
                borderColor: "var(--gold)",
                color: "var(--gold)",
                background: "rgba(245, 166, 35, 0.1)",
              }}
            >
              🗺️ View Map & Reports
            </button>
          </div>

          {/* Scanner alert education card */}
          <div className="md:col-span-2 animate-fadein stagger-5">
            <div
              className="rounded-xl p-4 md:p-5 border"
              style={{
                background: "rgba(255,255,255,0.08)",
                borderColor: "rgba(245, 166, 35, 0.35)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">📡</span>
                <h3
                  className="text-sm font-bold uppercase tracking-wide"
                  style={{ color: "var(--gold)" }}
                >
                  Community Scanner
                </h3>
              </div>
              <p className="text-sm leading-relaxed opacity-90">
                LocalWatch works like a neighborhood scanner — neighbors report what they
                see, others confirm or flag issues. The more confirmations, the more trusted
                a report becomes. Always report what you observed, not accusations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="relative" style={{ background: "var(--off-white)", marginTop: "-1px" }}>
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
          <path d="M0 48V24C240 0 480 0 720 24C960 48 1200 48 1440 24V48H0Z" fill="#081228" opacity="0.15" />
          <path d="M0 48V32C360 8 720 8 1080 32C1260 44 1380 48 1440 48V48H0Z" fill="var(--off-white)" />
        </svg>
      </div>
    </section>
  );
}

function StatItem({
  value,
  label,
  accent,
}: {
  value: number;
  label: string;
  accent?: boolean;
}) {
  const display = useCountUp(value);

  return (
    <div>
      <div
        className="text-2xl sm:text-3xl font-black tabular-nums"
        style={{ color: accent ? "var(--red-light)" : "var(--gold)" }}
      >
        {display}
      </div>
      <div className="text-[10px] sm:text-xs opacity-70 uppercase tracking-wide leading-tight">
        {label}
      </div>
    </div>
  );
}
