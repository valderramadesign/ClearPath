import type { Metadata, Viewport } from "next";
import { League_Spartan, JetBrains_Mono, PT_Serif } from "next/font/google";
import "./globals.css";
import { ContactProvider } from "@/components/ui/contact-modal";
import { CLEARPATH } from "@/lib/content";
import { withBasePath } from "@/lib/base-path";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-league-spartan",
});

const ptSerif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains-mono",
});

// Libertinus Serif Display is self-hosted via public/fonts/ + globals.css @font-face
// Download from: https://github.com/alerque/libertinus/releases

const siteTitle = `${CLEARPATH.name} — Process improvement and automation`;

const themeInitializer = `
  try {
    var savedTheme = localStorage.getItem("tim-v-theme");
    var theme = savedTheme === "day" ? "day" : "dark";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === "day" ? "light" : "dark";
  } catch (_) {
    document.documentElement.dataset.theme = "dark";
  }
`;

export const metadata: Metadata = {
  metadataBase: new URL(CLEARPATH.url),
  title: siteTitle,
  description: CLEARPATH.description,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  // Follows the browser's own light/dark chrome, not the site toggle: the blue
  // mark's black half disappears on a dark tab bar, so dark tabs get the white one.
  icons: {
    icon: [
      { url: withBasePath("/icons/favicon-blue.ico"), sizes: "any", media: "(prefers-color-scheme: light)" },
      { url: withBasePath("/icons/favicon-dark.ico"), sizes: "any", media: "(prefers-color-scheme: dark)" },
      { url: withBasePath("/icons/clearpath-favicon-blue-32.png"), type: "image/png", sizes: "32x32", media: "(prefers-color-scheme: light)" },
      { url: withBasePath("/icons/clearpath-favicon-dark-32.png"), type: "image/png", sizes: "32x32", media: "(prefers-color-scheme: dark)" },
    ],
    // iOS fills the transparent corners with black, so the white version reads.
    apple: withBasePath("/icons/apple-touch-icon-dark.png"),
  },
  openGraph: {
    type: "website",
    url: CLEARPATH.url,
    siteName: CLEARPATH.name,
    title: siteTitle,
    description: CLEARPATH.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: CLEARPATH.description,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${CLEARPATH.url}/#organization`,
      name: CLEARPATH.name,
      url: CLEARPATH.url,
      email: `mailto:${CLEARPATH.email}`,
      description: CLEARPATH.description,
      founder: CLEARPATH.about.people.map((person) => ({ "@type": "Person", name: person.name })),
    },
    {
      "@type": "WebSite",
      "@id": `${CLEARPATH.url}/#website`,
      url: CLEARPATH.url,
      name: CLEARPATH.name,
      description: CLEARPATH.description,
      publisher: { "@id": `${CLEARPATH.url}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${leagueSpartan.variable} ${jetbrainsMono.variable} ${ptSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializer }} />
      </head>
      <body className="theme-site bg-black antialiased" suppressHydrationWarning>
        <ContactProvider>{children}</ContactProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
