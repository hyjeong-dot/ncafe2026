# BFF (Backend-for-Frontend) API 마이그레이션 가이드

## 개요

이 문서는 클라이언트가 Spring Boot 백엔드를 **직접 호출**하던 방식에서 **Next.js BFF를 통한 프록시 방식**으로 전환할 때 발생하는 일반적인 문제와 해결 방법을 설명합니다.

> **대상**: AI 에이전트 및 학생 개발자
**목적**: 잘못된 API 호출 패턴을 감지하고 올바른 BFF 패턴으로 수정
> 

---

## 1. BFF 아키텍처 이해

### 기존 방식 (Direct API Call)

```
브라우저 → <http://localhost:8081/api/menus>
         → Spring Boot 백엔드
```

**문제점:**

- CORS 설정 필요
- JWT 토큰을 브라우저(localStorage/sessionStorage)에 저장 → XSS 취약
- 환경 변수를 클라이언트에서 직접 사용 불가 (빌드 타임에 고정됨)
- 인증 헤더를 클라이언트 코드에서 직접 관리해야 함

### BFF 방식 (Proxy Pattern)

```
브라우저 → /api/menus → Next.js BFF (Route Handler)
                       → <http://backend:8081/api/menus>
                       → Spring Boot 백엔드
```

**장점:**

- JWT는 httpOnly 쿠키에 암호화되어 저장 → XSS 방어
- CORS 불필요 (같은 origin)
- 환경 변수를 서버 사이드에서 런타임에 사용 가능
- 인증 헤더 주입을 BFF가 자동 처리

---

## 2. 프로젝트 구조

### BFF Route Handlers

```
frontend/app/api/
├── auth/
│   ├── login/route.ts      # POST /api/auth/login
│   ├── logout/route.ts     # POST /api/auth/logout
│   ├── register/route.ts   # POST /api/auth/register
│   └── session/route.ts    # GET /api/auth/session
└── [...path]/route.ts      # 범용 프록시 (모든 나머지 API)
```

### 핵심 파일

1. **`app/api/[...path]/route.ts`**: 모든 `/api/*` 요청을 백엔드로 프록시
    - 세션에서 JWT를 추출하여 `Authorization` 헤더에 자동 주입
    - 401 응답 시 세션 자동 삭제
2. **`app/lib/session.ts`**: iron-session을 사용한 암호화된 세션 관리
3. **`store/authStore.ts`**: Zustand 기반 클라이언트 상태 관리

---

## 3. 잘못된 API 호출 패턴 감지 및 수정

### ❌ 패턴 1: 백엔드 직접 호출

