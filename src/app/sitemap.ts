import type { MetadataRoute } from "next";
import { articles } from "@/data/articles";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    ...articles.map((article) => ({
      url: `${SITE_URL}/irasok/${article.slug}`,
      lastModified: new Date(article.datePublished),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
