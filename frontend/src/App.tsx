import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import DocumentUpload from './pages/DocumentUpload';
import DocumentList from './pages/DocumentList';
import DocumentView from './pages/DocumentView';
import Quiz from './pages/Quiz';
import Flashcards from './pages/Flashcards';
import Chat from './pages/Chat';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<DocumentList />} />
                <Route path="/upload" element={<DocumentUpload />} />
                <Route path="/document/:id" element={<DocumentView />} />
                <Route path="/quiz/:documentId" element={<Quiz />} />
                <Route path="/flashcards/:documentId" element={<Flashcards />} />
                <Route path="/chat" element={<Chat />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;