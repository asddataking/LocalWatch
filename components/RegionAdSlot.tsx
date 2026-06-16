export interface RegionAdContent {
  sponsorName: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaUrl?: string;
  icon?: string;
  accentColor?: string;
}

interface RegionAdSlotProps {
  ad?: RegionAdContent | null;
  regionName?: string;
  placement?: "banner" | "sidebar" | "feed";
  compact?: boolean;
}

export default function RegionAdSlot({
  ad,
  regionName,
  placement = "banner",
  compact = false,
}: RegionAdSlotProps) {
  const accent = ad?.accentColor ?? "#0D1B3E";

  if (!ad) {
    return (
      <div
        className={`w-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 relative overflow-hidden bg-gray-50 group transition-colors hover:border-gray-400 hover:bg-gray-100 ${
          compact ? "p-4 my-0" : "p-4 my-6"
        }`}
      >
        <div className="absolute top-0 right-0 bg-gray-200 text-gray-500 text-[10px] font-bold uppercase px-2 py-0.5 rounded-bl-lg z-10">
          Sponsored · {regionName ?? "Local"}
        </div>
        <div className="text-center opacity-70 group-hover:opacity-100 transition-opacity">
          <span className="text-2xl block mb-1">🏷️</span>
          <h3 className="text-sm font-bold text-gray-700">Your Ad Here</h3>
          <p className="text-xs text-gray-500">
            {regionName
              ? `Reach neighbors in ${regionName}.`
              : "Support your local community."}
          </p>
          <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wide">
            {placement} placement available
          </p>
        </div>
      </div>
    );
  }

  if (compact || placement === "sidebar") {
    return (
      <div className="rounded-xl p-5 border border-gray-200 bg-white shadow-sm relative overflow-hidden">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Sponsored · {regionName ?? ad.sponsorName}
        </span>
        <div className="flex items-start gap-3 mt-3">
          <div
            className="w-11 h-11 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: `${accent}15`, color: accent }}
          >
            {ad.icon ?? "🏷️"}
          </div>
          <div className="min-w-0">
            <h4
              className="font-bold text-gray-900 mb-1 text-sm"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              {ad.title}
            </h4>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">{ad.description}</p>
            {ad.ctaUrl ? (
              <a
                href={ad.ctaUrl}
                target="_blank"
                rel="noreferrer sponsored"
                className="inline-block text-xs font-bold px-3 py-1.5 rounded-lg no-underline"
                style={{
                  background: "white",
                  border: `1px solid ${accent}44`,
                  color: accent,
                }}
              >
                {ad.ctaLabel} →
              </a>
            ) : (
              <span
                className="inline-block text-xs font-bold px-3 py-1.5 rounded-lg"
                style={{
                  background: "white",
                  border: `1px solid ${accent}44`,
                  color: accent,
                }}
              >
                {ad.ctaLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-xl border relative overflow-hidden ${
        compact ? "my-0" : "my-6"
      }`}
      style={{ borderColor: `${accent}33`, background: `${accent}08` }}
    >
      <div className="absolute top-0 right-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-bl-lg z-10"
        style={{ background: accent, color: "white" }}
      >
        Sponsored · {regionName ?? ad.sponsorName}
      </div>
      <div className="p-5 flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${accent}18`, color: accent }}
        >
          {ad.icon ?? "🏷️"}
        </div>
        <div className="flex-grow min-w-0">
          <p className="text-xs font-semibold text-gray-500 mb-1">{ad.sponsorName}</p>
          <h3
            className="text-lg font-bold text-gray-900 mb-1"
            style={{ fontFamily: "Merriweather, serif" }}
          >
            {ad.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{ad.description}</p>
          {ad.ctaUrl ? (
            <a
              href={ad.ctaUrl}
              target="_blank"
              rel="noreferrer sponsored"
              className="inline-flex items-center gap-1 text-sm font-bold no-underline"
              style={{ color: accent }}
            >
              {ad.ctaLabel} →
            </a>
          ) : (
            <span className="text-sm font-bold" style={{ color: accent }}>
              {ad.ctaLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
