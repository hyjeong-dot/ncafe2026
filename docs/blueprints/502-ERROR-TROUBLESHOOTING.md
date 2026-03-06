# NCafe 배포 502 Bad Gateway 오류 해결 가이드

## 목차
1. [문제 개요](#문제-개요)
2. [AI 프롬프트 (학생용)](#ai-프롬프트-학생용)
3. [상황별 프롬프트](#상황별-프롬프트)
4. [체크리스트](#체크리스트)
5. [주요 해결 방법](#주요-해결-방법)

---

## 문제 개요

### 증상
- GitHub Actions 배포는 성공
- 웹사이트 접속 시 **502 Bad Gateway** 오류 발생

### 프로젝트 구조
```
브라우저 → Nginx(:443) → Frontend(Next.js:3000) → Backend(Spring Boot:8080) → PostgreSQL(:5432)
```

- **BFF(Backend For Frontend) 아키텍처**
- Docker Compose로 배포
- GitHub Actions self-hosted runner 사용
- Frontend만 외부 포트 노출, Backend/DB는 내부 네트워크만 사용

---

## AI 프롬프트 (학생용)

### 기본 프롬프트

아래 내용을 복사해서 AI(Claude, Gemini, Cursor, ChatGPT 등)에게 전달하세요.

```
안녕하세요. NCafe 프로젝트를 배포했는데 502 Bad Gateway 오류가 발생합니다.

### 프로젝트 구조
- BFF(Backend For Frontend) 아키텍처
- 네트워크: 브라우저 → Nginx → Frontend(Next.js:3000) → Backend(Spring Boot:8080) → PostgreSQL
- Docker Compose로 배포
- GitHub Actions self-hosted runner 사용

### 현재 상황
- GitHub Actions 배포는 성공했다고 나옴
- 웹사이트 접속 시 502 Bad Gateway 발생
- 서버 도메인: [본인의 도메인을 입력]

### 확인이 필요한 사항

다음 순서대로 문제를 진단하고 해결 방법을 알려주세요:

1. **환경변수 누락 확인**
   - `.github/workflows/deploy.yml` 파일 확인
   - 필요한 환경변수: USER_ID, FRONTEND_PORT, SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, SESSION_SECRET, JWT_SECRET, DB_PASSWORD
   - Variables는 `${{ vars.* }}`, Secrets는 `${{ secrets.* }}`로 접근해야 함

2. **docker-compose.yml 확인**
   - backend 서비스에 SPRING_DATASOURCE_USERNAME 환경변수가 있는지 확인
   - DB volume이 Named Volume을 사용하는지 확인 (권한 문제 방지)

3. **컨테이너 상태 확인 명령어**
   ```bash
   cd ~/actions-runner/_work/ncafe/ncafe
   docker compose ps
   docker compose logs frontend --tail=50
   docker compose logs backend --tail=50
   ```

4. **BFF 프록시 오류 확인**
   - `frontend/app/api/[...path]/route.ts` 파일 확인
   - 헤더 필터링에서 connection, keep-alive, transfer-encoding 헤더를 제외하고 있는지 확인
   - "invalid connection header" 오류가 있다면 이 부분 수정 필요

5. **Nginx 설정 확인**
   - BFF 구조에서는 Nginx가 모든 요청을 Frontend로 보내야 함
   - `/api/` location 블록이 Backend로 직접 프록시하면 안 됨 (Backend는 내부 네트워크만 사용)

### 제가 실행할 수 있는 명령어를 알려주세요
각 문제에 대해:
1. 어떤 파일을 확인해야 하는지
2. 어떻게 수정해야 하는지
3. 수정 후 어떤 명령어를 실행해야 하는지

단계별로 명확하게 설명해주세요.
```

---

## 상황별 프롬프트

### 에러 로그를 보여줄 때

```
다음은 [명령어 이름] 실행 결과입니다:

[복사한 로그를 여기에 붙여넣기]

이 로그를 분석해서 문제점과 해결 방법을 알려주세요.
```

**예시:**
```
다음은 docker compose logs backend --tail=50 실행 결과입니다:

[로그 내용 붙여넣기]

이 로그를 분석해서 문제점과 해결 방법을 알려주세요.
```

---

### 파일 내용을 보여줄 때

```
다음은 [파일 경로] 파일의 내용입니다:

[복사한 파일 내용을 여기에 붙여넣기]

이 파일에 문제가 있나요? 수정이 필요하다면 정확한 수정 방법을 알려주세요.
```

**예시:**
```
다음은 .github/workflows/deploy.yml 파일의 내용입니다:

[파일 내용 붙여넣기]

이 파일에 문제가 있나요? 수정이 필요하다면 정확한 수정 방법을 알려주세요.
```

---

### GitHub Actions 실패 시

```
GitHub Actions에서 배포가 실패했습니다.
다음은 실패한 단계의 로그입니다:

[GitHub Actions 에러 로그를 여기에 붙여넣기]

문제를 진단하고 해결 방법을 알려주세요.
```

---

### Nginx 설정 확인 시

```
다음은 Nginx 설정 파일 내용입니다:

[Nginx 설정 파일 내용 붙여넣기]

BFF 아키텍처에서 올바른 설정인지 확인하고, 수정이 필요하면 알려주세요.
- Frontend는 localhost:3001에서 실행 중
- Backend는 Docker 내부 네트워크에서만 접근 가능
- 모든 요청은 Frontend로 프록시되어야 함
```

---

## 체크리스트

AI에게 다음 프롬프트로 전체 점검을 요청하세요:

```
다음 체크리스트를 순서대로 확인하고, 각 항목에 문제가 있는지 알려주세요:

□ GitHub Secrets/Variables에 필요한 값이 모두 등록되어 있나요?
  - USER_ID
  - FRONTEND_PORT
  - SPRING_DATASOURCE_URL
  - SPRING_DATASOURCE_USERNAME
  - SESSION_SECRET (Secret)
  - JWT_SECRET (Secret)
  - DB_PASSWORD (Secret)

□ deploy.yml에서 환경변수를 올바르게 접근하고 있나요?
  - Variables: ${{ vars.변수명 }}
  - Secrets: ${{ secrets.변수명 }}

□ docker-compose.yml에 필요한 환경변수가 모두 있나요?
  - SPRING_DATASOURCE_URL
  - SPRING_DATASOURCE_USERNAME
  - SPRING_DATASOURCE_PASSWORD
  - JWT_SECRET

□ DB volume이 Named Volume을 사용하나요?
  - ❌ ./data (bind mount) → 권한 문제 발생
  - ✅ db-data (named volume) → 권장

□ BFF route.ts에서 connection 헤더를 필터링하나요?
  - connection, keep-alive, transfer-encoding 헤더 제외 필요

□ Backend 컨테이너가 정상 실행 중인가요?
  - docker compose ps 확인
  - "Started BackendApplication" 로그 확인

□ Nginx가 올바르게 설정되었나요?
  - 모든 요청을 Frontend(localhost:3001)로 프록시
  - /api/ location 블록이 Backend로 직접 프록시하면 안 됨

각 항목에 대해 확인 방법과 수정 방법을 알려주세요.
```

---

## 주요 해결 방법

### 1. 환경변수 누락 문제

**증상:**
```
WARN[0000] The "SPRING_DATASOURCE_URL" variable is not set
password authentication failed for user "${SPRING_DATASOURCE_USERNAME}"
```

**해결:**

#### deploy.yml 수정
```yaml
- name: Create .env file
  run: |
    echo "USER_ID=${USER_ID:-ncafe}" >> .env
    echo "FRONTEND_PORT=${FRONTEND_PORT:-3001}" >> .env
    echo "SESSION_SECRET=${SESSION_SECRET}" >> .env
    echo "JWT_SECRET=${JWT_SECRET}" >> .env
    echo "DB_PASSWORD=${DB_PASSWORD}" >> .env
    echo "SPRING_DATASOURCE_URL=${SPRING_DATASOURCE_URL}" >> .env
    echo "SPRING_DATASOURCE_USERNAME=${SPRING_DATASOURCE_USERNAME:-ncafe}" >> .env
  env:
    USER_ID: ${{ vars.USER_ID }}
    FRONTEND_PORT: ${{ vars.FRONTEND_PORT }}
    SESSION_SECRET: ${{ secrets.SESSION_SECRET }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
    DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
    SPRING_DATASOURCE_URL: ${{ vars.SPRING_DATASOURCE_URL }}
    SPRING_DATASOURCE_USERNAME: ${{ vars.SPRING_DATASOURCE_USERNAME }}
```

#### docker-compose.yml 수정
```yaml
backend:
  environment:
    - SPRING_PROFILES_ACTIVE=prod
    - SPRING_DATASOURCE_URL=${SPRING_DATASOURCE_URL}
    - SPRING_DATASOURCE_USERNAME=${SPRING_DATASOURCE_USERNAME:-ncafe}
    - SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}
    - JWT_SECRET=${JWT_SECRET:?JWT_SECRET 환경변수를 반드시 설정하세요}
```

---

### 2. Docker Volume 권한 문제

**증상:**
```
Error: EACCES: permission denied, scandir '/home/newlec/actions-runner/_work/ncafe/ncafe/data'
```

**해결:**

#### docker-compose.yml 수정
```yaml
db:
  volumes:
    # ❌ 이전: ./data:/var/lib/postgresql/data
    # ✅ 수정: Named Volume 사용
    - db-data:/var/lib/postgresql/data

# 파일 하단에 추가
volumes:
  db-data:
    name: ${USER_ID:-ncafe}-db-data
```

---

### 3. BFF 프록시 헤더 오류

**증상:**
```
Error [InvalidArgumentError]: invalid connection header
Proxy error: TypeError: fetch failed
```

**해결:**

#### frontend/app/api/[...path]/route.ts 수정
```typescript
// 요청 헤더 구성
const headers = new Headers();

// 클라이언트의 모든 헤더 복사 (일부 제외)
const skipHeaders = ['host', 'cookie', 'connection', 'keep-alive', 'transfer-encoding'];
req.headers.forEach((value, key) => {
    if (!skipHeaders.includes(key.toLowerCase())) {
        headers.set(key, value);
    }
});
```

---

### 4. Nginx 설정 문제

**증상:**
```
connect() failed (111: Connection refused) while connecting to upstream
upstream: "http://127.0.0.1:8081/categories"
```

**해결:**

BFF 구조에서는 Nginx가 **모든 요청을 Frontend로** 보내야 합니다.

#### 올바른 Nginx 설정 (/etc/nginx/sites-available/도메인)
```nginx
server {
    server_name your-domain.com;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # 모든 요청을 Frontend(BFF)로 전달
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }

    # ❌ /api/, /images/ location 블록 삭제!
    # BFF가 모든 요청을 처리합니다.

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
}
```

#### 적용 명령어
```bash
# 설정 테스트
sudo nginx -t

# 문제 없으면 재시작
sudo systemctl reload nginx
```

---

## 진단 명령어 모음

### 컨테이너 상태 확인
```bash
cd ~/actions-runner/_work/ncafe/ncafe
docker compose ps
```

### 로그 확인
```bash
# Frontend 로그
docker compose logs frontend --tail=50

# Backend 로그
docker compose logs backend --tail=50

# 모든 로그
docker compose logs --tail=100
```

### 네트워크 연결 테스트
```bash
# Frontend에서 Backend로 접근 테스트
docker exec [USER_ID]-frontend ping -c 3 backend

# Backend API 직접 테스트
docker exec [USER_ID]-frontend wget -O- http://backend:8080/api/categories
```

### 서버 내부 테스트
```bash
# Frontend를 통한 API 테스트 (BFF)
curl http://localhost:3001/api/categories

# Frontend 응답 확인
curl -I http://localhost:3001
```

### Nginx 확인
```bash
# Nginx 에러 로그
sudo tail -20 /var/log/nginx/error.log

# Nginx 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl reload nginx
```

---

## 사용 팁

### 1. AI와 대화할 때
- **한 번에 모든 정보를 주지 마세요**
  - 먼저 기본 프롬프트로 시작
  - AI가 요청하는 정보를 단계별로 제공

- **명령어 실행 결과를 정확히 복사**
  - 에러 메시지 전체를 복사
  - 파일 경로와 줄 번호 포함

### 2. 수정 전 백업
```bash
# 현재 변경사항 확인
git status

# 임시 저장 (필요시)
git stash

# 임시 저장 복원 (필요시)
git stash pop
```

### 3. 수정 후 배포
```bash
# 변경사항 추가
git add .

# 커밋 (AI가 제안한 내용 기록)
git commit -m "fix: [AI가 제안한 수정 내용]"

# 푸시 (GitHub Actions 자동 실행)
git push
```

### 4. 배포 확인
```bash
# GitHub Actions 페이지에서 배포 상태 확인
# https://github.com/[username]/ncafe/actions

# 배포 완료 후 서버에서 확인
cd ~/actions-runner/_work/ncafe/ncafe
docker compose ps
docker compose logs --tail=20
```

---

## 자주 묻는 질문 (FAQ)

### Q: Variables vs Secrets 차이가 뭔가요?

**A:**
- **Variables**: 평문으로 저장, 로그에 그대로 표시 (일반 설정값)
  - 예: USER_ID, FRONTEND_PORT, SPRING_DATASOURCE_URL
  - 접근: `${{ vars.변수명 }}`

- **Secrets**: 암호화 저장, 로그에 `***`로 표시 (민감한 정보)
  - 예: JWT_SECRET, DB_PASSWORD, SESSION_SECRET
  - 접근: `${{ secrets.변수명 }}`

### Q: 왜 Backend 포트로 직접 접근이 안 되나요?

**A:** BFF 아키텍처에서는 보안을 위해 Backend를 외부에 노출하지 않습니다.
- ✅ 브라우저 → Frontend → Backend (올바른 경로)
- ❌ 브라우저 → Backend (차단됨)

### Q: Nginx를 수정했는데도 안 되는데요?

**A:** Nginx 수정 후 반드시 재시작해야 합니다:
```bash
sudo nginx -t          # 설정 테스트
sudo systemctl reload nginx  # 재시작
```

### Q: 로컬에서는 되는데 서버에서만 안 되는데요?

**A:** 환경변수 설정을 확인하세요:
- 로컬: `.env` 파일
- 서버: GitHub Secrets/Variables
- deploy.yml에서 올바르게 매핑되었는지 확인

---

## 추가 리소스

- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [Docker Compose 문서](https://docs.docker.com/compose/)
- [Nginx 프록시 설정](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**작성일**: 2026-03-05
**버전**: 1.0
**대상**: NCafe 프로젝트 수강생