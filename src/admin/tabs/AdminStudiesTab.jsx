import React from 'react';

export default function StudiesTab({ theme }) {
  return (
    <div>
      {/* Header & Action Buttons */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: theme.textPrimary, fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>
            📚 Manage Studies
          </h2>
          <p style={{ color: theme.textSecondary, margin: '0', fontSize: '14px' }}>
            Create and manage study guides and structured learning materials
          </p>
        </div>

        {/* Organized Action Buttons - Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <button
            style={{
              padding: '12px 20px',
              background: `linear-gradient(135deg, #10B981, #059669)`,
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
            ➕ Add New Study Guide
          </button>
        </div>
      </div>
      <div style={{
        background: theme.surfacePrimary,
        border: `2px solid ${theme.border}`,
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        color: theme.textSecondary,
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
        <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Studies Management Coming Soon</p>
        <p>This section will allow you to manage all study guides including chapters, difficulty levels, and learning paths</p>
      </div>
    </div>
  );
}
