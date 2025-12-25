import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/Toast';
import {
  getPlatformAnalytics,
  getLeaderboardAnalytics,
} from '../../services/analyticsService';
import { performanceMonitor } from '../../utils/performanceMonitor';
import '../AnalyticsDashboard.css';

/**
 * Analytics Modal - Inline analytics dashboard for admin panel
 * Displays platform metrics, performance data, and leaderboards
 */
function AnalyticsModal({ isOpen, onClose }) {
  const { notify } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [platformAnalytics, setPlatformAnalytics] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadAnalytics();
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          width: '90vw',
          maxWidth: 1200,
          maxHeight: '90vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #6C63FF 0%, #8A78FF 100%)',
            color: 'white',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Analytics Dashboard</h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: 24,
              cursor: 'pointer',
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid #e5e7eb' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'platform', label: 'Platform' },
              { id: 'performance', label: 'Performance' },
              { id: 'leaderboard', label: 'Leaderboard' },
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
                  borderBottom: activeTab === tab.id ? '2px solid #6C63FF' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: 40,
                height: 40,
                border: '3px solid #e5e7eb',
                borderTop: '3px solid #6C63FF',
                borderRadius: '50%',
                margin: '0 auto',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ marginTop: 16, color: '#6b7280' }}>Loading analytics...</p>
            </div>
          )}

          {!loading && (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && platformAnalytics && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                    {[
                      { label: 'Total Events', value: platformAnalytics.totalEvents || 0 },
                      { label: 'Active Users', value: platformAnalytics.activeUsers || 0 },
                      { label: 'Quiz Completions', value: platformAnalytics.quizCompletions || 0 },
                      { label: 'Daily Challenges', value: platformAnalytics.dailyChallengeSubmissions || 0 },
                    ].map((metric, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'linear-gradient(135deg, #6C63FF 0%, #8A78FF 100%)',
                          color: 'white',
                          padding: 20,
                          borderRadius: 8,
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 8 }}>{metric.label}</div>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>{metric.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Platform Tab */}
              {activeTab === 'platform' && platformAnalytics && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                    {[
                      { label: 'Quizzes Solved', value: platformAnalytics.quizCompletions || 0, color: '#3b82f6' },
                      { label: 'Puzzles Solved', value: platformAnalytics.puzzleCompletions || 0, color: '#f59e0b' },
                      { label: 'Challenges Completed', value: platformAnalytics.dailyChallengeSubmissions || 0, color: '#10b981' },
                    ].map((stat, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                          color: 'white',
                          padding: 20,
                          borderRadius: 8,
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 8 }}>{stat.label}</div>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={exportData}
                    style={{
                      background: '#6C63FF',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 600,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#5551d6';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#6C63FF';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    📥 Export as JSON
                  </button>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === 'performance' && performanceMetrics && (
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#1f2937' }}>Memory Usage</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                    <div style={{ background: '#f3f4f6', padding: 16, borderRadius: 8 }}>
                      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>Heap Used (MB)</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#1f2937' }}>
                        {performanceMetrics.memory?.heapUsedMB?.toFixed(2) || 'N/A'}
                      </div>
                    </div>
                    <div style={{ background: '#f3f4f6', padding: 16, borderRadius: 8 }}>
                      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>Heap Limit (MB)</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#1f2937' }}>
                        {performanceMetrics.memory?.heapLimitMB?.toFixed(2) || 'N/A'}
                      </div>
                    </div>
                    <div style={{ background: '#f3f4f6', padding: 16, borderRadius: 8 }}>
                      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>Usage %</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#1f2937' }}>
                        {performanceMetrics.memory?.usagePercent?.toFixed(1) || 'N/A'}%
                      </div>
                    </div>
                  </div>

                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#1f2937' }}>Core Web Vitals</h3>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginBottom: 24,
                  }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Metric</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(performanceMetrics.vitals || {}).map(([key, value]) => (
                        <tr key={key} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px 8px', fontSize: 13, color: '#374151' }}>{key.toUpperCase()}</td>
                          <td style={{ padding: '12px 8px', fontSize: 13, fontWeight: 500, color: '#1f2937' }}>
                            {typeof value === 'number' ? value.toFixed(2) : value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Leaderboard Tab */}
              {activeTab === 'leaderboard' && leaderboard.length > 0 && (
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Rank</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>User ID</th>
                      <th style={{ textAlign: 'center', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>XP</th>
                      <th style={{ textAlign: 'center', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Coins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.slice(0, 20).map((user, idx) => {
                      const medals = ['🥇', '🥈', '🥉'];
                      const medal = medals[idx] || '';
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6', background: idx % 2 === 0 ? '#fafafa' : 'white' }}>
                          <td style={{ padding: '12px 8px', fontSize: 13, fontWeight: 600, color: '#1f2937' }}>
                            {medal} {idx + 1}
                          </td>
                          <td style={{ padding: '12px 8px', fontSize: 13, color: '#374151' }}>{user.userId?.substring(0, 12) || 'N/A'}...</td>
                          <td style={{ padding: '12px 8px', fontSize: 13, fontWeight: 500, color: '#6C63FF', textAlign: 'center' }}>
                            {user.totalXP || 0}
                          </td>
                          <td style={{ padding: '12px 8px', fontSize: 13, color: '#374151', textAlign: 'center' }}>{user.coins || 0}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsModal;
