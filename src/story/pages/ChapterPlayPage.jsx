import React, { useState, useEffect } from 'react';
import { getStory, getUserStoryProgress, completeStory } from '../services/storyService';
import { recordChapterCompletion, useHint, isHardLocked, getHardLockOptions } from '../services/storyProgressService';
import { ChapterCard, ProgressBar, CertificateModal, RetryDialog, HintSystem } from '../components/StoryCard';
import '../styles/story.css';

export function ChapterPlayPage({ userId, storyId, chapterIndex = 0, onComplete }) {
  const [story, setStory] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showRetryDialog, setShowRetryDialog] = useState(false);
  const [chapterScore, setChapterScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  useEffect(() => {
    loadChapter();
  }, [storyId, userId, chapterIndex]);

  async function loadChapter() {
    try {
      setLoading(true);
      const storyData = await getStory(storyId);
      const progressData = await getUserStoryProgress(userId, storyId);

      setStory(storyData);
      setProgress(progressData);
      
      if (storyData && storyData.chapters[chapterIndex]) {
        setCurrentChapter(storyData.chapters[chapterIndex]);
        setHintsUsed(progressData?.chapterProgress[chapterIndex]?.hintsUsed || 0);
      }
    } catch (error) {
      console.error('Error loading chapter:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleChapterComplete(score) {
    try {
      setChapterScore(score);

      // Record completion
      const result = await recordChapterCompletion(
        userId,
        storyId,
        chapterIndex,
        {},
        score
      );

      // Check if story is complete
      const updatedProgress = await getUserStoryProgress(userId, storyId);
      
      if (updatedProgress.completedChapters.length === story.chapters.length) {
        // Story complete - show certificate
        await completeStory(userId, storyId);
        setShowCertificate(true);
      } else {
        setShowRetryDialog(true);
      }
    } catch (error) {
      console.error('Error completing chapter:', error);
    }
  }

  async function handleUseHint() {
    try {
      const newCount = await useHint(userId, storyId, chapterIndex);
      setHintsUsed(newCount);
    } catch (error) {
      console.error('Error using hint:', error);
    }
  }

  function handleNextChapter() {
    if (chapterIndex < story.chapters.length - 1) {
      onComplete({
        chapterIndex: chapterIndex + 1,
        action: 'next'
      });
    }
  }

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!story || !currentChapter) return <div className="error">Story not found</div>;

  const totalChapters = story.chapters.length;
  const completedChapters = progress?.completedChapters?.length || 0;
  const chapterHints = currentChapter.hints || [];
  const maxHints = 3;

  return (
    <div className="chapter-play-page">
      <div className="chapter-header">
        <button onClick={() => onComplete({ action: 'exit' })} className="btn-back">
          ← Back
        </button>
        <div className="chapter-info">
          <h2>{currentChapter.title}</h2>
          <p className="chapter-subtitle">{story.title}</p>
        </div>
        <div className="chapter-progress">
          {chapterIndex + 1} / {totalChapters}
        </div>
      </div>

      <ProgressBar
        completed={completedChapters}
        total={totalChapters}
        score={progress?.overallScore}
      />

      <div className="chapter-content-container">
        <div className="chapter-main">
          <div className="chapter-content">
            {currentChapter.content?.introText && (
              <div className="intro-text">
                <p>{currentChapter.content.introText}</p>
              </div>
            )}

            {currentChapter.content?.items && (
              <div className="chapter-items">
                <h3>Items to Complete</h3>
                <ul className="items-list">
                  {currentChapter.content.items.map((item, idx) => (
                    <li key={idx} className="item">
                      <span className="item-type">{item.type}</span>
                      <span className="item-title">{item.title}</span>
                      {item.required && <span className="item-required">*Required</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="chapter-actions">
              <button
                onClick={() => handleChapterComplete(85)}
                className="btn btn-primary btn-lg"
              >
                Complete Chapter
              </button>
            </div>

            {currentChapter.content?.outroText && (
              <div className="outro-text">
                <p>{currentChapter.content.outroText}</p>
              </div>
            )}
          </div>

          <div className="chapter-sidebar">
            <HintSystem
              hints={chapterHints}
              used={hintsUsed}
              onUseHint={handleUseHint}
            />

            <div className="chapter-stats">
              <h4>Chapter Stats</h4>
              <ul>
                <li>
                  <span>Difficulty</span>
                  <strong>{currentChapter.difficulty}</strong>
                </li>
                <li>
                  <span>Duration</span>
                  <strong>~{currentChapter.estimatedDuration || 15}m</strong>
                </li>
                <li>
                  <span>Items</span>
                  <strong>{currentChapter.content?.items?.length || 0}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showRetryDialog && (
        <RetryDialog
          chapter={currentChapter}
          score={chapterScore}
          retryPolicy={currentChapter.retryPolicy}
          onRetry={() => {
            setShowRetryDialog(false);
            loadChapter();
          }}
          onGiveUp={handleNextChapter}
        />
      )}

      {showCertificate && (
        <CertificateModal
          summary={{
            userName: 'Student',
            storyTitle: story.title,
            completionDate: new Date().toISOString(),
            finalScore: progress?.overallScore || 85,
            chaptersCompleted: totalChapters,
            totalChapters,
            performanceLevel: 'Excellence'
          }}
          onClose={() => setShowCertificate(false)}
          onDownload={() => {
            console.log('Certificate download');
            setShowCertificate(false);
          }}
        />
      )}
    </div>
  );
}

export default ChapterPlayPage;
