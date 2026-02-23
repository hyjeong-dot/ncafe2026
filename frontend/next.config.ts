import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl = process.env.API_URL || 'http://localhost:8080';
    const enableProxy = process.env.NODE_ENV === "development" || process.env.ENABLE_PROXY === "true";

    if (enableProxy) {
      return [
        {
          // 프론트엔드의 /api/menus 호출을 백엔드의 /menus로 매핑
          source: '/api/menus',
          destination: `${apiUrl}/menus`,
        },
        {
          // 프론트엔드의 /api/categories 호출을 백엔드의 /categories로 매핑
          source: '/api/categories',
          destination: `${apiUrl}/categories`,
        },
        {
          // 관리자 API 매핑: /api/admin/menus -> /admin/menus
          source: '/api/admin/:path*',
          destination: `${apiUrl}/admin/:path*`,
        },
        {
          // 기타 /api/:path* 전체에 대한 기본 매핑 (필요 시)
          source: '/api/:path*',
          destination: `${apiUrl}/api/:path*`,
        },
        {
          // 이미지 경로 매핑 (/upload/images/**)
          source: '/upload/images/:path*',
          destination: `${apiUrl}/upload/images/:path*`,
        },
        {
          // 기존 /images/** 매핑 유지
          source: '/images/:path*',
          destination: `${apiUrl}/images/:path*`,
        },
      ];
    }
    return [];
  },
  images: {
    unoptimized: true, // 로컬 개발용
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
