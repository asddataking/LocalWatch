import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getOrCreateUser = mutation({
  args: { fingerprintId: v.string() },
  handler: async (ctx, { fingerprintId }) => {
    let user = await ctx.db
      .query("users")
      .withIndex("by_fingerprint", (q) => q.eq("fingerprintId", fingerprintId))
      .first();

    if (!user) {
      const userId = await ctx.db.insert("users", {
        fingerprintId,
        role: "user",
        trustScoreLevel: "New User",
        totalReports: 0,
        createdAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    }
    return user;
  },
});

export const getUser = query({
  args: { fingerprintId: v.string() },
  handler: async (ctx, { fingerprintId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_fingerprint", (q) => q.eq("fingerprintId", fingerprintId))
      .first();
  },
});
