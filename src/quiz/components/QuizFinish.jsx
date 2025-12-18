// src/quiz/components/QuizFinish.jsx
import React from "react";

export default function QuizFinish({
  correctCount,
  totalQuestions,
  xpEarned,
  coinsEarned,
  onBack,
}) {
  return (
    <div
      style={{
        maxWidth: 420,
        margin: "40px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: 12 }}>Level Complete 🎉</h2>

      <p style={{ color: "#555", marginBottom: 20 }}>
        Great job! Here’s how you did:
      </p>

      <div style={{ textAlign: "left", marginBottom: 20 }}>
        <div style={{ marginBottom: 8 }}>
          ✅ <b>Correct Answers:</b> {correctCount} / {totalQuestions}
        </div>
        <div style={{ marginBottom: 8 }}>
          ⭐ <b>XP Earned:</b> {xpEarned}
        </div>
        <div>
          🪙 <b>Coins Earned:</b> {coinsEarned}
        </div>
      </div>

      <button
        onClick={onBack}
        style={{
          padding: "12px 18px",
          background: "#6C63FF",
          color: "#fff",
          borderRadius: 10,
          border: "none",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Back to Levels
      </button>
    </div>
  );
}