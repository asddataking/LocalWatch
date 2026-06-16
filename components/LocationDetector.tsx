"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useSearchParams } from "next/navigation";
import { getFingerprintId } from "@/app/utils/fingerprint";

export default function LocationDetector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRegionParam = searchParams.get("region");
  
  const findNearestRegion = useQuery(api.regions.findNearestRegion, 
    // We only call this if we got coords
    "skip" as any 
  ); // We'll fetch it differently or just rely on a manual effect since hooks can't be conditional easily.

  // Actually, we can use the convex client directly or a mutation if we need imperative fetching. 
  // But wait, Convex gives us a useQuery that we can pass args to. Let's make it simpler: use local state for coords.
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  
  const nearestRegion = useQuery(api.regions.findNearestRegion, coords ? { lat: coords.lat, lng: coords.lng } : "skip");
  
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  useEffect(() => {
    // 1. Ensure user exists (invisible login)
    const fingerprintId = getFingerprintId();
    if (fingerprintId) {
      getOrCreateUser({ fingerprintId }).catch(console.error);
    }

    // 2. Location logic
    if (currentRegionParam) {
      // User explicitly requested a region, save it as their preference
      localStorage.setItem("localwatch_region", currentRegionParam);
      return; // Already in a region
    }

    const savedRegion = localStorage.getItem("localwatch_region");
    if (savedRegion) {
      router.replace(`/?region=${savedRegion}`);
      return;
    }

    // No region? Ask for location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Location permission denied or failed. Defaulting to metro-detroit.");
          localStorage.setItem("localwatch_region", "metro-detroit");
          router.replace(`/?region=metro-detroit`);
        }
      );
    } else {
      router.replace(`/?region=metro-detroit`);
    }
  }, [currentRegionParam, router, getOrCreateUser]);

  useEffect(() => {
    if (nearestRegion) {
      localStorage.setItem("localwatch_region", nearestRegion.slug);
      router.replace(`/?region=${nearestRegion.slug}`);
    }
  }, [nearestRegion, router]);

  if (!currentRegionParam) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4 animate-bounce">📍</div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: "Merriweather, serif", color: "var(--navy)" }}>Finding your neighborhood...</h2>
        <p className="text-gray-500 mt-2 text-center max-w-sm">We use your location once to connect you with the nearest LocalWatch community.</p>
      </div>
    );
  }

  return null;
}
