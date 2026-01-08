import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['id', 'en'],
    defaultLocale: 'id',
    localeDetection: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api-dev.rf-berjangka.com",
        port: "",
        pathname: "/**", // Mengizinkan semua path dari domain ini
      },
      {
        protocol: "https",
        hostname: "rfbdev.newsmaker.id",
        port: "",
        pathname: "/**", // Mengizinkan semua path dari domain ini
      },
      {
        protocol: "http",
        hostname: "rfb-backend.test",
        port: "",
        pathname: "/**", // Mengizinkan semua path dari domain ini
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**", // Untuk development local
      },
    ],
    unoptimized: process.env.NODE_ENV !== "production", // Nonaktifkan optimasi di development
  },
};

export default nextConfig;
