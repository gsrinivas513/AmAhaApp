/**
 * StoryMapCard.jsx
 * 
 * Displays a single story for the story selection screen
 * Shows:
 * - Story cover image
 * - Title and description
 * - Chapter progress
 * - CTA to continue/start
 */

import React, { useState, useEffect } from 'react';
import { getStoryProgress } from '../../services/storyService';
import { auth } from '../../firebase/firebaseConfig';
import './StoryMapCard.css';

export default function StoryMapCard({ story, onSelectStory }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const loadProgress = async () => {
      if (user && story) {
        try {
          const userProgress = await getStoryProgress(user.uid, story.id);
          setProgress(userProgress);
        } catch (error) {
          console.error('Error loading story progress:', error);
        }
      }
      setLoading(false);
    };

    loadProgress();
  }, [user, story]);

  if (!story) return null;

  const completedChapters = progress?.completedChapters?.length || 0;
  const totalChapters = story.chapterCount || 0;
  const progressPercent = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
  const isStarted = completedChapters > 0;
  const isCompleted = completedChapters === totalChapters && totalChapters > 0;

  return (
    <div className="story-map-card" onClick={() => onSelectStory(story)}>
      <div className="story-image-container">
        {story.coverImage && (
          <img src={story.coverImage} alt={story.title} className="story-image" />
        )}
        {!story.coverImage && (
          <div className="story-image-placeholder">
            📖
          </div>
        )}

        {isCompleted && (
          <div className="completed-badge">
            ✨ Completed!
          </div>
        )}

        {isStarted && !isCompleted && (
          <div className="in-progress-badge">
            📖 In Progress
          </div>
        )}
      </div>

      <div className="story-content">
        <h3 className="story-title">{story.title}</h3>

        {story.description && (
          <p className="story-description">{story.description}</p>
        )}

        <div className="story-stats">
          <div className="stat-item">
            <span className="stat-icon">📚</span>
            <span className="stat-text">{totalChapters} Chapters</span>
          </div>
          {isStarted && (
            <div className="stat-item">
              <span className="stat-icon">✅</span>
              <span className="stat-text">{completedChapters}/{totalChapters}</span>
            </div>
          )}
        </div>

        {isStarted && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        )}

        <button className="story-cta">
          {isCompleted ? '🔄 Replay' : isStarted ? '▶️ Continue' : '▶️ Start Story'}
        </button>
      </div>
    </div>
  );
}
