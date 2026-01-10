import React, { useState, useEffect } from 'react';
import { getUserAnalytics } from '../services/phase8Service';
import { useTheme } from '../context/ThemeContext';
import '../styles/analytics.css';

const AnalyticsDashboard = ({ userId }) => {
  const { theme } = useTheme();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [userId, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    const data = await getUserAnalytics(userId);
    setAnalyticsData(data);
    setLoading(false);
  };

  const mockData = {
    totalPuzzles: 234,
    averageTime: 285,
    accuracy: 86,
    currentStreak: 12,
    totalXP: 5420,
    totalCoins: 1200,
    levelProgress: 45,
    currentLevel: 8,
  };

  const timeRanges = [
    { id: 'day', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All Time' },
  ];

  return (
    <div className="analytics-container" style={{ backgroundColor: theme.background, color: theme.textPrimary, transition: 'background-color 0.3s, color 0.3s' }}>
      {/* Header */}
      <div className="analytics-header" style={{ borderColor: theme.border }}>
        <h1 style={{ color: theme.textPrimary }}>📊 Analytics Dashboard</h1>
        <p style={{ color: theme.textSecondary }}>Track your puzzle mastery journey</p>
      </div>

      {/* Time Range Selector */}
      <div className="analytics-controls">
        <div className="control-group">
          <label style={{ color: theme.textPrimary }}>Time Range</label>
          <div className="time-range-selector">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                className={`range-button ${timeRange === range.id ? 'active' : ''}`}
                onClick={() => setTimeRange(range.id)}
                style={{
                  backgroundColor: timeRange === range.id ? theme.accentPrimary : theme.surfaceSecondary,
                  color: timeRange === range.id ? 'white' : theme.textPrimary,
                  borderColor: theme.border
                }}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card primary" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border, color: theme.textPrimary }}>
          <span className="metric-icon">📊</span>
          <p className="metric-label" style={{ color: theme.textSecondary }}>Total Puzzles</p>
          <p className="metric-value" style={{ color: theme.accentPrimary }}>{mockData.totalPuzzles}</p>
          <p className="metric-change" style={{ color: theme.textSecondary }}>+24 this week</p>
        </div>

        <div className="metric-card primary" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border, color: theme.textPrimary }}>
          <span className="metric-icon">⏱️</span>
          <p className="metric-label" style={{ color: theme.textSecondary }}>Avg Time</p>
          <p className="metric-value" style={{ color: theme.accentPrimary }}>{mockData.averageTime}s</p>
          <p className="metric-change" style={{ color: theme.textSecondary }}>-10s faster</p>
        </div>

        <div className="metric-card primary" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border, color: theme.textPrimary }}>
          <span className="metric-icon">🎯</span>
          <p className="metric-label" style={{ color: theme.textSecondary }}>Accuracy</p>
          <p className="metric-value" style={{ color: theme.accentPrimary }}>{mockData.accuracy}%</p>
          <p className="metric-change" style={{ color: theme.textSecondary }}>+2% improvement</p>
        </div>

        <div className="metric-card primary" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border, color: theme.textPrimary }}>
          <span className="metric-icon">🔥</span>
          <p className="metric-label" style={{ color: theme.textSecondary }}>Current Streak</p>
          <p className="metric-value" style={{ color: theme.accentPrimary }}>{mockData.currentStreak}</p>
          <p className="metric-change" style={{ color: theme.textSecondary }}>days</p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="progress-section">
        <div className="progress-card" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
          <h3 style={{ color: theme.textPrimary }}>⭐ Experience Progress</h3>
          <div className="xp-info">
            <span className="xp-amount" style={{ color: theme.accentPrimary }}>{mockData.totalXP}</span>
            <span className="xp-label" style={{ color: theme.textSecondary }}>Total XP</span>
          </div>
          <div className="level-progress">
            <div className="level-display" style={{ backgroundColor: theme.background }}>
              <span className="level-number" style={{ color: theme.accentPrimary }}>{mockData.currentLevel}</span>
              <span className="level-label" style={{ color: theme.textSecondary }}>Current Level</span>
            </div>
            <div className="progress-bar" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
              <div className="progress-fill" style={{ width: `${mockData.levelProgress}%`, background: theme.gradientAccent }}></div>
            </div>
            <p className="progress-text" style={{ color: theme.textSecondary }}>{mockData.levelProgress}% to next level</p>
          </div>
        </div>

        <div className="progress-card" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
          <h3 style={{ color: theme.textPrimary }}>💰 Coins Earned</h3>
          <div className="coin-info">
            <span className="coin-amount" style={{ color: theme.accentPrimary }}>{mockData.totalCoins}</span>
            <span className="coin-label" style={{ color: theme.textSecondary }}>Total Coins</span>
          </div>
          <div className="coin-breakdown">
            <div className="coin-source">
              <span className="source-label" style={{ color: theme.textSecondary }}>From Puzzles</span>
              <span className="source-amount" style={{ color: theme.accentPrimary }}>780</span>
            </div>
            <div className="coin-source">
              <span className="source-label" style={{ color: theme.textSecondary }}>From Challenges</span>
              <span className="source-amount" style={{ color: theme.accentPrimary }}>420</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart Section */}
      <div className="chart-section" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>📈 Performance Trends</h3>
        <div className="chart-container">
          <div className="chart" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <div className="chart-title" style={{ color: theme.textPrimary }}>Puzzles Completed Per Day</div>
            <div className="bar-chart">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const height = Math.floor(Math.random() * 80) + 20;
                return (
                  <div key={day} className="bar-item">
                    <div className="bar" style={{ height: `${height}%`, background: theme.gradientAccent }}></div>
                    <span className="day-label" style={{ color: theme.textSecondary }}>{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="chart" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <div className="chart-title" style={{ color: theme.textPrimary }}>Accuracy by Puzzle Type</div>
            <div className="accuracy-chart">
              <div className="accuracy-item">
                <span className="puzzle-type" style={{ color: theme.textPrimary }}>📝 Crossword</span>
                <div className="accuracy-bar-bg" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
                  <div className="accuracy-bar" style={{ width: '88%', background: theme.gradientAccent }}></div>
                </div>
                <span className="accuracy-value" style={{ color: theme.accentPrimary }}>88%</span>
              </div>
              <div className="accuracy-item">
                <span className="puzzle-type" style={{ color: theme.textPrimary }}>🔢 Sudoku</span>
                <div className="accuracy-bar-bg" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
                  <div className="accuracy-bar" style={{ width: '85%', background: theme.gradientAccent }}></div>
                </div>
                <span className="accuracy-value" style={{ color: theme.accentPrimary }}>85%</span>
              </div>
              <div className="accuracy-item">
                <span className="puzzle-type" style={{ color: theme.textPrimary }}>🔍 Word Search</span>
                <div className="accuracy-bar-bg" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
                  <div className="accuracy-bar" style={{ width: '84%', background: theme.gradientAccent }}></div>
                </div>
                <span className="accuracy-value" style={{ color: theme.accentPrimary }}>84%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Distribution */}
      <div className="difficulty-section" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>🎯 Difficulty Distribution</h3>
        <div className="difficulty-grid">
          {['easy', 'medium', 'hard', 'expert'].map((diff, idx) => {
            const percentages = [25, 35, 30, 10];
            return (
              <div key={diff} className="difficulty-card" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
                <span className="diff-icon">
                  {diff === 'easy' && '🟢'}
                  {diff === 'medium' && '🟡'}
                  {diff === 'hard' && '🔴'}
                  {diff === 'expert' && '💜'}
                </span>
                <p className="diff-label" style={{ color: theme.textPrimary }}>{diff.toUpperCase()}</p>
                <p className="diff-count" style={{ color: theme.textSecondary }}>58 puzzles</p>
                <div className="diff-bar" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
                  <div className="diff-fill" style={{ width: `${percentages[idx]}%`, background: theme.gradientAccent }}></div>
                </div>
                <p className="diff-percentage" style={{ color: theme.accentPrimary }}>{percentages[idx]}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="achievements-analytics" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>🏆 Achievements Earned</h3>
        <div className="achievements-list">
          <div className="achievement-item" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <span className="achievement-icon">🎖️</span>
            <div className="achievement-content">
              <p className="achievement-name" style={{ color: theme.textPrimary }}>Puzzle Master</p>
              <p className="achievement-desc" style={{ color: theme.textSecondary }}>Complete 100 puzzles</p>
            </div>
            <span className="achievement-date" style={{ color: theme.textSecondary }}>2 weeks ago</span>
          </div>

          <div className="achievement-item" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <span className="achievement-icon">🔥</span>
            <div className="achievement-content">
              <p className="achievement-name" style={{ color: theme.textPrimary }}>7-Day Streak</p>
              <p className="achievement-desc" style={{ color: theme.textSecondary }}>Complete puzzles for 7 consecutive days</p>
            </div>
            <span className="achievement-date" style={{ color: theme.textSecondary }}>1 week ago</span>
          </div>

          <div className="achievement-item" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <span className="achievement-icon">⭐</span>
            <div className="achievement-content">
              <p className="achievement-name" style={{ color: theme.textPrimary }}>Perfect Score</p>
              <p className="achievement-desc" style={{ color: theme.textSecondary }}>Achieve 100% accuracy on a puzzle</p>
            </div>
            <span className="achievement-date" style={{ color: theme.textSecondary }}>3 days ago</span>
          </div>

          <div className="achievement-item" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <span className="achievement-icon">🏃</span>
            <div className="achievement-content">
              <p className="achievement-name" style={{ color: theme.textPrimary }}>Speed Demon</p>
              <p className="achievement-desc">Complete a puzzle in under 1 minute</p>
            </div>
            <span className="achievement-date">Today</span>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="goals-section" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>🎯 Your Goals</h3>
        <div className="goals-list">
          <div className="goal-item" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <div className="goal-header">
              <p className="goal-name" style={{ color: theme.textPrimary }}>Reach Level 10</p>
              <span className="goal-progress" style={{ color: theme.accentPrimary }}>45%</span>
            </div>
            <div className="goal-bar" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
              <div className="goal-fill" style={{ width: '45%', background: theme.gradientAccent }}></div>
            </div>
            <p className="goal-deadline" style={{ color: theme.textSecondary }}>Due in 15 days</p>
          </div>

          <div className="goal-item" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <div className="goal-header">
              <p className="goal-name" style={{ color: theme.textPrimary }}>30-Day Streak</p>
              <span className="goal-progress" style={{ color: theme.accentPrimary }}>40%</span>
            </div>
            <div className="goal-bar" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
              <div className="goal-fill" style={{ width: '40%', background: theme.gradientAccent }}></div>
            </div>
            <p className="goal-deadline" style={{ color: theme.textSecondary }}>12 days complete, 18 to go</p>
          </div>

          <div className="goal-item" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <div className="goal-header">
              <p className="goal-name" style={{ color: theme.textPrimary }}>Master All Puzzle Types</p>
              <span className="goal-progress" style={{ color: theme.accentPrimary }}>67%</span>
            </div>
            <div className="goal-bar" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
              <div className="goal-fill" style={{ width: '67%', background: theme.gradientAccent }}></div>
            </div>
            <p className="goal-deadline" style={{ color: theme.textSecondary }}>2 of 3 types mastered</p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="insights-section" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>💡 Personal Insights</h3>
        <div className="insights-grid">
          <div className="insight-card" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <p className="insight-title" style={{ color: theme.textPrimary }}>Best Time of Day</p>
            <p className="insight-value" style={{ color: theme.accentPrimary }}>Morning (8-10 AM)</p>
            <p className="insight-desc" style={{ color: theme.textSecondary }}>+15% higher accuracy</p>
          </div>

          <div className="insight-card" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <p className="insight-title" style={{ color: theme.textPrimary }}>Favorite Type</p>
            <p className="insight-value" style={{ color: theme.accentPrimary }}>Crossword</p>
            <p className="insight-desc" style={{ color: theme.textSecondary }}>82 puzzles completed</p>
          </div>

          <div className="insight-card" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <p className="insight-title" style={{ color: theme.textPrimary }}>Improvement Trend</p>
            <p className="insight-value" style={{ color: theme.accentPrimary }}>Positive</p>
            <p className="insight-desc" style={{ color: theme.textSecondary }}>+8% accuracy this month</p>
          </div>

          <div className="insight-card" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <p className="insight-title" style={{ color: theme.textPrimary }}>Recommended Focus</p>
            <p className="insight-value" style={{ color: theme.accentPrimary }}>Word Search</p>
            <p className="insight-desc" style={{ color: theme.textSecondary }}>Lowest accuracy type</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
