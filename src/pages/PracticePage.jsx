import React, { useState, useEffect } from 'react';
import { PRACTICE_MODE_CONFIG } from '../services/phase8Service';
import { useTheme } from '../context/ThemeContext';
import '../styles/practice-mode.css';

const PracticePage = ({ userId, userProgress = {} }) => {
  const { theme } = useTheme();
  const [practiceSession, setPracticeSession] = useState(null);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    totalReviewed: 0,
    correct: 0,
    incorrect: 0,
    accuracy: 0,
    timeSpent: 0,
  });

  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [reviewQueue, setReviewQueue] = useState([]);

  useEffect(() => {
    loadReviewQueue();
  }, [userId, selectedDifficulty]);

  const loadReviewQueue = () => {
    const queue = [];
    for (let i = 0; i < 10; i++) {
      queue.push({
        id: `puzzle_${i}`,
        type: ['crossword', 'sudoku', 'wordsearch'][Math.floor(Math.random() * 3)],
        difficulty: ['easy', 'medium', 'hard', 'expert'][Math.floor(Math.random() * 4)],
        lastReviewed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        nextReview: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        interval: Math.floor(Math.random() * 30) + 1,
        easeFactor: (2 + Math.random() * 1.5).toFixed(2),
      });
    }
    setReviewQueue(queue);
  };

  const startSession = () => {
    setPracticeSession({
      startTime: new Date(),
      sessionLength: 30,
      puzzlesScheduled: 10,
    });
  };

  const handlePuzzleCorrect = () => {
    setSessionStats({
      ...sessionStats,
      totalReviewed: sessionStats.totalReviewed + 1,
      correct: sessionStats.correct + 1,
      accuracy: Math.round(((sessionStats.correct + 1) / (sessionStats.totalReviewed + 1)) * 100),
    });
  };

  const handlePuzzleIncorrect = () => {
    setSessionStats({
      ...sessionStats,
      totalReviewed: sessionStats.totalReviewed + 1,
      incorrect: sessionStats.incorrect + 1,
      accuracy: Math.round((sessionStats.correct / (sessionStats.totalReviewed + 1)) * 100),
    });
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: '#4caf50',
      medium: '#ff9800',
      hard: '#f44336',
      expert: '#9c27b0',
    };
    return colors[difficulty] || '#999';
  };

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const nextReviewDate = (date) => {
    const now = new Date();
    const diff = date - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return 'Due now';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  return (
    <div className="practice-container" style={{ backgroundColor: theme.background, color: theme.textPrimary, transition: 'background-color 0.3s, color 0.3s' }}>
      {/* Header */}
      <div className="practice-header" style={{ borderColor: theme.border }}>
        <h1 style={{ color: theme.textPrimary }}>📚 Practice Mode</h1>
        <p style={{ color: theme.textSecondary }}>Master puzzles with spaced repetition learning</p>
      </div>

      {/* Difficulty Filter */}
      <div className="difficulty-filter" style={{ borderColor: theme.border }}>
        {['all', 'easy', 'medium', 'hard', 'expert'].map((diff) => (
          <button
            key={diff}
            className={`filter-btn ${selectedDifficulty === diff ? 'active' : ''}`}
            onClick={() => setSelectedDifficulty(diff)}
            style={{
              backgroundColor: selectedDifficulty === diff ? theme.accentPrimary : theme.surfaceSecondary,
              color: selectedDifficulty === diff ? 'white' : theme.textPrimary,
              borderColor: theme.border
            }}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </button>
        ))}
      </div>

      {/* Session Stats */}
      <div className="session-stats-card" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
        <div className="stat-item" style={{ backgroundColor: theme.background }}>
          <span className="stat-icon">📊</span>
          <div className="stat-content">
            <p className="stat-label" style={{ color: theme.textSecondary }}>Reviewed</p>
            <p className="stat-value" style={{ color: theme.accentPrimary }}>{sessionStats.totalReviewed}/10</p>
          </div>
        </div>
        <div className="stat-item" style={{ backgroundColor: theme.background }}>
          <span className="stat-icon">✓</span>
          <div className="stat-content">
            <p className="stat-label" style={{ color: theme.textSecondary }}>Correct</p>
            <p className="stat-value" style={{ color: theme.accentPrimary }}>{sessionStats.correct}</p>
          </div>
        </div>
        <div className="stat-item" style={{ backgroundColor: theme.background }}>
          <span className="stat-icon">✕</span>
          <div className="stat-content">
            <p className="stat-label" style={{ color: theme.textSecondary }}>Incorrect</p>
            <p className="stat-value" style={{ color: theme.accentPrimary }}>{sessionStats.incorrect}</p>
          </div>
        </div>
        <div className="stat-item" style={{ backgroundColor: theme.background }}>
          <span className="stat-icon">🎯</span>
          <div className="stat-content">
            <p className="stat-label" style={{ color: theme.textSecondary }}>Accuracy</p>
            <p className="stat-value" style={{ color: theme.accentPrimary }}>{sessionStats.accuracy}%</p>
          </div>
        </div>
      </div>

      {/* Start Session Button */}
      {!practiceSession && (
        <div className="session-start" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
          <h3 style={{ color: theme.textPrimary }}>Ready to practice?</h3>
          <p style={{ color: theme.textSecondary }}>Start a 30-minute session with {reviewQueue.length} puzzles</p>
          <button className="start-session-btn" onClick={startSession} style={{ background: theme.gradientAccent, color: 'white' }}>
            ▶️ Start Session
          </button>
        </div>
      )}

      {/* Active Session */}
      {practiceSession && (
        <div className="active-session" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
          <div className="session-timer" style={{ backgroundColor: theme.background }}>
            <span className="timer-icon">⏱️</span>
            <span className="timer-display" style={{ color: theme.accentPrimary }}>
              {sessionStats.totalReviewed} / {practiceSession.puzzlesScheduled}
            </span>
          </div>
          <div className="session-controls">
            <button className="control-btn correct-btn" onClick={handlePuzzleCorrect} style={{ background: theme.gradientAccent, color: 'white' }}>
              ✓ Correct
            </button>
            <button className="control-btn incorrect-btn" onClick={handlePuzzleIncorrect} style={{ backgroundColor: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.border }}>
              ✕ Incorrect
            </button>
          </div>
        </div>
      )}

      {/* Review Queue */}
      <div className="review-queue-section" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>📅 Review Queue</h3>
        <div className="queue-tabs" style={{ borderColor: theme.border }}>
          <button className="queue-tab active" style={{ backgroundColor: theme.accentPrimary, color: 'white', borderColor: theme.border }}>Due Now (5)</button>
          <button className="queue-tab" style={{ backgroundColor: theme.surfacePrimary, color: theme.textPrimary, borderColor: theme.border }}>Coming Soon (3)</button>
          <button className="queue-tab" style={{ backgroundColor: theme.surfacePrimary, color: theme.textPrimary, borderColor: theme.border }}>All (10)</button>
        </div>

        <div className="queue-list">
          {reviewQueue.map((puzzle) => (
            <div key={puzzle.id} className="queue-item" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
              <div className="puzzle-info">
                <div className="puzzle-header">
                  <span className="puzzle-type" style={{ color: theme.accentPrimary }}>
                    {puzzle.type === 'crossword' && '📝'}
                    {puzzle.type === 'sudoku' && '🔢'}
                    {puzzle.type === 'wordsearch' && '🔍'}
                    {puzzle.type.toUpperCase()}
                  </span>
                  <span
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(puzzle.difficulty), color: 'white' }}
                  >
                    {puzzle.difficulty}
                  </span>
                </div>
                <div className="puzzle-timing" style={{ color: theme.textSecondary }}>
                  <span className="last-reviewed">Last: {formatDate(puzzle.lastReviewed)}</span>
                  <span className="next-review">Next: {nextReviewDate(puzzle.nextReview)}</span>
                </div>
              </div>
              <div className="spacing-info">
                <div className="spacing-item" style={{ backgroundColor: theme.background }}>
                  <span className="spacing-label" style={{ color: theme.textSecondary }}>Interval</span>
                  <span className="spacing-value" style={{ color: theme.accentPrimary }}>{puzzle.interval}d</span>
                </div>
                <div className="spacing-item" style={{ backgroundColor: theme.background }}>
                  <span className="spacing-label" style={{ color: theme.textSecondary }}>Ease</span>
                  <span className="spacing-value" style={{ color: theme.accentPrimary }}>{puzzle.easeFactor}</span>
                </div>
              </div>
              <button className="start-puzzle-btn" style={{ background: theme.gradientAccent, color: 'white' }}>Start</button>
            </div>
          ))}
        </div>
      </div>

      {/* Spaced Repetition Info */}
      <div className="sr-info" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>💡 How Spaced Repetition Works</h3>
        <div className="info-cards">
          <div className="info-card" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <span className="info-icon">1️⃣</span>
            <p style={{ color: theme.textPrimary }}><strong>Learn</strong> new puzzles daily</p>
          </div>
          <div className="info-card" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <span className="info-icon">2️⃣</span>
            <p style={{ color: theme.textPrimary }}><strong>Review</strong> based on your performance</p>
          </div>
          <div className="info-card" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <span className="info-icon">3️⃣</span>
            <p style={{ color: theme.textPrimary }}><strong>Optimize</strong> retention with SM-2 algorithm</p>
          </div>
          <div className="info-card" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <span className="info-icon">4️⃣</span>
            <p style={{ color: theme.textPrimary }}><strong>Master</strong> puzzles permanently</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="statistics-section" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>📈 Your Statistics</h3>
        <div className="stats-grid">
          <div className="stats-box" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <span className="stats-icon">🎯</span>
            <p className="stats-number" style={{ color: theme.accentPrimary }}>87%</p>
            <p className="stats-label" style={{ color: theme.textSecondary }}>Avg Accuracy</p>
          </div>
          <div className="stats-box" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <span className="stats-icon">🔥</span>
            <p className="stats-number" style={{ color: theme.accentPrimary }}>12</p>
            <p className="stats-label" style={{ color: theme.textSecondary }}>Day Streak</p>
          </div>
          <div className="stats-box" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <span className="stats-icon">⭐</span>
            <p className="stats-number" style={{ color: theme.accentPrimary }}>347</p>
            <p className="stats-label" style={{ color: theme.textSecondary }}>Puzzles Mastered</p>
          </div>
          <div className="stats-box" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <span className="stats-icon">⏰</span>
            <p className="stats-number" style={{ color: theme.accentPrimary }}>42h</p>
            <p className="stats-label" style={{ color: theme.textSecondary }}>Time Invested</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="practice-tips" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>💡 Practice Tips</h3>
        <ul style={{ color: theme.textPrimary }}>
          <li>Practice daily to build and maintain your streak</li>
          <li>Focus on correct answers to increase ease factor</li>
          <li>Review difficult puzzles more frequently</li>
          <li>Aim for 90% accuracy or higher</li>
          <li>The SM-2 algorithm will optimize your learning</li>
        </ul>
      </div>
    </div>
  );
};

export default PracticePage;
