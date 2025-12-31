import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

// MOCK DATA - REFERENCE STRUCTURE FOR DATABASE ALIGNMENT
const MOCK_WORKSHEETS = [
  {
    id: 1,
    title: 'Multiplication Practice Sheet',
    category: 'Math',
    grade: '3-4',
    problems: 20,
    rating: 4.7,
    completed: 1234,
    description: 'Practice multiplication tables and basic multiplication',
    _isMock: true,
  },
  {
    id: 2,
    title: 'Phonics Exercises',
    category: 'Reading',
    grade: '1-2',
    problems: 15,
    rating: 4.6,
    completed: 2345,
    description: 'Letter sounds and phonics recognition exercises',
    _isMock: true,
  },
  {
    id: 3,
    title: 'Science Lab Report Template',
    category: 'Science',
    grade: '5-8',
    problems: 8,
    rating: 4.8,
    completed: 890,
    description: 'Guide for writing scientific lab reports',
    _isMock: true,
  },
  {
    id: 4,
    title: 'Vocabulary Building Worksheet',
    category: 'English',
    grade: '3-6',
    problems: 25,
    rating: 4.5,
    completed: 1567,
    description: 'Expand vocabulary with word meanings and usage',
    _isMock: true,
  },
];

const CATEGORIES = [
  { id: 'math', label: '📐 Math', color: '#FF6B6B' },
  { id: 'reading', label: '📖 Reading', color: '#4ECDC4' },
  { id: 'science', label: '🔬 Science', color: '#FFE66D' },
  { id: 'english', label: '📝 English', color: '#95E1D3' },
];

export default function WorksheetsPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { worksheetId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [worksheets, setWorksheets] = useState(MOCK_WORKSHEETS);
  const [selectedWS, setSelectedWS] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadWorksheets = async () => {
      try {
        setLoading(true);
        const worksheetsSnapshot = await getDocs(collection(db, 'worksheets'));
        const worksheetsData = worksheetsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        if (worksheetsData.length > 0) {
          setWorksheets(worksheetsData);
        } else {
          setWorksheets(MOCK_WORKSHEETS);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading worksheets:', error);
        setWorksheets(MOCK_WORKSHEETS);
        setLoading(false);
      }
    };

    loadWorksheets();
  }, []);

  // Load specific worksheet when worksheetId is in URL
  useEffect(() => {
    if (worksheetId && worksheets.length > 0) {
      const ws = worksheets.find(w => w.id === worksheetId);
      if (ws) {
        setSelectedWS(ws);
      }
    } else {
      setSelectedWS(null);
    }
  }, [worksheetId, worksheets]);

  const filteredWorksheets = worksheets.filter(worksheet => {
    const categoryMatch = selectedCategory === 'All' || worksheet.topic === selectedCategory || worksheet.categoryId === selectedCategory;
    return categoryMatch;
  });

  return (
    <SiteLayout>
      {/* Detail View - Show when worksheetId is in URL */}
      {selectedWS && (
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
              onClick={() => navigate('/worksheets')}
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
              ← Back to Worksheets
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
                {selectedWS.title}
              </h1>

              <p style={{
                color: theme.textSecondary,
                fontSize: '16px',
                margin: '0 0 24px 0',
                lineHeight: '1.6',
              }}>
                {selectedWS.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px',
                marginBottom: '32px',
              }}>
                {selectedWS.icon && (
                  <div style={{
                    background: `${theme.accentPrimary}20`,
                    padding: '20px',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>
                      {selectedWS.icon}
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
                    {selectedWS.difficulty}
                  </div>
                  <div style={{ color: theme.textSecondary, fontSize: '14px' }}>
                    Difficulty
                  </div>
                </div>
                {selectedWS.topic && (
                  <div style={{
                    background: `${theme.accentPrimary}20`,
                    padding: '20px',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: theme.accentPrimary }}>
                      {selectedWS.topic}
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
                📋 Start Practice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Listing View - Show when no worksheetId */}
      {!selectedWS && (
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
              📋 Practice Worksheets
            </h1>
            <p style={{
              color: theme.textSecondary,
              fontSize: '18px',
              margin: '0 0 20px 0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              Practice and reinforce your learning with interactive worksheets
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
              ✏️ Start Practice
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
                Loading worksheets...
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
                Showing <strong style={{ color: theme.textPrimary }}>{filteredWorksheets.length}</strong> worksheet{filteredWorksheets.length !== 1 ? 's' : ''}
              </div>

              {/* Worksheets Cards Grid */}
              {filteredWorksheets.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '24px',
                }}>
                  {filteredWorksheets.map((worksheet) => (
                    <div
                      key={worksheet.id}
                      onMouseEnter={() => setHoveredCard(worksheet.id)}
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
                        transform: hoveredCard === worksheet.id ? 'translateY(-12px)' : 'translateY(0)',
                        borderColor: hoveredCard === worksheet.id ? theme.accentPrimary : theme.border,
                        boxShadow: hoveredCard === worksheet.id ? `0 20px 40px ${theme.accentPrimary}25` : 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/worksheets/${worksheet.categoryId}/${worksheet.id}`)}
                    >
                      <div style={{ marginBottom: '16px' }}>
                        <h3 style={{
                          color: theme.textPrimary,
                          fontSize: '20px',
                          fontWeight: '700',
                          margin: '0 0 8px 0',
                        }}>
                          {worksheet.title}
                        </h3>
                        <p style={{
                          color: theme.textSecondary,
                          fontSize: '14px',
                          margin: '0',
                        }}>
                          {worksheet.description}
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
                          {worksheet.topic}
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
                            Grade
                          </div>
                          <div style={{
                            color: theme.textPrimary,
                            fontSize: '18px',
                            fontWeight: '700',
                          }}>
                            {worksheet.grade}
                          </div>
                        </div>
                        <div>
                          <div style={{
                            color: theme.textSecondary,
                            fontSize: '12px',
                            fontWeight: '500',
                            marginBottom: '4px',
                          }}>
                            Problems
                          </div>
                          <div style={{
                            color: theme.textPrimary,
                            fontSize: '18px',
                            fontWeight: '700',
                          }}>
                            {worksheet.problems}
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
                          <span>⭐ {worksheet.rating}</span>
                          <span>✓ {worksheet.completed}</span>
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
                        Start Worksheet →
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
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
                  <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No worksheets found</p>
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
