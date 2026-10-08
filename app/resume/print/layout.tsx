import type { Metadata } from "next";

import { SITE } from "@/lib/content";

const title = `Résumé — ${SITE.name}`;

export const metadata: Metadata = {
  title,
  description: `Résumé of ${SITE.name}. ${SITE.shortBio}`,
  alternates: { canonical: "/resume/print" },
  openGraph: {
    type: "profile",
    url: `${SITE.url}/resume/print`,
    siteName: SITE.name,
    title,
    description: SITE.shortBio,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: SITE.shortBio,
  },
};

export default function ResumePrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
