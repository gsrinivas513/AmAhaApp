/**
 * THEME CONTEXT - Multi-theme support
 * Light, Dark, and many color palettes
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
  gradientBg: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  gradientAccent: 'linear-gradient(135deg, #ff6b35 0%, #ff8a50 100%)',
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
  gradientBg: 'linear-gradient(135deg, #0f1419 0%, #1a1e27 100%)',
  gradientAccent: 'linear-gradient(135deg, #4a9eff 0%, #6bb3ff 100%)',
  shadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  shadowHover: '0 8px 30px rgba(0, 0, 0, 0.4)',
};

// Color Theme Variants
const colorThemes = {
  'blue-orange': {
    name: 'Blue Orange',
    displayName: 'Blue Orange',
    color: '#0066cc',
    background: '#f0f5ff',
    surfacePrimary: '#e6eeff',
    surfaceSecondary: '#d9e4ff',
    border: '#99b3ff',
    textPrimary: '#001a66',
    textSecondary: '#334d80',
    accentPrimary: '#0066cc',
    accentSecondary: '#3385ff',
    accentTertiary: '#66a3ff',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    gradientBg: 'linear-gradient(135deg, #f0f5ff 0%, #e6eeff 100%)',
    gradientAccent: 'linear-gradient(135deg, #0066cc 0%, #3385ff 100%)',
    shadow: '0 4px 20px rgba(0, 102, 204, 0.1)',
    shadowHover: '0 8px 30px rgba(0, 102, 204, 0.15)',
  },
  chocolate: {
    name: 'Chocolate',
    displayName: 'Chocolate',
    color: '#8b4513',
    background: '#fef6f1',
    surfacePrimary: '#fdf0e6',
    surfaceSecondary: '#f5e6d3',
    border: '#d9b8a0',
    textPrimary: '#3e2723',
    textSecondary: '#5d4037',
    accentPrimary: '#8b4513',
    accentSecondary: '#a0522d',
    accentTertiary: '#bf8f68',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    gradientBg: 'linear-gradient(135deg, #fef6f1 0%, #fdf0e6 100%)',
    gradientAccent: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
    shadow: '0 4px 20px rgba(139, 69, 19, 0.1)',
    shadowHover: '0 8px 30px rgba(139, 69, 19, 0.15)',
  },
  'dark-gray': {
    name: 'Dark Gray',
    displayName: 'Dark Gray',
    color: '#4a4a4a',
    background: '#f5f5f5',
    surfacePrimary: '#efefef',
    surfaceSecondary: '#e8e8e8',
    border: '#cccccc',
    textPrimary: '#2a2a2a',
    textSecondary: '#4a4a4a',
    accentPrimary: '#4a4a4a',
    accentSecondary: '#666666',
    accentTertiary: '#999999',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    gradientBg: 'linear-gradient(135deg, #f5f5f5 0%, #efefef 100%)',
    gradientAccent: 'linear-gradient(135deg, #4a4a4a 0%, #666666 100%)',
    shadow: '0 4px 20px rgba(74, 74, 74, 0.1)',
    shadowHover: '0 8px 30px rgba(74, 74, 74, 0.15)',
  },
  'dark-blue': {
    name: 'Dark Blue',
    displayName: 'Dark Blue',
    color: '#003d7a',
    background: '#f0f4fa',
    surfacePrimary: '#e6ecf5',
    surfaceSecondary: '#d9e3f0',
    border: '#99b3d9',
    textPrimary: '#001a4d',
    textSecondary: '#1a3366',
    accentPrimary: '#003d7a',
    accentSecondary: '#0052a3',
    accentTertiary: '#3385ff',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    gradientBg: 'linear-gradient(135deg, #f0f4fa 0%, #e6ecf5 100%)',
    gradientAccent: 'linear-gradient(135deg, #003d7a 0%, #0052a3 100%)',
    shadow: '0 4px 20px rgba(0, 61, 122, 0.1)',
    shadowHover: '0 8px 30px rgba(0, 61, 122, 0.15)',
  },
  'deep-purple': {
    name: 'Deep Purple',
    displayName: 'Deep Purple',
    color: '#4a148c',
    background: '#f9f5fe',
    surfacePrimary: '#f0e6f8',
    surfaceSecondary: '#e8d9f3',
    border: '#d4a5e6',
    textPrimary: '#2e0854',
    textSecondary: '#5d4084',
    accentPrimary: '#4a148c',
    accentSecondary: '#6a1b9a',
    accentTertiary: '#9c27b0',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    gradientBg: 'linear-gradient(135deg, #f9f5fe 0%, #f0e6f8 100%)',
    gradientAccent: 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 100%)',
    shadow: '0 4px 20px rgba(74, 20, 140, 0.1)',
    shadowHover: '0 8px 30px rgba(74, 20, 140, 0.15)',
  },
  'deep-red': {
    name: 'Deep Red',
    displayName: 'Deep Red',
    color: '#b71c1c',
    background: '#fef5f5',
    surfacePrimary: '#fde8e8',
    surfaceSecondary: '#fbdbdb',
    border: '#ff9999',
    textPrimary: '#5c0a0a',
    textSecondary: '#8b2424',
    accentPrimary: '#b71c1c',
    accentSecondary: '#d32f2f',
    accentTertiary: '#f44336',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    gradientBg: 'linear-gradient(135deg, #fef5f5 0%, #fde8e8 100%)',
    gradientAccent: 'linear-gradient(135deg, #b71c1c 0%, #d32f2f 100%)',
    shadow: '0 4px 20px rgba(183, 28, 28, 0.1)',
    shadowHover: '0 8px 30px rgba(183, 28, 28, 0.15)',
  },
  forest: {
    name: 'Forest',
    displayName: 'Forest',
    color: '#1b5e20',
    background: '#f1f8f4',
    surfacePrimary: '#e8f5eb',
    surfaceSecondary: '#dceee9',
    border: '#a5d6a7',
    textPrimary: '#0d2818',
    textSecondary: '#2e5c3e',
    accentPrimary: '#1b5e20',
    accentSecondary: '#2e7d32',
    accentTertiary: '#43a047',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    gradientBg: 'linear-gradient(135deg, #f1f8f4 0%, #e8f5eb 100%)',
    gradientAccent: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
    shadow: '0 4px 20px rgba(27, 94, 32, 0.1)',
    shadowHover: '0 8px 30px rgba(27, 94, 32, 0.15)',
  },
  grape: {
    name: 'Grape',
    displayName: 'Grape',
    color: '#6a1b9a',
    background: '#faf6ff',
    surfacePrimary: '#f0e5ff',
    surfaceSecondary: '#e6d4ff',
    border: '#c88dff',
    textPrimary: '#38006b',
    textSecondary: '#5c3580',
    accentPrimary: '#6a1b9a',
    accentSecondary: '#7b1fa2',
    accentTertiary: '#9c27b0',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    gradientBg: 'linear-gradient(135deg, #faf6ff 0%, #f0e5ff 100%)',
    gradientAccent: 'linear-gradient(135deg, #6a1b9a 0%, #7b1fa2 100%)',
    shadow: '0 4px 20px rgba(106, 27, 154, 0.1)',
    shadowHover: '0 8px 30px rgba(106, 27, 154, 0.15)',
  },
  'light-blue': {
    name: 'Light Blue',
    displayName: 'Light Blue',
    color: '#0277bd',
    background: '#f1f8ff',
    surfacePrimary: '#e6f3ff',
    surfaceSecondary: '#d9ecff',
    border: '#99ccff',
    textPrimary: '#004d80',
    textSecondary: '#1a6fa0',
    accentPrimary: '#0277bd',
    accentSecondary: '#0288d1',
    accentTertiary: '#0097a7',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    gradientBg: 'linear-gradient(135deg, #f1f8ff 0%, #e6f3ff 100%)',
    gradientAccent: 'linear-gradient(135deg, #0277bd 0%, #0288d1 100%)',
    shadow: '0 4px 20px rgba(2, 119, 189, 0.1)',
    shadowHover: '0 8px 30px rgba(2, 119, 189, 0.15)',
  },
  'light-gray': {
    name: 'Light Gray',
    displayName: 'Light Gray',
    color: '#757575',
    background: '#fafafa',
    surfacePrimary: '#f5f5f5',
    surfaceSecondary: '#eeeeee',
    border: '#d0d0d0',
    textPrimary: '#424242',
    textSecondary: '#616161',
    accentPrimary: '#757575',
    accentSecondary: '#9e9e9e',
    accentTertiary: '#bdbdbd',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    gradientBg: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
    gradientAccent: 'linear-gradient(135deg, #757575 0%, #9e9e9e 100%)',
    shadow: '0 4px 20px rgba(117, 117, 117, 0.1)',
    shadowHover: '0 8px 30px rgba(117, 117, 117, 0.15)',
  },
  'orange-cappuccino': {
    name: 'Orange Cappuccino',
    displayName: 'Orange Cappuccino',
    color: '#e65100',
    background: '#fff3e0',
    surfacePrimary: '#ffe0b2',
    surfaceSecondary: '#ffd699',
    border: '#ffb74d',
    textPrimary: '#4d2600',
    textSecondary: '#7a4419',
    accentPrimary: '#e65100',
    accentSecondary: '#ff6d00',
    accentTertiary: '#ff9100',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    gradientBg: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
    gradientAccent: 'linear-gradient(135deg, #e65100 0%, #ff6d00 100%)',
    shadow: '0 4px 20px rgba(230, 81, 0, 0.1)',
    shadowHover: '0 8px 30px rgba(230, 81, 0, 0.15)',
  },
  pink: {
    name: 'Pink',
    displayName: 'Pink',
    color: '#c2185b',
    background: '#fef5f8',
    surfacePrimary: '#fde8ef',
    surfaceSecondary: '#fbdbea',
    border: '#f8a3c3',
    textPrimary: '#5c1d3b',
    textSecondary: '#8b3a56',
    accentPrimary: '#c2185b',
    accentSecondary: '#e91e63',
    accentTertiary: '#f06292',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    gradientBg: 'linear-gradient(135deg, #fef5f8 0%, #fde8ef 100%)',
    gradientAccent: 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
    shadow: '0 4px 20px rgba(194, 24, 91, 0.1)',
    shadowHover: '0 8px 30px rgba(194, 24, 91, 0.15)',
  },
  sage: {
    name: 'Sage',
    displayName: 'Sage',
    color: '#558b2f',
    background: '#f7fef2',
    surfacePrimary: '#f1f9ed',
    surfaceSecondary: '#eaf4e3',
    border: '#c5e1a5',
    textPrimary: '#33691e',
    textSecondary: '#56841f',
    accentPrimary: '#558b2f',
    accentSecondary: '#7cb342',
    accentTertiary: '#9ccc65',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    gradientBg: 'linear-gradient(135deg, #f7fef2 0%, #f1f9ed 100%)',
    gradientAccent: 'linear-gradient(135deg, #558b2f 0%, #7cb342 100%)',
    shadow: '0 4px 20px rgba(85, 139, 47, 0.1)',
    shadowHover: '0 8px 30px rgba(85, 139, 47, 0.15)',
  },
  teal: {
    name: 'Teal',
    displayName: 'Teal',
    color: '#00796b',
    background: '#f0fffe',
    surfacePrimary: '#e0f2f1',
    surfaceSecondary: '#d0e8e7',
    border: '#80cbc4',
    textPrimary: '#004d47',
    textSecondary: '#00695c',
    accentPrimary: '#00796b',
    accentSecondary: '#00897b',
    accentTertiary: '#009688',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    gradientBg: 'linear-gradient(135deg, #f0fffe 0%, #e0f2f1 100%)',
    gradientAccent: 'linear-gradient(135deg, #00796b 0%, #00897b 100%)',
    shadow: '0 4px 20px rgba(0, 121, 107, 0.1)',
    shadowHover: '0 8px 30px rgba(0, 121, 107, 0.15)',
  },
  purple: {
    name: 'Purple',
    displayName: 'Purple',
    color: '#7c3aed',
    background: '#faf9ff',
    surfacePrimary: '#f3f1ff',
    surfaceSecondary: '#ede8ff',
    border: '#ddd5f3',
    textPrimary: '#2d1b4e',
    textSecondary: '#6b5b8a',
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
  },
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('light');

  const themes = {
    light: lightTheme,
    dark: darkTheme,
    ...colorThemes,
  };

  const currentTheme = themes[themeName];

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem('amaha-theme');
    const allThemeNames = Object.keys(themes);
    if (saved && allThemeNames.includes(saved)) {
      setThemeName(saved);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (currentTheme) {
      document.documentElement.style.backgroundColor = currentTheme.background;
      document.body.style.backgroundColor = currentTheme.background;
      localStorage.setItem('amaha-theme', themeName);
    }
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
    themes,
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
