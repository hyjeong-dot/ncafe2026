import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const API_BASE = (process.env.API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

/**
 * 이미지 프록시 API Route
 * /api/images/:path* -> backend /upload/:path* 
 * (유저님의 백엔드 저장소 경로인 /upload에 맞춰 매핑)
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const imagePath = path.join('/');

    // 유저님의 백엔드 이미지 저장 경로가 /upload/ 이므로 이를 반영합니다.
    const targetUrl = `${API_BASE}/upload/${imagePath}`;

    try {
        const proxyRes = await fetch(targetUrl, {
            cache: 'no-store',
        });

        if (!proxyRes.ok) {
            return new NextResponse(null, { status: proxyRes.status });
        }

        const responseHeaders = new Headers();
        const contentType = proxyRes.headers.get('content-type');
        if (contentType) {
            responseHeaders.set('content-type', contentType);
        }

        // 이미지 캐싱 설정 (1시간 동안 브라우저가 저장)
        responseHeaders.set('cache-control', 'public, max-age=3600');

        return new NextResponse(proxyRes.body, {
            status: 200,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('Image proxy error:', error);
        return new NextResponse(null, { status: 500 });
    }
}
