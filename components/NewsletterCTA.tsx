"use client";

import { useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";

interface NewsletterCTAProps {
  region: Doc<"regions"> | null;
}

export default function NewsletterCTA({ region }: NewsletterCTAProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const regionName = region ? region.name : "LocalWatch";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    
    // We would call a Convex mutation here to save the email
    // e.g. await subscribeToNewsletter({ email, regionId: region?._id })
    
    setSubmitted(true);
  }

  return (
    <div className="bg-[var(--navy-dark)] text-white rounded-xl p-6 md:p-8 my-8 shadow-lg relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
        <div className="text-[15rem]">📰</div>
      </div>

      <div className="relative z-10 max-w-xl">
        <span className="text-xs font-bold px-2 py-1 bg-[var(--red)] rounded uppercase tracking-wider mb-3 inline-block">
          Daily Briefing
        </span>
        <h3 className="text-2xl md:text-3xl font-black mb-2" style={{ fontFamily: "Merriweather, serif" }}>
          Get {regionName} Daily
        </h3>
        <p className="opacity-90 mb-6 text-sm md:text-base leading-relaxed">
          Get the most important local alerts, road closures, lost pets, weather updates, and community reports delivered each morning.
        </p>

        {submitted ? (
          <div className="bg-white/10 p-4 rounded-lg border border-white/20">
            <p className="font-bold">✅ You're on the list!</p>
            <p className="text-sm opacity-80 mt-1">Keep an eye on your inbox for tomorrow's briefing.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 py-3 rounded-lg text-gray-900 border-none focus:ring-2 focus:ring-[var(--gold)] outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "var(--red)" }}
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
