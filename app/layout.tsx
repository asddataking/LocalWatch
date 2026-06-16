import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "LocalWatch — Community-powered neighborhood awareness",
  description:
    "LocalWatch helps your community share and track local safety reports on an interactive map. Submit reports, confirm sightings, and stay informed about your neighborhood.",
  keywords: ["neighborhood watch", "community safety", "local reports", "neighborhood awareness"],
  openGraph: {
    title: "LocalWatch",
    description: "Community-powered neighborhood awareness.",
    type: "website",
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
        <ConvexClientProvider>
          <Header />
          <main>{children}</main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
