import React, { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext();

/**
 * Notification Manager Context Provider
 * Provides toast/notification functionality throughout the app
 */
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  /**
   * Add a new notification
   * @param {Object} options - Notification options
   * @param {string} options.message - Notification message
   * @param {string} options.type - 'success' | 'error' | 'warning' | 'info'
   * @param {number} options.duration - Duration in ms (0 = persistent)
   * @param {string} options.id - Unique ID (auto-generated if not provided)
   * @param {function} options.onClose - Callback when notification closes
   */
  const addNotification = useCallback((options) => {
    const {
      message,
      type = 'info',
      duration = 4000,
      id = `notification-${Date.now()}-${Math.random()}`,
      onClose,
    } = options;

    // Add notification to list
    setNotifications((prev) => [
      ...prev,
      {
        id,
        message,
        type,
        duration,
        onClose,
        timestamp: Date.now(),
      },
    ]);

    // Auto-remove after duration (if duration > 0)
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  /**
   * Remove a specific notification
   */
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === id);
      if (notification?.onClose) {
        notification.onClose();
      }
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  /**
   * Remove all notifications
   */
  const clearAll = useCallback(() => {
    setNotifications((prev) => {
      prev.forEach((n) => {
        if (n.onClose) {
          n.onClose();
        }
      });
      return [];
    });
  }, []);

  /**
   * Convenience methods for common notification types
   */
  const notify = {
    success: (message, options = {}) =>
      addNotification({
        message,
        type: 'success',
        duration: 3000,
        ...options,
      }),
    error: (message, options = {}) =>
      addNotification({
        message,
        type: 'error',
        duration: 5000,
        ...options,
      }),
    warning: (message, options = {}) =>
      addNotification({
        message,
        type: 'warning',
        duration: 4000,
        ...options,
      }),
    info: (message, options = {}) =>
      addNotification({
        message,
        type: 'info',
        duration: 4000,
        ...options,
      }),
    loading: (message, options = {}) =>
      addNotification({
        message,
        type: 'loading',
        duration: 0, // Persistent until removed
        ...options,
      }),
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    notify,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
