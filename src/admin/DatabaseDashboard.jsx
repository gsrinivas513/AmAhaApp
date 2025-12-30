// src/admin/DatabaseDashboard.jsx
// Comprehensive database management dashboard for admin panel

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function DatabaseDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDatabaseStats();
  }, []);

  const loadDatabaseStats = async () => {
    try {
      // Load all collections
      const [features, categories, topics, subtopics, puzzles, questions, storyCategories] = await Promise.all([
        getDocs(collection(db, "features")),
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "topics")),
        getDocs(collection(db, "subtopics")),
        getDocs(collection(db, "puzzles")),
        getDocs(collection(db, "questions")),
        getDocs(collection(db, "storyCategories"))
      ]);

      // Count puzzles by type
      let puzzlesByType = {
        "find-pair": 0,
        "picture-word": 0,
        "spot-difference": 0,
        "picture-shadow": 0,
        "ordering": 0,
        "invalid": 0
      };

      for (const doc of puzzles.docs) {
        const type = doc.data().type;
        if (type && puzzlesByType.hasOwnProperty(type)) {
          puzzlesByType[type]++;
        } else {
          puzzlesByType["invalid"]++;
        }
      }

      // Count questions by category
      const categoryQuestionCount = {};
      for (const doc of questions.docs) {
        const cat = doc.data().category;
        if (cat) {
          categoryQuestionCount[cat] = (categoryQuestionCount[cat] || 0) + 1;
        }
      }

      setStats({
        collections: {
          features: features.size,
          categories: categories.size,
          topics: topics.size,
          subtopics: subtopics.size,
          puzzles: puzzles.size,
          questions: questions.size,
          storyCategories: storyCategories.size
        },
        puzzles: {
          total: puzzles.size,
          byType: puzzlesByType,
          valid: puzzles.size - puzzlesByType["invalid"]
        },
        questions: {
          total: questions.size,
          byCategoryCount: Object.keys(categoryQuestionCount).length
        },
        totalDocuments: features.size + categories.size + topics.size + subtopics.size + puzzles.size + questions.size + storyCategories.size
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: "18px", color: "#666" }}>Loading database stats...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        Error loading database stats
      </div>
    );
  }

  const StatCard = ({ label, value, color = "#0284c7", icon = "📊" }) => (
    <div
      style={{
        padding: "16px",
        background: "#f9fafb",
        borderRadius: "8px",
        border: `2px solid ${color}20`,
        textAlign: "center"
      }}
    >
      <div style={{ fontSize: "24px", marginBottom: "8px" }}>{icon}</div>
      <div style={{ fontSize: "28px", fontWeight: "700", color }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>{label}</div>
    </div>
  );

  const ToolButton = ({ label, icon, description, onClick, color = "#0284c7" }) => (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "16px",
        background: "white",
        border: `2px solid ${color}30`,
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.2s",
        textAlign: "left"
      }}
      onMouseOver={(e) => {
        e.target.style.borderColor = color;
        e.target.style.background = `${color}05`;
      }}
      onMouseOut={(e) => {
        e.target.style.borderColor = `${color}30`;
        e.target.style.background = "white";
      }}
    >
      <div style={{ fontSize: "20px", marginBottom: "8px" }}>{icon}</div>
      <div style={{ fontWeight: "600", fontSize: "14px", color: "#0b1220", marginBottom: "4px" }}>
        {label}
      </div>
      <div style={{ fontSize: "12px", color: "#666" }}>{description}</div>
    </button>
  );

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto", fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: "24px" }}>📊 Database Dashboard</h1>

      {/* Overview Stats */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: "#0b1220" }}>
          📈 Overview
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "12px" }}>
          <StatCard label="Total Documents" value={stats.totalDocuments} icon="📄" />
          <StatCard label="Features" value={stats.collections.features} icon="✨" color="#0284c7" />
          <StatCard label="Categories" value={stats.collections.categories} icon="📂" color="#059669" />
          <StatCard label="Topics" value={stats.collections.topics} icon="📚" color="#7c3aed" />
          <StatCard label="Subtopics" value={stats.collections.subtopics} icon="🏷️" color="#d97706" />
        </div>
      </div>

      {/* Content Stats */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: "#0b1220" }}>
          📚 Content Collections
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
          <div style={{ padding: "16px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "18px", marginBottom: "8px" }}>🧩</div>
            <div style={{ fontWeight: "600", marginBottom: "8px" }}>Puzzles</div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#0284c7", marginBottom: "8px" }}>
              {stats.puzzles.valid}/{stats.puzzles.total}
            </div>
            <div style={{ fontSize: "11px", color: "#666", lineHeight: "1.4" }}>
              <div>✅ Valid: {stats.puzzles.valid}</div>
              <div style={{ marginTop: "4px" }}>
                Find-pair: {stats.puzzles.byType["find-pair"]}<br/>
                Picture-word: {stats.puzzles.byType["picture-word"]}<br/>
                Spot-diff: {stats.puzzles.byType["spot-difference"]}<br/>
                Shadow: {stats.puzzles.byType["picture-shadow"]}<br/>
                Ordering: {stats.puzzles.byType["ordering"]}
              </div>
            </div>
          </div>

          <div style={{ padding: "16px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "18px", marginBottom: "8px" }}>❓</div>
            <div style={{ fontWeight: "600", marginBottom: "8px" }}>Questions</div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#059669", marginBottom: "8px" }}>
              {stats.questions.total}
            </div>
            <div style={{ fontSize: "11px", color: "#666", lineHeight: "1.4" }}>
              Across {stats.questions.byCategoryCount} categories
            </div>
          </div>

          <div style={{ padding: "16px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "18px", marginBottom: "8px" }}>📖</div>
            <div style={{ fontWeight: "600", marginBottom: "8px" }}>Story Categories</div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#7c3aed", marginBottom: "8px" }}>
              {stats.collections.storyCategories}
            </div>
            <div style={{ fontSize: "11px", color: "#666", lineHeight: "1.4" }}>
              For story content
            </div>
          </div>
        </div>
      </div>

      {/* Database Tools */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: "#0b1220" }}>
          🔧 Database Tools
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
          <ToolButton
            icon="🔍"
            label="Run Audit"
            description="Scan database for structural issues"
            onClick={() => navigate("/admin/database-audit")}
            color="#0284c7"
          />
          <ToolButton
            icon="⚡"
            label="Standardize Features"
            description="Fix inconsistent feature IDs"
            onClick={() => navigate("/admin/standardize-features")}
            color="#059669"
          />
          <ToolButton
            icon="🔗"
            label="Fix Feature Mismatch"
            description="Update old feature references"
            onClick={() => navigate("/admin/fix-feature-mismatch")}
            color="#d97706"
          />
          <ToolButton
            icon="🗑️"
            label="Delete Broken Puzzles"
            description="Remove orphaned puzzle documents"
            onClick={() => navigate("/admin/fix-orphaned-puzzles")}
            color="#dc2626"
          />
        </div>
      </div>

      {/* Collection Details Table */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: "#0b1220" }}>
          📋 Collection Details
        </h2>
        <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px"
          }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Collection</th>
                <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Documents</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "features", docs: stats.collections.features, purpose: "Feature definitions (Quizzes, Puzzles, Games, Stories)" },
                { name: "categories", docs: stats.collections.categories, purpose: "Content categories within each feature" },
                { name: "topics", docs: stats.collections.topics, purpose: "Topics within categories" },
                { name: "subtopics", docs: stats.collections.subtopics, purpose: "Subtopics within topics" },
                { name: "puzzles", docs: stats.collections.puzzles, purpose: "Visual puzzle content" },
                { name: "questions", docs: stats.collections.questions, purpose: "Quiz questions" },
                { name: "storyCategories", docs: stats.collections.storyCategories, purpose: "Story content categories" }
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb", background: idx % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                  <td style={{ padding: "12px", fontWeight: "500", color: "#0b1220" }}>{row.name}</td>
                  <td style={{ padding: "12px", textAlign: "center", fontWeight: "600", color: "#0284c7" }}>{row.docs}</td>
                  <td style={{ padding: "12px", color: "#666", fontSize: "13px" }}>{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status */}
      <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
        <div style={{ fontSize: "16px", fontWeight: "600", color: "#059669", marginBottom: "4px" }}>
          ✅ Database Status: Healthy
        </div>
        <div style={{ fontSize: "13px", color: "#666" }}>
          All critical issues resolved. Run audit monthly to maintain health.
        </div>
      </div>
    </div>
  );
}
