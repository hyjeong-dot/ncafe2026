import { NextRequest, NextResponse } from 'next/server';
import http from 'http';

const AGENT_BASE = process.env.AGENT_BASE_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const payload = JSON.stringify(body);

        // 스트리밍 요청: Node.js http 모듈로 버퍼링 없이 전달
        if (body.stream) {
            const stream = await requestStreamFromAgent(payload);
            return new NextResponse(stream, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache, no-transform',
                    'Connection': 'keep-alive',
                    'X-Accel-Buffering': 'no',
                },
            });
        }

        // 일반 JSON 요청 (스트리밍이 아닌 경우)
        const response = await fetch(`${AGENT_BASE}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
        });

        if (!response.ok) {
            throw new Error(`Agent Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json({ reply: data.content });

    } catch (error) {
        console.error('Agent proxy error:', error);
        return NextResponse.json(
            { reply: '죄송해요, AI 에이전트 서버 연결에 실패했어요. 잠시 후 다시 시도해주세요! 🫠' },
            { status: 200 }
        );
    }
}

function requestStreamFromAgent(payload: string): Promise<ReadableStream<Uint8Array>> {
    const url = new URL(`${AGENT_BASE}/chat`);

    return new Promise((resolve, reject) => {
        const httpReq = http.request(
            {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(payload),
                },
            },
            (res) => {
                if (res.statusCode && res.statusCode >= 400) {
                    reject(new Error(`Agent Server responded with status: ${res.statusCode}`));
                    return;
                }

                const stream = new ReadableStream<Uint8Array>({
                    start(controller) {
                        res.on('data', (chunk: Buffer) => {
                            controller.enqueue(new Uint8Array(chunk));
                        });
                        res.on('end', () => {
                            controller.close();
                        });
                        res.on('error', (err) => {
                            controller.error(err);
                        });
                    },
                    cancel() {
                        res.destroy();
                    },
                });

                resolve(stream);
            }
        );

        httpReq.on('error', reject);
        httpReq.write(payload);
        httpReq.end();
    });
}
