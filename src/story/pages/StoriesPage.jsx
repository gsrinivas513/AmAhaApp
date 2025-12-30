import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPublishedStories, getUserStories, getStoriesByCategory } from '../services/storyService';
import { StoryCard } from '../components/StoryCard';
import { HeroSection, CTASection } from '../../design/DesignSystem';
import '../styles/story.css';

export function StoriesPage({ userId, onSelectStory }) {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, started, completed
  const [category, setCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadStories();
  }, [userId, filter, category]);

  async function loadStories() {
    try {
      setLoading(true);
      let allStories = [];

      if (category !== 'all') {
        allStories = await getStoriesByCategory(category);
      } else {
        allStories = await getAllPublishedStories();
      }

      const progress = await getUserStories(userId);
      const progressMap = {};
      progress.forEach(p => {
        progressMap[p.storyId] = p;
      });

      setStories(allStories);
      setUserProgress(progressMap);

      // Extract unique categories
      const uniqueCategories = [...new Set(allStories.map(s => s.category))];
      setCategories(uniqueCategories.filter(Boolean));
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredStories = stories.filter(story => {
    if (filter === 'started') {
      return userProgress[story.id]?.startedAt && !userProgress[story.id]?.completedAt;
    }
    if (filter === 'completed') {
      return userProgress[story.id]?.completedAt;
    }
    return true;
  });

  return (
    <div className="stories-page">
      <HeroSection
        title="Discover Learning Stories"
        subtitle="Dive into engaging stories that teach while they entertain. Perfect for learners of all ages."
        backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        primaryCta={{
          label: "📖 Start Reading",
          onClick: () => {
            if (filteredStories.length > 0) {
              onSelectStory(filteredStories[0].id, 'start');
            }
          }
        }}
        secondaryCta={{
          label: "🎯 Browse All",
          onClick: () => setFilter('all')
        }}
      />

      <div style={{
        maxWidth: "1200px",
        margin: "60px auto",
        padding: "0 20px"
      }}>
        <div className="filter-section">
          <h2 style={{
            fontSize: "1.8rem",
            fontWeight: 700,
            marginBottom: 24,
            color: "#1f2937"
          }}>
            🎓 Explore Stories
          </h2>

          <div className="filter-group">
            <label style={{ fontWeight: 600, marginBottom: 12, display: 'block' }}>Status:</label>
            <div className="filter-buttons" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['all', 'started', 'completed'].map(f => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    background: filter === f ? '#667eea' : '#f3f4f6',
                    color: filter === f ? 'white' : '#6b7280',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {f === 'all' ? 'All Stories' : f === 'started' ? 'In Progress' : 'Completed'}
                </button>
              ))}
            </div>
          </div>

          {categories.length > 0 && (
            <div className="filter-group" style={{ marginTop: 20 }}>
              <label style={{ fontWeight: 600, marginBottom: 12, display: 'block' }}>Category:</label>
              <div className="filter-buttons" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  className={`filter-btn ${category === 'all' ? 'active' : ''}`}
                  onClick={() => setCategory('all')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    background: category === 'all' ? '#667eea' : '#f3f4f6',
                    color: category === 'all' ? 'white' : '#6b7280',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`filter-btn ${category === cat ? 'active' : ''}`}
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      background: category === cat ? '#667eea' : '#f3f4f6',
                      color: category === cat ? 'white' : '#6b7280',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading" style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
            Loading stories...
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="empty-state" style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6b7280'
          }}>
            <p style={{ fontSize: '1.2rem', marginBottom: 20 }}>📭 No stories found</p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                style={{
                  padding: '10px 20px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Browse All Stories
              </button>
            )}
          </div>
        ) : (
          <div className="stories-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 20,
            marginTop: 30
          }}>
            {filteredStories.map(story => (
              <StoryCard
                key={story.id}
                story={story}
                progress={userProgress[story.id]}
                onStart={() => onSelectStory(story.id, 'start')}
                onContinue={() => onSelectStory(story.id, 'continue')}
                onView={() => onSelectStory(story.id, 'view')}
              />
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <CTASection
        title="Ready to Learn?"
        subtitle="Choose a story and start your educational adventure today"
        primaryCta={{
          label: "🚀 Start Story",
          onClick: () => {
            if (filteredStories.length > 0) {
              onSelectStory(filteredStories[0].id, 'start');
            }
          }
        }}
        secondaryCta={{
          label: "🎮 Back to Puzzles",
          onClick: () => navigate("/puzzle")
        }}
      />
    </div>
  );
}

export default StoriesPage;
