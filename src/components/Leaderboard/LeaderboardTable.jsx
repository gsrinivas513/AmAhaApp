/**
 * LeaderboardTable.jsx
 * 
 * Displays leaderboard with rankings
 * - Show top players
 * - Highlight user's rank
 * - Filter by period (daily, weekly, category)
 * - Support pagination
 */

import React, { useState, useEffect } from 'react';
import { getLeaderboardPaginated, getUserRank } from '../../services/leaderboardService';
import { auth } from '../../firebase/firebaseConfig';
import './LeaderboardTable.css';

export default function LeaderboardTable({
  period = 'daily',
  categoryId = 'global',
  pageSize = 20
}) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    loadLeaderboard();
  }, [period, categoryId, pageNumber]);

  useEffect(() => {
    if (user) {
      loadUserRank();
    }
  }, [user, period, categoryId]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const result = await getLeaderboardPaginated(
        period,
        categoryId,
        pageSize,
        pageNumber
      );
      setLeaderboard(result.leaderboard);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserRank = async () => {
    try {
      const rank = await getUserRank(user.uid, period, categoryId);
      setUserRank(rank);
    } catch (error) {
      console.error('Error loading user rank:', error);
    }
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const handlePrevious = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNext = () => {
    if (hasMore) {
      setPageNumber(pageNumber + 1);
    }
  };

  if (loading) {
    return (
      <div className="leaderboard-table">
        <div className="leaderboard-loading">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="leaderboard-table">
      {userRank && userRank.rank > 3 && (
        <div className="user-position-card">
          <div className="your-rank-badge">Your Rank</div>
          <div className="user-rank-display">
            <div className="rank-position">#{userRank.rank}</div>
            <div className="user-name">{userRank.displayName}</div>
            <div className="user-score">{userRank.score.toLocaleString()} pts</div>
          </div>
        </div>
      )}

      <table className="rankings-table">
        <thead>
          <tr>
            <th className="rank-col">Rank</th>
            <th className="player-col">Player</th>
            <th className="score-col">Score</th>
            <th className="stats-col">Games</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((player, index) => (
            <tr
              key={player.userId || index}
              className={`player-row ${
                user && player.userId === user.uid ? 'current-user' : ''
              } ${index < 3 ? 'top-three' : ''}`}
            >
              <td className="rank-col">
                <span className="rank-badge">
                  {getMedalEmoji(player.rank) || `#${player.rank}`}
                </span>
              </td>
              <td className="player-col">
                <div className="player-info">
                  {player.avatar && (
                    <img src={player.avatar} alt={player.displayName} className="player-avatar" />
                  )}
                  <div className="player-name">
                    {player.displayName || 'Anonymous'}
                    {user && player.userId === user.uid && <span className="you-badge">You</span>}
                  </div>
                </div>
              </td>
              <td className="score-col">
                <span className="score-value">{player.score.toLocaleString()}</span>
              </td>
              <td className="stats-col">
                <span className="game-count">{player.gamesPlayed || 0}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="leaderboard-pagination">
        <button
          className="pagination-btn"
          onClick={handlePrevious}
          disabled={pageNumber === 1}
        >
          ← Previous
        </button>
        <span className="pagination-info">Page {pageNumber}</span>
        <button
          className="pagination-btn"
          onClick={handleNext}
          disabled={!hasMore}
        >
          Next →
        </button>
      </div>

      {leaderboard.length === 0 && (
        <div className="empty-leaderboard">
          <p>No players yet. Be the first! 🚀</p>
        </div>
      )}
    </div>
  );
}
