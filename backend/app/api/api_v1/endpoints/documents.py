from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
from app.core.database import get_db
from app.core.config import settings
from app.models.document import Document, DocumentType
from app.models.user import User
from app.services.document_processor import DocumentProcessor
from app.api.api_v1.endpoints.auth import get_current_active_user

router = APIRouter()
document_processor = DocumentProcessor()

@router.post("/upload", response_model=dict)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload and process a document"""

    # Validate file type
    document_type = document_processor.get_document_type_from_extension(file.filename)
    if not document_type:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload PDF, DOCX, or Markdown files."
        )

    # Create upload directory if it doesn't exist
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    # Save file
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # Extract text content
    try:
        content = document_processor.process_document(file_path, document_type)
    except Exception as e:
        # Clean up file if processing fails
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

    # Save to database
    try:
        db_document = Document(
            title=os.path.splitext(file.filename)[0],
            filename=file.filename,
            file_path=file_path,
            document_type=document_type,
            content=content,
            user_id=current_user.id
        )
        db.add(db_document)
        db.commit()
        db.refresh(db_document)
    except Exception as e:
        # Clean up file if database save fails
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to save to database: {str(e)}")

    return {
        "message": "Document uploaded and processed successfully",
        "document_id": db_document.id,
        "title": db_document.title,
        "document_type": document_type.value,
        "content_length": len(content)
    }

@router.get("/", response_model=List[dict])
async def get_documents(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's documents"""
    documents = db.query(Document).filter(Document.user_id == current_user.id).all()
    return [
        {
            "id": doc.id,
            "title": doc.title,
            "filename": doc.filename,
            "document_type": doc.document_type.value,
            "created_at": doc.created_at,
            "content_length": len(doc.content) if doc.content else 0
        }
        for doc in documents
    ]

@router.get("/{document_id}", response_model=dict)
async def get_document(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific document"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    return {
        "id": document.id,
        "title": document.title,
        "filename": document.filename,
        "document_type": document.document_type.value,
        "content": document.content,
        "created_at": document.created_at
    }

@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a document"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Delete file from filesystem
    if os.path.exists(document.file_path):
        os.remove(document.file_path)

    # Delete from database
    db.delete(document)
    db.commit()

    return {"message": "Document deleted successfully"}