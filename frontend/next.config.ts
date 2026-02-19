import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl = process.env.API_URL || 'http://localhost:8080';
    const enableProxy = process.env.NODE_ENV === "development" || process.env.ENABLE_PROXY === "true";

    if (enableProxy) {
      return [
        {
          // 1. 브라우저가 호출하는 주소
          source: '/api/:path*',
          // 2. 실제로 데이터를 가져올 주소 (로컬 스프링 부트 또는 도커 컨테이너)
          destination: `${apiUrl}/:path*`,
        },
        {
          // 업로드된 이미지 등 정적 파일 전용 통로
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
