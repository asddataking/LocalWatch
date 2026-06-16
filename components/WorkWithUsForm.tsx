"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const INTEREST_TYPES = [
  { value: "advertising", label: "Regional advertising" },
  { value: "partnership", label: "Community partnership" },
  { value: "other", label: "Other inquiry" },
] as const;

const PLACEMENTS = [
  { value: "banner", label: "Banner (top of feed)" },
  { value: "sidebar", label: "Sidebar" },
  { value: "feed", label: "In-feed sponsorship" },
] as const;

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D1B3E]/30";

export default function WorkWithUsForm() {
  const regions = useQuery(api.regions.getRegions) ?? [];
  const submitInquiry = useMutation(api.partners.submitPartnerInquiry);

  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [regionId, setRegionId] = useState<string>("");
  const [interestType, setInterestType] = useState("advertising");
  const [placements, setPlacements] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function togglePlacement(value: string) {
    setPlacements((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await submitInquiry({
        businessName,
        contactName,
        email,
        phone: phone || undefined,
        website: website || undefined,
        regionId: regionId ? (regionId as Id<"regions">) : undefined,
        interestType,
        placements: placements.length ? placements : undefined,
        message,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-10 px-4">
        <div className="text-5xl mb-4">✓</div>
        <h2
          className="text-2xl font-black mb-2"
          style={{ fontFamily: "Merriweather, serif", color: "var(--navy)" }}
        >
          Thanks — we received your inquiry
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Our team will review your message and follow up at <strong>{email}</strong> soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
            Business name *
          </label>
          <input
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className={inputClass}
            placeholder="Your business or organization"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
            Contact name *
          </label>
          <input
            required
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className={inputClass}
            placeholder="Who should we reach?"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
            Email *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@business.com"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder="Optional"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
          Website
        </label>
        <input
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className={inputClass}
          placeholder="https://"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
            Region of interest
          </label>
          <select
            value={regionId}
            onChange={(e) => setRegionId(e.target.value)}
            className={inputClass}
          >
            <option value="">Any region / not sure yet</option>
            {regions.map((region) => (
              <option key={region._id} value={region._id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
            I&apos;m interested in *
          </label>
          <select
            required
            value={interestType}
            onChange={(e) => setInterestType(e.target.value)}
            className={inputClass}
          >
            {INTEREST_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {interestType === "advertising" && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
            Ad placements (optional)
          </p>
          <div className="flex flex-wrap gap-2">
            {PLACEMENTS.map((slot) => {
              const selected = placements.includes(slot.value);
              return (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => togglePlacement(slot.value)}
                  className="px-3 py-2 rounded-lg text-xs font-bold border transition-colors"
                  style={{
                    background: selected ? "var(--navy)" : "white",
                    color: selected ? "white" : "var(--navy)",
                    borderColor: selected ? "var(--navy)" : "#DEE2E6",
                  }}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
          Tell us about your goals *
        </label>
        <textarea
          required
          rows={5}
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClass} resize-y min-h-[120px]`}
          placeholder="Which communities do you serve? What would you like to promote?"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{message.length}/2000</p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 rounded-xl font-bold text-white transition-opacity disabled:opacity-60"
        style={{ background: "var(--red)" }}
      >
        {submitting ? "Sending…" : "Submit inquiry"}
      </button>
    </form>
  );
}
