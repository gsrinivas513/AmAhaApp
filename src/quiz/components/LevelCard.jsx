import React from "react";

export default function LevelCard({
  level,
  status, // "completed" | "next" | "locked"
  onClick,
}) {
  const styles = {
    completed: {
      bg: "#e8ffed",
      color: "#2e7d32",
      label: "Completed ✓",
    },
    next: {
      bg: "#eef4ff",
      color: "#6C63FF",
      label: "Start",
    },
    locked: {
      bg: "#f3f3f3",
      color: "#9e9e9e",
      label: "Locked",
    },
  };

  const s = styles[status];

  return (
    <div
      className="card"
      onClick={status !== "locked" ? onClick : undefined}
      style={{
        background: s.bg,
        cursor: status === "locked" ? "not-allowed" : "pointer",
        opacity: status === "locked" ? 0.6 : 1,
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (status !== "locked") {
          e.currentTarget.style.transform = "translateY(-6px)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 800 }}>
        Level {level}
      </div>

      <div
        style={{
          marginTop: 8,
          fontWeight: 600,
          color: s.color,
        }}
      >
        {s.label}
      </div>
    </div>
  );
}