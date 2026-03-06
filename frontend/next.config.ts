import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // 이미지 요청을 BFF 프록시(/api/upload/images)로 전달하여 런타임 환경변수(API_BASE_URL)를 타게 함
        source: '/upload/images/:path*',
        destination: '/api/upload/images/:path*',
      },
      {
        source: '/images/:path*',
        destination: '/api/images/:path*',
      },
    ];
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
