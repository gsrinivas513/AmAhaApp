// Modern Glassmorphic TopNavBar inspired by PuzzleFree.game
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';

export default function ModernTopNavBar() {
  const navigate = useNavigate();
  const { currentTheme, themeColor, isDarkMode, setThemeColor, toggleDarkMode, availableColors } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { label: '🧩 Puzzles', path: '/puzzle' },
    { label: '📝 Quizzes', path: '/quiz' },
    { label: '📖 Stories', path: '/story' },
    { label: '🏆 Leaderboard', path: '/leaderboards' },
    { label: '👥 Collections', path: '/' },
    { label: '📅 Daily', path: '/' },
  ];

  const themeIcons = {
    green: '🟢',
    blue: '🔵',
    purple: '🟣',
    red: '🔴',
    orange: '🟠',
  };

  return (
    <>
      {/* Main NavBar - Glassmorphic */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: isDarkMode
            ? 'rgba(15, 23, 42, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${currentTheme.border}`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          padding: '12px 20px',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              background: currentTheme.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer',
              minWidth: 120,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            🎮 AmAha
          </div>

          {/* Navigation Items */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              flex: 1,
              alignItems: 'center',
            }}
          >
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: 'none',
                  color: currentTheme.text,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  borderRadius: 8,
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode
                    ? 'rgba(148, 163, 184, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.color = currentTheme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = currentTheme.text;
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Side - Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {/* Coins/Score Display */}
            <div
              style={{
                padding: '8px 16px',
                background: isDarkMode
                  ? 'rgba(148, 163, 184, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.9rem',
                fontWeight: 600,
                color: currentTheme.text,
              }}
            >
              💰 1,250
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              style={{
                padding: '8px 12px',
                background: isDarkMode
                  ? `rgba(${parseInt(currentTheme.primary.slice(1, 3), 16)}, ${parseInt(currentTheme.primary.slice(3, 5), 16)}, ${parseInt(currentTheme.primary.slice(5, 7), 16)}, 0.2)`
                  : 'rgba(0, 0, 0, 0.05)',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: '1.2rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkMode
                  ? 'rgba(148, 163, 184, 0.2)'
                  : 'rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDarkMode
                  ? `rgba(${parseInt(currentTheme.primary.slice(1, 3), 16)}, ${parseInt(currentTheme.primary.slice(3, 5), 16)}, ${parseInt(currentTheme.primary.slice(5, 7), 16)}, 0.2)`
                  : 'rgba(0, 0, 0, 0.05)';
              }}
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Theme Color Selector */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                style={{
                  padding: '8px 12px',
                  background: isDarkMode
                    ? 'rgba(148, 163, 184, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode
                    ? 'rgba(148, 163, 184, 0.2)'
                    : 'rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode
                    ? 'rgba(148, 163, 184, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)';
                }}
              >
                🎨
              </button>

              {/* Theme Menu Dropdown */}
              {showThemeMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 8,
                    background: currentTheme.surface,
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: 12,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    padding: 8,
                    minWidth: 180,
                    zIndex: 1000,
                  }}
                >
                  <div
                    style={{
                      padding: '8px 12px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: currentTheme.textSecondary,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      marginBottom: 8,
                    }}
                  >
                    Theme Colors
                  </div>

                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setThemeColor(color);
                        setShowThemeMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background:
                          themeColor === color
                            ? isDarkMode
                              ? 'rgba(148, 163, 184, 0.2)'
                              : 'rgba(0, 0, 0, 0.05)'
                            : 'transparent',
                        border:
                          themeColor === color
                            ? `2px solid ${currentTheme.primary}`
                            : '1px solid transparent',
                        borderRadius: 8,
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '0.9rem',
                        fontWeight: themeColor === color ? 600 : 500,
                        color: currentTheme.text,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 4,
                      }}
                      onMouseEnter={(e) => {
                        if (themeColor !== color) {
                          e.currentTarget.style.background = isDarkMode
                            ? 'rgba(148, 163, 184, 0.1)'
                            : 'rgba(0, 0, 0, 0.03)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (themeColor !== color) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>
                        {themeIcons[color]}
                      </span>
                      <span style={{ textTransform: 'capitalize' }}>
                        {color}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  padding: '6px 12px',
                  background: currentTheme.gradient,
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  fontSize: '0.9rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                👤 Login
              </button>

              {showUserMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 8,
                    background: currentTheme.surface,
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: 12,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    padding: 8,
                    minWidth: 160,
                    zIndex: 1000,
                  }}
                >
                  {['Profile', 'Settings', 'Achievements', 'Logout'].map(
                    (item) => (
                      <button
                        key={item}
                        onClick={() => setShowUserMenu(false)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: 8,
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          color: currentTheme.text,
                          transition: 'all 0.2s ease',
                          marginBottom: 4,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = isDarkMode
                            ? 'rgba(148, 163, 184, 0.1)'
                            : 'rgba(0, 0, 0, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
