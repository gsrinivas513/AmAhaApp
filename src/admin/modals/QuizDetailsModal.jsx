import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const QuizDetailsModal = ({ quiz, isOpen, onClose }) => {
  const { theme } = useContext(ThemeContext);

  if (!isOpen || !quiz) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.surfacePrimary,
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          border: `2px solid ${theme.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: `2px solid ${theme.border}`,
        }}>
          <h2 style={{
            color: theme.textPrimary,
            fontSize: '20px',
            fontWeight: '700',
            margin: 0,
          }}>
            📚 Quiz Details
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: theme.textSecondary,
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.background = theme.background}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            ✕
          </button>
        </div>

        {/* Title Section */}
        <div style={{
          marginBottom: '24px',
        }}>
          <h3 style={{
            color: theme.textPrimary,
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 8px 0',
          }}>
            {quiz.title}
          </h3>
          <p style={{
            color: theme.textSecondary,
            fontSize: '13px',
            margin: '0',
          }}>
            ID: {quiz.id}
          </p>
        </div>

        {/* Status Section */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}>
          <span style={{
            padding: '6px 12px',
            background: `${theme.accentPrimary}25`,
            color: theme.accentPrimary,
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
          }}>
            {quiz.category}
          </span>
          <span style={{
            padding: '6px 12px',
            background: '#FFE66D25',
            color: '#FFE66D',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
          }}>
            {quiz.status || 'Draft'}
          </span>
          <span style={{
            padding: '6px 12px',
            background: '#667eea25',
            color: '#667eea',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
          }}>
            {quiz.difficulty || 'Not Set'}
          </span>
        </div>

        {/* Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}>
          <div style={{
            background: theme.background,
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
          }}>
            <p style={{
              color: theme.textSecondary,
              fontSize: '11px',
              fontWeight: '600',
              margin: '0 0 4px 0',
              textTransform: 'uppercase',
            }}>
              👥 Audience
            </p>
            <p style={{
              color: theme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              margin: '0',
            }}>
              {quiz.audience || 'Not Set'}
            </p>
          </div>

          <div style={{
            background: theme.background,
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
          }}>
            <p style={{
              color: theme.textSecondary,
              fontSize: '11px',
              fontWeight: '600',
              margin: '0 0 4px 0',
              textTransform: 'uppercase',
            }}>
              📚 Questions
            </p>
            <p style={{
              color: theme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              margin: '0',
            }}>
              {Array.isArray(quiz.questions) ? quiz.questions.length : typeof quiz.questions === 'number' ? quiz.questions : 0}
            </p>
          </div>

          <div style={{
            background: theme.background,
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
          }}>
            <p style={{
              color: theme.textSecondary,
              fontSize: '11px',
              fontWeight: '600',
              margin: '0 0 4px 0',
              textTransform: 'uppercase',
            }}>
              📅 Created
            </p>
            <p style={{
              color: theme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              margin: '0',
            }}>
              {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          <div style={{
            background: theme.background,
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
          }}>
            <p style={{
              color: theme.textSecondary,
              fontSize: '11px',
              fontWeight: '600',
              margin: '0 0 4px 0',
              textTransform: 'uppercase',
            }}>
              ✏️ Modified
            </p>
            <p style={{
              color: theme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              margin: '0',
            }}>
              {quiz.updatedAt ? new Date(quiz.updatedAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Description Section */}
        {quiz.description && (
          <div style={{
            background: theme.background,
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
            marginBottom: '24px',
          }}>
            <p style={{
              color: theme.textSecondary,
              fontSize: '11px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
            }}>
              📝 Description
            </p>
            <p style={{
              color: theme.textPrimary,
              fontSize: '13px',
              margin: '0',
              lineHeight: '1.5',
            }}>
              {quiz.description}
            </p>
          </div>
        )}

        {/* Additional Info */}
        <div style={{
          background: theme.background,
          padding: '12px',
          borderRadius: '8px',
          border: `1px solid ${theme.border}`,
          marginBottom: '24px',
        }}>
          <p style={{
            color: theme.textSecondary,
            fontSize: '11px',
            fontWeight: '600',
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
          }}>
            ℹ️ Additional Info
          </p>
          <div style={{
            display: 'grid',
            gap: '6px',
            fontSize: '12px',
            color: theme.textSecondary,
          }}>
            <div>
              <strong style={{ color: theme.textPrimary }}>Pass Score:</strong> {quiz.passScore || 'Not Set'}%
            </div>
            <div>
              <strong style={{ color: theme.textPrimary }}>Time Limit:</strong> {quiz.timeLimit || 'Unlimited'}
            </div>
            <div>
              <strong style={{ color: theme.textPrimary }}>Shuffle Questions:</strong> {quiz.shuffleQuestions ? 'Yes' : 'No'}
            </div>
            <div>
              <strong style={{ color: theme.textPrimary }}>Show Results:</strong> {quiz.showResults ? 'Yes' : 'No'}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary || theme.accentPrimary})`,
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.9'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default QuizDetailsModal;
