import { mutation } from "./_generated/server";

export const seedV2Data = mutation({
  args: {},
  handler: async (ctx) => {
    const existingRegions = await ctx.db.query("regions").collect();
    if (existingRegions.length > 0) {
      return { message: "Regions already seeded, skipping." };
    }

    const regions = [
      {
        name: "Blue Water Area",
        slug: "blue-water-area",
        minLat: 42.8, maxLat: 43.3,
        minLng: -82.7, maxLng: -82.4,
      },
      {
        name: "Metro Detroit",
        slug: "metro-detroit",
        minLat: 42.1, maxLat: 42.8,
        minLng: -83.6, maxLng: -82.8,
      },
      {
        name: "North Atlanta",
        slug: "north-atlanta",
        minLat: 33.9, maxLat: 34.2,
        minLng: -84.5, maxLng: -84.1,
      },
      {
        name: "Tampa Bay",
        slug: "tampa-bay",
        minLat: 27.6, maxLat: 28.2,
        minLng: -82.8, maxLng: -82.2,
      }
    ];

    for (const r of regions) {
      await ctx.db.insert("regions", r);
    }
    
    return { message: `Seeded ${regions.length} regions successfully.` };
  },
});
