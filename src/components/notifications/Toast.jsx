import React, { useEffect } from 'react';
import './Toast.css';

/**
 * Toast/Notification UI Component
 * Displays individual notifications with animations
 */
export function Toast({ notification, onClose }) {
  useEffect(() => {
    const handleClose = () => onClose(notification.id);
    return () => clearTimeout(handleClose);
  }, [notification.id, onClose]);

  const { type, message } = notification;

  // Icon and color mapping
  const iconMap = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    loading: '⏳',
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">{iconMap[type] || '📢'}</span>
        <span className="toast-message">{message}</span>
      </div>
      <button
        className="toast-close"
        onClick={() => onClose(notification.id)}
        aria-label="Close notification"
      >
        ✕
      </button>
      {type === 'loading' && (
        <div className="toast-loading-bar"></div>
      )}
    </div>
  );
}

/**
 * Toast Container - Manages all notifications
 */
export function ToastContainer({ notifications, onRemove }) {
  return (
    <div className="toast-container">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={onRemove}
        />
      ))}
    </div>
  );
}
