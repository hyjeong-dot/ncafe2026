import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8080';

export async function GET() {
    try {
        const session = await getSession();
        if (!session.token) {
            return NextResponse.json({ success: false, message: '인증 토큰이 없습니다.' }, { status: 401 });
        }

        const res = await fetch(`${API_BASE}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${session.token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: '정보 조회에 실패했습니다.' }));
            return NextResponse.json(error, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Fetch profile error:', error);
        return NextResponse.json({ success: false, message: '서버 오류' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getSession();
        if (!session.token) {
            return NextResponse.json({ success: false, message: '인증 토큰이 없습니다.' }, { status: 401 });
        }

        const body = await req.json();

        const res = await fetch(`${API_BASE}/auth/me`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${session.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: '정보 수정에 실패했습니다.' }));
            return NextResponse.json(error, { status: res.status });
        }

        const updatedUser = await res.json();

        // 세션 데이터 업데이트 (닉네임 등 변경사항 반영)
        session.user = {
            ...session.user,
            id: String(updatedUser.memberId || session.user.id),
            username: String(updatedUser.username || session.user.username),
            name: String(updatedUser.name || updatedUser.nickname || session.user.name),
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber,
        };
        await session.save();

        return NextResponse.json({ success: true, data: session.user });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ success: false, message: '서버 오류' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const session = await getSession();

        if (!session.token) {
            return NextResponse.json({ success: false, message: '인증 토큰이 없습니다.' }, { status: 401 });
        }

        const res = await fetch(`${API_BASE}/auth/me`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${session.token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: '회원탈퇴 처리에 실패했습니다.' }));
            return NextResponse.json(error, { status: res.status });
        }

        // 세션 파기
        session.destroy();

        const response = NextResponse.json({ success: true, message: '회원탈퇴 완료' });

        // 쿠키도 삭제
        response.cookies.delete('token');

        return response;
    } catch (error) {
        console.error('Delete account error:', error);
        return NextResponse.json({ success: false, message: '서버 오류' }, { status: 500 });
    }
}
