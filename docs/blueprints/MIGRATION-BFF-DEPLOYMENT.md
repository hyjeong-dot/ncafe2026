# NCafe BFF 배포 마이그레이션 가이드

## 개요

기존 방식에서 **BFF(Backend For Frontend) 아키텍처**로 전환하면서 필요한 모든 수정 사항을 정리한 문서입니다.

### 변경 사항 요약

| 항목 | 기존 방식 | BFF 방식 |
|------|----------|----------|
| **아키텍처** | Frontend + Backend 직접 통신 | Frontend(BFF) → Backend 프록시 |
| **Backend 포트** | 외부 노출 (8081) | 내부 전용 (8080) |
| **API 호출** | 브라우저 → Backend | 브라우저 → Frontend → Backend |
| **Nginx 설정** | /api/ → Backend 직접 | 모든 요청 → Frontend |
| **이미지 접근** | Backend 직접 | Frontend rewrites 프록시 |

---

## 필수 수정 파일 목록

1. `.github/workflows/deploy.yml`
2. `docker-compose.yml`
3. `frontend/app/api/[...path]/route.ts`
4. `frontend/next.config.ts`
5. Nginx 설정 파일 (서버)

---

## 1. GitHub Actions 배포 설정 수정

### 파일: `.github/workflows/deploy.yml`

#### 수정 1: 환경변수 추가

**위치**: `Create .env file` 단계

```yaml
- name: Create .env file
  run: |
    echo "COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME:-ncafe}" > .env
    echo "USER_ID=${USER_ID:-ncafe}" >> .env
    echo "FRONTEND_PORT=${FRONTEND_PORT:-3001}" >> .env
    echo "SESSION_SECRET=${SESSION_SECRET}" >> .env
    echo "JWT_SECRET=${JWT_SECRET}" >> .env
    echo "DB_PASSWORD=${DB_PASSWORD}" >> .env
    # ✅ 추가: SPRING_DATASOURCE_URL
    echo "SPRING_DATASOURCE_URL=${SPRING_DATASOURCE_URL}" >> .env
    # ✅ 추가: SPRING_DATASOURCE_USERNAME
    echo "SPRING_DATASOURCE_USERNAME=${SPRING_DATASOURCE_USERNAME:-ncafe}" >> .env
  env:
    COMPOSE_PROJECT_NAME: ${{ vars.COMPOSE_PROJECT_NAME }}
    USER_ID: ${{ vars.USER_ID }}
    FRONTEND_PORT: ${{ vars.FRONTEND_PORT }}
    SESSION_SECRET: ${{ secrets.SESSION_SECRET }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
    DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
    # ✅ 추가
    SPRING_DATASOURCE_URL: ${{ vars.SPRING_DATASOURCE_URL }}
    # ✅ 추가
    SPRING_DATASOURCE_USERNAME: ${{ vars.SPRING_DATASOURCE_USERNAME }}
```

#### 수정 2: Variables vs Secrets 구분

**중요**: GitHub에서 설정한 값이 Variables인지 Secrets인지 확인!

- **Variables** (평문): `${{ vars.변수명 }}`
  - USER_ID
  - FRONTEND_PORT
  - SPRING_DATASOURCE_URL
  - SPRING_DATASOURCE_USERNAME

- **Secrets** (암호화): `${{ secrets.변수명 }}`
  - SESSION_SECRET
  - JWT_SECRET
  - DB_PASSWORD

---

## 2. Docker Compose 설정 수정

### 파일: `docker-compose.yml`

#### 수정 1: Backend 환경변수 추가

**위치**: `backend` 서비스의 `environment` 섹션

```yaml
backend:
  environment:
    - SPRING_PROFILES_ACTIVE=prod
    - SPRING_DATASOURCE_URL=${SPRING_DATASOURCE_URL}
    # ✅ 추가: 사용자명 환경변수
    - SPRING_DATASOURCE_USERNAME=${SPRING_DATASOURCE_USERNAME:-ncafe}
    - SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}
    - JWT_SECRET=${JWT_SECRET:?JWT_SECRET 환경변수를 반드시 설정하세요}
```

#### 수정 2: DB Volume을 Named Volume로 변경

