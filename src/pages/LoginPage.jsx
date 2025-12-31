import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../components/AuthProvider';

export default function LoginPage() {
  const { theme } = useTheme();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleEmailLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <div style={{
        background: theme.background,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '450px',
        }}>
          {/* Header */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h1 style={{
              color: theme.accentPrimary,
              fontSize: 'clamp(32px, 5vw, 42px)',
              fontWeight: '700',
              marginBottom: '10px',
            }}>
              Welcome Back 👋
            </h1>
            <p style={{
              color: theme.textSecondary,
              fontSize: '16px',
              margin: '0',
            }}>
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Login Card */}
          <div style={{
            background: theme.surfacePrimary,
            border: `2px solid ${theme.border}`,
            borderRadius: '20px',
            padding: '40px',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            marginBottom: '20px',
          }}>
            {/* Error Message */}
            {error && (
              <div style={{
                background: `${theme.accentAccent}20`,
                border: `2px solid ${theme.accentAccent}`,
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '20px',
                color: theme.accentAccent,
                fontSize: '14px',
                fontWeight: '500',
              }}>
                ❌ {error}
              </div>
            )}

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  color: theme.textPrimary,
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: theme.surfaceSecondary,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '12px',
                    color: theme.textPrimary,
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.accentPrimary;
                    e.target.style.boxShadow = `0 0 0 3px ${theme.accentPrimary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.border;
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  color: theme.textPrimary,
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: theme.surfaceSecondary,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '12px',
                    color: theme.textPrimary,
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.accentPrimary;
                    e.target.style.boxShadow = `0 0 0 3px ${theme.accentPrimary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.border;
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: loading ? 0.7 : 1,
                  transform: loading ? 'scale(0.98)' : 'scale(1)',
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = `0 8px 20px ${theme.accentPrimary}40`;
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {loading ? '⏳ Signing in...' : '✨ Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '24px 0',
              gap: '12px',
            }}>
              <div style={{
                flex: 1,
                height: '1px',
                background: theme.border,
              }}></div>
              <span style={{
                color: theme.textSecondary,
                fontSize: '14px',
              }}>
                OR
              </span>
              <div style={{
                flex: 1,
                height: '1px',
                background: theme.border,
              }}></div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: theme.surfaceSecondary,
                border: `2px solid ${theme.border}`,
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                color: theme.textPrimary,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.background = theme.surfacePrimary;
                  e.target.style.borderColor = theme.accentPrimary;
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.background = theme.surfaceSecondary;
                e.target.style.borderColor = theme.border;
                e.target.style.transform = 'scale(1)';
              }}
            >
              🔐 Sign in with Google
            </button>
          </div>

          {/* Signup Link */}
          <div style={{
            textAlign: 'center',
            color: theme.textSecondary,
            fontSize: '15px',
          }}>
            Don't have an account? {' '}
            <Link
              to="/signup"
              style={{
                color: theme.accentPrimary,
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'opacity 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.8'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              Sign up here
            </Link>
          </div>

          {/* Footer Info */}
          <div style={{
            marginTop: '30px',
            padding: '16px',
            background: `${theme.accentPrimary}10`,
            borderRadius: '12px',
            border: `1px solid ${theme.accentPrimary}30`,
            color: theme.textSecondary,
            fontSize: '13px',
            lineHeight: '1.6',
            textAlign: 'center',
          }}>
            🔒 Your data is secure and encrypted. We use industry-standard Firebase authentication.
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
