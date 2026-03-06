import json
from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
from app.models.schemas import ChatRequest, Message
from app.services.gemini import chat, chat_stream

router = APIRouter(prefix="/chat", tags=["chat"])

def to_gemini_messages(messages: list[Message]) -> list[dict]:
    return [{"role": m.role, "parts": [{"text": m.content}]} for m in messages]

@router.post("")
def chat_endpoint(request: ChatRequest):
    gemini_messages = to_gemini_messages(request.messages)
    
    if not request.stream:
        response_text = chat(gemini_messages)
        return {"content": response_text}
        
    def event_generator():
        try:
            for text_chunk in chat_stream(gemini_messages):
                yield {"data": json.dumps({"content": text_chunk}, ensure_ascii=False)}
            yield {"data": "[DONE]"}
        except Exception as e:
            yield {"data": json.dumps({"error": str(e)}, ensure_ascii=False)}
            yield {"data": "[DONE]"}

    return EventSourceResponse(event_generator())
