import { NextRequest, NextResponse } from 'next/server';

// =============================================
// 📌 Gemini API 연동 설정
// =============================================
// 모델: gemini-2.0-flash (빠르고 가벼운 응답에 최적화)
//
// 1. 환경변수 설정 (.env.local 또는 docker-compose.yml):
//    GEMINI_API_KEY=your-gemini-api-key-here
//
// 2. API 키가 설정되면 자동으로 Gemini API를 호출합니다.
//    API 키가 없으면 안내 메시지를 반환합니다.
// =============================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// 카페 AI 에이전트의 시스템 프롬프트
const SYSTEM_PROMPT = `당신은 "메타몽 카페"의 AI 비서입니다. 메타몽(Ditto) 포켓몬 테마의 카페에서 고객을 도와줍니다.

카페 정보:
- 이름: 메타몽 카페
- 위치: 서울특별시 강남구 테헤란로 123
- 영업시간: 매일 09:00 ~ 22:00 (라스트오더 21:30)
- 전화: 02-1234-5678
- 이메일: hello@dittocafe.kr

인기 메뉴:
- 말랑 퍼플 라떼 ₩7,000 (시그니처)
- 꾸덕 콜드브루 ₩4,500
- 초록 변신 말차 ₩6,500
- 겹겹이 초코 크로와상 ₩4,800

이벤트:
- 첫 방문 고객 오늘의 추천 음료 무료
- 10잔 적립 시 메타몽 특별 음료 증정
- SNS 인증샷 캠페인 (팔로우+태그 시 디저트 10% 할인)

응답 규칙:
- 항상 친절하고 귀엽게 응답하세요
- 메타몽 이모지(🫠💜🪄)를 적절히 사용하세요
- 카페와 관련 없는 질문에는 정중히 카페 관련 주제로 안내하세요
- 답변은 간결하게, 최대 200자 이내로 하세요`;

export async function POST(req: NextRequest) {
    try {
        const { message, history } = await req.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'message is required' }, { status: 400 });
        }

        // =============================================
        // 📌 Gemini API 연동 시 아래 주석을 해제하세요
        // =============================================
        if (GEMINI_API_KEY) {
            // Gemini API 호출
            const geminiRes = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{ text: SYSTEM_PROMPT }],
                    },
                    contents: [
                        // 대화 히스토리 포함
                        ...(history || []),
                        // 현재 사용자 메시지
                        {
                            role: 'user',
                            parts: [{ text: message }],
                        },
                    ],
                }),
            });

            if (!geminiRes.ok) {
                const errorData = await geminiRes.text();
                console.error('Gemini API error:', errorData);
                return NextResponse.json(
                    { reply: '죄송해요, AI 서비스에 일시적인 문제가 있어요. 잠시 후 다시 시도해주세요! 🫠' },
                    { status: 200 }
                );
            }

            const data = await geminiRes.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
                || '🤔 메타몽이 잠깐 졸았나봐요... 다시 물어봐주세요!';

            return NextResponse.json({ reply });
        }

        // =============================================
        // Gemini API 키가 없으면 더미 응답 반환
        // =============================================
        return NextResponse.json({
            reply: '🔧 AI 기능이 아직 설정되지 않았어요. GEMINI_API_KEY 환경변수를 설정해주세요!',
        });

    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { reply: '죄송해요, 오류가 발생했어요. 잠시 후 다시 시도해주세요! 🫠' },
            { status: 200 }
        );
    }
}
