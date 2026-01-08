/**
 * Achievement Card Component
 * Displays individual achievement with details and unlock status
 */

import React, { useState } from 'react';
import '../styles/achievement-card.css';

const AchievementCard = ({ achievement, unlocked = false }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleShare = (e) => {
    e.stopPropagation();
    const text = `I just unlocked the "${achievement.name}" achievement! 🎉`;
    if (navigator.share) {
      navigator.share({
        title: achievement.name,
        text: text,
      });
    } else {
      alert('Achievement shared!');
    }
  };

  const handleAddToProfile = (e) => {
    e.stopPropagation();
    alert(`Added "${achievement.name}" to your profile showcase!`);
  };

  return (
    <div
      className={`achievement-card ${unlocked ? 'unlocked' : 'locked'} ${
        showDetails ? 'expanded' : ''
      }`}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Card Icon */}
      <div className="achievement-icon">
        <span className="icon-emoji">{achievement.icon || '🎖️'}</span>
        {unlocked && <span className="unlock-badge">✓</span>}
      </div>

      {/* Card Header */}
      <div className="achievement-header">
        <h3 className="achievement-name">{achievement.name}</h3>
        <p className="achievement-rarity">
          {achievement.rarity && (
            <span className={`rarity-badge ${achievement.rarity}`}>
              {achievement.rarity.toUpperCase()}
            </span>
          )}
        </p>
      </div>

      {/* Card Body */}
      <div className="achievement-body">
        <p className="achievement-description">{achievement.description}</p>

        {/* Rewards Preview */}
        {unlocked && (
          <div className="achievement-rewards">
            <span className="reward-item">
              <span className="reward-icon">⚡</span>
              <span className="reward-amount">{achievement.xpReward} XP</span>
            </span>
            <span className="reward-item">
              <span className="reward-icon">💰</span>
              <span className="reward-amount">{achievement.coinsReward} Coins</span>
            </span>
          </div>
        )}
      </div>

      {/* Expandable Details */}
      {showDetails && unlocked && (
        <div className="achievement-details">
          <div className="detail-section">
            <h4>Unlock Date</h4>
            <p>
              {achievement.unlockedAt
                ? new Date(achievement.unlockedAt).toLocaleDateString()
                : 'Recently unlocked'}
            </p>
          </div>

          {/* Achievement Actions */}
          <div className="achievement-actions">
            <button className="action-button share-button" onClick={handleShare}>
              📤 Share Achievement
            </button>
            <button className="action-button profile-button" onClick={handleAddToProfile}>
              ⭐ Add to Profile
            </button>
          </div>
        </div>
      )}

      {/* Locked State Message */}
      {!unlocked && (
        <div className="achievement-locked-message">
          <p>Keep working to unlock this!</p>
        </div>
      )}
    </div>
  );
};

export default AchievementCard;
