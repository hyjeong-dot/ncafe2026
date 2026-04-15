# ☕ NCafe 2026

> **메타몽 카페** — AI 챗봇과 결제 시스템을 갖춘 풀스택 카페 주문 플랫폼

Next.js(BFF) + Spring Boot + PostgreSQL(pgvector) + FastAPI(AI Agent) 기반의 카페 운영·주문 웹 애플리케이션입니다.

---

## 📌 주요 기능

| 구분 | 기능 |
|------|------|
| **사용자** | 회원가입/로그인, 메뉴 탐색, 장바구니, 주문/결제(Toss Payments), 리뷰 작성, 마이페이지, 1:1 문의 |
| **관리자** | 대시보드(매출 분석), 메뉴/카테고리 CRUD, 주문 관리, 문의 답변, 쿠폰 관리, RAG 지식 관리, 사이트 설정 |
| **AI 챗봇** | Gemini 기반 RAG 챗봇 (카페 정보 안내, 메뉴 추천) |
| **결제** | Toss Payments 위젯 연동 |
| **인증** | JWT + HttpOnly Cookie, iron-session 기반 BFF 세션 관리 |

---

## 🏗️ 아키텍처

```
브라우저 (사용자)
  │
  ▼
┌──────────────────────┐
│  Frontend (Next.js)  │  BFF 패턴 — /api/* 프록시
│  Port: 3000 (내부)   │
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌──────────┐  ┌──────────────┐
│ Backend  │  │ Agent Server │
│ Spring   │  │ FastAPI      │
│ Boot     │  │ (AI/RAG)     │
│ :8080    │  │ :8000        │
└────┬─────┘  └──────┬───────┘
     │               │
     └───────┬───────┘
             ▼
     ┌───────────────┐
     │  PostgreSQL   │
     │  (pgvector)   │
     │  :5432        │
     └───────────────┘
```

- **Frontend → Backend**: Docker 내부 네트워크 (`http://backend:8080`)
- **Frontend → Agent**: Docker 내부 네트워크 (`http://agent:8000`)
- **외부 노출**: Frontend 포트만 외부에 공개 (BFF 패턴)

---

## 🛠️ 기술 스택

### Frontend
- **Next.js 16** (React 19, App Router)
- **TypeScript**
- **CSS Modules** (Vanilla CSS)
- **iron-session** (BFF 세션 관리)
- **Zustand** (상태 관리)
- **Toss Payments SDK** (결제)
- **Lucide React** (아이콘)

### Backend
- **Spring Boot 4.0** (Java 21)
- **Spring Security** + **JWT** (jjwt)
- **Spring Data JPA** + **PostgreSQL**
- **Gradle**

### Agent Server (AI)
- **FastAPI** + **Uvicorn**
- **Google Gemini** (google-genai)
- **pgvector** (벡터 검색)
- **Sentence Transformers** (임베딩)

### Infra
- **Docker** + **Docker Compose**
- **GitHub Actions** (CI/CD, Self-Hosted Runner)
- **PostgreSQL 17** (pgvector 확장)

---

## 📁 프로젝트 구조

```
ncafe2026/
├── frontend/               # Next.js 프론트엔드 (BFF)
│   ├── app/
│   │   ├── admin/          # 관리자 페이지
│   │   ├── menus/          # 메뉴 페이지
│   │   ├── order/          # 주문/결제 페이지
│   │   ├── mypage/         # 마이페이지
│   │   ├── login/          # 로그인
│   │   ├── signup/         # 회원가입
│   │   └── api/            # BFF API 라우트 (프록시)
│   ├── components/         # 공통 컴포넌트
│   ├── context/            # React Context
│   ├── lib/                # 유틸리티 & API 클라이언트
│   └── types/              # TypeScript 타입 정의
│
├── backend/                # Spring Boot 백엔드
│   └── src/main/java/.../
│       ├── auth/           # 인증 (JWT)
│       ├── member/         # 회원 관리
│       ├── menu/           # 메뉴
│       ├── category/       # 카테고리
│       ├── cart/           # 장바구니
│       ├── order/          # 주문
│       ├── payment/        # 결제
│       ├── review/         # 리뷰
│       ├── coupon/         # 쿠폰
│       ├── inquiry/        # 1:1 문의
│       ├── favorite/       # 즐겨찾기
│       └── admin/          # 관리자 기능
│
├── agent-server/           # FastAPI AI 챗봇 서버
│   └── app/                # RAG 기반 Gemini 챗봇
│
├── docker-compose.yml      # 컨테이너 오케스트레이션
├── .env.example            # 환경 변수 템플릿
└── docs/                   # 설계 문서 (Blueprints)
```

---

## 🚀 시작하기

### 사전 요구사항

| 도구 | 버전 | 용도 |
|------|------|------|
| **Node.js** | 20+ | Frontend |
| **Java JDK** | 21+ | Backend |
| **Python** | 3.11+ | Agent Server |
| **PostgreSQL** | 17+ | 데이터베이스 |
| **Docker** | 24+ | 컨테이너 배포 (선택) |

