import React from 'react';
import ChartBarSvg from '../components/ChartBarSvg';
import AnalyticsDashboard from '../../dashboard/AnalyticsDashboard';
import { useAuth } from '../../components/AuthProvider';

export default function UsersTab({
  theme,
  scores,
  dbStats,
  filterCategory,
  setFilterCategory,
  exportCSV,
  attemptsData,
  avgData,
  filteredScores,
  limitRows,
  setLimitRows,
  CATEGORIES,
}) {
  const { user } = useAuth();

  return (
    <div>
      {/* Analytics Dashboard Section */}
      <div style={{
        background: theme.surfacePrimary,
        border: `2px solid ${theme.border}`,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
      }}>
        <h3 style={{
          color: theme.accentPrimary,
          fontSize: '18px',
          fontWeight: '700',
          marginTop: 0,
          marginBottom: '16px',
        }}>
          📈 Analytics
        </h3>
        <AnalyticsDashboard
          userId={user?.uid}
          theme={theme}
          breakpoints={{ isMobile: window.innerWidth < 768 }}
          getResponsivePadding={() => '0px'}
        />
      </div>

      {/* Header & Action Buttons */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: theme.textPrimary, fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>
            👥 Users & Analytics
          </h2>
          <p style={{ color: theme.textSecondary, margin: '0', fontSize: '14px' }}>
            View user data, engagement metrics, and performance analytics
          </p>
        </div>

        {/* Organized Action Buttons - Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <button
            onClick={exportCSV}
            style={{
              padding: '12px 20px',
              background: `linear-gradient(135deg, #10B981, #059669)`,
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <div style={{
          background: theme.background,
          border: `2px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
          <div style={{ color: theme.textPrimary, fontSize: '18px', fontWeight: '600' }}>
            {scores.length}
          </div>
          <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Total Attempts</div>
        </div>
        <div style={{
          background: theme.background,
          border: `2px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>❓</div>
          <div style={{ color: theme.textPrimary, fontSize: '18px', fontWeight: '600' }}>
            {dbStats?.collections.quizzes || 0}
          </div>
          <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Quiz Attempts</div>
        </div>
        <div style={{
          background: theme.background,
          border: `2px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>⭐</div>
          <div style={{ color: theme.textPrimary, fontSize: '18px', fontWeight: '600' }}>
            {scores.length > 0 ? Math.round(scores.reduce((a, b) => a + (Number(b.score) || 0), 0) / scores.length) : 0}
          </div>
          <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Avg Score</div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: '8px 12px',
            background: theme.background,
            border: `2px solid ${theme.border}`,
            borderRadius: '8px',
            color: theme.textPrimary,
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Attempts per Category Chart */}
      {attemptsData.length > 0 && (
        <div style={{
          background: theme.background,
          border: `2px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
        }}>
          <h3 style={{ color: theme.textPrimary, marginTop: 0 }}>Attempts per Category</h3>
          <ChartBarSvg data={attemptsData} color={theme.accentPrimary} />
        </div>
      )}

      {/* Average Score per Category Chart */}
      {avgData.length > 0 && (
        <div style={{
          background: theme.background,
          border: `2px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
        }}>
          <h3 style={{ color: theme.textPrimary, marginTop: 0 }}>Average Score per Category</h3>
          <ChartBarSvg data={avgData} color="#4CAF50" isFloat={true} />
        </div>
      )}

      {/* Recent Scores Table */}
      <div style={{
        background: theme.background,
        border: `2px solid ${theme.border}`,
        borderRadius: '12px',
        padding: '20px',
        overflow: 'auto',
      }}>
        <h3 style={{ color: theme.textPrimary, marginTop: 0 }}>Recent Scores (showing {Math.min(filteredScores.length, limitRows)} of {filteredScores.length})</h3>
        {filteredScores.length === 0 ? (
          <p style={{ color: theme.textSecondary }}>No scores recorded yet</p>
        ) : (
          <>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '600px',
            }}>
              <thead style={{ background: `${theme.accentPrimary}15` }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', color: theme.textPrimary, fontWeight: '600', borderBottom: `2px solid ${theme.border}` }}>#</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: theme.textPrimary, fontWeight: '600', borderBottom: `2px solid ${theme.border}` }}>Category</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: theme.textPrimary, fontWeight: '600', borderBottom: `2px solid ${theme.border}` }}>Level</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: theme.textPrimary, fontWeight: '600', borderBottom: `2px solid ${theme.border}` }}>Score</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: theme.textPrimary, fontWeight: '600', borderBottom: `2px solid ${theme.border}` }}>Total</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: theme.textPrimary, fontWeight: '600', borderBottom: `2px solid ${theme.border}` }}>When</th>
                </tr>
              </thead>
              <tbody>
                {filteredScores.slice(0, limitRows).map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <td style={{ padding: '12px', color: theme.textSecondary }}>{i + 1}</td>
                    <td style={{ padding: '12px', color: theme.textPrimary, fontWeight: '500' }}>{s.category}</td>
                    <td style={{ padding: '12px', color: theme.textSecondary }}>{s.level || '-'}</td>
                    <td style={{ padding: '12px', color: theme.accentPrimary, fontWeight: '600' }}>{s.score}</td>
                    <td style={{ padding: '12px', color: theme.textSecondary }}>{s.total}</td>
                    <td style={{ padding: '12px', color: theme.textSecondary, fontSize: '12px' }}>
                      {s.createdAt?.toDate ? s.createdAt.toDate().toLocaleString() : (s.createdAt || '-')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '16px',
            }}>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>
                Showing {Math.min(filteredScores.length, limitRows)} of {filteredScores.length}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setLimitRows((n) => Math.max(5, n - 5))}
                  style={{
                    padding: '6px 10px',
                    background: theme.background,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: theme.textPrimary,
                    fontWeight: '600',
                  }}
                >
                  −
                </button>
                <button
                  onClick={() => setLimitRows((n) => n + 5)}
                  style={{
                    padding: '6px 10px',
                    background: theme.background,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: theme.textPrimary,
                    fontWeight: '600',
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
