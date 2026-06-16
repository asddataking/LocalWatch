"use client";

import Link from "next/link";
import { useState } from "react";
import { UserButton, useAuth } from "@clerk/nextjs";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <header
      style={{ background: "var(--navy)" }}
      className="sticky top-0 z-50 shadow-lg"
    >
      <div className="max-w-6xl mx-auto px-4 py-0">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group no-underline">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-black shadow-inner flex-shrink-0"
              style={{ background: "var(--red)", color: "var(--white)" }}
            >
              ★
            </div>
            <div>
              <div
                className="text-2xl font-black tracking-tight leading-none"
                style={{ fontFamily: "Merriweather, serif", color: "var(--white)" }}
              >
                LocalWatch
              </div>
              <div
                className="text-xs font-medium tracking-wide hidden sm:block"
                style={{ color: "var(--gold)" }}
              >
                Community-powered neighborhood awareness.
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/#map"
              className="text-sm font-semibold no-underline transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              Alerts
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold no-underline transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              About
            </Link>
            {isLoaded && !isSignedIn && (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-semibold no-underline transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 active:scale-95 border"
                  style={{
                    borderColor: "rgba(255,255,255,0.35)",
                    color: "var(--white)",
                    textDecoration: "none",
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
            {isLoaded && isSignedIn && (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            )}
            <Link
              href="/submit"
              className="px-5 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-md"
              style={{
                background: "var(--red)",
                color: "var(--white)",
                textDecoration: "none",
              }}
            >
              + Report Something
            </Link>
          </nav>

          <button
            className="md:hidden text-white text-2xl p-2 rounded focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3 border-t border-white/10 pt-3">
            <Link
              href="/#map"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold no-underline py-2"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              📍 Alerts
            </Link>
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold no-underline py-2"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              About
            </Link>
            {isLoaded && !isSignedIn && (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold no-underline py-2"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMenuOpen(false)}
                  className="text-center px-5 py-3 rounded-lg text-sm font-bold border"
                  style={{
                    borderColor: "rgba(255,255,255,0.35)",
                    color: "var(--white)",
                    textDecoration: "none",
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
            {isLoaded && isSignedIn && (
              <div className="flex items-center gap-3 py-2">
                <UserButton />
                <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                  Account
                </span>
              </div>
            )}
            <Link
              href="/submit"
              onClick={() => setMenuOpen(false)}
              className="text-center px-5 py-3 rounded-lg text-sm font-bold"
              style={{
                background: "var(--red)",
                color: "var(--white)",
                textDecoration: "none",
              }}
            >
              + Report Something
            </Link>
          </div>
        )}
      </div>

      <div
        style={{
          height: "4px",
          background: "linear-gradient(90deg, var(--navy) 0%, var(--red) 50%, var(--gold) 100%)",
        }}
      />
    </header>
  );
}
