// src/home/components/CategoryStrip.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: "quiz",
    title: "Quizzes",
    desc: "Test knowledge with fun, smart questions",
    emoji: "🎯",
    color: "#6C63FF",
    path: "/quiz",
  },
  {
    id: "puzzles",
    title: "Puzzles",
    desc: "Train logic & problem-solving skills",
    emoji: "🧩",
    color: "#10b981",
    comingSoon: true,
  },
  {
    id: "studies",
    title: "Studies",
    desc: "Structured learning paths & practice",
    emoji: "📘",
    color: "#f59e0b",
    comingSoon: true,
  },
  {
    id: "art",
    title: "Art & Literature",
    desc: "Creative thinking & classics",
    emoji: "🎨",
    color: "#ec4899",
    comingSoon: true,
  },
];

export default function CategoryStrip() {
  const navigate = useNavigate();

  return (
    <section className="section">
      <div className="container">
        <h2 style={{ textAlign: "center" }}>
          Explore Knowledge Worlds
        </h2>

        <div
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {categories.map((c) => (
            <div
              key={c.id}
              className="card"
              style={{
                cursor: c.comingSoon ? "default" : "pointer",
                opacity: c.comingSoon ? 0.7 : 1,
                transition:
                  "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              onClick={() => {
                if (!c.comingSoon && c.path) {
                  navigate(c.path);
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0)";
              }}
            >
              {/* Icon */}
              <div
                style={{
                  fontSize: 36,
                  marginBottom: 10,
                }}
              >
                {c.emoji}
              </div>

              <h3>{c.title}</h3>

              <p style={{ fontSize: 14 }}>
                {c.desc}
              </p>

              {c.comingSoon && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    color: c.color,
                  }}
                >
                  Coming Soon
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}