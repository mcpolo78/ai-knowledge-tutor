import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, Base
from app.models.user import User
from app.models.document import Document, DocumentType
from app.models.learning_material import Summary, Quiz, Flashcard

def create_tables():
    """Create all database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully!")
        print("Database file: knowledge_tutor.db")

        # Check if tables were created
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Tables created: {', '.join(tables)}")

    except Exception as e:
        print(f"Error creating database tables: {e}")
        return False

    return True

if __name__ == "__main__":
    create_tables()