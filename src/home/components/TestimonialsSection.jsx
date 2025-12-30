import React from "react";

const testimonials = [
  {
    name: "Aarav",
    role: "10-year-old Student",
    text: "I actually enjoy learning now. The quizzes feel like a game!",
    avatar: "🧑‍🎓",
    rating: 5,
  },
  {
    name: "Meera",
    role: "Parent",
    text: "My kids ask to play quizzes every day. Best learning app for keeping them engaged.",
    avatar: "👩‍👧",
    rating: 5,
  },
  {
    name: "Rahul",
    role: "Programming Enthusiast",
    text: "Programming quizzes are fun and surprisingly challenging. Love the variety!",
    avatar: "💻",
    rating: 5,
  },
  {
    name: "Priya",
    role: "Teacher",
    text: "Perfect tool for my students. Gamification keeps them motivated and learning.",
    avatar: "👨‍🏫",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section
      style={{
        padding: "60px 20px",
        marginTop: 48,
        marginBottom: 0,
        background: "linear-gradient(180deg, #f8f9ff 0%, #f0f4ff 100%)",
        borderRadius: "16px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "2.2rem",
            fontWeight: 800,
            marginBottom: 12,
            color: "#1a1a2e",
          }}
        >
          Loved by Learners & Parents ❤️
        </h2>

        <p
          style={{
            textAlign: "center",
            maxWidth: 600,
            margin: "0 auto 40px",
            fontSize: "1.05rem",
            color: "#555",
            lineHeight: 1.6,
          }}
        >
          Join 50,000+ learners who are discovering the joy of learning through gamified education.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "28px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                transition: "all 300ms ease",
                cursor: "default",
                border: "1px solid rgba(108, 99, 255, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(108, 99, 255, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ fontSize: 40 }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1a1a2e" }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#999" }}>
                    {t.role}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                {[...Array(t.rating)].map((_, i) => (
                  <span key={i} style={{ fontSize: "1.1rem" }}>
                    ⭐
                  </span>
                ))}
              </div>

              <p
                style={{
                  fontStyle: "italic",
                  lineHeight: 1.6,
                  color: "#444",
                  margin: 0,
                }}
              >
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}