"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { getFingerprintId } from "@/app/utils/fingerprint";
import { useQuery } from "convex/react";

const CATEGORIES = [
  "Public Safety",
  "Fire & EMS",
  "Traffic",
  "Lost & Found Pets",
  "Power Outages",
  "Weather",
  "School Alerts",
  "Community Alerts",
];

export default function SubmitForm() {
  const router = useRouter();
  const createReport = useMutation(api.reports.createReport);
  const generateUploadUrl = useMutation(api.reports.generateUploadUrl);

  const [regionSlug, setRegionSlug] = useState("metro-detroit");
  const [fingerprintId, setFingerprintId] = useState("");

  if (typeof window !== "undefined" && !fingerprintId) {
    setFingerprintId(getFingerprintId());
    const saved = localStorage.getItem("localwatch_region");
    if (saved) setRegionSlug(saved);
  }

  const region = useQuery(api.regions.getRegionBySlug, { slug: regionSlug });
  const user = useQuery(api.users.getUser, fingerprintId ? { fingerprintId } : "skip");

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationText, setLocationText] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [locLoading, setLocLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setLocLoading(false);
      },
      () => {
        setError("Could not get your location. Please enter manually.");
        setLocLoading(false);
      }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!category || !title || !description || !locationText || !latitude || !longitude) {
      setError("Please fill in all required fields.");
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng)) {
      setError("Latitude and longitude must be valid numbers.");
      return;
    }

    if (!region || !user) {
      setError("Missing region or user data. Please try again.");
      return;
    }

    setSubmitting(true);
    try {
      let photoStorageId: string | undefined;

      if (photo) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": photo.type },
          body: photo,
        });
        if (!result.ok) throw new Error("Photo upload failed.");
        const json = await result.json();
        photoStorageId = json.storageId;
      }

      await createReport({
        regionId: region._id,
        userId: user._id,
        category,
        title,
        description,
        locationText,
        latitude: lat,
        longitude: lng,
        anonymous,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(photoStorageId ? { photoStorageId: photoStorageId as any } : {}),
      });

      router.push("/?submitted=1");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls =
    "w-full px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1";
  const inputStyle = {
    borderColor: "var(--gray-300)",
    color: "var(--gray-900)",
    background: "white",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Moderation warning */}
      <div
        className="rounded-xl p-4 border-l-4 text-sm leading-relaxed"
        style={{
          background: "#FFF9E6",
          borderLeftColor: "var(--gold)",
          color: "#7a5900",
        }}
      >
        <p className="font-bold mb-1">⚠️ Community Guidelines</p>
        <p>
          Do not post names, accusations, private addresses, license plates, or
          personal information. <strong>Report what you observed, not who you
          think did it.</strong>
        </p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-bold mb-1.5" style={{ color: "var(--navy)" }}>
          Category <span style={{ color: "var(--red)" }}>*</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className={inputCls}
          style={{ ...inputStyle, appearance: "auto" }}
        >
          <option value="">Select a category…</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-bold mb-1.5" style={{ color: "var(--navy)" }}>
          Title <span style={{ color: "var(--red)" }}>*</span>
        </label>
        <input
          type="text"
          placeholder="Brief title describing what you observed"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
          className={inputCls}
          style={inputStyle}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold mb-1.5" style={{ color: "var(--navy)" }}>
          Description <span style={{ color: "var(--red)" }}>*</span>
        </label>
        <textarea
          placeholder="Describe what you observed in detail. Stick to facts — no names or personal info."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          maxLength={200}
          className={inputCls}
          style={{ ...inputStyle, resize: "vertical" }}
        />
        <p className="text-xs mt-1" style={{ color: "var(--gray-500)" }}>
          {description.length}/200 characters
        </p>
      </div>

      {/* Location text */}
      <div>
        <label className="block text-sm font-bold mb-1.5" style={{ color: "var(--navy)" }}>
          General Location <span style={{ color: "var(--red)" }}>*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Military St, Port Huron (no exact address)"
          value={locationText}
          onChange={(e) => setLocationText(e.target.value)}
          required
          className={inputCls}
          style={inputStyle}
        />
        <p className="text-xs mt-1" style={{ color: "var(--gray-500)" }}>
          Use a general area — do not post private addresses.
        </p>
      </div>

      {/* Lat / Lng */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-bold" style={{ color: "var(--navy)" }}>
            Coordinates <span style={{ color: "var(--red)" }}>*</span>
          </label>
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locLoading}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
            style={{ background: "var(--navy)", color: "white" }}
          >
            {locLoading ? "Detecting…" : "📍 Use My Location"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium" style={{ color: "var(--gray-500)" }}>Latitude</label>
            <input
              type="number"
              step="any"
              placeholder="43.0009"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
              className={inputCls}
              style={{ ...inputStyle, marginTop: "4px" }}
            />
          </div>
          <div>
            <label className="text-xs font-medium" style={{ color: "var(--gray-500)" }}>Longitude</label>
            <input
              type="number"
              step="any"
              placeholder="-82.4249"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
              className={inputCls}
              style={{ ...inputStyle, marginTop: "4px" }}
            />
          </div>
        </div>
        <p className="text-xs mt-1.5" style={{ color: "var(--gray-500)" }}>
          Tip: Right-click on{" "}
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--navy)" }}
          >
            Google Maps
          </a>{" "}
          and copy the coordinates.
        </p>
      </div>

      {/* Photo upload */}
      <div>
        <label className="block text-sm font-bold mb-1.5" style={{ color: "var(--navy)" }}>
          Photo <span className="font-normal" style={{ color: "var(--gray-500)" }}>(optional)</span>
        </label>
        <div
          className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:border-navy"
          style={{ borderColor: "var(--gray-300)" }}
          onClick={() => fileRef.current?.click()}
        >
          {photoPreview ? (
            <div className="relative">
              <img
                src={photoPreview}
                alt="Preview"
                className="max-h-48 mx-auto rounded-lg object-cover"
              />
              <p className="text-xs mt-2" style={{ color: "var(--gray-500)" }}>
                Click to change photo
              </p>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-2">📷</div>
              <p className="text-sm font-semibold" style={{ color: "var(--gray-700)" }}>
                Tap to add a photo
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--gray-500)" }}>
                JPG, PNG, WEBP — max 10MB
              </p>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

      {/* Anonymous toggle */}
      <div
        className="flex items-start gap-4 p-4 rounded-xl"
        style={{ background: "var(--gray-100)" }}
      >
        <div className="relative mt-0.5 flex-shrink-0">
          <input
            type="checkbox"
            id="anonymous"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="w-5 h-5 rounded accent-red-600 cursor-pointer"
          />
        </div>
        <label htmlFor="anonymous" className="cursor-pointer">
          <p className="text-sm font-bold" style={{ color: "var(--navy)" }}>
            Submit anonymously
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--gray-500)" }}>
            Your name will not be attached to this report.
          </p>
        </label>
      </div>

      {/* Error */}
      {error && (
        <div
          className="p-3 rounded-lg text-sm font-semibold"
          style={{ background: "#C8102E15", color: "var(--red)", border: "1px solid #C8102E33" }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 rounded-xl text-base font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: "var(--red)", color: "white", fontFamily: "Merriweather, serif" }}
      >
        {submitting ? "⏳ Submitting…" : "🚨 Submit Report"}
      </button>

      <p className="text-center text-xs" style={{ color: "var(--gray-500)" }}>
        Reports are visible to the community immediately. Please report responsibly.
      </p>
    </form>
  );
}
