import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl = process.env.API_URL || 'http://localhost:8080';
    const enableProxy = process.env.NODE_ENV === "development" || process.env.ENABLE_PROXY === "true";

    if (enableProxy) {
      return {
        fallback: [
          {
            // 이미지 경로 매핑 (/upload/images/**)
            source: '/upload/images/:path*',
            destination: `${apiUrl}/upload/images/:path*`,
          },
          {
            // 기존 /images/** 매핑 유지 (로컬 프론트엔드에 없는 이미지만 서버로 요펑)
            source: '/images/:path*',
            destination: `${apiUrl}/images/:path*`,
          },
        ]
      };
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
