// Modern Homepage inspired by PuzzleFree.game
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';

export default function ModernHomePage() {
  const navigate = useNavigate();
  const { currentTheme, isDarkMode } = useTheme();

  const sections = [
    {
      id: 'puzzles',
      title: '🧩 Puzzles',
      description: 'Solve fascinating logical puzzles and brain teasers',
      stats: '2,450 puzzles',
      color: 'puzzle',
      path: '/puzzle',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    {
      id: 'quizzes',
      title: '📝 Quizzes',
      description: 'Test your knowledge across multiple topics',
      stats: '580 quizzes',
      color: 'quiz',
      path: '/quiz',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    },
    {
      id: 'stories',
      title: '📖 Stories',
      description: 'Engaging stories and interactive adventures',
      stats: '340 stories',
      color: 'story',
      path: '/story',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
    },
    {
      id: 'daily',
      title: '📅 Daily Challenges',
      description: 'New challenges every day',
      stats: 'Limited time',
      color: 'daily',
      path: '/',
      gradient: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
    },
  ];

  return (
    <div
      style={{
        background: isDarkMode
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        minHeight: '100vh',
        paddingTop: 20,
        paddingBottom: 60,
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '60px 20px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            marginBottom: 16,
            background: currentTheme.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Welcome to AmAha 🎮
        </h1>

        <p
          style={{
            fontSize: '1.3rem',
            color: currentTheme.textSecondary,
            marginBottom: 40,
            maxWidth: 600,
            margin: '0 auto 40px',
            lineHeight: 1.6,
          }}
        >
          Your ultimate platform for puzzles, quizzes, stories, and daily
          challenges
        </p>

        {/* Feature Highlights */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 20,
            marginBottom: 60,
          }}
        >
          {[
            { icon: '🏆', label: 'Leaderboards', desc: 'Compete globally' },
            { icon: '🎁', label: 'Rewards', desc: 'Earn badges' },
            { icon: '⚡', label: 'Streaks', desc: 'Daily challenges' },
            { icon: '👥', label: 'Collections', desc: 'Save favorites' },
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                padding: '20px',
                background: currentTheme.surface,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: 12,
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>
                {feature.icon}
              </div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                {feature.label}
              </div>
              <div style={{ fontSize: '0.85rem', color: currentTheme.textSecondary }}>
                {feature.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Sections */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: 30,
            color: currentTheme.text,
          }}
        >
          What would you like to do?
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
            marginBottom: 60,
          }}
        >
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => navigate(section.path)}
              style={{
                padding: 0,
                border: 'none',
                borderRadius: 16,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isDarkMode
                  ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                  : '0 4px 12px rgba(0, 0, 0, 0.1)',
                background: currentTheme.surface,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = isDarkMode
                  ? '0 12px 24px rgba(0, 0, 0, 0.4)'
                  : '0 12px 24px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isDarkMode
                  ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                  : '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
            >
              {/* Gradient Background */}
              <div
                style={{
                  background: section.gradient,
                  height: '140px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '20px',
                  fontSize: '3.5rem',
                  justifyContent: 'flex-start',
                }}
              >
                {section.title.split(' ')[0]}
              </div>

              {/* Content */}
              <div
                style={{
                  padding: '24px',
                  textAlign: 'left',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    marginBottom: 8,
                    color: currentTheme.text,
                  }}
                >
                  {section.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.95rem',
                    color: currentTheme.textSecondary,
                    marginBottom: 16,
                    minHeight: '2.5em',
                    lineHeight: 1.5,
                  }}
                >
                  {section.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.85rem',
                      color: currentTheme.textSecondary,
                      fontWeight: 500,
                    }}
                  >
                    {section.stats}
                  </span>
                  <span
                    style={{
                      fontSize: '1.5rem',
                      opacity: 0.6,
                    }}
                  >
                    →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px',
          marginBottom: 60,
        }}
      >
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            marginBottom: 20,
            color: currentTheme.text,
          }}
        >
          Top Players This Week 🏆
        </h2>

        <div
          style={{
            background: currentTheme.surface,
            border: `1px solid ${currentTheme.border}`,
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: isDarkMode
              ? '0 4px 12px rgba(0, 0, 0, 0.2)'
              : '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          {[
            { rank: 1, name: 'Shadow Knight', score: '15,280', streak: 42 },
            { rank: 2, name: 'Puzzle Master', score: '14,950', streak: 38 },
            { rank: 3, name: 'Brain Wizard', score: '14,620', streak: 35 },
          ].map((player) => (
            <div
              key={player.rank}
              style={{
                padding: '16px 24px',
                borderBottom:
                  player.rank < 3 ? `1px solid ${currentTheme.border}` : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: currentTheme.primary,
                  minWidth: '40px',
                }}
              >
                #{player.rank}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: currentTheme.text }}>
                  {player.name}
                </div>
              </div>

              <div
                style={{
                  textAlign: 'right',
                  display: 'flex',
                  gap: 24,
                  alignItems: 'center',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: currentTheme.textSecondary,
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    Score
                  </div>
                  <div
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: currentTheme.primary,
                    }}
                  >
                    {player.score}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: currentTheme.textSecondary,
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    Streak
                  </div>
                  <div
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: '#f59e0b',
                    }}
                  >
                    🔥 {player.streak}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/leaderboards')}
          style={{
            marginTop: 16,
            width: '100%',
            padding: '12px 24px',
            background: currentTheme.gradient,
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          View Full Leaderboard →
        </button>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: currentTheme.textSecondary,
          fontSize: '0.9rem',
        }}
      >
        <p>© 2024 AmAha. All rights reserved. 🚀</p>
      </div>
    </div>
  );
}
