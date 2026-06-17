"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem =
  | { href: string; label: string; icon: string; match: (path: string) => boolean }
  | { href: string; label: string; icon: string; primary: true }
  | { href: string; label: string; icon: string; scrollTo: string };

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: "🏠", match: (path) => path === "/" },
  { href: "/#map", label: "Map", icon: "🗺️", scrollTo: "map" },
  { href: "/submit", label: "Report", icon: "+", primary: true },
  { href: "/about", label: "About", icon: "ℹ️", match: (path) => path.startsWith("/about") },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) {
    if (!("scrollTo" in item)) return;
    e.preventDefault();
    if (pathname !== "/") {
      window.location.href = `/#${item.scrollTo}`;
      return;
    }
    document.getElementById(item.scrollTo)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 mobile-bottom-nav animate-slide-up"
      aria-label="Mobile navigation"
    >
      <div className="mobile-bottom-nav-inner">
        {NAV_ITEMS.map((item) => {
          if ("primary" in item) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-nav-fab no-underline"
                aria-label={item.label}
              >
                <span className="mobile-nav-fab-ring" aria-hidden />
                <span className="text-2xl font-bold leading-none">{item.icon}</span>
              </Link>
            );
          }

          const isActive = "match" in item && item.match(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item)}
              className={`mobile-nav-item no-underline ${isActive ? "mobile-nav-item-active" : ""}`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
