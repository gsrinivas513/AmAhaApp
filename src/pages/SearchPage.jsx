import React, { useState, useEffect } from 'react';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { useSearchParams } from 'react-router-dom';

const CATEGORIES = ['All', 'Puzzle', 'Quiz', 'Learning', 'Creative', 'Practice'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard', 'Expert'];

export default function SearchPage() {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const DEMO_RESULTS = [
    {
      id: 1,
      title: 'Sudoku Puzzle',
      category: 'Puzzle',
      difficulty: 'Medium',
      rating: 4.5,
      plays: 2341,
      author: 'PuzzleMaster',
      description: 'Classic sudoku puzzle with medium difficulty',
    },
    {
      id: 2,
      title: 'JavaScript Quiz',
      category: 'Quiz',
      difficulty: 'Hard',
      rating: 4.8,
      plays: 1523,
      author: 'CodePro',
      description: 'Test your JavaScript knowledge with advanced questions',
    },
    {
      id: 3,
      title: 'Python Learning Path',
      category: 'Learning',
      difficulty: 'Easy',
      rating: 4.9,
      plays: 5023,
      author: 'LearningHub',
      description: 'Complete guide to Python programming basics',
    },
    {
      id: 4,
      title: 'Design Challenge',
      category: 'Creative',
      difficulty: 'Medium',
      rating: 4.6,
      plays: 892,
      author: 'DesignStudio',
      description: 'Create beautiful UI/UX designs for modern apps',
    },
    {
      id: 5,
      title: 'Math Brain Training',
      category: 'Practice',
      difficulty: 'Easy',
      rating: 4.7,
      plays: 3456,
      author: 'MathGenius',
      description: 'Improve your mental math skills daily',
    },
    {
      id: 6,
      title: 'Logic Puzzle Master',
      category: 'Puzzle',
      difficulty: 'Expert',
      rating: 4.4,
      plays: 567,
      author: 'LogicLabs',
      description: 'Advanced logical reasoning challenges',
    },
  ];

  useEffect(() => {
    if (query) {
      setSearching(true);
      setTimeout(() => {
        let filtered = DEMO_RESULTS.filter(item => {
          const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase()) ||
                              item.description.toLowerCase().includes(query.toLowerCase());
          const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
          const matchesDifficulty = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
          return matchesQuery && matchesCategory && matchesDifficulty;
        });
        setResults(filtered);
        setSearching(false);
      }, 300);
    }
  }, [query, selectedCategory, selectedDifficulty]);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: theme.accentPrimary,
      Medium: '#FFA500',
      Hard: '#FF6B6B',
      Expert: theme.accentSecondary,
    };
    return colors[difficulty] || theme.textSecondary;
  };

  return (
    <SiteLayout>
      <div style={{
        background: theme.background,
        minHeight: '100vh',
        padding: '40px 20px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{
              color: theme.accentPrimary,
              fontSize: 'clamp(32px, 5vw, 42px)',
              fontWeight: '700',
              margin: '0 0 10px 0',
            }}>
              🔍 Search & Explore
            </h1>
            <p style={{
              color: theme.textSecondary,
              fontSize: '16px',
              margin: '0',
            }}>
              Find puzzles, quizzes, and learning content
            </p>
          </div>

          {/* Search Input */}
          <div style={{
            marginBottom: '30px',
            display: 'flex',
            gap: '12px',
          }}>
            <div style={{
              flex: 1,
              position: 'relative',
            }}>
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchParams({ q: e.target.value });
                }}
                placeholder="Search puzzles, quizzes, learning paths..."
                style={{
                  width: '100%',
                  padding: '16px 20px 16px 50px',
                  background: theme.surfacePrimary,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '14px',
                  color: theme.textPrimary,
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.accentPrimary;
                  e.target.style.boxShadow = `0 0 0 3px ${theme.accentPrimary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '20px',
              }}>
                🔍
              </span>
            </div>
          </div>

          {/* Filters */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '30px',
          }}>
            {/* Category Filter */}
            <div>
              <label style={{
                display: 'block',
                color: theme.textPrimary,
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
              }}>
                Category
              </label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '8px 16px',
                      background: selectedCategory === cat ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})` : theme.surfaceSecondary,
                      color: selectedCategory === cat ? '#fff' : theme.textPrimary,
                      border: `2px solid ${selectedCategory === cat ? 'transparent' : theme.border}`,
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      if (selectedCategory !== cat) {
                        e.target.style.borderColor = theme.accentPrimary;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedCategory !== cat) {
                        e.target.style.borderColor = theme.border;
                      }
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label style={{
                display: 'block',
                color: theme.textPrimary,
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
              }}>
                Difficulty
              </label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                {DIFFICULTIES.map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    style={{
                      padding: '8px 16px',
                      background: selectedDifficulty === diff ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})` : theme.surfaceSecondary,
                      color: selectedDifficulty === diff ? '#fff' : theme.textPrimary,
                      border: `2px solid ${selectedDifficulty === diff ? 'transparent' : theme.border}`,
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      if (selectedDifficulty !== diff) {
                        e.target.style.borderColor = theme.accentPrimary;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedDifficulty !== diff) {
                        e.target.style.borderColor = theme.border;
                      }
                    }}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          {searching ? (
            <div style={{
              textAlign: 'center',
              color: theme.textSecondary,
              padding: '40px',
              fontSize: '16px',
            }}>
              ⏳ Searching...
            </div>
          ) : query ? (
            <>
              <div style={{
                color: theme.textSecondary,
                marginBottom: '20px',
                fontSize: '15px',
              }}>
                Found <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''} for <strong>"{query}"</strong>
              </div>

              {results.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '20px',
                }}>
                  {results.map(item => (
                    <div
                      key={item.id}
                      style={{
                        background: theme.surfacePrimary,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '16px',
                        padding: '20px',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.borderColor = theme.accentPrimary;
                        e.currentTarget.style.boxShadow = `0 12px 24px ${theme.accentPrimary}20`;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = theme.border;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Header */}
                      <div style={{
                        marginBottom: '12px',
                      }}>
                        <h3 style={{
                          color: theme.textPrimary,
                          fontSize: '18px',
                          fontWeight: '600',
                          margin: '0 0 8px 0',
                        }}>
                          {item.title}
                        </h3>
                        <p style={{
                          color: theme.textSecondary,
                          fontSize: '14px',
                          margin: '0',
                        }}>
                          {item.description}
                        </p>
                      </div>

                      {/* Meta Info */}
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap',
                        marginBottom: '12px',
                      }}>
                        <div style={{
                          background: `${theme.accentPrimary}20`,
                          color: theme.accentPrimary,
                          padding: '4px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}>
                          {item.category}
                        </div>
                        <div style={{
                          background: `${getDifficultyColor(item.difficulty)}20`,
                          color: getDifficultyColor(item.difficulty),
                          padding: '4px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}>
                          {item.difficulty}
                        </div>
                      </div>

                      {/* Stats */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '12px',
                        borderTop: `1px solid ${theme.border}`,
                      }}>
                        <div style={{
                          display: 'flex',
                          gap: '12px',
                          fontSize: '13px',
                          color: theme.textSecondary,
                        }}>
                          <span>⭐ {item.rating}</span>
                          <span>▶️ {item.plays}</span>
                        </div>
                        <button
                          style={{
                            padding: '8px 16px',
                            background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        >
                          Play
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: theme.textSecondary,
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                  <p style={{ fontSize: '18px', fontWeight: '600' }}>No results found</p>
                  <p style={{ fontSize: '14px' }}>Try different keywords or filters</p>
                </div>
              )}
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: theme.textSecondary,
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
              <p style={{ fontSize: '18px', fontWeight: '600' }}>Start searching</p>
              <p style={{ fontSize: '14px' }}>Enter keywords to find puzzles and quizzes</p>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}