import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const ArtsHome = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const modes = [
    {
      id: 'draw',
      icon: '✏️',
      title: 'Draw',
      description: 'Create with pencil & brush',
      color: '#FF85A2',
      path: '/arts/draw',
    },
    {
      id: 'paint',
      icon: '🎨',
      title: 'Paint',
      description: 'Paint with colors',
      color: '#FFB366',
      path: '/arts/paint',
    },
    {
      id: 'guided',
      icon: '📚',
      title: 'Learn to Draw',
      description: 'Step-by-step lessons',
      color: '#A78BFA',
      path: '/arts/guided',
    },
    {
      id: 'gallery',
      icon: '🖼️',
      title: 'My Gallery',
      description: 'View your artwork',
      color: '#81C995',
      path: '/arts/gallery',
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.background,
      padding: '20px',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
      }}>
        <h1 style={{
          color: theme.textPrimary,
          fontSize: '32px',
          fontWeight: '700',
          margin: '20px 0 8px 0',
        }}>
          🎨 Arts Studio
        </h1>
        <p style={{
          color: theme.textSecondary,
          fontSize: '16px',
          margin: '0',
        }}>
          Create, Learn & Explore
        </p>
      </div>

      {/* Mode Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {modes.map(mode => (
          <button
            key={mode.id}
            onClick={() => navigate(mode.path)}
            style={{
              padding: '30px 20px',
              background: theme.surfacePrimary,
              border: `3px solid ${mode.color}`,
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              ':hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              },
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
            }}>
              {mode.icon}
            </div>
            <h3 style={{
              color: theme.textPrimary,
              fontSize: '22px',
              fontWeight: '700',
              margin: '0 0 8px 0',
            }}>
              {mode.title}
            </h3>
            <p style={{
              color: theme.textSecondary,
              fontSize: '13px',
              margin: '0',
            }}>
              {mode.description}
            </p>
          </button>
        ))}
      </div>

      {/* Back Button */}
      <div style={{
        marginTop: '40px',
        textAlign: 'center',
      }}>
        <button
          onClick={() => navigate('/admin/modern-dashboard')}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: `2px solid ${theme.border}`,
            borderRadius: '8px',
            color: theme.textPrimary,
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ArtsHome;
