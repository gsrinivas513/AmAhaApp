/**
 * StoryDetailPage.jsx
 * 
 * Displays a single story with chapters
 * User can read chapters and track progress
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import SiteLayout from '../layouts/SiteLayout';
import {
  getStory,
  getChapters,
  getStoryProgress,
  completeChapter
} from '../services/storyService';
import '../styles/StoryDetailPage.css';

export default function StoryDetailPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load story details
        const storyData = await getStory(storyId);
        if (!storyData) {
          setError('Story not found');
          return;
        }
        setStory(storyData);

        // Load chapters
        const chaptersData = await getChapters(storyId);
        setChapters(chaptersData);

        // Load user progress if logged in
        if (user) {
          const progressData = await getStoryProgress(user.uid, storyId);
          setProgress(progressData);
        }

        // Select first chapter by default
        if (chaptersData.length > 0) {
          setSelectedChapterId(chaptersData[0].id);
          setSelectedChapter(chaptersData[0]);
        }
      } catch (err) {
        console.error('Error loading story:', err);
        setError('Failed to load story');
      } finally {
        setLoading(false);
      }
    };

    loadStoryData();
  }, [storyId, user]);

  const handleChapterSelect = (chapter) => {
    setSelectedChapterId(chapter.id);
    setSelectedChapter(chapter);
  };

  const handleChapterComplete = async () => {
    if (!user || !selectedChapter) return;

    try {
      await completeChapter(user.uid, storyId, selectedChapter.id, 0, 100);
      
      // Update local progress
      if (progress) {
        const newProgress = {
          ...progress,
          completedChapters: [...(progress.completedChapters || []), selectedChapter.id]
        };
        setProgress(newProgress);
      }

      // Move to next chapter
      const currentIndex = chapters.findIndex(c => c.id === selectedChapter.id);
      if (currentIndex < chapters.length - 1) {
        handleChapterSelect(chapters[currentIndex + 1]);
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="story-detail-page">
          <div className="loading-state">Loading story...</div>
        </div>
      </SiteLayout>
    );
  }

  if (error || !story) {
    return (
      <SiteLayout>
        <div className="story-detail-page">
          <div className="error-state">
            <h2>Oops! {error || 'Story not found'}</h2>
            <button onClick={() => navigate('/stories')}>← Back to Stories</button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const completedCount = progress?.completedChapters?.length || 0;
  const progressPercent = chapters.length > 0 ? (completedCount / chapters.length) * 100 : 0;
  const isCompleted = completedCount === chapters.length && chapters.length > 0;

  return (
    <SiteLayout>
      <div className="story-detail-page">
        {/* Header */}
        <div className="story-header">
          <button className="back-button" onClick={() => navigate('/stories')}>
            ← Back
          </button>
          <div className="story-title-section">
            <h1>{story.title}</h1>
            <p className="story-description">{story.description}</p>
          </div>
        </div>

        {/* Progress bar */}
        {user && (
          <div className="progress-section">
            <div className="progress-label">
              <span>Progress</span>
              <span className="progress-text">{completedCount}/{chapters.length} chapters</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            {isCompleted && <div className="completion-badge">✨ Story Complete!</div>}
          </div>
        )}

        <div className="story-content">
          {/* Chapters sidebar */}
          <div className="chapters-sidebar">
            <h3>📚 Chapters</h3>
            <div className="chapters-list">
              {chapters.map((chapter, index) => {
                const isCompleted = progress?.completedChapters?.includes(chapter.id);
                const isSelected = selectedChapterId === chapter.id;

                return (
                  <button
                    key={chapter.id}
                    className={`chapter-item ${isSelected ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => handleChapterSelect(chapter)}
                  >
                    <div className="chapter-number">{index + 1}</div>
                    <div className="chapter-info">
                      <div className="chapter-title">{chapter.title}</div>
                      <div className="chapter-status">
                        {isCompleted && <span className="completed-badge">✓</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chapter content */}
          <div className="chapter-content">
            {selectedChapter ? (
              <>
                <div className="chapter-header">
                  <h2>{selectedChapter.title}</h2>
                  <p className="chapter-description">{selectedChapter.description}</p>
                </div>

                <div className="chapter-body">
                  {selectedChapter.characterImage && (
                    <div className="character-icon">{selectedChapter.characterImage}</div>
                  )}
                  <div className="chapter-text">
                    {selectedChapter.content}
                  </div>
                </div>

                {user && (
                  <div className="chapter-actions">
                    {!progress?.completedChapters?.includes(selectedChapter.id) ? (
                      <button className="complete-button" onClick={handleChapterComplete}>
                        ✓ Mark as Complete
                      </button>
                    ) : (
                      <button className="completed-button" disabled>
                        ✓ Completed
                      </button>
                    )}
                  </div>
                )}

                {!user && (
                  <div className="signin-prompt">
                    <p>📝 Sign in to track your progress and earn points!</p>
                    <button onClick={() => navigate('/profile')}>Sign In</button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-chapter">Select a chapter to read</div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
