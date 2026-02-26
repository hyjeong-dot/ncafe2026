import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');
    const path = request.nextUrl.pathname;

    // 보호해야 할 경로 (예: /admin 관련 하위 라우트 전부, /cart 등)
    const isProtectedRoute = path.startsWith('/admin') || path.startsWith('/cart');

    // 로그인하지 않은 사용자가 보호된 경로에 접근하려고 할 때
    if (isProtectedRoute && !token) {
        // 로그인 페이지로 리다이렉트
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 로그인한 사용자가 로그인 페이지에 접근하려고 할 때
    if (path === '/login' && token) {
        // 어드민 대시보드 (또는 홈)으로 리다이렉트
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/cart', '/login'],
};
