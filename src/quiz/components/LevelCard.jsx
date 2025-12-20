// src/quiz/components/LevelCard.jsx
import React from "react";

export default function LevelCard({
  level,
  status, // "completed" | "next" | "locked"
  disabled,
  onClick,
  badge,
}) {
  const isNext = status === "next";
  const isCompleted = status === "completed";
  const isLocked = status === "locked";

  // Color palettes for statuses (Candy-like colors)
  const palette = isLocked
    ? { from: "#d1d5db", to: "#9ca3af", accent: "#6b7280" }
    : isCompleted
    ? { from: "#bbf7d0", to: "#86efac", accent: "#047857" }
    : isNext
    ? { from: "#e9d5ff", to: "#c7b2ff", accent: "#6d28d9" }
    : { from: "#dbeafe", to: "#bfdbfe", accent: "#1e3a8a" };

  const label = isLocked ? "Locked" : isCompleted ? "Completed" : isNext ? "Start" : "Locked";

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      role={disabled ? undefined : "button"}
      aria-disabled={disabled}
      style={{
        width: 96,
        height: 96,
        borderRadius: "9999px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        transform: isNext ? "scale(1.06)" : "scale(1)",
        transition: "transform 220ms ease, box-shadow 220ms ease",
        textAlign: "center",
        position: "relative",
        zIndex: 3,
        padding: 8,
      }}
    >
      {/* pedestal / base platform */}
      <div
        style={{
          position: "absolute",
          bottom: -8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 64,
          height: 10,
          borderRadius: 9999,
          background: "rgba(15,23,42,0.08)",
          filter: "blur(4px)",
          zIndex: 1,
        }}
      />

      {/* outer ring */}
      <div
        style={{
          position: "absolute",
          inset: 6,
          borderRadius: "9999px",
          background: `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04)), linear-gradient(135deg, ${palette.from}, ${palette.to})`,
          boxShadow: isLocked
            ? "inset 0 -4px 8px rgba(0,0,0,0.04), 0 6px 14px rgba(0,0,0,0.06)"
            : `inset 0 -6px 14px rgba(0,0,0,0.08), 0 8px 26px rgba(15,23,42,0.12), ${isNext ? `0 0 18px rgba(99,102,241,0.12)` : ""}`,
          border: `2px solid rgba(255,255,255,0.45)`,
          zIndex: 2,
        }}
      />

      {/* glossy highlight */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 14,
          width: 40,
          height: 18,
          borderRadius: 9999,
          background: "rgba(255,255,255,0.85)",
          opacity: 0.95,
          transform: "rotate(-12deg)",
          zIndex: 3,
        }}
      />

      {/* Level content */}
      <div style={{ position: "relative", zIndex: 4, color: "#0f172a" }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: isLocked ? palette.accent : "#021024" }}>
          {level}
        </div>
      </div>

      {/* crown / badge for boss or completed */}
      {(isCompleted || badge) && (
        <div
          style={{
            position: "absolute",
            top: -10,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 5,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 18,
            background: "linear-gradient(180deg,#FFD54A,#FFC107)",
            borderRadius: 8,
            boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          {badge || "👑"}
        </div>
      )}

      {/* lock overlay for locked levels */}
      {isLocked && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "9999px",
            background: "linear-gradient(135deg, rgba(107,114,128,0.4), rgba(75,85,99,0.5))",
            zIndex: 7,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 42,
            fontWeight: "bold",
            color: "rgba(255,255,255,0.85)",
            textShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          🔒
        </div>
      )}

      <style>{`
        div[role="button"]:hover {
          transform: translateY(-6px) scale(1.06);
        }
      `}</style>
    </div>
  );
}