// Universal Modern Card Component for all content types
import React from 'react';
import { useTheme } from '../theme/ThemeProvider';

export default function ModernCard({
  title,
  description,
  icon,
  difficulty = 'medium',
  category,
  stats = {},
  image,
  onClick,
  type = 'puzzle', // puzzle, quiz, story, daily
  isHovered = false,
}) {
  const { currentTheme, isDarkMode } = useTheme();

  const difficultyColors = {
    easy: '#10b981',
    medium: '#f59e0b',
    hard: '#ef4444',
  };

  const typeIcons = {
    puzzle: '🧩',
    quiz: '📝',
    story: '📖',
    daily: '📅',
    collection: '📚',
  };

  return (
    <button
      onClick={onClick}
      style={{
        padding: 0,
        border: 'none',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isDarkMode
          ? '0 4px 12px rgba(0, 0, 0, 0.3)'
          : '0 4px 12px rgba(0, 0, 0, 0.1)',
        background: currentTheme.surface,
        border: `1px solid ${currentTheme.border}`,
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = isDarkMode
          ? '0 12px 24px rgba(0, 0, 0, 0.4)'
          : '0 12px 24px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = isDarkMode
          ? '0 4px 12px rgba(0, 0, 0, 0.3)'
          : '0 4px 12px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Image or Color Banner */}
      <div
        style={{
          height: '160px',
          background: image
            ? `url(${image}) center / cover`
            : currentTheme.gradient,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '16px',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Icon Overlay */}
        <div
          style={{
            fontSize: '2.5rem',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          {icon || typeIcons[type]}
        </div>

        {/* Type Badge */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)',
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {type}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: '20px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Title & Description */}
        <div style={{ textAlign: 'left', marginBottom: 12 }}>
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              marginBottom: 8,
              color: currentTheme.text,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </h3>

          {description && (
            <p
              style={{
                fontSize: '0.85rem',
                color: currentTheme.textSecondary,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.4,
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Meta Information */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 12,
            flexWrap: 'wrap',
          }}
        >
          {difficulty && (
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '4px 8px',
                background: isDarkMode
                  ? 'rgba(148, 163, 184, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)',
                borderRadius: 4,
                color: difficultyColors[difficulty],
                textTransform: 'capitalize',
              }}
            >
              {difficulty}
            </div>
          )}

          {category && (
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '4px 8px',
                background: isDarkMode
                  ? 'rgba(148, 163, 184, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)',
                borderRadius: 4,
                color: currentTheme.textSecondary,
                textTransform: 'capitalize',
              }}
            >
              {category}
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {Object.keys(stats).length > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 12,
              borderTop: `1px solid ${currentTheme.border}`,
            }}
          >
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: currentTheme.textSecondary,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  {key}
                </div>
                <div
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: currentTheme.primary,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
