from fastapi import APIRouter, HTTPException
from app.models.schemas import RagDocumentCreate, RagDocumentUpdate, RagDocumentResponse
from app.services import rag_service

router = APIRouter(prefix="/rag", tags=["rag"])

@router.post("/upload", response_model=dict)
def upload_document(request: RagDocumentCreate):
    doc_id = rag_service.add_document(request.content)
    if doc_id is None:
        raise HTTPException(status_code=500, detail="Failed to add document")
    return {"id": doc_id, "message": "Document uploaded and embedded successfully"}

@router.get("/documents", response_model=list[RagDocumentResponse])
def list_documents():
    return rag_service.get_all_documents()

@router.put("/documents/{doc_id}")
def update_document(doc_id: int, request: RagDocumentUpdate):
    success = rag_service.update_document(doc_id, request.content)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update document")
    return {"message": "Document updated successfully"}

@router.delete("/documents/{doc_id}")
def delete_document(doc_id: int):
    success = rag_service.delete_document(doc_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete document")
    return {"message": "Document deleted successfully"}
