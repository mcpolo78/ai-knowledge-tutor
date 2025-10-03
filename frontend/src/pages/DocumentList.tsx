import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { documentAPI, Document } from '../services/api';

const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await documentAPI.getDocuments();
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentAPI.deleteDocument(id);
        fetchDocuments(); // Refresh the list
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  if (loading) {
    return <div style={loadingStyle}>Loading documents...</div>;
  }

  return (
    <div>
      <div style={headerStyle}>
        <h1>Your Documents</h1>
        <Link to="/upload" style={buttonStyle}>
          📁 Upload New Document
        </Link>
      </div>

      {documents.length === 0 ? (
        <div style={emptyStyle}>
          <h3>No documents yet</h3>
          <p>Upload your first document to get started!</p>
          <Link to="/upload" style={buttonStyle}>
            Upload Document
          </Link>
        </div>
      ) : (
        <div style={gridStyle}>
          {documents.map((doc) => (
            <div key={doc.id} style={cardStyle}>
              <h3 style={titleStyle}>{doc.title}</h3>
              <p style={metaStyle}>
                📄 {doc.document_type.toUpperCase()} • {doc.content_length} characters
              </p>
              <p style={dateStyle}>
                Uploaded: {new Date(doc.created_at).toLocaleDateString()}
              </p>
              <div style={actionsStyle}>
                <Link to={`/document/${doc.id}`} style={linkButtonStyle}>
                  View
                </Link>
                <Link to={`/quiz/${doc.id}`} style={linkButtonStyle}>
                  Quiz
                </Link>
                <Link to={`/flashcards/${doc.id}`} style={linkButtonStyle}>
                  Flashcards
                </Link>
                <button
                  onClick={() => handleDelete(doc.id)}
                  style={deleteButtonStyle}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
};

const loadingStyle = {
  textAlign: 'center' as const,
  padding: '2rem',
  fontSize: '1.2rem',
};

const emptyStyle = {
  textAlign: 'center' as const,
  padding: '4rem 2rem',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '1.5rem',
};

const cardStyle = {
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  border: '1px solid #e0e0e0',
};

const titleStyle = {
  margin: '0 0 0.5rem 0',
  color: '#2c3e50',
  fontSize: '1.2rem',
};

const metaStyle = {
  color: '#666',
  margin: '0.5rem 0',
  fontSize: '0.9rem',
};

const dateStyle = {
  color: '#888',
  fontSize: '0.8rem',
  margin: '0.5rem 0 1rem 0',
};

const actionsStyle = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap' as const,
};

const buttonStyle = {
  backgroundColor: '#3498db',
  color: 'white',
  padding: '0.75rem 1.5rem',
  textDecoration: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  border: 'none',
  cursor: 'pointer',
};

const linkButtonStyle = {
  backgroundColor: '#27ae60',
  color: 'white',
  padding: '0.5rem 1rem',
  textDecoration: 'none',
  borderRadius: '4px',
  fontSize: '0.9rem',
};

const deleteButtonStyle = {
  backgroundColor: '#e74c3c',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '4px',
  fontSize: '0.9rem',
  cursor: 'pointer',
};

export default DocumentList;