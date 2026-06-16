import Link from "next/link";

export default function MobileReportFab() {
  return (
    <Link
      href="/submit"
      className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg transition-transform hover:scale-110 active:scale-95 no-underline"
      style={{
        background: "var(--red)",
        color: "white",
        boxShadow: "0 4px 20px rgba(200, 16, 46, 0.45)",
      }}
      aria-label="Report something"
    >
      +
    </Link>
  );
}
