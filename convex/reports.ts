import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function computeStatus(confirmations: number, abuses: number): string {
  if (abuses >= 3) return "HIDDEN"; // Wait pending review
  if (confirmations >= 3) return "VERIFIED";
  return "UNVERIFIED";
}

export const getReportsByRegion = query({
  args: { regionId: v.optional(v.id("regions")), limit: v.optional(v.number()) },
  handler: async (ctx, { regionId, limit = 100 }) => {
    if (!regionId) return [];
    
    const all = await ctx.db
      .query("reports")
      .withIndex("by_region", (q) => q.eq("regionId", regionId))
      .order("desc")
      .take(limit);
      
    // Filter out spam or HIDDEN reports from public feed
    return all.filter((r) => r.isSpam !== true && r.status !== "HIDDEN");
  },
});

// For Admin Dashboard Live Feed
export const getAllReportsForAdmin = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 100 }) => {
    return await ctx.db
      .query("reports")
      .order("desc")
      .take(limit);
  },
});

export const createReport = mutation({
  args: {
    regionId: v.id("regions"),
    userId: v.id("users"),
    category: v.string(),
    title: v.string(),
    description: v.string(),
    locationText: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    photoStorageId: v.optional(v.id("_storage")),
    anonymous: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Increment user total reports
    const user = await ctx.db.get(args.userId);
    if (user) {
      await ctx.db.patch(args.userId, {
        totalReports: user.totalReports + 1,
        lastActiveAt: Date.now(),
      });
      
      // Update trust score logic
      if (user.totalReports >= 10 && user.trustScoreLevel === "New User") {
        await ctx.db.patch(args.userId, { trustScoreLevel: "Community Spotter" });
      } else if (user.totalReports >= 50 && user.trustScoreLevel === "Community Spotter") {
        await ctx.db.patch(args.userId, { trustScoreLevel: "Trusted Reporter" });
      }
    }

    return await ctx.db.insert("reports", {
      ...args,
      status: "UNVERIFIED",
      confirmations: 0,
      disputes: 0,
      abuseReports: 0,
      createdAt: Date.now(),
    });
  },
});

export const interactWithReport = mutation({
  args: { 
    reportId: v.id("reports"), 
    userId: v.id("users"),
    type: v.union(v.literal("confirm"), v.literal("abuse"))
  },
  handler: async (ctx, { reportId, userId, type }) => {
    // Prevent duplicate interaction
    const existing = await ctx.db
      .query("interactions")
      .withIndex("by_report_and_user", (q) => q.eq("reportId", reportId).eq("userId", userId))
      .first();

    if (existing) {
      if (existing.type === type) return; // Already did this
      // If changing from confirm to abuse, we'd handle decrementing, but keep it simple for V2:
      throw new Error("You have already interacted with this report.");
    }

    await ctx.db.insert("interactions", {
      type, reportId, userId, createdAt: Date.now()
    });

    await ctx.db.patch(userId, { lastActiveAt: Date.now() });

    const report = await ctx.db.get(reportId);
    if (!report) throw new Error("Report not found");

    const confirmations = type === "confirm" ? report.confirmations + 1 : report.confirmations;
    const currentAbuse = report.abuseReports ?? report.disputes ?? 0;
    const abuseReports = type === "abuse" ? currentAbuse + 1 : currentAbuse;
    
    const status = computeStatus(confirmations, abuseReports);
    await ctx.db.patch(reportId, { confirmations, abuseReports, status });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getPhotoUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});

export const deleteReport = mutation({
  args: { id: v.id("reports") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const updateReportStatus = mutation({
  args: { id: v.id("reports"), status: v.string() },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});
