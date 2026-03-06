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
    if (!src || src === 'blank.png' || src === '') {
        return '/images/blank.png';
    }

    // 이미 절대 경로(http/https)인 경우 그대로 반환
    if (src.startsWith('http')) {
        return src;
    }

    // 이미 프론트엔드 API 프록시 경로(/api/...)가 붙어있는 경우 그대로 반환 (중복 방지)
    if (src.startsWith('/api/')) {
        return src;
    }

    // DB에 저장된 경로가 '/upload/images/...' 인 경우, 데이터 로딩 최적화를 위해 
    // 전용 이미지 프록시 라우트('/api/images/...')를 사용하도록 변환합니다.
    if (src.includes('/upload/images/')) {
        const fileName = src.split('/upload/images/')[1];
        return `/api/images/${fileName}`;
    }

    // 그 외의 경우 일반 API 프록시 경로를 사용합니다.
    const path = src.startsWith('/') ? src : `/${src}`;
    return `/api${path}`;
}
