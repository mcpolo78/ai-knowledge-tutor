from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.core.database import get_db
from app.models.document import Document
from app.models.user import User
from app.models.learning_material import Summary, Quiz, QuizQuestion, FlashcardSet, Flashcard
from app.services.llm_service import LLMService
from app.api.api_v1.endpoints.auth import get_current_active_user

router = APIRouter()
llm_service = LLMService()

def verify_document_ownership(document_id: int, user_id: int, db: Session) -> Document:
    """Verify that user owns the document and return it"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == user_id
    ).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

# Summary endpoints
@router.post("/summaries/{document_id}", response_model=dict)
async def generate_summary(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate a summary for a document"""

    # Verify document ownership
    document = verify_document_ownership(document_id, current_user.id, db)

    # Check if summary already exists
    existing_summary = db.query(Summary).filter(Summary.document_id == document_id).first()
    if existing_summary:
        return {
            "id": existing_summary.id,
            "title": existing_summary.title,
            "content": existing_summary.content,
            "created_at": existing_summary.created_at
        }

    try:
        # Generate summary using LLM
        summary_content = await llm_service.generate_summary(document.content, document.title)

        # Save to database
        summary = Summary(
            document_id=document_id,
            title=f"Summary of {document.title}",
            content=summary_content
        )
        db.add(summary)
        db.commit()
        db.refresh(summary)

        return {
            "id": summary.id,
            "title": summary.title,
            "content": summary.content,
            "created_at": summary.created_at
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate summary: {str(e)}")

@router.get("/summaries/{document_id}", response_model=dict)
async def get_summary(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get summary for a document"""
    # Verify document ownership first
    verify_document_ownership(document_id, current_user.id, db)

    summary = db.query(Summary).filter(Summary.document_id == document_id).first()
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found")

    return {
        "id": summary.id,
        "title": summary.title,
        "content": summary.content,
        "created_at": summary.created_at
    }

# Quiz endpoints
@router.post("/quizzes/{document_id}", response_model=dict)
async def generate_quiz(
    document_id: int,
    num_questions: int = 5,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate a quiz for a document"""

    # Verify document ownership
    document = verify_document_ownership(document_id, current_user.id, db)

    # Check if quiz already exists
    existing_quiz = db.query(Quiz).filter(Quiz.document_id == document_id).first()
    if existing_quiz:
        # Return existing quiz with questions
        questions_data = []
        for question in existing_quiz.questions:
            questions_data.append({
                "id": question.id,
                "question": question.question,
                "correct_answer": question.correct_answer,
                "options": question.options,
                "explanation": question.explanation
            })

        return {
            "id": existing_quiz.id,
            "title": existing_quiz.title,
            "questions": questions_data,
            "created_at": existing_quiz.created_at
        }

    try:
        # Generate quiz using LLM
        quiz_questions = await llm_service.generate_quiz(document.content, document.title, num_questions)

        # Create quiz
        quiz = Quiz(
            document_id=document_id,
            title=f"Quiz for {document.title}",
            num_questions=num_questions
        )
        db.add(quiz)
        db.commit()
        db.refresh(quiz)

        # Create quiz questions
        questions_data = []
        for i, question_data in enumerate(quiz_questions):
            quiz_question = QuizQuestion(
                quiz_id=quiz.id,
                question=question_data["question"],
                correct_answer=question_data["correct_answer"],
                options=question_data["options"],
                explanation=question_data.get("explanation", ""),
                order_index=i
            )
            db.add(quiz_question)
            questions_data.append({
                "question": quiz_question.question,
                "correct_answer": quiz_question.correct_answer,
                "options": quiz_question.options,
                "explanation": quiz_question.explanation
            })

        db.commit()

        return {
            "id": quiz.id,
            "title": quiz.title,
            "questions": questions_data,
            "created_at": quiz.created_at
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")

@router.get("/quizzes/{document_id}", response_model=List[dict])
async def get_quizzes(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all quizzes for a document"""
    # Verify document ownership first
    verify_document_ownership(document_id, current_user.id, db)

    quizzes = db.query(Quiz).filter(Quiz.document_id == document_id).all()
    result = []
    for quiz in quizzes:
        questions_data = []
        for question in quiz.questions:
            questions_data.append({
                "id": question.id,
                "question": question.question,
                "correct_answer": question.correct_answer,
                "options": question.options,
                "explanation": question.explanation
            })

        result.append({
            "id": quiz.id,
            "title": quiz.title,
            "questions": questions_data,
            "created_at": quiz.created_at
        })

    return result

# Flashcard endpoints
@router.post("/flashcards/{document_id}", response_model=dict)
async def generate_flashcards(
    document_id: int,
    num_cards: int = 10,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate flashcards for a document"""

    # Verify document ownership
    document = verify_document_ownership(document_id, current_user.id, db)

    # Check if flashcard set already exists
    existing_set = db.query(FlashcardSet).filter(FlashcardSet.document_id == document_id).first()
    if existing_set:
        # Return existing flashcard set
        flashcards_data = []
        for flashcard in existing_set.flashcards:
            flashcards_data.append({
                "id": flashcard.id,
                "front": flashcard.front,
                "back": flashcard.back,
                "difficulty": flashcard.difficulty,
                "next_review": flashcard.next_review
            })

        return {
            "id": existing_set.id,
            "title": existing_set.title,
            "message": f"Found {len(flashcards_data)} existing flashcards",
            "flashcards": flashcards_data
        }

    try:
        # Generate flashcards using LLM
        flashcard_data = await llm_service.generate_flashcards(document.content, document.title, num_cards)

        # Create flashcard set
        flashcard_set = FlashcardSet(
            document_id=document_id,
            title=f"Flashcards for {document.title}",
            num_cards=num_cards
        )
        db.add(flashcard_set)
        db.commit()
        db.refresh(flashcard_set)

        # Create flashcards
        flashcards_data = []
        for i, card_data in enumerate(flashcard_data):
            flashcard = Flashcard(
                flashcard_set_id=flashcard_set.id,
                front=card_data["front"],
                back=card_data["back"],
                order_index=i
            )
            db.add(flashcard)
            flashcards_data.append({
                "front": flashcard.front,
                "back": flashcard.back,
                "difficulty": flashcard.difficulty,
                "next_review": flashcard.next_review
            })

        db.commit()

        return {
            "id": flashcard_set.id,
            "title": flashcard_set.title,
            "message": f"Generated {len(flashcards_data)} flashcards",
            "flashcards": flashcards_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate flashcards: {str(e)}")

@router.get("/flashcards/{document_id}", response_model=List[dict])
async def get_flashcards(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all flashcards for a document"""
    # Verify document ownership first
    verify_document_ownership(document_id, current_user.id, db)

    flashcard_set = db.query(FlashcardSet).filter(FlashcardSet.document_id == document_id).first()
    if not flashcard_set:
        return []

    flashcards = flashcard_set.flashcards
    return [
        {
            "id": card.id,
            "front": card.front,
            "back": card.back,
            "difficulty": card.difficulty,
            "next_review": card.next_review,
            "created_at": card.created_at
        }
        for card in flashcards
    ]

@router.put("/flashcards/{flashcard_id}/review")
async def review_flashcard(
    flashcard_id: int,
    difficulty: int,  # 0 = easy, 1 = normal, 2 = hard
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update flashcard difficulty after review (for spaced repetition)"""
    flashcard = db.query(Flashcard).filter(Flashcard.id == flashcard_id).first()
    if not flashcard:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    # Verify ownership through document via flashcard set
    flashcard_set = flashcard.flashcard_set
    verify_document_ownership(flashcard_set.document_id, current_user.id, db)

    # Simple spaced repetition algorithm
    from datetime import datetime, timedelta

    if difficulty == 0:  # Easy
        next_review_days = 7
        difficulty_str = "easy"
    elif difficulty == 1:  # Normal
        next_review_days = 3
        difficulty_str = "medium"
    else:  # Hard
        next_review_days = 1
        difficulty_str = "hard"

    flashcard.difficulty = difficulty_str
    flashcard.next_review = datetime.utcnow() + timedelta(days=next_review_days)

    db.commit()

    return {"message": "Flashcard review updated", "next_review": flashcard.next_review}