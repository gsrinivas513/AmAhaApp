import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

// MOCK DATA - REFERENCE STRUCTURE FOR DATABASE ALIGNMENT
const MOCK_STUDIES = [
  {
    id: 1,
    title: 'English Grammar Mastery',
    category: 'English',
    level: 'Intermediate',
    chapters: 12,
    rating: 4.7,
    enrolled: 3456,
    description: 'Complete guide to English grammar rules and usage',
    _isMock: true,
  },
  {
    id: 2,
    title: 'Physics Basics',
    category: 'Science',
    level: 'Beginner',
    chapters: 15,
    rating: 4.6,
    enrolled: 2890,
    description: 'Fundamental physics concepts and principles',
    _isMock: true,
  },
  {
    id: 3,
    title: 'Computer Science Fundamentals',
    category: 'Technology',
    level: 'Intermediate',
    chapters: 20,
    rating: 4.8,
    enrolled: 4567,
    description: 'Core computer science concepts and programming',
    _isMock: true,
  },
  {
    id: 4,
    title: 'Advanced Calculus',
    category: 'Math',
    level: 'Advanced',
    chapters: 18,
    rating: 4.5,
    enrolled: 1234,
    description: 'Advanced calculus techniques and applications',
    _isMock: true,
  },
];

const CATEGORIES = [
  { id: 'english', label: '📝 English', color: '#FF6B6B' },
  { id: 'science', label: '🔬 Science', color: '#4ECDC4' },
  { id: 'math', label: '📐 Math', color: '#FFE66D' },
  { id: 'tech', label: '💻 Technology', color: '#95E1D3' },
];

