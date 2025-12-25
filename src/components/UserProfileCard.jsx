/**
 * User Profile Card Component
 * Shows user level, XP, coins, and progression
 */

import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getUserLevelInfo, getAllLevels } from '../services/gamificationService';
import '../styles/userProfile.css';

const UserProfileCard = () => {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [nextLevel, setNextLevel] = useState(null);
  const [progressToNextLevel, setProgressToNextLevel] = useState(0);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const stats = userDoc.data();
        setUserStats(stats);

        // Calculate level progress
        const currentLevelData = getUserLevelInfo(stats.currentLevel || 1);
        const allLevels = getAllLevels();
        const nextLevelData = allLevels.find(
          (l) => l.level === (stats.currentLevel || 1) + 1
        );

        setCurrentLevel(currentLevelData);
        setNextLevel(nextLevelData);

        if (nextLevelData) {
          const xpInCurrentLevel = (stats.totalXP || 0) - currentLevelData.xpRequired;
          const xpRequiredForNextLevel =
            nextLevelData.xpRequired - currentLevelData.xpRequired;
          const progress = Math.min(
            100,
            (xpInCurrentLevel / xpRequiredForNextLevel) * 100
          );
          setProgressToNextLevel(progress);
        }
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="profile-card-loading">Loading profile...</div>;
  }

  if (!userStats) {
    return <div className="profile-card-empty">Sign in to see your profile</div>;
  }

  return (
    <div className="user-profile-card">
      <div className="profile-header">
        <div className="level-badge">
          <div className="level-icon">{currentLevel?.icon}</div>
          <div className="level-number">{userStats.currentLevel || 1}</div>
        </div>
        <div className="level-info">
          <h3 className="level-name">{currentLevel?.name}</h3>
          <p className="level-title">Level {userStats.currentLevel || 1}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-label">Experience</div>
            <div className="stat-value">{userStats.totalXP || 0} XP</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Coins</div>
            <div className="stat-value">{userStats.totalCoins || 0}</div>
          </div>
        </div>
      </div>

      {nextLevel && (
        <div className="progress-section">
          <div className="progress-label">
            <span>Progress to {nextLevel.name}</span>
            <span className="progress-percentage">{Math.round(progressToNextLevel)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressToNextLevel}%` }}
            />
          </div>
          <div className="progress-xp">
            {Math.round(progressToNextLevel)}% to Level {nextLevel.level}
          </div>
        </div>
      )}

      <div className="profile-activities">
        <div className="activity-item">
          <span className="activity-icon">🎯</span>
          <div className="activity-info">
            <div className="activity-label">Quizzes</div>
            <div className="activity-count">{userStats.quizzesCompleted || 0}</div>
          </div>
        </div>

        <div className="activity-item">
          <span className="activity-icon">🧩</span>
          <div className="activity-info">
            <div className="activity-label">Puzzles</div>
            <div className="activity-count">{userStats.puzzlesSolved || 0}</div>
          </div>
        </div>

        <div className="activity-item">
          <span className="activity-icon">🔥</span>
          <div className="activity-info">
            <div className="activity-label">Streak</div>
            <div className="activity-count">{userStats.currentStreak || 0}</div>
          </div>
        </div>
      </div>

      <button className="view-full-profile-btn" onClick={loadUserStats}>
        Refresh Profile
      </button>
    </div>
  );
};

export default UserProfileCard;
