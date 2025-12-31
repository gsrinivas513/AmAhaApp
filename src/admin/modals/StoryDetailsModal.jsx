import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const StoryDetailsModal = ({ story, isOpen, onClose }) => {
  const { theme } = useContext(ThemeContext);

  if (!isOpen || !story) return null;

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
            📖 Story Details
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
            {story.title}
          </h3>
          <p style={{
            color: theme.textSecondary,
            fontSize: '13px',
            margin: '0',
          }}>
            ID: {story.id}
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
            {story.category || 'Not Set'}
          </span>
          <span style={{
            padding: '6px 12px',
            background: '#f5576c25',
            color: '#f5576c',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
          }}>
            {story.status || 'Draft'}
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
              {story.audience || 'Not Set'}
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
              📚 Chapters
            </p>
            <p style={{
              color: theme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              margin: '0',
            }}>
              {Array.isArray(story.chapters) ? story.chapters.length : typeof story.chapters === 'number' ? story.chapters : 0}
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
              {story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'N/A'}
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
              {story.updatedAt ? new Date(story.updatedAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Description Section */}
        {story.description && (
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
              {story.description}
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
              <strong style={{ color: theme.textPrimary }}>Author:</strong> {story.author || 'Not Set'}
            </div>
            <div>
              <strong style={{ color: theme.textPrimary }}>Genre:</strong> {story.genre || 'Not Set'}
            </div>
            <div>
              <strong style={{ color: theme.textPrimary }}>Language:</strong> {story.language || 'English'}
            </div>
            <div>
              <strong style={{ color: theme.textPrimary }}>Featured:</strong> {story.featured ? 'Yes' : 'No'}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            background: `linear-gradient(135deg, #f093fb, #f5576c)`,
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

export default StoryDetailsModal;
