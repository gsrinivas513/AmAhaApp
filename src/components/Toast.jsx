// src/components/Toast.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import "../components/toast.css";

const ToastContext = createContext();

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "error", duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    
    setToasts(prev => [...prev, { id, message, type }]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Convenience methods
  const notify = {
    success: (message, duration = 3000) => showToast(message, "success", duration),
    error: (message, duration = 4000) => showToast(message, "error", duration),
    warning: (message, duration = 4000) => showToast(message, "warning", duration),
    info: (message, duration = 3000) => showToast(message, "info", duration),
    loading: (message) => showToast(message, "loading", 0),
  };

  // Icon mapping
  const iconMap = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    loading: '⏳',
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast, notify }}>
      {children}

      {/* Toast Container */}
      <div className="toast-container-modern">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            role="alert"
            aria-live="polite"
          >
            <div className="toast-content">
              <span className="toast-icon">{iconMap[toast.type] || '📢'}</span>
              <span className="toast-message">{toast.message}</span>
            </div>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              ✕
            </button>
            {toast.type === 'loading' && (
              <div className="toast-loading-bar"></div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}