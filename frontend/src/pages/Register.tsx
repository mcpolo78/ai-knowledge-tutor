import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const success = await register(
      formData.username,
      formData.email,
      formData.password,
      formData.fullName || undefined
    );

    if (success) {
      navigate('/');
    } else {
      setError('Registration failed. Username or email may already exist.');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h1 style={titleStyle}>🧠 AI Knowledge Tutor</h1>
        <h2 style={subtitleStyle}>Create Account</h2>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Choose a username"
              disabled={loading}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your full name (optional)"
              disabled={loading}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Create a password"
              disabled={loading}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Confirm your password"
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={linkContainerStyle}>
          <p>Already have an account?</p>
          <Link to="/login" style={linkStyle}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

// Styles (similar to Login but reused here)
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
  backgroundColor: '#27ae60',
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

export default Register;