**기존 (Bind Mount):**
```yaml
db:
  volumes:
    - ./data:/var/lib/postgresql/data  # ❌ 권한 문제 발생
```

**변경 후 (Named Volume):**
```yaml
db:
  volumes:
    - db-data:/var/lib/postgresql/data  # ✅ Docker가 관리

# 파일 하단에 추가
volumes:
  db-data:
    name: ${USER_ID:-ncafe}-db-data
```

**변경 이유:**
- Bind Mount 방식은 권한 문제 발생 (postgres 사용자가 생성한 파일)
- GitHub Actions checkout 시 `permission denied` 오류
- Named Volume은 Docker가 권한 자동 관리

---

## 3. Frontend BFF 프록시 설정 수정

### 파일: `frontend/app/api/[...path]/route.ts`

#### 수정: Connection 헤더 필터링 추가

**위치**: `proxyRequest` 함수의 헤더 처리 부분

**기존:**
```typescript
// 클라이언트의 모든 헤더 복사 (일부 제외)
req.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'cookie') {
        headers.set(key, value);
    }
});
```

**변경 후:**
```typescript
// 클라이언트의 모든 헤더 복사 (일부 제외)
const skipHeaders = ['host', 'cookie', 'connection', 'keep-alive', 'transfer-encoding'];
req.headers.forEach((value, key) => {
    if (!skipHeaders.includes(key.toLowerCase())) {
        headers.set(key, value);
    }
});
```

**변경 이유:**
- `connection`, `keep-alive`, `transfer-encoding` 헤더는 클라이언트-서버 연결 제어용
- Backend로 전달 시 `invalid connection header` 오류 발생
- 프록시에서는 이런 헤더를 제거해야 함

---

## 4. Next.js 이미지 프록시 설정 수정

### 파일: `frontend/next.config.ts`

#### ⚠️ 중요: Rewrites 빌드 타임 vs 런타임 문제

**Next.js의 `rewrites`는 빌드 타임에 평가됩니다!**
- `process.env.API_BASE_URL`은 빌드 시점에 결정됨
- Docker 컨테이너 런타임 환경변수가 적용되지 않음
- 결과: 이미지 요청이 잘못된 주소로 전달됨

#### 수정 1: Rewrites를 BFF Proxy로 리다이렉트 (최종)

**2차 변경 (임시 - 작동하지 않음):**
```typescript
async rewrites() {
  // ❌ 빌드 타임에 평가되어 런타임 환경변수가 적용되지 않음
  const backendUrl = process.env.API_BASE_URL || 'http://localhost:8080';
  return [
    {
      source: '/images/:path*',
      destination: `${backendUrl}/images/:path*`,
    },
  ];
},
```

**최종 변경 (올바름):**
```typescript
async rewrites() {
  // ✅ BFF proxy로 리다이렉트: 런타임에 환경변수를 읽음
  return [
    {
      source: '/images/:path*',
      destination: '/api/images/:path*',  // BFF route로 전달
    },
  ];
},
```

**변경 이유:**
1. `/images/**` 요청을 `/api/images/**`로 리다이렉트
2. `/api/[...path]/route.ts`의 BFF proxy가 요청을 처리
3. BFF proxy는 런타임에 `API_BASE_URL` 환경변수를 읽어서 `http://backend:8080`으로 프록시
4. 환경변수가 Docker 컨테이너에서 올바르게 작동

#### 수정 2: Remote Patterns 변경

**기존:**
```typescript
images: {
  unoptimized: true,
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '8081',  // ❌ 외부 포트
    },
  ],
},
```

**변경 후:**
```typescript
images: {
  unoptimized: true, // Docker 환경에서는 최적화 비활성화
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'backend',  // ✅ Docker 컨테이너 이름
      port: '8080',  // ✅ 내부 포트
    },
  ],
},
```

**변경 이유:**
- BFF 구조에서는 Backend가 내부 네트워크에만 존재
- Frontend(Next.js)가 Docker 네트워크 내에서 `backend:8080`으로 접근
- 업로드된 이미지를 프록시로 제공

---

## 5. Nginx 설정 수정 (서버에서 직접 수정)

### 파일: `/etc/nginx/sites-available/[도메인명]`

#### 기존 설정 (잘못됨):

