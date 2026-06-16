import { query } from "./_generated/server";
import { v } from "convex/values";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(ts: number) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function dayKey(ts: number) {
  return new Date(ts).toISOString().slice(0, 10);
}

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const todayStart = startOfDay(now);
    const weekAgo = now - 7 * DAY_MS;
    const activeWindow = now - 15 * 60 * 1000;
    const dayAgo = now - DAY_MS;

    const [reports, users, interactions, subscribers, regions, partnerInquiries] = await Promise.all([
      ctx.db.query("reports").collect(),
      ctx.db.query("users").collect(),
      ctx.db.query("interactions").collect(),
      ctx.db.query("newsletterSubscribers").collect(),
      ctx.db.query("regions").collect(),
      ctx.db.query("partnerInquiries").collect(),
    ]);

    const reportsToday = reports.filter((r) => r.createdAt >= todayStart).length;
    const reportsThisWeek = reports.filter((r) => r.createdAt >= weekAgo).length;

    const byStatus = reports.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    }, {});

    const byCategory = reports.reduce<Record<string, number>>((acc, r) => {
      acc[r.category] = (acc[r.category] ?? 0) + 1;
      return acc;
    }, {});

    const regionMap = new Map(regions.map((r) => [r._id, r]));
    const byRegion = reports.reduce<Record<string, number>>((acc, r) => {
      const name = r.regionId ? regionMap.get(r.regionId)?.name ?? "Unknown" : "Unassigned";
      acc[name] = (acc[name] ?? 0) + 1;
      return acc;
    }, {});

    const lastWeekStart = weekAgo - 7 * DAY_MS;
    const regionInsights = regions
      .map((region) => {
        const regionReports = reports.filter((r) => r.regionId === region._id);
        const reportsTodayCount = regionReports.filter((r) => r.createdAt >= todayStart).length;
        const reportsThisWeekCount = regionReports.filter((r) => r.createdAt >= weekAgo).length;
        const reportsLastWeekCount = regionReports.filter(
          (r) => r.createdAt >= lastWeekStart && r.createdAt < weekAgo
        ).length;
        const uniqueContributors = new Set(
          regionReports.map((r) => r.userId).filter(Boolean)
        ).size;

        let trend: "up" | "down" | "flat" = "flat";
        if (reportsThisWeekCount > reportsLastWeekCount) trend = "up";
        else if (reportsThisWeekCount < reportsLastWeekCount) trend = "down";

        const shareOfReports =
          reports.length > 0
            ? Math.round((regionReports.length / reports.length) * 100)
            : 0;

        return {
          regionId: region._id,
          slug: region.slug,
          name: region.name,
          totalReports: regionReports.length,
          reportsToday: reportsTodayCount,
          reportsThisWeek: reportsThisWeekCount,
          reportsLastWeek: reportsLastWeekCount,
          verifiedCount: regionReports.filter((r) => r.status === "VERIFIED").length,
          uniqueContributors,
          shareOfReports,
          trend,
        };
      })
      .sort((a, b) => b.totalReports - a.totalReports)
      .map((row, index) => ({ ...row, rank: index + 1 }));

    const activeNow = users.filter((u) => (u.lastActiveAt ?? 0) >= activeWindow).length;
    const activeToday = users.filter((u) => (u.lastActiveAt ?? 0) >= dayAgo).length;
    const registeredUsers = users.filter((u) => !!u.clerkId).length;

    const timeline: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = startOfDay(now - i * DAY_MS);
      const dayEnd = dayStart + DAY_MS;
      const key = dayKey(dayStart);
      const count = reports.filter((r) => r.createdAt >= dayStart && r.createdAt < dayEnd).length;
      timeline.push({ date: key, count });
    }

    const needsReview = reports.filter(
      (r) =>
        r.status === "NEEDS REVIEW" ||
        (r.abuseReports ?? r.disputes ?? 0) >= 2 ||
        r.isSpam === true
    ).length;

    return {
      totals: {
        reports: reports.length,
        users: users.length,
        registeredUsers,
        interactions: interactions.length,
        subscribers: subscribers.length,
        regions: regions.length,
        partnerInquiries: partnerInquiries.length,
        newPartnerInquiries: partnerInquiries.filter((p) => p.status === "new").length,
      },
      activity: {
        reportsToday,
        reportsThisWeek,
        activeNow,
        activeToday,
        needsReview,
        confirmations: interactions.filter((i) => i.type === "confirm").length,
        abuseFlags: interactions.filter((i) => i.type === "abuse").length,
      },
      byStatus,
      byCategory,
      byRegion,
      regionInsights,
      timeline,
    };
  },
});

export const getAdminReports = query({
  args: {
    statusFilter: v.optional(v.string()),
    categoryFilter: v.optional(v.string()),
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { statusFilter, categoryFilter, search, limit = 50 }) => {
    const reports = await ctx.db.query("reports").order("desc").take(200);
    const regions = await ctx.db.query("regions").collect();
    const regionMap = new Map(regions.map((r) => [r._id, r]));

    const needle = search?.trim().toLowerCase();

    const filtered = reports.filter((r) => {
      if (statusFilter && statusFilter !== "all") {
        if (statusFilter === "review") {
          const abuses = r.abuseReports ?? r.disputes ?? 0;
          if (r.status !== "NEEDS REVIEW" && abuses < 2 && r.isSpam !== true) return false;
        } else if (r.status !== statusFilter) {
          return false;
        }
      }
      if (categoryFilter && categoryFilter !== "all" && r.category !== categoryFilter) {
        return false;
      }
      if (needle) {
        const haystack = `${r.title} ${r.description} ${r.locationText} ${r.category}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });

    const slice = filtered.slice(0, limit);

    return await Promise.all(
      slice.map(async (report) => {
        const user = report.userId ? await ctx.db.get(report.userId) : null;
        const region = report.regionId ? regionMap.get(report.regionId) : null;
        return {
          ...report,
          regionName: region?.name ?? "Unassigned",
          reporterLabel: report.anonymous
            ? "Anonymous"
            : user?.displayName ?? user?.email ?? "Community member",
          reporterTrust: user?.trustScoreLevel ?? "Unknown",
          reporterRegistered: !!user?.clerkId,
          abuseCount: report.abuseReports ?? report.disputes ?? 0,
        };
      })
    );
  },
});

export const getActiveUsers = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 20 }) => {
    const now = Date.now();
    const dayAgo = now - DAY_MS;

    const users = await ctx.db.query("users").collect();
    const active = users
      .filter((u) => (u.lastActiveAt ?? 0) >= dayAgo)
      .sort((a, b) => (b.lastActiveAt ?? 0) - (a.lastActiveAt ?? 0))
      .slice(0, limit);

    return active.map((u) => ({
      _id: u._id,
      label: u.displayName ?? u.email ?? `Device ${u.fingerprintId.slice(-6)}`,
      trustScoreLevel: u.trustScoreLevel,
      totalReports: u.totalReports,
      registered: !!u.clerkId,
      lastActiveAt: u.lastActiveAt ?? u.createdAt,
      createdAt: u.createdAt,
    }));
  },
});

export const getPublicCommunityStats = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const dayAgo = now - DAY_MS;
    const activeWindow = now - 15 * 60 * 1000;

    const users = await ctx.db.query("users").collect();

    return {
      communityMembers: users.length,
      registeredMembers: users.filter((u) => !!u.clerkId).length,
      activeToday: users.filter((u) => (u.lastActiveAt ?? 0) >= dayAgo).length,
      activeNow: users.filter((u) => (u.lastActiveAt ?? 0) >= activeWindow).length,
    };
  },
});
