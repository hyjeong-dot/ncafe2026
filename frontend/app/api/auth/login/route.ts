import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8080';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // 1. Spring Boot 로그인 API 호출
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!loginRes.ok) {
            const error = await loginRes.json().catch(() => ({ message: '로그인에 실패했습니다.' }));
            return NextResponse.json(error, { status: loginRes.status });
        }

        // Backend returns LoginResponse with success: true, data: { memberId, username, name, role, token }
        const result = await loginRes.json();

        // 1차: 응답 본문에서 토큰 추출 (가장 안정적)
        let token = result.data?.token || '';

        // 2차 폴백: Set-Cookie 헤더에서 추출 (이전 호환성)
        if (!token) {
            const setCookieHeader = loginRes.headers.get('set-cookie');
            if (setCookieHeader) {
                const tokenMatch = setCookieHeader.match(/token=([^;]+)/);
                if (tokenMatch) {
                    token = tokenMatch[1];
                }
            }
        }

        if (!token) {
            console.error('Token not found in response body or Set-Cookie header');
            return NextResponse.json({ message: '인증 토큰을 찾을 수 없습니다.' }, { status: 500 });
        }

        // 2. 세션에 저장 (httpOnly 쿠키로 암호화되어 저장됨)
        const session = await getSession();
        session.token = token;
        session.user = {
            id: result.data.memberId,
            username: result.data.username,
            name: result.data.name,
            role: result.data.role
        };
        await session.save();

        // 3. 클라이언트에 user 정보만 반환 (JWT는 제외)
        return NextResponse.json({ success: true, data: session.user });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: '로그인 도중 오류가 발생했습니다.' }, { status: 500 });
    }
}
