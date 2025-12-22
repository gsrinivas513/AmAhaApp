import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function QuizHeader({ category, difficulty, level, featureType, categoryName, topicName, onNavigate }) {
  const navigate = useNavigate();
  const [subtopics, setSubtopics] = useState([]);
  const [showAllSubtopics, setShowAllSubtopics] = useState(false);

  // Load all subtopics for the current topic
  useEffect(() => {
    async function loadSubtopics() {
      try {
        const topicQuery = query(
          collection(db, "topics"),
          where("name", "==", topicName)
        );
        const topicSnap = await getDocs(topicQuery);
        
        if (!topicSnap.empty) {
          const topicId = topicSnap.docs[0].id;
          const subtopicsQuery = query(
            collection(db, "subtopics"),
            where("topicId", "==", topicId)
          );
          const subtopicsSnap = await getDocs(subtopicsQuery);
          const subtopicsData = subtopicsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setSubtopics(subtopicsData);
        }
      } catch (error) {
        console.error("Error loading subtopics:", error);
      }
    }

    if (topicName) {
      loadSubtopics();
    }
  }, [topicName]);

  // Color mapping for difficulty levels
  const difficultyColors = {
    easy: { bg: "#bbf7d0", text: "#047857", border: "#6ee7b7" },
    medium: { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
    hard: { bg: "#fecaca", text: "#991b1b", border: "#fca5a5" },
    expert: { bg: "#e9d5ff", text: "#6b21a8", border: "#c7b2ff" },
  };

  const difficultyStyle = difficultyColors[difficulty?.toLowerCase()] || difficultyColors.medium;

  return (
    <div style={{ marginBottom: 24, flexShrink: 0 }}>
      {/* Back Button */}
      {onNavigate && (
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => onNavigate('subtopic')}
            style={{
              color: "#2563eb",
              fontWeight: 600,
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#1d4ed8";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#2563eb";
            }}
          >
            ← Back to {categoryName} Learning
          </button>
        </div>
      )}

      {/* Category Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 36 }}>📚</span>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#111827", margin: 0 }}>
            {category}
          </h2>
        </div>
        <p style={{ color: "#6b7280", fontSize: 15, marginLeft: 48, marginBottom: 16 }}>
          Learn about different subtopics in {topicName}
        </p>
      </div>

      {/* Subtopics Navigation Bar */}
      {subtopics.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#374151", marginBottom: 12 }}>
            Choose Subtopic:
          </h3>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {(showAllSubtopics ? subtopics : subtopics.slice(0, 4)).map((subtopic) => {
              const isActive = subtopic.name === category;
              return (
                <button
                  key={subtopic.id}
                  onClick={() => navigate(`/${featureType}/${categoryName}/${topicName}/${subtopic.name}/${difficulty}`)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 999,
                    border: isActive ? "2px solid #3b82f6" : "2px solid transparent",
                    fontWeight: 700,
                    fontSize: 14,
                    background: isActive ? "#3b82f6" : "#f3f4f6",
                    color: isActive ? "#ffffff" : "#374151",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textTransform: "capitalize",
                    letterSpacing: "0.3px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.background = "#e5e7eb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.background = "#f3f4f6";
                    }
                  }}
                >
                  {subtopic.icon && <span style={{ marginRight: 6 }}>{subtopic.icon}</span>}
                  {subtopic.label || subtopic.name}
                </button>
              );
            })}
            {subtopics.length > 4 && (
              <button
                onClick={() => setShowAllSubtopics(!showAllSubtopics)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  border: "none",
                  fontWeight: 600,
                  fontSize: 14,
                  background: "transparent",
                  color: "#2563eb",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#1d4ed8";
                  e.target.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#2563eb";
                  e.target.style.textDecoration = "none";
                }}
              >
                {showAllSubtopics ? "Show Less" : `Show More (${subtopics.length - 4})`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Difficulty Selection */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: "#374151", marginBottom: 12 }}>
          Choose Difficulty:
        </h3>
        <div style={{ display: "flex", gap: 10 }}>
          {["easy", "medium", "hard"].map((diff) => {
            const isActive = diff === difficulty;
            const diffColors = {
              easy: "#10b981",
              medium: "#f59e0b",
              hard: "#ef4444",
            };
            const diffEmojis = {
              easy: "🟢",
              medium: "🟡",
              hard: "🔴",
            };
            return (
              <button
                key={diff}
                onClick={() => navigate(`/${featureType}/${categoryName}/${topicName}/${category}/${diff}/${level}`)}
                style={{
                  padding: "12px 24px",
                  borderRadius: 999,
                  border: isActive ? `2px solid ${diffColors[diff]}` : "2px solid transparent",
                  fontWeight: 700,
                  fontSize: 14,
                  background: isActive ? diffColors[diff] : "#f3f4f6",
                  color: isActive ? "#ffffff" : "#374151",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.background = "#e5e7eb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.background = "#f3f4f6";
                  }
                }}
              >
                {diffEmojis[diff]} {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quiz Info Bar - No background, just badges */}
      <div
        style={{
          padding: "12px 0",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 18 }}>⭐</span>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
          Level {level}
        </div>
        <div
          style={{
            background: difficultyStyle.bg,
            color: difficultyStyle.text,
            padding: "3px 10px",
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 11,
            border: `1px solid ${difficultyStyle.border}`,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {difficulty}
        </div>
      </div>
    </div>
  );
}