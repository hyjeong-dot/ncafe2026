import os
from dotenv import load_dotenv

load_dotenv()

# AI API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# RAG용 임베딩 모델 설정 (이건 코드의 가독성을 위해 남겨두는 게 좋습니다)
EMBEDDING_MODEL_NAME = "intfloat/multilingual-e5-small"
EMBEDDING_DIMENSION = 384
