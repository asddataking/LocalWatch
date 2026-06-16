import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function computeStatus(confirmations: number, disputes: number): string {
  if (disputes >= 5) return "Needs Review";
  if (confirmations >= 3) return "Multiple Witnesses";
  return "Community Reported";
}

export const getReports = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db
      .query("reports")
      .order("desc")
      .collect();
    return all.filter((r) => r.isSpam !== true);
  },
});

export const createReport = mutation({
  args: {
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
    return await ctx.db.insert("reports", {
      ...args,
      status: "Community Reported",
      confirmations: 0,
      disputes: 0,
      createdAt: Date.now(),
    });
  },
});

export const confirmReport = mutation({
  args: { id: v.id("reports") },
  handler: async (ctx, { id }) => {
    const report = await ctx.db.get(id);
    if (!report) throw new Error("Report not found");
    const confirmations = report.confirmations + 1;
    const status = computeStatus(confirmations, report.disputes);
    await ctx.db.patch(id, { confirmations, status });
  },
});

export const disputeReport = mutation({
  args: { id: v.id("reports") },
  handler: async (ctx, { id }) => {
    const report = await ctx.db.get(id);
    if (!report) throw new Error("Report not found");
    const disputes = report.disputes + 1;
    const status = computeStatus(report.confirmations, disputes);
    await ctx.db.patch(id, { disputes, status });
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
