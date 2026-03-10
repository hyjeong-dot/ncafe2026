from pydantic import BaseModel

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]
    stream: bool = True

# RAG Schemas
class RagDocumentCreate(BaseModel):
    content: str

class RagDocumentUpdate(BaseModel):
    content: str

class RagDocumentResponse(BaseModel):
    id: int
    content: str
