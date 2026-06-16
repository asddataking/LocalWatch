export const siteConfig = {
  name: "LocalWatch",
  legalName: "LocalWatch",
  title: "LocalWatch — Know What's Happening Around You",
  description:
    "Real-time local safety reports from real neighbors. Free, community-driven awareness for public safety, traffic, fire & EMS, weather, lost pets, and more.",
  tagline: "See it. Report it. Help keep your community safe.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://localwatchhq.com",
  ogImage: "/localwatch-social-share.jpg",
  ogImageAlt:
    "LocalWatch app preview showing a neighborhood map with real-time community safety reports for Metro Detroit.",
  twitterHandle: "@LocalWatchHQ",
  googleAnalyticsId: "G-9MGV43PBK1",
  keywords: [
    "localwatch",
    "neighborhood watch",
    "community safety",
    "local safety reports",
    "crime map",
    "traffic alerts",
    "lost and found pets",
    "weather alerts",
    "power outages",
    "metro detroit safety",
    "community awareness",
    "neighborhood alerts",
  ],
  regions: [
    { name: "Blue Water Area", slug: "blue-water-area" },
    { name: "Metro Detroit", slug: "metro-detroit" },
    { name: "North Atlanta", slug: "north-atlanta" },
    { name: "Tampa Bay", slug: "tampa-bay" },
    { name: "Grand Rapids Area", slug: "grand-rapids-area" },
    { name: "Flint Area", slug: "flint-area" },
    { name: "Lansing Area", slug: "lansing-area" },
  ],
} as const;

export function absoluteUrl(path = ""): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
