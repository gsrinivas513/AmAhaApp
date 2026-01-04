/**
 * GAMES PAGE - Interactive Learning Games Hub
 * Displays fun learning games for users
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import SiteLayout from '../layouts/SiteLayout';

export default function GamesPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const gameCategories = [
    {
      id: 'memory',
      title: 'Memory Match',
      emoji: '🧠',
      description: 'Test your memory by matching pairs of cards. Great for improving concentration and recall.',
      features: ['Multiple Difficulty Levels', 'Leaderboards', 'Achievements'],
      color: '#FF6B6B',
      path: '/games/memory',
    },
    {
      id: 'word-search',
      title: 'Word Search',
      emoji: '🔤',
      description: 'Find hidden words in a grid. Perfect for vocabulary building and pattern recognition.',
      features: ['Word Lists', 'Time Challenges', 'Categories'],
      color: '#4ECDC4',
      path: '/games/word-search',
    },
    {
      id: 'trivia',
      title: 'Quick Trivia',
      emoji: '⚡',
      description: 'Fast-paced trivia challenges to test your knowledge across multiple subjects.',
      features: ['Multiple Categories', 'Speed Rounds', 'Multiplayer'],
      color: '#FFE66D',
      path: '/games/trivia',
    },
    {
      id: 'crossword',
      title: 'Crossword Puzzles',
      emoji: '📋',
      description: 'Classic crossword puzzles to boost your vocabulary and problem-solving skills.',
      features: ['Multiple Difficulty', 'Hints System', 'Progress Tracking'],
      color: '#95E1D3',
      path: '/games/crossword',
    },
    {
      id: 'hangman',
      title: 'Hangman',
      emoji: '📝',
      description: 'Guess the word before running out of attempts. Fun for all ages!',
      features: ['Word Categories', 'Difficulty Modes', 'Statistics'],
      color: '#C7CEEA',
      path: '/games/hangman',
    },
    {
      id: 'math-challenge',
      title: 'Math Challenge',
      emoji: '🧮',
      description: 'Solve math puzzles and equations against the clock. Sharpen your calculation skills.',
      features: ['Multiple Operations', 'Timed Rounds', 'Leaderboards'],
      color: '#FF85A2',
      path: '/games/math-challenge',
    },
  ];

  return (
    <SiteLayout>
      <div style={{
        background: theme.background,
        padding: '40px 20px',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {/* Hero Section */}
          <div style={{
            marginBottom: '60px',
            textAlign: 'center',
            background: `linear-gradient(135deg, ${theme.accentPrimary}20, ${theme.accentSecondary}20)`,
            borderRadius: '24px',
            padding: '80px 40px',
            border: `2px solid ${theme.border}`,
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '20px',
              animation: 'float 3s ease-in-out infinite',
            }}>
              🎮
            </div>

            <h1 style={{
              color: theme.accentPrimary,
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: '800',
              margin: '0 0 16px 0',
              letterSpacing: '-0.02em',
            }}>
              Gaming Universe
            </h1>

            <p style={{
              color: theme.textSecondary,
              fontSize: '18px',
              margin: '0 0 32px 0',
              maxWidth: '700px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.6',
            }}>
              Learn while you play! Explore our collection of interactive games designed to make learning fun, engaging, and unforgettable.
            </p>

            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '14px 32px',
                  background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 8px 20px ${theme.accentPrimary}40`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 28px ${theme.accentPrimary}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 8px 20px ${theme.accentPrimary}40`;
                }}
              >
                🏠 Back to Home
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            marginBottom: '60px',
          }}>
            {[
              { label: '6+', value: 'Game Types' },
              { label: '1000+', value: 'Challenges' },
              { label: '50K+', value: 'Players' },
              { label: '24/7', value: 'Available' },
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  background: theme.surfacePrimary,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.accentPrimary;
                  e.currentTarget.style.boxShadow = `0 8px 20px ${theme.accentPrimary}20`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: theme.accentPrimary,
                  marginBottom: '8px',
                }}>
                  {stat.label}
                </div>
                <div style={{
                  color: theme.textSecondary,
                  fontSize: '14px',
                }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Games Grid */}
          <div style={{
            marginBottom: '60px',
          }}>
            <h2 style={{
              color: theme.textPrimary,
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '32px',
              textAlign: 'center',
            }}>
              Choose Your Game
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
            }}>
              {gameCategories.map((game, idx) => (
                <div
                  key={game.id}
                  style={{
                    background: theme.surfacePrimary,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    transform: hoveredCard === game.id ? 'translateY(-12px)' : 'translateY(0)',
                    boxShadow: hoveredCard === game.id 
                      ? `0 12px 32px ${theme.accentPrimary}30, 0 0 0 1px ${theme.accentPrimary}20`
                      : `0 2px 8px ${theme.accentPrimary}10`,
                  }}
                  onMouseEnter={() => setHoveredCard(game.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate(game.path)}
                >
                  {/* Color Header */}
                  <div style={{
                    background: `linear-gradient(135deg, ${game.color}20, ${game.color}10)`,
                    padding: '32px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: `2px solid ${game.color}40`,
                  }}>
                    <div style={{
                      fontSize: '48px',
                    }}>
                      {game.emoji}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{
                    padding: '24px',
                  }}>
                    <h3 style={{
                      color: theme.textPrimary,
                      fontSize: '20px',
                      fontWeight: '700',
                      margin: '0 0 12px 0',
                    }}>
                      {game.title}
                    </h3>

                    <p style={{
                      color: theme.textSecondary,
                      fontSize: '14px',
                      margin: '0 0 20px 0',
                      lineHeight: '1.6',
                    }}>
                      {game.description}
                    </p>

                    {/* Features */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '20px',
                    }}>
                      {game.features.map((feature, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: `${game.color}20`,
                            color: game.color,
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            border: `1px solid ${game.color}40`,
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => navigate(game.path)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: `linear-gradient(135deg, ${game.color}80, ${game.color}60)`,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `linear-gradient(135deg, ${game.color}, ${game.color}80)`;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `linear-gradient(135deg, ${game.color}80, ${game.color}60)`;
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      Play Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div style={{
            background: `linear-gradient(135deg, ${theme.accentPrimary}15, ${theme.accentSecondary}15)`,
            borderRadius: '16px',
            padding: '48px 32px',
            textAlign: 'center',
            border: `1px solid ${theme.border}`,
            marginBottom: '60px',
          }}>
            <h3 style={{
              color: theme.textPrimary,
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 0 12px 0',
            }}>
              Ready to Challenge Yourself?
            </h3>
            <p style={{
              color: theme.textSecondary,
              margin: '0 0 24px 0',
              fontSize: '16px',
            }}>
              Pick a game above and start playing now. Track your progress and climb the leaderboards!
            </p>
            <button
              onClick={() => navigate('/leaderboards')}
              style={{
                padding: '12px 28px',
                background: theme.accentPrimary,
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 20px ${theme.accentPrimary}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              View Leaderboards
            </button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
