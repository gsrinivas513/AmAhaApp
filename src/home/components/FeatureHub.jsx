import React from "react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    key: "quizzes",
    title: "Quizzes",
    desc: "Test your knowledge with fun & smart quizzes",
    icon: "🧠",
    path: "/quizzes",
  },
  {
    key: "puzzles",
    title: "Puzzles",
    desc: "Sharpen your brain with logic & word puzzles",
    icon: "🧩",
    path: "/puzzles",
  },
  {
    key: "studies",
    title: "Studies",
    desc: "Learn subjects step by step",
    icon: "📘",
    path: "/studies",
  },
  {
    key: "art",
    title: "Art & Literature",
    desc: "Explore creativity, poems & stories",
    icon: "🎨",
    path: "/art",
  },
];

export default function FeatureHub() {
  const navigate = useNavigate();

  return (
    <section className="section">
      <div className="container">
        <h2 style={{ textAlign: "center" }}>
          What would you like to explore?
        </h2>

        <div
          style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 24,
          }}
        >
          {features.map((f) => (
            <div
              key={f.key}
              className="card"
              style={{ cursor: "pointer", textAlign: "center" }}
              onClick={() => navigate(f.path)}
            >
              <div style={{ fontSize: 36 }}>{f.icon}</div>
              <h3 style={{ marginTop: 12 }}>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}