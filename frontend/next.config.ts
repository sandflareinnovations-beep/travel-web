import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/utils/:path*',
        destination: 'http://13.228.159.25:3001/utils/:path*',
      },
    ];
  },
};

export default nextConfig;
