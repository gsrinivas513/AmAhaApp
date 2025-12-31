import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

// MOCK DATA - REFERENCE STRUCTURE FOR DATABASE ALIGNMENT
// This is our reference design. Real data should match this structure.
const MOCK_ARTS = [
  {
    id: 1,
    title: 'Basic Drawing Techniques',
    category: 'Drawing',
    difficulty: 'Beginner',
    duration: '15 min',
    rating: 4.7,
    views: 1234,
    description: 'Learn fundamental drawing techniques and principles',
    _isMock: true,
  },
  {
    id: 2,
    title: 'Watercolor Painting',
    category: 'Painting',
    difficulty: 'Intermediate',
    duration: '20 min',
    rating: 4.6,
    views: 890,
    description: 'Master watercolor techniques and color mixing',
    _isMock: true,
  },
  {
    id: 3,
    title: 'Digital Art Basics',
    category: 'Digital Art',
    difficulty: 'Beginner',
    duration: '25 min',
    rating: 4.8,
    views: 2145,
    description: 'Get started with digital art tools and techniques',
    _isMock: true,
  },
  {
    id: 4,
    title: 'Sculpture Fundamentals',
    category: 'Sculpture',
    difficulty: 'Intermediate',
    duration: '30 min',
    rating: 4.5,
    views: 567,
    description: 'Explore 3D sculpture techniques and materials',
    _isMock: true,
  },
];

const CATEGORIES = [
  { id: 'drawing', label: '✏️ Drawing', color: '#FF6B6B' },
  { id: 'painting', label: '🎨 Painting', color: '#4ECDC4' },
  { id: 'digital', label: '💻 Digital Art', color: '#FFE66D' },
  { id: 'sculpture', label: '🗿 Sculpture', color: '#95E1D3' },
];

export default function ArtsPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { artId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [arts, setArts] = useState(MOCK_ARTS);
  const [selectedArt, setSelectedArt] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load real arts data from Firestore
  useEffect(() => {
    const loadArts = async () => {
      try {
        setLoading(true);
        const artsSnapshot = await getDocs(collection(db, 'arts'));
        const artsData = artsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        if (artsData.length > 0) {
          setArts(artsData);
        } else {
          // Fall back to mock if no real data
          setArts(MOCK_ARTS);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading arts:', error);
        setArts(MOCK_ARTS);
        setLoading(false);
      }
    };

    loadArts();
  }, []);

  // Load specific art item when artId is in URL
  useEffect(() => {
    if (artId && arts.length > 0) {
      const art = arts.find(a => a.id === artId);
      if (art) {
        setSelectedArt(art);
      }
    } else {
      setSelectedArt(null);
    }
  }, [artId, arts]);

  const filteredArts = arts.filter(art => {
    const categoryMatch = selectedCategory === 'All' || art.topic === selectedCategory || art.categoryId === selectedCategory;
    return categoryMatch;
  });

  return (
    <SiteLayout>
      {/* Detail View - Show when artId is in URL */}
      {selectedArt && (
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
              onClick={() => navigate('/arts')}
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
              ← Back to Arts
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
                {selectedArt.title}
              </h1>

              <p style={{
                color: theme.textSecondary,
                fontSize: '16px',
                margin: '0 0 24px 0',
                lineHeight: '1.6',
              }}>
                {selectedArt.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px',
                marginBottom: '32px',
              }}>
                {selectedArt.icon && (
                  <div style={{
                    background: `${theme.accentPrimary}20`,
                    padding: '20px',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>
                      {selectedArt.icon}
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
                    {selectedArt.difficulty}
                  </div>
                  <div style={{ color: theme.textSecondary, fontSize: '14px' }}>
                    Difficulty
                  </div>
                </div>
                {selectedArt.topic && (
                  <div style={{
                    background: `${theme.accentPrimary}20`,
                    padding: '20px',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: theme.accentPrimary }}>
                      {selectedArt.topic}
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
                🎨 Start Learning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Listing View - Show when no artId */}
      {!selectedArt && (
        <div style={{
          background: theme.background,
          minHeight: '100vh',
          padding: '40px 20px',
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
          }}>
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
              🎨 Arts Gallery
            </h1>
            <p style={{
              color: theme.textSecondary,
              fontSize: '18px',
              margin: '0 0 20px 0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              Explore and learn various art forms from drawing to sculpture!
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
              ✨ Create Art
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
                Loading arts...
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
                Showing <strong style={{ color: theme.textPrimary }}>{filteredArts.length}</strong> art{filteredArts.length !== 1 ? 's' : ''}
              </div>

              {/* Arts Cards Grid */}
              {filteredArts.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '24px',
                }}>
                  {filteredArts.map((art) => (
                    <div
                      key={art.id}
                      onMouseEnter={() => setHoveredCard(art.id)}
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
                        transform: hoveredCard === art.id ? 'translateY(-12px)' : 'translateY(0)',
                        borderColor: hoveredCard === art.id ? theme.accentPrimary : theme.border,
                        boxShadow: hoveredCard === art.id ? `0 20px 40px ${theme.accentPrimary}25` : 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/arts/${art.categoryId}/${art.id}`)}
                    >
                      <div style={{ marginBottom: '16px' }}>
                        <h3 style={{
                          color: theme.textPrimary,
                          fontSize: '20px',
                          fontWeight: '700',
                          margin: '0 0 8px 0',
                        }}>
                          {art.title}
                        </h3>
                        <p style={{
                          color: theme.textSecondary,
                          fontSize: '14px',
                          margin: '0',
                        }}>
                          {art.description}
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
                          {art.topic}
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
                            Level
                          </div>
                          <div style={{
                            color: theme.textPrimary,
                            fontSize: '18px',
                            fontWeight: '700',
                          }}>
                            {art.difficulty}
                          </div>
                        </div>
                        <div>
                          <div style={{
                            color: theme.textSecondary,
                            fontSize: '12px',
                            fontWeight: '500',
                            marginBottom: '4px',
                          }}>
                            Duration
                          </div>
                          <div style={{
                            color: theme.textPrimary,
                            fontSize: '18px',
                            fontWeight: '700',
                          }}>
                            {art.duration}
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
                          <span>⭐ {art.rating}</span>
                          <span>👁️ {art.views}</span>
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
                        Explore →
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
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎨</div>
                  <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No arts found</p>
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