export default function StudiesPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { studyId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [studies, setStudies] = useState(MOCK_STUDIES);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStudies = async () => {
      try {
        setLoading(true);
        const studiesSnapshot = await getDocs(collection(db, 'studies'));
        const studiesData = studiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        if (studiesData.length > 0) {
          setStudies(studiesData);
        } else {
          setStudies(MOCK_STUDIES);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading studies:', error);
        setStudies(MOCK_STUDIES);
        setLoading(false);
      }
    };

    loadStudies();
  }, []);

  // Load specific study when studyId is in URL
  useEffect(() => {
    if (studyId && studies.length > 0) {
      const study = studies.find(s => s.id === studyId);
      if (study) {
        setSelectedStudy(study);
      }
    } else {
      setSelectedStudy(null);
    }
  }, [studyId, studies]);

  const filteredStudies = studies.filter(study => {
    const categoryMatch = selectedCategory === 'All' || study.topic === selectedCategory || study.categoryId === selectedCategory;
    return categoryMatch;
  });

  return (
    <SiteLayout>
      {/* Detail View - Show when studyId is in URL */}
      {selectedStudy && (
        <div style={{
          background: theme.background,
          minHeight: '100vh',
          padding: '40px 20px',
        }}>
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
          }}>
            {/* Back Button */}
            <button
              onClick={() => navigate('/studies')}
              style={{
                marginBottom: '24px',
                padding: '12px 24px',
                background: theme.surfaceSecondary,
                color: theme.textPrimary,
                border: `2px solid ${theme.border}`,
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.background = theme.accentPrimary;
                e.target.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.target.style.background = theme.surfaceSecondary;
                e.target.style.color = theme.textPrimary;
              }}
            >
              ← Back to Studies
            </button>

            {/* Content */}
            <div style={{
              background: theme.surfacePrimary,
              borderRadius: '16px',
              padding: '40px',
              border: `2px solid ${theme.border}`,
            }}>
              <h1 style={{
                color: theme.textPrimary,
                fontSize: '36px',
                fontWeight: '800',
                margin: '0 0 16px 0',
              }}>
                {selectedStudy.title}
              </h1>

              <p style={{
                color: theme.textSecondary,
                fontSize: '16px',
                margin: '0 0 24px 0',
                lineHeight: '1.6',
              }}>
                {selectedStudy.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px',
                marginBottom: '32px',
              }}>
                {selectedStudy.icon && (
                  <div style={{
                    background: `${theme.accentPrimary}20`,
                    padding: '20px',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>
                      {selectedStudy.icon}
                    </div>
                    <div style={{ color: theme.textSecondary, fontSize: '14px' }}>
                      Icon
                    </div>
                  </div>
                )}
                <div style={{
                  background: `${theme.accentSecondary}20`,
                  padding: '20px',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: theme.accentSecondary, marginBottom: '8px' }}>
                    {selectedStudy.difficulty}
                  </div>
                  <div style={{ color: theme.textSecondary, fontSize: '14px' }}>
                    Difficulty
                  </div>
                </div>
                {selectedStudy.topic && (
                  <div style={{
                    background: `${theme.accentPrimary}20`,
                    padding: '20px',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: theme.accentPrimary }}>
                      {selectedStudy.topic}
                    </div>
                    <div style={{ color: theme.textSecondary, fontSize: '14px' }}>
                      Topic
                    </div>
                  </div>
                )}
              </div>

              <button
                style={{
                  width: '100%',
                  padding: '16px 32px',
                  background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = `0 10px 30px ${theme.accentPrimary}50`;
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                📚 Start Studying
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Listing View - Show when no studyId */}
      {!selectedStudy && (
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
              📚 Study Guides
            </h1>
            <p style={{
              color: theme.textSecondary,
              fontSize: '18px',
              margin: '0 0 20px 0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              Master new subjects with comprehensive study materials and guides
            </p>
            <button
              onClick={() => navigate('/')}
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
              🎓 Start Learning
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
                Loading studies...
              </p>
            </div>
          )}

          {/* Filters */}
          {!loading && (
            <div style={{
              marginBottom: '40px',
            }}>
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
                  📂 Browse Categories
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
                Showing <strong style={{ color: theme.textPrimary }}>{filteredStudies.length}</strong> study guide{filteredStudies.length !== 1 ? 's' : ''}
              </div>

              {/* Studies Cards Grid */}
              {filteredStudies.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '24px',
                }}>
                  {filteredStudies.map((study) => (
                    <div
                      key={study.id}
                      onMouseEnter={() => setHoveredCard(study.id)}
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
                        transform: hoveredCard === study.id ? 'translateY(-12px)' : 'translateY(0)',
                        borderColor: hoveredCard === study.id ? theme.accentPrimary : theme.border,
                        boxShadow: hoveredCard === study.id ? `0 20px 40px ${theme.accentPrimary}25` : 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/studies/${study.categoryId}/${study.id}`)}
                    >
                      <div style={{ marginBottom: '16px' }}>
                        <h3 style={{
                          color: theme.textPrimary,
                          fontSize: '20px',
                          fontWeight: '700',
                          margin: '0 0 8px 0',
                        }}>
                          {study.title}
                        </h3>
                        <p style={{
                          color: theme.textSecondary,
                          fontSize: '14px',
                          margin: '0',
                        }}>
                          {study.description}
                        </p>
                      </div>

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
                          {study.topic}
                        </div>
                      </div>

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
                            Chapters
                          </div>
                          <div style={{
                            color: theme.textPrimary,
                            fontSize: '18px',
                            fontWeight: '700',
                          }}>
                            {study.chapters}
                          </div>
                        </div>
                        <div>
                          <div style={{
                            color: theme.textSecondary,
                            fontSize: '12px',
                            fontWeight: '500',
                            marginBottom: '4px',
                          }}>
                            Level
                          </div>
                          <div style={{
                            color: theme.textPrimary,
                            fontSize: '18px',
                            fontWeight: '700',
                          }}>
                            {study.level}
                          </div>
                        </div>
                      </div>

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
                          <span>⭐ {study.rating}</span>
                          <span>👥 {study.enrolled}</span>
                        </div>
                      </div>

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
                        Enroll Now →
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
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>📚</div>
                  <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No studies found</p>
                  <p style={{ fontSize: '15px' }}>Try adjusting your filters</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      )}
    </SiteLayout>
  );
}
