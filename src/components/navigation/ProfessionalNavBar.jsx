/**
 * PROFESSIONAL NAVBAR - With Theme Switcher & Navigation
 * Matches PuzzleFree structure
 * Mobile responsive with hamburger menu
 */

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

function ProfessionalNavBar() {
  const { theme, themeName, selectTheme, themes } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [browseDropdownOpen, setBrowseDropdownOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const colorMenuRef = useRef(null);
  const browseMenuRef = useRef(null);

  const navLinks = [
    { label: 'Browse', href: '/explore', isDropdown: true },
    { label: 'Create', href: '/create' },
    { label: 'Collections', href: '/collections' },
    { label: 'Leaderboards', href: '/leaderboards' },
  ];

  const browseOptions = [
    { label: 'Puzzles', icon: '🧩', href: '/puzzle', desc: 'Brain teasers & jigsaw games' },
    { label: 'Quizzes', icon: '❓', href: '/quiz', desc: 'Interactive knowledge tests' },
    { label: 'Stories', icon: '📖', href: '/stories', desc: 'Educational narratives' },
    { label: 'Arts', icon: '🎨', href: '/arts', desc: 'Creative drawing & design' },
    { label: 'Documents', icon: '📄', href: '/documents', desc: 'Learning materials' },
    { label: 'Studies', icon: '🔬', href: '/studies', desc: 'In-depth study modules' },
    { label: 'Worksheets', icon: '📋', href: '/worksheets', desc: 'Practice exercises' },
    { label: 'Games', icon: '🎮', href: '/games', desc: 'Fun learning games' },
  ];

  // Close all menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      if (colorMenuRef.current && !colorMenuRef.current.contains(event.target)) {
        setColorMenuOpen(false);
      }
      if (browseMenuRef.current && !browseMenuRef.current.contains(event.target)) {
        setBrowseDropdownOpen(false);
      }
    };

    if (profileMenuOpen || colorMenuOpen || browseDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [profileMenuOpen, colorMenuOpen, browseDropdownOpen]);

  return (
    <nav
      style={{
        background: theme.surfacePrimary,
        borderBottom: `1px solid ${theme.border}`,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
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
            fontSize: '26px',
            fontWeight: '900',
            color: theme.accentPrimary,
            letterSpacing: '-0.5px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            padding: '6px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            position: 'relative',
            fontFamily: '"Nunito", system-ui, sans-serif',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.opacity = '1';
          }}
        >
          <span style={{ fontSize: '28px' }}>🎯</span>
          <span style={{ color: theme.accentPrimary }}>
            AmAha
          </span>
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
            <div key={link.label} style={{ position: 'relative' }} ref={link.isDropdown ? browseMenuRef : null}>
              {link.isDropdown ? (
                <>
                  <button
                    onClick={() => setBrowseDropdownOpen(!browseDropdownOpen)}
                    style={{
                      color: browseDropdownOpen ? theme.accentPrimary : theme.textSecondary,
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      background: browseDropdownOpen ? `${theme.accentPrimary}15` : 'none',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                      if (!browseDropdownOpen) {
                        e.currentTarget.style.color = theme.accentPrimary;
                      }
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
                        marginTop: '12px',
                        background: theme.surfacePrimary,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '12px',
                        minWidth: '500px',
                        zIndex: 2000,
                        boxShadow: `0 12px 32px rgba(0, 0, 0, 0.2)`,
                        backdropFilter: 'blur(10px)',
                        overflow: 'hidden',
                        padding: '16px',
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {browseOptions.map((option) => (
                          <button
                            key={option.label}
                            onClick={() => {
                              navigate(option.href);
                              setBrowseDropdownOpen(false);
                            }}
                            style={{
                              padding: '12px 14px',
                              background: 'transparent',
                              color: theme.textPrimary,
                              border: `1px solid transparent`,
                              borderRadius: '8px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '500',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px',
                              flexDirection: 'column',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = theme.surfaceSecondary;
                              e.currentTarget.style.borderColor = theme.accentPrimary;
                              e.currentTarget.style.color = theme.accentPrimary;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.borderColor = 'transparent';
                              e.currentTarget.style.color = theme.textPrimary;
                            }}
                          >
                            <span style={{ fontSize: '20px' }}>{option.icon}</span>
                            <div>
                              <div style={{ fontWeight: '600', fontSize: '13px' }}>{option.label}</div>
                              <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '2px' }}>
                                {option.desc}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
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

          {/* Theme Switcher - Dark/Light Mode Only */}
          <button
            onClick={() => selectTheme(themeName === 'dark' ? 'light' : 'dark')}
            style={{
              background: 'none',
              border: 'none',
              color: theme.textSecondary,
              fontSize: '18px',
              cursor: 'pointer',
              padding: '6px 8px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.accentPrimary;
              e.currentTarget.style.background = theme.surfaceSecondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.textSecondary;
              e.currentTarget.style.background = 'none';
            }}
            title={themeName === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {themeName === 'dark' ? '🌙' : '☀️'}
          </button>

          {/* Color Theme Selector */}
          <div style={{ position: 'relative' }} ref={colorMenuRef}>
            <button
              onClick={() => setColorMenuOpen(!colorMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: theme.textSecondary,
                fontSize: '18px',
                cursor: 'pointer',
                padding: '6px 8px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.accentPrimary;
                e.currentTarget.style.background = theme.surfaceSecondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.textSecondary;
                e.currentTarget.style.background = 'none';
              }}
              title="Change color theme"
            >
              🎨
            </button>

            {colorMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: theme.surfacePrimary,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  minWidth: '200px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  zIndex: 1001,
                }}
              >
                <div style={{ padding: '8px 0' }}>
                  {Object.keys(themes).filter(t => t !== 'light' && t !== 'dark').map((themeKey) => {
                    const themeObj = themes[themeKey];
                    const themeDisplayName = themeObj.displayName || themeKey;
                    return (
                      <button
                        key={themeKey}
                        onClick={() => {
                          selectTheme(themeKey);
                          setColorMenuOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          background: themeName === themeKey ? theme.surfaceSecondary : 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          color: themeName === themeKey ? themeObj.accentPrimary : theme.textSecondary,
                          cursor: 'pointer',
                          fontSize: '13px',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontWeight: themeName === themeKey ? '600' : '400',
                        }}
                        onMouseEnter={(e) => {
                          if (themeName !== themeKey) {
                            e.currentTarget.style.background = theme.surfaceSecondary;
                            e.currentTarget.style.color = themeObj.accentPrimary;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (themeName !== themeKey) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = theme.textSecondary;
                          }
                        }}
                      >
                        {/* Color Swatch */}
                        <span
                          style={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: themeObj.accentPrimary,
                            border: `2px solid ${themeObj.accentPrimary}`,
                          }}
                        />
                        {themeDisplayName}
                        {themeName === themeKey && <span style={{ marginLeft: 'auto' }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Auth Buttons */}
          {user ? (
            <div style={{ position: 'relative' }} ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  background: profileMenuOpen ? theme.accentPrimary : 'transparent',
                  border: `1px solid ${profileMenuOpen ? theme.accentPrimary : theme.border}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: profileMenuOpen ? 'white' : theme.accentPrimary,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!profileMenuOpen) {
                    e.currentTarget.style.background = theme.surfaceSecondary;
                    e.currentTarget.style.borderColor = theme.accentPrimary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!profileMenuOpen) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = theme.border;
                  }
                }}
              >
                👤 {user.displayName || 'Profile'}
                <span style={{ fontSize: '12px' }}>▼</span>
              </button>

              {profileMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    background: theme.surfacePrimary,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    minWidth: '200px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    zIndex: 1001,
                    overflow: 'hidden',
                  }}
                >
                  {/* Menu Items */}
                  <div style={{ padding: '8px 0' }}>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setProfileMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        color: theme.textSecondary,
                        cursor: 'pointer',
                        fontSize: '13px',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = theme.surfaceSecondary;
                        e.currentTarget.style.color = theme.accentPrimary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = theme.textSecondary;
                      }}
                    >
                      👤 Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate('/settings');
                        setProfileMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        color: theme.textSecondary,
                        cursor: 'pointer',
                        fontSize: '13px',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = theme.surfaceSecondary;
                        e.currentTarget.style.color = theme.accentPrimary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = theme.textSecondary;
                      }}
                    >
                      ⚙️ Settings
                    </button>

                    <div style={{ margin: '8px 0', borderBottom: `1px solid ${theme.border}` }} />

                    <button
                      onClick={() => {
                        signOut();
                        navigate('/');
                        setProfileMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '13px',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
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
