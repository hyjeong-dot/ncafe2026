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

    // Copy necessary headers from the original request (excluding sensitive or connection-related ones)
    const skipHeaders = ['host', 'cookie', 'connection', 'keep-alive', 'transfer-encoding'];
    req.headers.forEach((value, key) => {
        if (!skipHeaders.includes(key.toLowerCase())) {
            headers.set(key, value);
        }
    });

    // Inject JWT if session exists
    if (session.token) {
        headers.set('Authorization', `Bearer ${session.token}`);
    }

    let body: any = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        const contentType = req.headers.get('content-type');
        if (contentType?.includes('multipart/form-data')) {
            // Reconstruct FormData for reliable proxying
            const formData = await req.formData();
            const newFormData = new FormData();
            formData.forEach((value, key) => {
                newFormData.append(key, value);
            });
            body = newFormData;
            // Next.js internal fetch doesn't need Content-Type manually set for FormData, 
            // it will set it along with the appropriate boundary string.
            headers.delete('content-type');
        } else {
            body = await req.text();
        }
    }

    try {
        const proxyRes = await fetch(targetUrl, {
            method: req.method,
            headers,
            body,
            // @ts-ignore - 'duplex' might not be in the type definition but is required for streaming bodies in some versions
            duplex: 'half',
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
