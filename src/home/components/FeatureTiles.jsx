// src/home/components/FeatureTiles.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const tiles = [
  {
    title: "Kids Quizzes",
    desc: "Fun and engaging quizzes for kids.",
    emoji: "🧸",
    path: "/quiz/kids",
    bg: "linear-gradient(135deg, #FDE7F3 0%, #FBCFE8 100%)",
  },
  {
    title: "Student Quizzes",
    desc: "Boost learning with smart questions.",
    emoji: "🎓",
    path: "/quiz/students",
    bg: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
  },
  {
    title: "Programming",
    desc: "Sharpen your coding skills.",
    emoji: "💻",
    path: "/quiz/programming",
    bg: "linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)",
  },
  {
    title: "Movies & Fun",
    desc: "Test your movie knowledge.",
    emoji: "🎬",
    path: "/quiz/movies",
    bg: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
  },
];

export default function FeatureTiles() {
  const navigate = useNavigate();

  return (
    <section style={{ marginTop: 48 }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 24,
          }}
        >
          {tiles.map((t) => (
            <div
              key={t.title}
              onClick={() => navigate(t.path)}
              style={{
                background: t.bg,
                borderRadius: 24,
                padding: 28,
                cursor: "pointer",
                boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
                transition:
                  "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 18px 42px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 26px rgba(0,0,0,0.06)";
              }}
            >
              <div style={{ fontSize: 34, marginBottom: 14 }}>
                {t.emoji}
              </div>

              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {t.title}
              </h3>

              <p
                style={{
                  fontSize: 14,
                  color: "#4b5563",
                }}
              >
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}