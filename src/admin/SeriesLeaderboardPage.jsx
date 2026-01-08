// src/admin/SeriesLeaderboardPage.jsx
// Admin dashboard for viewing series leaderboards and user progress

import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useAuth } from '../components/AuthProvider';
import { getAllSeries } from '../services/seriesService';
import { 
  getSeriesLeaderboard,
  getSeriesLeaderboardViews,
  getLeaderboardStats,
  getUserRankInSeries,
  compareUserToPeers
} from '../services/userProgressService';
import './styles/leaderboard.css';

function SeriesLeaderboardPage() {
  const { user } = useAuth();
  const [series, setSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardViews, setLeaderboardViews] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('byScore');
  const [theme, setTheme] = useState('light');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userComparison, setUserComparison] = useState(null);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setTheme(isDark ? 'dark' : 'light');
    loadSeries();
  }, []);

  const loadSeries = async () => {
    try {
      setLoading(true);
      const allSeries = await getAllSeries();
      setSeries(allSeries);
    } catch (error) {
      console.error('Error loading series:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSeries = async (s) => {
    try {
      setLoading(true);
      setSelectedSeries(s);
      setSelectedUser(null);
      setUserComparison(null);
      
      const [leaderboardData, viewsData, statsData] = await Promise.all([
        getSeriesLeaderboard(s.id, 500),
        getSeriesLeaderboardViews(s.id),
        getLeaderboardStats(s.id)
      ]);
      
      setLeaderboard(leaderboardData);
      setLeaderboardViews(viewsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (userId) => {
    try {
      if (!selectedSeries) return;
      
      setSelectedUser(userId);
      const comparison = await compareUserToPeers(userId, selectedSeries.id);
      setUserComparison(comparison);
    } catch (error) {
      console.error('Error loading user comparison:', error);
    }
  };

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1f3a' : '#f5f8ff';
  const cardBg = isDark ? 'rgba(30, 40, 70, 0.6)' : '#ffffff';
  const textColor = isDark ? '#e0e0e0' : '#333';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : '#e0e0e0';
  const accentColor = '#FF6633';

  const getCurrentViewData = () => {
    if (!leaderboardViews) return [];
    return leaderboardViews[activeView] || [];
  };

  return (
    <AdminLayout>
      <div className="leaderboard-page" style={{ color: textColor }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
            🏆 Series Leaderboards
          </h1>
          <p style={{ color: isDark ? '#aaa' : '#666', fontSize: '14px' }}>
            View rankings, user progress, and series statistics
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '24px' }}>
          {/* Series List */}
          <div style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '12px',
            padding: '20px',
            height: 'fit-content',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
              📚 Series
            </h3>

            {loading && !selectedSeries ? (
              <div style={{ textAlign: 'center', color: '#999' }}>Loading...</div>
            ) : (
              <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
                {series.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleSelectSeries(s)}
                    style={{
                      padding: '12px',
                      marginBottom: '8px',
                      background: selectedSeries?.id === s.id ? `${accentColor}20` : 'transparent',
                      border: `2px solid ${selectedSeries?.id === s.id ? accentColor : 'transparent'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      if (selectedSeries?.id !== s.id) {
                        e.currentTarget.style.background = isDark ? 'rgba(255,102,51,0.1)' : 'rgba(255,102,51,0.05)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedSeries?.id !== s.id) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '18px' }}>{s.icon}</span>
                      <span style={{ fontWeight: 'bold', flex: 1 }}>{s.name}</span>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        background: accentColor,
                        color: '#fff',
                        borderRadius: '4px',
                      }}>
                        {stats?.totalParticipants || 0}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: isDark ? '#aaa' : '#666', margin: 0 }}>
                      Avg: {stats?.averageScore?.toFixed(0) || 0} pts
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leaderboard Content */}
          <div>
            {selectedSeries ? (
              <div>
                {/* Series Header */}
                <div style={{
                  background: cardBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '32px' }}>{selectedSeries.icon}</span>
                    <div>
                      <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold' }}>
                        {selectedSeries.name}
                      </h2>
                      {selectedSeries.description && (
                        <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#aaa' : '#666' }}>
                          {selectedSeries.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Statistics Grid */}
                  {stats && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '12px',
                      padding: '16px 0',
                      borderTop: `1px solid ${borderColor}`,
                      borderBottom: `1px solid ${borderColor}`,
                      marginBottom: '16px',
                    }}>
                      <div>
                        <p style={{ fontSize: '12px', color: isDark ? '#aaa' : '#666', margin: '0 0 4px 0' }}>
                          Total Participants
                        </p>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                          {stats.totalParticipants}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: isDark ? '#aaa' : '#666', margin: '0 0 4px 0' }}>
                          Average Score
                        </p>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                          {stats.averageScore?.toFixed(0)}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: isDark ? '#aaa' : '#666', margin: '0 0 4px 0' }}>
                          Highest Score
                        </p>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                          {stats.highestScore}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: isDark ? '#aaa' : '#666', margin: '0 0 4px 0' }}>
                          Completion Rate
                        </p>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                          {stats.averageCompletionRate?.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: isDark ? '#aaa' : '#666', margin: '0 0 4px 0' }}>
                          Completed
                        </p>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                          {stats.completionDistribution?.completed || 0}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* View Selector */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                }}>
                  {[
                    { id: 'byScore', label: '🎯 By Score', icon: 'Score' },
                    { id: 'byCompletion', label: '✅ By Completion', icon: 'Completion' },
                    { id: 'bySpeed', label: '⚡ By Speed', icon: 'Speed' },
                    { id: 'byAverage', label: '📊 By Average', icon: 'Average' }
                  ].map(view => (
                    <button
                      key={view.id}
                      onClick={() => setActiveView(view.id)}
                      style={{
                        padding: '8px 16px',
                        background: activeView === view.id ? accentColor : (isDark ? '#2a3550' : '#f0f0f0'),
                        color: activeView === view.id ? '#fff' : textColor,
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {view.label}
                    </button>
                  ))}
                </div>

                {/* Leaderboard Table */}
                <div style={{
                  background: cardBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '12px',
                  padding: '20px',
                  overflow: 'x',
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', margin: '0 0 16px 0' }}>
                    Leaderboard
                  </h3>

                  {loading ? (
                    <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                      Loading leaderboard...
                    </div>
                  ) : getCurrentViewData().length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                      No data available
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
                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: isDark ? '#aaa' : '#666' }}>Rank</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: isDark ? '#aaa' : '#666' }}>User ID</th>
                            <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: isDark ? '#aaa' : '#666' }}>Score</th>
                            <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: isDark ? '#aaa' : '#666' }}>Puzzles</th>
                            <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: isDark ? '#aaa' : '#666' }}>Completion</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: isDark ? '#aaa' : '#666' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getCurrentViewData().map((entry) => (
                            <tr
                              key={entry.id}
                              style={{
                                borderBottom: `1px solid ${borderColor}`,
                                background: selectedUser === entry.id ? `${accentColor}15` : 'transparent',
                                cursor: 'pointer',
                              }}
                              onMouseOver={(e) => {
                                if (selectedUser !== entry.id) {
                                  e.currentTarget.style.background = isDark ? 'rgba(255,102,51,0.08)' : 'rgba(255,102,51,0.03)';
                                }
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = selectedUser === entry.id ? `${accentColor}15` : 'transparent';
                              }}
                            >
                              <td style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>
                                {entry.rank === 1 && '🥇'}
                                {entry.rank === 2 && '🥈'}
                                {entry.rank === 3 && '🥉'}
                                {entry.rank > 3 && '#' + entry.rank}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'left', fontFamily: 'monospace', fontSize: '12px' }}>
                                {entry.id?.substring(0, 8)}...
                              </td>
                              <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: accentColor }}>
                                {entry.totalScore || 0}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'right' }}>
                                {entry.puzzlesCompleted}/{entry.totalPuzzles || 0}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'right' }}>
                                {entry.completionRate?.toFixed(1)}%
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <button
                                  onClick={() => handleSelectUser(entry.id)}
                                  style={{
                                    padding: '4px 12px',
                                    background: accentColor,
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* User Comparison */}
                {selectedUser && userComparison && (
                  <div style={{
                    background: cardBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '12px',
                    padding: '20px',
                    marginTop: '20px',
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', margin: '0 0 16px 0' }}>
                      📊 User Analysis: {selectedUser.substring(0, 12)}...
                    </h3>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '12px',
                    }}>
                      <div style={{
                        padding: '12px',
                        background: isDark ? '#1a2540' : '#f9f9f9',
                        borderRadius: '8px',
                      }}>
                        <p style={{ fontSize: '12px', color: isDark ? '#aaa' : '#666', margin: '0 0 4px 0' }}>
                          Rank
                        </p>
                        <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                          #{userComparison.userRank}
                        </p>
                        <p style={{ fontSize: '11px', color: isDark ? '#aaa' : '#999', margin: '4px 0 0 0' }}>
                          of {userComparison.totalParticipants}
                        </p>
                      </div>

                      <div style={{
                        padding: '12px',
                        background: isDark ? '#1a2540' : '#f9f9f9',
                        borderRadius: '8px',
                      }}>
                        <p style={{ fontSize: '12px', color: isDark ? '#aaa' : '#666', margin: '0 0 4px 0' }}>
                          Percentile
                        </p>
                        <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                          {userComparison.percentileRank?.toFixed(1)}%
                        </p>
                        <p style={{ fontSize: '11px', color: isDark ? '#aaa' : '#999', margin: '4px 0 0 0' }}>
                          Better than peers
                        </p>
                      </div>

                      <div style={{
                        padding: '12px',
                        background: isDark ? '#1a2540' : '#f9f9f9',
                        borderRadius: '8px',
                      }}>
                        <p style={{ fontSize: '12px', color: isDark ? '#aaa' : '#666', margin: '0 0 4px 0' }}>
                          Score vs Average
                        </p>
                        <p style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          margin: 0,
                          color: userComparison.scoreVsAverage >= 0 ? '#4ECB71' : '#ff6b6b'
                        }}>
                          {userComparison.scoreVsAverage >= 0 ? '+' : ''}{userComparison.scoreVsAverage?.toFixed(0)}
                        </p>
                      </div>

                      <div style={{
                        padding: '12px',
                        background: isDark ? '#1a2540' : '#f9f9f9',
                        borderRadius: '8px',
                      }}>
                        <p style={{ fontSize: '12px', color: isDark ? '#aaa' : '#666', margin: '0 0 4px 0' }}>
                          Completion vs Avg
                        </p>
                        <p style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          margin: 0,
                          color: userComparison.completionVsAverage >= 0 ? '#4ECB71' : '#ff6b6b'
                        }}>
                          {userComparison.completionVsAverage >= 0 ? '+' : ''}{userComparison.completionVsAverage?.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                background: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '12px',
                padding: '40px 20px',
                textAlign: 'center',
                color: isDark ? '#aaa' : '#666',
              }}>
                <p style={{ fontSize: '14px', margin: 0 }}>
                  Select a series from the list to view leaderboard
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default SeriesLeaderboardPage;
