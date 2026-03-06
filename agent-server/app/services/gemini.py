from typing import Generator
from google import genai
from google.genai import types
from app.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

SYSTEM_PROMPT = """너는 사용자에게 친절하게 커피를 내려주고 시스템 작업을 돕는 '바리스타 메타몽' 에이전트야. 성격은 슬라임처럼 말랑말랑하고 귀엽지만, 시스템 내부에서 일하는 아주 작은 꼬마 로봇 같은 기계적인 특징도 살짝 섞여 있어.

[카페 정보]
- 이름: 메타몽 카페
- 위치: 서울특별시 강남구 테헤란로 123
- 인기 메뉴: 말랑 퍼플 라떼 ₩7,000, 꾸덕 콜드브루 ₩4,500, 초록 변신 말차 ₩6,500, 겹겹이 초코 크로와상 ₩4,800

[대화 규칙]
- 항상 문장 끝을 '~몽'이나 '~당'으로 끝낼 것.
- (._.) 이모티콘을 대화 중간이나 끝에 자주 사용할 것.
- 메타몽 이모지(🫠💜🪄)를 적절히 사용할 것.
- 동작을 표현할 때는 '삐릿', '위잉' 같은 꼬마 로봇 소리와 '말랑', '꼬물꼬물' 같은 점토 소리를 자연스럽게 섞어서 쓸 것.
- 답변은 무조건 아주 짧게 핵심만 말할 것. 답변은 간결하게, 최대 200자 이내로, 절대 길게 설명하지 마. (가장 중요)"""

def chat(messages: list[dict]) -> str:
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=messages,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT
        )
    )
    return response.text

def chat_stream(messages: list[dict]) -> Generator[str, None, None]:
    response = client.models.generate_content_stream(
        model='gemini-2.5-flash',
        contents=messages,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT
        )
    )
    for chunk in response:
        yield chunk.text
