import React, { useEffect, useState } from 'react';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../components/AuthProvider';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function UserSettingsPage() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    bio: '',
    profileImage: '',
    notificationEmails: true,
    notificationPush: true,
    privateProfile: false,
    showProgress: true,
  });

  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function loadSettings() {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setFormData({
            fullName: data.fullName || user.displayName || '',
            email: user.email || '',
            bio: data.bio || '',
            profileImage: data.profileImage || '',
            notificationEmails: data.preferences?.notificationEmails !== false,
            notificationPush: data.preferences?.notificationPush !== false,
            privateProfile: data.privacy?.privateProfile || false,
            showProgress: data.privacy?.showProgress !== false,
          });
        } else {
          setFormData(prev => ({
            ...prev,
            fullName: user.displayName || '',
            email: user.email || '',
          }));
        }
      } catch (err) {
        setStatus('Failed to load settings');
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setStatus('');

    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          fullName: formData.fullName,
          bio: formData.bio,
          profileImage: formData.profileImage,
          preferences: {
            notificationEmails: formData.notificationEmails,
            notificationPush: formData.notificationPush,
          },
          privacy: {
            privateProfile: formData.privateProfile,
            showProgress: formData.showProgress,
          },
        },
        { merge: true }
      );
      setStatus('✅ Settings saved successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('❌ Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <SiteLayout>
        <div style={{
          background: theme.background,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            textAlign: 'center',
            color: theme.textSecondary,
          }}>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>Please sign in to manage your settings</p>
            <a href="/login" style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
              color: '#fff',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '600',
            }}>
              Go to Login
            </a>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (loading) {
    return (
      <SiteLayout>
        <div style={{
          background: theme.background,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ color: theme.textSecondary }}>Loading settings...</div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div style={{
        background: theme.background,
        minHeight: '100vh',
        padding: '40px 20px',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{
              color: theme.accentPrimary,
              fontSize: 'clamp(32px, 5vw, 42px)',
              fontWeight: '700',
              margin: '0 0 10px 0',
            }}>
              ⚙️ Settings
            </h1>
            <p style={{
              color: theme.textSecondary,
              fontSize: '16px',
              margin: '0',
            }}>
              Manage your profile and preferences
            </p>
          </div>

          {/* Status Message */}
          {status && (
            <div style={{
              background: status.includes('✅') ? `${theme.accentPrimary}20` : `${theme.accentAccent}20`,
              border: `2px solid ${status.includes('✅') ? theme.accentPrimary : theme.accentAccent}`,
              color: status.includes('✅') ? theme.accentPrimary : theme.accentAccent,
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '14px',
              fontWeight: '500',
            }}>
              {status}
            </div>
          )}

          <form onSubmit={handleSave}>
            {/* Profile Section */}
            <div style={{
              background: theme.surfacePrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '20px',
              backdropFilter: 'blur(10px)',
            }}>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '20px',
                fontWeight: '600',
                marginTop: 0,
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: `1px solid ${theme.border}`,
              }}>
                👤 Profile Information
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
              }}>
                <div>
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
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.accentPrimary;
                      e.target.style.boxShadow = `0 0 0 3px ${theme.accentPrimary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.border;
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
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
                    value={formData.email}
                    disabled
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: theme.surfaceSecondary,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '12px',
                      color: theme.textSecondary,
                      fontSize: '16px',
                      opacity: 0.7,
                    }}
                  />
                  <span style={{
                    fontSize: '12px',
                    color: theme.textSecondary,
                  }}>
                    Contact support to change email
                  </span>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{
                    display: 'block',
                    color: theme.textPrimary,
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}>
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value.slice(0, 150) })}
                    placeholder="Tell us about yourself (max 150 characters)"
                    maxLength={150}
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
                      minHeight: '100px',
                      resize: 'vertical',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.accentPrimary;
                      e.target.style.boxShadow = `0 0 0 3px ${theme.accentPrimary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.border;
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <span style={{
                    fontSize: '12px',
                    color: theme.textSecondary,
                  }}>
                    {formData.bio.length} / 150
                  </span>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div style={{
              background: theme.surfacePrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '20px',
              backdropFilter: 'blur(10px)',
            }}>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '20px',
                fontWeight: '600',
                marginTop: 0,
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: `1px solid ${theme.border}`,
              }}>
                🔔 Notifications
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: theme.surfaceSecondary,
                  borderRadius: '12px',
                  border: `1px solid ${theme.border}`,
                }}>
                  <div>
                    <div style={{
                      color: theme.textPrimary,
                      fontSize: '15px',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}>
                      Email Notifications
                    </div>
                    <div style={{
                      color: theme.textSecondary,
                      fontSize: '13px',
                    }}>
                      Receive emails about challenges and achievements
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notificationEmails}
                    onChange={(e) => setFormData({ ...formData, notificationEmails: e.target.checked })}
                    style={{
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      accentColor: theme.accentPrimary,
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: theme.surfaceSecondary,
                  borderRadius: '12px',
                  border: `1px solid ${theme.border}`,
                }}>
                  <div>
                    <div style={{
                      color: theme.textPrimary,
                      fontSize: '15px',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}>
                      Push Notifications
                    </div>
                    <div style={{
                      color: theme.textSecondary,
                      fontSize: '13px',
                    }}>
                      Receive in-app notifications
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notificationPush}
                    onChange={(e) => setFormData({ ...formData, notificationPush: e.target.checked })}
                    style={{
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      accentColor: theme.accentPrimary,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Privacy Section */}
            <div style={{
              background: theme.surfacePrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '20px',
              backdropFilter: 'blur(10px)',
            }}>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '20px',
                fontWeight: '600',
                marginTop: 0,
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: `1px solid ${theme.border}`,
              }}>
                🔒 Privacy
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: theme.surfaceSecondary,
                  borderRadius: '12px',
                  border: `1px solid ${theme.border}`,
                }}>
                  <div>
                    <div style={{
                      color: theme.textPrimary,
                      fontSize: '15px',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}>
                      Private Profile
                    </div>
                    <div style={{
                      color: theme.textSecondary,
                      fontSize: '13px',
                    }}>
                      Only you can see your profile
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.privateProfile}
                    onChange={(e) => setFormData({ ...formData, privateProfile: e.target.checked })}
                    style={{
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      accentColor: theme.accentPrimary,
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: theme.surfaceSecondary,
                  borderRadius: '12px',
                  border: `1px solid ${theme.border}`,
                }}>
                  <div>
                    <div style={{
                      color: theme.textPrimary,
                      fontSize: '15px',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}>
                      Show Progress in Leaderboard
                    </div>
                    <div style={{
                      color: theme.textSecondary,
                      fontSize: '13px',
                    }}>
                      Allow others to see your score
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showProgress}
                    onChange={(e) => setFormData({ ...formData, showProgress: e.target.checked })}
                    style={{
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      accentColor: theme.accentPrimary,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Account Section */}
            <div style={{
              background: theme.surfacePrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '20px',
              backdropFilter: 'blur(10px)',
            }}>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '20px',
                fontWeight: '600',
                marginTop: 0,
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: `1px solid ${theme.border}`,
              }}>
                🔐 Account
              </h2>

              <button
                type="button"
                onClick={logout}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  background: `${theme.accentAccent}20`,
                  border: `2px solid ${theme.accentAccent}`,
                  borderRadius: '12px',
                  color: theme.accentAccent,
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.target.style.background = theme.accentAccent;
                  e.target.style.color = '#fff';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = `${theme.accentAccent}20`;
                  e.target.style.color = theme.accentAccent;
                  e.target.style.transform = 'scale(1)';
                }}
              >
                🚪 Sign Out
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'flex-end',
            }}>
              <button
                type="button"
                onClick={() => window.history.back()}
                style={{
                  padding: '14px 32px',
                  background: theme.surfaceSecondary,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  color: theme.textPrimary,
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.target.style.background = theme.surfacePrimary;
                  e.target.style.borderColor = theme.accentPrimary;
                }}
                onMouseOut={(e) => {
                  e.target.style.background = theme.surfaceSecondary;
                  e.target.style.borderColor = theme.border;
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '14px 32px',
                  background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: saving ? 0.7 : 1,
                }}
                onMouseOver={(e) => {
                  if (!saving) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = `0 8px 20px ${theme.accentPrimary}40`;
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SiteLayout>
  );
}