import type { NextConfig } from "next";

// GitHub Pages serves the site from /ClearPath/. Vercel, which sets VERCEL=1 at
// build time, serves it from the root.
const basePath = process.env.VERCEL ? "" : "/ClearPath";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // Without it the prefetch for the basePath root asks for /ClearPath.txt, which a static host cannot serve.
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  transpilePackages: ["@paper-design/shaders-react", "@paper-design/shaders"],
  images: {
    unoptimized: true,
    // Declared so the one quality the pages ask for stays valid under Next 16,
    // which stops accepting undeclared values.
    qualities: [100],
  },
};

export default nextConfig;
