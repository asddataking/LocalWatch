import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  reports: defineTable({
    category: v.string(),
    title: v.string(),
    description: v.string(),
    locationText: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    photoStorageId: v.optional(v.id("_storage")),
    anonymous: v.boolean(),
    status: v.string(),
    confirmations: v.number(),
    disputes: v.number(),
    createdAt: v.number(),
    isSpam: v.optional(v.boolean()),
  }),
});
