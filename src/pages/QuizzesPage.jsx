import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import AudienceSelector, { AUDIENCES } from '../components/AudienceSelector';

export default function QuizzesPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const CATEGORIES = [
    { id: 'science', label: '🔬 Science', color: '#FF6B6B' },
    { id: 'math', label: '📐 Mathematics', color: '#4ECDC4' },
    { id: 'history', label: '🏛️ History', color: '#FFE66D' },
    { id: 'geography', label: '🌍 Geography', color: '#95E1D3' },
    { id: 'literature', label: '📚 Literature', color: '#C7CEEA' },
    { id: 'technology', label: '💻 Technology', color: '#FF85A2' },
  ];

  // Load real quiz data from Firestore
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        console.log("📂 [QuizzesPage] Loading quizzes from Firestore...");
        setLoading(true);
        
        // Load quizzes from /quizzes collection
        const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
        console.log("📊 [QuizzesPage] Quizzes query returned:", quizzesSnapshot.docs.length);
        
        let quizzesData = [];

        if (!quizzesSnapshot.empty) {
          quizzesData = quizzesSnapshot.docs.map(doc => {
            const data = doc.data();
            
            // Calculate total questions from levelVariants
            let totalQuestions = 0;
            if (data.levelVariants) {
              totalQuestions = Object.values(data.levelVariants).reduce((sum, variant) => {
                return sum + (variant.questionCount || variant.questions?.length || 0);
              }, 0);
            } else {
              totalQuestions = data.totalQuestions || data.questions?.length || 0;
            }
            
            console.log(`✅ [QuizzesPage] Quiz found:`, { 
              id: doc.id, 
              title: data.title, 
              category: data.category,
              difficulty: data.difficulty,
              levelVariants: data.levelVariants ? Object.keys(data.levelVariants) : null,
              totalQuestions: totalQuestions
            });
            
            return {
              id: doc.id,
              title: data.title || data.name || doc.id,
              description: data.description || `Quiz on ${data.title || doc.id}`,
              category: data.category || 'Uncategorized',
              difficulty: data.difficulty || 'Medium',
              audience: data.audience || 'all',
              questions: totalQuestions,
              avgTime: data.avgTime || '10 min',
              rating: data.rating || 4.5,
              plays: data.plays || 0,
              levelVariants: data.levelVariants || null,
            };
          });
        } else {
          console.warn("⚠️ [QuizzesPage] No quizzes found in Firestore");
        }

        console.log("🎯 [QuizzesPage] Final quizzes:", quizzesData.length);
        setQuizzes(quizzesData);
        setLoading(false);
      } catch (error) {
        console.error('❌ [QuizzesPage] Error loading quizzes:', error);
        setQuizzes([]);
        setLoading(false);
      }
    };
    
    loadQuizzes();
  }, []);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: '#4ECB71',
      Medium: '#FFB627',
      Hard: '#FF6B6B',
      Expert: '#9D4EDD',
    };
    return colors[difficulty] || theme.textSecondary;
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const categoryMatch = selectedCategory === 'All' || quiz.category === selectedCategory;
    const audienceMatch = selectedAudience === 'all' || quiz.audience === selectedAudience;
    return categoryMatch && audienceMatch;
  });

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
              ❓ Quiz Hub
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

          {/* Loading State */}
          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
            }}>
              <p style={{
                color: theme.textSecondary,
                fontSize: '18px',
              }}>
                Loading quizzes...
              </p>
            </div>
          )}

          {/* Filters */}
          {!loading && (
            <div style={{
              marginBottom: '40px',
            }}>
            {/* Audience Filter */}
            <div style={{
              marginBottom: '30px',
            }}>
              <AudienceSelector
                value={selectedAudience}
                onChange={setSelectedAudience}
                label="Who is this for?"
                inline={true}
              />
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
                    // Start with Easy difficulty by default - no extra page!
                    navigate(`/quiz-play/${quiz.id}?difficulty=Easy`);
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
                    {quiz.levelVariants ? (
                      <div style={{
                        display: 'flex',
                        gap: '4px',
                        flexWrap: 'wrap',
                      }}>
                        {Object.keys(quiz.levelVariants).map(difficulty => (
                          <button
                            key={difficulty}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Navigate directly to quiz with this difficulty
                              navigate(`/quiz-play/${quiz.id}?difficulty=${difficulty}`);
                            }}
                            style={{
                              background: `${getDifficultyColor(difficulty)}20`,
                              color: getDifficultyColor(difficulty),
                              padding: '4px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              border: `1px solid ${getDifficultyColor(difficulty)}40`,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = `${getDifficultyColor(difficulty)}40`;
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = `0 4px 12px ${getDifficultyColor(difficulty)}30`;
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = `${getDifficultyColor(difficulty)}20`;
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            {difficulty}
                          </button>
                        ))}
                      </div>
                    ) : (
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
                    )}
                  </div>

                  {/* Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
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
                        Variants
                      </div>
                      <div style={{
                        color: theme.textPrimary,
                        fontSize: '18px',
                        fontWeight: '700',
                      }}>
                        {quiz.levelVariants ? Object.keys(quiz.levelVariants).length : 1}
                      </div>
                    </div>
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

                  {/* Variants Info */}
                  {quiz.levelVariants && (
                    <div style={{
                      background: `${theme.accentPrimary}10`,
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '16px',
                    }}>
                      <div style={{
                        color: theme.textSecondary,
                        fontSize: '11px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                      }}>
                        Difficulty Variants
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '6px',
                        fontSize: '12px',
                      }}>
                        {Object.entries(quiz.levelVariants).map(([level, variant]) => (
                          <div key={level} style={{
                            color: getDifficultyColor(level),
                            fontWeight: '600',
                          }}>
                            {level} ({variant.questionCount}Q)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
                <p style={{ fontSize: '15px' }}>Try adjusting your filters or add quizzes through the admin panel</p>
              </div>
            )}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
