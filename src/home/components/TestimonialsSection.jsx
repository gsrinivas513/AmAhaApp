import React from "react";

const testimonials = [
  {
    name: "Aarav",
    role: "Student",
    text: "I actually enjoy learning now. The quizzes feel like a game!",
    avatar: "🧑‍🎓",
  },
  {
    name: "Meera",
    role: "Parent",
    text: "My kid asks to play quizzes every day. Best learning app so far.",
    avatar: "👩‍👧",
  },
  {
    name: "Rahul",
    role: "Developer",
    text: "Programming quizzes are fun and surprisingly challenging.",
    avatar: "💻",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section">
      <div className="container">
        <h2 style={{ textAlign: "center" }}>
          Loved by Learners ❤️
        </h2>

        <p
          style={{
            textAlign: "center",
            maxWidth: 520,
            margin: "10px auto 32px",
          }}
        >
          Join thousands of learners who use our platform every day.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {testimonials.map((t) => (
            <div key={t.name} className="card">
              <div style={{ fontSize: 32 }}>{t.avatar}</div>

              <p style={{ marginTop: 12, fontStyle: "italic" }}>
                “{t.text}”
              </p>

              <div style={{ marginTop: 16, fontWeight: 700 }}>
                {t.name}
              </div>

              <div style={{ fontSize: 13, color: "#6b7280" }}>
                {t.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}