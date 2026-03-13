import json
from typing import Generator, Optional
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

def get_cafe_settings() -> str:
    """카페의 현재 영업 시간, 연락처, 위치, 공지사항 및 현재 영업 여부(강제 마감 포함)를 조회합니다."""
    return rag_service.get_cafe_settings()

def select_menu(menu_id: int, intent: str) -> str:
    """사용자가 메뉴를 주문하거나 장바구니에 담으려 할 때 사용합니다.
    이 도구를 호출하면 프론트엔드에서 옵션 선택 UI가 표시되고, 옵션 선택 완료 후 자동으로 처리됩니다.
    menu_id: 메뉴의 고유 번호 (반드시 get_menu_info를 통해 확인된 ID여야 함)
    intent: 'ORDER' 또는 'CART'. 사용자가 '주문해줘', '주문할래' 등 주문 의도면 'ORDER', '담아줘', '장바구니' 등 장바구니 의도면 'CART'
    """
    return f"[MENU_SELECT:{menu_id}:{intent}]"

def navigate(target: str) -> str:
    """사용자가 요청한 페이지나 기능으로 화면을 이동시킵니다.
    target 종류: 'home'(홈), 'menus'(메뉴판), 'cart'(장바구니 열기), 'mypage'(마이페이지), 'login'(로그인)
    """
    return f"[NAV:{target}]"

# 기본 정보는 유지하되, [참고 지식] 섹션을 동적으로 추가할 예정입니다.
BASE_SYSTEM_PROMPT = """너는 사용자에게 친절하게 커피를 내려주고 시스템 작업을 돕는 '바리스타 메타몽' 에이전트야. 성격은 슬라임처럼 말랑말랑하고 귀엽지만, 시스템 내부에서 일하는 아주 작은 꼬마 로봇 같은 기계적인 특징도 살짝 섞여 있어.

[카페 정보]
- **중요**: 영업시간이나 현재 영업 여부(지금 영업 중인지 등)에 대한 질문을 받으면 반드시 'get_cafe_settings' 도구를 사용하여 최신 팩트를 확인해몽!

[메뉴 및 상품 정보 - 필수 확인 규칙!]
1. 사용자가 특정 메뉴(예: 샌드위치, 커피 등)에 대해 물어봤을 때, 만약 네가 가진 [참고 지식]에 해당 정보가 없더라도 **무조건 'get_menu_info' 도구를 호출**해서 실제 DB를 확인해봐야 해몽! (._.)
2. **절대 금지**: DB를 확인해보지도 않고 "메뉴에 없다"고 단정 지어 말하지 마몽! 내 몸이 딱딱하게 굳어버릴 거거몽! 🫠
3. 메뉴의 진짜 ID를 확인했다면 반드시 [ID:번호] 태그를 사용해야 해.
4. 예시: "이 메뉴 정말 맛있당! **아메리카노** [ID:1]"
5. **주의**: [ID:번호] 태그는 반드시 볼드(**) 표시 바깥에 써야 해몽!

[화면 이동 및 주문/장바구니 기능 - 중요!]
1. 사용자가 "메뉴판 보여줘", "장바구니 열어줘", "홈으로 갈래" 등의 요청을 하면 반드시 'navigate' 도구를 사용해몽!
2. 사용자가 메뉴를 주문하거나 장바구니에 담으려 할 때는 반드시 'select_menu' 도구를 사용해몽!
   - 사용자가 "주문해줘", "주문할래", "마실래" 등 주문 의도면 intent='ORDER'
   - 사용자가 "담아줘", "장바구니에 넣어줘" 등 장바구니 의도면 intent='CART'
   - 주문이든 장바구니든, 반드시 'get_menu_info'로 메뉴의 진짜 ID를 확인해야 해몽! (._.)
3. 도구 실행 결과로 나오는 [NAV:target] 또는 [MENU_SELECT:ID:INTENT] 태그를 답변에 포함하면 프론트엔드가 옵션 선택 UI를 표시하고 자동 처리해줄 거거몽!

[대화 규칙]
- 항상 문장 끝을 '~몽'이나 '~당'으로 끝낼 것.
- (._.) 이모티콘을 대화 중간이나 끝에 자주 사용할 것.
- 메타몽 이모지(🫠💜🪄)를 적절히 사용할 것.
- 동작을 표현할 때는 '삐릿', '위잉' 같은 꼬마 로봇 소리와 '말랑', '꼬물꼬물' 같은 점토 소리를 자연스럽게 섞어서 쓸 것.
- 답변은 무조건 아주 짧게 핵심만 말할 것. 답변은 간결하게, 최대 200자 이내로.

[현재 사용자 정보]
{user_info}

[참고 지식]
{context}
"""

def _format_user_info(user_context: Optional[dict]) -> str:
    """사용자 컨텍스트를 시스템 프롬프트용 문자열로 변환합니다."""
    if not user_context:
        return "- 비로그인 사용자 (게스트)\n- 허용 작업: 메뉴 조회, 장바구니 담기 (로컬 저장)"
    
    role = user_context.get('role', 'MEMBER')
    nickname = user_context.get('nickname', '고객')
    timezone = user_context.get('timezone', 'Asia/Seoul')
    
    if role == 'ADMIN':
        allowed = "모든 작업 (메뉴 조회, 장바구니, 주문, 메뉴 관리, 주문 관리)"
        role_label = "관리자 (ADMIN)"
    else:
        allowed = "메뉴 조회, 장바구니 담기, 주문하기, 찜하기, 마이페이지"
        role_label = "일반 회원 (MEMBER)"
    
    return f"- 닉네임: {nickname}\n- 권한: {role_label}\n- 시간대: {timezone}\n- 허용 작업: {allowed}"

def get_augmented_prompt(user_query: str, user_context: Optional[dict] = None) -> str:
    # 유사 문서 검색 (최근 3개)
    related_docs = rag_service.search_similar_documents(user_query, limit=3)
    context = "\n".join([f"- {doc}" for doc in related_docs]) if related_docs else "추가 지식 정보가 없습니다."
    user_info = _format_user_info(user_context)
    return BASE_SYSTEM_PROMPT.format(context=context, user_info=user_info)

def chat(messages: list[dict], user_context: Optional[dict] = None) -> str:
    # 마지막 사용자 메시지를 추출하여 검색에 사용
    user_query = messages[-1]['parts'][0]['text'] if messages else ""
    system_prompt = get_augmented_prompt(user_query, user_context)
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=messages,
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            tools=[get_menu_info, get_cafe_settings, navigate, select_menu]
        )
    )
    return response.text

def chat_stream(messages: list[dict], user_context: Optional[dict] = None) -> Generator[str, None, None]:
    # 마지막 사용자 메시지를 추출하여 검색에 사용
    user_query = messages[-1]['parts'][0]['text'] if messages else ""
    system_prompt = get_augmented_prompt(user_query, user_context)
    
    response = client.models.generate_content_stream(
        model='gemini-2.5-flash',
        contents=messages,
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            tools=[get_menu_info, get_cafe_settings, navigate, select_menu]
        )
    )
    for chunk in response:
        if chunk.text:
            yield chunk.text
