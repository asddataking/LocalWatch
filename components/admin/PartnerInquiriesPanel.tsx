"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "closed", label: "Closed" },
] as const;

const INTEREST_LABELS: Record<string, string> = {
  advertising: "Regional advertising",
  partnership: "Community partnership",
  other: "Other",
};

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function PartnerInquiriesPanel() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<Id<"partnerInquiries"> | null>(null);

  const inquiries =
    useQuery(api.partners.getPartnerInquiries, {
      statusFilter: statusFilter === "all" ? undefined : statusFilter,
      limit: 40,
    }) ?? [];

  const updateStatus = useMutation(api.partners.updatePartnerInquiryStatus);
  const selected = inquiries.find((row) => row._id === selectedId) ?? null;

  return (
    <section id="partner-inquiries" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold" style={{ color: "var(--navy)" }}>
          Work with Us inquiries
        </h2>
        <p className="text-sm text-gray-500">
          Submissions from the public partnership form
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
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
      </div>

      <div className="grid lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
        <div className="lg:col-span-2 max-h-[480px] overflow-y-auto divide-y divide-gray-100">
          {inquiries.length === 0 && (
            <p className="p-8 text-center text-gray-400 text-sm">No inquiries yet</p>
          )}
          {inquiries.map((row) => {
            const isSelected = selectedId === row._id;
            const isNew = row.status === "new";
            return (
              <button
                key={row._id}
                type="button"
                onClick={() => setSelectedId(row._id)}
                className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                style={{ background: isSelected ? "#0D1B3E08" : undefined }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{row.businessName}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {row.contactName} · {row.email}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {INTEREST_LABELS[row.interestType] ?? row.interestType} · {row.regionName}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {isNew && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        New
                      </span>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1">{timeAgo(row.createdAt)}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-3 p-6 bg-gray-50 min-h-[320px]">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
              <div className="text-4xl mb-2">📬</div>
              <p className="text-sm font-medium">Select an inquiry to view details</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    {INTEREST_LABELS[selected.interestType] ?? selected.interestType}
                  </p>
                  <h3
                    className="text-xl font-black"
                    style={{ fontFamily: "Merriweather, serif", color: "var(--navy)" }}
                  >
                    {selected.businessName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted {new Date(selected.createdAt).toLocaleString()} · {timeAgo(selected.createdAt)}
                  </p>
                </div>
                <select
                  value={selected.status}
                  onChange={(e) => updateStatus({ id: selected._id, status: e.target.value })}
                  className="border rounded-lg px-3 py-2 text-sm font-medium bg-white"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <p className="text-xs text-gray-400">Contact</p>
                  <p className="font-semibold">{selected.contactName}</p>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-xs no-underline"
                    style={{ color: "var(--navy)" }}
                  >
                    {selected.email}
                  </a>
                  {selected.phone && <p className="text-xs text-gray-600 mt-1">{selected.phone}</p>}
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <p className="text-xs text-gray-400">Region</p>
                  <p className="font-semibold">{selected.regionName}</p>
                  {selected.website && (
                    <a
                      href={selected.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs no-underline"
                      style={{ color: "var(--navy)" }}
                    >
                      {selected.website}
                    </a>
                  )}
                </div>
              </div>

              {selected.placements && selected.placements.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase text-gray-400 mb-2">Placements</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.placements.map((p) => (
                      <span
                        key={p}
                        className="text-xs font-semibold px-2 py-1 rounded-full bg-white border border-gray-200"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-lg bg-white border border-gray-200">
                <p className="text-xs font-bold uppercase text-gray-400 mb-2">Message</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>

              <a
                href={`mailto:${selected.email}?subject=LocalWatch%20partnership%20inquiry`}
                className="inline-block text-sm font-bold px-4 py-2 rounded-lg text-white no-underline"
                style={{ background: "var(--red)" }}
              >
                Reply by email →
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
