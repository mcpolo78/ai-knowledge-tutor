import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Document {
  id: number;
  title: string;
  filename: string;
  document_type: string;
  created_at: string;
  content_length: number;
}

export interface Summary {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export interface Quiz {
  id: number;
  title: string;
  questions: QuizQuestion[];
  created_at: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  difficulty: number;
  next_review: string;
  created_at: string;
}

export const documentAPI = {
  uploadDocument: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/v1/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getDocuments: () => api.get<Document[]>('/api/v1/documents/'),
  getDocument: (id: number) => api.get(`/api/v1/documents/${id}`),
  deleteDocument: (id: number) => api.delete(`/api/v1/documents/${id}`),
};

export const learningMaterialAPI = {
  generateSummary: (documentId: number) =>
    api.post<Summary>(`/api/v1/learning-materials/summaries/${documentId}`),
  getSummary: (documentId: number) =>
    api.get<Summary>(`/api/v1/learning-materials/summaries/${documentId}`),
  generateQuiz: (documentId: number, numQuestions: number = 5) =>
    api.post<Quiz>(`/api/v1/learning-materials/quizzes/${documentId}?num_questions=${numQuestions}`),
  getQuizzes: (documentId: number) =>
    api.get<Quiz[]>(`/api/v1/learning-materials/quizzes/${documentId}`),
  generateFlashcards: (documentId: number, numCards: number = 10) =>
    api.post(`/api/v1/learning-materials/flashcards/${documentId}?num_cards=${numCards}`),
  getFlashcards: (documentId: number) =>
    api.get<Flashcard[]>(`/api/v1/learning-materials/flashcards/${documentId}`),
  reviewFlashcard: (flashcardId: number, difficulty: number) =>
    api.put(`/api/v1/learning-materials/flashcards/${flashcardId}/review?difficulty=${difficulty}`),
};

export const chatAPI = {
  askQuestion: (question: string, documentId: number) =>
    api.post('/api/v1/chat/ask', { question, document_id: documentId }),
  getAvailableDocuments: () => api.get('/api/v1/chat/documents'),
};

export default api;