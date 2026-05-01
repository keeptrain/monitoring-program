import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/monitoring",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avwjfkzabutafobnvsmq.supabase.co",
      },
      {
        protocol: "https",
        hostname: "cdn.shadcnstudio.com",
      },
    ],
  },
};

export default nextConfig;
