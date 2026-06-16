const TRUST_ITEMS = [
  { icon: "✓", label: "Community Verified" },
  { icon: "👥", label: "Multiple Witnesses" },
  { icon: "🛡️", label: "Moderator Reviewed" },
  { icon: "🏪", label: "Local Partners" },
] as const;

export default function TrustBar() {
  return (
    <div
      className="border-b"
      style={{ background: "var(--white)", borderColor: "var(--gray-200)" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 flex-shrink-0 text-sm font-semibold"
              style={{ color: "var(--navy)" }}
            >
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                style={{ background: "var(--gray-100)" }}
              >
                {item.icon}
              </span>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
