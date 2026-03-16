import { NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8080';

/**
 * SSE 전용 프록시 라우트
 * Next.js의 기본 fetch 프록시는 SSE 스트리밍을 제대로 처리하지 못하므로,
 * ReadableStream을 사용하여 직접 스트리밍합니다.
 */
export async function GET(req: NextRequest) {
    const session = await getSession();
    const targetUrl = `${API_BASE}/admin/orders/stream`;

    const headers: Record<string, string> = {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
    };

    if (session.token) {
        headers['Authorization'] = `Bearer ${session.token}`;
    }

    try {
        const backendRes = await fetch(targetUrl, {
            headers,
            // @ts-ignore
            cache: 'no-store',
        });

        if (!backendRes.ok || !backendRes.body) {
            return new Response(
                JSON.stringify({ message: 'SSE 연결 실패' }),
                { status: backendRes.status || 502 }
            );
        }

        // 백엔드 SSE 스트림을 그대로 클라이언트에 전달
        return new Response(backendRes.body, {
            status: 200,
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no', // nginx 버퍼링 방지
            },
        });
    } catch (error) {
        console.error('[SSE Proxy] 연결 오류:', error);
        return new Response(
            JSON.stringify({ message: 'SSE 프록시 오류' }),
            { status: 502 }
        );
    }
}
