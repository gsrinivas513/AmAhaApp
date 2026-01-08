/**
 * Reward Notification Component
 * Toast-style notification for XP, coins, achievements, and badges
 */

import React, { useEffect, useState } from 'react';
import '../styles/reward-notification.css';

const RewardNotification = ({ type = 'xp', amount, title, message, duration = 3000, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onClose && onClose();
      }, 300); // Match animation duration
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'xp':
        return '⚡';
      case 'coins':
        return '💰';
      case 'achievement':
        return '🎖️';
      case 'badge':
        return '🏅';
      case 'level':
        return '🎉';
      default:
        return '✨';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'xp':
        return '#ff6600';
      case 'coins':
        return '#ffc107';
      case 'achievement':
        return '#9c27b0';
      case 'badge':
        return '#ff5722';
      case 'level':
        return '#4caf50';
      default:
        return '#2196f3';
    }
  };

  return (
    <div
      className={`reward-notification ${type} ${isExiting ? 'exiting' : 'entering'}`}
      style={{ '--reward-color': getColor() }}
    >
      <div className="notification-content">
        <div className="notification-icon">{getIcon()}</div>
        <div className="notification-text">
          {title && <h3 className="notification-title">{title}</h3>}
          {message && <p className="notification-message">{message}</p>}
          {amount && (
            <p className="notification-amount">
              +{amount} {type === 'xp' ? 'XP' : type === 'coins' ? 'Coins' : type}
            </p>
          )}
        </div>
      </div>
      <div className="notification-progress">
        <div
          className="progress-bar"
          style={{
            animation: `shrink ${duration}ms linear forwards`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default RewardNotification;
