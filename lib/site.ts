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
    "LocalWatch — Know what's happening around you. Community safety app with real-time reports for public safety, traffic, fire & EMS, lost pets, and weather.",
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
  regionTowns: {
    "blue-water-area": ["Port Huron", "Marysville", "St. Clair", "Marine City", "Algonac"],
    "metro-detroit": ["Detroit", "Royal Oak", "Dearborn", "Warren", "Livonia", "Taylor"],
    "north-atlanta": ["Alpharetta", "Roswell", "Marietta", "Sandy Springs"],
    "tampa-bay": ["Tampa", "St. Petersburg", "Clearwater", "Brandon"],
    "grand-rapids-area": ["Grand Rapids", "Wyoming", "Kentwood", "Walker"],
    "flint-area": ["Flint", "Burton", "Grand Blanc", "Fenton"],
    "lansing-area": ["Lansing", "East Lansing", "Delta Township", "Okemos"],
  } as Record<string, string[]>,
  social: {
    twitter: "https://twitter.com/LocalWatchHQ",
    facebook: "https://facebook.com/LocalWatchHQ",
    instagram: "https://instagram.com/LocalWatchHQ",
  },
} as const;

export function absoluteUrl(path = ""): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
