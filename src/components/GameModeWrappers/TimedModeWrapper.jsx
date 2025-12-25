/**
 * TimedModeWrapper.jsx
 * 
 * Wraps quiz/puzzle content with a countdown timer
 * - Displays remaining time
 * - Visual urgency when < 10 seconds
 * - Calls onTimeUp when timer expires
 * - Prevents interaction after time expires
 */

import React, { useState, useEffect } from 'react';
import './GameModeWrappers.css';

export default function TimedModeWrapper({
  children,
  timeLimit = 60,
  onTimeUp,
  onComplete,
  difficulty = 'medium',
}) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

  // Adjust time based on difficulty
  const adjustedTime = difficulty === 'easy' ? timeLimit * 1.2 : 
                       difficulty === 'hard' ? timeLimit * 0.8 : 
                       timeLimit;

  useEffect(() => {
    if (!timerStarted || isTimeUp) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
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

  // Auto-start timer on mount
  useEffect(() => {
    setTimerStarted(true);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (timeRemaining / adjustedTime) * 100;
  const isUrgent = timeRemaining <= 10;
  const isCritical = timeRemaining <= 5;

  return (
    <div className="game-mode-wrapper timed-mode">
      {/* Timer Header */}
      <div className={`timer-header ${isUrgent ? 'urgent' : ''} ${isCritical ? 'critical' : ''}`}>
        <div className="timer-display">
          <span className="timer-icon">⏱️</span>
          <span className={`timer-time ${isCritical ? 'blink' : ''}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="timer-progress-bar">
          <div 
            className={`timer-progress-fill ${isUrgent ? 'urgent' : ''}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Status message */}
        {isTimeUp ? (
          <div className="timer-status time-up">
            ⏰ Time's up!
          </div>
        ) : isUrgent ? (
          <div className="timer-status urgent">
            ⚡ Hurry up!
          </div>
        ) : null}
      </div>

      {/* Content - Disabled if time up */}
      <div className={`game-mode-content ${isTimeUp ? 'disabled' : ''}`}>
        {isTimeUp && (
          <div className="time-up-overlay">
            <div className="time-up-message">
              <h3>⏰ Time's Up!</h3>
              <p>Your time limit for this question has expired.</p>
            </div>
          </div>
        )}
        {children}
      </div>

      {/* Footer with stats */}
      <div className="game-mode-footer timed">
        <div className="footer-info">
          <span className="badge">⏱️ Timed Mode</span>
          <span className="score-multiplier">2x Speed Bonus</span>
        </div>
      </div>
    </div>
  );
}
