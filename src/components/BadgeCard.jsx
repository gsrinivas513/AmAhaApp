/**
 * Badge Card Component
 * Displays individual badge/trophy with styling
 */

import React, { useState } from 'react';
import '../styles/badge-card.css';

const BadgeCard = ({ badge, unlocked = false }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Map badge ID to icon and description
  const badgeInfo = {
    'quiz-warrior': { icon: '⚔️', title: 'Quiz Warrior', description: 'Completed 10 quizzes' },
    'puzzle-master': { icon: '🧩', title: 'Puzzle Master', description: 'Solved 50 puzzles' },
    'speedster': { icon: '⚡', title: 'Speedster', description: 'Completed puzzle in under 2 minutes' },
    'flawless': { icon: '💯', title: 'Flawless', description: 'Perfect score on quiz' },
    'consistent': { icon: '🔥', title: 'Consistent', description: '7-day login streak' },
    'legend': { icon: '👑', title: 'Legend', description: 'Reached Legend level' },
    'collector': { icon: '📚', title: 'Collector', description: 'Completed 10 series' },
    'helpful': { icon: '🤝', title: 'Helpful', description: 'Contributed to community' },
  };

  const info = badgeInfo[badge.id] || {
    icon: badge.name || '🏅',
    title: badge.name || 'Badge',
    description: 'Special achievement',
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const text = `I just earned the ${info.title} badge! 🏅`;
    if (navigator.share) {
      navigator.share({
        title: info.title,
        text: text,
      });
    }
  };

  return (
    <div
      className={`badge-card ${unlocked ? 'unlocked' : 'locked'}`}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Badge Icon */}
      <div className="badge-icon">
        <span className="badge-emoji">{info.icon}</span>
        {unlocked && <span className="badge-crown">👑</span>}
      </div>

      {/* Badge Title */}
      <h3 className="badge-title">{info.title}</h3>

      {/* Badge Description */}
      <p className="badge-description">{info.description}</p>

      {/* Unlock Date */}
      {unlocked && badge.unlockedAt && (
        <p className="badge-date">
          Unlocked: {new Date(badge.unlockedAt).toLocaleDateString()}
        </p>
      )}

      {/* Share Button */}
      {unlocked && showDetails && (
        <button className="share-badge-button" onClick={handleShare}>
          📤 Share Badge
        </button>
      )}

      {/* Locked Badge */}
      {!unlocked && <span className="badge-locked">🔒</span>}
    </div>
  );
};

export default BadgeCard;
