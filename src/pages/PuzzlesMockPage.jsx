import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';

export default function PuzzlesMockPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('All');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

  const PUZZLE_TYPES = [
    { id: 'jigsaw', label: '🧩 Jigsaw', color: '#FF6B6B' },
    { id: 'sudoku', label: '🔢 Sudoku', color: '#4ECDC4' },
    { id: 'crossword', label: '📝 Crossword', color: '#FFE66D' },
    { id: 'logic', label: '🧠 Logic', color: '#95E1D3' },
    { id: 'matching', label: '🎯 Matching', color: '#C7CEEA' },
    { id: 'pattern', label: '🎨 Pattern', color: '#FF85A2' },
  ];

  const AUDIENCES = [
    { value: 'all', label: '👥 All Users', emoji: '👥' },
    { value: 'kids', label: '👶 Kids (5-12)', emoji: '👶' },
    { value: 'students', label: '📚 Students (13-18)', emoji: '📚' },
    { value: 'professionals', label: '💼 Professionals', emoji: '💼' },
    { value: 'programmers', label: '💻 Programmers', emoji: '💻' },
  ];

  const FEATURED_PUZZLES = [
    {
      id: 1,
      title: 'Vintage Winter Village Scene',
      type: 'Jigsaw',
      difficulty: 'Easy',
      audience: 'kids',
      pieces: 100,
      avgTime: '15 min',
      rating: 4.9,
      plays: 5234,
      description: 'Beautiful holiday-themed jigsaw puzzle',
      image: '🎄',
    },
    {
      id: 2,
      title: 'Enchanted Wizard\'s Study',
      type: 'Jigsaw',
      difficulty: 'Medium',
      audience: 'students',
      pieces: 250,
      avgTime: '35 min',
      rating: 4.7,
      plays: 3142,
      description: 'Fantasy-themed magical puzzle',
      image: '🧙',
    },
    {
      id: 3,
      title: 'Classic Sudoku Challenge',
      type: 'Sudoku',
      difficulty: 'Hard',
      audience: 'professionals',
      pieces: 81,
      avgTime: '25 min',
      rating: 4.8,
      plays: 4521,
      description: 'Traditional 9x9 sudoku puzzle',
      image: '🔢',
    },
    {
      id: 4,
      title: 'Ocean Life Matching',
      type: 'Matching',
      difficulty: 'Easy',
      audience: 'kids',
      pieces: 12,
      avgTime: '8 min',
      rating: 4.6,
      plays: 2987,
      description: 'Match ocean creatures with their names',
      image: '🐠',
    },
    {
      id: 5,
      title: 'Advanced Logic Grid',
      type: 'Logic',
      difficulty: 'Expert',
      audience: 'programmers',
      pieces: 50,
      avgTime: '30 min',
      rating: 4.5,
      plays: 1243,
      description: 'Complex deduction puzzle with multiple constraints',
      image: '🧩',
    },
    {
      id: 6,
      title: 'Rainbow Pattern Generator',
      type: 'Pattern',
      difficulty: 'Medium',
      audience: 'students',
      pieces: 64,
      avgTime: '12 min',
      rating: 4.8,
      plays: 3456,
      description: 'Identify and complete color patterns',
      image: '🌈',
    },
    {
      id: 7,
      title: 'Architecture Crossword',
      type: 'Crossword',
      difficulty: 'Medium',
      audience: 'professionals',
      pieces: 15,
      avgTime: '18 min',
      rating: 4.4,
      plays: 1876,
      description: 'Test your knowledge of famous buildings',
      image: '🏛️',
    },
    {
      id: 8,
      title: 'Master Jigsaw Pro',
      type: 'Jigsaw',
      difficulty: 'Expert',
      audience: 'professionals',
      pieces: 500,
      avgTime: '120 min',
      rating: 4.6,
      plays: 892,
      description: '1000+ piece extreme jigsaw challenge',
      image: '👑',
    },
  ];

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: '#4ECB71',
      Medium: '#FFB627',
      Hard: '#FF6B6B',
      Expert: '#9D4EDD',
    };
    return colors[difficulty] || theme.textSecondary;
  };

  const filteredPuzzles = FEATURED_PUZZLES.filter(puzzle => {
    const typeMatch = selectedType === 'All' || puzzle.type === selectedType;
    const audienceMatch = selectedAudience === 'all' || puzzle.audience === selectedAudience;
    return typeMatch && audienceMatch;
  });

  return (
    <SiteLayout>
      <div style={{
        background: theme.background,
        minHeight: '100vh',
        padding: '40px 20px',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {/* Hero Section */}
          <div style={{
            marginBottom: '50px',
            textAlign: 'center',
            background: `linear-gradient(135deg, ${theme.accentPrimary}20, ${theme.accentSecondary}20)`,
            borderRadius: '24px',
            padding: '60px 40px',
            border: `2px solid ${theme.border}`,
            backdropFilter: 'blur(10px)',
          }}>
            <h1 style={{
              color: theme.accentPrimary,
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: '800',
              margin: '0 0 16px 0',
            }}>
              🧩 Puzzle Gallery (Mock Data)
            </h1>
            <p style={{
              color: theme.textSecondary,
              fontSize: '18px',
              margin: '0 0 20px 0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              This page shows mock puzzle data. Visit <strong>/puzzle</strong> to see real data from Firebase!
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/puzzle')}
                style={{
                  padding: '14px 32px',
                  background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 12px 24px ${theme.accentPrimary}30`;
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                📂 View Real Puzzles from Firebase
              </button>
            </div>
          </div>

          {/* Filters */}
          <div style={{
            marginBottom: '40px',
          }}>
            {/* Audience Filter */}
            <div style={{
              marginBottom: '30px',
            }}>
              <h3 style={{
                color: theme.textPrimary,
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '16px',
              }}>
                👥 Who is this for?
              </h3>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
              }}>
                {AUDIENCES.map(aud => (
                  <button
                    key={aud.value}
                    onClick={() => setSelectedAudience(aud.value)}
                    style={{
                      padding: '12px 24px',
                      background: selectedAudience === aud.value ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})` : theme.surfaceSecondary,
                      color: selectedAudience === aud.value ? '#fff' : theme.textPrimary,
                      border: `2px solid ${selectedAudience === aud.value ? 'transparent' : theme.border}`,
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      if (selectedAudience !== aud.value) {
                        e.target.style.borderColor = theme.accentPrimary;
                        e.target.style.background = `${theme.accentPrimary}15`;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedAudience !== aud.value) {
                        e.target.style.borderColor = theme.border;
                        e.target.style.background = theme.surfaceSecondary;
                      }
                    }}
                  >
                    {aud.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div style={{
              marginBottom: '30px',
            }}>
              <h3 style={{
                color: theme.textPrimary,
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '16px',
              }}>
                📂 Puzzle Types
              </h3>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
              }}>
                <button
                  onClick={() => setSelectedType('All')}
                  style={{
                    padding: '12px 24px',
                    background: selectedType === 'All' ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})` : theme.surfaceSecondary,
                    color: selectedType === 'All' ? '#fff' : theme.textPrimary,
                    border: `2px solid ${selectedType === 'All' ? 'transparent' : theme.border}`,
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    if (selectedType !== 'All') {
                      e.target.style.borderColor = theme.accentPrimary;
                      e.target.style.background = `${theme.accentPrimary}15`;
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedType !== 'All') {
                      e.target.style.borderColor = theme.border;
                      e.target.style.background = theme.surfaceSecondary;
                    }
                  }}
                >
                  All Types
                </button>
                {PUZZLE_TYPES.map(pType => (
                  <button
                    key={pType.id}
                    onClick={() => setSelectedType(pType.label.split(' ')[1])}
                    style={{
                      padding: '12px 24px',
                      background: selectedType === pType.label.split(' ')[1] ? `${pType.color}30` : theme.surfaceSecondary,
                      color: selectedType === pType.label.split(' ')[1] ? pType.color : theme.textPrimary,
                      border: `2px solid ${selectedType === pType.label.split(' ')[1] ? pType.color : theme.border}`,
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      if (selectedType !== pType.label.split(' ')[1]) {
                        e.target.style.borderColor = pType.color;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedType !== pType.label.split(' ')[1]) {
                        e.target.style.borderColor = theme.border;
                      }
                    }}
                  >
                    {pType.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div style={{
            color: theme.textSecondary,
            marginBottom: '24px',
            fontSize: '15px',
            fontWeight: '500',
          }}>
            Showing <strong style={{ color: theme.textPrimary }}>{filteredPuzzles.length}</strong> puzzle{filteredPuzzles.length !== 1 ? 's' : ''}
          </div>

          {/* Puzzle Cards Grid */}
          {filteredPuzzles.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}>
              {filteredPuzzles.map((puzzle) => (
                <div
                  key={puzzle.id}
                  onMouseEnter={() => setHoveredCard(puzzle.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: theme.surfacePrimary,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '16px',
                    padding: '24px',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    transform: hoveredCard === puzzle.id ? 'translateY(-12px)' : 'translateY(0)',
                    borderColor: hoveredCard === puzzle.id ? theme.accentPrimary : theme.border,
                    boxShadow: hoveredCard === puzzle.id ? `0 20px 40px ${theme.accentPrimary}25` : 'none',
                    cursor: 'pointer',
                  }}
                >
                  {/* Icon & Title */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '16px',
                  }}>
                    <div style={{
                      fontSize: '48px',
                    }}>
                      {puzzle.image}
                    </div>
                    <div style={{
                      flex: 1,
                    }}>
                      <h3 style={{
                        color: theme.textPrimary,
                        fontSize: '18px',
                        fontWeight: '700',
                        margin: '0 0 4px 0',
                      }}>
                        {puzzle.title}
                      </h3>
                      <p style={{
                        color: theme.textSecondary,
                        fontSize: '12px',
                        margin: '0',
                      }}>
                        {puzzle.description}
                      </p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginBottom: '16px',
                  }}>
                    <div style={{
                      background: `${theme.accentPrimary}20`,
                      color: theme.accentPrimary,
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}>
                      {puzzle.type}
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px',
                    paddingBottom: '16px',
                    borderBottom: `1px solid ${theme.border}`,
                    marginBottom: '16px',
                    flex: '1',
                  }}>
                    <div>
                      <div style={{
                        color: theme.textSecondary,
                        fontSize: '12px',
                        fontWeight: '500',
                        marginBottom: '4px',
                      }}>
                        Pieces/Size
                      </div>
                      <div style={{
                        color: theme.textPrimary,
                        fontSize: '18px',
                        fontWeight: '700',
                      }}>
                        {puzzle.pieces}
                      </div>
                    </div>
                    <div>
                      <div style={{
                        color: theme.textSecondary,
                        fontSize: '12px',
                        fontWeight: '500',
                        marginBottom: '4px',
                      }}>
                        Avg Time
                      </div>
                      <div style={{
                        color: theme.textPrimary,
                        fontSize: '18px',
                        fontWeight: '700',
                      }}>
                        {puzzle.avgTime}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      fontSize: '13px',
                      color: theme.textSecondary,
                    }}>
                      <span>⭐ {puzzle.rating}</span>
                      <span>▶️ {puzzle.plays}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => navigate(`/play/puzzle/${puzzle.id}`)}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      marginTop: 'auto',
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    Start Puzzle →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '80px 40px',
              color: theme.textSecondary,
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🧩</div>
              <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No puzzles found</p>
              <p style={{ fontSize: '15px' }}>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
