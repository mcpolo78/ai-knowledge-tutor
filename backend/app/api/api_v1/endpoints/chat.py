from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.models.document import Document
from app.models.user import User
from app.services.llm_service import LLMService
from app.api.api_v1.endpoints.auth import get_current_active_user

router = APIRouter()
llm_service = LLMService()

class QuestionRequest(BaseModel):
    question: str
    document_id: int

class QuestionResponse(BaseModel):
    question: str
    answer: str
    document_title: str

@router.post("/ask", response_model=QuestionResponse)
async def ask_question(
    request: QuestionRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Ask a question about a specific document"""

    # Verify document ownership
    document = db.query(Document).filter(
        Document.id == request.document_id,
        Document.user_id == current_user.id
    ).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    try:
        # Get answer from LLM
        answer = await llm_service.answer_question(
            question=request.question,
            document_content=document.content,
            document_title=document.title
        )

        return QuestionResponse(
            question=request.question,
            answer=answer,
            document_title=document.title
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to answer question: {str(e)}")

@router.get("/documents", response_model=list)
async def get_available_documents(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get list of documents available for chat"""
    documents = db.query(Document).filter(Document.user_id == current_user.id).all()
    return [
        {
            "id": doc.id,
            "title": doc.title,
            "filename": doc.filename,
            "document_type": doc.document_type.value
        }
        for doc in documents
    ]