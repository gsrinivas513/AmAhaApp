import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useToast } from '../components/Toast';
import { db } from '../firebase/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import {
  getPlatformAnalytics,
  getLeaderboardAnalytics,
} from '../services/analyticsService';
import { performanceMonitor } from '../utils/performanceMonitor';
import './AnalyticsDashboard.css';

/**
 * Analytics Page - Full admin page for analytics and performance monitoring
 * Displays platform metrics, performance data, and leaderboards
 */
function AnalyticsPage() {
  const { notify } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [platformAnalytics, setPlatformAnalytics] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const platformData = await getPlatformAnalytics();
      setPlatformAnalytics(platformData);

      const leaderboardData = await getLeaderboardAnalytics(20);
      setLeaderboard(leaderboardData);

      const metrics = performanceMonitor.getAllMetrics();
      const vitals = performanceMonitor.getCoreWebVitals();
      const memory = performanceMonitor.getMemoryUsage();
      setPerformanceMetrics({
        metrics,
        vitals,
        memory,
      });

      notify.success('Analytics loaded successfully');
    } catch (error) {
      console.error('Error loading analytics:', error);
      notify.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const data = {
        platform: platformAnalytics,
        leaderboard,
        performance: performanceMetrics,
        exportedAt: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `analytics-${new Date().getTime()}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      notify.success('Analytics exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      notify.error('Failed to export analytics');
    }
  };

  const generateSampleData = async () => {
    try {
      setLoading(true);
      
      const categories = ['Math', 'English', 'Science', 'History', 'Programming'];
      const difficulties = ['Easy', 'Medium', 'Hard'];
      const eventTypes = ['quiz_completed', 'puzzle_completed', 'daily_challenge_submitted'];
      
      const sampleEvents = [];
      
      // Generate 50 sample events from different users
      for (let i = 0; i < 50; i++) {
        const userId = `user_${Math.floor(Math.random() * 20)}@test.com`;
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        let eventData = {
          category: categories[Math.floor(Math.random() * categories.length)],
          difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
        };

        if (eventType === 'quiz_completed') {
          eventData = {
            ...eventData,
            score: Math.floor(Math.random() * 100),
            timeSpent: Math.floor(Math.random() * 600) + 60,
            questionsAnswered: 10,
            correctAnswers: Math.floor(Math.random() * 10),
            xpEarned: Math.floor(Math.random() * 100) + 10,
            coinsEarned: Math.floor(Math.random() * 50) + 5,
          };
        } else if (eventType === 'puzzle_completed') {
          eventData = {
            ...eventData,
            puzzleId: `puzzle_${Math.floor(Math.random() * 100)}`,
            timeSpent: Math.floor(Math.random() * 300) + 30,
            solvedCorrectly: Math.random() > 0.3,
            xpEarned: Math.floor(Math.random() * 75) + 10,
          };
        } else {
          eventData = {
            ...eventData,
            type: 'daily_challenge',
            timeSpent: Math.floor(Math.random() * 120) + 30,
            completed: Math.random() > 0.2,
            xpEarned: Math.floor(Math.random() * 50) + 10,
          };
        }

        sampleEvents.push({
          userId,
          eventType,
          eventData,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          userAgent: navigator.userAgent,
          url: window.location.href,
        });
      }

      // Add all events to Firestore
      for (const event of sampleEvents) {
        await addDoc(collection(db, 'analytics_events'), event);
      }

      // Reload analytics data
      await loadAnalytics();
      
      notify.success(`✨ Generated ${sampleEvents.length} sample analytics events`);
    } catch (error) {
      console.error('Error generating sample data:', error);
      notify.error('Failed to generate sample data: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#1f2937',
            margin: '0 0 8px 0',
          }}>
            Analytics Dashboard
          </h1>
          <p style={{
            fontSize: 14,
            color: '#6b7280',
            margin: 0,
          }}>
            Monitor platform performance, user engagement, and system metrics
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginBottom: 24,
          borderBottom: '1px solid #e5e7eb',
          flexWrap: 'wrap',
        }}>
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'platform', label: '🎯 Platform' },
            { id: 'performance', label: '⚡ Performance' },
            { id: 'leaderboard', label: '🏆 Leaderboard' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '12px 16px',
                fontSize: 14,
                fontWeight: activeTab === tab.id ? 600 : 500,
                color: activeTab === tab.id ? '#6C63FF' : '#6b7280',
                borderBottom: activeTab === tab.id ? '3px solid #6C63FF' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = '#374151';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = '#6b7280';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{
              width: 50,
              height: 50,
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #6C63FF',
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ marginTop: 20, color: '#6b7280', fontSize: 16 }}>Loading analytics...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && platformAnalytics && (
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1f2937' }}>
                  Key Metrics
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 16,
                  marginBottom: 24,
                }}>
                  {[
                    { label: 'Total Events', value: platformAnalytics.totalEvents || 0, color: '#6C63FF' },
                    { label: 'Active Users', value: platformAnalytics.activeUsers || 0, color: '#8b5cf6' },
                    { label: 'Quiz Completions', value: platformAnalytics.quizCompletions || 0, color: '#3b82f6' },
                    { label: 'Daily Challenges', value: platformAnalytics.dailyChallengeSubmissions || 0, color: '#10b981' },
                  ].map((metric, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: `linear-gradient(135deg, ${metric.color} 0%, ${metric.color}dd 100%)`,
                        color: 'white',
                        padding: 24,
                        borderRadius: 12,
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                      }}
                    >
                      <div style={{ fontSize: 13, opacity: 0.95, marginBottom: 12, fontWeight: 500 }}>
                        {metric.label}
                      </div>
                      <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1 }}>
                        {metric.value.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Platform Tab */}
            {activeTab === 'platform' && platformAnalytics && (
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1f2937' }}>
                  Platform Statistics
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 16,
                  marginBottom: 24,
                }}>
                  {[
                    { label: 'Quizzes Solved', value: platformAnalytics.quizCompletions || 0, icon: '📝', color: '#3b82f6' },
                    { label: 'Puzzles Solved', value: platformAnalytics.puzzleCompletions || 0, icon: '🧩', color: '#f59e0b' },
                    { label: 'Challenges Completed', value: platformAnalytics.dailyChallengeSubmissions || 0, icon: '🎯', color: '#10b981' },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                        color: 'white',
                        padding: 24,
                        borderRadius: 12,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
                      <div style={{ fontSize: 13, opacity: 0.95, marginBottom: 8, fontWeight: 500 }}>
                        {stat.label}
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 700 }}>
                        {stat.value.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={exportData}
                  style={{
                    background: 'linear-gradient(135deg, #6C63FF 0%, #8A78FF 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)',
                    marginRight: 12,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(108, 99, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(108, 99, 255, 0.3)';
                  }}
                >
                  📥 Export as JSON
                </button>

                <button
                  onClick={generateSampleData}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  ✨ Generate Sample Data
                </button>
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && performanceMetrics && (
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1f2937' }}>
                  Performance Metrics
                </h2>

                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#1f2937' }}>
                  Memory Usage
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 16,
                  marginBottom: 32,
                }}>
                  {[
                    { label: 'Heap Used (MB)', value: performanceMetrics.memory?.heapUsedMB?.toFixed(2) || 'N/A' },
                    { label: 'Heap Limit (MB)', value: performanceMetrics.memory?.heapLimitMB?.toFixed(2) || 'N/A' },
                    { label: 'Usage %', value: (performanceMetrics.memory?.usagePercent?.toFixed(1) || 'N/A') + '%' },
                  ].map((metric, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#f3f4f6',
                        padding: 16,
                        borderRadius: 8,
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12, fontWeight: 500 }}>
                        {metric.label}
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#6C63FF' }}>
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#1f2937' }}>
                  Core Web Vitals
                </h3>
                <div style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{
                          textAlign: 'left',
                          padding: '12px 16px',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#6b7280',
                        }}>
                          Metric
                        </th>
                        <th style={{
                          textAlign: 'left',
                          padding: '12px 16px',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#6b7280',
                        }}>
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(performanceMetrics.vitals || {}).map(([key, value], idx) => (
                        <tr
                          key={key}
                          style={{
                            borderBottom: idx < Object.keys(performanceMetrics.vitals || {}).length - 1 ? '1px solid #f3f4f6' : 'none',
                            background: idx % 2 === 0 ? 'white' : '#fafafa',
                          }}
                        >
                          <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151', fontWeight: 500 }}>
                            {key.toUpperCase()}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#6C63FF' }}>
                            {typeof value === 'number' ? value.toFixed(2) : value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && leaderboard.length > 0 && (
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1f2937' }}>
                  Top Players
                </h2>
                <div style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{
                          textAlign: 'left',
                          padding: '12px 16px',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#6b7280',
                        }}>
                          Rank
                        </th>
                        <th style={{
                          textAlign: 'left',
                          padding: '12px 16px',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#6b7280',
                        }}>
                          User ID
                        </th>
                        <th style={{
                          textAlign: 'center',
                          padding: '12px 16px',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#6b7280',
                        }}>
                          Total XP
                        </th>
                        <th style={{
                          textAlign: 'center',
                          padding: '12px 16px',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#6b7280',
                        }}>
                          Coins
                        </th>
                        <th style={{
                          textAlign: 'center',
                          padding: '12px 16px',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#6b7280',
                        }}>
                          Quizzes
                        </th>
                        <th style={{
                          textAlign: 'center',
                          padding: '12px 16px',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#6b7280',
                        }}>
                          Puzzles
                        </th>
                        <th style={{
                          textAlign: 'center',
                          padding: '12px 16px',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#6b7280',
                        }}>
                          Challenges
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.slice(0, 20).map((user, idx) => {
                        const medals = ['🥇', '🥈', '🥉'];
                        const medal = medals[idx] || `#${idx + 1}`;
                        return (
                          <tr
                            key={idx}
                            style={{
                              borderBottom: idx < leaderboard.length - 1 ? '1px solid #f3f4f6' : 'none',
                              background: idx % 2 === 0 ? 'white' : '#fafafa',
                            }}
                          >
                            <td style={{
                              padding: '12px 16px',
                              fontSize: 13,
                              fontWeight: 600,
                              color: '#1f2937',
                            }}>
                              {medal}
                            </td>
                            <td style={{
                              padding: '12px 16px',
                              fontSize: 13,
                              color: '#374151',
                              fontFamily: 'monospace',
                            }}>
                              {user.userId?.substring(0, 16) || 'N/A'}...
                            </td>
                            <td style={{
                              padding: '12px 16px',
                              fontSize: 13,
                              fontWeight: 600,
                              color: '#6C63FF',
                              textAlign: 'center',
                            }}>
                              {user.totalXP ? user.totalXP.toLocaleString() : 0}
                            </td>
                            <td style={{
                              padding: '12px 16px',
                              fontSize: 13,
                              color: '#374151',
                              textAlign: 'center',
                            }}>
                              {user.coins ? user.coins.toLocaleString() : 0}
                            </td>
                            <td style={{
                              padding: '12px 16px',
                              fontSize: 13,
                              color: '#374151',
                              textAlign: 'center',
                            }}>
                              {user.quizzesSolved || 0}
                            </td>
                            <td style={{
                              padding: '12px 16px',
                              fontSize: 13,
                              color: '#374151',
                              textAlign: 'center',
                            }}>
                              {user.puzzlesSolved || 0}
                            </td>
                            <td style={{
                              padding: '12px 16px',
                              fontSize: 13,
                              color: '#374151',
                              textAlign: 'center',
                            }}>
                              {user.challengesCompleted || 0}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default AnalyticsPage;
