from pydantic import BaseModel

class Message(BaseModel):
    role: str
    content: str

class UserContext(BaseModel):
    nickname: str | None = None
    role: str | None = None       # "MEMBER", "ADMIN"
    timezone: str = "Asia/Seoul"

class ChatRequest(BaseModel):
    messages: list[Message]
    stream: bool = True
    userContext: UserContext | None = None

# RAG Schemas
class RagDocumentCreate(BaseModel):
    content: str

class RagDocumentUpdate(BaseModel):
    content: str

class RagDocumentResponse(BaseModel):
    id: int
    content: str
