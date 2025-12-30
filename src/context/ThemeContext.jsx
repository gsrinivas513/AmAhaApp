import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('amaha-dark-mode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Save to localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('amaha-dark-mode', JSON.stringify(isDarkMode));
    // Apply to document
    if (isDarkMode) {
      document.documentElement.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#0f172a';
      document.body.style.color = '#f1f5f9';
    } else {
      document.documentElement.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#1f2937';
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
