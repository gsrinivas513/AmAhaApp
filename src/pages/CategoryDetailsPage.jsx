import React, { useState } from 'react';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { useParams } from 'react-router-dom';

export default function CategoryDetailsPage() {
  const { theme } = useTheme();
  const { categoryId } = useParams();
  const [selectedTopic, setSelectedTopic] = useState(null);

  const CATEGORY_DATA = {
    puzzle: {
      name: 'Puzzles',
      icon: '🧩',
      description: 'Challenge your mind with brain teasers and logic puzzles',
      color: theme.accentPrimary,
      difficulty: 'Mixed',
      topics: [
        { id: 1, name: 'Sudoku', difficulty: 'Medium', plays: 5234, rating: 4.8 },
        { id: 2, name: 'Chess Puzzles', difficulty: 'Hard', plays: 3421, rating: 4.9 },
        { id: 3, name: 'Logic Grids', difficulty: 'Medium', plays: 2156, rating: 4.6 },
        { id: 4, name: 'Sliding Puzzles', difficulty: 'Easy', plays: 1892, rating: 4.5 },
      ],
    },
    quiz: {
      name: 'Quizzes',
      icon: '❓',
      description: 'Test your knowledge across various subjects',
      color: theme.accentSecondary,
      difficulty: 'Mixed',
      topics: [
        { id: 1, name: 'General Knowledge', difficulty: 'Easy', plays: 8734, rating: 4.7 },
        { id: 2, name: 'Science & Nature', difficulty: 'Medium', plays: 5621, rating: 4.8 },
        { id: 3, name: 'History', difficulty: 'Hard', plays: 3245, rating: 4.6 },
        { id: 4, name: 'Technology', difficulty: 'Hard', plays: 4567, rating: 4.9 },
      ],
    },
    learning: {
      name: 'Learning Paths',
      icon: '📚',
      description: 'Structured courses to master new skills',
      color: '#FFD700',
      difficulty: 'Beginner to Advanced',
      topics: [
        { id: 1, name: 'Python Basics', difficulty: 'Easy', plays: 7234, rating: 4.9 },
        { id: 2, name: 'Web Development', difficulty: 'Medium', plays: 5892, rating: 4.8 },
        { id: 3, name: 'Data Science', difficulty: 'Hard', plays: 3456, rating: 4.7 },
        { id: 4, name: 'Machine Learning', difficulty: 'Expert', plays: 1234, rating: 4.8 },
      ],
    },
  };

  const category = CATEGORY_DATA[categoryId] || CATEGORY_DATA.puzzle;

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
          {/* Header Section */}
          <div style={{
            background: `linear-gradient(135deg, ${category.color}20, ${category.color}10)`,
            border: `2px solid ${category.color}40`,
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '40px',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '20px',
            }}>
              <div style={{ fontSize: '60px' }}>{category.icon}</div>
              <div>
                <h1 style={{
                  color: theme.textPrimary,
                  fontSize: 'clamp(28px, 5vw, 42px)',
                  fontWeight: '700',
                  margin: '0 0 8px 0',
                }}>
                  {category.name}
                </h1>
                <p style={{
                  color: theme.textSecondary,
                  fontSize: '16px',
                  margin: '0',
                }}>
                  {category.description}
                </p>
              </div>
            </div>

            {/* Category Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
            }}>
              <div style={{
                background: theme.surfaceSecondary,
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${theme.border}`,
              }}>
                <div style={{
                  fontSize: '12px',
                  color: theme.textSecondary,
                  marginBottom: '8px',
                }}>
                  Total Topics
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: category.color,
                }}>
                  {category.topics.length}
                </div>
              </div>

              <div style={{
                background: theme.surfaceSecondary,
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${theme.border}`,
              }}>
                <div style={{
                  fontSize: '12px',
                  color: theme.textSecondary,
                  marginBottom: '8px',
                }}>
                  Difficulty Level
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: theme.textPrimary,
                }}>
                  {category.difficulty}
                </div>
              </div>

              <div style={{
                background: theme.surfaceSecondary,
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${theme.border}`,
              }}>
                <div style={{
                  fontSize: '12px',
                  color: theme.textSecondary,
                  marginBottom: '8px',
                }}>
                  Avg Rating
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#FFD700',
                }}>
                  ⭐ 4.8
                </div>
              </div>
            </div>
          </div>

          {/* Topics Section */}
          <div>
            <h2 style={{
              color: theme.textPrimary,
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '24px',
              margin: '0 0 24px 0',
            }}>
              Topics & Challenges
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}>
              {category.topics.map(topic => {
                const difficultyColors = {
                  Easy: theme.accentPrimary,
                  Medium: '#FFA500',
                  Hard: '#FF6B6B',
                  Expert: theme.accentSecondary,
                };

                return (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    style={{
                      background: theme.surfacePrimary,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '16px',
                      padding: '24px',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.borderColor = category.color;
                      e.currentTarget.style.boxShadow = `0 12px 24px ${category.color}20`;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = theme.border;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Title */}
                    <h3 style={{
                      color: theme.textPrimary,
                      fontSize: '18px',
                      fontWeight: '700',
                      margin: '0 0 12px 0',
                    }}>
                      {topic.name}
                    </h3>

                    {/* Difficulty Badge */}
                    <div style={{
                      display: 'inline-block',
                      background: `${difficultyColors[topic.difficulty]}20`,
                      color: difficultyColors[topic.difficulty],
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '16px',
                    }}>
                      {topic.difficulty}
                    </div>

                    {/* Stats */}
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      marginBottom: '16px',
                      paddingBottom: '16px',
                      borderBottom: `1px solid ${theme.border}`,
                    }}>
                      <div>
                        <div style={{
                          fontSize: '12px',
                          color: theme.textSecondary,
                          marginBottom: '4px',
                        }}>
                          Rating
                        </div>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#FFD700',
                        }}>
                          ⭐ {topic.rating}
                        </div>
                      </div>

                      <div>
                        <div style={{
                          fontSize: '12px',
                          color: theme.textSecondary,
                          marginBottom: '4px',
                        }}>
                          Plays
                        </div>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: theme.accentPrimary,
                        }}>
                          {topic.plays.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)`,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '15px',
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
                      Start Challenge →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Topic Details Modal */}
          {selectedTopic && (
            <div
              onClick={() => setSelectedTopic(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `${theme.background}dd`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                zIndex: 1000,
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: theme.surfacePrimary,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '20px',
                  padding: '40px',
                  maxWidth: '500px',
                  width: '90%',
                }}
              >
                <h2 style={{
                  color: theme.textPrimary,
                  fontSize: '28px',
                  fontWeight: '700',
                  marginTop: 0,
                  marginBottom: '16px',
                }}>
                  {selectedTopic.name}
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '24px',
                }}>
                  <div style={{
                    padding: '16px',
                    background: theme.surfaceSecondary,
                    borderRadius: '12px',
                    border: `1px solid ${theme.border}`,
                  }}>
                    <div style={{ fontSize: '12px', color: theme.textSecondary }}>Difficulty</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary }}>
                      {selectedTopic.difficulty}
                    </div>
                  </div>
                  <div style={{
                    padding: '16px',
                    background: theme.surfaceSecondary,
                    borderRadius: '12px',
                    border: `1px solid ${theme.border}`,
                  }}>
                    <div style={{ fontSize: '12px', color: theme.textSecondary }}>Rating</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#FFD700' }}>
                      ⭐ {selectedTopic.rating}
                    </div>
                  </div>
                </div>

                <p style={{
                  color: theme.textSecondary,
                  fontSize: '15px',
                  marginBottom: '24px',
                }}>
                  Ready to challenge yourself? Start this topic and earn XP, coins, and unlock achievements!
                </p>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                }}>
                  <button
                    onClick={() => setSelectedTopic(null)}
                    style={{
                      flex: 1,
                      padding: '12px 24px',
                      background: theme.surfaceSecondary,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '12px',
                      color: theme.textPrimary,
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: '12px 24px',
                      background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)`,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Start Challenge
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
