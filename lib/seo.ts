import type { Metadata } from "next";
import { SITE, type Project } from "@/lib/content";

/**
 * Builds consistent per-case-study metadata: title, description, canonical URL,
 * Open Graph, and Twitter/X card. Copy comes from the shared PROJECTS list so a
 * page title can never drift from its case study headline.
 */
export function caseStudyMetadata(project: Project, description: string): Metadata {
  const title = `${project.caseStudyHeadline} — ${SITE.name}`;
  const url = `${SITE.url}${project.route}`;

  return {
    title,
    description,
    alternates: { canonical: project.route },
    openGraph: {
      type: "article",
      url,
      siteName: SITE.name,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