```nginx
server {
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
    }

    # ❌ 잘못된 설정: Backend로 직접 프록시
    location /api/ {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass http://localhost:8081;  # Backend는 내부 전용!
    }

    location /images/ {
        rewrite ^/images/(.*)$ /$1 break;
        proxy_pass http://localhost:8081;
    }
}
```

#### 변경 후 설정 (올바름):

```nginx
server {
    server_name your-domain.com;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # ✅ 모든 요청을 Frontend(BFF)로 전달
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }

    # ✅ /api/, /images/ location 블록 삭제!
    # BFF가 모든 요청을 처리합니다.

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
}
```

#### 적용 방법:

```bash
# 서버에 SSH 접속 후

# 1. Nginx 설정 파일 수정
sudo nano /etc/nginx/sites-available/[도메인명]

# 2. /api/, /images/ location 블록 삭제

# 3. 설정 테스트
sudo nginx -t

# 4. Nginx 재시작
sudo systemctl reload nginx
```

**변경 이유:**
- BFF 아키텍처에서는 Frontend가 모든 API 요청을 프록시
- Backend는 Docker 내부 네트워크에만 존재 (8080 포트 외부 노출 안 됨)
- Nginx가 Backend로 직접 프록시하면 `Connection refused` 오류 발생

---

## 6. GitHub Secrets/Variables 설정

### GitHub 저장소 Settings → Secrets and variables → Actions

#### Variables (평문 저장)

| 변수명 | 값 예시 | 설명 |
|--------|---------|------|
| `USER_ID` | `newlec` | 사용자 ID (컨테이너 이름 prefix) |
| `FRONTEND_PORT` | `3001` | Frontend 외부 포트 |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://db:5432/ncafedb` | DB 연결 URL |
| `SPRING_DATASOURCE_USERNAME` | `ncafe` | DB 사용자명 |

#### Secrets (암호화 저장)

| 변수명 | 값 예시 | 설명 |
|--------|---------|------|
| `SESSION_SECRET` | `your-secret-key-min-32-chars` | iron-session 암호화 키 |
| `JWT_SECRET` | `your-jwt-secret-key` | JWT 서명 키 |
| `DB_PASSWORD` | `your-db-password` | PostgreSQL 비밀번호 |

---

## 7. 마이그레이션 체크리스트

### 코드 변경
- [ ] `.github/workflows/deploy.yml` 환경변수 추가
- [ ] `.github/workflows/deploy.yml` vars/secrets 구분
- [ ] `docker-compose.yml` Backend 환경변수 추가
- [ ] `docker-compose.yml` DB Volume을 Named Volume로 변경
- [ ] `frontend/app/api/[...path]/route.ts` 헤더 필터링 추가
- [ ] `frontend/next.config.ts` rewrites 경로 수정
- [ ] `frontend/next.config.ts` remotePatterns 수정

### GitHub 설정
- [ ] GitHub Variables 등록 (USER_ID, FRONTEND_PORT 등)
- [ ] GitHub Secrets 등록 (SESSION_SECRET, JWT_SECRET, DB_PASSWORD)
- [ ] SPRING_DATASOURCE_URL 등록
- [ ] SPRING_DATASOURCE_USERNAME 등록

### 서버 설정
- [ ] Nginx 설정 파일 수정 (/api/, /images/ 블록 삭제)
- [ ] Nginx 설정 테스트 (`sudo nginx -t`)
- [ ] Nginx 재시작 (`sudo systemctl reload nginx`)

### 배포 및 테스트
- [ ] Git commit & push
- [ ] GitHub Actions 배포 성공 확인
- [ ] 컨테이너 상태 확인 (`docker compose ps`)
- [ ] Backend 로그 확인 ("Started BackendApplication")
- [ ] 웹사이트 접속 테스트 (502 오류 없음)
- [ ] API 호출 테스트 (메뉴, 카테고리 등)
- [ ] 업로드 이미지 표시 확인

---

## 8. 네트워크 흐름 비교

### 기존 방식 (직접 통신)

```
브라우저
  ├─→ Nginx → Frontend(:3001) [정적 파일]
  └─→ Nginx → Backend(:8081) [/api/**, /images/**]
```

