import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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