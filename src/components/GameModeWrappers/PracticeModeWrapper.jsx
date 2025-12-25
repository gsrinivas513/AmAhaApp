/**
 * PracticeModeWrapper.jsx
 * 
 * Unlimited practice mode
 * - Unlimited attempts/retries
 * - Shows hints and explanations
 * - Lower XP rewards
 * - Full feedback after each attempt
 */

import React, { useState } from 'react';
import './GameModeWrappers.css';

export default function PracticeModeWrapper({
  children,
  onComplete,
  baseXP = 100,
  hints = true,
  explanations = true,
}) {
  const [attemptCount, setAttemptCount] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Practice mode awards lower XP (25% of normal)
  const practiceXP = Math.ceil(baseXP * 0.25);

  const handleAttempt = () => {
    setAttemptCount((prev) => prev + 1);
  };

  const handleGetHint = () => {
    setShowHints(true);
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  return (
    <div className="game-mode-wrapper practice-mode">
      {/* Practice Header */}
      <div className="practice-header">
        <div className="practice-info">
          <span className="badge practice">📚 Practice Mode</span>
          <span className="practice-stat">Attempt #{attemptCount + 1}</span>
          <span className="practice-xp">+{practiceXP} XP per answer</span>
        </div>

        <div className="practice-message">
          <p>✨ No limits! Try as many times as you need to master this.</p>
        </div>
      </div>

      {/* Content */}
      <div className="game-mode-content practice">
        {children && React.cloneElement(children, {
          onAttempt: handleAttempt,
          showHints,
          showExplanation,
        })}
      </div>

      {/* Practice Tools */}
      <div className="practice-tools">
        <div className="tools-row">
          {hints && (
            <button
              className="tool-button hint-button"
              onClick={handleGetHint}
              disabled={showHints}
            >
              <span className="tool-icon">💡</span>
              <span className="tool-text">
                {showHints ? 'Hint Shown' : 'Get a Hint'}
              </span>
            </button>
          )}

          {explanations && (
            <button
              className="tool-button explanation-button"
              onClick={handleShowExplanation}
              disabled={showExplanation}
            >
              <span className="tool-icon">📖</span>
              <span className="tool-text">
                {showExplanation ? 'Explanation Shown' : 'Show Explanation'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="game-mode-footer practice">
        <div className="footer-info">
          <span className="practice-note">
            💪 Keep practicing! You'll get better each time.
          </span>
        </div>
      </div>

      {/* Feedback Messages */}
      {feedback && (
        <div className={`feedback-message ${feedback.type}`}>
          {feedback.type === 'correct' && '✅ Correct!'}
          {feedback.type === 'incorrect' && '❌ Try again!'}
          {feedback.message && <p>{feedback.message}</p>}
        </div>
      )}
    </div>
  );
}
