import React from 'react';

export default function ArtsTab({ theme }) {
  return (
    <div>
      {/* Header & Action Buttons */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: theme.textPrimary, fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>
            🎨 Manage Arts
          </h2>
          <p style={{ color: theme.textSecondary, margin: '0', fontSize: '14px' }}>
            Create and manage drawing, painting, and digital art lessons
          </p>
        </div>

        {/* Organized Action Buttons - Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <button
            onClick={() => window.location.href = '/arts'}
            style={{
              padding: '12px 20px',
              background: `linear-gradient(135deg, #FFB366, #FF85A2)`,
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            🎨 Open Arts Studio
          </button>
        </div>
      </div>

      <div style={{
        background: theme.surfacePrimary,
        border: `2px solid ${theme.border}`,
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
      }}>
        <h3 style={{
          color: theme.textPrimary,
          fontSize: '16px',
          fontWeight: '600',
          margin: '0 0 16px 0',
        }}>
          📚 Arts Features
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
        }}>
          <div style={{
            padding: '16px',
            background: theme.background,
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>✏️</div>
            <p style={{
              color: theme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              margin: '0 0 4px 0',
            }}>
              Drawing Tool
            </p>
            <p style={{
              color: theme.textSecondary,
              fontSize: '12px',
              margin: 0,
            }}>
              Pencil & brush drawing
            </p>
          </div>
          <div style={{
            padding: '16px',
            background: theme.background,
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎨</div>
            <p style={{
              color: theme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              margin: '0 0 4px 0',
            }}>
              Color Palette
            </p>
            <p style={{
              color: theme.textSecondary,
              fontSize: '12px',
              margin: 0,
            }}>
              Full color spectrum
            </p>
          </div>
          <div style={{
            padding: '16px',
            background: theme.background,
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🖼️</div>
            <p style={{
              color: theme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              margin: '0 0 4px 0',
            }}>
              Gallery
            </p>
            <p style={{
              color: theme.textSecondary,
              fontSize: '12px',
              margin: 0,
            }}>
              Browse & share artwork
            </p>
          </div>
        </div>
      </div>

      <div style={{
        background: `${theme.accentPrimary}15`,
        border: `2px solid ${theme.accentPrimary}40`,
        borderRadius: '12px',
        padding: '24px',
      }}>
        <h3 style={{
          color: theme.textPrimary,
          fontSize: '16px',
          fontWeight: '600',
          margin: '0 0 12px 0',
        }}>
          💡 Getting Started with Arts
        </h3>
        <p style={{
          color: theme.textSecondary,
          fontSize: '14px',
          margin: '0 0 12px 0',
        }}>
          Arts management is fully integrated with the application. Use the Arts Studio to:
        </p>
        <ul style={{
          color: theme.textSecondary,
          fontSize: '14px',
          margin: '0',
          paddingLeft: '20px',
        }}>
          <li>✅ Create new drawing and painting lessons</li>
          <li>✅ Manage digital art projects</li>
          <li>✅ Organize by categories and difficulty</li>
          <li>✅ Adds 4 sample arts from visual content</li>
        </ul>
      </div>
    </div>
  );
}
