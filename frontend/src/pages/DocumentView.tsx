import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { documentAPI, learningMaterialAPI } from '../services/api';

const DocumentView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDocument();
      fetchSummary();
    }
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await documentAPI.getDocument(Number(id));
      setDocument(response.data);
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await learningMaterialAPI.getSummary(Number(id));
      setSummary(response.data);
    } catch (error) {
      // Summary doesn't exist yet
      console.log('No summary available yet');
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    setGenerating(true);
    try {
      const response = await learningMaterialAPI.generateSummary(Number(id));
      setSummary(response.data);
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div style={loadingStyle}>Loading document...</div>;
  }

  if (!document) {
    return <div style={errorStyle}>Document not found</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>{document.title}</h1>
        <div style={actionsStyle}>
          <Link to={`/quiz/${id}`} style={actionButtonStyle}>
            📝 Take Quiz
          </Link>
          <Link to={`/flashcards/${id}`} style={actionButtonStyle}>
            🃏 Study Flashcards
          </Link>
        </div>
      </div>

      <div style={metaStyle}>
        <span>📄 {document.document_type.toUpperCase()}</span>
        <span>📅 {new Date(document.created_at).toLocaleDateString()}</span>
        <span>📊 {document.content.length} characters</span>
      </div>

      <div style={summarySectionStyle}>
        <h2>Summary</h2>
        {summary ? (
          <div style={summaryStyle}>
            <p>{summary.content}</p>
            <small style={summaryDateStyle}>
              Generated: {new Date(summary.created_at).toLocaleDateString()}
            </small>
          </div>
        ) : (
          <div style={noSummaryStyle}>
            <p>No summary available yet.</p>
            <button
              onClick={generateSummary}
              disabled={generating}
              style={{
                ...generateButtonStyle,
                ...(generating ? disabledButtonStyle : {}),
              }}
            >
              {generating ? 'Generating...' : '✨ Generate Summary'}
            </button>
          </div>
        )}
      </div>

      <div style={contentSectionStyle}>
        <h2>Original Content</h2>
        <div style={contentStyle}>
          <pre style={preStyle}>{document.content}</pre>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '1rem',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '1rem',
  flexWrap: 'wrap' as const,
  gap: '1rem',
};

const actionsStyle = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap' as const,
};

const actionButtonStyle = {
  backgroundColor: '#3498db',
  color: 'white',
  padding: '0.5rem 1rem',
  textDecoration: 'none',
  borderRadius: '4px',
  fontSize: '0.9rem',
};

const metaStyle = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '2rem',
  color: '#666',
  fontSize: '0.9rem',
  flexWrap: 'wrap' as const,
};

const summarySectionStyle = {
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: '2rem',
};

const summaryStyle = {
  lineHeight: '1.6',
};

const summaryDateStyle = {
  color: '#888',
  fontSize: '0.8rem',
};

const noSummaryStyle = {
  textAlign: 'center' as const,
  padding: '2rem',
  color: '#666',
};

const generateButtonStyle = {
  backgroundColor: '#27ae60',
  color: 'white',
  padding: '0.75rem 1.5rem',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
};

const disabledButtonStyle = {
  backgroundColor: '#bdc3c7',
  cursor: 'not-allowed',
};

const contentSectionStyle = {
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const contentStyle = {
  maxHeight: '400px',
  overflow: 'auto',
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
  padding: '1rem',
  backgroundColor: '#f9f9f9',
};

const preStyle = {
  whiteSpace: 'pre-wrap' as const,
  fontFamily: 'inherit',
  fontSize: '0.9rem',
  lineHeight: '1.5',
  margin: 0,
};

const loadingStyle = {
  textAlign: 'center' as const,
  padding: '2rem',
  fontSize: '1.2rem',
};

const errorStyle = {
  textAlign: 'center' as const,
  padding: '2rem',
  fontSize: '1.2rem',
  color: '#e74c3c',
};

export default DocumentView;