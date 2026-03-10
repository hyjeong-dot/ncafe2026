import { NextRequest, NextResponse } from 'next/server';

const AGENT_BASE = process.env.AGENT_BASE_URL || 'http://localhost:8000';

async function proxyAgentRequest(req: NextRequest) {
    const { pathname, search } = req.nextUrl;

    // /api/agent/rag/upload -> /rag/upload
    const agentPath = pathname.replace(/^\/api\/agent/, '');
    const targetUrl = `${AGENT_BASE}${agentPath}${search}`;

    const headers = new Headers();
    const skipHeaders = ['host', 'cookie', 'connection', 'keep-alive', 'transfer-encoding', 'content-length'];
    req.headers.forEach((value, key) => {
        if (!skipHeaders.includes(key.toLowerCase())) {
            headers.set(key, value);
        }
    });

    let body: any = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        body = await req.text();
    }

    try {
        const proxyRes = await fetch(targetUrl, {
            method: req.method,
            headers,
            body,
        });

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
        console.error('Agent Proxy error:', error);
        return NextResponse.json({ message: 'Agent Server Not Responding' }, { status: 504 });
    }
}

export const GET = proxyAgentRequest;
export const POST = proxyAgentRequest;
export const PUT = proxyAgentRequest;
export const DELETE = proxyAgentRequest;
export const PATCH = proxyAgentRequest;
