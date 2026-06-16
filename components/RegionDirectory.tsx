import Link from "next/link";

export default function RegionDirectory() {
  const regions = [
    { name: "Blue Water Area", slug: "blue-water-area" },
    { name: "Metro Detroit", slug: "metro-detroit" },
    { name: "North Atlanta", slug: "north-atlanta" },
    { name: "Tampa Bay", slug: "tampa-bay" },
    { name: "Grand Rapids Area", slug: "grand-rapids-area" },
    { name: "Flint Area", slug: "flint-area" },
    { name: "Lansing Area", slug: "lansing-area" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 border-t border-gray-200 mt-12">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
        Browse LocalWatch Regions
      </h3>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {regions.map((r) => (
          <Link
            key={r.slug}
            href={`/?region=${r.slug}`}
            className="text-gray-600 hover:text-[var(--red)] transition-colors hover:underline"
          >
            {r.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
