// src/quiz/components/ResumeBanner.jsx
import React from "react";

export default function ResumeBanner({ resume, onResume, onDiscard }) {
  if (!resume) return null;

  return (
    <div
      style={{
        background: "#eef4ff",
        border: "1px solid #c7d2fe",
        padding: 14,
        borderRadius: 10,
        marginBottom: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ fontWeight: 600 }}>
        ▶ Resume {resume.category} / {resume.difficulty} — Level {resume.level}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={onResume}
          style={{
            padding: "6px 12px",
            background: "#6C63FF",
            color: "#fff",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
          }}
        >
          Resume
        </button>

        <button
          onClick={onDiscard}
          style={{
            padding: "6px 12px",
            background: "#f5f6fb",
            borderRadius: 6,
            border: "1px solid #ddd",
            cursor: "pointer",
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}