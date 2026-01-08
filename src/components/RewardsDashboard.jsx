/**
 * Rewards Dashboard Component
 * Displays user's XP, coins, level, achievements, and badges
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getUserRewardsProfile,
  getXPLeaderboard,
  getUserRecentRewards,
  EXTENDED_LEVELS,
} from '../services/gamificationEnhancedService';
import AchievementCard from './AchievementCard';
import BadgeCard from './BadgeCard';
import '../styles/rewards-dashboard.css';

const RewardsDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [recentRewards, setRecentRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview | achievements | badges | leaderboard
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (user?.uid) {
      loadRewardsData();
    }
  }, [user]);

  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem('theme') || 'light';
      setTheme(newTheme);
    };

    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const loadRewardsData = async () => {
    try {
      setLoading(true);
      const [profileData, leaderboardData, recentData] = await Promise.all([
        getUserRewardsProfile(user.uid),
        getXPLeaderboard(50),
        getUserRecentRewards(user.uid, 10),
      ]);

      setProfile(profileData);
      setLeaderboard(leaderboardData);
      setRecentRewards(recentData);
    } catch (error) {
      console.error('Error loading rewards data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`rewards-dashboard loading ${theme}`}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={`rewards-dashboard error ${theme}`}>
        <p>Failed to load rewards profile</p>
      </div>
    );
  }

  return (
    <div className={`rewards-dashboard ${theme}`}>
      {/* Header */}
      <div className="rewards-header">
        <h1>🏆 Rewards Dashboard</h1>
        <p>Track your progress, achievements, and rewards</p>
      </div>

      {/* Profile Cards */}
      <div className="rewards-profile">
        {/* Level Card */}
        <div className="profile-card level-card">
          <div className="level-display">
            <div className="level-icon">{profile.levelInfo?.icon || '🌱'}</div>
            <div className="level-info">
              <h2>Level {profile.level}</h2>
              <p className="level-name">{profile.levelInfo?.name || 'Unknown'}</p>
            </div>
          </div>
          <div className="level-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    profile.nextLevel
                      ? (profile.nextLevel.progress / profile.nextLevel.totalForLevel) * 100
                      : 100
                  }%`,
                }}
              ></div>
            </div>
            <p className="progress-text">
              {profile.nextLevel
                ? `${profile.nextLevel.xpNeeded} XP to next level`
                : 'Max level reached!'}
            </p>
          </div>
        </div>

        {/* XP Card */}
        <div className="profile-card xp-card">
          <div className="card-icon">⚡</div>
          <div className="card-content">
            <h3>Total XP</h3>
            <p className="card-value">{profile.xp.toLocaleString()}</p>
          </div>
        </div>

        {/* Coins Card */}
        <div className="profile-card coins-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Coins</h3>
            <p className="card-value">{profile.coins.toLocaleString()}</p>
          </div>
        </div>

        {/* Achievements Card */}
        <div className="profile-card achievements-card">
          <div className="card-icon">🎖️</div>
          <div className="card-content">
            <h3>Achievements</h3>
            <p className="card-value">{profile.totalAchievements}</p>
          </div>
        </div>

        {/* Badges Card */}
        <div className="profile-card badges-card">
          <div className="card-icon">🏅</div>
          <div className="card-content">
            <h3>Badges</h3>
            <p className="card-value">{profile.totalBadges}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="rewards-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          🎖️ Achievements ({profile.totalAchievements})
        </button>
        <button
          className={`tab-button ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          🏅 Badges ({profile.totalBadges})
        </button>
        <button
          className={`tab-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          🥇 Leaderboard
        </button>
      </div>

      {/* Tab Content */}
      <div className="rewards-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-pane overview-pane">
            {/* Level System Info */}
            <div className="section">
              <h3>📈 Level System</h3>
              <div className="level-system">
                {EXTENDED_LEVELS.map((level) => (
                  <div
                    key={level.level}
                    className={`level-item ${level.level <= profile.level ? 'completed' : ''}`}
                  >
                    <div className="level-item-icon">{level.icon}</div>
                    <div className="level-item-info">
                      <p className="level-item-name">{level.name}</p>
                      <p className="level-item-xp">{level.xpRequired.toLocaleString()} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Rewards */}
            <div className="section">
              <h3>🎁 Recent Rewards</h3>
              <div className="recent-rewards">
                {recentRewards.length > 0 ? (
                  recentRewards.map((reward, index) => (
                    <div key={index} className={`reward-item reward-${reward.type}`}>
                      <div className="reward-icon">
                        {reward.type === 'xp' && '⚡'}
                        {reward.type === 'coins' && '💰'}
                        {reward.type === 'badge' && '🏅'}
                        {reward.type === 'achievement' && '🎖️'}
                      </div>
                      <div className="reward-info">
                        <p className="reward-reason">{reward.reason}</p>
                        <p className="reward-time">
                          {new Date(reward.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="reward-amount">
                        +{reward.amount} {reward.type === 'xp' ? 'XP' : 'Coins'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">No recent rewards yet. Start earning!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="tab-pane achievements-pane">
            <div className="achievements-grid">
              {profile.achievements.length > 0 ? (
                profile.achievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    unlocked={true}
                  />
                ))
              ) : (
                <p className="empty-state">No achievements unlocked yet. Complete tasks to earn achievements!</p>
              )}
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="tab-pane badges-pane">
            <div className="badges-grid">
              {profile.badges.length > 0 ? (
                profile.badges.map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    unlocked={true}
                  />
                ))
              ) : (
                <p className="empty-state">No badges earned yet. Complete special challenges to earn badges!</p>
              )}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="tab-pane leaderboard-pane">
            <div className="leaderboard">
              <div className="leaderboard-header">
                <div className="rank-col">Rank</div>
                <div className="user-col">User</div>
                <div className="level-col">Level</div>
                <div className="xp-col">XP</div>
              </div>
              {leaderboard.map((entry) => (
                <div
                  key={entry.userId}
                  className={`leaderboard-row ${entry.userId === user.uid ? 'current-user' : ''}`}
                >
                  <div className="rank-col">
                    <span className="rank-badge">
                      {entry.rank === 1 && '🥇'}
                      {entry.rank === 2 && '🥈'}
                      {entry.rank === 3 && '🥉'}
                      {entry.rank > 3 && `#${entry.rank}`}
                    </span>
                  </div>
                  <div className="user-col">
                    {entry.username}
                    {entry.userId === user.uid && <span className="you-badge">YOU</span>}
                  </div>
                  <div className="level-col">
                    <span className="level-badge">{entry.level}</span>
                  </div>
                  <div className="xp-col">{entry.xp.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="rewards-actions">
        <button className="refresh-button" onClick={loadRewardsData}>
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default RewardsDashboard;
