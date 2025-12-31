import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';

export default function StoriesPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

  const FILTERS = [
    { value: 'all', label: 'All Stories' },
    { value: 'in-progress', label: '📖 In Progress' },
    { value: 'completed', label: '✅ Completed' },
    { value: 'not-started', label: '🆕 Not Started' },
  ];

  const AUDIENCES = [
    { value: 'all', label: '👥 All Users', emoji: '👥' },
    { value: 'kids', label: '👶 Kids (5-12)', emoji: '👶' },
    { value: 'students', label: '📚 Students (13-18)', emoji: '📚' },
    { value: 'professionals', label: '💼 Professionals', emoji: '💼' },
    { value: 'programmers', label: '💻 Programmers', emoji: '💻' },
  ];

  const STORY_CATEGORIES = [
    { id: 'adventure', label: '🏃 Adventure', color: '#FF6B6B' },
    { id: 'mystery', label: '🔍 Mystery', color: '#4ECDC4' },
    { id: 'science', label: '🚀 Science', color: '#FFE66D' },
    { id: 'fantasy', label: '✨ Fantasy', color: '#95E1D3' },
    { id: 'history', label: '📚 History', color: '#C7CEEA' },
    { id: 'educational', label: '🎓 Educational', color: '#FF85A2' },
  ];

  const FEATURED_STORIES = [
    {
      id: 1,
      title: 'The Lost Kingdom Chronicles',
      category: 'Adventure',
      audience: 'students',
      chapters: 12,
      progress: 8,
      status: 'in-progress',
      rating: 4.8,
      reads: 3421,
      description: 'Embark on an epic quest to discover a legendary lost kingdom',
      difficulty: 'Medium',
      duration: '8-10 hours',
    },
    {
      id: 2,
      title: 'Mystery of the Silent Garden',
      category: 'Mystery',
      audience: 'students',
      chapters: 10,
      progress: 0,
      status: 'not-started',
      rating: 4.7,
      reads: 2156,
      description: 'Solve the secrets hidden in an ancient enchanted garden',
      difficulty: 'Medium',
      duration: '6-8 hours',
    },
    {
      id: 3,
      title: 'Journey Through Space',
      category: 'Science',
      audience: 'kids',
      chapters: 15,
      progress: 15,
      status: 'completed',
      rating: 4.9,
      reads: 5234,
      description: 'Travel across galaxies and discover new worlds',
      difficulty: 'Easy',
      duration: '10-12 hours',
    },
    {
      id: 4,
      title: 'Dragons of the North',
      category: 'Fantasy',
      audience: 'students',
      chapters: 14,
      progress: 5,
      status: 'in-progress',
      rating: 4.6,
      reads: 2987,
      description: 'Witness the rise of dragon riders and ancient magic',
      difficulty: 'Hard',
      duration: '12-14 hours',
    },
    {
      id: 5,
      title: 'The Code Breaker\'s Tale',
      category: 'History',
      audience: 'professionals',
      chapters: 9,
      progress: 0,
      status: 'not-started',
      rating: 4.5,
      reads: 1843,
      description: 'A historical journey through cryptography and espionage',
      difficulty: 'Medium',
      duration: '5-7 hours',
    },
    {
      id: 6,
      title: 'Learning with Luna',
      category: 'Educational',
      audience: 'kids',
      chapters: 20,
      progress: 20,
      status: 'completed',
      rating: 4.8,
      reads: 4156,
      description: 'Fun educational stories perfect for learners of all ages',
      difficulty: 'Easy',
      duration: '15-18 hours',
    },
    {
      id: 7,
      title: 'Secrets of Ancient Egypt',
      category: 'History',
      audience: 'professionals',
      chapters: 11,
      progress: 3,
      status: 'in-progress',
      rating: 4.7,
      reads: 3421,
      description: 'Explore the mysteries of pharaohs and ancient civilizations',
      difficulty: 'Medium',
      duration: '8-10 hours',
    },
    {
      id: 8,
      title: 'The Quantum Paradox',
      category: 'Science',
      audience: 'programmers',
      chapters: 16,
      progress: 0,
      status: 'not-started',
      rating: 4.6,
      reads: 2234,
      description: 'A mind-bending science fiction adventure through time and space',
      difficulty: 'Hard',
      duration: '14-16 hours',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'in-progress': '#FFB627',
      'completed': '#4ECB71',
      'not-started': '#9B9B9B',
    };
    return colors[status] || theme.textSecondary;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: '#4ECB71',
      Medium: '#FFB627',
      Hard: '#FF6B6B',
    };
    return colors[difficulty] || theme.textSecondary;
  };

  const filteredStories = FEATURED_STORIES.filter(story => {
    let statusMatch = true;
    if (selectedFilter === 'all') statusMatch = true;
    else if (selectedFilter === 'in-progress') statusMatch = story.progress > 0 && story.progress < story.chapters;
    else if (selectedFilter === 'completed') statusMatch = story.progress === story.chapters;
    else if (selectedFilter === 'not-started') statusMatch = story.progress === 0;
    
    const audienceMatch = selectedAudience === 'all' || story.audience === selectedAudience;
    return statusMatch && audienceMatch;
  });

  const getProgressPercentage = (story) => {
    return Math.round((story.progress / story.chapters) * 100);
  };

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
              📖 Story Library
            </h1>
            <p style={{
              color: theme.textSecondary,
              fontSize: '18px',
              margin: '0 0 20px 0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              Dive into immersive stories and interactive learning experiences. Read, explore, and discover new worlds!
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
              📖 Start Reading
            </button>
          </div>

          {/* Filter Section */}
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

            {/* Progress Filter */}
            <div>
              <h3 style={{
                color: theme.textPrimary,
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '16px',
              }}>
                🎯 Filter by Progress
              </h3>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
              }}>
              {FILTERS.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  style={{
                    padding: '12px 24px',
                    background: selectedFilter === filter.value ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})` : theme.surfaceSecondary,
                    color: selectedFilter === filter.value ? '#fff' : theme.textPrimary,
                    border: `2px solid ${selectedFilter === filter.value ? 'transparent' : theme.border}`,
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    if (selectedFilter !== filter.value) {
                      e.target.style.borderColor = theme.accentPrimary;
                      e.target.style.background = `${theme.accentPrimary}15`;
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedFilter !== filter.value) {
                      e.target.style.borderColor = theme.border;
                      e.target.style.background = theme.surfaceSecondary;
                    }
                  }}
                >
                  {filter.label}
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
            Showing <strong style={{ color: theme.textPrimary }}>{filteredStories.length}</strong> stor{filteredStories.length !== 1 ? 'ies' : 'y'}
          </div>

          {/* Stories Grid */}
          {filteredStories.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}>
              {filteredStories.map((story) => (
                <div
                  key={story.id}
                  onMouseEnter={() => setHoveredCard(story.id)}
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
                    transform: hoveredCard === story.id ? 'translateY(-12px)' : 'translateY(0)',
                    borderColor: hoveredCard === story.id ? theme.accentPrimary : theme.border,
                    boxShadow: hoveredCard === story.id ? `0 20px 40px ${theme.accentPrimary}25` : 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/story/${story.id}`)}
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
                      {story.title}
                    </h3>
                    <p style={{
                      color: theme.textSecondary,
                      fontSize: '14px',
                      margin: '0',
                      lineHeight: '1.4',
                    }}>
                      {story.description}
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
                      {story.category}
                    </div>
                    <div style={{
                      background: `${getStatusColor(story.status)}20`,
                      color: getStatusColor(story.status),
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}>
                      {story.status === 'in-progress' ? '📖 In Progress' : story.status === 'completed' ? '✅ Completed' : '🆕 Not Started'}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {story.status === 'in-progress' && (
                    <div style={{
                      marginBottom: '16px',
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                        fontSize: '12px',
                        color: theme.textSecondary,
                      }}>
                        <span>Progress</span>
                        <span>{getProgressPercentage(story)}%</span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        background: theme.surfaceSecondary,
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${getProgressPercentage(story)}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                          transition: 'width 0.3s ease',
                        }}></div>
                      </div>
                    </div>
                  )}

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
                        Chapters
                      </div>
                      <div style={{
                        color: theme.textPrimary,
                        fontSize: '18px',
                        fontWeight: '700',
                      }}>
                        {story.chapters}
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
                        fontSize: '11px',
                        fontWeight: '700',
                      }}>
                        {story.duration}
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
                        ⭐ {story.rating}
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
                    <span style={{
                      fontSize: '13px',
                      color: theme.textSecondary,
                    }}>
                      📖 {story.reads} reads
                    </span>
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
                    {story.status === 'in-progress' ? '📖 Continue' : story.status === 'completed' ? '🔄 Reread' : '📖 Start'} →
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
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📖</div>
              <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No stories found</p>
              <p style={{ fontSize: '15px' }}>Check other filters to discover more stories!</p>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
