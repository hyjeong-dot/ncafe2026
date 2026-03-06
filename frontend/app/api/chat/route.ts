import { NextRequest, NextResponse } from 'next/server';

const AGENT_BASE = process.env.AGENT_BASE_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Agent Server로 요청 프록시
        const targetUrl = `${AGENT_BASE}/chat`;

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Agent Server responded with status: ${response.status}`);
        }

        // 스트리밍 응답 지원 (sse)
        if (body.stream && response.headers.get('content-type')?.includes('text/event-stream')) {
            return new NextResponse(response.body, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                },
            });
        }

        const data = await response.json();

        // Agent Server의 응답 포맷 { content: ".." } 를 프론트엔드 포맷 { reply: ".." }로 매핑 (필요시)
        return NextResponse.json({ reply: data.content });

    } catch (error) {
        console.error('Agent proxy error:', error);
        return NextResponse.json(
            { reply: '죄송해요, AI 에이전트 서버 연결에 실패했어요. 잠시 후 다시 시도해주세요! 🫠' },
            { status: 200 } // 에러시에도 채팅창에서 처리할 수 있도록 200 응답 유지 (기존 프론트엔드 호환성)
        );
    }
}