```tsx
// 🚨 잘못된 예시
const response = await fetch('<http://localhost:8081/api/menus>');
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menus`);
```

**문제:**

- BFF를 우회하여 백엔드를 직접 호출
- JWT 인증 헤더가 전달되지 않음
- CORS 에러 발생 가능

**✅ 올바른 수정:**

```tsx
// BFF를 통한 호출 (상대 경로)
const response = await fetch('/api/menus');
```

---

### ❌ 패턴 2: Authorization 헤더 수동 설정

```tsx
// 🚨 잘못된 예시
const token = localStorage.getItem('token'); // 또는 sessionStorage
const response = await fetch('/api/menus', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

**문제:**

- BFF를 사용하면 JWT는 httpOnly 쿠키에 저장되므로 JS에서 접근 불가
- BFF가 자동으로 인증 헤더를 주입하므로 불필요

**✅ 올바른 수정:**

```tsx
// BFF가 자동으로 Authorization 헤더를 추가함
const response = await fetch('/api/menus');
```

---

### ❌ 패턴 3: 절대 URL 사용

```tsx
// 🚨 잘못된 예시
const response = await fetch('<http://localhost:3000/api/menus>');
const response = await fetch(`${window.location.origin}/api/menus`);
```

**문제:**

- 불필요하게 긴 코드
- 프로토콜이나 포트 변경 시 수정 필요

**✅ 올바른 수정:**

```tsx
// 상대 경로 사용 (권장)
const response = await fetch('/api/menus');
```

**⚠️ 예외: 쿼리 파라미터 동적 생성 시**

```tsx
// URL 객체를 사용한 쿼리 파라미터 구성
const url = new URL('/api/menus', window.location.origin);
url.searchParams.set('categoryId', '1');
url.searchParams.set('query', 'coffee');

const response = await fetch(url.toString());
```

---

### ❌ 패턴 4: 환경 변수 직접 사용

```tsx
// 🚨 잘못된 예시 (클라이언트 컴포넌트)
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const response = await fetch(`${API_BASE}/api/menus`);
```

**문제:**

- `NEXT_PUBLIC_*` 환경 변수는 빌드 타임에 고정됨
- 배포 환경마다 다시 빌드해야 함

**✅ 올바른 수정:**

```tsx
// BFF를 통해 호출 (환경 변수는 서버 사이드에서만 사용)
const response = await fetch('/api/menus');
```

---

### ❌ 패턴 5: 인증이 필요한 API에서 에러 핸들링 누락

```tsx
// 🚨 잘못된 예시
const response = await fetch('/api/admin/menus');
const data = await response.json(); // 401 에러 시에도 JSON 파싱 시도
```

**문제:**

- 인증 실패(401) 시 적절한 처리가 없음
- 사용자를 로그인 페이지로 리다이렉트하지 않음

**✅ 올바른 수정:**

```tsx
const response = await fetch('/api/admin/menus');

if (response.status === 401) {
  // BFF가 이미 세션을 삭제했으므로, 로그인 페이지로 리다이렉트
  window.location.href = '/login';
  return;
}

if (!response.ok) {
  throw new Error('Failed to fetch menus');
}

const data = await response.json();
```

---

## 4. 인증 관련 API 호출 패턴

### 로그인

```tsx
// ✅ 올바른 예시 (authStore.ts)
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
});

if (!response.ok) {
  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.error || '로그인 실패');
}

const data = await response.json();
// BFF가 httpOnly 쿠키로 세션을 설정함
// 클라이언트는 data.user 정보만 받음
```

### 세션 복원 (초기 로딩)

```tsx
// ✅ 올바른 예시
const response = await fetch('/api/auth/session');

if (response.ok) {
  const data = await response.json();
  setUser(data.user); // Zustand 상태 업데이트
} else {
  setUser(null); // 비로그인 상태
}
```

### 로그아웃

```tsx
// ✅ 올바른 예시
await fetch('/api/auth/logout', { method: 'POST' });
setUser(null); // 클라이언트 상태 초기화
window.location.href = '/login';
```

---

## 5. 일반 API 호출 패턴

### GET 요청 (쿼리 파라미터 포함)

```tsx
// ✅ 올바른 예시
const url = new URL('/api/menus', window.location.origin);
url.searchParams.set('categoryId', '1');
url.searchParams.set('page', '0');

const response = await fetch(url.toString());
if (!response.ok) {
  throw new Error('Failed to fetch menus');
}
const data = await response.json();
```

### POST 요청 (JSON)

```tsx
// ✅ 올바른 예시
const response = await fetch('/api/menus', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Americano', price: 4500 }),
});

if (!response.ok) {
  throw new Error('Failed to create menu');
}
const data = await response.json();
```

### POST 요청 (FormData - 파일 업로드)

```tsx
// ✅ 올바른 예시
const formData = new FormData();
formData.append('image', file);
formData.append('korName', '아메리카노');
formData.append('price', '4500');

const response = await fetch('/api/menus', {
  method: 'POST',
  body: formData, // Content-Type은 브라우저가 자동 설정
});

if (!response.ok) {
  throw new Error('Failed to upload menu');
}
const data = await response.json();
```

### PUT 요청

```tsx
// ✅ 올바른 예시
const response = await fetch(`/api/menus/${menuId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Updated Name', price: 5000 }),
});

if (!response.ok) {
  throw new Error('Failed to update menu');
}
const data = await response.json();
```

### DELETE 요청

```tsx
// ✅ 올바른 예시
const response = await fetch(`/api/menus/${menuId}`, {
  method: 'DELETE',
});

if (!response.ok) {
  throw new Error('Failed to delete menu');
}
```

---

## 6. Server Component vs Client Component

### Server Component에서 API 호출

Next.js 15+ App Router에서 Server Component는 백엔드를 직접 호출할 수 있습니다.

```tsx
// ✅ app/menus/page.tsx (Server Component)
import { cookies } from 'next/headers';

export default async function MenusPage() {
  // 서버 사이드에서 직접 백엔드 호출 가능
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  // 또는 BFF를 통해 호출 (권장)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '<http://localhost:3000>';
  const response = await fetch(`${baseUrl}/api/menus`, {
    cache: 'no-store', // SSR: 매 요청마다 새로 fetch
  });

  const data = await response.json();

  return <MenuList menus={data.menus} />;
}
```

### Client Component에서 API 호출

```tsx
// ✅ app/menus/_components/MenuGrid/useMenus.ts
'use client';

import { useState, useEffect } from 'react';

export function useMenus(categoryId?: number) {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      const url = new URL('/api/menus', window.location.origin);
      if (categoryId) {
        url.searchParams.set('categoryId', categoryId.toString());
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch menus');
      }
      const data = await response.json();
      setMenus(data.menus);
      setLoading(false);
    };

    fetchMenus();
  }, [categoryId]);

  return { menus, loading };
}
```

---

## 7. 체크리스트: API 호출 코드 검토 시

코드 리뷰 또는 AI 에이전트가 코드를 수정할 때 다음 항목을 확인하세요:

- [ ]  `http://localhost:8081` 또는 `http://backend:8081`을 직접 호출하고 있는가?
    - → `/api/...` 상대 경로로 변경
