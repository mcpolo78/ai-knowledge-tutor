import os
import PyPDF2
import pdfplumber
from docx import Document as DocxDocument
import markdown
from typing import Optional
from app.models.document import DocumentType

class DocumentProcessor:
    def __init__(self):
        pass

    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file using pdfplumber for better text extraction"""
        try:
            text = ""
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            return text.strip()
        except Exception as e:
            # Fallback to PyPDF2
            try:
                text = ""
                with open(file_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    for page in pdf_reader.pages:
                        text += page.extract_text() + "\n"
                return text.strip()
            except Exception as fallback_error:
                raise Exception(f"Failed to extract text from PDF: {str(fallback_error)}")

    def extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = DocxDocument(file_path)
            text = []
            for paragraph in doc.paragraphs:
                text.append(paragraph.text)
            return "\n".join(text).strip()
        except Exception as e:
            raise Exception(f"Failed to extract text from DOCX: {str(e)}")

    def extract_text_from_markdown(self, file_path: str) -> str:
        """Extract text from Markdown file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()

            # Convert markdown to HTML then extract text
            html = markdown.markdown(content)

            # Simple HTML tag removal (for basic text extraction)
            import re
            text = re.sub('<[^<]+?>', '', html)
            return text.strip()
        except Exception as e:
            raise Exception(f"Failed to extract text from Markdown: {str(e)}")

    def process_document(self, file_path: str, document_type: DocumentType) -> str:
        """Process document based on type and extract text"""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        if document_type == DocumentType.PDF:
            return self.extract_text_from_pdf(file_path)
        elif document_type == DocumentType.DOCX:
            return self.extract_text_from_docx(file_path)
        elif document_type == DocumentType.MARKDOWN:
            return self.extract_text_from_markdown(file_path)
        else:
            raise ValueError(f"Unsupported document type: {document_type}")

    def get_document_type_from_extension(self, filename: str) -> Optional[DocumentType]:
        """Determine document type from file extension"""
        ext = os.path.splitext(filename)[1].lower()

        if ext == '.pdf':
            return DocumentType.PDF
        elif ext in ['.docx', '.doc']:
            return DocumentType.DOCX
        elif ext in ['.md', '.markdown']:
            return DocumentType.MARKDOWN
        else:
            return None