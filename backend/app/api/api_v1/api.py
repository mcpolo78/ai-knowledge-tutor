from fastapi import APIRouter
from app.api.api_v1.endpoints import documents, learning_materials, chat, auth

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(learning_materials.router, prefix="/learning-materials", tags=["learning-materials"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])