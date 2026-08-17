import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.0.102',
    '192.168.0.102:3000',
    'localhost:3000',
    '*.local',
    '*.local:3000',
  ],

  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: `${backendUrl.replace(/\/$/, '')}/api/:path*`,
        },
      ],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Дозволяємо будь-які шляхи на цьому домені
      },
    ],
  },
};

export default nextConfig;