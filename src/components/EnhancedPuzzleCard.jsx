/**
 * EnhancedPuzzleCard.jsx
 * Premium card component matching PuzzleFree.game style
 * Features: Images, metadata, color-coded difficulties, tags, animations
 */

import React, { useState } from 'react';

const DIFFICULTY_COLORS = {
  easy: { bg: '#e0f2fe', text: '#0369a1', border: '#0284c7', label: 'Easy' },
  medium: { bg: '#fef08a', text: '#b45309', border: '#d97706', label: 'Medium' },
  hard: { bg: '#fecaca', text: '#991b1b', border: '#dc2626', label: 'Hard' },
  beginner: { bg: '#d1fae5', text: '#065f46', border: '#059669', label: 'Beginner' },
  expert: { bg: '#e9d5ff', text: '#6b21a8', border: '#a855f7', label: 'Expert' }
};

export const EnhancedPuzzleCard = ({
  id,
  title,
  description,
  image,
  difficulty = 'medium',
  tags = [],
  rating = 4.5,
  playsCount = 0,
  completionCount = 0,
  onClick,
  theme = {}
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const diffColor = DIFFICULTY_COLORS[difficulty?.toLowerCase()] || DIFFICULTY_COLORS.medium;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        background: 'white',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0,0,0,0.15)' 
          : '0 4px 12px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Image Container */}
      <div
        style={{
          width: '100%',
          height: '200px',
          background: image
            ? `url(${image}) center/cover`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Rating Badge */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(255,255,255,0.95)',
            padding: '6px 12px',
            borderRadius: 20,
            fontSize: '0.85rem',
            fontWeight: 700,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          ⭐ {rating}
        </div>

        {/* Difficulty Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            background: diffColor.bg,
            color: diffColor.text,
            padding: '6px 12px',
            borderRadius: 8,
            fontSize: '0.8rem',
            fontWeight: 700,
            border: `2px solid ${diffColor.border}`
          }}
        >
          {diffColor.label}
        </div>

        {/* Hover Overlay */}
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(2px)',
              transition: 'all 0.3s ease'
            }}
          />
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            margin: '0 0 8px 0',
            color: '#1f2937',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: '0.85rem',
            color: '#6b7280',
            margin: '0 0 12px 0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4
          }}
        >
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 6,
              marginBottom: 12,
              flexWrap: 'wrap'
            }}
          >
            {tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  background: '#f0f9ff',
                  color: '#0369a1',
                  padding: '4px 10px',
                  borderRadius: 12,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: '1px solid #bae6fd'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: '#9ca3af',
            marginBottom: 12,
            paddingBottom: 12,
            borderBottom: '1px solid #f3f4f6'
          }}
        >
          <span>▶️ {playsCount} started</span>
          <span>✓ {completionCount} completed</span>
        </div>

        {/* CTA Button */}
        <button
          style={{
            width: '100%',
            padding: '10px 16px',
            background: `linear-gradient(135deg, ${diffColor.border} 0%, ${diffColor.text} 100%)`,
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          Start Puzzle →
        </button>
      </div>
    </div>
  );
};

/**
 * Breadcrumb Navigation Component
 */
export const Breadcrumb = ({ items = [] }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 0',
        fontSize: '0.9rem',
        color: '#6b7280',
        marginBottom: 24
      }}
    >
      {items.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {idx > 0 && <span style={{ color: '#d1d5db' }}>›</span>}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
            >
              {item.label}
            </button>
          ) : (
            <span style={{ color: '#1f2937', fontWeight: 600 }}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Category Sidebar Component
 */
export const CategorySidebar = ({ categories, selectedCategory, onSelect }) => {
  return (
    <div
      style={{
        width: '250px',
        background: '#f9fafb',
        borderRadius: 12,
        padding: 16,
        height: 'fit-content',
        position: 'sticky',
        top: 20,
        border: '1px solid #e5e7eb'
      }}
    >
      <h3
        style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          marginBottom: 16,
          color: '#1f2937'
        }}
      >
        🏷️ Categories
      </h3>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat)}
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              background:
                selectedCategory?.id === cat.id
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'white',
              color: selectedCategory?.id === cat.id ? 'white' : '#6b7280',
              border: selectedCategory?.id === cat.id
                ? 'none'
                : '1px solid #e5e7eb'
            }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EnhancedPuzzleCard;
