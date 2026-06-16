import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  regions: defineTable({
    name: v.string(),
    slug: v.string(), // e.g., 'metro-detroit'
    minLat: v.number(),
    maxLat: v.number(),
    minLng: v.number(),
    maxLng: v.number(),
  }).index("by_slug", ["slug"]),

  users: defineTable({
    fingerprintId: v.string(), // Anonymous device ID
    role: v.string(), // 'user' or 'admin'
    trustScoreLevel: v.string(), // 'New User', 'Community Spotter', 'Trusted Reporter', 'Verified Contributor'
    totalReports: v.number(),
    createdAt: v.number(),
  }).index("by_fingerprint", ["fingerprintId"]),

  reports: defineTable({
    regionId: v.optional(v.id("regions")),
    userId: v.optional(v.id("users")),
    category: v.string(),
    title: v.string(),
    description: v.string(), // Max 200 chars handled on frontend
    locationText: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    photoStorageId: v.optional(v.id("_storage")),
    anonymous: v.boolean(),
    status: v.string(), // 'UNVERIFIED', 'VERIFIED', 'HIDDEN', 'NEEDS REVIEW'
    confirmations: v.number(),
    disputes: v.number(), // Kept for legacy support
    abuseReports: v.optional(v.number()),
    createdAt: v.number(),
    isSpam: v.optional(v.boolean()),
  }).index("by_region", ["regionId"])
    .index("by_created", ["createdAt"]),

  interactions: defineTable({
    type: v.string(), // 'confirm' or 'abuse'
    reportId: v.id("reports"),
    userId: v.id("users"),
    createdAt: v.number(),
  }).index("by_report_and_user", ["reportId", "userId"]),

  newsletterSubscribers: defineTable({
    email: v.string(),
    regionId: v.id("regions"),
    createdAt: v.number(),
  }).index("by_region", ["regionId"]),
});
