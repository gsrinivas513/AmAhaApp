/**
 * THEME CONTEXT - Multi-theme support
 * Light, Dark, and Alternative themes
 * PuzzleFree-inspired color palettes
 */

import React, { createContext, useState, useEffect } from 'react';

// Light Theme - Clean, bright, professional
const lightTheme = {
  name: 'light',
  background: '#ffffff',
  surfacePrimary: '#f8f9fa',
  surfaceSecondary: '#eeeff2',
  border: '#e0e0e6',
  textPrimary: '#1a1a2e',
  textSecondary: '#5a5a6e',
  textTertiary: '#8a8a9e',
  accentPrimary: '#ff6b35', // Warm orange
  accentSecondary: '#ff8a50',
  accentTertiary: '#ffb380',
  success: '#2ecc71',
  warning: '#f39c12',
  error: '#e74c3c',
  // Gradients
  gradientBg: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  gradientAccent: 'linear-gradient(135deg, #ff6b35 0%, #ff8a50 100%)',
  // Effects
  shadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  shadowHover: '0 8px 30px rgba(0, 0, 0, 0.12)',
};

// Dark Theme - Deep, sophisticated, modern
const darkTheme = {
  name: 'dark',
  background: '#0f1419',
  surfacePrimary: '#1a1e27',
  surfaceSecondary: '#252b38',
  border: '#3a4152',
  textPrimary: '#f5f7fa',
  textSecondary: '#b0b8c8',
  textTertiary: '#8a92a2',
  accentPrimary: '#4a9eff', // Cool blue
  accentSecondary: '#6bb3ff',
  accentTertiary: '#8ac7ff',
  success: '#2ecc71',
  warning: '#f39c12',
  error: '#e74c3c',
  // Gradients
  gradientBg: 'linear-gradient(135deg, #0f1419 0%, #1a1e27 100%)',
  gradientAccent: 'linear-gradient(135deg, #4a9eff 0%, #6bb3ff 100%)',
  // Effects
  shadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  shadowHover: '0 8px 30px rgba(0, 0, 0, 0.4)',
};

// Purple Theme
const purpleTheme = {
  name: 'purple',
  background: '#faf9ff',
  surfacePrimary: '#f3f1ff',
  surfaceSecondary: '#ede8ff',
  border: '#ddd5f3',
  textPrimary: '#2d1b4e',
  textSecondary: '#6b5b8a',
  textTertiary: '#9a8aa8',
  accentPrimary: '#7c3aed',
  accentSecondary: '#a855f7',
  accentTertiary: '#d8b4fe',
  success: '#2ecc71',
  warning: '#f39c12',
  error: '#e74c3c',
  gradientBg: 'linear-gradient(135deg, #faf9ff 0%, #f3f1ff 100%)',
  gradientAccent: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
  shadow: '0 4px 20px rgba(124, 58, 237, 0.1)',
  shadowHover: '0 8px 30px rgba(124, 58, 237, 0.15)',
};

// Teal Theme
const tealTheme = {
  name: 'teal',
  background: '#f0fffe',
  surfacePrimary: '#e6fffe',
  surfaceSecondary: '#d4ffff',
  border: '#a8f3f3',
  textPrimary: '#0d4d4a',
  textSecondary: '#2d7a76',
  textTertiary: '#5a9895',
  accentPrimary: '#14b8a6',
  accentSecondary: '#2dd4bf',
  accentTertiary: '#5eead4',
  success: '#2ecc71',
  warning: '#f39c12',
  error: '#e74c3c',
  gradientBg: 'linear-gradient(135deg, #f0fffe 0%, #e6fffe 100%)',
  gradientAccent: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
  shadow: '0 4px 20px rgba(20, 184, 166, 0.1)',
  shadowHover: '0 8px 30px rgba(20, 184, 166, 0.15)',
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('light');

  const themes = {
    light: lightTheme,
    dark: darkTheme,
    purple: purpleTheme,
    teal: tealTheme,
  };

  const currentTheme = themes[themeName];

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem('amaha-theme');
    if (saved && ['light', 'dark', 'purple', 'teal'].includes(saved)) {
      setThemeName(saved);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.style.backgroundColor = currentTheme.background;
    document.body.style.backgroundColor = currentTheme.background;
    localStorage.setItem('amaha-theme', themeName);
  }, [themeName, currentTheme]);

  const selectTheme = (name) => {
    if (themes[name]) {
      setThemeName(name);
    }
  };

  const value = {
    themeName,
    selectTheme,
    theme: currentTheme,
    themes: Object.keys(themes),
  };

  return (
    <ThemeContext.Provider value={value}>
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
