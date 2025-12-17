// src/components/Toast.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import "../components/toast.css";

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000); // auto-hide
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className={`toast-container shake ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}