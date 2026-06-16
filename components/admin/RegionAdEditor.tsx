"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const PLACEMENTS = [
  { value: "banner", label: "Banner" },
  { value: "sidebar", label: "Sidebar" },
  { value: "feed", label: "Feed" },
] as const;

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D1B3E]/30";

export default function RegionAdEditor() {
  const regions = useQuery(api.regions.getRegions) ?? [];
  const upsertAd = useMutation(api.ads.upsertRegionAd);
  const deactivateAd = useMutation(api.ads.deactivateRegionAd);

  const [regionId, setRegionId] = useState<string>("");
  const [placement, setPlacement] = useState("banner");
  const [sponsorName, setSponsorName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ctaLabel, setCtaLabel] = useState("Learn more");
  const [ctaUrl, setCtaUrl] = useState("");
  const [icon, setIcon] = useState("🏷️");
  const [accentColor, setAccentColor] = useState("#0D1B3E");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [existingAdId, setExistingAdId] = useState<Id<"regionAds"> | null>(null);

  const existingAd = useQuery(
    api.ads.getRegionAdByPlacement,
    regionId ? { regionId: regionId as Id<"regions">, placement } : "skip"
  );

  useEffect(() => {
    if (!regionId) {
      setExistingAdId(null);
      return;
    }
    if (existingAd === undefined) return;

    if (existingAd) {
      setExistingAdId(existingAd._id);
      setSponsorName(existingAd.sponsorName);
      setTitle(existingAd.title);
      setDescription(existingAd.description);
      setCtaLabel(existingAd.ctaLabel);
      setCtaUrl(existingAd.ctaUrl ?? "");
      setIcon(existingAd.icon ?? "🏷️");
      setAccentColor(existingAd.accentColor ?? "#0D1B3E");
      setActive(existingAd.active);
    } else {
      setExistingAdId(null);
      setSponsorName("");
      setTitle("");
      setDescription("");
      setCtaLabel("Learn more");
      setCtaUrl("");
      setIcon("🏷️");
      setAccentColor("#0D1B3E");
      setActive(true);
    }
  }, [existingAd, regionId, placement]);

  useEffect(() => {
    if (regions.length > 0 && !regionId) {
      setRegionId(regions[0]._id);
    }
  }, [regions, regionId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!regionId) return;

    setSaving(true);
    setMessage("");

    try {
      await upsertAd({
        regionId: regionId as Id<"regions">,
        placement,
        sponsorName: sponsorName.trim(),
        title: title.trim(),
        description: description.trim(),
        ctaLabel: ctaLabel.trim() || "Learn more",
        ctaUrl: ctaUrl.trim() || undefined,
        icon: icon.trim() || undefined,
        accentColor: accentColor.trim() || undefined,
        active,
      });
      setMessage("Ad saved — live on site when active.");
    } catch {
      setMessage("Could not save ad. Check required fields.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate() {
    if (!existingAdId) return;
    setSaving(true);
    try {
      await deactivateAd({ id: existingAdId });
      setActive(false);
      setMessage("Ad deactivated — slot shows placeholder again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold" style={{ color: "var(--navy)" }}>
          Manage regional ads
        </h2>
        <p className="text-sm text-gray-500">
          Create or edit banner, sidebar, and feed sponsorships per region
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-4">
        {message && (
          <div className="text-sm font-medium px-4 py-3 rounded-lg bg-green-50 text-green-800 border border-green-200">
            {message}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Region</label>
            <select
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              className={inputClass}
              required
            >
              {regions.map((region) => (
                <option key={region._id} value={region._id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Placement</label>
            <select
              value={placement}
              onChange={(e) => setPlacement(e.target.value)}
              className={inputClass}
            >
              {PLACEMENTS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Sponsor name *
            </label>
            <input
              required
              value={sponsorName}
              onChange={(e) => setSponsorName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Headline *</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
            Description *
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">CTA label</label>
            <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">CTA URL</label>
            <input
              type="url"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              className={inputClass}
              placeholder="https://"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Icon</label>
            <input value={icon} onChange={(e) => setIcon(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Accent color</label>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="rounded"
              />
              Active on site
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-60"
            style={{ background: "var(--navy)" }}
          >
            {saving ? "Saving…" : "Save ad"}
          </button>
          {existingAdId && active && (
            <button
              type="button"
              disabled={saving}
              onClick={handleDeactivate}
              className="px-6 py-2.5 rounded-lg text-sm font-bold border border-gray-300 text-gray-700"
            >
              Deactivate slot
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
