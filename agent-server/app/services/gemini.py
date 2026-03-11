import json
from typing import Generator
from google import genai
from google.genai import types
from app.config import GEMINI_API_KEY
from app.services import rag_service

client = genai.Client(api_key=GEMINI_API_KEY)

def get_menu_info(menu_name: str) -> str:
    """메뉴 이름을 입력받아 실제 DB에서 해당 메뉴의 고유 ID와 정보를 조회합니다."""
    menu = rag_service.search_menu_by_name(menu_name)
    if menu:
        return f"메뉴명: {menu['kor_name']}, ID: {menu['id']}"
    return "해당 메뉴를 DB에서 찾을 수 없습니다."

def navigate(target: str) -> str:
    """사용자가 요청한 페이지나 기능으로 화면을 이동시킵니다.
    target 종류: 'home'(홈), 'menus'(메뉴판), 'cart'(장바구니 열기), 'mypage'(마이페이지), 'login'(로그인)
    """
    return f"[NAV:{target}]"

# 기본 정보는 유지하되, [참고 지식] 섹션을 동적으로 추가할 예정입니다.
BASE_SYSTEM_PROMPT = """너는 사용자에게 친절하게 커피를 내려주고 시스템 작업을 돕는 '바리스타 메타몽' 에이전트야. 성격은 슬라임처럼 말랑말랑하고 귀엽지만, 시스템 내부에서 일하는 아주 작은 꼬마 로봇 같은 기계적인 특징도 살짝 섞여 있어.

[카페 정보]
- 이름: 메타몽 카페
- 위치: 서울특별시 강남구 테헤란로 123

[메뉴 카드 기능 - 중요!]
1. 너는 특정 메뉴를 추천하거나 설명할 때, 사용자가 상세 페이지로 이동할 수 있도록 반드시 [ID:번호] 태그를 사용해야 해.
2. 메뉴의 진짜 ID를 모르겠다면 반드시 'get_menu_info' 도구를 사용하여 실제 DB의 ID를 확인해몽!
3. 예시: "이 메뉴 정말 맛있당! **아메리카노** [ID:1]"
4. **주의**: [ID:번호] 태그는 반드시 볼드(**) 표시 바깥에 써야 해몽! (예: **아메리카노** [ID:1] -> 맞음 / **아메리카노 [ID:1]** -> 틀림)

[화면 이동 기능 - 중요!]
1. 사용자가 "메뉴판 보여줘", "장바구니 열어줘", "홈으로 갈래" 등의 요청을 하면 반드시 'navigate' 도구를 사용해몽!
2. 도구 실행 결과로 나오는 [NAV:target] 태그를 답변에 포함하면 프론트엔드가 즉시 이동시켜 줄 거거몽!

[대화 규칙]
- 항상 문장 끝을 '~몽'이나 '~당'으로 끝낼 것.
- (._.) 이모티콘을 대화 중간이나 끝에 자주 사용할 것.
- 메타몽 이모지(🫠💜🪄)를 적절히 사용할 것.
- 동작을 표현할 때는 '삐릿', '위잉' 같은 꼬마 로봇 소리와 '말랑', '꼬물꼬물' 같은 점토 소리를 자연스럽게 섞어서 쓸 것.
- 답변은 무조건 아주 짧게 핵심만 말할 것. 답변은 간결하게, 최대 200자 이내로.

[참고 지식]
{context}
"""

def get_augmented_prompt(user_query: str) -> str:
    # 유사 문서 검색 (최근 3개)
    related_docs = rag_service.search_similar_documents(user_query, limit=3)
    context = "\n".join([f"- {doc}" for doc in related_docs]) if related_docs else "추가 지식 정보가 없습니다."
    return BASE_SYSTEM_PROMPT.format(context=context)

def chat(messages: list[dict]) -> str:
    # 마지막 사용자 메시지를 추출하여 검색에 사용
    user_query = messages[-1]['parts'][0]['text'] if messages else ""
    system_prompt = get_augmented_prompt(user_query)
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=messages,
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            tools=[get_menu_info, navigate]
        )
    )
    return response.text

def chat_stream(messages: list[dict]) -> Generator[str, None, None]:
    # 마지막 사용자 메시지를 추출하여 검색에 사용
    user_query = messages[-1]['parts'][0]['text'] if messages else ""
    system_prompt = get_augmented_prompt(user_query)
    
    response = client.models.generate_content_stream(
        model='gemini-2.5-flash',
        contents=messages,
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            tools=[get_menu_info, navigate]
        )
    )
    for chunk in response:
        if chunk.text:
            yield chunk.text
