import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    const success = await login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h1 style={titleStyle}>🧠 AI Knowledge Tutor</h1>
        <h2 style={subtitleStyle}>Sign In</h2>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              placeholder="Enter your username"
              disabled={loading}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              ...submitButtonStyle,
              ...(loading ? disabledButtonStyle : {})
            }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={linkContainerStyle}>
          <p>Don't have an account?</p>
          <Link to="/register" style={linkStyle}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f5f5f5',
  padding: '1rem',
};

const formCardStyle = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '400px',
};

const titleStyle = {
  textAlign: 'center' as const,
  color: '#2c3e50',
  marginBottom: '0.5rem',
  fontSize: '2rem',
};

const subtitleStyle = {
  textAlign: 'center' as const,
  color: '#34495e',
  marginBottom: '2rem',
  fontSize: '1.5rem',
  fontWeight: 'normal',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '1rem',
};

const fieldGroupStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.5rem',
};

const labelStyle = {
  fontWeight: 'bold',
  color: '#2c3e50',
  fontSize: '0.9rem',
};

const inputStyle = {
  padding: '0.75rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const errorStyle = {
  backgroundColor: '#f8d7da',
  color: '#721c24',
  padding: '0.75rem',
  borderRadius: '4px',
  fontSize: '0.9rem',
  textAlign: 'center' as const,
};

const submitButtonStyle = {
  backgroundColor: '#3498db',
  color: 'white',
  padding: '0.75rem',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: '1rem',
  transition: 'background-color 0.2s',
};

const disabledButtonStyle = {
  backgroundColor: '#bdc3c7',
  cursor: 'not-allowed',
};

const linkContainerStyle = {
  textAlign: 'center' as const,
  marginTop: '2rem',
  color: '#7f8c8d',
};

const linkStyle = {
  color: '#3498db',
  textDecoration: 'none',
  fontWeight: 'bold',
  marginLeft: '0.5rem',
};

export default Login;