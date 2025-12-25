/**
 * StoryDetailPage.jsx
 * 
 * Displays a single story with chapters - Kid-friendly design
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
  const [completing, setCompleting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

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
      setCompleting(true);
      await completeChapter(user.uid, storyId, selectedChapter.id, 0, 100);
      
      // Show celebration animation
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
      
      // Update local progress
      if (progress) {
        const newProgress = {
          ...progress,
          completedChapters: [...(progress.completedChapters || []), selectedChapter.id]
        };
        setProgress(newProgress);
      }

      // Move to next chapter after delay
      setTimeout(() => {
        const currentIndex = chapters.findIndex(c => c.id === selectedChapter.id);
        if (currentIndex < chapters.length - 1) {
          handleChapterSelect(chapters[currentIndex + 1]);
        }
        setCompleting(false);
      }, 1500);
    } catch (err) {
      console.error('Error updating progress:', err);
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="story-detail-page">
          <div className="loading-state">
            <div className="spinner">🔄</div>
            <p>Loading your adventure...</p>
          </div>
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
  const isChapterCompleted = progress?.completedChapters?.includes(selectedChapter?.id);
  const isStoryCompleted = completedCount === chapters.length && chapters.length > 0;

  return (
    <SiteLayout>
      <div className="story-detail-page">
        {/* Celebration animation */}
        {showCelebration && (
          <div className="celebration">
            <div className="confetti">🎉</div>
            <div className="confetti">✨</div>
            <div className="confetti">🌟</div>
            <div className="confetti">🎊</div>
            <p className="celebration-text">Awesome! Chapter Complete! 🎉</p>
          </div>
        )}

        {/* Header with back button */}
        <div className="story-header">
          <button className="back-button" onClick={() => navigate('/stories')}>
            ← Back to Stories
          </button>
        </div>

        {/* Story intro section */}
        <div className="story-intro-section">
          <div className="story-intro-content">
            <h1 className="story-title">📖 {story.title}</h1>
            <p className="story-description">{story.description}</p>
            
            {/* Progress bar */}
            {user && (
              <div className="progress-section">
                <div className="progress-info">
                  <span className="progress-label">Your Progress:</span>
                  <span className="progress-text">{completedCount}/{chapters.length} Chapters</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                {isStoryCompleted && <div className="completion-badge">🏆 Story Complete! Amazing! 🏆</div>}
              </div>
            )}
          </div>
        </div>

        {/* Main content area */}
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
                      {isCompleted && <span className="completed-badge">✓</span>}
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
                  <div className="chapter-header-badge">
                    <span className="chapter-num">Chapter {chapters.findIndex(c => c.id === selectedChapter.id) + 1} of {chapters.length}</span>
                  </div>
                  <h2 className="chapter-title">{selectedChapter.title}</h2>
                  <p className="chapter-description">{selectedChapter.description}</p>
                </div>

                <div className="chapter-body">
                  {selectedChapter.characterImage && (
                    <div className="character-display">
                      <div className="character-icon">{selectedChapter.characterImage}</div>
                    </div>
                  )}
                  <div className="chapter-text-container">
                    <p className="chapter-text">
                      {selectedChapter.content}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="chapter-actions">
                  {user && (
                    <>
                      {!isChapterCompleted ? (
                        <button 
                          className={`complete-button ${completing ? 'loading' : ''}`}
                          onClick={handleChapterComplete}
                          disabled={completing}
                        >
                          {completing ? '✨ Completing...' : '✓ Mark as Complete'}
                        </button>
                      ) : (
                        <button className="completed-button" disabled>
                          ✓ Completed
                        </button>
                      )}

                      {/* Next chapter button */}
                      {chapters.findIndex(c => c.id === selectedChapter.id) < chapters.length - 1 && (
                        <button 
                          className="next-button"
                          onClick={() => {
                            const nextIndex = chapters.findIndex(c => c.id === selectedChapter.id) + 1;
                            handleChapterSelect(chapters[nextIndex]);
                          }}
                        >
                          Next Chapter →
                        </button>
                      )}
                    </>
                  )}
                </div>

                {!user && (
                  <div className="signin-prompt">
                    <p>🎮 Sign in to track your progress and earn rewards!</p>
                    <button onClick={() => navigate('/profile')}>Sign In Now</button>
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

