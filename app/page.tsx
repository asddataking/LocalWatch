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
import RegionAdSlot from "@/components/RegionAdSlot";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { computeHomeStats, filterReportsByTown } from "@/lib/homeStats";
import { Id } from "@/convex/_generated/dataModel";

function HomeContent() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTown, setActiveTown] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<Id<"reports"> | null>(null);
  const [mapViewMode, setMapViewMode] = useState<"map" | "list">("map");
  const searchParams = useSearchParams();
  const currentRegionSlug = searchParams.get("region");

  const region = useQuery(
    api.regions.getRegionBySlug,
    currentRegionSlug ? { slug: currentRegionSlug } : "skip"
  );
  const reports =
    useQuery(api.reports.getReportsByRegion, region ? { regionId: region._id } : "skip") ?? [];
  const communityStats = useQuery(api.admin.getPublicCommunityStats);
  const regionAds = useQuery(
    api.ads.getAdsForRegion,
    region ? { regionId: region._id } : "skip"
  );

  const filteredReports = filterReportsByTown(reports, activeTown);
  const stats = computeHomeStats(filteredReports);

  function handleSelectReport(id: Id<"reports">) {
    setSelectedReportId(id);
    setMapViewMode("map");
    document.getElementById("map")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <LocationDetector />
      <HeroSection stats={stats} communityStats={communityStats} regionName={region?.name} />
      <TrustBar />
      <AreaChips
        currentRegionSlug={currentRegionSlug}
        activeTown={activeTown}
        onTownChange={setActiveTown}
      />

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <RegionAdSlot
          ad={regionAds?.banner ?? null}
          regionName={region?.name}
          placement="banner"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 min-w-0">
            <MapWorkspace
              reports={filteredReports}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              region={region}
              totalReports={stats.totalReports}
              selectedReportId={selectedReportId}
              onSelectReport={handleSelectReport}
              viewMode={mapViewMode}
              onViewModeChange={setMapViewMode}
              feedAd={regionAds?.feed ?? null}
            />
            <ReportStrip
              reports={filteredReports}
              activeCategory={activeCategory}
              onSelectReport={handleSelectReport}
            />
          </div>
          <div className="lg:col-span-1">
            <HomeSidebar
              reports={filteredReports}
              sidebarAd={regionAds?.sidebar ?? null}
              regionName={region?.name}
            />
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
