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
    <section className="section" style={{ marginTop: 40 , marginBottom: 50}}>
      <div className="container">
        <h2 style={{ textAlign: "center", marginBottom: 12 }}>
          Why You’ll Love This
        </h2>

        <p
          style={{
            textAlign: "center",
            maxWidth: 520,
            margin: "0 auto 32px",
            color: "#6b7280",
            fontSize: 15,
          }}
        >
          Built to make learning enjoyable, effective, and rewarding.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: "#ffffff",
                border: "1px solid #eef0f4",
                borderRadius: 16,
                padding: 22,
                textAlign: "center",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* ICON (muted, non-action) */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  margin: "0 auto 12px",
                  borderRadius: "50%",
                  background: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                {f.icon}
              </div>

              <h3
                style={{
                  marginBottom: 6,
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {f.title}
              </h3>

              <p
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}