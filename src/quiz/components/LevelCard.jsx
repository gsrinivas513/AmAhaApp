// src/quiz/components/LevelCard.jsx
import React from "react";

export default function LevelCard({
  level,
  status, // "completed" | "next" | "locked"
  disabled,
  onClick,
}) {
  const isNext = status === "next";
  const isCompleted = status === "completed";
  const isLocked = status === "locked";

  let background = "#ffffff";
  let border = "2px solid #e5e7eb";
  let label = "Locked";
  let scale = 1;
  let glow = "none";

  if (isCompleted) {
    background = "linear-gradient(135deg, #ecfdf5, #d1fae5)";
    border = "2px solid #10b981";
    label = "Completed";
  }

  if (isNext) {
    background = "linear-gradient(135deg, #eef2ff, #e0e7ff)";
    border = "2px solid #6366f1";
    label = "Start";
    scale = 1.15;
    glow = "0 0 0 6px rgba(99,102,241,0.15)";
  }

  if (isLocked) {
    background = "#f9fafb";
    border = "2px dashed #d1d5db";
    label = "Locked";
  }

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      style={{
        width: 120,
        height: 120,
        borderRadius: "50%",
        background,
        border,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        transform: `scale(${scale})`,
        boxShadow: glow,
        transition: "all 0.25s ease",
        textAlign: "center",
      }}
    >
      {/* LEVEL NUMBER */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: isLocked ? "#9ca3af" : "#111827",
        }}
      >
        {level}
      </div>

      {/* STATUS */}
      <div
        style={{
          marginTop: 6,
          fontSize: 13,
          fontWeight: 600,
          color: isNext
            ? "#4338ca"
            : isCompleted
            ? "#047857"
            : "#9ca3af",
        }}
      >
        {isLocked ? "🔒 Locked" : label}
      </div>
    </div>
  );
}