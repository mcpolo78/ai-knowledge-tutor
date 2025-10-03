import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={{
        backgroundColor: '#2c3e50',
        padding: '1rem 2rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <Link to="/" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            🧠 AI Knowledge Tutor
          </Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/" style={linkStyle}>Documents</Link>
            <Link to="/upload" style={linkStyle}>Upload</Link>
            <Link to="/chat" style={linkStyle}>Chat</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid #34495e' }}>
              <span style={{ color: 'white', fontSize: '0.9rem' }}>
                Welcome, {user?.full_name || user?.username}
              </span>
              <button
                onClick={logout}
                style={logoutButtonStyle}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {children}
      </main>
    </div>
  );
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  transition: 'background-color 0.2s'
};

// Logout button styling
const logoutButtonStyle = {
  backgroundColor: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  transition: 'background-color 0.2s'
};

export default Layout;