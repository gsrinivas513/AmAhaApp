// Enhanced Topic Card with better visuals, metadata, and difficulty badges
import React from 'react';

const DIFFICULTY_COLORS = {
  easy: { bg: '#dbeafe', text: '#0284c7', border: '#0284c7', label: 'Easy' },
  medium: { bg: '#fed7aa', text: '#d97706', border: '#d97706', label: 'Medium' },
  hard: { bg: '#fecaca', text: '#dc2626', border: '#dc2626', label: 'Hard' },
  beginner: { bg: '#d1fae5', text: '#059669', border: '#059669', label: 'Beginner' },
  expert: { bg: '#e9d5ff', text: '#a855f7', border: '#a855f7', label: 'Expert' }
};

export default function EnhancedTopicCard({
  item,
  categoryName,
  navigate,
  getNavigationPath,
  itemIndex = 0
}) {
  const difficulty = item.difficulty || 'medium';
  const difficultyColor = DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS.medium;
  const tags = item.tags || [];
  const playsCount = item.puzzleCount || 0;
  const completedCount = item.completedCount || Math.floor(playsCount * 0.65);

  return (
    <div
      onClick={() => navigate(getNavigationPath(item))}
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      }}
    >
      {/* Image Container */}
      <div
        style={{
          width: '100%',
          height: '160px',
          background: item.image || `linear-gradient(135deg, ${['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'][itemIndex % 5]} 0%, ${['#764ba2', '#667eea', '#a78bfa', '#0da5c0', '#43e97b'][itemIndex % 5]} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {item.icon || '🧩'}

        {/* Rating Badge - Top Right */}
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
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          ⭐ {item.rating || 4.5}
        </div>

        {/* Difficulty Badge - Top Left */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: difficultyColor.bg,
            color: difficultyColor.text,
            padding: '6px 12px',
            borderRadius: 20,
            fontSize: '0.75rem',
            fontWeight: 700,
            border: `2px solid ${difficultyColor.border}`,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {difficultyColor.label}
        </div>
      </div>

      {/* Content Container */}
      <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Title */}
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            margin: '0 0 6px 0',
            color: '#1f2937',
            lineHeight: 1.3
          }}
        >
          {item.label || item.name}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: '0.85rem',
            color: '#6b7280',
            margin: 0,
            marginBottom: 12,
            flex: 1
          }}
        >
          {item.description || `Explore this exciting puzzle category`}
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
            {tags.slice(0, 2).map((tag, idx) => (
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

        {/* Metadata Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: '#9ca3af',
            paddingTop: 12,
            borderTop: '1px solid #e5e7eb'
          }}
        >
          <span>▶️ {playsCount} plays</span>
          <span>✓ {completedCount} done</span>
        </div>
      </div>

      {/* CTA Button */}
      <div
        style={{
          padding: '0 16px 16px 16px'
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(getNavigationPath(item));
          }}
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: 8,
            border: 'none',
            background: `linear-gradient(135deg, ${difficultyColor.text} 0%, ${difficultyColor.text}dd 100%)`,
            color: 'white',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.9rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Play Now →
        </button>
      </div>
    </div>
  );
}
