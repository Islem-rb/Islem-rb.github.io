import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export: `npm run build` writes the whole site to `out/`,
  // which any static host (GitHub Pages, Vercel, Netlify, Cloudflare Pages) can serve.
  output: "export",
  // /about -> /about/index.html, which static hosts resolve without rewrites.
  trailingSlash: true,
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
