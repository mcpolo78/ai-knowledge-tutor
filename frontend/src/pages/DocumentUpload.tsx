import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentAPI } from '../services/api';

const DocumentUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = (selectedFile: File) => {
    const allowedTypes = ['.pdf', '.docx', '.doc', '.md', '.markdown'];
    const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));

    if (!allowedTypes.includes(fileExtension)) {
      alert('Please select a PDF, DOCX, or Markdown file.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const response = await documentAPI.uploadDocument(file);
      console.log('Upload successful:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h1>Upload Document</h1>
      <p style={descriptionStyle}>
        Upload PDF, DOCX, or Markdown files to transform them into learning materials.
      </p>

      <div
        style={{
          ...dropZoneStyle,
          ...(dragOver ? dropZoneActiveStyle : {}),
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input
          id="fileInput"
          type="file"
          accept=".pdf,.docx,.doc,.md,.markdown"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          style={{ display: 'none' }}
        />

        {file ? (
          <div style={fileSelectedStyle}>
            <div style={fileIconStyle}>📄</div>
            <div>
              <p style={fileNameStyle}>{file.name}</p>
              <p style={fileSizeStyle}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <div style={uploadPromptStyle}>
            <div style={uploadIconStyle}>⬆️</div>
            <p style={uploadTextStyle}>
              Drop your document here or click to browse
            </p>
            <p style={supportedFormatsStyle}>
              Supported formats: PDF, DOCX, Markdown
            </p>
          </div>
        )}
      </div>

      {file && (
        <div style={actionsStyle}>
          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{
              ...uploadButtonStyle,
              ...(uploading ? disabledButtonStyle : {}),
            }}
          >
            {uploading ? 'Uploading...' : 'Upload & Process'}
          </button>
          <button
            onClick={() => setFile(null)}
            style={cancelButtonStyle}
            disabled={uploading}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '2rem',
};

const descriptionStyle = {
  color: '#666',
  fontSize: '1.1rem',
  marginBottom: '2rem',
};

const dropZoneStyle = {
  border: '2px dashed #ddd',
  borderRadius: '8px',
  padding: '3rem 2rem',
  textAlign: 'center' as const,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: '#fafafa',
};

const dropZoneActiveStyle = {
  borderColor: '#3498db',
  backgroundColor: '#f0f8ff',
};

const fileSelectedStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
};

const fileIconStyle = {
  fontSize: '3rem',
};

const fileNameStyle = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  margin: '0 0 0.5rem 0',
};

const fileSizeStyle = {
  color: '#666',
  margin: 0,
};

const uploadPromptStyle = {
  color: '#666',
};

const uploadIconStyle = {
  fontSize: '3rem',
  marginBottom: '1rem',
};

const uploadTextStyle = {
  fontSize: '1.2rem',
  margin: '0 0 0.5rem 0',
};

const supportedFormatsStyle = {
  fontSize: '0.9rem',
  color: '#888',
  margin: 0,
};

const actionsStyle = {
  display: 'flex',
  gap: '1rem',
  marginTop: '2rem',
  justifyContent: 'center',
};

const uploadButtonStyle = {
  backgroundColor: '#27ae60',
  color: 'white',
  padding: '0.75rem 2rem',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const disabledButtonStyle = {
  backgroundColor: '#bdc3c7',
  cursor: 'not-allowed',
};

const cancelButtonStyle = {
  backgroundColor: '#95a5a6',
  color: 'white',
  padding: '0.75rem 2rem',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
};

export default DocumentUpload;