### 1. 저장소 클론

```bash
git clone <저장소-URL>
cd ncafe2026
```

### 2. 환경 변수 설정

루트 디렉토리에 `.env` 파일을 생성합니다:

```bash
cp .env.example .env
```

`.env` 파일을 열어 아래 값들을 설정합니다:

```env
# 프로젝트 식별
COMPOSE_PROJECT_NAME=hyjeong_ncafe
USER_ID=hyjeong

# 포트 설정
BACKEND_PORT=8034
FRONTEND_PORT=3034
DB_PORT=5434

# 데이터베이스
DB_NAME=ncafedb
DB_PASSWORD=<DB 비밀번호>
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5434/ncafedb
SPRING_DATASOURCE_USERNAME=ncafe

# 보안
JWT_SECRET=<32자 이상 랜덤 문자열>
SESSION_SECRET=<32자 이상 랜덤 문자열>

# 결제 (Toss Payments)
TOSS_SECRET_KEY=<토스 시크릿 키>
TOSS_CLIENT_KEY=<토스 클라이언트 키>
TOSS_CHANNEL_KEY=<토스 채널 키>

# AI (Agent Server)
GEMINI_API_KEY=<Gemini API 키>
```

Frontend 환경 변수도 설정합니다:

```bash
# frontend/.env
SESSION_SECRET=<32자 이상 랜덤 문자열>
API_BASE_URL=http://localhost:8080
FRONTEND_BASE_URL=http://localhost:3034
```

### 3. 로컬 실행 (개발 모드)

**Backend:**
```bash
cd backend
./gradlew bootRun
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Agent Server:**
```bash
cd agent-server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 4. Docker 실행 (프로덕션)

```bash
# .env 파일이 설정되어 있어야 합니다
docker compose up --build -d

# 상태 확인
docker compose ps
```

---

## 🔧 환경 변수 요약

| 변수 | 필수 | 설명 |
|------|:----:|------|
| `DB_PASSWORD` | ✅ | PostgreSQL 비밀번호 |
| `JWT_SECRET` | ✅ | JWT 토큰 서명 키 (32자+) |
| `SESSION_SECRET` | ✅ | iron-session 암호화 키 (32자+) |
| `SPRING_DATASOURCE_URL` | ✅ | JDBC 연결 URL |
| `TOSS_SECRET_KEY` | ⚠️ | Toss 결제 시크릿 키 (결제 기능 사용 시) |
| `TOSS_CLIENT_KEY` | ⚠️ | Toss 결제 클라이언트 키 |
| `TOSS_CHANNEL_KEY` | ⚠️ | Toss 결제 채널 키 |
| `GEMINI_API_KEY` | ⚠️ | Google Gemini API 키 (AI 챗봇 사용 시) |
| `COMPOSE_PROJECT_NAME` | 📦 | Docker 프로젝트 이름 |
| `USER_ID` | 📦 | Docker 컨테이너 이름 prefix |

> ✅ 필수 &nbsp; ⚠️ 해당 기능 사용 시 필수 &nbsp; 📦 Docker 배포 시 필수

---

## 📦 다른 컴퓨터로 이전하기

1. **Git으로 코드 가져오기**: `git clone` 또는 `git pull`
2. **수동 복사 필요 파일**:
   - `.env` (루트)
   - `frontend/.env`, `frontend/.env.local`
   - `backend/upload/` (업로드된 이미지 파일들)
3. **의존성 설치**: `npm install` (frontend), Gradle 자동 빌드 (backend)
4. **DB 이전**: 기존 DB 데이터가 필요하다면 `pg_dump` / `pg_restore` 사용

> 💡 자세한 마이그레이션 가이드는 [DeplyGuid.md](./DeplyGuid.md)를 참고하세요.

---

## 🚢 CI/CD 배포

GitHub Actions + Self-Hosted Runner를 통한 자동 배포가 구성되어 있습니다.

- `master` 브랜치에 push 시 자동 배포
- `workflow_dispatch`를 통한 수동 배포 가능

### GitHub Secrets 설정

> 저장소 → Settings → Secrets and variables → Actions → New repository secret

| Secret | 설명 |
|--------|------|
| `SESSION_SECRET` | iron-session 암호화 키 |
| `COMPOSE_PROJECT_NAME` | Docker 프로젝트 이름 |
| `USER_ID` | 컨테이너 이름 prefix |
| `FRONTEND_PORT` | 프론트엔드 외부 포트 |

---

## 📄 참고 문서

- [배포 가이드 (DeplyGuid.md)](./DeplyGuid.md)
- [아키텍처 블루프린트 (docs/blueprints)](./docs/blueprints/)

---

## 📜 라이선스

이 프로젝트는 비공개 프로젝트입니다.
