"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import { getStatusDisplay } from "@/app/utils/reportStatus";
import RegionAdEditor from "@/components/admin/RegionAdEditor";
import PartnerInquiriesPanel from "@/components/admin/PartnerInquiriesPanel";

const CATEGORIES = [
  "All",
  "Public Safety",
  "Fire & EMS",
  "Traffic",
  "Lost & Found Pets",
  "Power Outages",
  "Weather",
  "School Alerts",
  "Community Alerts",
];

const STATUS_FILTERS = [
  { id: "all", label: "All reports" },
  { id: "review", label: "Needs review" },
  { id: "UNVERIFIED", label: "Unverified" },
  { id: "VERIFIED", label: "Verified" },
  { id: "HIDDEN", label: "Hidden" },
];

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</p>
      <p className="text-3xl font-black mt-1" style={{ color: accent ?? "var(--navy)" }}>
        {value}
      </p>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const stats = useQuery(api.admin.getDashboardStats);
  const activeUsers = useQuery(api.admin.getActiveUsers, { limit: 12 }) ?? [];
  const adInventory = useQuery(api.ads.getRegionAdInventory) ?? [];

  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<Id<"reports"> | null>(null);

  const reports = useQuery(api.admin.getAdminReports, {
    statusFilter,
    categoryFilter,
    search: search || undefined,
    limit: 40,
  }) ?? [];

  const deleteReport = useMutation(api.reports.deleteReport);
  const updateStatus = useMutation(api.reports.updateReportStatus);

  const selectedReport = useMemo(
    () => reports.find((r) => r._id === selectedId) ?? null,
    [reports, selectedId]
  );

  const maxTimeline = Math.max(...(stats?.timeline.map((t) => t.count) ?? [1]), 1);
  const maxRegionReports = Math.max(
    ...(stats?.regionInsights?.map((r) => r.totalReports) ?? [1]),
    1
  );

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--off-white)" }}>
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">🛡️</div>
          <p className="font-semibold text-gray-600">Loading admin dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--off-white)" }}>
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--red)" }}>
              LocalWatch Admin
            </p>
            <h1 className="text-2xl font-black" style={{ fontFamily: "Merriweather, serif", color: "var(--navy)" }}>
              Operations Dashboard
            </h1>
            <p className="text-sm text-gray-500">Welcome, {user.firstName || "Admin"} · Live data</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 no-underline"
              style={{ color: "var(--navy)" }}
            >
              View site
            </a>
            <UserButton />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* KPI row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total reports"
            value={stats?.totals.reports ?? "—"}
            hint={`${stats?.activity.reportsToday ?? 0} today`}
            accent="var(--navy)"
          />
          <StatCard
            label="Active now"
            value={stats?.activity.activeNow ?? "—"}
            hint={`${stats?.activity.activeToday ?? 0} in last 24h`}
            accent="var(--red)"
          />
          <StatCard
            label="Needs review"
            value={stats?.activity.needsReview ?? "—"}
            hint="Flagged or high abuse"
            accent="#E07B00"
          />
          <StatCard
            label="Registered users"
            value={stats?.totals.registeredUsers ?? "—"}
            hint={`${stats?.totals.users ?? 0} total profiles`}
            accent="var(--gold)"
          />
        </section>

        {(stats?.totals.newPartnerInquiries ?? 0) > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-amber-900">
              {stats?.totals.newPartnerInquiries} new Work with Us{" "}
              {stats?.totals.newPartnerInquiries === 1 ? "inquiry" : "inquiries"} waiting for review
            </p>
            <a
              href="#partner-inquiries"
              className="text-sm font-bold no-underline"
              style={{ color: "var(--navy)" }}
            >
              View inquiries →
            </a>
          </div>
        )}

        <section className="grid lg:grid-cols-3 gap-6">
          {/* Activity chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--navy)" }}>Report volume</h2>
                <p className="text-sm text-gray-500">Last 7 days</p>
              </div>
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                {stats?.activity.reportsThisWeek ?? 0} this week
              </span>
            </div>
            <div className="flex items-end gap-3 h-40">
              {(stats?.timeline ?? []).map((day) => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">{day.count}</span>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${Math.max(8, (day.count / maxTimeline) * 100)}%`,
                      background: day.count > 0 ? "var(--navy)" : "var(--gray-200)",
                      minHeight: "8px",
                    }}
                  />
                  <span className="text-[10px] text-gray-400 font-medium">
                    {new Date(day.date).toLocaleDateString(undefined, { weekday: "short" })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active users */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-1" style={{ color: "var(--navy)" }}>Active users</h2>
            <p className="text-sm text-gray-500 mb-4">Seen in the last 24 hours</p>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {activeUsers.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">No active users yet</p>
              )}
              {activeUsers.map((u) => (
                <div key={u._id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{u.label}</p>
                    <p className="text-xs text-gray-500">
                      {u.trustScoreLevel} · {u.totalReports} reports
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: u.registered ? "#0D1B3E15" : "#F1F3F5",
                        color: u.registered ? "var(--navy)" : "#6C757D",
                      }}
                    >
                      {u.registered ? "Registered" : "Anonymous"}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">{timeAgo(u.lastActiveAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Region performance */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold" style={{ color: "var(--navy)" }}>
              Region performance
            </h2>
            <p className="text-sm text-gray-500">
              Which areas are getting the most reports — use this to prioritize outreach and ad inventory
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Region</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Today</th>
                  <th className="px-4 py-3 text-right">This week</th>
                  <th className="px-4 py-3 text-right">Last week</th>
                  <th className="px-4 py-3 text-center">Trend</th>
                  <th className="px-4 py-3 text-right">Share</th>
                  <th className="px-4 py-3 text-right">Contributors</th>
                  <th className="px-4 py-3">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(stats?.regionInsights ?? []).length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-gray-400">
                      No region data yet
                    </td>
                  </tr>
                )}
                {(stats?.regionInsights ?? []).map((row) => (
                  <tr key={row.regionId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-gray-400">{row.rank}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{row.name}</p>
                      <a
                        href={`/?region=${row.slug}`}
                        className="text-xs no-underline"
                        style={{ color: "var(--navy)" }}
                      >
                        View on site →
                      </a>
                    </td>
                    <td className="px-4 py-3 text-right font-bold" style={{ color: "var(--navy)" }}>
                      {row.totalReports}
                    </td>
                    <td className="px-4 py-3 text-right">{row.reportsToday}</td>
                    <td className="px-4 py-3 text-right">{row.reportsThisWeek}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{row.reportsLastWeek}</td>
                    <td className="px-4 py-3 text-center">
                      {row.trend === "up" && <span title="Up vs last week">📈</span>}
                      {row.trend === "down" && <span title="Down vs last week">📉</span>}
                      {row.trend === "flat" && <span title="Flat vs last week">➡️</span>}
                    </td>
                    <td className="px-4 py-3 text-right">{row.shareOfReports}%</td>
                    <td className="px-4 py-3 text-right">{row.uniqueContributors}</td>
                    <td className="px-4 py-3 w-32">
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max(4, (row.totalReports / maxRegionReports) * 100)}%`,
                            background: "var(--navy)",
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Ad inventory by region */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold" style={{ color: "var(--navy)" }}>
              Regional ad inventory
            </h2>
            <p className="text-sm text-gray-500">
              Banner, sidebar, and feed slots per region — empty slots show &quot;Your Ad Here&quot; on the site
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3">Region</th>
                  <th className="px-4 py-3">Banner</th>
                  <th className="px-4 py-3">Sidebar</th>
                  <th className="px-4 py-3">Feed</th>
                  <th className="px-4 py-3 text-right">Reports</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {adInventory.map((region) => {
                  const insight = stats?.regionInsights?.find((r) => r.regionId === region.regionId);
                  return (
                    <tr key={region.regionId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">{region.regionName}</td>
                      {region.slots.map((slot) => (
                        <td key={slot.placement} className="px-4 py-3">
                          {slot.filled ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800">
                              ✓ {slot.sponsorName}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-800">
                              Open
                            </span>
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right font-bold" style={{ color: "var(--navy)" }}>
                        {insight?.totalReports ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <PartnerInquiriesPanel />

        <RegionAdEditor />

        {/* Breakdowns */}
        <section className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">By status</h3>
            <div className="space-y-2">
              {Object.entries(stats?.byStatus ?? {}).map(([status, count]) => (
                <div key={status} className="flex justify-between text-sm">
                  <span className="text-gray-600">{getStatusDisplay(status).icon} {status}</span>
                  <span className="font-bold" style={{ color: "var(--navy)" }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Top categories</h3>
            <div className="space-y-2">
              {Object.entries(stats?.byCategory ?? {})
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([cat, count]) => (
                  <div key={cat} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate pr-2">{cat}</span>
                    <span className="font-bold" style={{ color: "var(--navy)" }}>{count}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">By region</h3>
            <div className="space-y-2">
              {Object.entries(stats?.byRegion ?? {})
                .sort((a, b) => b[1] - a[1])
                .map(([region, count]) => (
                  <div key={region} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate pr-2">{region}</span>
                    <span className="font-bold" style={{ color: "var(--navy)" }}>{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Reports queue */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--navy)" }}>Report moderation</h2>
                <p className="text-sm text-gray-500">Filter, review, and act on the latest submissions</p>
              </div>
              <input
                type="search"
                placeholder="Search title, location, description…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full lg:w-72 px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D1B3E]/30"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                  style={{
                    background: statusFilter === f.id ? "var(--navy)" : "#F1F3F5",
                    color: statusFilter === f.id ? "white" : "#495057",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c === "All" ? "all" : c}>
                  {c === "All" ? "All categories" : c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            <div className="lg:col-span-3 max-h-[520px] overflow-y-auto divide-y divide-gray-100">
              {reports.length === 0 && (
                <p className="p-8 text-center text-gray-400 text-sm">No reports match your filters</p>
              )}
              {reports.map((r) => {
                const status = getStatusDisplay(r.status);
                const isSelected = selectedId === r._id;
                const needsAttention =
                  r.status === "NEEDS REVIEW" || r.abuseCount >= 2 || r.isSpam === true;

                return (
                  <button
                    key={r._id}
                    onClick={() => setSelectedId(r._id)}
                    className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                    style={{ background: isSelected ? "#0D1B3E08" : undefined }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                            {r.category}
                          </span>
                          {needsAttention && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                              Attention
                            </span>
                          )}
                          {r.anonymous && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                              Anonymous
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-gray-900 truncate">{r.title}</p>
                        <p className="text-xs text-gray-500 truncate">📍 {r.locationText} · {r.regionName}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${status.cls}`}>
                          {status.icon} {status.label}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-1">{timeAgo(r.createdAt)}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-2 p-6 bg-gray-50 min-h-[320px]">
              {!selectedReport ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                  <div className="text-4xl mb-2">📋</div>
                  <p className="text-sm font-medium">Select a report to review details</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">
                      {selectedReport.category} · {selectedReport.regionName}
                    </p>
                    <h3 className="text-xl font-black" style={{ fontFamily: "Merriweather, serif", color: "var(--navy)" }}>
                      {selectedReport.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(selectedReport.createdAt).toLocaleString()} · {timeAgo(selectedReport.createdAt)}
                    </p>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed">{selectedReport.description}</p>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-lg bg-white border border-gray-200">
                      <p className="text-xs text-gray-400">Location</p>
                      <p className="font-semibold text-gray-800">{selectedReport.locationText}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-gray-200">
                      <p className="text-xs text-gray-400">Reporter</p>
                      <p className="font-semibold text-gray-800">{selectedReport.reporterLabel}</p>
                      <p className="text-xs text-gray-500">{selectedReport.reporterTrust}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-gray-200">
                      <p className="text-xs text-gray-400">Confirmations</p>
                      <p className="font-bold text-lg" style={{ color: "var(--navy)" }}>{selectedReport.confirmations}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-gray-200">
                      <p className="text-xs text-gray-400">Abuse flags</p>
                      <p className="font-bold text-lg" style={{ color: "var(--red)" }}>{selectedReport.abuseCount}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <label className="text-xs font-bold text-gray-500">Status</label>
                    <select
                      value={selectedReport.status}
                      onChange={(e) => updateStatus({ id: selectedReport._id, status: e.target.value })}
                      className="border rounded-lg px-3 py-2 text-sm font-medium"
                    >
                      <option value="UNVERIFIED">UNVERIFIED</option>
                      <option value="VERIFIED">VERIFIED</option>
                      <option value="HIDDEN">HIDDEN</option>
                      <option value="NEEDS REVIEW">NEEDS REVIEW</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => updateStatus({ id: selectedReport._id, status: "VERIFIED" })}
                      className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white"
                      style={{ background: "var(--navy)" }}
                    >
                      ✓ Verify
                    </button>
                    <button
                      onClick={() => updateStatus({ id: selectedReport._id, status: "HIDDEN" })}
                      className="flex-1 py-2.5 rounded-lg text-sm font-bold border border-gray-300 text-gray-700"
                    >
                      Hide
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this report permanently?")) {
                          deleteReport({ id: selectedReport._id });
                          setSelectedId(null);
                        }
                      }}
                      className="px-4 py-2.5 rounded-lg text-sm font-bold text-red-600 border border-red-200 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>

                  <a
                    href={`https://www.google.com/maps?q=${selectedReport.latitude},${selectedReport.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-sm font-semibold"
                    style={{ color: "var(--navy)" }}
                  >
                    Open in Google Maps →
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8">
          <StatCard label="Interactions" value={stats?.totals.interactions ?? "—"} hint="Confirms + abuse flags" />
          <StatCard label="Newsletter subs" value={stats?.totals.subscribers ?? "—"} />
          <StatCard
            label="Partner inquiries"
            value={stats?.totals.partnerInquiries ?? "—"}
            hint={`${stats?.totals.newPartnerInquiries ?? 0} new`}
          />
          <StatCard label="Regions live" value={stats?.totals.regions ?? "—"} />
          <StatCard label="Abuse flags" value={stats?.activity.abuseFlags ?? "—"} hint="All time" accent="var(--red)" />
        </div>
      </div>
    </div>
  );
}
