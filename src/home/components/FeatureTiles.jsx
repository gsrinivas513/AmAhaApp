import React from "react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    key: "quiz",
    title: "Quizzes",
    desc: "Test your knowledge with fun levels",
    emoji: "🧠",
    path: "/quiz",
    gradient: "linear-gradient(135deg, #6C63FF, #8B85FF)",
  },
  {
    key: "puzzle",
    title: "Puzzles",
    desc: "Sharpen logic & problem solving",
    emoji: "🧩",
    path: "/puzzles",
    gradient: "linear-gradient(135deg, #00BFA6, #5CE1C6)",
  },
  {
    key: "study",
    title: "Studies",
    desc: "Learn concepts step by step",
    emoji: "📘",
    path: "/studies",
    gradient: "linear-gradient(135deg, #FF9800, #FFC107)",
  },
  {
    key: "art",
    title: "Art & Literature",
    desc: "Explore creativity & classics",
    emoji: "🎨",
    path: "/art",
    gradient: "linear-gradient(135deg, #EC407A, #F48FB1)",
  },
];

export default function FeatureTiles() {
  const navigate = useNavigate();

  return (
    <section className="section">
      <div className="container">
        <h2 style={{ textAlign: "center" }}>
          Choose What You Want to Explore
        </h2>

        <div
          style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
          }}
        >
          {features.map((f) => (
            <div
              key={f.key}
              onClick={() => navigate(f.path)}
              style={{
                padding: 28,
                borderRadius: 20,
                color: "#fff",
                background: f.gradient,
                cursor: "pointer",
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform =
                  "translateY(-8px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <div style={{ fontSize: 36 }}>{f.emoji}</div>

              <h3 style={{ marginTop: 16, color: "#fff" }}>
                {f.title}
              </h3>

              <p style={{ color: "rgba(255,255,255,0.9)" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}