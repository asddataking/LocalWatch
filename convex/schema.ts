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
    clerkId: v.optional(v.string()), // Linked Clerk account
    displayName: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.string(), // 'user' or 'admin'
    trustScoreLevel: v.string(), // 'New User', 'Community Member', 'Community Spotter', 'Trusted Reporter', 'Verified Contributor'
    totalReports: v.number(),
    createdAt: v.number(),
    lastActiveAt: v.optional(v.number()),
  })
    .index("by_fingerprint", ["fingerprintId"])
    .index("by_clerk", ["clerkId"])
    .index("by_last_active", ["lastActiveAt"]),

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

  regionAds: defineTable({
    regionId: v.id("regions"),
    placement: v.string(), // banner | sidebar | feed
    sponsorName: v.string(),
    title: v.string(),
    description: v.string(),
    ctaLabel: v.string(),
    ctaUrl: v.optional(v.string()),
    icon: v.optional(v.string()),
    accentColor: v.optional(v.string()),
    active: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_region", ["regionId"])
    .index("by_region_placement", ["regionId", "placement"]),

  partnerInquiries: defineTable({
    businessName: v.string(),
    contactName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    regionId: v.optional(v.id("regions")),
    interestType: v.string(), // advertising | partnership | other
    placements: v.optional(v.array(v.string())),
    message: v.string(),
    status: v.string(), // new | contacted | closed
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),
});
