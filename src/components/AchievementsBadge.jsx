/**
 * Achievements Badge Component
 * Displays achievements and user progress
 */

import React, { useState, useEffect } from 'react';
import { getUserAchievements, getAllAchievements, getUserLevelInfo } from '../services/gamificationService';
import '../styles/achievements.css';

const AchievementsBadge = ({ userId }) => {
  const [achievements, setAchievements] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [userLevel, setUserLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadAchievements();
  }, [userId]);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const unlockedIds = await getUserAchievements(userId);
      setUnlockedAchievements(unlockedIds);

      const allAchievements = getAllAchievements();
      setAchievements(allAchievements);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const isUnlocked = (achievementId) => {
    return unlockedAchievements.some((a) => a.id === achievementId);
  };

  const getProgressPercentage = () => {
    if (achievements.length === 0) return 0;
    return Math.round((unlockedAchievements.length / achievements.length) * 100);
  };

  if (loading) {
    return <div className="achievements-loading">Loading achievements...</div>;
  }

  return (
    <div className="achievements-container">
      <button
        className="achievements-trigger"
        onClick={() => setShowModal(!showModal)}
        title="View achievements"
      >
        <span className="achievement-count">{unlockedAchievements.length}/{achievements.length}</span>
        <span className="achievement-icon">🏆</span>
      </button>

      {showModal && (
        <div className="achievements-modal">
          <div className="achievements-modal-content">
            <div className="achievements-modal-header">
              <h2>Achievements</h2>
              <button
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="achievements-progress">
              <div className="progress-info">
                <span className="progress-text">
                  {unlockedAchievements.length}/{achievements.length} Unlocked
                </span>
                <span className="progress-percentage">{getProgressPercentage()}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>

            <div className="achievements-grid">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`achievement-card ${
                    isUnlocked(achievement.id) ? 'unlocked' : 'locked'
                  }`}
                  title={isUnlocked(achievement.id) ? `${achievement.name}` : 'Locked'}
                >
                  <div className="achievement-badge">{achievement.badge}</div>
                  <div className="achievement-info">
                    <h4 className="achievement-name">{achievement.name}</h4>
                    <p className="achievement-description">
                      {achievement.description}
                    </p>
                    {isUnlocked(achievement.id) && (
                      <div className="achievement-rewards">
                        <span className="reward-xp">+{achievement.xpReward} XP</span>
                        <span className="reward-coins">
                          +{achievement.coinsReward} Coins
                        </span>
                      </div>
                    )}
                  </div>
                  {!isUnlocked(achievement.id) && (
                    <div className="achievement-locked-overlay">🔒</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsBadge;
