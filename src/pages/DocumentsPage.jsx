import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

// MOCK DATA - REFERENCE STRUCTURE FOR DATABASE ALIGNMENT
const MOCK_DOCUMENTS = [
  {
    id: 1,
    title: 'Introduction to Biology',
    category: 'Science',
    pages: 45,
    rating: 4.7,
    downloads: 2345,
    description: 'Comprehensive guide to biological concepts',
    _isMock: true,
  },
  {
    id: 2,
    title: 'Mathematics Fundamentals',
    category: 'Math',
    pages: 78,
    rating: 4.6,
    downloads: 1890,
    description: 'Essential math concepts and formulas',
    _isMock: true,
  },
  {
    id: 3,
    title: 'World History Timeline',
    category: 'History',
    pages: 92,
    rating: 4.8,
    downloads: 3456,
    description: 'Complete historical events and timeline',
    _isMock: true,
  },
  {
    id: 4,
    title: 'Chemistry Lab Guide',
    category: 'Science',
    pages: 56,
    rating: 4.5,
    downloads: 1234,
    description: 'Laboratory procedures and safety',
    _isMock: true,
  },
];

const CATEGORIES = [
  { id: 'science', label: '🔬 Science', color: '#FF6B6B' },
  { id: 'math', label: '📐 Math', color: '#4ECDC4' },
  { id: 'history', label: '🏛️ History', color: '#FFE66D' },
  { id: 'literature', label: '📚 Literature', color: '#C7CEEA' },
];

export default function DocumentsPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { documentId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        const docsSnapshot = await getDocs(collection(db, 'documents'));
        const docsData = docsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        if (docsData.length > 0) {
          setDocuments(docsData);
        } else {
          setDocuments(MOCK_DOCUMENTS);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading documents:', error);
        setDocuments(MOCK_DOCUMENTS);
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  // Load specific document when documentId is in URL
  useEffect(() => {
    if (documentId && documents.length > 0) {
      const doc = documents.find(d => d.id === documentId);
      if (doc) {
        setSelectedDoc(doc);
      }
    } else {
      setSelectedDoc(null);
    }
  }, [documentId, documents]);

  const filteredDocuments = documents.filter(doc => {
    const categoryMatch = selectedCategory === 'All' || doc.topic === selectedCategory || doc.categoryId === selectedCategory;
    return categoryMatch;
  });

  return (
    <SiteLayout>
      {/* Detail View - Show when documentId is in URL */}
      {selectedDoc && (
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
              onClick={() => navigate('/documents')}
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
              ← Back to Documents
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
                {selectedDoc.title}
              </h1>

              <p style={{
                color: theme.textSecondary,
                fontSize: '16px',
                margin: '0 0 24px 0',
                lineHeight: '1.6',
              }}>
                {selectedDoc.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px',
                marginBottom: '32px',
              }}>
                {selectedDoc.icon && (
                  <div style={{
                    background: `${theme.accentPrimary}20`,
                    padding: '20px',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>
                      {selectedDoc.icon}
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
                    {selectedDoc.difficulty}
                  </div>
                  <div style={{ color: theme.textSecondary, fontSize: '14px' }}>
                    Difficulty
                  </div>
                </div>
                {selectedDoc.topic && (
                  <div style={{
                    background: `${theme.accentPrimary}20`,
                    padding: '20px',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: theme.accentPrimary }}>
                      {selectedDoc.topic}
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
                📄 Start Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Listing View - Show when no documentId */}
      {!selectedDoc && (
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
              📄 Learning Documents
            </h1>
            <p style={{
              color: theme.textSecondary,
              fontSize: '18px',
              margin: '0 0 20px 0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              Access comprehensive study documents across multiple subjects
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
              📥 Download
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
                Loading documents...
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
                Showing <strong style={{ color: theme.textPrimary }}>{filteredDocuments.length}</strong> document{filteredDocuments.length !== 1 ? 's' : ''}
              </div>

              {/* Documents Cards Grid */}
              {filteredDocuments.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '24px',
                }}>
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      onMouseEnter={() => setHoveredCard(doc.id)}
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
                        transform: hoveredCard === doc.id ? 'translateY(-12px)' : 'translateY(0)',
                        borderColor: hoveredCard === doc.id ? theme.accentPrimary : theme.border,
                        boxShadow: hoveredCard === doc.id ? `0 20px 40px ${theme.accentPrimary}25` : 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/documents/${doc.categoryId}/${doc.id}`)}
                    >
                      <div style={{ marginBottom: '16px' }}>
                        <h3 style={{
                          color: theme.textPrimary,
                          fontSize: '20px',
                          fontWeight: '700',
                          margin: '0 0 8px 0',
                        }}>
                          {doc.title}
                        </h3>
                        <p style={{
                          color: theme.textSecondary,
                          fontSize: '14px',
                          margin: '0',
                        }}>
                          {doc.description}
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
                          {doc.topic}
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
                            Pages
                          </div>
                          <div style={{
                            color: theme.textPrimary,
                            fontSize: '18px',
                            fontWeight: '700',
                          }}>
                            {doc.pages}
                          </div>
                        </div>
                        <div>
                          <div style={{
                            color: theme.textSecondary,
                            fontSize: '12px',
                            fontWeight: '500',
                            marginBottom: '4px',
                          }}>
                            Rating
                          </div>
                          <div style={{
                            color: theme.textPrimary,
                            fontSize: '18px',
                            fontWeight: '700',
                          }}>
                            ⭐ {doc.rating}
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
                          <span>📥 {doc.downloads}</span>
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
                        Read Document →
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
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>📄</div>
                  <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No documents found</p>
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
