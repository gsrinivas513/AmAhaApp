import React from "react";

export default function LevelCompleteSummary({
  level,
  xpEarned = 0,
  coinsEarned = 0,
  onBack,
  onNext,
  showNext,
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
        textAlign: "center",
        maxWidth: 420,
        margin: "40px auto",
      }}
    >
      <h2 style={{ marginBottom: 12 }}>🎉 Level {level} Complete!</h2>

      <div style={{ fontSize: 16, marginBottom: 18, color: "#555" }}>
        Great job! Here’s what you earned:
      </div>

      <div style={{ display: "grid", gap: 12, marginBottom: 22 }}>
        <div>⭐ <b>{xpEarned}</b> XP</div>
        <div>💰 <b>{coinsEarned}</b> Coins</div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button
          onClick={onBack}
          style={{
            padding: "10px 16px",
            background: "#f5f6fb",
            border: "1px solid #ddd",
            borderRadius: 10,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Back to Levels
        </button>

        {showNext && (
          <button
            onClick={onNext}
            style={{
              padding: "10px 16px",
              background: "#6C63FF",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Next Level →
          </button>
        )}
      </div>
    </div>
  );
}