import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: absoluteUrl("/submit"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/work-with-us"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    },
  ];

  const regionPages: MetadataRoute.Sitemap = siteConfig.regions.map((region) => ({
    url: absoluteUrl(`/?region=${region.slug}`),
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: 0.85,
  }));

  return [...staticPages, ...regionPages];
}
