import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    turbo: {
        enabled: false,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
            }
        ]
    }
};

export default nextConfig;