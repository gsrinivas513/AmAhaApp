import React, { useState } from 'react';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../components/AuthProvider';

export default function NotificationsPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'achievement',
      title: '🏆 Achievement Unlocked!',
      message: 'You completed 10 puzzles in a row. Keep it up!',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      icon: '🏆',
    },
    {
      id: 2,
      type: 'challenge',
      title: '⚡ Daily Challenge Available',
      message: 'New daily challenge is ready. Complete it to earn 50 XP!',
      timestamp: new Date(Date.now() - 7200000),
      read: false,
      icon: '⚡',
    },
    {
      id: 3,
      type: 'milestone',
      title: '🎯 Level Up!',
      message: 'Congratulations! You reached Level 5. You now unlock expert puzzles.',
      timestamp: new Date(Date.now() - 86400000),
      read: true,
      icon: '🎯',
    },
    {
      id: 4,
      type: 'friend',
      title: '👥 Friend Activity',
      message: 'Alex completed "Sudoku Master" puzzle that you bookmarked.',
      timestamp: new Date(Date.now() - 172800000),
      read: true,
      icon: '👥',
    },
    {
      id: 5,
      type: 'update',
      title: '📢 New Feature Available',
      message: 'Check out our new multiplayer mode where you can challenge friends!',
      timestamp: new Date(Date.now() - 259200000),
      read: true,
      icon: '📢',
    },
  ]);

  const [filter, setFilter] = useState('all');

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type) => {
    const colors = {
      achievement: theme.accentPrimary,
      challenge: theme.accentSecondary,
      milestone: '#FFD700',
      friend: '#FF6B6B',
      update: theme.accentTertiary,
    };
    return colors[type] || theme.accentPrimary;
  };

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
          <div style={{ textAlign: 'center', color: theme.textSecondary }}>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>Please sign in to view notifications</p>
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

  return (
    <SiteLayout>
      <div style={{
        background: theme.background,
        minHeight: '100vh',
        padding: '40px 20px',
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
          }}>
            <div>
              <h1 style={{
                color: theme.accentPrimary,
                fontSize: 'clamp(32px, 5vw, 42px)',
                fontWeight: '700',
                margin: '0 0 10px 0',
              }}>
                🔔 Notifications
              </h1>
              <p style={{
                color: theme.textSecondary,
                fontSize: '16px',
                margin: '0',
              }}>
                Stay updated with your activity
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  padding: '10px 16px',
                  background: theme.surfaceSecondary,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.textPrimary,
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.target.style.borderColor = theme.accentPrimary;
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = theme.border;
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '30px',
            flexWrap: 'wrap',
          }}>
            {[
              { label: 'All', value: 'all', count: notifications.length },
              { label: 'Unread', value: 'unread', count: unreadCount },
              { label: 'Achievements', value: 'achievement' },
              { label: 'Challenges', value: 'challenge' },
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                style={{
                  padding: '10px 16px',
                  background: filter === tab.value ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})` : theme.surfaceSecondary,
                  color: filter === tab.value ? '#fff' : theme.textPrimary,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  if (filter !== tab.value) {
                    e.target.style.background = theme.surfacePrimary;
                  }
                }}
                onMouseOut={(e) => {
                  if (filter !== tab.value) {
                    e.target.style.background = theme.surfaceSecondary;
                  }
                }}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span style={{ marginLeft: '6px', opacity: 0.8 }}>({tab.count})</span>
                )}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          {filteredNotifications.length > 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {filteredNotifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  style={{
                    background: theme.surfacePrimary,
                    border: `2px solid ${notif.read ? theme.border : `${getTypeColor(notif.type)}40`}`,
                    borderRadius: '12px',
                    padding: '16px',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    opacity: notif.read ? 0.7 : 1,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = getTypeColor(notif.type);
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = notif.read ? theme.border : `${getTypeColor(notif.type)}40`;
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start',
                  }}>
                    {/* Icon */}
                    <div style={{
                      fontSize: '32px',
                      flexShrink: 0,
                    }}>
                      {notif.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '6px',
                      }}>
                        <h3 style={{
                          color: theme.textPrimary,
                          fontSize: '16px',
                          fontWeight: '700',
                          margin: 0,
                        }}>
                          {notif.title}
                        </h3>
                        {!notif.read && (
                          <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: getTypeColor(notif.type),
                          }}></div>
                        )}
                      </div>

                      <p style={{
                        color: theme.textSecondary,
                        fontSize: '14px',
                        margin: '0 0 8px 0',
                      }}>
                        {notif.message}
                      </p>

                      <div style={{
                        fontSize: '12px',
                        color: theme.textSecondary,
                      }}>
                        {formatTime(notif.timestamp)}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      style={{
                        padding: '6px 10px',
                        background: 'transparent',
                        border: 'none',
                        color: theme.textSecondary,
                        fontSize: '18px',
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.target.style.color = theme.accentAccent;
                        e.target.style.transform = 'scale(1.2)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.color = theme.textSecondary;
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: theme.textSecondary,
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <p style={{ fontSize: '18px', fontWeight: '600' }}>No notifications</p>
              <p style={{ fontSize: '14px' }}>
                {filter === 'unread'
                  ? 'All caught up! You have no unread notifications.'
                  : 'No notifications to display.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
