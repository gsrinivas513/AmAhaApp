/**
 * PROFESSIONAL NAVBAR - With Theme Switcher & Navigation
 * Matches PuzzleFree structure
 * Mobile responsive with hamburger menu
 */

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

function ProfessionalNavBar() {
  const { theme, themeName, selectTheme, themes } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [browseDropdownOpen, setBrowseDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Browse', href: '/explore', isDropdown: true },
    { label: 'Create', href: '/create' },
    { label: 'Collections', href: '/collections' },
    { label: 'Leaderboards', href: '/leaderboards' },
  ];

  const browseOptions = [
    { label: '🔍 Explore All', href: '/explore' },
    { label: '❓ Quizzes', href: '/quiz' },
    { label: '🧩 Puzzles', href: '/puzzle' },
    { label: '📖 Stories', href: '/stories' },
    { label: '📚 Learning Paths', href: '/category/learning/details' },
  ];

  return (
    <nav
      style={{
        background: theme.surfacePrimary,
        borderBottom: `1px solid ${theme.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
        }}
      >
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: theme.textPrimary,
            letterSpacing: '-0.5px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            padding: '6px 12px',
            borderRadius: '8px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = theme.accentPrimary;
            e.currentTarget.style.background = `${theme.accentPrimary}15`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = theme.textPrimary;
            e.currentTarget.style.background = 'transparent';
          }}
        >
          AmAha
        </div>

        {/* Desktop Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center',
          }}
          className="hidden md:flex"
        >
          {navLinks.map((link) => (
            <div key={link.label} style={{ position: 'relative' }}>
              {link.isDropdown ? (
                <>
                  <button
                    onClick={() => setBrowseDropdownOpen(!browseDropdownOpen)}
                    style={{
                      color: theme.textSecondary,
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: '500',
                      transition: 'color 0.2s ease',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = theme.accentPrimary;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = theme.textSecondary;
                    }}
                  >
                    {link.label} ▼
                  </button>

                  {/* Dropdown Menu */}
                  {browseDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        marginTop: '8px',
                        background: theme.surfacePrimary,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '8px',
                        minWidth: '200px',
                        zIndex: 2000,
                        boxShadow: `0 8px 24px rgba(0, 0, 0, 0.15)`,
                        backdropFilter: 'blur(10px)',
                        overflow: 'hidden',
                      }}
                    >
                      {browseOptions.map((option) => (
                        <button
                          key={option.label}
                          onClick={() => {
                            navigate(option.href);
                            setBrowseDropdownOpen(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'transparent',
                            color: theme.textPrimary,
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease',
                            borderBottom: `1px solid ${theme.border}`,
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = theme.surfaceSecondary;
                            e.target.style.color = theme.accentPrimary;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = theme.textPrimary;
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a
                  onClick={() => navigate(link.href)}
                  style={{
                    color: theme.textSecondary,
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: '500',
                    transition: 'color 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = theme.accentPrimary)}
                  onMouseLeave={(e) => (e.target.style.color = theme.textSecondary)}
                >
                  {link.label}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Right Side - Search, Theme, Auth */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          {/* Search */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
            className="hidden sm:flex"
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/search?q=${searchQuery}`);
                  setSearchQuery('');
                }
              }}
              style={{
                background: theme.background,
                color: theme.textPrimary,
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '14px',
                width: '180px',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = theme.accentPrimary)}
              onBlur={(e) => (e.target.style.borderColor = theme.border)}
            />
            <button
              onClick={() => {
                if (searchQuery) {
                  navigate(`/search?q=${searchQuery}`);
                  setSearchQuery('');
                }
              }}
              style={{
                position: 'absolute',
                right: '8px',
                background: 'none',
                border: 'none',
                color: theme.textSecondary,
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              🔍
            </button>
          </div>

          {/* Notifications */}
          {user && (
            <button
              onClick={() => navigate('/notifications')}
              style={{
                background: 'none',
                border: 'none',
                color: theme.textSecondary,
                cursor: 'pointer',
                fontSize: '18px',
                padding: '6px 8px',
                transition: 'all 0.2s ease',
              }}
              title="Notifications"
              onMouseEnter={(e) => (e.target.style.color = theme.accentPrimary)}
              onMouseLeave={(e) => (e.target.style.color = theme.textSecondary)}
            >
              🔔
            </button>
          )}

          {/* Theme Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: theme.textSecondary,
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.accentPrimary;
                e.currentTarget.style.background = theme.surfaceSecondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.textSecondary;
                e.currentTarget.style.background = 'none';
              }}
            >
              🎨 {themeName}
            </button>

            {/* Theme Dropdown */}
            {themeDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: theme.surfacePrimary,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  minWidth: '160px',
                  zIndex: 2000,
                  boxShadow: theme.shadow,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                {themes.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      selectTheme(t);
                      setThemeDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background:
                        themeName === t ? theme.surfaceSecondary : 'transparent',
                      color: theme.textPrimary,
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: themeName === t ? '600' : '500',
                      transition: 'all 0.15s ease',
                      borderLeft: `3px solid ${
                        themeName === t ? theme.accentPrimary : 'transparent'
                      }`,
                    }}
                    onMouseEnter={(e) => {
                      if (themeName !== t) {
                        e.currentTarget.style.background = theme.surfaceSecondary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (themeName !== t) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                    {themeName === t && ' ✓'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth Buttons */}
          {user ? (
            <>
              <button
                onClick={() => navigate('/profile')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.textSecondary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = theme.accentPrimary;
                  e.target.style.background = theme.surfaceSecondary;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = theme.textSecondary;
                  e.target.style.background = 'none';
                }}
              >
                👤 Profile
              </button>

              <button
                onClick={() => navigate('/settings')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.textSecondary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = theme.accentPrimary;
                  e.target.style.background = theme.surfaceSecondary;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = theme.textSecondary;
                  e.target.style.background = 'none';
                }}
              >
                ⚙️
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                style={{
                  background: theme.accentAccent,
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.textSecondary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = theme.accentPrimary;
                  e.target.style.background = theme.surfaceSecondary;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = theme.textSecondary;
                  e.target.style.background = 'none';
                }}
              >
                Sign In
              </button>

              <button
                onClick={() => navigate('/signup')}
                style={{
                  background: theme.accentPrimary,
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Sign Up
              </button>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: theme.textPrimary,
              fontSize: '24px',
              cursor: 'pointer',
              display: 'none',
            }}
            className="md:hidden"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: theme.surfaceSecondary,
            borderTop: `1px solid ${theme.border}`,
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                color: theme.textPrimary,
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '500',
                padding: '8px 0',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

export default ProfessionalNavBar;
