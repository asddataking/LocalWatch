import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const submitPartnerInquiry = mutation({
  args: {
    businessName: v.string(),
    contactName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    regionId: v.optional(v.id("regions")),
    interestType: v.string(),
    placements: v.optional(v.array(v.string())),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const businessName = args.businessName.trim();
    const contactName = args.contactName.trim();
    const email = args.email.trim().toLowerCase();
    const message = args.message.trim();

    if (!businessName || !contactName || !email || !message) {
      throw new Error("Please fill in all required fields.");
    }
    if (!EMAIL_RE.test(email)) {
      throw new Error("Please enter a valid email address.");
    }
    if (message.length > 2000) {
      throw new Error("Message is too long (max 2000 characters).");
    }

    return await ctx.db.insert("partnerInquiries", {
      businessName,
      contactName,
      email,
      phone: args.phone?.trim() || undefined,
      website: args.website?.trim() || undefined,
      regionId: args.regionId,
      interestType: args.interestType,
      placements: args.placements?.length ? args.placements : undefined,
      message,
      status: "new",
      createdAt: Date.now(),
    });
  },
});

export const getPartnerInquiries = query({
  args: {
    statusFilter: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { statusFilter, limit = 50 }) => {
    const inquiries = await ctx.db
      .query("partnerInquiries")
      .order("desc")
      .take(200);

    const regions = await ctx.db.query("regions").collect();
    const regionMap = new Map(regions.map((r) => [r._id, r.name]));

    const filtered = inquiries
      .filter((row) => !statusFilter || statusFilter === "all" || row.status === statusFilter)
      .slice(0, limit);

    return filtered.map((row) => ({
      ...row,
      regionName: row.regionId ? regionMap.get(row.regionId) ?? "Unknown" : "Any / not specified",
    }));
  },
});

export const updatePartnerInquiryStatus = mutation({
  args: {
    id: v.id("partnerInquiries"),
    status: v.string(),
  },
  handler: async (ctx, { id, status }) => {
    if (!["new", "contacted", "closed"].includes(status)) {
      throw new Error("Invalid status.");
    }
    await ctx.db.patch(id, { status });
  },
});
