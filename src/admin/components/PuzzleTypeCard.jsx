import React from 'react';

/**
 * PuzzleTypeCard - Display individual puzzle type information
 * Separate from QuizTypeCard for better code organization and puzzle-specific features
 */
export const PuzzleTypeCard = ({
  type,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  isSystem = false,
  theme,
}) => {
  const categoryColors = {
    'quiz-registry': '#E3F2FD',
    'game-puzzle': '#F3E5F5',
  };

  const categoryLabels = {
    'quiz-registry': 'Quiz Registry',
    'game-puzzle': 'Game Puzzle',
  };

  const complexityIcons = {
    simple: '●',
    medium: '●●',
    complex: '●●●',
  };

  // Get display label for category
  const getCategoryLabel = (cat) => {
    return categoryLabels[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1));
  };

  return (
    <div
      style={{
        padding: '16px',
        border: `1px solid ${theme?.border || '#e0e0e0'}`,
        borderRadius: '8px',
        background: theme?.surfacePrimary || '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.2s ease',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Header with Icon and Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            background: type.metadata?.color || '#007AFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          {type.metadata?.icon || '?'}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: '700',
              color: theme?.textPrimary || '#333',
              marginBottom: '4px',
            }}
          >
            {type.label}
            {isSystem && (
              <span
                style={{
                  marginLeft: '8px',
                  padding: '2px 8px',
                  background: '#E8F5E9',
                  color: '#2E7D32',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600',
                }}
              >
                System
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: theme?.textSecondary || '#666',
              lineHeight: '1.4',
            }}
          >
            {type.description}
          </div>
        </div>
        <div
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            background: type.isActive ? '#E8F5E9' : '#FFEBEE',
            color: type.isActive ? '#2E7D32' : '#C62828',
            fontSize: '11px',
            fontWeight: '600',
          }}
        >
          {type.isActive ? '✓ Active' : '✗ Inactive'}
        </div>
      </div>

      {/* Metadata Row - Puzzle specific */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '12px',
          padding: '12px 0',
          borderTop: `1px solid ${theme?.border || '#f0f0f0'}`,
          borderBottom: `1px solid ${theme?.border || '#f0f0f0'}`,
        }}
      >
        {/* Category (Quiz Registry vs Game Puzzle) */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: theme?.textSecondary || '#999',
              marginBottom: '4px',
              textTransform: 'uppercase',
            }}
          >
            Category
          </div>
          <div
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              background: categoryColors[type.category] || '#f5f5f5',
              color: theme?.textPrimary || '#333',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            {getCategoryLabel(type.category)}
          </div>
        </div>

        {/* Complexity */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: theme?.textSecondary || '#999',
              marginBottom: '4px',
              textTransform: 'uppercase',
            }}
          >
            Complexity
          </div>
          <div
            style={{
              fontSize: '14px',
              color: theme?.textPrimary || '#333',
              letterSpacing: '2px',
            }}
          >
            {complexityIcons[type.complexity] || '●'}
          </div>
        </div>

        {/* Points */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: theme?.textSecondary || '#999',
              marginBottom: '4px',
              textTransform: 'uppercase',
            }}
          >
            Default Pts
          </div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#007AFF',
            }}
          >
            {type.defaultPoints}
          </div>
        </div>

        {/* Usage Count */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: theme?.textSecondary || '#999',
              marginBottom: '4px',
              textTransform: 'uppercase',
            }}
          >
            Uses
          </div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#666',
            }}
          >
            {type.metadata?.usageCount || 0}
          </div>
        </div>
      </div>

      {/* Input Type Badge - Puzzle-specific */}
      <div
        style={{
          marginBottom: '12px',
          fontSize: '11px',
          fontWeight: '600',
          color: theme?.textSecondary || '#666',
        }}
      >
        <span style={{ marginRight: '8px' }}>Interaction:</span>
        <span
          style={{
            padding: '3px 8px',
            background: `${theme?.accentPrimary || '#007AFF'}15`,
            borderRadius: '3px',
            color: theme?.accentPrimary || '#007AFF',
          }}
        >
          {type.inputType || 'N/A'}
        </span>
      </div>

      {/* Evaluation Type */}
      <div
        style={{
          marginBottom: '12px',
          fontSize: '11px',
          fontWeight: '600',
          color: theme?.textSecondary || '#666',
        }}
      >
        <span style={{ marginRight: '8px' }}>Evaluation:</span>
        <span
          style={{
            padding: '3px 8px',
            background: '#E8F5E915',
            borderRadius: '3px',
            color: '#2E7D32',
          }}
        >
          {type.evaluationType || 'N/A'}
        </span>
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'flex-end',
        }}
      >
        <button
          onClick={() => onEdit(type)}
          style={{
            padding: '6px 12px',
            background: `${theme?.accentPrimary || '#007AFF'}20`,
            color: theme?.accentPrimary || '#007AFF',
            border: `1px solid ${theme?.accentPrimary || '#007AFF'}`,
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.target.style.background = theme?.accentPrimary || '#007AFF';
            e.target.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            e.target.style.background = `${theme?.accentPrimary || '#007AFF'}20`;
            e.target.style.color = theme?.accentPrimary || '#007AFF';
          }}
        >
          Edit
        </button>

        {!isSystem && (
          <button
            onClick={() => onDelete(type)}
            style={{
              padding: '6px 12px',
              background: '#FFEBEE',
              color: '#C62828',
              border: '1px solid #EF5350',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#EF5350';
              e.target.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#FFEBEE';
              e.target.style.color = '#C62828';
            }}
          >
            Delete
          </button>
        )}

        {type.isActive ? (
          <button
            onClick={() => onDeactivate(type)}
            style={{
              padding: '6px 12px',
              background: '#FFF3E0',
              color: '#E65100',
              border: '1px solid #FF9800',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#FF9800';
              e.target.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#FFF3E0';
              e.target.style.color = '#E65100';
            }}
          >
            Disable
          </button>
        ) : (
          <button
            onClick={() => onActivate(type)}
            style={{
              padding: '6px 12px',
              background: '#E8F5E9',
              color: '#2E7D32',
              border: '1px solid #4CAF50',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#4CAF50';
              e.target.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#E8F5E9';
              e.target.style.color = '#2E7D32';
            }}
          >
            Enable
          </button>
        )}
      </div>
    </div>
  );
};

export default PuzzleTypeCard;
