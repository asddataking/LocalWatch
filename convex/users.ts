import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";

type DbCtx = QueryCtx | MutationCtx;

async function findByFingerprint(ctx: DbCtx, fingerprintId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_fingerprint", (q) => q.eq("fingerprintId", fingerprintId))
    .first();
}

async function findByClerkId(ctx: DbCtx, clerkId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk", (q) => q.eq("clerkId", clerkId))
    .first();
}


async function createAnonymousUser(
  ctx: MutationCtx,
  fingerprintId: string
): Promise<Doc<"users">> {
  const userId = await ctx.db.insert("users", {
    fingerprintId,
    role: "user",
    trustScoreLevel: "New User",
    totalReports: 0,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
  });
  const user = await ctx.db.get(userId);
  if (!user) throw new Error("Failed to create user");
  return user;
}

export const ensureUser = mutation({
  args: { fingerprintId: v.string() },
  handler: async (ctx, { fingerprintId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity) {
      const clerkId = identity.subject;
      const displayName = identity.name ?? identity.nickname ?? undefined;
      const email = identity.email ?? undefined;

      const byClerk = await findByClerkId(ctx, clerkId);
      if (byClerk) {
        await ctx.db.patch(byClerk._id, {
          displayName: displayName ?? byClerk.displayName,
          email: email ?? byClerk.email,
          lastActiveAt: Date.now(),
        });
        return (await ctx.db.get(byClerk._id))!;
      }

      const byFingerprint = await findByFingerprint(ctx, fingerprintId);
      if (byFingerprint) {
        await ctx.db.patch(byFingerprint._id, {
          clerkId,
          displayName: displayName ?? byFingerprint.displayName,
          email: email ?? byFingerprint.email,
          trustScoreLevel:
            byFingerprint.trustScoreLevel === "New User"
              ? "Community Member"
              : byFingerprint.trustScoreLevel,
          lastActiveAt: Date.now(),
        });
        return (await ctx.db.get(byFingerprint._id))!;
      }

      const userId = await ctx.db.insert("users", {
        fingerprintId,
        clerkId,
        displayName,
        email,
        role: "user",
        trustScoreLevel: "Community Member",
        totalReports: 0,
        createdAt: Date.now(),
        lastActiveAt: Date.now(),
      });
      const user = await ctx.db.get(userId);
      if (!user) throw new Error("Failed to create user");
      return user;
    }

    const existing = await findByFingerprint(ctx, fingerprintId);
    if (existing) {
      await ctx.db.patch(existing._id, { lastActiveAt: Date.now() });
      return (await ctx.db.get(existing._id))!;
    }
    return await createAnonymousUser(ctx, fingerprintId);
  },
});

/** @deprecated Use ensureUser — kept for compatibility */
export const getOrCreateUser = ensureUser;

export const getUser = query({
  args: { fingerprintId: v.string() },
  handler: async (ctx, { fingerprintId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const byClerk = await findByClerkId(ctx, identity.subject);
      if (byClerk) return byClerk;
    }
    return await findByFingerprint(ctx, fingerprintId);
  },
});
