import type { MetadataRoute } from "next";

const BASE_URL = "https://celpipwritingpractice.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
