import React, { useState, useEffect } from 'react';
import { getDailyChallenge, completeDailyChallenge, DAILY_CHALLENGE_CONFIG } from '../services/phase8Service';
import { useTheme } from '../context/ThemeContext';
import '../styles/daily-challenges.css';

const DailyChallengesPage = ({ userId, onPuzzleSelect }) => {
  const { theme } = useTheme();
  const [challenge, setChallenge] = useState(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    loadDailyChallenge();
  }, [userId]);

  useEffect(() => {
    const timer = setInterval(() => {
      updateCountdown();
    }, 1000);
    return () => clearInterval(timer);
  }, [challenge]);

  const loadDailyChallenge = async () => {
    setLoading(true);
    const dailyChallenge = await getDailyChallenge(userId);
    if (dailyChallenge) {
      setChallenge(dailyChallenge);
      setCompleted(dailyChallenge.completed);
    } else {
      setError('Failed to load daily challenge');
    }
    setLoading(false);
  };

  const updateCountdown = () => {
    if (!challenge || !challenge.expiresAt) return;

    const now = new Date();
    const expiresAt = new Date(challenge.expiresAt);
    const diff = expiresAt - now;

    if (diff <= 0 || isNaN(diff)) {
      setCountdown('Expired');
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setCountdown(`${hours}h ${minutes}m ${seconds}s`);
  };

  const handleStartChallenge = async () => {
    if (onPuzzleSelect) {
      onPuzzleSelect({
        type: challenge.puzzleType,
        difficulty: challenge.difficulty,
        isChallenge: true,
        challengeId: challenge.date,
      });
    }
  };

  const handleCompleteChallenge = async (score, timeSpent) => {
    const result = await completeDailyChallenge(userId, new Date(), score, timeSpent);
    if (result.success) {
      setCompleted(true);
    }
  };

  if (loading) {
    return <div className="daily-challenges-container"><p>Loading daily challenge...</p></div>;
  }

  if (error) {
    return <div className="daily-challenges-container"><p>Error: {error}</p></div>;
  }

  if (!challenge) {
    return <div className="daily-challenges-container"><p>No challenge available</p></div>;
  }

  const rewards = challenge.rewards;
  const difficultyColor = {
    easy: '#4CAF50',
    medium: '#FF9800',
    hard: '#f44336',
    expert: '#9C27B0',
  };

  return (
    <div 
      className="daily-challenges-container"
      style={{
        backgroundColor: theme.background,
        color: theme.textPrimary,
      }}
    >
      <div className="challenge-header">
        <h1>⭐ Daily Challenge</h1>
        <div 
          className="countdown-badge" 
          style={{ 
            background: theme.gradientAccent,
            color: 'white',
          }}
        >
          {countdown}
        </div>
      </div>

      <div 
        className="challenge-card"
        style={{
          backgroundColor: theme.surfacePrimary,
          borderColor: theme.border,
        }}
      >
        {/* Challenge Type Icon */}
        <div className="challenge-type-section">
          {challenge.puzzleType === 'crossword' && <span className="puzzle-icon">📝</span>}
          {challenge.puzzleType === 'sudoku' && <span className="puzzle-icon">🔢</span>}
          {challenge.puzzleType === 'word-search' && <span className="puzzle-icon">🔍</span>}
        </div>

        {/* Challenge Details */}
        <div className="challenge-details">
          <h3 style={{ color: theme.textPrimary }}>{challenge.puzzleType.charAt(0).toUpperCase() + challenge.puzzleType.slice(1)}</h3>
          
          <div 
            className="difficulty-badge" 
            style={{ 
              background: theme.gradientAccent,
              color: 'white'
            }}
          >
            {challenge.difficulty.toUpperCase()}
          </div>

          <p style={{ color: theme.textSecondary }}>Complete today's puzzle challenge to earn bonus rewards!</p>
        </div>

        {/* Rewards Section */}
        <div className="rewards-section" style={{ borderColor: theme.border }}>
          <div className="reward-item">
            <span className="reward-icon">⚡</span>
            <div>
              <p style={{ color: theme.textSecondary }}>Base XP</p>
              <strong style={{ color: theme.accentPrimary }}>{rewards.xp}</strong>
            </div>
          </div>
          <div className="reward-item">
            <span className="reward-icon">💰</span>
            <div>
              <p style={{ color: theme.textSecondary }}>Coins</p>
              <strong style={{ color: theme.accentPrimary }}>{rewards.coins}</strong>
            </div>
          </div>
          <div className="reward-item">
            <span className="reward-icon">🎁</span>
            <div>
              <p style={{ color: theme.textSecondary }}>Bonus</p>
              <strong style={{ color: theme.accentPrimary }}>+{rewards.bonus}</strong>
            </div>
          </div>
        </div>

        {/* Streak Information */}
        <div className="streak-info" style={{ borderColor: theme.border, backgroundColor: theme.surfaceSecondary }}>
          <span className="streak-icon">🔥</span>
          <p style={{ color: theme.textPrimary }}>Current Streak: <strong>{streak} days</strong></p>
          <span className="streak-info-text" style={{ color: theme.textSecondary }}>Keep it going!</span>
        </div>

        {/* Challenge Button */}
        {!completed ? (
          <button 
            className="start-challenge-btn"
            onClick={handleStartChallenge}
            style={{
              background: theme.gradientAccent,
              color: 'white',
            }}
          >
            🎮 Start Challenge
          </button>
        ) : (
          <div className="completed-badge" style={{ borderColor: theme.accentPrimary, color: theme.accentPrimary }}>
            ✓ Challenge Completed!
          </div>
        )}
      </div>

      {/* Streak Bonuses */}
      <div className="streak-bonuses-section" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
        <h4 style={{ color: theme.textPrimary }}>🎯 Streak Bonuses</h4>
        <div className="bonuses-grid">
          <div className="bonus-card" style={{ borderColor: theme.border }}>
            <p style={{ color: theme.textSecondary }}>3-Day Streak</p>
            <span className="bonus-reward" style={{ color: theme.accentPrimary }}>+100 XP</span>
          </div>
          <div className="bonus-card" style={{ borderColor: theme.border }}>
            <p style={{ color: theme.textSecondary }}>7-Day Streak</p>
            <span className="bonus-reward" style={{ color: theme.accentPrimary }}>+250 XP</span>
          </div>
          <div className="bonus-card" style={{ borderColor: theme.border }}>
            <p style={{ color: theme.textSecondary }}>30-Day Streak</p>
            <span className="bonus-reward" style={{ color: theme.accentPrimary }}>🏅 Badge</span>
          </div>
          <div className="bonus-card" style={{ borderColor: theme.border }}>
            <p style={{ color: theme.textSecondary }}>365-Day Streak</p>
            <span className="bonus-reward" style={{ color: theme.accentPrimary }}>👑 Crown</span>
          </div>
        </div>
      </div>

      {/* Challenge History */}
      <div className="challenge-history-section" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
        <h4 style={{ color: theme.textPrimary }}>📊 Recent Challenges</h4>
        <p style={{ color: theme.textSecondary }}>Track your daily completions and build your streak!</p>
      </div>
    </div>
  );
};

export default DailyChallengesPage;
