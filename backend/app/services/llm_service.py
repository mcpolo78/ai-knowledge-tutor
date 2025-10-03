from openai import OpenAI
from typing import List, Dict, Any, Optional
from app.core.config import settings
import json

class LLMService:
    # GPT-4o-mini has 128k token limit (~4 chars per token)
    # Reserve tokens for prompt + response
    MAX_CONTENT_CHARS = 400000  # ~100k tokens for content (handles large PDFs)

    def __init__(self):
        self.client = None
        if settings.OPENAI_API_KEY:
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def _truncate_content(self, content: str, max_chars: int = None) -> str:
        """Truncate content if it exceeds token limits"""
        if max_chars is None:
            max_chars = self.MAX_CONTENT_CHARS

        if len(content) <= max_chars:
            return content

        # Truncate and add notice
        truncated = content[:max_chars]
        return truncated + "\n\n[Content truncated due to length...]"

    async def generate_summary(self, content: str, title: str = "") -> str:
        """Generate a summary of the document content"""
        # Truncate content to avoid token limits
        truncated_content = self._truncate_content(content)

        prompt = f"""
        Please create a clear and comprehensive summary of the following document content.

        Document Title: {title}

        Content:
        {truncated_content}

        Please provide a well-structured summary that captures the key points, main concepts, and important details.
        The summary should be informative and help someone understand the core content without reading the full document.
        """

        try:
            if not self.client:
                raise Exception("OpenAI client not initialized. Please check your API key.")

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert at creating clear and comprehensive summaries of educational content."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.3
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            raise Exception(f"Failed to generate summary: {str(e)}")

    async def generate_quiz(self, content: str, title: str = "", num_questions: int = 5) -> List[Dict[str, Any]]:
        """Generate quiz questions from document content"""
        # Truncate content to avoid token limits
        truncated_content = self._truncate_content(content)

        prompt = f"""
        Based on the following document content, create {num_questions} multiple-choice quiz questions.

        Document Title: {title}

        Content:
        {truncated_content}

        For each question, provide:
        1. A clear question
        2. Four answer options (A, B, C, D)
        3. The correct answer
        4. A brief explanation of why the answer is correct

        Format your response as a JSON array of objects with the following structure:
        [
            {{
                "question": "The question text",
                "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
                "correct_answer": "A",
                "explanation": "Explanation of why this is correct"
            }}
        ]
        """

        try:
            if not self.client:
                raise Exception("OpenAI client not initialized. Please check your API key.")

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert at creating educational quiz questions. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=0.4
            )

            quiz_json = response.choices[0].message.content.strip()
            # Clean up the response in case it has markdown formatting
            if quiz_json.startswith("```json"):
                quiz_json = quiz_json[7:]
            if quiz_json.endswith("```"):
                quiz_json = quiz_json[:-3]

            return json.loads(quiz_json.strip())
        except Exception as e:
            raise Exception(f"Failed to generate quiz: {str(e)}")

    async def generate_flashcards(self, content: str, title: str = "", num_cards: int = 10) -> List[Dict[str, str]]:
        """Generate flashcards from document content"""
        # Truncate content to avoid token limits
        truncated_content = self._truncate_content(content)

        prompt = f"""
        Based on the following document content, create {num_cards} flashcards for studying.

        Document Title: {title}

        Content:
        {truncated_content}

        Create flashcards that focus on:
        - Key concepts and definitions
        - Important facts and figures
        - Relationships between ideas
        - Critical thinking questions

        Format your response as a JSON array of objects with the following structure:
        [
            {{
                "front": "Question or concept to test",
                "back": "Answer or explanation"
            }}
        ]
        """

        try:
            if not self.client:
                raise Exception("OpenAI client not initialized. Please check your API key.")

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert at creating effective study flashcards. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=0.4
            )

            flashcards_json = response.choices[0].message.content.strip()
            # Clean up the response in case it has markdown formatting
            if flashcards_json.startswith("```json"):
                flashcards_json = flashcards_json[7:]
            if flashcards_json.endswith("```"):
                flashcards_json = flashcards_json[:-3]

            return json.loads(flashcards_json.strip())
        except Exception as e:
            raise Exception(f"Failed to generate flashcards: {str(e)}")

    async def answer_question(self, question: str, document_content: str, document_title: str = "") -> str:
        """Answer a question based on document content"""
        # Truncate content to avoid token limits
        truncated_content = self._truncate_content(document_content)

        prompt = f"""
        Based on the following document content, please answer the user's question.

        Document Title: {document_title}

        Document Content:
        {truncated_content}

        User Question: {question}

        Please provide a comprehensive answer based solely on the information in the document.
        If the answer is not found in the document, please state that clearly.
        """

        try:
            if not self.client:
                raise Exception("OpenAI client not initialized. Please check your API key.")

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that answers questions based on provided document content. Be accurate and cite the document when possible."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.3
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            raise Exception(f"Failed to answer question: {str(e)}")