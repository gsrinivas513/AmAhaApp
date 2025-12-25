/**
 * SpeedModeWrapper.jsx
 * 
 * Speed challenge mode
 * - Shorter time per question
 * - Increasing XP multiplier based on speed
 * - Penalty XP for slower answers
 * - Visual feedback on speed
 */

import React, { useState, useEffect } from 'react';
import './GameModeWrappers.css';

export default function SpeedModeWrapper({
  children,
  timeLimit = 30,
  onComplete,
  onTimeUp,
  baseXP = 100,
}) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timerStarted, setTimerStarted] = useState(true);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);

  useEffect(() => {
    if (!timerStarted || isTimeUp) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        setTotalTimeTaken((t) => t + 1);
        if (prev <= 1) {
          setIsTimeUp(true);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerStarted, isTimeUp, onTimeUp]);

  // Calculate speed bonus/penalty
  const calculateSpeedXP = () => {
    if (totalTimeTaken <= 5) return baseXP * 3; // 3x bonus
    if (totalTimeTaken <= 10) return baseXP * 2.5; // 2.5x bonus
    if (totalTimeTaken <= 20) return baseXP * 2; // 2x bonus
    if (totalTimeTaken <= 30) return baseXP * 1.5; // 1.5x bonus
    return baseXP * 0.5; // 50% penalty if took too long
  };

  const speedXP = calculateSpeedXP();
  const multiplier = speedXP / baseXP;
  const speedRating = 
    totalTimeTaken <= 5 ? '⚡⚡⚡ LIGHTNING' :
    totalTimeTaken <= 10 ? '⚡⚡ SUPER FAST' :
    totalTimeTaken <= 20 ? '⚡ FAST' :
    totalTimeTaken <= 30 ? 'NORMAL' :
    '🐢 SLOW';

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (timeRemaining / timeLimit) * 100;
  const isCritical = timeRemaining <= 5;

  return (
    <div className="game-mode-wrapper speed-mode">
      {/* Speed Timer Header */}
      <div className={`timer-header speed ${isCritical ? 'critical' : ''}`}>
        <div className="speed-display">
          <div className="timer-section">
            <span className="timer-icon">⚡</span>
            <span className={`timer-time ${isCritical ? 'blink' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>

          <div className="speed-rating">
            {speedRating}
          </div>
        </div>

        {/* Progress bar */}
        <div className="timer-progress-bar">
          <div 
            className={`timer-progress-fill speed ${isCritical ? 'critical' : ''}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Status */}
        {isTimeUp && (
          <div className="timer-status critical">
            ⏰ Time's up!
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`game-mode-content ${isTimeUp ? 'disabled' : ''}`}>
        {isTimeUp && (
          <div className="time-up-overlay">
            <div className="time-up-message">
              <h3>⏰ Time's Up!</h3>
              <p>Answer faster next time to earn more XP!</p>
            </div>
          </div>
        )}
        {children}
      </div>

      {/* Footer with speed stats */}
      <div className="game-mode-footer speed">
        <div className="footer-info">
          <span className="badge">⚡ Speed Mode</span>
          <span className="score-multiplier">
            {multiplier.toFixed(1)}x Multiplier
          </span>
          {totalTimeTaken > 0 && (
            <span className="speed-xp">
              {Math.round(speedXP)} XP ({speedRating})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
