import React, { useState, useEffect } from 'react';
import { chatAPI } from '../services/api';

interface Message {
  id: number;
  question: string;
  answer: string;
  document_title: string;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await chatAPI.getAvailableDocuments();
      setDocuments(response.data);
      if (response.data.length > 0) {
        setSelectedDocument(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const askQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !selectedDocument) return;

    setLoading(true);
    try {
      const response = await chatAPI.askQuestion(question, selectedDocument);
      const newMessage: Message = {
        id: Date.now(),
        question: response.data.question,
        answer: response.data.answer,
        document_title: response.data.document_title,
        timestamp: new Date(),
      };

      setMessages([...messages, newMessage]);
      setQuestion('');
    } catch (error) {
      console.error('Error asking question:', error);
      alert('Failed to get answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>💬 Chat with your Documents</h1>
        <p style={descriptionStyle}>
          Ask questions about your uploaded documents and get AI-powered answers.
        </p>
      </div>

      {documents.length === 0 ? (
        <div style={noDocumentsStyle}>
          <h3>No documents available</h3>
          <p>Upload documents first to start chatting with them.</p>
        </div>
      ) : (
        <>
          <div style={documentSelectorStyle}>
            <label style={labelStyle}>Select Document:</label>
            <select
              value={selectedDocument || ''}
              onChange={(e) => setSelectedDocument(Number(e.target.value))}
              style={selectStyle}
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  📄 {doc.title} ({doc.document_type.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div style={chatContainerStyle}>
            <div style={messagesStyle}>
              {messages.length === 0 ? (
                <div style={emptyMessagesStyle}>
                  <div style={welcomeIconStyle}>🤖</div>
                  <h3>Start a conversation!</h3>
                  <p>Ask me anything about your document and I'll help you understand it better.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} style={messageGroupStyle}>
                    <div style={questionStyle}>
                      <div style={questionHeaderStyle}>
                        <span style={userIconStyle}>👤</span>
                        <span style={timestampStyle}>
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div style={questionTextStyle}>{message.question}</div>
                    </div>

                    <div style={answerStyle}>
                      <div style={answerHeaderStyle}>
                        <span style={botIconStyle}>🤖</span>
                        <span style={documentBadgeStyle}>
                          📄 {message.document_title}
                        </span>
                      </div>
                      <div style={answerTextStyle}>{message.answer}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={askQuestion} style={inputFormStyle}>
              <div style={inputContainerStyle}>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question about your document..."
                  style={questionInputStyle}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!question.trim() || loading}
                  style={{
                    ...askButtonStyle,
                    ...((!question.trim() || loading) ? disabledButtonStyle : {}),
                  }}
                >
                  {loading ? '⏳' : '📤'}
                </button>
              </div>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearChat}
                  style={clearButtonStyle}
                >
                  🗑️ Clear Chat
                </button>
              )}
            </form>
          </div>
        </>
      )}
    </div>
  );
};

// Styles
const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '1rem',
  height: 'calc(100vh - 120px)',
  display: 'flex',
  flexDirection: 'column' as const,
};

const headerStyle = {
  textAlign: 'center' as const,
  marginBottom: '1.5rem',
};

const descriptionStyle = {
  color: '#666',
  fontSize: '1.1rem',
  margin: '0.5rem 0 0 0',
};

const noDocumentsStyle = {
  textAlign: 'center' as const,
  padding: '4rem 2rem',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const documentSelectorStyle = {
  marginBottom: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  flexWrap: 'wrap' as const,
};

const labelStyle = {
  fontWeight: 'bold',
  color: '#2c3e50',
};

const selectStyle = {
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '1rem',
  minWidth: '200px',
};

const chatContainerStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column' as const,
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  overflow: 'hidden',
};

const messagesStyle = {
  flex: 1,
  padding: '1rem',
  overflowY: 'auto' as const,
  maxHeight: 'calc(100vh - 300px)',
};

const emptyMessagesStyle = {
  textAlign: 'center' as const,
  padding: '3rem 1rem',
  color: '#666',
};

const welcomeIconStyle = {
  fontSize: '3rem',
  marginBottom: '1rem',
};

const messageGroupStyle = {
  marginBottom: '2rem',
};

const questionStyle = {
  marginBottom: '1rem',
};

const questionHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '0.5rem',
};

const userIconStyle = {
  fontSize: '1.2rem',
};

const timestampStyle = {
  fontSize: '0.8rem',
  color: '#999',
};

const questionTextStyle = {
  backgroundColor: '#e8f4f8',
  padding: '1rem',
  borderRadius: '12px 12px 12px 4px',
  color: '#2c3e50',
  lineHeight: '1.5',
};

const answerStyle = {
  marginLeft: '1rem',
};

const answerHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '0.5rem',
};

const botIconStyle = {
  fontSize: '1.2rem',
};

const documentBadgeStyle = {
  fontSize: '0.8rem',
  color: '#666',
  backgroundColor: '#f0f0f0',
  padding: '0.2rem 0.5rem',
  borderRadius: '12px',
};

const answerTextStyle = {
  backgroundColor: '#f0f8e8',
  padding: '1rem',
  borderRadius: '4px 12px 12px 12px',
  color: '#2c3e50',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap' as const,
};

const inputFormStyle = {
  padding: '1rem',
  borderTop: '1px solid #e0e0e0',
  backgroundColor: '#f9f9f9',
};

const inputContainerStyle = {
  display: 'flex',
  gap: '0.5rem',
  marginBottom: '0.5rem',
};

const questionInputStyle = {
  flex: 1,
  padding: '0.75rem',
  borderRadius: '25px',
  border: '1px solid #ddd',
  fontSize: '1rem',
  outline: 'none',
};

const askButtonStyle = {
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '45px',
  height: '45px',
  cursor: 'pointer',
  fontSize: '1.2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const disabledButtonStyle = {
  backgroundColor: '#bdc3c7',
  cursor: 'not-allowed',
};

const clearButtonStyle = {
  backgroundColor: '#95a5a6',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '0.5rem 1rem',
  fontSize: '0.9rem',
  cursor: 'pointer',
};

export default Chat;