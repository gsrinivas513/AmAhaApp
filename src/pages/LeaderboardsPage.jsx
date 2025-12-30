import React, { useState, useEffect } from "react";
import SiteLayout from "../layouts/SiteLayout";
import LeaderboardTable from "../components/Leaderboard/LeaderboardTable";
import { getLeaderboard } from "../services/leaderboardService";
import { HeroSection } from "../design/DesignSystem";
import "../styles/LeaderboardsPage.css";

export default function LeaderboardsPage() {
  const [period, setPeriod] = useState("daily");
  const [categoryId, setCategoryId] = useState("all");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "quizzes", name: "Quizzes" },
    { id: "puzzles", name: "Puzzles" },
    { id: "challenges", name: "Challenges" },
  ];

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard(period, categoryId);
        setLeaderboardData(data || []);
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
        setError("Failed to load leaderboard data");
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [period, categoryId]);

  return (
    <SiteLayout>
      <HeroSection
        title="🏆 Leaderboards"
        subtitle="Compete with players worldwide. See who's on top and climb your way to glory!"
        backgroundGradient="linear-gradient(135deg, #fbbf24 0%, #f97316 100%)"
      />

      <div className="leaderboards-page">
        <div className="leaderboard-container" style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px"
        }}>
          <div className="filter-controls" style={{
            display: 'flex',
            gap: 24,
            marginBottom: 40,
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <div className="filter-group">
              <label style={{
                fontWeight: 600,
                display: 'block',
                marginBottom: 8,
                color: '#1f2937'
              }}>Time Period:</label>
              <div className="button-group" style={{
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap'
              }}>
                {["daily", "weekly", "monthly", "all-time"].map((p) => (
                  <button
                    key={p}
                    className={`period-button ${period === p ? "active" : ""}`}
                    onClick={() => setPeriod(p)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      background: period === p ? '#f97316' : '#f3f4f6',
                      color: period === p ? 'white' : '#6b7280',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1).replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label style={{
                fontWeight: 600,
                display: 'block',
                marginBottom: 8,
                color: '#1f2937'
              }}>Category:</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="category-select"
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer'
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

          {loading && (
            <div className="loading-spinner" style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280'
            }}>Loading leaderboard...</div>
          )}

          {error && (
            <div className="error-message" style={{
              padding: '16px',
              background: '#fee2e2',
              color: '#dc2626',
              borderRadius: 8,
              marginBottom: 20
            }}>{error}</div>
          )}

          {!loading && !error && leaderboardData.length === 0 && (
            <div className="empty-state" style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6b7280'
            }}>
              <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>No leaderboard data available yet.</p>
              <p>Start playing to appear on the leaderboards!</p>
            </div>
          )}

          {!loading && !error && leaderboardData.length > 0 && (
            <div className="leaderboard-content">
              <LeaderboardTable
                data={leaderboardData}
                period={period}
                categoryId={categoryId}
              />
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
