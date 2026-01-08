// src/components/SeriesLeaderboard.jsx
// Public leaderboard component for displaying series rankings

import React, { useState, useEffect } from 'react';
import {
  getSeriesLeaderboard,
  getLeaderboardStats,
  getUserRankInSeries
} from '../services/userProgressService';
import { useAuth } from './AuthProvider';

function SeriesLeaderboard({ seriesId, limit = 50 }) {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setTheme(isDark ? 'dark' : 'light');
    loadLeaderboard();
  }, [seriesId]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const [leaderboardData, statsData] = await Promise.all([
        getSeriesLeaderboard(seriesId, limit),
        getLeaderboardStats(seriesId)
      ]);

      setLeaderboard(leaderboardData);
      setStats(statsData);

      if (user?.uid) {
        const rank = await getUserRankInSeries(user.uid, seriesId);
        setUserRank(rank);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'rgba(30, 40, 70, 0.6)' : 'rgba(255, 255, 255, 0.8)';
  const textColor = isDark ? '#e0e0e0' : '#333';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : '#e0e0e0';
  const accentColor = '#FF6633';

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return textColor;
    }
  };

  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        color: isDark ? '#aaa' : '#666',
      }}>
        Loading leaderboard...
      </div>
    );
  }

  return (
    <div style={{
      background: bgColor,
      borderRadius: '12px',
      padding: '20px',
      color: textColor,
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', margin: '0 0 20px 0' }}>
        🏆 Leaderboard
      </h3>

      {/* User's Rank (if applicable) */}
      {userRank && (
        <div style={{
          padding: '16px',
          background: isDark ? 'rgba(76, 203, 113, 0.1)' : 'rgba(76, 203, 113, 0.1)',
          border: `2px solid #4ECB71`,
          borderRadius: '8px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '12px', color: isDark ? '#aaa' : '#666', margin: 0 }}>
                Your Rank
              </p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 0 0' }}>
                #{userRank.rank} out of {userRank.totalUsers}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '12px', color: isDark ? '#aaa' : '#666', margin: 0 }}>
                Your Score
              </p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0 0 0', color: accentColor }}>
                {userRank.totalScore} pts
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px',
          marginBottom: '16px',
          padding: '16px 0',
          borderTop: `1px solid ${borderColor}`,
          borderBottom: `1px solid ${borderColor}`,
        }}>
          <div>
            <p style={{ fontSize: '11px', color: isDark ? '#aaa' : '#666', margin: 0 }}>
              Participants
            </p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 0 0' }}>
              {stats.totalParticipants}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: isDark ? '#aaa' : '#666', margin: 0 }}>
              Avg Score
            </p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 0 0' }}>
              {stats.averageScore?.toFixed(0)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: isDark ? '#aaa' : '#666', margin: 0 }}>
              High Score
            </p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 0 0' }}>
              {stats.highestScore}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: isDark ? '#aaa' : '#666', margin: 0 }}>
              Completion
            </p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 0 0' }}>
              {stats.averageCompletionRate?.toFixed(0)}%
            </p>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      {leaderboard.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: isDark ? '#aaa' : '#666',
        }}>
          <p>No leaderboard data yet</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
          }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${borderColor}` }}>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: isDark ? '#aaa' : '#666', width: '50px' }}>
                  Rank
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: isDark ? '#aaa' : '#666', flex: 1 }}>
                  User
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: isDark ? '#aaa' : '#666', width: '80px' }}>
                  Score
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: isDark ? '#aaa' : '#666', width: '100px' }}>
                  Progress
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr
                  key={entry.id}
                  style={{
                    borderBottom: `1px solid ${borderColor}`,
                    background: user?.uid === entry.id ? `${accentColor}15` : 'transparent',
                  }}
                  onMouseOver={(e) => {
                    if (user?.uid !== entry.id) {
                      e.currentTarget.style.background = isDark ? 'rgba(255,102,51,0.08)' : 'rgba(255,102,51,0.03)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = user?.uid === entry.id ? `${accentColor}15` : 'transparent';
                  }}
                >
                  <td style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: getRankColor(entry.rank),
                    fontSize: entry.rank <= 3 ? '18px' : '14px',
                  }}>
                    {getMedalIcon(entry.rank)}
                  </td>
                  <td style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontSize: '13px',
                  }}>
                    {user?.uid === entry.id ? (
                      <span style={{ fontWeight: 'bold', color: accentColor }}>
                        You
                      </span>
                    ) : (
                      <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                        {entry.id?.substring(0, 12)}...
                      </span>
                    )}
                  </td>
                  <td style={{
                    padding: '12px',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: accentColor,
                  }}>
                    {entry.totalScore || 0}
                  </td>
                  <td style={{
                    padding: '12px',
                    textAlign: 'right',
                    fontSize: '12px',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '8px',
                    }}>
                      <div style={{
                        width: '60px',
                        height: '6px',
                        background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${(entry.completionRate || 0)}%`,
                          height: '100%',
                          background: accentColor,
                          transition: 'width 0.3s ease',
                        }} />
                      </div>
                      <span style={{ minWidth: '35px', textAlign: 'right' }}>
                        {entry.completionRate?.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SeriesLeaderboard;
