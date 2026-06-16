import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAdsForRegion = query({
  args: { regionId: v.optional(v.id("regions")) },
  handler: async (ctx, { regionId }) => {
    if (!regionId) {
      return { banner: null, sidebar: null, feed: null };
    }

    const ads = await ctx.db
      .query("regionAds")
      .withIndex("by_region", (q) => q.eq("regionId", regionId))
      .collect();

    const active = ads.filter((ad) => ad.active);
    const byPlacement = (placement: string) =>
      active.find((ad) => ad.placement === placement) ?? null;

    return {
      banner: byPlacement("banner"),
      sidebar: byPlacement("sidebar"),
      feed: byPlacement("feed"),
    };
  },
});

export const getRegionAdByPlacement = query({
  args: {
    regionId: v.id("regions"),
    placement: v.string(),
  },
  handler: async (ctx, { regionId, placement }) => {
    return await ctx.db
      .query("regionAds")
      .withIndex("by_region_placement", (q) =>
        q.eq("regionId", regionId).eq("placement", placement)
      )
      .first();
  },
});

export const getRegionAdInventory = query({
  args: {},
  handler: async (ctx) => {
    const [regions, ads] = await Promise.all([
      ctx.db.query("regions").collect(),
      ctx.db.query("regionAds").collect(),
    ]);

    return regions.map((region) => {
      const regionAds = ads.filter((ad) => ad.regionId === region._id);
      const placements = ["banner", "sidebar", "feed"] as const;
      return {
        regionId: region._id,
        regionName: region.name,
        regionSlug: region.slug,
        slots: placements.map((placement) => {
          const ad = regionAds.find((a) => a.placement === placement);
          return {
            placement,
            filled: !!ad?.active,
            sponsorName: ad?.sponsorName ?? null,
            title: ad?.title ?? null,
          };
        }),
      };
    });
  },
});

export const upsertRegionAd = mutation({
  args: {
    regionId: v.id("regions"),
    placement: v.string(),
    sponsorName: v.string(),
    title: v.string(),
    description: v.string(),
    ctaLabel: v.string(),
    ctaUrl: v.optional(v.string()),
    icon: v.optional(v.string()),
    accentColor: v.optional(v.string()),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("regionAds")
      .withIndex("by_region_placement", (q) =>
        q.eq("regionId", args.regionId).eq("placement", args.placement)
      )
      .first();

    const payload = { ...args, updatedAt: Date.now() };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return await ctx.db.insert("regionAds", payload);
  },
});

export const deactivateRegionAd = mutation({
  args: { id: v.id("regionAds") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { active: false, updatedAt: Date.now() });
  },
});
