import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSwitcher = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: isDarkMode 
          ? '#2d2d44'
          : '#e5e7eb',
        border: `1px solid ${isDarkMode ? '#3d3d54' : '#d1d5db'}`,
        borderRadius: '6px',
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 600,
        transition: 'all 150ms ease',
        color: isDarkMode ? '#b0b0c8' : '#4b5563',
        whiteSpace: 'nowrap',
        minWidth: 'fit-content'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isDarkMode ? '#3d3d54' : '#d1d5db';
        e.currentTarget.style.color = isDarkMode ? '#ffffff' : '#1f2937';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isDarkMode ? '#2d2d44' : '#e5e7eb';
        e.currentTarget.style.color = isDarkMode ? '#b0b0c8' : '#4b5563';
      }}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDarkMode ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};

export default ThemeSwitcher;
