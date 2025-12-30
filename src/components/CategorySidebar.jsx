// Sticky Category Sidebar for filtering and navigation
import React, { useState, useEffect } from 'react';

export default function CategorySidebar({
  categories = [],
  selectedCategory = null,
  onCategorySelect = () => {},
  isSticky = true
}) {
  const [isOpen, onOpenChange] = useState(false);

  // Close sidebar on mobile when selecting
  const handleSelect = (category) => {
    onCategorySelect(category);
    onOpenChange(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => onOpenChange(!isOpen)}
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 40,
          padding: '12px 16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          fontSize: '1rem'
        }}
        className="lg:hidden"
      >
        {isOpen ? '✕' : '≡'} Categories
      </button>

      {/* Sidebar */}
      <aside
        style={{
          position: isSticky ? 'sticky' : 'relative',
          top: isSticky ? 20 : 0,
          width: '100%',
          maxWidth: 280,
          maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto',
          background: 'white',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 16,
            borderBottom: '1px solid #e5e7eb',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '12px 12px 0 0'
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '1.1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            📚 Categories
          </h3>
        </div>

        {/* Categories List */}
        <nav style={{ flex: 1, padding: 0 }}>
          {categories.length === 0 ? (
            <div
              style={{
                padding: 16,
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '0.9rem'
              }}
            >
              No categories available
            </div>
          ) : (
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleSelect(category)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: selectedCategory?.id === category.id ? '#f0f9ff' : 'transparent',
                  borderLeft: selectedCategory?.id === category.id ? '4px solid #0284c7' : '4px solid transparent',
                  color: selectedCategory?.id === category.id ? '#0369a1' : '#6b7280',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.95rem',
                  fontWeight: selectedCategory?.id === category.id ? 600 : 500,
                  borderBottom: '1px solid #f3f4f6'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory?.id !== category.id) {
                    e.currentTarget.style.background = '#f9fafb';
                    e.currentTarget.style.color = '#374151';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory?.id !== category.id) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.2rem' }}>
                    {category.icon || '🧩'}
                  </span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontWeight: 600 }}>
                      {category.label || category.name}
                    </div>
                    {category.puzzleCount !== undefined && (
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: selectedCategory?.id === category.id ? '#0284c7' : '#9ca3af',
                          marginTop: 2
                        }}
                      >
                        {category.puzzleCount} puzzles
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </nav>

        {/* Footer Stats (Optional) */}
        <div
          style={{
            padding: 12,
            borderTop: '1px solid #e5e7eb',
            background: '#f9fafb',
            fontSize: '0.75rem',
            color: '#6b7280',
            textAlign: 'center',
            borderRadius: '0 0 12px 12px'
          }}
        >
          <div style={{ marginBottom: 6 }}>
            <strong>{categories.length}</strong> Total Categories
          </div>
          <div>
            <strong>{categories.reduce((sum, cat) => sum + (cat.puzzleCount || 0), 0)}</strong> Puzzles
          </div>
        </div>
      </aside>
    </>
  );
}
