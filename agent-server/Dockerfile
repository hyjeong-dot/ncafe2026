FROM python:3.12.3-slim

WORKDIR /app

# 시스템 의존성 업데이트 및 설치 (필요시)
RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 파이썬 패키지 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY . .

# FastAPI 서버 실행 (컨테이너 외부에서 접근 가능하도록 0.0.0.0 지정)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
