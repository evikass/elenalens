import type { NextConfig } from "next";

// For GitHub Pages deployment we export the site as static HTML.
// basePath / assetPrefix are derived from the repo name so that
// assets load correctly from https://<user>.github.io/<repo>/.
const isProd = process.env.NODE_ENV === "production";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] || "elenalens";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
