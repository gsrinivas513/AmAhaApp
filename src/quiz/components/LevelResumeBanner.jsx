import React from "react";

export default function LevelResumeBanner({ level, onResume, onDiscard }) {
  return (
    <div
      style={{
        background: "#fff3cd",
        border: "1px solid #ffeeba",
        padding: 14,
        borderRadius: 12,
        marginBottom: 16,
        color: "#856404",
        boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>
        ⏸️ Quiz Paused
      </div>

      <div style={{ fontSize: 14, marginBottom: 10 }}>
        You paused at <b>Level {level}</b>.
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onResume}
          style={{
            padding: "8px 14px",
            background: "#6C63FF",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Resume Level
        </button>

        <button
          onClick={onDiscard}
          style={{
            padding: "8px 14px",
            background: "#f5f6fb",
            border: "1px solid #ddd",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Start Over
        </button>
      </div>
    </div>
  );
}