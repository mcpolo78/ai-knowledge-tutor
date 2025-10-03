export interface Document {
  id: number;
  title: string;
  filename: string;
  document_type: 'pdf' | 'docx' | 'markdown';
  created_at: string;
  content_length: number;
  content?: string;
}

export interface Summary {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface Quiz {
  id: number;
  title: string;
  questions: QuizQuestion[];
  created_at: string;
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  difficulty: number;
  next_review: string;
  created_at: string;
}

export interface ChatMessage {
  question: string;
  answer: string;
  document_title: string;
}