- [ ]  `process.env.NEXT_PUBLIC_API_URL`을 클라이언트에서 사용하고 있는가?
    - → BFF를 통해 호출하도록 수정
- [ ]  `localStorage` 또는 `sessionStorage`에서 토큰을 가져와 헤더에 추가하고 있는가?
    - → 헤더 설정 제거 (BFF가 자동 처리)
- [ ]  `fetch` 호출 시 절대 URL(`http://...`)을 사용하고 있는가?
    - → 상대 경로(`/api/...`)로 변경 (쿼리 파라미터 동적 생성 시 예외)
- [ ]  401 에러 처리가 없는가?
    - → 로그인 페이지로 리다이렉트 추가
- [ ]  FormData 업로드 시 `Content-Type` 헤더를 수동 설정하고 있는가?
    - → 헤더 제거 (브라우저가 자동 설정)
- [ ]  Server Component에서 BFF를 호출할 때 `window.location.origin`을 사용하고 있는가?
    - → `process.env.NEXT_PUBLIC_BASE_URL` 또는 절대 URL 사용

---

## 8. 일반적인 에러 메시지와 해결 방법

### `CORS policy: No 'Access-Control-Allow-Origin' header`

**원인:** 클라이언트가 백엔드를 직접 호출하고 있음

**해결:**

```tsx
// ❌ 잘못된 코드
fetch('<http://localhost:8081/api/menus>')

// ✅ 올바른 코드
fetch('/api/menus')
```

---

### `401 Unauthorized` 발생 후 페이지가 멈춤

**원인:** 인증 실패 시 에러 핸들링이 없음

**해결:**

```tsx
const response = await fetch('/api/admin/menus');

if (response.status === 401) {
  window.location.href = '/login';
  return;
}
```

---

### `TypeError: Failed to fetch` (네트워크 에러)

**원인 1:** 잘못된 URL 사용

```tsx
// ❌ 오타 또는 잘못된 경로
fetch('/api/menu') // 's'가 빠짐
```

**원인 2:** 백엔드 서버가 실행되지 않음

- BFF는 실행 중이지만 Spring Boot 백엔드가 다운된 경우
- `docker-compose up` 또는 `./gradlew bootRun` 확인

**해결:**

```bash
# 백엔드 상태 확인
docker-compose ps
# 또는
curl <http://localhost:8081/api/health>
```

---

### `ReferenceError: window is not defined`

**원인:** Server Component에서 `window.location.origin` 사용

**해결:**

```tsx
// ❌ Server Component에서 사용 불가
const url = new URL('/api/menus', window.location.origin);

// ✅ 환경 변수 사용
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '<http://localhost:3000>';
const url = new URL('/api/menus', baseUrl);
```

---

## 9. 참고 자료

- [Next.js Route Handlers 공식 문서](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [iron-session 공식 문서](https://github.com/vvo/iron-session)
- [BFF 패턴 설명](https://learn.microsoft.com/en-us/azure/architecture/patterns/backends-for-frontends)

---

## 10. AI 에이전트를 위한 지침

이 문서를 기반으로 코드를 검토하거나 수정할 때:

1. **파일 검색**: `fetch(` 패턴을 검색하여 모든 API 호출 찾기
    
    ```bash
    grep -r "fetch(" --include="*.ts" --include="*.tsx" frontend/app
    ```
    
2. **패턴 매칭**: 다음 정규식으로 잘못된 패턴 찾기
    
    ```
    fetch\\s*\\(\\s*['"](http://localhost:8081|http://backend:8081)
    fetch\\s*\\(\\s*`\\${process\\.env\\.NEXT_PUBLIC_API_URL}
    localStorage\\.getItem\\s*\\(\\s*['"]token['"]
    Authorization.*Bearer
    ```
    
3. **자동 수정**: 위 패턴을 발견하면 BFF 방식으로 자동 변환
4. **검증**: 수정 후 다음 사항 확인
    - 모든 API 호출이 `/api/`로 시작하는지
    - Authorization 헤더를 수동 설정하지 않는지
    - 401 에러 핸들링이 있는지

---

## 마무리

BFF 전환은 보안과 유지보수성을 크게 향상시킵니다. 이 가이드를 따라 일관된 API 호출 패턴을 유지하세요.

**핵심 원칙:**

- 클라이언트는 항상 BFF(`/api/...`)를 통해 호출
- JWT는 httpOnly 쿠키에 저장되며 클라이언트 JS에서 접근 불가
- BFF가 인증 헤더를 자동으로 주입
- 401 에러 시 로그인 페이지로 리다이렉트