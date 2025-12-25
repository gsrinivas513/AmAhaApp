/**
 * GameModeSelector.jsx
 * 
 * Allows user to select which game mode to play
 * - Shows all available modes with descriptions
 * - Indicates XP/reward multiplier for each
 * - Recommends mode based on user's level/history
 */

import React, { useState } from 'react';
import './GameModeSelector.css';

const GAME_MODES = [
  {
    id: 'timed',
    name: 'Timed Mode',
    emoji: '⏱️',
    color: '#0369A1',
    description: 'Beat the clock! Answer within the time limit.',
    multiplier: 1.5,
    timeLimit: '60 seconds per question',
    difficulty: 'medium',
    badge: '2x Speed Bonus',
    icon: '⏱️',
  },
  {
    id: 'speed',
    name: 'Speed Challenge',
    emoji: '⚡',
    color: '#D97706',
    description: 'Answer as fast as you can! Faster = More XP.',
    multiplier: 2.0,
    timeLimit: '30 seconds per question',
    difficulty: 'hard',
    badge: 'Speed Multiplier',
    icon: '⚡',
    recommended: true,
  },
  {
    id: 'practice',
    name: 'Practice Mode',
    emoji: '📚',
    color: '#047857',
    description: 'Learn at your own pace. Unlimited attempts!',
    multiplier: 0.25,
    timeLimit: 'No time limit',
    difficulty: 'easy',
    badge: 'Unlimited Attempts',
    icon: '📚',
  },
  {
    id: 'challenge',
    name: 'Challenge Mode',
    emoji: '🎯',
    color: '#7C3AED',
    description: 'Standard mode. One attempt, full scoring.',
    multiplier: 1.0,
    timeLimit: 'Variable',
    difficulty: 'medium',
    badge: 'Full XP',
    icon: '🎯',
  },
];

export default function GameModeSelector({
  onSelectMode,
  userLevel = 'beginner',
  currentXP = 0,
  suggestedMode = 'challenge',
}) {
  const [selectedMode, setSelectedMode] = useState(suggestedMode);
  const [showDescription, setShowDescription] = useState(null);

  const handleSelectMode = (modeId) => {
    setSelectedMode(modeId);
    if (onSelectMode) {
      onSelectMode(modeId);
    }
  };

  const getModeRecommendation = (mode) => {
    if (mode.id === suggestedMode) {
      return '⭐ Recommended for you';
    }
    if (mode.recommended) {
      return '🔥 Popular!';
    }
    return null;
  };

  return (
    <div className="game-mode-selector">
      {/* Header */}
      <div className="selector-header">
        <h2>🎮 Choose Your Game Mode</h2>
        <p>Different modes offer different challenges and rewards</p>
      </div>

      {/* User Info */}
      <div className="user-info-bar">
        <span className="user-level">Level: {userLevel}</span>
        <span className="user-xp">Current XP: {currentXP}</span>
      </div>

      {/* Mode Grid */}
      <div className="modes-grid">
        {GAME_MODES.map((mode) => (
          <div
            key={mode.id}
            className={`mode-card ${selectedMode === mode.id ? 'selected' : ''}`}
            style={{
              '--mode-color': mode.color,
            }}
            onClick={() => handleSelectMode(mode.id)}
          >
            {/* Recommended Badge */}
            {getModeRecommendation(mode) && (
              <div className="recommendation-badge">
                {getModeRecommendation(mode)}
              </div>
            )}

            {/* Card Header */}
            <div className="mode-header">
              <span className="mode-emoji">{mode.emoji}</span>
              <h3 className="mode-name">{mode.name}</h3>
            </div>

            {/* Mode Stats */}
            <div className="mode-stats">
              <div className="stat">
                <span className="stat-label">Multiplier</span>
                <span className="stat-value">
                  {mode.multiplier}x
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Time</span>
                <span className="stat-value stat-small">
                  {mode.timeLimit}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Difficulty</span>
                <span className={`stat-value difficulty-${mode.difficulty}`}>
                  {mode.difficulty.charAt(0).toUpperCase() + mode.difficulty.slice(1)}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="mode-description">{mode.description}</p>

            {/* Badge */}
            <div className="mode-badge">{mode.badge}</div>

            {/* Select Button */}
            <button
              className={`select-button ${selectedMode === mode.id ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectMode(mode.id);
              }}
            >
              {selectedMode === mode.id ? '✓ Selected' : 'Select'}
            </button>
          </div>
        ))}
      </div>

      {/* Mode Details */}
      {selectedMode && (
        <div className="mode-details">
          <div className="details-header">
            {GAME_MODES.find((m) => m.id === selectedMode)?.emoji} Mode Details
          </div>
          <div className="details-content">
            <p>
              {GAME_MODES.find((m) => m.id === selectedMode)?.description}
            </p>

            {/* Mode-specific tips */}
            <div className="mode-tips">
              {selectedMode === 'timed' && (
                <>
                  <h4>⏱️ Timed Mode Tips:</h4>
                  <ul>
                    <li>You have 60 seconds per question</li>
                    <li>Answer quickly and accurately for maximum XP</li>
                    <li>Earn 2x speed bonus for beating the clock</li>
                  </ul>
                </>
              )}

              {selectedMode === 'speed' && (
                <>
                  <h4>⚡ Speed Challenge Tips:</h4>
                  <ul>
                    <li>Only 30 seconds per question!</li>
                    <li>The faster you answer, the more XP you earn</li>
                    <li>Up to 3x multiplier for lightning-fast answers</li>
                  </ul>
                </>
              )}

              {selectedMode === 'practice' && (
                <>
                  <h4>📚 Practice Mode Tips:</h4>
                  <ul>
                    <li>Take as many attempts as you need</li>
                    <li>Use hints and explanations freely</li>
                    <li>Great for learning new concepts</li>
                  </ul>
                </>
              )}

              {selectedMode === 'challenge' && (
                <>
                  <h4>🎯 Challenge Mode Tips:</h4>
                  <ul>
                    <li>Single attempt with standard timing</li>
                    <li>Earn full XP rewards</li>
                    <li>Perfect for testing your knowledge</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Start Button */}
      <div className="selector-footer">
        <button className="start-button">
          Start {selectedMode ? GAME_MODES.find((m) => m.id === selectedMode)?.name : 'Game'}
        </button>
      </div>
    </div>
  );
}
