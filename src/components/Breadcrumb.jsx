// Breadcrumb Navigation Component
import React from 'react';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '12px 20px',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        fontSize: '0.9rem',
        background: 'white',
        borderBottom: '1px solid #e5e7eb'
      }}
      aria-label="Breadcrumb"
    >
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && (
            <span
              style={{
                color: '#d1d5db',
                margin: '0 4px'
              }}
            >
              /
            </span>
          )}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              style={{
                background: 'none',
                border: 'none',
                color: '#0369a1',
                cursor: 'pointer',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0284c7')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#0369a1')}
            >
              {item.label}
            </button>
          ) : (
            <span style={{ color: '#6b7280', fontWeight: 500 }}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
