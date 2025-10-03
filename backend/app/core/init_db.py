from app.core.database import engine, Base
from app.models.document import Document, DocumentType
from app.models.learning_material import Summary, Quiz, Flashcard

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    create_tables()