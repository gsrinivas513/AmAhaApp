import React, { useState, useEffect } from 'react';
import SiteLayout from '../layouts/SiteLayout';
import LeaderboardTable from '../components/Leaderboard/LeaderboardTable';
import { useTheme } from '../context/ThemeContext';
import { getLeaderboard } from '../services/leaderboardService';

export default function LeaderboardsPage() {
  const { theme } = useTheme();
  const [period, setPeriod] = useState('daily');
  const [categoryId, setCategoryId] = useState('all');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'quizzes', name: 'Quizzes' },
    { id: 'puzzles', name: 'Puzzles' },
    { id: 'challenges', name: 'Challenges' },
  ];

  const periods = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'all-time', label: 'All Time' },
  ];

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard(period, categoryId);
        setLeaderboardData(data || []);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
        setError('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [period, categoryId]);

  return (
    <SiteLayout>
      <div style={{ background: theme.background, minHeight: '100vh', paddingTop: '40px' }}>
        {/* Hero Section */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 20px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: '800',
              color: theme.textPrimary,
              marginBottom: '16px',
            }}
          >
            🏆 Leaderboards
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: theme.textSecondary,
              maxWidth: '600px',
              margin: '0 auto 40px',
              lineHeight: '1.6',
            }}
          >
            Compete with players worldwide. See who's on top and climb your way to glory!
          </p>
        </div>

        {/* Main Container */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px 80px',
          }}
        >
          {/* Filter Controls */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
              marginBottom: '40px',
            }}
          >
            {/* Time Period Filter */}
            <div
              style={{
                padding: '24px',
                background: theme.surfacePrimary,
                border: `1px solid ${theme.border}`,
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              <label
                style={{
                  fontWeight: '600',
                  display: 'block',
                  marginBottom: '12px',
                  color: theme.textPrimary,
                  fontSize: '14px',
                }}
              >
                📅 Time Period
              </label>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                {periods.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPeriod(p.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '13px',
                      background: period === p.id ? theme.accentPrimary : 'transparent',
                      color: period === p.id ? theme.background : theme.textSecondary,
                      border: period === p.id ? 'none' : `1px solid ${theme.border}`,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (period !== p.id) {
                        e.target.style.background = theme.surfaceSecondary;
                        e.target.style.color = theme.textPrimary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (period !== p.id) {
                        e.target.style.background = 'transparent';
                        e.target.style.color = theme.textSecondary;
                      }
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div
              style={{
                padding: '24px',
                background: theme.surfacePrimary,
                border: `1px solid ${theme.border}`,
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              <label
                style={{
                  fontWeight: '600',
                  display: 'block',
                  marginBottom: '12px',
                  color: theme.textPrimary,
                  fontSize: '14px',
                }}
              >
                🎯 Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${theme.border}`,
                  fontSize: '14px',
                  fontWeight: '500',
                  background: theme.surfaceSecondary,
                  color: theme.textPrimary,
                  cursor: 'pointer',
                }}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                background: `linear-gradient(135deg, ${theme.accentPrimary}10, ${theme.accentSecondary}10)`,
                borderRadius: '16px',
                border: `1px solid ${theme.accentPrimary}30`,
              }}
            >
              <p style={{ color: theme.textSecondary, fontSize: '16px' }}>
                Loading leaderboard...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div
              style={{
                padding: '16px 20px',
                background: `${theme.accentPrimary}15`,
                border: `1px solid ${theme.accentPrimary}30`,
                color: theme.accentPrimary,
                borderRadius: '12px',
                marginBottom: '20px',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && leaderboardData.length === 0 && (
            <div
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                background: `linear-gradient(135deg, ${theme.accentPrimary}10, ${theme.accentSecondary}10)`,
                borderRadius: '16px',
                border: `1px solid ${theme.accentPrimary}30`,
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎪</div>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: theme.textPrimary,
                  marginBottom: '8px',
                }}
              >
                No Leaderboard Data Yet
              </h3>
              <p style={{ color: theme.textSecondary, fontSize: '16px' }}>
                Start playing to appear on the leaderboards!
              </p>
            </div>
          )}

          {/* Leaderboard Table */}
          {!loading && !error && leaderboardData.length > 0 && (
            <div
              style={{
                padding: '24px',
                background: theme.surfacePrimary,
                border: `1px solid ${theme.border}`,
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                overflow: 'auto',
              }}
            >
              <LeaderboardTable data={leaderboardData} period={period} categoryId={categoryId} />
            </div>
          )}

          {/* Info Cards */}
          {!loading && !error && leaderboardData.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginTop: '40px',
              }}
            >
              {[
                { icon: '⚡', title: 'Quick Stats', desc: 'Real-time ranking data' },
                { icon: '🎖️', title: 'Achievements', desc: 'Earn badges and rewards' },
                { icon: '📈', title: 'Progress', desc: 'Track your improvement' },
                { icon: '👥', title: 'Community', desc: 'Compete with friends' },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: '20px',
                    background: theme.surfacePrimary,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '12px',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: theme.textPrimary,
                      marginBottom: '4px',
                    }}
                  >
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '12px', color: theme.textSecondary }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
