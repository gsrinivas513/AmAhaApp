import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSwitcher = () => {
  const { isDarkMode, toggleTheme, colorTheme, setColorTheme } = useTheme();
  const [showColorMenu, setShowColorMenu] = useState(false);
  const colorMenuRef = useRef(null);

  // Color themes available
  const colorThemes = [
    { id: 'default', name: 'Default', color: '#6366f1', icon: '⚪' },
    { id: 'purple', name: 'Purple', color: '#a855f7', icon: '🟣' },
    { id: 'teal', name: 'Teal', color: '#14b8a6', icon: '🟦' },
    { id: 'pink', name: 'Pink', color: '#ec4899', icon: '🟥' },
    { id: 'amber', name: 'Amber', color: '#f59e0b', icon: '🟨' },
  ];

  // Close color menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorMenuRef.current && !colorMenuRef.current.contains(event.target)) {
        setShowColorMenu(false);
      }
    };

    if (showColorMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showColorMenu]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {/* Dark/Light Mode Toggle */}
      <button
        onClick={toggleTheme}
        style={{
          background: isDarkMode 
            ? '#2d2d44'
            : '#e5e7eb',
          border: `1px solid ${isDarkMode ? '#3d3d54' : '#d1d5db'}`,
          borderRadius: '6px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'all 150ms ease',
          color: isDarkMode ? '#b0b0c8' : '#4b5563',
          minWidth: '44px',
          height: '36px',
          title: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'
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
        {isDarkMode ? '🌙' : '☀️'}
      </button>

      {/* Color Theme Selector */}
      <div style={{ position: "relative" }} ref={colorMenuRef}>
        <button
          onClick={() => setShowColorMenu(!showColorMenu)}
          style={{
            background: isDarkMode ? '#2d2d44' : '#e5e7eb',
            border: `1px solid ${isDarkMode ? '#3d3d54' : '#d1d5db'}`,
            borderRadius: '6px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 150ms ease',
            color: isDarkMode ? '#b0b0c8' : '#4b5563',
            minWidth: '44px',
            height: '36px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDarkMode ? '#3d3d54' : '#d1d5db';
            e.currentTarget.style.color = isDarkMode ? '#ffffff' : '#1f2937';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isDarkMode ? '#2d2d44' : '#e5e7eb';
            e.currentTarget.style.color = isDarkMode ? '#b0b0c8' : '#4b5563';
          }}
          title="Change color theme"
        >
          🎨
        </button>

        {/* Color Menu Dropdown */}
        {showColorMenu && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: "8px",
              background: isDarkMode ? '#2d2d44' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#3d3d54' : '#e5e7eb'}`,
              borderRadius: "8px",
              minWidth: "180px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
              zIndex: 1000,
              overflow: "hidden"
            }}
          >
            <div style={{ padding: "8px 0" }}>
              {colorThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setColorTheme(theme.id);
                    setShowColorMenu(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    background: colorTheme === theme.id 
                      ? (isDarkMode ? '#3d3d54' : '#f3f4f6')
                      : "transparent",
                    border: "none",
                    textAlign: "left",
                    color: isDarkMode ? '#b0b0c8' : '#4b5563',
                    cursor: "pointer",
                    fontSize: "13px",
                    transition: "all 150ms ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontWeight: colorTheme === theme.id ? '600' : '400'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDarkMode ? '#3d3d54' : '#f3f4f6';
                    e.currentTarget.style.color = isDarkMode ? '#ffffff' : '#1f2937';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colorTheme === theme.id 
                      ? (isDarkMode ? '#3d3d54' : '#f3f4f6')
                      : "transparent";
                    e.currentTarget.style.color = isDarkMode ? '#b0b0c8' : '#4b5563';
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{theme.icon}</span>
                  <span>{theme.name}</span>
                  {colorTheme === theme.id && <span style={{ marginLeft: "auto" }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
