// src/home/components/FeatureGrid.jsx
import React from "react";

const features = [
  {
    title: "Smart Quizzes",
    desc: "Carefully designed questions that grow with your level.",
    icon: "🧠",
  },
  {
    title: "Multiple Categories",
    desc: "Kids, Students, Programming, Movies and more.",
    icon: "📚",
  },
  {
    title: "Levels & Rewards",
    desc: "Progress through levels and earn XP & coins.",
    icon: "🏆",
  },
  {
    title: "Play Anywhere",
    desc: "Mobile-friendly experience, anytime learning.",
    icon: "📱",
  },
];

export default function FeatureGrid() {
  return (
    <section className="section">
      <div className="container">
        <h2 style={{ textAlign: "center" }}>
          Why You’ll Love This
        </h2>

        <div
          style={{
            marginTop: 36,
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 22,
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="card"
              style={{
                textAlign: "center",
                cursor: "default",
                transition:
                  "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 18px 40px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 12px 30px rgba(0,0,0,0.06)";
              }}
            >
              {/* Icon bubble */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  margin: "0 auto 14px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #6C63FF, #8B85FF)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  color: "#fff",
                }}
              >
                {f.icon}
              </div>

              <h3 style={{ marginBottom: 8 }}>
                {f.title}
              </h3>

              <p style={{ fontSize: 14 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}