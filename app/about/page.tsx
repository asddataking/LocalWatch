import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About LocalWatch",
  description:
    "Learn how LocalWatch helps communities share real-time safety reports, verify incidents together, and stay informed — free and anonymous.",
};

export default function AboutPage() {
  return (
    <div style={{ background: "var(--off-white)" }} className="min-h-screen">
      <section
        className="text-white py-16 md:py-20"
        style={{
          background: `linear-gradient(135deg, rgba(8,18,40,0.94), rgba(13,27,62,0.9)), url('${siteConfig.ogImage}') center/cover no-repeat`,
        }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ fontFamily: "Merriweather, serif" }}
          >
            Neighbors Looking Out for Neighbors
          </h1>
          <p className="text-lg opacity-90 leading-relaxed">
            LocalWatch is a free, community-driven way to see what&apos;s happening around you —
            and share what you observe responsibly.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "Merriweather, serif", color: "var(--navy)" }}>
            How It Works
          </h2>
          <ol className="space-y-4">
            {[
              {
                step: "1",
                title: "See something",
                body: "Notice a safety issue, traffic problem, lost pet, or weather hazard in your area.",
              },
              {
                step: "2",
                title: "Report it",
                body: "Submit a report in under a minute. No account required — stay anonymous if you prefer.",
              },
              {
                step: "3",
                title: "Community verifies",
                body: "Neighbors confirm or flag reports. The more confirmations, the more trusted a report becomes.",
              },
              {
                step: "4",
                title: "Stay informed",
                body: "View reports on the map and feed for your region. Know what's happening before you head out.",
              },
            ].map((item) => (
              <li key={item.step} className="flex gap-4">
                <span
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
                  style={{ background: "var(--red)", color: "white" }}
                >
                  {item.step}
                </span>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: "var(--navy)" }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="rounded-xl p-6 border"
          style={{ background: "#FFF9E6", borderColor: "var(--gold)" }}
        >
          <h2 className="text-xl font-bold mb-3" style={{ color: "var(--navy)" }}>
            Community Guidelines
          </h2>
          <ul className="space-y-2 text-gray-700 text-sm leading-relaxed list-disc pl-5">
            <li>Report what you observed — not accusations or personal information.</li>
            <li>Do not post names, license plates, private addresses, or identifying details.</li>
            <li>Use general locations only (street name or intersection, not house numbers).</li>
            <li>Confirm reports you personally witnessed; flag inaccurate or abusive content.</li>
            <li>Reports with multiple abuse flags are hidden pending review.</li>
          </ul>
        </section>

        <section className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: "✓", title: "Community Verified", text: "Reports earn trust through neighbor confirmations." },
            { icon: "👥", title: "No Login Required", text: "Submit anonymously anytime. Register to build trust over time." },
            { icon: "🛡️", title: "Moderator Reviewed", text: "High-abuse reports are flagged for admin review." },
            { icon: "🇺🇸", title: "Not for Profit", text: "Built for communities, not surveillance or profit." },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <span className="text-2xl">{card.icon}</span>
              <h3 className="font-bold mt-2" style={{ color: "var(--navy)" }}>
                {card.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{card.text}</p>
            </div>
          ))}
        </section>

        <div className="flex flex-wrap gap-4 pt-4">
          <Link
            href="/submit"
            className="px-8 py-3 rounded-xl font-bold no-underline text-white"
            style={{ background: "var(--red)" }}
          >
            + Report Something
          </Link>
          <Link
            href="/#map"
            className="px-8 py-3 rounded-xl font-bold no-underline border-2"
            style={{ borderColor: "var(--navy)", color: "var(--navy)" }}
          >
            View Map
          </Link>
        </div>
      </div>
    </div>
  );
}
