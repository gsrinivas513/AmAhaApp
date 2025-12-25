/**
 * DailyChallengeCard.jsx
 * 
 * Displays today's challenge status:
 * - Not completed: "Play Today's Challenge"
 * - Completed: "✅ Complete! +50 XP"
 * - With streak badge
 * 
 * Kids-first design with bright colors and smooth animations
 */

import React, { useState, useEffect } from 'react';
import { getTodayChallenge, hasCompletedToday, getUserStreak } from '../../services/dailyChallengeService';
import { auth } from '../../firebase/firebaseConfig';
import './DailyChallengeCard.css';

export default function DailyChallengeCard({ onPlayClick }) {
  const [challenge, setChallenge] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const todayChallenge = await getTodayChallenge();
        setChallenge(todayChallenge);

        if (user) {
          const isCompleted = await hasCompletedToday(user.uid);
          setCompleted(isCompleted);

          const userStreak = await getUserStreak(user.uid);
          setStreak(userStreak.currentStreak);
        }
      } catch (error) {
        console.error('Error loading challenge:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChallenge();
  }, [user]);

  if (loading) {
    return (
      <div className="daily-challenge-card skeleton">
        <div className="challenge-content" />
      </div>
    );
  }

  if (!challenge) {
    return null; // No challenge for today
  }

  return (
    <div className="daily-challenge-card" onClick={onPlayClick}>
      <div className="challenge-header">
        <div className="challenge-title">
          {completed ? '✅' : '🎯'} Today's Challenge
        </div>
        {streak > 0 && (
          <div className="streak-badge">
            🔥 {streak} day streak
          </div>
        )}
      </div>

      <div className="challenge-content">
        <div className="challenge-type">
          {challenge.type === 'quiz' ? '❓' : '🧩'} {challenge.type === 'quiz' ? 'Quiz' : 'Puzzle'}
        </div>
        
        <div className="challenge-difficulty">
          Difficulty: <span className={`diff-${challenge.difficulty}`}>{challenge.difficulty}</span>
        </div>

        <div className="challenge-rewards">
          <div className="reward-item">
            <span className="reward-icon">✨</span>
            <span className="reward-amount">+{challenge.xpReward} XP</span>
          </div>
          <div className="reward-item">
            <span className="reward-icon">💰</span>
            <span className="reward-amount">+{challenge.coinsReward} Coins</span>
          </div>
        </div>

        <button 
          className={`challenge-button ${completed ? 'completed' : 'ready'}`}
          disabled={completed}
        >
          {completed ? 'Challenge Complete! 🎉' : 'Play Now →'}
        </button>
      </div>

      <div className="challenge-footer">
        {challenge.completionCount && (
          <span className="completion-count">
            {challenge.completionCount.toLocaleString()} players today
          </span>
        )}
      </div>
    </div>
  );
}
