import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "LocalWatch — Community-powered neighborhood awareness",
  description:
    "LocalWatch helps your community share and track local safety reports on an interactive map. Submit reports, confirm sightings, and stay informed about your neighborhood.",
  keywords: ["neighborhood watch", "community safety", "local reports", "neighborhood awareness", "crime map", "local hazards"],
  authors: [{ name: "LocalWatch Community" }],
  creator: "LocalWatch",
  openGraph: {
    title: "LocalWatch — Know What's Happening In Your Neighborhood",
    description: "Community-powered neighborhood awareness. View local safety reports on an interactive map and feed.",
    url: "https://local-watch-ashen.vercel.app",
    siteName: "LocalWatch",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LocalWatch — Neighborhood Awareness",
    description: "Submit reports, confirm sightings, and stay informed about your neighborhood.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ClerkProvider afterSignOutUrl="/">
          <ConvexClientProvider>
            <Header />
            <main>{children}</main>
          </ConvexClientProvider>
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
