import type { MetadataRoute } from "next";

import { CLEARPATH } from "@/lib/content";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${CLEARPATH.url}/sitemap.xml`,
  };
}
