import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Beget blocks server-side fetches for /_next/image; load TMDB URLs in the browser.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
