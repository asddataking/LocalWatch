"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import CategoryFilter from "@/components/CategoryFilter";
import ReportFeed from "@/components/ReportFeed";
import AdBanner from "@/components/AdBanner";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import Link from "next/link";

const ReportMap = dynamic(() => import("@/components/ReportMap"), {
  ssr: false,
  loading: () => (
    <div
      className="map-container flex items-center justify-center"
      style={{ background: "var(--gray-100)" }}
    >
      <div className="text-center">
        <div className="text-4xl mb-2 animate-pulse">🗺️</div>
        <p className="text-sm font-semibold" style={{ color: "var(--gray-500)" }}>
          Loading map…
        </p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const reports = useQuery(api.reports.getReports) ?? [];

  const totalReports = reports.length;
  const uniqueLocations = new Set(reports.map((r) => r.locationText)).size;

  return (
    <>
      {/* Hero section */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 60%, #1a2d5a 100%)",
        }}
        className="text-white"
      >
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest"
                style={{ background: "var(--red)", color: "white" }}
              >
                🇺🇸 Free to use
              </span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-black mb-4 leading-tight"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              Know What&apos;s Happening{" "}
              <span style={{ color: "var(--gold)" }}>In Your Neighborhood.</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
              Community-powered neighborhood awareness. Submit and confirm local
              reports — no login required.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div>
                <div className="text-3xl font-black" style={{ color: "var(--gold)" }}>
                  {totalReports}
                </div>
                <div className="text-xs opacity-70 uppercase tracking-wide">Reports</div>
              </div>
              <div>
                <div className="text-3xl font-black" style={{ color: "var(--gold)" }}>
                  {uniqueLocations}
                </div>
                <div className="text-xs opacity-70 uppercase tracking-wide">Locations</div>
              </div>
              <div>
                <div className="text-3xl font-black" style={{ color: "var(--gold)" }}>
                  {reports.filter((r) => r.status === "Multiple Witnesses").length}
                </div>
                <div className="text-xs opacity-70 uppercase tracking-wide">Verified</div>
              </div>
            </div>

            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-lg no-underline"
              style={{ background: "var(--red)", color: "white" }}
            >
              + Report Something
            </Link>
          </div>
        </div>

        {/* Bottom wave */}
        <div style={{ background: "var(--off-white)", marginTop: "-1px" }}>
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            <path d="M0 48V24C240 0 480 0 720 24C960 48 1200 48 1440 24V48H0Z" fill="#0D1B3E" />
          </svg>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Category filter */}
        <div className="mb-6">
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        </div>

        {/* Top Ad Banner */}
        <AdBanner />

        {/* Map */}
        <div className="mb-8">
          <h2
            className="text-xl font-bold mb-3"
            style={{ fontFamily: "Merriweather, serif", color: "var(--navy)" }}
          >
            📍 Reports Near You
          </h2>
          <ReportMap reports={reports} activeCategory={activeCategory} />
        </div>

        {/* Middle Ad Banner */}
        <AdBanner />

        {/* Feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: "Merriweather, serif", color: "var(--navy)" }}
            >
              📋 Recent Reports
            </h2>
            <span className="text-sm" style={{ color: "var(--gray-500)" }}>
              {activeCategory === "all"
                ? `${totalReports} total`
                : `${reports.filter((r) => r.category === activeCategory).length} in this category`}
            </span>
          </div>
          <ReportFeed reports={reports} activeCategory={activeCategory} />
        </div>
      </div>

      <Footer />
    </>
  );
}
