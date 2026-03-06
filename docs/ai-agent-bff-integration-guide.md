# AI Agent Server BFF 연동 가이드

> **대상**: BFF(Backend for Frontend) 패턴으로 구성된 프로젝트에 AI Agent Server를 연결하려는 학생들
> 

## 📋 목차

1. [개요](https://www.notion.so/313ca6293a8981da9c12c95b6af4b01b?pvs=21)
2. [사전 요구사항](https://www.notion.so/313ca6293a8981da9c12c95b6af4b01b?pvs=21)
3. [아키텍처 이해](https://www.notion.so/313ca6293a8981da9c12c95b6af4b01b?pvs=21)
4. [단계별 구현](https://www.notion.so/313ca6293a8981da9c12c95b6af4b01b?pvs=21)
5. [테스트](https://www.notion.so/313ca6293a8981da9c12c95b6af4b01b?pvs=21)
6. [트러블슈팅](https://www.notion.so/313ca6293a8981da9c12c95b6af4b01b?pvs=21)

---

## 개요

### 왜 BFF 프록시를 사용하나요?

BFF 패턴에서는 클라이언트가 **직접** 백엔드 서비스에 접근하지 않고, **Next.js 서버를 통해** 접근합니다.

### ❌ 직접 접근 (BFF 패턴 위반)

```
브라우저 → <http://agent-server:8000> (CORS 문제, 보안 문제)
```

### ✅ BFF 프록시 (권장)

```
브라우저 → /api/agent/* → Next.js BFF → agent-server:8000
```

**장점:**

- 🔒 **보안**: Agent Server 포트 외부 비노출
- 🚫 **CORS 없음**: 동일 출처 요청
- 🔑 **인증 관리**: Next.js에서 세션/토큰 자동 주입 가능
- 📊 **일관성**: 모든 API가 `/api/*` 경로로 통일

---

## 사전 요구사항

✅ **필수 조건:**

1. **프로젝트가 BFF 패턴으로 구성**되어 있어야 합니다.
    - Next.js Frontend (Port: 3000 or 3001)
    - Spring Boot Backend (Port: 8080 or 8081)
    - Docker Compose로 관리
2. **AI Agent Server가 준비**되어 있어야 합니다.
    - FastAPI 기반 Python 서버
    - `/chat` 엔드포인트 존재
    - `Dockerfile` 있음
3. **기본 구조 확인:**
    
    ```
    your-project/
    ├── frontend/          # Next.js
    │   └── app/
    │       └── api/       # BFF 프록시 라우트
    ├── backend/           # Spring Boot
    ├── agent-server/      # AI Agent (FastAPI)
    │   ├── Dockerfile
    │   ├── requirements.txt
    │   └── app/
    └── docker-compose.yml
    ```
    

---

## 아키텍처 이해

### 현재 구조 (AI Agent 없음)

```
┌─────────┐      /api/*       ┌──────────┐
│ Browser │ ─────────────────> │ Next.js  │
└─────────┘                    │  (BFF)   │
                               └─────┬────┘
                                     │
                                     │ <http://backend:8080>
                                     ▼
                               ┌──────────┐
                               │  Spring  │
                               │   Boot   │
                               └──────────┘
```

### 목표 구조 (AI Agent 추가)

```
┌─────────┐      /api/*       ┌──────────┐
│ Browser │ ─────────────────> │ Next.js  │
└─────────┘                    │  (BFF)   │
              /api/agent/*     └─────┬────┘
                                     │
                        ┌────────────┼────────────┐
                        │                         │
                        │ <http://backend:8080>     │ <http://agent-server:8000>
                        ▼                         ▼
                  ┌──────────┐            ┌──────────┐
                  │  Spring  │            │  Agent   │
                  │   Boot   │            │  Server  │
                  └──────────┘            └──────────┘
```

---

## 단계별 구현

### Step 1: Docker Compose에 Agent Server 추가

**파일: `docker-compose.yml`**

### 1-1. Agent Server 서비스 정의 추가

`frontend` 서비스와 `backend` 서비스 사이에 다음을 추가하세요:

```yaml
  agent-server:
    image: ${USER_ID:-yourproject}-agent-server:latest
    build:
      context: ./agent-server
      dockerfile: Dockerfile
    container_name: ${USER_ID:-yourproject}-agent-server
    # BFF 아키텍처: 브라우저 → Next.js(BFF) → Agent Server 구조이므로
    # Agent Server는 Docker 내부 네트워크에서만 접근하면 되고, 외부 노출이 불필요함
    # ports:
    #   - "${AGENT_PORT:-8000}:8000"
    environment:
      - GOOGLE_API_KEY=${GOOGLE_API_KEY:?GOOGLE_API_KEY 환경변수를 반드시 설정하세요}
    restart: unless-stopped
```

> ⚠️ **주의**: `${USER_ID:-yourproject}` 부분은 여러분의 프로젝트 이름으로 변경하세요.
> 

### 1-2. Frontend 서비스에 Agent Server 연결 추가

`frontend` 서비스의 `environment`와 `depends_on` 섹션을 수정:

```yaml
  frontend:
    # ... 기존 설정 ...
    environment:
      # 기존 설정들...
      - API_BASE_URL=http://backend:8080

      # 👇 이 줄 추가
      - AGENT_BASE_URL=http://agent-server:8000

      - SESSION_SECRET=${SESSION_SECRET:?...}
    depends_on:
      - backend
      - agent-server  # 👈 이 줄 추가
```

### 1-3. 로컬 개발용 포트 노출 (선택)

**파일: `docker-compose.override.yml`**

로컬에서 Agent Server를 직접 테스트하고 싶다면:

```yaml
services:
  agent-server:
    ports:
      # 로컬에서 Agent Server 직접 접근 가능하도록 포트 노출 (디버깅용)
      - "8000:8000"
```

---

### Step 2: Agent Server Dockerfile 확인

**파일: `agent-server/Dockerfile`**

다음과 같은 Dockerfile이 있는지 확인하세요. 없다면 생성:

```docker
FROM python:3.11-slim

WORKDIR /app

# 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 앱 코드 복사
COPY app ./app

# 포트 노출
EXPOSE 8000

# Uvicorn으로 FastAPI 실행
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

### Step 3: Next.js에 프록시 라우트 생성

### 3-1. 디렉토리 생성

터미널에서:

```bash
mkdir -p frontend/app/api/agent/chat
```

### 3-2. 프록시 라우트 파일 생성

**파일: `frontend/app/api/agent/chat/route.ts`**

```tsx
import { NextRequest, NextResponse } from 'next/server';

const AGENT_BASE = process.env.AGENT_BASE_URL || '<http://localhost:8000>';

/**
 * Agent Server로의 프록시 라우트
 * 브라우저 → Next.js BFF → Agent Server
 */
export async function POST(req: NextRequest) {
    try {
        // 요청 본문 파싱
        const body = await req.json();

        // Agent Server로 요청
        const targetUrl = `${AGENT_BASE}/chat`;

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Agent Server responded with status: ${response.status}`);
        }

        // 스트리밍 응답인 경우
        if (body.stream && response.headers.get('content-type')?.includes('text/event-stream')) {
            // SSE 스트림을 그대로 전달
            return new NextResponse(response.body, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                },
            });
        }

        // 일반 JSON 응답
        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Agent proxy error:', error);
        return NextResponse.json(
            { error: 'Agent Server connection failed' },
            { status: 502 }
        );
    }
}
```

**📌 핵심 포인트:**

- `AGENT_BASE_URL` 환경변수 사용
- 스트리밍(SSE) 응답 지원
- 에러 처리 포함

---

### Step 4: Frontend API 클라이언트 작성

### 4-1. AI Agent API 클라이언트 생성

**파일: `frontend/app/lib/aiAgent.ts`**

```tsx
// AI Agent Service (실제 API 연동)

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface AgentMessage {
    role: string;
    content: string;
}

interface AgentRequest {
    messages: AgentMessage[];
    stream: boolean;
}

interface AgentResponse {
    content: string;
}

/**
 * AI Agent API - 실제 Agent Server와 통신
 * @param userMessage 사용자 메시지
 * @param conversationHistory 대화 히스토리
 */
export async function sendMessage(
    userMessage: string,
    conversationHistory: ChatMessage[] = []
): Promise<ChatMessage> {
    try {
        // 대화 히스토리를 Agent Server 포맷으로 변환
        const messages: AgentMessage[] = conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        // 현재 사용자 메시지 추가
        messages.push({
            role: 'user',
            content: userMessage
        });

        // Agent Server로 요청 (BFF 프록시 경유)
        const response = await fetch('/api/agent/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages,
                stream: false // 일단 스트리밍 없이 구현
            } as AgentRequest),
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data: AgentResponse = await response.json();

        // ChatMessage 형식으로 변환
        return {
            id: generateId(),
            role: 'assistant',
            content: data.content,
            timestamp: new Date()
        };

    } catch (error) {
        console.error('Failed to send message to AI Agent:', error);
        throw error;
    }
}

// ID 생성 헬퍼
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

**📌 핵심 포인트:**

- `/api/agent/chat` 엔드포인트 호출 (상대 경로)
- 대화 히스토리 관리
- 타입 안전성

### 4-2. React 컴포넌트에서 사용

**예시: `ChatComponent.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { sendMessage, ChatMessage } from '@/app/lib/aiAgent';

export default function ChatComponent() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        // 사용자 메시지 추가
        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // AI 응답 받기 (대화 히스토리 포함)
            const aiResponse = await sendMessage(input, messages);
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error('Failed to send message:', error);
            // 에러 처리
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* 채팅 UI 구현 */}
            <div>
                {messages.map(msg => (
                    <div key={msg.id}>
                        <strong>{msg.role}:</strong> {msg.content}
                    </div>
                ))}
            </div>

            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} disabled={loading}>
                전송
            </button>
        </div>
    );
}
```

---

### Step 5: 환경변수 설정

### 5-1. `.env.example` 업데이트

**파일: `.env.example`**

```bash
# --- 포트 설정 ---
BACKEND_PORT=8081
FRONTEND_PORT=3001
AGENT_PORT=8000  # 👈 추가

# --- AI Agent Server ---
# Google Gemini API 키 (필수: <https://makersuite.google.com/app/apikey> 에서 발급)
GOOGLE_API_KEY=여기에-Google-API-키를-입력하세요  # 👈 추가
```

### 5-2. 실제 `.env` 파일 생성

```bash
cp .env.example .env
```

그리고 `.env` 파일을 열어서 실제 API 키를 입력하세요:

```bash
GOOGLE_API_KEY=AIzaSy...실제-API-키
```

> 🔑 **Google API Key 발급**: https://makersuite.google.com/app/apikey
> 

---

### Step 6: Agent Server API 엔드포인트 확인

여러분의 Agent Server가 다음 형식을 따르는지 확인하세요:

**파일: `agent-server/app/main.py`**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat

app = FastAPI(title="AI Chat Server")

# CORS 설정 (BFF 프록시를 사용하므로 실제로는 불필요)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
```

**파일: `agent-server/app/routers/chat.py`**

```python
from fastapi import APIRouter
from app.models.schemas import ChatRequest

router = APIRouter()

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    # 여기에 AI 로직 구현
    # request.messages 사용
    # request.stream으로 스트리밍 여부 확인

    if not request.stream:
        content = "AI 응답"
        return {"content": content}

    # 스트리밍은 나중에 구현...
```

**파일: `agent-server/app/models/schemas.py`**

```python
from pydantic import BaseModel
from typing import List

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    stream: bool = False
```

---

## 테스트

### 1단계: Docker 빌드 및 실행

```bash
# Agent Server 이미지 빌드
docker-compose build agent-server

# 전체 서비스 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f agent-server
```

### 2단계: Health Check

```bash
# Agent Server 헬스체크 (로컬 포트가 열려있는 경우)
curl <http://localhost:8000/health>

# 기대 응답:
# {"status":"ok"}
```

### 3단계: BFF 프록시 테스트

브라우저 콘솔에서:

```jsx
// 브라우저 개발자 도구 콘솔에서 실행
fetch('/api/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        messages: [
            { role: 'user', content: '안녕하세요' }
        ],
        stream: false
    })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

**기대 결과:**

```json
{
  "content": "안녕하세요! 무엇을 도와드릴까요?"
}
```

### 4단계: 실제 UI에서 테스트

여러분의 채팅 컴포넌트를 열고 메시지를 전송해보세요.

---

## 트러블슈팅

### 문제 1: `GOOGLE_API_KEY` 환경변수 오류

**에러 메시지:**

```
Error: GOOGLE_API_KEY 환경변수를 반드시 설정하세요
```

**해결:**

```bash
# .env 파일에 추가
echo "GOOGLE_API_KEY=AIzaSy..." >> .env

# 컨테이너 재시작
docker-compose up -d agent-server
```

---

### 문제 2: Agent Server 연결 실패 (502 Bad Gateway)

**에러 메시지:**

```json
{"error": "Agent Server connection failed"}
```

**원인 진단:**

1. Agent Server가 실행 중인지 확인:

```bash
docker-compose ps agent-server
```

1. Agent Server 로그 확인:

```bash
docker-compose logs agent-server
```

1. 네트워크 연결 확인:

```bash
# Frontend 컨테이너에서 Agent Server 접근 테스트
docker-compose exec frontend sh -c "curl <http://agent-server:8000/health>"
```

**해결:**

- Agent Server가 멈춰있다면: `docker-compose restart agent-server`
- 빌드 문제라면: `docker-compose build --no-cache agent-server`

---

### 문제 3: `/chat` 엔드포인트를 찾을 수 없음 (404)

**에러 메시지:**

```
Agent Server responded with status: 404
```

**원인:** Agent Server의 라우터 설정 문제

**확인:**

```python
# agent-server/app/main.py
app.include_router(chat.router)  # prefix가 없어야 함

# agent-server/app/routers/chat.py
@router.post("/chat")  # /chat 경로 확인
```

---

### 문제 4: CORS 에러

**에러 메시지:**

```
Access to fetch at '<http://localhost:8000/chat>' has been blocked by CORS policy
```

**원인:** 클라이언트에서 Agent Server를 **직접** 호출하고 있음 (BFF 프록시 미사용)

**해결:**

- `/api/agent/chat` (상대 경로) 사용 확인
- `http://localhost:8000` 같은 절대 경로 사용 금지

```tsx
// ❌ 잘못된 코드
fetch('<http://localhost:8000/chat>', ...)

// ✅ 올바른 코드
fetch('/api/agent/chat', ...)
```

---

### 문제 5: Docker 네트워크 문제

**에러 메시지:**

```
Could not resolve host: agent-server
```

**해결:**

1. 모든 서비스가 같은 Docker 네트워크에 있는지 확인:

```bash
docker network ls
docker network inspect ncafe_default  # 프로젝트 이름에 따라 다름
```

1. `depends_on`이 올바르게 설정되어 있는지 확인:

```yaml
frontend:
  depends_on:
    - backend
    - agent-server  # 👈 이 줄 있는지 확인
```

1. 전체 재시작:

```bash
docker-compose down
docker-compose up -d
```

---

### 문제 6: Python 의존성 설치 실패

**에러 메시지:**

```
ERROR: Could not find a version that satisfies the requirement...
```

**해결:**

`agent-server/requirements.txt` 확인:

```
fastapi
uvicorn
google-genai
python-dotenv
sse-starlette
```

필요시 버전 명시:

```
fastapi>=0.104.0
uvicorn>=0.24.0
```

---

## 체크리스트

구현이 완료되었는지 확인하세요:

- [ ]  `docker-compose.yml`에 `agent-server` 서비스 추가
- [ ]  `frontend` 서비스에 `AGENT_BASE_URL` 환경변수 추가
- [ ]  `frontend` 서비스의 `depends_on`에 `agent-server` 추가
- [ ]  `agent-server/Dockerfile` 존재
- [ ]  `frontend/app/api/agent/chat/route.ts` 생성
- [ ]  `frontend/app/lib/aiAgent.ts` 생성
- [ ]  `.env` 파일에 `GOOGLE_API_KEY` 추가
- [ ]  `docker-compose build agent-server` 성공
- [ ]  `docker-compose up -d` 성공
- [ ]  `curl <http://localhost:8000/health`> 성공 (로컬 포트 열린 경우)
- [ ]  브라우저 콘솔에서 `/api/agent/chat` 호출 성공
- [ ]  실제 UI에서 채팅 테스트 성공

---

## 다음 단계

기본 연동이 완료되었다면, 다음 기능들을 추가해보세요:

1. **스트리밍 응답 구현**
    - SSE(Server-Sent Events) 활용
    - 실시간 타이핑 효과
2. **메뉴 추천 기능**
    - Agent가 메뉴 데이터 접근
    - 구조화된 응답 파싱
3. **대화 히스토리 저장**
    - 세션 스토리지 활용
    - DB 저장 (선택)
4. **에러 핸들링 강화**
    - 재시도 로직
    - Fallback 메시지
5. **인증 통합**
    - 세션 기반 사용자 식별
    - 개인화된 응답

---

## 추가 자료

- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Docker Compose 네트워킹](https://docs.docker.com/compose/networking/)
- [Google Gemini API](https://ai.google.dev/)

---

## 질문이 있나요?

이 가이드를 따라했는데 문제가 발생하면:

1. **에러 메시지 전체**를 복사하세요
2. **트러블슈팅 섹션**을 다시 확인하세요
3. **Docker 로그**를 확인하세요: `docker-compose logs agent-server`
4. **네트워크 구조**를 다시 확인하세요

---

**작성일**: 2026-03-06
**버전**: 1.0