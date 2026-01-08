import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

/**
 * EnhancedLeaderboard - Global leaderboard with filters and sorting
 */
export default function EnhancedLeaderboard({
  quizId,
  theme,
  breakpoints,
  getResponsivePadding,
  userId,
}) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('All');
  const [timeRange, setTimeRange] = useState('all');
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, [quizId, difficulty, timeRange]);

  const loadLeaderboard = async () => {
    try {
      const scoresRef = collection(db, 'quizScores');
      const q = query(scoresRef, orderBy('score', 'desc'), limit(100));
      const snapshot = await getDocs(q);

      let scores = snapshot.docs
        .map((doc, idx) => ({
          ...doc.data(),
          id: doc.id,
          rank: idx + 1,
        }))
        .filter(score => !quizId || score.quizId === quizId);

      // Filter by difficulty
      if (difficulty !== 'All') {
        scores = scores.filter(s => s.difficulty === difficulty);
      }

      // Reorder by rank after filtering
      scores = scores.map((score, idx) => ({ ...score, rank: idx + 1 }));

      // Find user rank
      const userScore = scores.find(s => s.userId === userId);
      if (userScore) {
        setUserRank(userScore.rank);
      }

      setLeaders(scores.slice(0, 50));
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ color: theme.textSecondary }}>Loading leaderboard...</div>;
  }

  const isMobile = breakpoints?.isMobile ?? false;
  const padding = getResponsivePadding ? getResponsivePadding() : '16px';

  const containerStyles = {
    padding: padding,
    backgroundColor: theme.background,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const filterStyles = {
    display: 'flex',
    gap: '8px',
    flexWrap: isMobile ? 'wrap' : 'nowrap',
  };

  const filterButtonStyles = {
    padding: '8px 12px',
    fontSize: '12px',
    backgroundColor: theme.surface,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  };

  const activeFilterStyles = {
    ...filterButtonStyles,
    backgroundColor: theme.primary,
    color: theme.surface,
  };

  const leaderboardTableStyles = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: isMobile ? '12px' : '13px',
  };

  const thStyles = {
    padding: '12px',
    textAlign: 'left',
    backgroundColor: theme.surface,
    borderBottom: `2px solid ${theme.border}`,
    color: theme.textSecondary,
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
  };

  const tdStyles = {
    padding: '12px',
    borderBottom: `1px solid ${theme.border}`,
    color: theme.text,
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return theme.primary;
    if (rank === 2) return theme.secondary;
    if (rank <= 10) return theme.success;
    return theme.text;
  };

  return (
    <div style={containerStyles}>
      {/* Filters */}
      <div style={filterStyles}>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{
            ...filterButtonStyles,
            flex: isMobile ? '1' : 'auto',
            minWidth: '100px',
          }}
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <div style={{ ...filterStyles, flex: isMobile ? '1' : 'auto', marginLeft: 'auto' }}>
          {['all', 'week', 'month'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={
                timeRange === range
                  ? activeFilterStyles
                  : filterButtonStyles
              }
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* User's Rank */}
      {userRank && (
        <div style={{
          padding: '12px',
          backgroundColor: theme.primary + '15',
          border: `1px solid ${theme.primary}`,
          borderRadius: '6px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: theme.primary }}>
            Your Rank: #{userRank}
          </span>
        </div>
      )}

      {/* Leaderboard Table */}
      <div style={{ overflowX: isMobile ? 'auto' : 'visible' }}>
        <table style={leaderboardTableStyles}>
          <thead>
            <tr>
              <th style={thStyles}>Rank</th>
              <th style={thStyles}>User</th>
              <th style={thStyles}>Score</th>
              {!isMobile && <th style={thStyles}>Difficulty</th>}
              {!isMobile && <th style={thStyles}>Time</th>}
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader, idx) => (
              <tr
                key={leader.id}
                style={{
                  backgroundColor: leader.userId === userId ? theme.primary + '10' : 'transparent',
                }}
              >
                <td style={{
                  ...tdStyles,
                  fontWeight: '700',
                  color: getRankColor(leader.rank),
                  fontSize: isMobile ? '14px' : '13px',
                }}>
                  {getMedalEmoji(leader.rank)}
                </td>
                <td style={{
                  ...tdStyles,
                  fontWeight: leader.userId === userId ? '600' : '400',
                }}>
                  {leader.userName || `User ${leader.userId.slice(0, 6)}`}
                  {leader.userId === userId && <span style={{ color: theme.success }}> (You)</span>}
                </td>
                <td style={{ ...tdStyles, fontWeight: '600', color: theme.primary }}>
                  {leader.score}%
                </td>
                {!isMobile && (
                  <>
                    <td style={tdStyles}>{leader.difficulty || 'N/A'}</td>
                    <td style={tdStyles}>{Math.round((leader.timeSpent || 0) / 60)}m</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {leaders.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '32px',
          color: theme.textSecondary,
        }}>
          No leaderboard data available
        </div>
      )}
    </div>
  );
}
