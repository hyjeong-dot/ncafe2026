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
                // Redirect to login if unauthorized
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
 */
export function getImageSrc(src: string | null | undefined): string {
    if (!src || src === 'blank.png') {
        return '/images/blank.png'; // 기본 이미지 (퍼블릭 폴더)
    }

    // 이미 절대 경로(http/https)인 경우 그대로 반환
    if (src.startsWith('http')) {
        return src;
    }

    // DB에 /upload/images/xxx.jpg 식으로 들어있다면, 이를 /api/images/images/xxx.jpg로 변경
    // (Next.js 프록시가 /api/images/* -> backend /upload/* 를 대신 처리함)
    const cleanSrc = src.replace(/^\/?upload\//, '');
    return `/api/images/${cleanSrc}`;
}
