import React, { useState, useEffect } from "react";
import SiteLayout from "../layouts/SiteLayout";
import LeaderboardTable from "../components/Leaderboard/LeaderboardTable";
import { getLeaderboard } from "../services/leaderboardService";
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
      <div className="leaderboards-page">
        <div className="leaderboard-container">
          <h1>🏆 Leaderboards</h1>

          <div className="filter-controls">
            <div className="filter-group">
              <label>Time Period:</label>
              <div className="button-group">
                {["daily", "weekly", "monthly", "all-time"].map((p) => (
                  <button
                    key={p}
                    className={`period-button ${period === p ? "active" : ""}`}
                    onClick={() => setPeriod(p)}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1).replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Category:</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="category-select"
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
            <div className="loading-spinner">Loading leaderboard...</div>
          )}

          {error && (
            <div className="error-message">{error}</div>
          )}

          {!loading && !error && leaderboardData.length === 0 && (
            <div className="empty-state">
              <p>No leaderboard data available yet.</p>
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
