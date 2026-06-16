import type { Metadata } from "next";
import Link from "next/link";
import WorkWithUsForm from "@/components/WorkWithUsForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work with Us",
  description:
    "Partner with LocalWatch — sponsor regional ad placements or explore community partnerships in your area.",
  alternates: { canonical: "/work-with-us" },
  openGraph: {
    title: `Work with Us | ${siteConfig.name}`,
    description: "Reach neighbors in your region through LocalWatch sponsorship and partnerships.",
    url: "/work-with-us",
    images: [siteConfig.ogImage],
  },
};

export default function WorkWithUsPage() {
  return (
    <div style={{ background: "var(--off-white)", minHeight: "100vh" }}>
      <div
        style={{
          background: "linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 100%)",
        }}
        className="text-white"
      >
        <div className="max-w-2xl mx-auto px-4 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold mb-6 no-underline opacity-80 hover:opacity-100 transition-opacity"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            ← Back to Home
          </Link>
          <h1
            className="text-3xl md:text-4xl font-black mb-2 leading-tight"
            style={{ fontFamily: "Merriweather, serif" }}
          >
            Work with Us
          </h1>
          <p className="opacity-80 text-base leading-relaxed">
            Put your business in front of neighbors who care about their community. Each region has
            dedicated banner, sidebar, and in-feed sponsorship slots.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: "📢", title: "Banner", text: "Top placement on your region's home feed" },
            { icon: "📌", title: "Sidebar", text: "Persistent visibility beside the map" },
            { icon: "📋", title: "In-feed", text: "Sponsored cards inside the report list" },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm"
            >
              <span className="text-2xl">{item.icon}</span>
              <h2 className="font-bold mt-2 text-sm" style={{ color: "var(--navy)" }}>
                {item.title}
              </h2>
              <p className="text-xs text-gray-500 mt-1">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2
            className="text-xl font-bold mb-1"
            style={{ fontFamily: "Merriweather, serif", color: "var(--navy)" }}
          >
            Get in touch
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Fill out the form below and we&apos;ll follow up with availability and pricing for your
            area.
          </p>
          <WorkWithUsForm />
        </div>
      </div>
    </div>
  );
}
