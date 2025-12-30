// Enhanced Game Sidebar with hints, progress, and metadata
import React, { useState } from 'react';

export default function GameSidebar({
  puzzleTitle = 'Puzzle',
  difficulty = 'medium',
  hints = [],
  progress = { current: 50, total: 100 },
  stats = { attempts: 0, time: 0 },
  achievements = [],
  onHintClick = () => {},
  onBackClick = () => {}
}) {
  const [expandedHints, setExpandedHints] = useState(false);
  const [usedHints, setUsedHints] = useState(0);

  const DIFFICULTY_COLORS = {
    easy: { bg: '#dbeafe', text: '#0284c7', label: 'Easy' },
    medium: { bg: '#fed7aa', text: '#d97706', label: 'Medium' },
    hard: { bg: '#fecaca', text: '#dc2626', label: 'Hard' },
    beginner: { bg: '#d1fae5', text: '#059669', label: 'Beginner' },
    expert: { bg: '#e9d5ff', text: '#a855f7', label: 'Expert' }
  };

  const diffColor = DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS.medium;
  const progressPercent = (progress.current / progress.total) * 100;
  const timeMinutes = Math.floor(stats.time / 60);
  const timeSeconds = stats.time % 60;

  const handleHintClick = (hintIndex) => {
    onHintClick(hintIndex);
    setUsedHints(usedHints + 1);
  };

  return (
    <aside
      style={{
        position: 'sticky',
        top: 20,
        width: '100%',
        maxWidth: 320,
        maxHeight: 'calc(100vh - 40px)',
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
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '12px 12px 0 0'
        }}
      >
        <button
          onClick={onBackClick}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12
          }}
        >
          ← Back
        </button>
        <h3
          style={{
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: 700,
            wordBreak: 'break-word'
          }}
        >
          {puzzleTitle}
        </h3>
        <div
          style={{
            fontSize: '0.8rem',
            opacity: 0.9,
            marginTop: 8,
            display: 'inline-block',
            padding: '4px 8px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 4
          }}
        >
          {diffColor.label}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Progress */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8
            }}
          >
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1f2937' }}>
              📊 Progress
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7' }}>
              {progress.current}/{progress.total}
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: 8,
              background: '#e5e7eb',
              borderRadius: 4,
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: `linear-gradient(90deg, #0284c7 0%, #0369a1 100%)`,
                transition: 'width 0.3s ease'
              }}
            />
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              marginTop: 6
            }}
          >
            {Math.round(progressPercent)}% Complete
          </div>
        </div>

        {/* Stats */}
        <div style={{ background: '#f9fafb', padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1f2937', marginBottom: 8 }}>
            ⏱️ Stats
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div
              style={{
                textAlign: 'center',
                padding: 8,
                background: 'white',
                borderRadius: 6,
                borderLeft: '3px solid #0284c7'
              }}
            >
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: '#0284c7'
                }}
              >
                {timeMinutes}:{String(timeSeconds).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: 4 }}>
                Time
              </div>
            </div>
            <div
              style={{
                textAlign: 'center',
                padding: 8,
                background: 'white',
                borderRadius: 6,
                borderLeft: '3px solid #d97706'
              }}
            >
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: '#d97706'
                }}
              >
                {stats.attempts}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: 4 }}>
                Attempts
              </div>
            </div>
          </div>
        </div>

        {/* Hints Section */}
        {hints && hints.length > 0 && (
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 12 }}>
            <button
              onClick={() => setExpandedHints(!expandedHints)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 600,
                color: '#1f2937',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <span>💡 Hints ({usedHints}/{hints.length})</span>
              <span>{expandedHints ? '▼' : '▶'}</span>
            </button>

            {expandedHints && (
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {hints.map((hint, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: 10,
                      background: '#fef3c7',
                      border: '1px solid #fcd34d',
                      borderRadius: 6,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fde68a';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fef3c7';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={() => handleHintClick(idx)}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#92400e' }}>
                      Hint {idx + 1}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#b45309', marginTop: 4 }}>
                      {hint}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 12 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1f2937', marginBottom: 8 }}>
              🏆 Achievements
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {achievements.map((achievement, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '6px 10px',
                    background: '#dbeafe',
                    color: '#0284c7',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    border: '1px solid #0284c7'
                  }}
                  title={achievement.description}
                >
                  {achievement.icon} {achievement.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Tip */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #e5e7eb',
          background: '#f3f4f6',
          fontSize: '0.75rem',
          color: '#6b7280',
          textAlign: 'center',
          borderRadius: '0 0 12px 12px',
          fontStyle: 'italic'
        }}
      >
        💡 Use hints wisely for extra challenge!
      </div>
    </aside>
  );
}
