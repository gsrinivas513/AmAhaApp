import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../components/AuthProvider';

export default function SignupPage() {
  const { theme } = useTheme();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  function checkPasswordStrength(pwd) {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  }

  async function handleEmailSignup(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password, fullName);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  }

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = [theme.accentAccent, '#FFA500', '#FFD700', theme.accentPrimary, theme.accentSecondary];

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
          maxWidth: '500px',
        }}>
          {/* Header */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h1 style={{
              color: theme.accentPrimary,
              fontSize: 'clamp(32px, 5vw, 42px)',
              fontWeight: '700',
              marginBottom: '10px',
            }}>
              Join the Community 🚀
            </h1>
            <p style={{
              color: theme.textSecondary,
              fontSize: '16px',
              margin: '0',
            }}>
              Start your learning journey with AmAha
            </p>
          </div>

          {/* Signup Card */}
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

            {/* Signup Form */}
            <form onSubmit={handleEmailSignup}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  color: theme.textPrimary,
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
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

              <div style={{ marginBottom: '20px' }}>
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
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
                {password && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      marginBottom: '4px',
                    }}>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: '4px',
                            borderRadius: '2px',
                            background: i < passwordStrength ? strengthColors[passwordStrength - 1] : theme.border,
                            transition: 'all 0.3s ease',
                          }}
                        ></div>
                      ))}
                    </div>
                    <span style={{
                      fontSize: '12px',
                      color: strengthColors[Math.min(passwordStrength - 1, 4)],
                      fontWeight: '500',
                    }}>
                      {passwordStrength > 0 ? `Password strength: ${strengthLabels[passwordStrength - 1]}` : ''}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  color: theme.textPrimary,
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: theme.surfaceSecondary,
                    border: `1px solid ${password && confirmPassword && password !== confirmPassword ? theme.accentAccent : theme.border}`,
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
                    e.target.style.borderColor = password && confirmPassword && password !== confirmPassword ? theme.accentAccent : theme.border;
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
                {password && confirmPassword && password !== confirmPassword && (
                  <span style={{
                    fontSize: '12px',
                    color: theme.accentAccent,
                    marginTop: '4px',
                    display: 'block',
                  }}>
                    ❌ Passwords do not match
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || (password && confirmPassword && password !== confirmPassword)}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: (loading || (password && confirmPassword && password !== confirmPassword)) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: (loading || (password && confirmPassword && password !== confirmPassword)) ? 0.7 : 1,
                  transform: (loading || (password && confirmPassword && password !== confirmPassword)) ? 'scale(0.98)' : 'scale(1)',
                }}
                onMouseOver={(e) => {
                  if (!loading && !(password && confirmPassword && password !== confirmPassword)) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = `0 8px 20px ${theme.accentPrimary}40`;
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {loading ? '⏳ Creating account...' : '🎉 Create Account'}
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

            {/* Google Signup */}
            <button
              onClick={handleGoogleSignup}
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
              🔐 Sign up with Google
            </button>
          </div>

          {/* Login Link */}
          <div style={{
            textAlign: 'center',
            color: theme.textSecondary,
            fontSize: '15px',
          }}>
            Already have an account? {' '}
            <Link
              to="/login"
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
              Sign in here
            </Link>
          </div>

          {/* Terms */}
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
            By signing up, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