**문제점:**
- Backend 포트를 외부에 노출해야 함
- CORS 설정 필요
- 보안 취약

### BFF 방식 (프록시)

```
브라우저
  └─→ Nginx → Frontend(:3001)
              └─→ Backend(:8080) [Docker 내부]
                  └─→ PostgreSQL(:5432) [Docker 내부]
```

**장점:**
- Backend/DB 완전히 내부 네트워크로 보호
- CORS 문제 없음
- 세션/인증을 Frontend에서 통합 관리
- 보안 강화

---

## 9. 트러블슈팅

### 문제 1: 502 Bad Gateway

**증상:**
```
웹사이트 접속 시 502 오류
```

**해결:**
1. Backend 컨테이너 상태 확인
   ```bash
   docker compose ps | grep backend
   docker compose logs backend --tail=50
   ```

2. "Started BackendApplication" 로그가 없다면 환경변수 확인
   ```bash
   cd ~/actions-runner/_work/ncafe/ncafe
   cat .env
   ```

3. Nginx 설정 확인
   ```bash
   cat /etc/nginx/sites-available/[도메인] | grep "location"
   ```

### 문제 2: invalid connection header

**증상:**
```
Frontend 로그: Error [InvalidArgumentError]: invalid connection header
```

**해결:**
`frontend/app/api/[...path]/route.ts`에서 `skipHeaders` 배열에 `connection`, `keep-alive`, `transfer-encoding` 추가

### 문제 3: 업로드 이미지 표시 안 됨 (빌드 타임 vs 런타임)

**증상:**
```
Frontend 로그: Failed to proxy http://localhost:8080/images/americano.png ECONNREFUSED
```
또는
```
이미지 404 Not Found
```

**원인:**
- Next.js `rewrites`는 **빌드 타임에 평가**됨
- `process.env.API_BASE_URL`은 런타임 환경변수이지만 빌드 시점에 평가되어 잘못된 값 사용
- Docker 컨테이너에서 설정한 환경변수가 적용되지 않음

**해결 방법 1: BFF Proxy로 리다이렉트 (권장)**

`frontend/next.config.ts` 수정:
```typescript
async rewrites() {
  return [
    {
      source: '/images/:path*',
      destination: '/api/images/:path*',  // BFF route로 전달
    },
  ];
},
```

이렇게 하면:
1. `/images/**` → `/api/images/**`로 리다이렉트
2. `/api/[...path]/route.ts`가 런타임에 `API_BASE_URL` 읽어서 프록시
3. 환경변수가 올바르게 작동

**해결 방법 2: 하드코딩 (비권장)**
```typescript
async rewrites() {
  return [
    {
      source: '/images/:path*',
      destination: 'http://backend:8080/images/:path*',  // 하드코딩
    },
  ];
},
```

**기타 확인 사항:**
1. Backend에서 `/images/**` 경로 설정 확인 (`WebConfig.java`)
2. `upload` 폴더 볼륨 마운트 확인
3. Frontend 컨테이너 환경변수 확인:
   ```bash
   docker exec [frontend-container] env | grep API_BASE_URL
   ```

### 문제 4: DB 인증 실패

**증상:**
```
password authentication failed for user "${SPRING_DATASOURCE_USERNAME}"
```

**해결:**
1. `docker-compose.yml`에 `SPRING_DATASOURCE_USERNAME` 환경변수 추가
2. `.github/workflows/deploy.yml`에 해당 변수 추가
3. GitHub Variables에 `SPRING_DATASOURCE_USERNAME` 등록

---

## 10. 참고 자료

### BFF 패턴
- [Backend For Frontend Pattern](https://samnewman.io/patterns/architectural/bff/)
- [Next.js Rewrites](https://nextjs.org/docs/app/api-reference/next-config-js/rewrites)

### Docker
- [Docker Volumes](https://docs.docker.com/storage/volumes/)
- [Docker Compose Environment Variables](https://docs.docker.com/compose/environment-variables/)

### Nginx
- [Nginx Proxy Configuration](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)

### 관련 문서
- [502 오류 해결 가이드](./502-ERROR-TROUBLESHOOTING.md)

---

**작성일**: 2026-03-05
**버전**: 1.0
**적용 대상**: NCafe 프로젝트 BFF 마이그레이션