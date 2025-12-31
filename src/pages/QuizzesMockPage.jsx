import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';

export default function QuizzesMockPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

  const CATEGORIES = [
    { id: 'science', label: '🔬 Science', color: '#FF6B6B' },
    { id: 'math', label: '📐 Mathematics', color: '#4ECDC4' },
    { id: 'history', label: '🏛️ History', color: '#FFE66D' },
    { id: 'geography', label: '🌍 Geography', color: '#95E1D3' },
    { id: 'literature', label: '📚 Literature', color: '#C7CEEA' },
    { id: 'technology', label: '💻 Technology', color: '#FF85A2' },
  ];

  const AUDIENCES = [
    { value: 'all', label: '👥 All Users', emoji: '👥' },
    { value: 'kids', label: '👶 Kids (5-12)', emoji: '👶' },
    { value: 'students', label: '📚 Students (13-18)', emoji: '📚' },
    { value: 'professionals', label: '💼 Professionals', emoji: '💼' },
    { value: 'programmers', label: '💻 Programmers', emoji: '💻' },
  ];

  // MOCK FEATURED QUIZZES - Individual quiz cards
  const MOCK_FEATURED_QUIZZES = [
    {
      id: 1,
      title: 'Biology Basics',
      category: 'Science',
      difficulty: 'Easy',
      audience: 'students',
      questions: 15,
      avgTime: '8 min',
      rating: 4.8,
      plays: 2453,
      description: 'Learn fundamental concepts of biology',
      _isMock: true,
    },
    {
      id: 2,
      title: 'Algebra Mastery',
      category: 'Math',
      difficulty: 'Medium',
      audience: 'students',
      questions: 20,
      avgTime: '12 min',
      rating: 4.6,
      plays: 1823,
      description: 'Master algebraic equations and functions',
      _isMock: true,
    },
    {
      id: 3,
      title: 'World War History',
      category: 'History',
      difficulty: 'Medium',
      audience: 'professionals',
      questions: 25,
      avgTime: '15 min',
      rating: 4.7,
      plays: 1542,
      description: 'Test your knowledge of world history',
      _isMock: true,
    },
    {
      id: 4,
      title: 'Capital Cities Challenge',
      category: 'Geography',
      difficulty: 'Easy',
      audience: 'kids',
      questions: 50,
      avgTime: '10 min',
      rating: 4.9,
      plays: 3201,
      description: 'Identify capital cities around the world',
      _isMock: true,
    },
    {
      id: 5,
      title: 'JavaScript Expert',
      category: 'Technology',
      difficulty: 'Hard',
      audience: 'programmers',
      questions: 30,
      avgTime: '20 min',
      rating: 4.5,
      plays: 892,
      description: 'Advanced JavaScript concepts and patterns',
      _isMock: true,
    },
    {
      id: 6,
      title: 'Shakespeare Works',
      category: 'Literature',
      difficulty: 'Hard',
      audience: 'students',
      questions: 18,
      avgTime: '14 min',
      rating: 4.4,
      plays: 654,
      description: 'Deep dive into Shakespeare\'s plays',
      _isMock: true,
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

  const filteredQuizzes = MOCK_FEATURED_QUIZZES.filter(quiz => {
    const categoryMatch = selectedCategory === 'All' || quiz.category === selectedCategory;
    const audienceMatch = selectedAudience === 'all' || quiz.audience === selectedAudience;
    return categoryMatch && audienceMatch;
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
              ❓ Quiz Hub (MOCK - Individual Quizzes)
            </h1>
            <p style={{
              color: theme.textSecondary,
              fontSize: '18px',
              margin: '0 0 20px 0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              Test your knowledge across multiple subjects. Compete with friends and master new skills!
            </p>
            <button
              onClick={() => navigate('/daily-challenge')}
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
              ⚡ Daily Challenge
            </button>
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

            {/* Categories Filter */}
            <div style={{
              marginBottom: '30px',
            }}>
              <h3 style={{
                color: theme.textPrimary,
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '16px',
              }}>
                📚 Browse Categories
              </h3>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
              }}>
                <button
                  onClick={() => setSelectedCategory('All')}
                  style={{
                    padding: '12px 24px',
                    background: selectedCategory === 'All' ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})` : theme.surfaceSecondary,
                    color: selectedCategory === 'All' ? '#fff' : theme.textPrimary,
                    border: `2px solid ${selectedCategory === 'All' ? 'transparent' : theme.border}`,
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    if (selectedCategory !== 'All') {
                      e.target.style.borderColor = theme.accentPrimary;
                      e.target.style.background = `${theme.accentPrimary}15`;
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedCategory !== 'All') {
                      e.target.style.borderColor = theme.border;
                      e.target.style.background = theme.surfaceSecondary;
                    }
                  }}
                >
                  All Categories
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.label.split(' ')[1])}
                    style={{
                      padding: '12px 24px',
                      background: selectedCategory === cat.label.split(' ')[1] ? `${cat.color}30` : theme.surfaceSecondary,
                      color: selectedCategory === cat.label.split(' ')[1] ? cat.color : theme.textPrimary,
                      border: `2px solid ${selectedCategory === cat.label.split(' ')[1] ? cat.color : theme.border}`,
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      if (selectedCategory !== cat.label.split(' ')[1]) {
                        e.target.style.borderColor = cat.color;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedCategory !== cat.label.split(' ')[1]) {
                        e.target.style.borderColor = theme.border;
                      }
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div style={{
              color: theme.textSecondary,
              marginBottom: '24px',
              fontSize: '15px',
              fontWeight: '500',
            }}>
              Showing <strong style={{ color: theme.textPrimary }}>{filteredQuizzes.length}</strong> quiz{filteredQuizzes.length !== 1 ? 'zes' : ''}
            </div>
          </div>

          {/* Quiz Cards Grid */}
          {filteredQuizzes.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}>
              {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                onMouseEnter={() => setHoveredCard(quiz.id)}
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
                  transform: hoveredCard === quiz.id ? 'translateY(-12px)' : 'translateY(0)',
                  borderColor: hoveredCard === quiz.id ? theme.accentPrimary : theme.border,
                  boxShadow: hoveredCard === quiz.id ? `0 20px 40px ${theme.accentPrimary}25` : 'none',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  navigate('/quiz');
                }}
              >
                {/* Header */}
                <div style={{
                  marginBottom: '16px',
                }}>
                  <h3 style={{
                    color: theme.textPrimary,
                    fontSize: '20px',
                    fontWeight: '700',
                    margin: '0 0 8px 0',
                  }}>
                    {quiz.title}
                  </h3>
                  <p style={{
                    color: theme.textSecondary,
                    fontSize: '14px',
                    margin: '0',
                  }}>
                    {quiz.description}
                  </p>
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
                    {quiz.category}
                  </div>
                  <div style={{
                    background: `${getDifficultyColor(quiz.difficulty)}20`,
                    color: getDifficultyColor(quiz.difficulty),
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}>
                    {quiz.difficulty}
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
                      Questions
                    </div>
                    <div style={{
                      color: theme.textPrimary,
                      fontSize: '18px',
                      fontWeight: '700',
                    }}>
                      {quiz.questions}
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
                      {quiz.avgTime}
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
                    <span>⭐ {quiz.rating}</span>
                    <span>▶️ {quiz.plays}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
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
                  Take Quiz →
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
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>❓</div>
              <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No quizzes found</p>
              <p style={{ fontSize: '15px' }}>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
