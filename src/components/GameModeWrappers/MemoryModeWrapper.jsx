/**
 * MemoryModeWrapper.jsx
 * 
 * Memory/Concentration game mode
 * - Cards are hidden until revealed
 * - Match pairs within time limit
 * - Progressive difficulty
 * - Score based on efficiency
 */

import React, { useState, useEffect, useRef } from 'react';
import './GameModeWrappers.css';

export default function MemoryModeWrapper({
  children,
  onComplete,
  baseXP = 100,
  difficulty = 'medium',
  timeLimit = 120,
}) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isGameActive, setIsGameActive] = useState(true);
  const [matchesFound, setMatchesFound] = useState(0);
  const [movesCount, setMovesCount] = useState(0);
  const timerRef = useRef(null);

  // Adjust difficulty
  const cardsCount = difficulty === 'easy' ? 4 : 
                     difficulty === 'hard' ? 16 : 
                     8; // medium

  useEffect(() => {
    if (!isGameActive) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isGameActive]);

  const calculateMemoryScore = () => {
    // Score based on: matches found, efficiency, time remaining
    const matchPoints = matchesFound * 50;
    const efficiencyBonus = Math.ceil((matchesFound / (movesCount || 1)) * 100);
    const timeBonus = Math.ceil((timeRemaining / timeLimit) * 100);
    
    return matchPoints + efficiencyBonus + timeBonus;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (timeRemaining / timeLimit) * 100;
  const isCritical = timeRemaining <= 10;
  const memoryScore = calculateMemoryScore();
  const memoryXP = Math.ceil((memoryScore / 500) * baseXP);

  return (
    <div className="game-mode-wrapper memory-mode">
      {/* Memory Header */}
      <div className={`memory-header ${isCritical ? 'critical' : ''}`}>
        <div className="memory-stats">
          <div className="stat-item">
            <span className="stat-label">Time</span>
            <span className={`stat-value ${isCritical ? 'blink' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Matches</span>
            <span className="stat-value">{matchesFound}/{cardsCount / 2}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{movesCount}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Score</span>
            <span className="stat-value">{memoryScore}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="memory-progress-bar">
          <div 
            className={`progress-fill ${isCritical ? 'critical' : ''}`}
            style={{ width: `${(matchesFound / (cardsCount / 2)) * 100}%` }}
          />
        </div>

        {/* Status */}
        {!isGameActive && (
          <div className={`memory-status ${matchesFound === cardsCount / 2 ? 'won' : 'lost'}`}>
            {matchesFound === cardsCount / 2 ? '🎉 You Won!' : '⏰ Time\'s Up!'}
          </div>
        )}
      </div>

      {/* Game Content */}
      <div className={`game-mode-content memory ${!isGameActive ? 'disabled' : ''}`}>
        {!isGameActive && (
          <div className="memory-overlay">
            <div className="memory-result">
              {matchesFound === cardsCount / 2 ? (
                <>
                  <h3>🎉 Amazing!</h3>
                  <p>You matched all pairs!</p>
                  <p className="result-stats">
                    Score: {memoryScore} | Efficiency: {((matchesFound / (movesCount || 1)) * 100).toFixed(1)}%
                  </p>
                </>
              ) : (
                <>
                  <h3>⏰ Time's Up!</h3>
                  <p>You found {matchesFound} pairs</p>
                  <p className="result-stats">
                    Keep practicing to get better!
                  </p>
                </>
              )}
            </div>
          </div>
        )}
        {children}
      </div>

      {/* Footer */}
      <div className="game-mode-footer memory">
        <div className="footer-info">
          <span className="badge memory">🧠 Memory Mode</span>
          <span className="memory-xp">+{memoryXP} XP</span>
          <span className="difficulty-indicator">
            {difficulty === 'easy' ? '⭐ Easy' : 
             difficulty === 'hard' ? '⭐⭐⭐ Hard' : 
             '⭐⭐ Medium'}
          </span>
        </div>
        <div className="memory-tip">
          <p>💡 Tip: Remember card positions to match pairs faster!</p>
        </div>
      </div>
    </div>
  );
}
