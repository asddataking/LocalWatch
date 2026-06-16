"use client";

import Link from "next/link";
import { HomeStats } from "@/lib/homeStats";

interface HeroSectionProps {
  stats: HomeStats;
  regionName?: string;
}

export default function HeroSection({ stats, regionName }: HeroSectionProps) {
  const headlineRegion = regionName ? `In ${regionName}` : "In Your Community";

  function scrollToMap() {
    document.getElementById("map")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="hero-section relative text-white overflow-hidden">
      {/* Background layers */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, rgba(8, 18, 40, 0.92) 0%, rgba(13, 27, 62, 0.85) 50%, rgba(26, 45, 90, 0.88) 100%),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(245, 166, 35, 0.03) 10px,
              rgba(245, 166, 35, 0.03) 20px
            )
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

      <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-3">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4"
              style={{ background: "var(--red)", color: "white" }}
            >
              🇺🇸 Free Community Tool
            </span>

            <h1
              className="text-4xl md:text-5xl font-black mb-4 leading-tight"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              Know What&apos;s Happening{" "}
              <span style={{ color: "var(--gold)" }}>{headlineRegion}</span>
            </h1>

            <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed max-w-xl">
              Real-time local awareness powered by neighbors like you. Report what you see,
              confirm what others share — no login required.
            </p>

            {/* Stats bar */}
            <div className="flex flex-wrap gap-6 md:gap-10 mb-8">
              <StatItem value={stats.totalReports} label="Total Reports" />
              <StatItem value={stats.uniqueLocations} label="Locations" />
              <StatItem value={stats.verifiedCount} label="Verified" />
              {stats.reportsToday > 0 && (
                <StatItem value={stats.reportsToday} label="Today" accent />
              )}
            </div>

            {/* Dual CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-lg no-underline"
                style={{ background: "var(--red)", color: "white" }}
              >
                + Report Something
              </Link>
              <button
                type="button"
                onClick={scrollToMap}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 active:scale-95 border-2 cursor-pointer"
                style={{
                  borderColor: "var(--gold)",
                  color: "var(--gold)",
                  background: "transparent",
                }}
              >
                View Map
              </button>
            </div>
          </div>

          {/* Scanner alert education card */}
          <div className="md:col-span-2">
            <div
              className="rounded-xl p-5 border"
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
  return (
    <div>
      <div
        className="text-3xl font-black tabular-nums"
        style={{ color: accent ? "var(--red-light)" : "var(--gold)" }}
      >
        {value}
      </div>
      <div className="text-xs opacity-70 uppercase tracking-wide">{label}</div>
    </div>
  );
}
