import React, { useState, useEffect } from 'react';
import { MULTIPLAYER_CONFIG } from '../services/phase8Service';
import { useTheme } from '../context/ThemeContext';
import '../styles/multiplayer.css';

const MultiplayerPage = ({ userId, userElo = 1200, onMatchFound }) => {
  const { theme } = useTheme();
  const [gameMode, setGameMode] = useState('ranked');
  const [isSearching, setIsSearching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [activeMatches, setActiveMatches] = useState([]);
  const [userStats, setUserStats] = useState({
    wins: 0,
    losses: 0,
    currentElo: userElo,
    matchHistory: [],
  });

  const gameModes = [
    { id: 'ranked', name: 'Ranked', icon: '🏆', description: 'Compete for rating points' },
    { id: 'casual', name: 'Casual', icon: '🎮', description: 'Play for fun' },
    { id: 'team', name: 'Team Battle', icon: '👥', description: '2v2 team matches' },
  ];

  const handleFindMatch = () => {
    setIsSearching(true);
    // Simulate finding a match after 3-5 seconds
    const timeout = setTimeout(() => {
      setMatchFound(true);
      setIsSearching(false);
      const opponent = generateOpponent();
      onMatchFound?.(opponent);
    }, 3000 + Math.random() * 2000);

    return () => clearTimeout(timeout);
  };

  const generateOpponent = () => {
    const names = ['ProGamer', 'PuzzleMaster', 'QuickThink', 'BrainTease', 'LogicLord'];
    const eloRanges = [-100, -50, 0, 50, 100];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomElo = userStats.currentElo + eloRanges[Math.floor(Math.random() * eloRanges.length)];

    return {
      id: `opponent_${Date.now()}`,
      displayName: randomName,
      elo: Math.max(800, randomElo),
      wins: Math.floor(Math.random() * 100),
      level: Math.floor(Math.random() * 40) + 1,
      avatar: '🧑',
    };
  };

  const calculateEloChange = (result) => {
    return Math.round(32 * (result === 'win' ? 1 : 0 - 1) * (1 + Math.random() * 0.2));
  };

  const getRankFromElo = (elo) => {
    if (elo < 1000) return { name: 'Bronze', color: '#CD7F32', icon: '🥉' };
    if (elo < 1400) return { name: 'Silver', color: '#C0C0C0', icon: '🥈' };
    if (elo < 1800) return { name: 'Gold', color: '#FFD700', icon: '🥇' };
    if (elo < 2200) return { name: 'Diamond', color: '#00D9FF', icon: '💎' };
    return { name: 'Master', color: '#FF6B9D', icon: '👑' };
  };

  const rank = getRankFromElo(userStats.currentElo);
  const winRate = userStats.wins + userStats.losses > 0 
    ? Math.round((userStats.wins / (userStats.wins + userStats.losses)) * 100)
    : 0;

  return (
    <div className="multiplayer-container" style={{ backgroundColor: theme.background, color: theme.textPrimary, transition: 'background-color 0.3s, color 0.3s' }}>
      {/* Header */}
      <div className="multiplayer-header" style={{ borderColor: theme.border }}>
        <h1 style={{ color: theme.textPrimary }}>⚔️ Multiplayer Arena</h1>
        <p style={{ color: theme.textSecondary }}>Compete with players worldwide</p>
      </div>

      {/* Player Stats */}
      <div className="player-stats-card" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
        <div className="rank-display" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
          <span className="rank-icon">{rank.icon}</span>
          <div className="rank-info">
            <p className="rank-name" style={{ color: theme.textPrimary }}>{rank.name}</p>
            <p className="elo-display" style={{ color: theme.accentPrimary }}>{userStats.currentElo}</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
            <span className="stat-icon">🎯</span>
            <span className="stat-value" style={{ color: theme.accentPrimary }}>{userStats.wins}</span>
            <span className="stat-label" style={{ color: theme.textSecondary }}>Wins</span>
          </div>
          <div className="stat-card" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
            <span className="stat-icon">📉</span>
            <span className="stat-value" style={{ color: theme.accentPrimary }}>{userStats.losses}</span>
            <span className="stat-label" style={{ color: theme.textSecondary }}>Losses</span>
          </div>
          <div className="stat-card" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
            <span className="stat-icon">📊</span>
            <span className="stat-value" style={{ color: theme.accentPrimary }}>{winRate}%</span>
            <span className="stat-label" style={{ color: theme.textSecondary }}>Win Rate</span>
          </div>
        </div>
      </div>

      {/* Game Mode Selection */}
      <div className="game-modes-section" style={{ borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>Select Game Mode</h3>
        <div className="modes-grid">
          {gameModes.map((mode) => (
            <button
              key={mode.id}
              className={`mode-button ${gameMode === mode.id ? 'active' : ''} ${isSearching ? 'disabled' : ''}`}
              onClick={() => !isSearching && setGameMode(mode.id)}
              disabled={isSearching}
              style={{
                backgroundColor: gameMode === mode.id ? theme.accentPrimary : theme.surfaceSecondary,
                color: gameMode === mode.id ? 'white' : theme.textPrimary,
                borderColor: theme.border
              }}
            >
              <span className="mode-icon">{mode.icon}</span>
              <p className="mode-name">{mode.name}</p>
              <p className="mode-description" style={{ color: gameMode === mode.id ? 'rgba(255,255,255,0.8)' : theme.textSecondary }}>{mode.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Matchmaking Section */}
      <div className="matchmaking-section" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
        {!matchFound ? (
          <>
            <h3 style={{ color: theme.textPrimary }}>Find a Match</h3>
            <div className="match-info" style={{ color: theme.textPrimary }}>
              <p>Playing: <strong style={{ color: theme.accentPrimary }}>{gameModes.find(m => m.id === gameMode)?.name}</strong></p>
              <p>Estimated time to match: <strong style={{ color: theme.accentPrimary }}>10-30 seconds</strong></p>
            </div>

            <button
              className={`find-match-btn ${isSearching ? 'searching' : ''}`}
              onClick={handleFindMatch}
              disabled={isSearching}
              style={{ background: theme.gradientAccent, color: 'white' }}
            >
              {isSearching ? (
                <>
                  <span className="searching-spinner">⏳</span>
                  Searching for opponent...
                </>
              ) : (
                <>
                  <span className="search-icon">🔍</span>
                  Find Match
                </>
              )}
            </button>

            {isSearching && (
              <div className="searching-info" style={{ color: theme.textSecondary }}>
                <p>Looking for a worthy opponent...</p>
              </div>
            )}
          </>
        ) : (
          <div className="match-found" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
            <h3 style={{ color: theme.textPrimary }}>🎉 Match Found!</h3>
            <div className="vs-display">
              <div className="vs-player" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
                <span className="vs-avatar">👤</span>
                <p style={{ color: theme.accentPrimary }}>{userStats.currentElo}</p>
              </div>
              <div className="vs-text" style={{ color: theme.textSecondary }}>VS</div>
              <div className="vs-opponent" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
                <span className="vs-avatar">🤖</span>
                <p style={{ color: theme.accentPrimary }}>~{userStats.currentElo}</p>
              </div>
            </div>
            <div className="match-actions">
              <button className="start-match-btn" onClick={() => setMatchFound(false)} style={{ background: theme.gradientAccent, color: 'white' }}>
                ▶️ Start Match
              </button>
              <button className="decline-match-btn" onClick={() => setMatchFound(false)} style={{ backgroundColor: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.border }}>
                ✕ Decline
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Matches */}
      <div className="active-matches-section" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>🔴 Live Matches</h3>
        <div className="matches-list">
          {activeMatches.length > 0 ? (
            activeMatches.map((match) => (
              <div key={match.id} className="match-item" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
                <div className="match-players" style={{ color: theme.textPrimary }}>
                  <span className="player-info">
                    {match.player1} <strong style={{ color: theme.accentPrimary }}>({match.player1Elo})</strong>
                  </span>
                  <span className="vs-badge" style={{ color: theme.textSecondary }}>VS</span>
                  <span className="player-info">
                    {match.player2} <strong style={{ color: theme.accentPrimary }}>({match.player2Elo})</strong>
                  </span>
                </div>
                <button className="watch-btn" style={{ backgroundColor: theme.accentPrimary, color: 'white' }}>👁️ Watch</button>
              </div>
            ))
          ) : (
            <p className="no-matches" style={{ color: theme.textSecondary }}>No live matches right now</p>
          )}
        </div>
      </div>

      {/* Match History */}
      <div className="match-history-section" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>📋 Recent Matches</h3>
        <div className="history-list">
          {userStats.matchHistory.length > 0 ? (
            userStats.matchHistory.slice(0, 5).map((match, idx) => (
              <div key={idx} className={`history-item ${match.result}`} style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
                <span className="match-result" style={{ color: theme.accentPrimary }}>{match.result === 'win' ? '✓' : '✕'}</span>
                <div className="match-details">
                  <p style={{ color: theme.textPrimary }}><strong>{match.opponent}</strong></p>
                  <p className="match-time" style={{ color: theme.textSecondary }}>{match.timeAgo}</p>
                </div>
                <span className={`elo-change ${match.eloChange > 0 ? 'positive' : 'negative'}`} style={{ color: theme.accentPrimary }}>
                  {match.eloChange > 0 ? '+' : ''}{match.eloChange}
                </span>
              </div>
            ))
          ) : (
            <p className="no-history" style={{ color: theme.textSecondary }}>No match history yet</p>
          )}
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div className="leaderboard-preview" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>🏆 Top Players This Week</h3>
        <div className="leaderboard-list">
          {[1, 2, 3, 4, 5].map((pos) => (
            <div key={pos} className="leaderboard-entry" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
              <span className="position" style={{ color: theme.textSecondary }}>#{pos}</span>
              <span className="player-name" style={{ color: theme.textPrimary }}>Player {pos}</span>
              <span className="player-elo" style={{ color: theme.accentPrimary }}>{2500 - pos * 100}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="multiplayer-tips" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>💡 Multiplayer Tips</h3>
        <ul style={{ color: theme.textPrimary }}>
          <li>Win matches to increase your Elo rating</li>
          <li>Each game type requires different strategies</li>
          <li>Climb the ranks from Bronze to Master</li>
          <li>Check the leaderboard to see where you rank</li>
          <li>Team mode requires communication and coordination</li>
        </ul>
      </div>
    </div>
  );
};

export default MultiplayerPage;
