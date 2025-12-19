import React from "react";

export default function QuizFinish({
  correctCount,
  totalQuestions,
  xpEarned,
  coinsEarned,
  onBack,
  onRetry,
  onNextLevel,
}) {
  const isPassed = correctCount === totalQuestions;

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
      {/* ---------- TITLE ---------- */}
      <h2 style={{ marginBottom: 12 }}>
        {isPassed ? "Level Complete 🎉" : "Level Failed ❌ Try Again"}
      </h2>

      <p style={{ color: "#555", marginBottom: 20 }}>
        {isPassed
          ? "Excellent! You cleared this level."
          : "You must answer all questions correctly to pass this level."}
      </p>

      {/* ---------- SUMMARY ---------- */}
      <div style={{ marginTop: 16 }}>
        ✅ Correct Answers: {correctCount} / {totalQuestions}
      </div>

      <div style={{ marginTop: 8 }}>
        ⭐ XP Earned: {xpEarned}
      </div>

      <div style={{ marginTop: 8 }}>
        🪙 Coins Earned: {coinsEarned}
      </div>

      {/* ---------- ACTIONS ---------- */}
      <div style={{ marginTop: 24 }}>
        {isPassed ? (
          <button onClick={onNextLevel} style={primaryBtn}>
            Continue to Next Level →
          </button>
        ) : (
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={onRetry} style={primaryBtn}>
              Retry Level 🔁
            </button>

            <button onClick={onBack} style={secondaryBtn}>
              Back to Levels ⬅️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const primaryBtn = {
  padding: "12px 18px",
  background: "#6C63FF",
  color: "#fff",
  borderRadius: 10,
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "12px 18px",
  background: "#eee",
  color: "#333",
  borderRadius: 10,
  border: "1px solid #ccc",
  fontWeight: 600,
  cursor: "pointer",
};