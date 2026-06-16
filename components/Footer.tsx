import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 pt-12 pb-8 text-sm bg-[#0D1B3E] text-white/80 border-t-4 border-[#C8102E]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-3 text-white no-underline group">
              <span
                className="text-2xl font-black tracking-tight flex items-center gap-2"
                style={{ fontFamily: "Merriweather, serif" }}
              >
                <span className="bg-[#C8102E] text-white w-8 h-8 rounded-md flex items-center justify-center text-lg shadow-sm">
                  ★
                </span>
                LocalWatch
              </span>
            </Link>
            <p className="leading-relaxed opacity-90 mb-4">
              Community-powered neighborhood awareness. See it. Report it. Help keep your community safe.
            </p>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: "rgba(245,166,35,0.15)", color: "var(--gold)" }}
            >
              🇺🇸 Made in Michigan
            </span>
          </div>

          {/* Explore */}
          <div>
            <h3
              className="text-lg font-bold text-white mb-4"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              Explore
            </h3>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/" className="hover:text-white transition-colors no-underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#map" className="hover:text-white transition-colors no-underline">
                  Map & Reports
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-white transition-colors no-underline">
                  Submit a Report
                </Link>
              </li>
              <li>
                <Link href="/work-with-us" className="hover:text-white transition-colors no-underline">
                  Work with Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors no-underline">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3
              className="text-lg font-bold text-white mb-4"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              Resources
            </h3>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/about" className="hover:text-white transition-colors no-underline">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors no-underline">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors no-underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors no-underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/work-with-us" className="hover:text-white transition-colors no-underline">
                  Work with Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors no-underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social placeholders */}
          <div>
            <h3
              className="text-lg font-bold text-white mb-4"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              Connect
            </h3>
            <div className="flex gap-3">
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-colors hover:bg-white/20 no-underline"
                style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
                aria-label="LocalWatch on X"
              >
                𝕏
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-colors hover:bg-white/20 no-underline"
                style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
                aria-label="LocalWatch on Facebook"
              >
                f
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-colors hover:bg-white/20 no-underline"
                style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
                aria-label="LocalWatch on Instagram"
              >
                in
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
          <p>
            ⚠️ Do not post personal information, names, or accusations. Report what you observed, not who you think did it.
          </p>
          <p>&copy; {currentYear} LocalWatch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
