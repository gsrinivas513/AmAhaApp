import React, { useState, useEffect } from 'react';
import { getAllPublishedStories, getUserStories, getStoriesByCategory } from '../services/storyService';
import { StoryCard } from '../components/StoryCard';
import '../styles/story.css';

export function StoriesPage({ userId, onSelectStory }) {
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
      <div className="page-header">
        <h1>📚 Learning Stories</h1>
        <p>Choose a story and embark on an educational journey!</p>
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <label>Status:</label>
          <div className="filter-buttons">
            {['all', 'started', 'completed'].map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All Stories' : f === 'started' ? 'In Progress' : 'Completed'}
              </button>
            ))}
          </div>
        </div>

        {categories.length > 0 && (
          <div className="filter-group">
            <label>Category:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${category === 'all' ? 'active' : ''}`}
                onClick={() => setCategory('all')}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          Loading stories...
        </div>
      ) : filteredStories.length === 0 ? (
        <div className="empty-state">
          <p>📭 No stories found</p>
          {filter !== 'all' && (
            <button onClick={() => setFilter('all')} className="btn btn-primary">
              Browse All Stories
            </button>
          )}
        </div>
      ) : (
        <div className="stories-grid">
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
  );
}

export default StoriesPage;
