import React, { useState, useEffect } from 'react';
import { getAllQuizTypes } from '../../services/quizTypeService';

/**
 * TypeSelectorModal - Improved type picker with descriptions and metadata
 * Used when creating new quizzes
 */
export const TypeSelectorModal = ({
  isOpen,
  onSelect,
  onCancel,
  theme,
  excludeTypes = [],
}) => {
  const [types, setTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('basic');
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadTypes();
    }
  }, [isOpen]);

  const loadTypes = async () => {
    try {
      setLoading(true);
      const data = await getAllQuizTypes(true);
      const filtered = data.filter((t) => !excludeTypes.includes(t.id));
      setTypes(filtered || []);
      setSelectedType(null);
    } catch (error) {
      console.error('Failed to load types:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const categories = ['basic', 'intermediate', 'advanced'];
  const categorizedTypes = types.filter((t) => t.category === selectedCategory);

  const handleSelect = () => {
    if (selectedType) {
      onSelect(selectedType);
    }
  };

  const complexityColors = {
    simple: '#4CAF50',
    medium: '#FF9800',
    complex: '#F44336',
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: theme?.surfacePrimary || '#fff',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '700px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              color: theme?.textPrimary || '#333',
              fontSize: '18px',
              fontWeight: '700',
              margin: 0,
            }}
          >
            Select Quiz Type
          </h2>
          <button
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: theme?.textSecondary || '#666',
            }}
          >
            ✕
          </button>
        </div>

        {/* Category Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            borderBottom: `1px solid ${theme?.border || '#e0e0e0'}`,
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                borderBottom:
                  selectedCategory === cat ? `3px solid ${theme?.accentPrimary || '#007AFF'}` : 'none',
                color:
                  selectedCategory === cat
                    ? theme?.textPrimary || '#333'
                    : theme?.textSecondary || '#999',
                fontSize: '14px',
                fontWeight: selectedCategory === cat ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                if (selectedCategory !== cat) {
                  e.target.style.color = theme?.textPrimary || '#333';
                }
              }}
              onMouseOut={(e) => {
                if (selectedCategory !== cat) {
                  e.target.style.color = theme?.textSecondary || '#999';
                }
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)} ({types.filter((t) => t.category === cat).length})
            </button>
          ))}
        </div>

        {/* Types List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            marginBottom: '20px',
            display: 'grid',
            gap: '12px',
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: theme?.textSecondary || '#666' }}>
              Loading types...
            </div>
          ) : categorizedTypes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: theme?.textSecondary || '#666' }}>
              No types available in this category.
            </div>
          ) : (
            categorizedTypes.map((type) => (
              <div
                key={type.docId}
                onClick={() => setSelectedType(type)}
                style={{
                  padding: '16px',
                  border: `2px solid ${
                    selectedType?.docId === type.docId
                      ? theme?.accentPrimary || '#007AFF'
                      : theme?.border || '#e0e0e0'
                  }`,
                  borderRadius: '8px',
                  background:
                    selectedType?.docId === type.docId
                      ? `${theme?.accentPrimary || '#007AFF'}10`
                      : theme?.surfaceSecondary || '#f9f9f9',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = theme?.accentPrimary || '#007AFF';
                  e.currentTarget.style.background = `${theme?.accentPrimary || '#007AFF'}10`;
                }}
                onMouseOut={(e) => {
                  if (selectedType?.docId !== type.docId) {
                    e.currentTarget.style.borderColor = theme?.border || '#e0e0e0';
                    e.currentTarget.style.background = theme?.surfaceSecondary || '#f9f9f9';
                  }
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '8px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: theme?.textPrimary || '#333',
                        marginBottom: '4px',
                      }}
                    >
                      {type.label}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: theme?.textSecondary || '#666',
                      }}
                    >
                      {type.description}
                    </div>
                  </div>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '6px',
                      background: type.metadata?.color || '#007AFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      flexShrink: 0,
                    }}
                  >
                    {type.metadata?.icon || '?'}
                  </div>
                </div>

                {/* Metadata */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    fontSize: '11px',
                  }}
                >
                  <div>
                    <span style={{ color: theme?.textSecondary || '#999', fontWeight: '600' }}>
                      Complexity:
                    </span>
                    <div
                      style={{
                        color: complexityColors[type.complexity] || '#666',
                        fontWeight: '600',
                        marginTop: '2px',
                      }}
                    >
                      {type.complexity}
                    </div>
                  </div>

                  <div>
                    <span style={{ color: theme?.textSecondary || '#999', fontWeight: '600' }}>
                      Points:
                    </span>
                    <div
                      style={{
                        color: '#007AFF',
                        fontWeight: '700',
                        marginTop: '2px',
                        fontSize: '14px',
                      }}
                    >
                      {type.defaultPoints}
                    </div>
                  </div>

                  <div>
                    <span style={{ color: theme?.textSecondary || '#999', fontWeight: '600' }}>
                      Input:
                    </span>
                    <div
                      style={{
                        color: theme?.textPrimary || '#333',
                        fontWeight: '500',
                        marginTop: '2px',
                      }}
                    >
                      {type.inputType}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            borderTop: `1px solid ${theme?.border || '#e0e0e0'}`,
            paddingTop: '20px',
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              background: theme?.surfaceSecondary || '#f9f9f9',
              color: theme?.textPrimary || '#333',
              border: `1px solid ${theme?.border || '#ddd'}`,
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            disabled={!selectedType}
            style={{
              padding: '10px 24px',
              background: selectedType ? (theme?.accentPrimary || '#007AFF') : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: selectedType ? 'pointer' : 'not-allowed',
            }}
          >
            Select Type
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypeSelectorModal;
