import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8080';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // 1. Spring Boot 회원가입 API 호출
        const signupRes = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!signupRes.ok) {
            const error = await signupRes.json().catch(() => ({ message: '회원가입에 실패했습니다.' }));
            return NextResponse.json(error, { status: signupRes.status });
        }

        const result = await signupRes.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: '회원가입 도중 오류가 발생했습니다.' }, { status: 500 });
    }
}
