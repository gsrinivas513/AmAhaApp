import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { STORY_MODE_CONFIG } from '../services/phase8Service';
import '../styles/story-mode.css';

const StoryModePage = ({ userId, onLevelSelect, userProgress = {} }) => {
  const { theme } = useTheme();
  const [currentChapter, setCurrentChapter] = useState(0);
  const [chapterProgress, setChapterProgress] = useState({});
  const [selectedLevel, setSelectedLevel] = useState(null);

  useEffect(() => {
    loadChapterProgress();
  }, [userId]);

  const loadChapterProgress = () => {
    const progress = {};
    STORY_MODE_CONFIG.chapters.forEach((chapter, idx) => {
      progress[idx] = userProgress[idx] || { levelsCompleted: 0, totalXP: 0, unlocked: idx === 0 };
    });
    setChapterProgress(progress);
  };

  const isChapterUnlocked = (chapterIndex) => {
    if (chapterIndex === 0) return true;
    const prevChapterProgress = chapterProgress[chapterIndex - 1];
    return prevChapterProgress && prevChapterProgress.levelsCompleted >= 8;
  };

  const handleLevelSelect = (level, levelIndex) => {
    setSelectedLevel(levelIndex);
    onLevelSelect({
      chapterIndex: currentChapter,
      levelIndex,
      level,
      puzzleId: level.puzzleId,
    });
  };

  const currentChapterData = STORY_MODE_CONFIG.chapters[currentChapter];
  const progress = chapterProgress[currentChapter] || { levelsCompleted: 0, totalXP: 0 };

  return (
    <div className="story-mode-container" style={{ backgroundColor: theme.background, color: theme.textPrimary, transition: 'background-color 0.3s, color 0.3s' }}>
      {/* Story Header */}
      <div className="story-header" style={{ borderColor: theme.border }}>
        <h1 style={{ color: theme.textPrimary }}>📖 Story Mode</h1>
        <p className="story-subtitle" style={{ color: theme.textSecondary }}>Progress through an engaging puzzle adventure</p>
      </div>

      {/* Chapter Navigation */}
      <div className="chapters-navigation" style={{ borderColor: theme.border }}>
        {STORY_MODE_CONFIG.chapters.map((chapter, idx) => {
          const isUnlocked = isChapterUnlocked(idx);
          const chapterProg = chapterProgress[idx] || { levelsCompleted: 0 };
          const isCompleted = chapterProg.levelsCompleted >= 10;

          return (
            <button
              key={idx}
              className={`chapter-button ${idx === currentChapter ? 'active' : ''} ${
                !isUnlocked ? 'locked' : ''
              } ${isCompleted ? 'completed' : ''}`}
              onClick={() => isUnlocked && setCurrentChapter(idx)}
              disabled={!isUnlocked}
              style={{
                backgroundColor: idx === currentChapter ? theme.accentPrimary : theme.surfaceSecondary,
                color: idx === currentChapter ? 'white' : theme.textPrimary,
                borderColor: theme.border
              }}
            >
              <span className="chapter-number">{idx + 1}</span>
              <span className="chapter-title">{chapter.title}</span>
              {!isUnlocked && <span className="lock-icon">🔒</span>}
              {isCompleted && <span className="complete-icon">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Chapter Details */}
      {currentChapterData && (
        <div className="chapter-details" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
          <div className="chapter-header">
            <div className="chapter-info">
              <h2 style={{ color: theme.textPrimary }}>Chapter {currentChapter + 1}: {currentChapterData.title}</h2>
              <p className="chapter-narrative" style={{ color: theme.textSecondary }}>{currentChapterData.narrative}</p>
            </div>
            <div className="chapter-stats">
              <div className="stat-box" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
                <span className="stat-icon">📊</span>
                <span className="stat-value" style={{ color: theme.accentPrimary }}>{progress.levelsCompleted}/10</span>
                <span className="stat-label" style={{ color: theme.textSecondary }}>Levels</span>
              </div>
              <div className="stat-box" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
                <span className="stat-icon">⭐</span>
                <span className="stat-value" style={{ color: theme.accentPrimary }}>{progress.totalXP}</span>
                <span className="stat-label" style={{ color: theme.textSecondary }}>XP Earned</span>
              </div>
              <div className="stat-box" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
                <span className="stat-icon">🎖️</span>
                <span className="stat-value" style={{ color: theme.accentPrimary }}>{progress.levelsCompleted >= 10 ? '✓' : '---'}</span>
                <span className="stat-label" style={{ color: theme.textSecondary }}>Completed</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="chapter-progress" style={{ borderColor: theme.border }}>
            <div className="progress-label">
              <span style={{ color: theme.textPrimary }}>Chapter Progress</span>
              <span className="progress-percentage" style={{ color: theme.accentPrimary }}>{Math.round((progress.levelsCompleted / 10) * 100)}%</span>
            </div>
            <div className="progress-bar" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
              <div className="progress-fill" style={{ width: `${(progress.levelsCompleted / 10) * 100}%`, background: theme.gradientAccent }}></div>
            </div>
          </div>

          {/* Levels Grid */}
          <div className="levels-grid">
            {currentChapterData.levels.map((level, levelIdx) => {
              const isLevelUnlocked = progress.levelsCompleted > levelIdx;
              const isLevelCompleted = progress.levelsCompleted > levelIdx + 1;

              return (
                <button
                  key={levelIdx}
                  className={`level-card ${isLevelCompleted ? 'completed' : ''} ${
                    !isLevelUnlocked && levelIdx !== 0 ? 'locked' : ''
                  } ${selectedLevel === levelIdx ? 'selected' : ''}`}
                  onClick={() => (isLevelUnlocked || levelIdx === 0) && handleLevelSelect(level, levelIdx)}
                  disabled={!isLevelUnlocked && levelIdx !== 0}
                  style={{
                    backgroundColor: selectedLevel === levelIdx ? theme.accentPrimary : theme.surfaceSecondary,
                    color: selectedLevel === levelIdx ? 'white' : theme.textPrimary,
                    borderColor: theme.border
                  }}
                >
                  <div className="level-number">
                    {isLevelCompleted ? '✓' : levelIdx + 1}
                  </div>
                  <div className="level-details">
                    <p className="level-type" style={{ color: selectedLevel === levelIdx ? 'white' : theme.textPrimary }}>{level.type.toUpperCase()}</p>
                    <p className="level-difficulty" style={{ color: selectedLevel === levelIdx ? 'rgba(255,255,255,0.8)' : theme.textSecondary }}>{level.difficulty}</p>
                  </div>
                  {!isLevelUnlocked && levelIdx !== 0 && <div className="lock-badge">🔒</div>}
                  {isLevelCompleted && <div className="complete-badge">✓</div>}
                  <div className="level-rewards" style={{ color: selectedLevel === levelIdx ? 'white' : theme.accentPrimary }}>
                    <span>+{level.xpReward}XP</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Chapter Rewards Preview */}
          <div className="chapter-rewards-section" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
            <h3 style={{ color: theme.textPrimary }}>Chapter Completion Rewards</h3>
            <div className="rewards-boxes">
              <div className="reward-box" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
                <span className="reward-icon">⭐</span>
                <p className="reward-amount" style={{ color: theme.accentPrimary }}>500 XP</p>
                <p className="reward-label" style={{ color: theme.textSecondary }}>Chapter XP</p>
              </div>
              <div className="reward-box" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
                <span className="reward-icon">🎖️</span>
                <p className="reward-amount" style={{ color: theme.accentPrimary }}>1</p>
                <p className="reward-label" style={{ color: theme.textSecondary }}>Badge</p>
              </div>
              <div className="reward-box" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
                <span className="reward-icon">🏆</span>
                <p className="reward-amount" style={{ color: theme.accentPrimary }}>Title</p>
                <p className="reward-label" style={{ color: theme.textSecondary }}>Unlock</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Story Tips */}
      <div className="story-tips" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>💡 Tips for Success</h3>
        <ul style={{ color: theme.textPrimary }}>
          <li>Complete 8 levels to unlock the next chapter</li>
          <li>Maintain accuracy to earn bonus XP</li>
          <li>Try different puzzle types to master all skills</li>
          <li>Share your progress with friends</li>
        </ul>
      </div>
    </div>
  );
};

export default StoryModePage;
