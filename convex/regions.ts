import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getRegions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("regions").collect();
  },
});

export const getRegionBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("regions")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

// A basic helper to find the nearest region by bounding box center
export const findNearestRegion = query({
  args: { lat: v.number(), lng: v.number() },
  handler: async (ctx, { lat, lng }) => {
    const regions = await ctx.db.query("regions").collect();
    if (regions.length === 0) return null;

    let closestRegion = regions[0];
    let minDistance = Infinity;

    for (const region of regions) {
      const centerLat = (region.minLat + region.maxLat) / 2;
      const centerLng = (region.minLng + region.maxLng) / 2;
      
      // Simple Pythagorean distance since this is just an approximation for assignment
      const distance = Math.pow(lat - centerLat, 2) + Math.pow(lng - centerLng, 2);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestRegion = region;
      }
    }
    return closestRegion;
  },
});
