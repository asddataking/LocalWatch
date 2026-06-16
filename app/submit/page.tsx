import type { Metadata } from "next";
import SubmitForm from "@/components/SubmitForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Submit a Report — LocalWatch",
  description:
    "Submit a local safety or awareness report to LocalWatch. Help your neighbors stay informed.",
};

export default function SubmitPage() {
  return (
    <div style={{ background: "var(--off-white)", minHeight: "100vh" }}>
      {/* Page header */}
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
            ← Back to Feed
          </Link>
          <h1
            className="text-3xl md:text-4xl font-black mb-2 leading-tight"
            style={{ fontFamily: "Merriweather, serif" }}
          >
            Submit a Report
          </h1>
          <p className="opacity-80 text-base">
            Help your community by sharing what you observed. All reports are
            community-reviewed.
          </p>
        </div>
        <div style={{ background: "var(--off-white)" }}>
          <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            <path d="M0 32V16C360 0 720 0 1080 16C1260 24 1380 28 1440 16V32H0Z" fill="#0D1B3E" />
          </svg>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <SubmitForm />
        </div>
      </div>
    </div>
  );
}
