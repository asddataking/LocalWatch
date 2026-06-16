"use client";

export const CATEGORIES = [
  { label: "All", value: "all", color: "#0D1B3E" },
  { label: "Public Safety", value: "Public Safety", color: "#C8102E" },
  { label: "Fire & EMS", value: "Fire & EMS", color: "#E03C31" },
  { label: "Traffic", value: "Traffic", color: "#D4A200" },
  { label: "Lost & Found Pets", value: "Lost & Found Pets", color: "#7B2D8B" },
  { label: "Power Outages", value: "Power Outages", color: "#666666" },
  { label: "Weather", value: "Weather", color: "#0077CC" },
  { label: "School Alerts", value: "School Alerts", color: "#009688" },
  { label: "Community Alerts", value: "Community Alerts", color: "#E07B00" },
];

export const CATEGORY_ICONS: Record<string, string> = {
  "Public Safety": "🚓",
  "Fire & EMS": "🚒",
  "Traffic": "🚧",
  "Lost & Found Pets": "🐕",
  "Power Outages": "⚡",
  "Weather": "🌪",
  "School Alerts": "🏫",
  "Community Alerts": "📢",
};

interface CategoryFilterProps {
  active: string;
  onChange: (val: string) => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-150 hover:scale-105 active:scale-95 whitespace-nowrap"
            style={{
              background: isActive ? cat.color : "transparent",
              color: isActive ? "#fff" : cat.color,
              borderColor: cat.color,
              boxShadow: isActive ? `0 2px 8px ${cat.color}44` : "none",
            }}
          >
            {cat.value !== "all" && CATEGORY_ICONS[cat.value]
              ? `${CATEGORY_ICONS[cat.value]} `
              : ""}
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
