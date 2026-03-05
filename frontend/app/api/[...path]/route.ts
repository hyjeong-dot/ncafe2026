import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8080';

async function proxyRequest(req: NextRequest) {
    const session = await getSession();
    const { pathname, search } = req.nextUrl;

    // /api로 시작하면 /api를 제거하고, /upload로 시작하면 그대로 사용
    const apiPath = pathname.startsWith('/api') ? pathname.replace(/^\/api/, '') : pathname;
    const targetUrl = `${API_BASE}${apiPath}${search}`;

    const headers = new Headers();

    // Copy necessary headers from the original request
    const headerKeys = ['content-type', 'accept'];
    headerKeys.forEach(key => {
        const value = req.headers.get(key);
        if (value) headers.set(key, value);
    });

    // Inject JWT if session exists
    if (session.token) {
        headers.set('Authorization', `Bearer ${session.token}`);
    }

    let body: any = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        const contentType = req.headers.get('content-type');
        if (contentType?.includes('multipart/form-data')) {
            body = await req.blob();
        } else {
            body = await req.text();
        }
    }

    try {
        const proxyRes = await fetch(targetUrl, {
            method: req.method,
            headers,
            body,
        });

        if (proxyRes.status === 401 && session.token) {
            // Session probably expired
            session.destroy();
        }

        // Prepare response headers
        const responseHeaders = new Headers();
        const resContentType = proxyRes.headers.get('content-type');
        if (resContentType) {
            responseHeaders.set('Content-Type', resContentType);
        }

        return new NextResponse(proxyRes.body, {
            status: proxyRes.status,
            statusText: proxyRes.statusText,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ message: 'Internal Server Error (Proxy)' }, { status: 500 });
    }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
