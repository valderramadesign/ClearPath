import type { MetadataRoute } from "next";

import { CLEARPATH } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${CLEARPATH.url}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${CLEARPATH.url}/services/`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${CLEARPATH.url}/privacy/`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
