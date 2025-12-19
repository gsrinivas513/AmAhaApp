import React from "react";

const stats = [
  { value: "50K+", label: "Questions Played" },
  { value: "5K+", label: "Active Learners" },
  { value: "120+", label: "Quizzes & Levels" },
  { value: "Daily", label: "New Content" },
];

export default function StatsStrip() {
  return (
    <section
      style={{
        background: "#ffffff",
        padding: "48px 20px",
        borderTop: "1px solid #eee",
        borderBottom: "1px solid #eee",
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 24,
          textAlign: "center",
        }}
      >
        {stats.map((s) => (
          <div key={s.label}>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#6C63FF",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 14,
                color: "#6b7280",
                fontWeight: 600,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}