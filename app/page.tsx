"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Footer from "@/components/Footer";
import LocationDetector from "@/components/LocationDetector";
import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import AreaChips from "@/components/home/AreaChips";
import MapWorkspace from "@/components/home/MapWorkspace";
import HomeSidebar from "@/components/home/HomeSidebar";
import ReportStrip from "@/components/home/ReportStrip";
import MobileReportFab from "@/components/home/MobileReportFab";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { computeHomeStats } from "@/lib/homeStats";

function HomeContent() {
  const [activeCategory, setActiveCategory] = useState("all");
  const searchParams = useSearchParams();
  const currentRegionSlug = searchParams.get("region");

  const region = useQuery(
    api.regions.getRegionBySlug,
    currentRegionSlug ? { slug: currentRegionSlug } : "skip"
  );
  const reports =
    useQuery(api.reports.getReportsByRegion, region ? { regionId: region._id } : "skip") ?? [];

  const stats = computeHomeStats(reports);

  return (
    <>
      <LocationDetector />
      <HeroSection stats={stats} regionName={region?.name} />
      <TrustBar />
      <AreaChips currentRegionSlug={currentRegionSlug} />

      {/* Map-primary layout: 2/3 map + 1/3 sidebar on desktop */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 min-w-0">
            <MapWorkspace
              reports={reports}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              region={region}
              totalReports={stats.totalReports}
            />
            <ReportStrip reports={reports} activeCategory={activeCategory} />
          </div>
          <div className="lg:col-span-1">
            <HomeSidebar reports={reports} />
          </div>
        </div>
      </div>

      <Footer />
      <MobileReportFab />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading LocalWatch...</div>}>
      <HomeContent />
    </Suspense>
  );
}
