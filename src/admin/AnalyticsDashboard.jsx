import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Card } from '../components/ui';
import { useToast } from '../components/Toast';
import {
  getUserEngagementMetrics,
  getPlatformAnalytics,
  getCategoryPerformanceAnalytics,
  getLeaderboardAnalytics,
} from '../services/analyticsService';
import { performanceMonitor } from '../utils/performanceMonitor';
import './AnalyticsDashboard.css';

/**
 * Analytics Dashboard
 * Displays comprehensive analytics and performance metrics
 */
function AnalyticsDashboard() {
  const { notify } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [platformAnalytics, setPlatformAnalytics] = useState(null);
  const [userEngagement, setUserEngagement] = useState(null);
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Get platform analytics
      const platformData = await getPlatformAnalytics();
      setPlatformAnalytics(platformData);

      // Get leaderboard analytics
      const leaderboardData = await getLeaderboardAnalytics(20);
      setLeaderboard(leaderboardData);

      // Get performance metrics
      const metrics = performanceMonitor.getAllMetrics();
      const vitals = performanceMonitor.getCoreWebVitals();
      const memory = performanceMonitor.getMemoryUsage();
      setPerformanceMetrics({
        metrics,
        vitals,
        memory,
      });

      notify.success('Analytics loaded successfully');
    } catch (err) {
      console.error('Failed to load analytics:', err);
      notify.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const loadUserAnalytics = async (userId) => {
    setLoading(true);
    try {
      const engagement = await getUserEngagementMetrics(userId);
      const categoryPerf = await getCategoryPerformanceAnalytics(userId);

      setUserEngagement(engagement);
      setCategoryPerformance(categoryPerf);

      notify.success('User analytics loaded');
    } catch (err) {
      console.error('Failed to load user analytics:', err);
      notify.error('Failed to load user analytics');
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    try {
      const data = {
        platformAnalytics,
        timestamp: new Date().toISOString(),
      };
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      notify.success('Analytics exported successfully');
    } catch (err) {
      notify.error('Failed to export analytics');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Track engagement, performance, and platform health
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200 flex-wrap">
          {['overview', 'platform', 'performance', 'leaderboard'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold border-b-2 transition-all capitalize ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'overview' && '📈 Overview'}
              {tab === 'platform' && '🌍 Platform'}
              {tab === 'performance' && '⚡ Performance'}
              {tab === 'leaderboard' && '🏆 Leaderboard'}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && !loading && platformAnalytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <div className="text-sm font-semibold text-blue-700 mb-2">
                  Total Events
                </div>
                <div className="text-3xl font-bold text-blue-900">
                  {platformAnalytics.totalEvents.toLocaleString()}
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                <div className="text-sm font-semibold text-green-700 mb-2">
                  Active Users
                </div>
                <div className="text-3xl font-bold text-green-900">
                  {platformAnalytics.uniqueUsers.toLocaleString()}
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                <div className="text-sm font-semibold text-purple-700 mb-2">
                  Quiz Completions
                </div>
                <div className="text-3xl font-bold text-purple-900">
                  {platformAnalytics.quizCompletions.toLocaleString()}
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                <div className="text-sm font-semibold text-orange-700 mb-2">
                  Daily Challenges
                </div>
                <div className="text-3xl font-bold text-orange-900">
                  {platformAnalytics.dailyChallenges.toLocaleString()}
                </div>
              </Card>
            </div>

            {/* Event Type Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">📊 Event Distribution</h3>
              <div className="space-y-3">
                {Object.entries(platformAnalytics.eventTypeDistribution || {}).map(
                  ([type, count]) => (
                    <div key={type} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-700 mb-1">
                          {type.replace(/_/g, ' ')}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(
                                (count /
                                  Object.values(
                                    platformAnalytics.eventTypeDistribution
                                  ).reduce((a, b) => a + b, 0)) *
                                100
                              ).toFixed(0)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 w-16 text-right">
                        {count}
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Platform Tab */}
        {activeTab === 'platform' && !loading && platformAnalytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Quiz Completions
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {platformAnalytics.quizCompletions}
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Puzzle Completions
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {platformAnalytics.puzzleCompletions}
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Daily Challenges
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {platformAnalytics.dailyChallenges}
                </p>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Actions</h3>
              <button
                onClick={exportData}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                📥 Export Analytics
              </button>
            </Card>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && !loading && performanceMetrics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {performanceMetrics.memory && (
                <>
                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      JS Heap Used
                    </h3>
                    <p className="text-3xl font-bold text-gray-900">
                      {performanceMetrics.memory.usedJSHeapSize}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">MB</p>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Heap Limit
                    </h3>
                    <p className="text-3xl font-bold text-gray-900">
                      {performanceMetrics.memory.jsHeapSizeLimit}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">MB</p>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Memory Used
                    </h3>
                    <p className="text-3xl font-bold text-gray-900">
                      {performanceMetrics.memory.percentUsed}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">%</p>
                  </Card>
                </>
              )}
            </div>

            {/* Core Web Vitals */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Core Web Vitals</h3>
              <div className="space-y-3">
                {performanceMetrics.vitals && Object.entries(performanceMetrics.vitals).map(
                  ([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-700 font-semibold">{key.toUpperCase()}</span>
                      <span className="text-gray-900 font-bold">
                        {typeof value === 'number' ? value.toFixed(2) : value}
                      </span>
                    </div>
                  )
                )}
              </div>
            </Card>

            {/* Metrics */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">App Metrics</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">
                        Metric
                      </th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">
                        Count
                      </th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">
                        Average (ms)
                      </th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">
                        Min (ms)
                      </th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">
                        Max (ms)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(performanceMetrics.metrics || {}).map(([name, stats]) => (
                      <tr key={name} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-900 font-semibold">{name}</td>
                        <td className="px-4 py-2 text-right text-gray-700">{stats.count}</td>
                        <td className="px-4 py-2 text-right text-gray-700">
                          {stats.average.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-700">
                          {stats.min.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-700">
                          {stats.max.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && !loading && leaderboard.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">🏆 Top Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Rank</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">User ID</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-700">Total XP</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-700">Coins</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-700">Quizzes</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-700">Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((user, idx) => (
                    <tr key={user.userId} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <span className="text-lg font-bold">
                          {idx === 0 && '🥇'}
                          {idx === 1 && '🥈'}
                          {idx === 2 && '🥉'}
                          {idx > 2 && `#${idx + 1}`}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-900 font-semibold">
                        {user.userId.slice(0, 12)}...
                      </td>
                      <td className="px-4 py-2 text-right text-gray-700">
                        {user.totalXp.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-700">
                        {user.totalCoins.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-700">
                        {user.quizzesSolved}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-700">
                        {user.averageScore}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

export default AnalyticsDashboard;
