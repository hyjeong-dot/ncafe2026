export async function fetchAPI(endpoint: string, options?: RequestInit) {
    try {
        const res = await fetch(`/api${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options?.headers,
            },
        });

        if (!res.ok) {
            if (res.status === 401 && typeof window !== 'undefined') {
                // 인증되지 않은 경우 로그인 페이지로 리다이렉트
                const currentPath = window.location.pathname;
                if (currentPath !== '/login') {
                    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
                }
                return;
            }
            const error: any = new Error(`API Error: ${res.status}`);
            error.status = res.status;
            try {
                const body = await res.json();
                error.message = body.message || error.message;
            } catch { /* no json body */ }
            throw error;
        }

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return res.json();
        }
        return null;
    } catch (error: any) {
        console.error('API call failed:', error);
        throw error;
    }
}

/**
 * 이미지 소스 URL을 처리하는 헬퍼 함수
 * DB의 /upload 경로를 프론트엔드의 /api/images 프록시 경로로 매핑합니다.
 * 모든 로컬 이미지를 /images/ 프록시로 통일하여 인증 헤더(JWT) 전송 문제를 방지합니다.
 */
export function getImageSrc(src: string | null | undefined): string {
    // 1. 이미지가 없거나 'blank.png'인 경우 기본 이미지 경로 반환
    if (!src || src === 'blank.png') {
        return '/images/blank.png';
    }

    // 2. 외부 URL(http)이나 Data URI는 그대로 반환
    if (src.startsWith('http') || src.startsWith('data:')) {
        return src;
    }

    // 3. 파일명만 추출하여 /images/ 프록시를 태움
    // DB에 경로가 포함되어 있든 파일명만 있든 상관없이 파일명만 쏙 뽑아냅니다.
    const segments = src.split('/');
    const filename = segments[segments.length - 1];
    
    // 무조건 /images/ 프록시를 타게 하여 토큰 없이 이미지를 불러오고 
    // Next.js config의 rewrites를 통해 백엔드의 /upload/images/로 매핑됩니다.
    return `/images/${filename}`;
}
