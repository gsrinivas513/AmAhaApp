import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

/**
 * AnalyticsDashboard - Shows user progress, stats, and insights
 */
export default function AnalyticsDashboard({
  userId,
  theme,
  breakpoints,
  getResponsivePadding,
}) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, all

  useEffect(() => {
    loadUserStats();
  }, [userId, timeRange]);

  const loadUserStats = async () => {
    try {
      // Load quiz scores
      const scoresRef = collection(db, 'quizScores');
      const q = query(scoresRef, orderBy('timestamp', 'desc'), limit(100));
      const snapshot = await getDocs(q);

      const userScores = snapshot.docs
        .map(doc => doc.data())
        .filter(score => score.userId === userId);

      // Calculate stats
      const calculated = calculateStats(userScores, timeRange);
      setStats(calculated);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (scores, range) => {
    if (scores.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        totalTime: 0,
        recentTrend: 0,
        topCategories: [],
      };
    }

    const avgScore = Math.round(
      scores.reduce((sum, s) => sum + s.score, 0) / scores.length
    );

    const bestScore = Math.max(...scores.map(s => s.score));

    const totalTime = scores.reduce((sum, s) => sum + (s.timeSpent || 0), 0);

    // Calculate trend (recent vs older)
    const recentScores = scores.slice(0, Math.ceil(scores.length / 2));
    const olderScores = scores.slice(Math.ceil(scores.length / 2));
    const recentAvg = recentScores.reduce((sum, s) => sum + s.score, 0) / recentScores.length;
    const olderAvg = olderScores.length > 0
      ? olderScores.reduce((sum, s) => sum + s.score, 0) / olderScores.length
      : recentAvg;
    const trend = Math.round(recentAvg - olderAvg);

    // Top categories
    const categoryScores = {};
    scores.forEach(score => {
      const cat = score.category || 'General';
      categoryScores[cat] = (categoryScores[cat] || 0) + score.score;
    });

    const topCategories = Object.entries(categoryScores)
      .map(([cat, score]) => ({ category: cat, score: Math.round(score / 10) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return {
      totalQuizzes: scores.length,
      averageScore: avgScore,
      bestScore: bestScore,
      totalTime: Math.round(totalTime / 60), // in minutes
      recentTrend: trend,
      topCategories: topCategories,
    };
  };

  if (loading) {
    return <div style={{ color: theme.textSecondary }}>Loading analytics...</div>;
  }

  const isMobile = breakpoints?.isMobile ?? false;
  const padding = getResponsivePadding ? getResponsivePadding() : '16px';

  const containerStyles = {
    padding: padding,
    backgroundColor: theme.background,
    borderRadius: '8px',
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: '16px',
  };

  const cardStyles = {
    padding: '16px',
    backgroundColor: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelStyles = {
    fontSize: '12px',
    color: theme.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  };

  const valueStyles = {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: '700',
    color: theme.primary,
  };

  const StatCard = ({ label, value, trend }) => (
    <div style={cardStyles}>
      <span style={labelStyles}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={valueStyles}>{value}</span>
        {trend !== undefined && (
          <span style={{
            fontSize: '12px',
            color: trend > 0 ? theme.success : trend < 0 ? theme.error : theme.textSecondary,
            fontWeight: '600',
          }}>
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Time Range Selector */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {['week', 'month', 'all'].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            style={{
              padding: '8px 12px',
              fontSize: '12px',
              backgroundColor: timeRange === range ? theme.primary : theme.surface,
              color: timeRange === range ? theme.surface : theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div style={containerStyles}>
        <StatCard label="Total Quizzes" value={stats.totalQuizzes} />
        <StatCard label="Average Score" value={`${stats.averageScore}%`} trend={stats.recentTrend} />
        <StatCard label="Best Score" value={`${stats.bestScore}%`} />
        <StatCard label="Study Time" value={`${stats.totalTime}m`} />
      </div>

      {/* Top Categories */}
      {stats.topCategories.length > 0 && (
        <div style={cardStyles}>
          <h4 style={{ ...labelStyles, marginBottom: '8px' }}>Top Categories</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stats.topCategories.map((cat, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '8px',
                borderBottom: idx < stats.topCategories.length - 1 ? `1px solid ${theme.border}` : 'none',
              }}>
                <span style={{ fontSize: '13px', color: theme.text }}>{cat.category}</span>
                <div style={{
                  width: '60px',
                  height: '6px',
                  backgroundColor: theme.border,
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${(cat.score / 100) * 100}%`,
                    height: '100%',
                    backgroundColor: theme.primary,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
                <span style={{ fontSize: '12px', color: theme.textSecondary, minWidth: '30px', textAlign: 'right' }}>
                  {cat.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
