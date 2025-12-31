import React, { useEffect, useState } from 'react';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

function CollectionsPage() {
  const { theme } = useTheme();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      // Fetch collections from Firebase
      const collectionsRef = collection(db, 'collections');
      const snapshot = await getDocs(collectionsRef);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCollections(data.slice(0, 12)); // Show first 12 for demo
    } catch (error) {
      console.error('Error fetching collections:', error);
      // Demo data if Firebase fails
      setCollections(generateDemoCollections());
    } finally {
      setLoading(false);
    }
  };

  const generateDemoCollections = () => [
    {
      id: '1',
      name: 'Brain Teasers 101',
      description: 'Classic riddles and logic puzzles to sharpen your mind',
      itemCount: 24,
      difficulty: 'Medium',
      icon: '🧠',
      color: '#FF6B6B',
      followers: 2145,
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Math Mastery',
      description: 'Advanced mathematical puzzles and challenges',
      itemCount: 18,
      difficulty: 'Hard',
      icon: '🔢',
      color: '#4ECDC4',
      followers: 1876,
      rating: 4.9,
    },
    {
      id: '3',
      name: 'Visual Wonders',
      description: 'Optical illusions and visual puzzles',
      itemCount: 32,
      difficulty: 'Easy',
      icon: '👁️',
      color: '#95E1D3',
      followers: 3421,
      rating: 4.7,
    },
    {
      id: '4',
      name: 'Word Play Mastery',
      description: 'Anagrams, word puzzles, and language challenges',
      itemCount: 28,
      difficulty: 'Medium',
      icon: '📝',
      color: '#F38181',
      followers: 2567,
      rating: 4.6,
    },
    {
      id: '5',
      name: 'Logic Grid Challenges',
      description: 'Complex logic grids and deduction puzzles',
      itemCount: 15,
      difficulty: 'Hard',
      icon: '🔳',
      color: '#AA96DA',
      followers: 1234,
      rating: 4.9,
    },
    {
      id: '6',
      name: 'Kids Puzzle Fun',
      description: 'Fun and educational puzzles for children',
      itemCount: 45,
      difficulty: 'Easy',
      icon: '🎮',
      color: '#FCBAD3',
      followers: 4567,
      rating: 4.8,
    },
    {
      id: '7',
      name: 'Lateral Thinking',
      description: 'Creative problem-solving and thinking outside the box',
      itemCount: 22,
      difficulty: 'Medium',
      icon: '💡',
      color: '#FFFFD2',
      followers: 1890,
      rating: 4.7,
    },
    {
      id: '8',
      name: 'Pattern Recognition',
      description: 'Spot patterns and sequences in visual and numeric data',
      itemCount: 20,
      difficulty: 'Medium',
      icon: '🎯',
      color: '#A8D8EA',
      followers: 2109,
      rating: 4.8,
    },
    {
      id: '9',
      name: 'Spatial Reasoning',
      description: '3D visualization and spatial thinking challenges',
      itemCount: 26,
      difficulty: 'Hard',
      icon: '🎲',
      color: '#FF8B94',
      followers: 1654,
      rating: 4.6,
    },
    {
      id: '10',
      name: 'Mystery & Detective',
      description: 'Solve mysterious cases through clues and deduction',
      itemCount: 19,
      difficulty: 'Medium',
      icon: '🔍',
      color: '#B4A7D6',
      followers: 2876,
      rating: 4.8,
    },
    {
      id: '11',
      name: 'Speed Challenges',
      description: 'Quick-fire puzzles to test your speed and accuracy',
      itemCount: 35,
      difficulty: 'Easy',
      icon: '⚡',
      color: '#FFD93D',
      followers: 3245,
      rating: 4.7,
    },
    {
      id: '12',
      name: 'Strategy Games',
      description: 'Strategic thinking and game theory puzzles',
      itemCount: 17,
      difficulty: 'Hard',
      icon: '♟️',
      color: '#6BCB77',
      followers: 1432,
      rating: 4.9,
    },
  ];

  const filteredCollections =
    filterType === 'all'
      ? collections
      : collections.filter((c) => c.difficulty === filterType);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return theme.accentTertiary;
      case 'Medium':
        return theme.accentSecondary;
      case 'Hard':
        return theme.accentPrimary;
      default:
        return theme.accentPrimary;
    }
  };

  return (
    <SiteLayout>
      <div style={{ background: theme.background, minHeight: '100vh', paddingTop: '40px' }}>
        {/* Hero Section */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 20px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: '800',
              color: theme.textPrimary,
              marginBottom: '16px',
            }}
          >
            📚 Collections
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: theme.textSecondary,
              maxWidth: '600px',
              margin: '0 auto 40px',
              lineHeight: '1.6',
            }}
          >
            Curated collections of puzzles, quizzes, and learning materials organized by topic and difficulty.
          </p>
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px 40px',
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {['all', 'Easy', 'Medium', 'Hard'].map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterType(filter)}
              style={{
                padding: '10px 24px',
                border: filterType === filter ? 'none' : `1px solid ${theme.border}`,
                background:
                  filterType === filter
                    ? theme.accentPrimary
                    : 'transparent',
                color:
                  filterType === filter
                    ? theme.background
                    : theme.textPrimary,
                borderRadius: '24px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (filterType !== filter) {
                  e.target.style.background = theme.surfaceSecondary;
                }
              }}
              onMouseLeave={(e) => {
                if (filterType !== filter) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              {filter === 'all' ? '🌟 All Collections' : filter}
            </button>
          ))}
        </div>

        {/* Collections Grid */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px 80px',
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ color: theme.textSecondary }}>Loading collections...</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
              }}
            >
              {filteredCollections.map((collection) => (
                <div
                  key={collection.id}
                  style={{
                    padding: '24px',
                    background: theme.surfacePrimary,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = `0 16px 32px ${collection.color}20`;
                    e.currentTarget.style.borderColor = collection.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = theme.border;
                  }}
                >
                  {/* Decorative Background */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-50%',
                      right: '-50%',
                      width: '200px',
                      height: '200px',
                      background: `radial-gradient(circle, ${collection.color}15, transparent)`,
                      pointerEvents: 'none',
                    }}
                  />

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '40px',
                        }}
                      >
                        {collection.icon}
                      </div>
                      <span
                        style={{
                          padding: '6px 12px',
                          background: getDifficultyColor(collection.difficulty),
                          color: theme.background,
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                        }}
                      >
                        {collection.difficulty}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: theme.textPrimary,
                        marginBottom: '8px',
                      }}
                    >
                      {collection.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '13px',
                        color: theme.textSecondary,
                        lineHeight: '1.5',
                        marginBottom: '20px',
                        minHeight: '36px',
                      }}
                    >
                      {collection.description}
                    </p>

                    {/* Stats */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '16px',
                        marginBottom: '16px',
                        paddingBottom: '16px',
                        borderBottom: `1px solid ${theme.border}`,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: theme.textSecondary,
                            marginBottom: '4px',
                          }}
                        >
                          Items
                        </div>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: theme.accentPrimary,
                          }}
                        >
                          {collection.itemCount}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: theme.textSecondary,
                            marginBottom: '4px',
                          }}
                        >
                          Rating
                        </div>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: theme.accentSecondary,
                          }}
                        >
                          ⭐ {collection.rating}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: theme.textSecondary,
                            marginBottom: '4px',
                          }}
                        >
                          Followers
                        </div>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: theme.accentTertiary,
                          }}
                        >
                          {(collection.followers / 1000).toFixed(1)}K
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                      }}
                    >
                      <button
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: collection.color,
                          color: theme.background,
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
                        onMouseLeave={(e) => (e.target.style.opacity = '1')}
                      >
                        Explore →
                      </button>
                      <button
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: 'transparent',
                          color: theme.accentPrimary,
                          border: `1px solid ${theme.accentPrimary}`,
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = theme.accentPrimary;
                          e.target.style.color = theme.background;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = theme.accentPrimary;
                        }}
                      >
                        ♡ Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto 60px',
            padding: '40px',
            background: `linear-gradient(135deg, ${theme.accentPrimary}15, ${theme.accentSecondary}15)`,
            borderRadius: '16px',
            border: `1px solid ${theme.accentPrimary}30`,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: theme.textPrimary,
              marginBottom: '12px',
            }}
          >
            Create Your Own Collection
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: theme.textSecondary,
              marginBottom: '20px',
            }}
          >
            Organize your favorite puzzles and quizzes into custom collections.
          </p>
          <button
            style={{
              padding: '12px 32px',
              background: theme.accentPrimary,
              color: theme.background,
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            + New Collection
          </button>
        </div>
      </div>
    </SiteLayout>
  );
}

export default CollectionsPage;
