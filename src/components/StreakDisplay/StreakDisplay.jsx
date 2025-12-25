/**
 * StreakDisplay.jsx
 * 
 * Shows user's current streak with celebrations and milestones
 * Displays in header or home page
 */

import React, { useState, useEffect } from 'react';
import { getUserStreak } from '../../services/dailyChallengeService';
import { useAuth } from '../../components/AuthProvider';
import './StreakDisplay.css';

const STREAK_MILESTONES = [
  { days: 3, emoji: '🔥', label: '3-Day', reward: 50 },
  { days: 7, emoji: '🔥', label: '1-Week', reward: 100 },
  { days: 14, emoji: '🔥🔥', label: '2-Week', reward: 200 },
  { days: 30, emoji: '🔥🔥🔥', label: '1-Month', reward: 500 },
  { days: 60, emoji: '🔥🔥🔥🔥', label: '2-Month', reward: 1000 },
  { days: 100, emoji: '🔥🔥🔥🔥🔥', label: '100-Day', reward: 2500 },
];

export default function StreakDisplay({ compact = false }) {
  const { user } = useAuth();
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [milestone, setMilestone] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadStreak = async () => {
      try {
        const streakData = await getUserStreak(user.uid);
        setStreak(streakData);

        // Check if just reached a milestone
        if (streakData?.currentStreak) {
          const reachedMilestone = STREAK_MILESTONES.find(
            (m) => m.days === streakData.currentStreak
          );
          if (reachedMilestone) {
            setMilestone(reachedMilestone);
            setShowMilestoneModal(true);
          }
        }
      } catch (error) {
        console.error('Error loading streak:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStreak();
  }, [user]);

  if (loading || !streak) return null;

  const { currentStreak = 0, longestStreak = 0 } = streak;

  // Get milestone animation data
  const nextMilestone = STREAK_MILESTONES.find((m) => m.days > currentStreak);
  const daysUntilNext = nextMilestone ? nextMilestone.days - currentStreak : null;

  if (compact) {
    return (
      <div className="streak-display-compact">
        <div className="streak-badge">
          <span className="streak-emoji">🔥</span>
          <span className="streak-count">{currentStreak}</span>
        </div>
        {daysUntilNext && (
          <div className="streak-next">
            <small>{daysUntilNext} days to {nextMilestone.label}</small>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Full Streak Display */}
      <div className="streak-display-full">
        {/* Main Streak Card */}
        <div className="streak-card">
          <div className="streak-header">
            <h3>🔥 Your Streak</h3>
            <span className="streak-icon">🏆</span>
          </div>

          <div className="streak-stats">
            <div className="streak-stat">
              <div className="stat-label">Current Streak</div>
              <div className="stat-value current-streak">
                {currentStreak}
                <span className="stat-unit">days</span>
              </div>
            </div>

            <div className="streak-stat">
              <div className="stat-label">Longest Streak</div>
              <div className="stat-value longest-streak">
                {longestStreak}
                <span className="stat-unit">days</span>
              </div>
            </div>
          </div>

          {/* Streak Progress */}
          <div className="streak-progress-section">
            {nextMilestone ? (
              <>
                <div className="progress-label">
                  Next Milestone: {nextMilestone.label}
                  <span className="milestone-emoji">{nextMilestone.emoji}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${
                        ((currentStreak - (STREAK_MILESTONES.find(
                          (m) => m.days < currentStreak
                        )?.days || 0)) /
                          (nextMilestone.days -
                            (STREAK_MILESTONES.find((m) => m.days < currentStreak)?.days ||
                              0))) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <div className="progress-text">
                  {daysUntilNext} days to go! ({nextMilestone.reward} XP reward)
                </div>
              </>
            ) : (
              <div className="milestone-complete">
                <p>🎉 Amazing! You've reached the ultimate streak milestone!</p>
              </div>
            )}
          </div>

          {/* Call to Action */}
          {currentStreak > 0 && (
            <div className="streak-cta">
              <p>✨ Come back tomorrow to keep your streak alive!</p>
            </div>
          )}

          {currentStreak === 0 && (
            <div className="streak-start">
              <p>🚀 Start a streak by completing today's challenge!</p>
              <button className="cta-button">Play Daily Challenge</button>
            </div>
          )}
        </div>

        {/* Milestones Display */}
        <div className="milestones-section">
          <h4>🎯 Milestones</h4>
          <div className="milestones-grid">
            {STREAK_MILESTONES.map((m) => (
              <div
                key={m.days}
                className={`milestone-item ${currentStreak >= m.days ? 'unlocked' : 'locked'}`}
              >
                <div className="milestone-emoji">{m.emoji}</div>
                <div className="milestone-label">{m.label}</div>
                <div className="milestone-reward">+{m.reward} XP</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestone Celebration Modal */}
      {showMilestoneModal && milestone && (
        <MilestoneCelebration
          milestone={milestone}
          onClose={() => setShowMilestoneModal(false)}
        />
      )}
    </>
  );
}

/**
 * MilestoneCelebration Component
 * Shows a fun celebration when user reaches a milestone
 */
function MilestoneCelebration({ milestone, onClose }) {
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConfetti(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="milestone-modal-overlay" onClick={onClose}>
      <div className="milestone-modal" onClick={(e) => e.stopPropagation()}>
        {confetti && <div className="confetti-animation" />}

        <div className="milestone-celebration">
          <div className="celebration-emoji" style={{ fontSize: '4rem' }}>
            {milestone.emoji}
          </div>

          <h2>Congratulations!</h2>
          <p className="milestone-text">
            You've reached a {milestone.label} streak!
          </p>

          <div className="reward-box">
            <span className="reward-emoji">⭐</span>
            <span className="reward-text">+{milestone.reward} XP</span>
          </div>

          <p className="encouragement">
            Keep it up! Come back tomorrow to extend your streak.
          </p>

          <button className="close-button" onClick={onClose}>
            🎉 Keep Going
          </button>
        </div>
      </div>
    </div>
  );
}
