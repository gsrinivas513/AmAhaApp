import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    key: "kids",
    title: "Kids",
    desc: "Fun & simple quizzes for young minds",
    icon: "🧸",
  },
  {
    key: "students",
    title: "Students",
    desc: "School-level learning quizzes",
    icon: "🎓",
  },
  {
    key: "programming",
    title: "Programming",
    desc: "Test your coding knowledge",
    icon: "💻",
  },
  {
    key: "movies",
    title: "Movies",
    desc: "Cinema, actors & trivia",
    icon: "🎬",
  },
];

export default function QuizCategoryGrid() {
  const navigate = useNavigate();

  return (
    <section className="section">
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 24,
          }}
        >
          {categories.map((c) => (
            <div
              key={c.key}
              className="card"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/quiz/${c.key}`)}
            >
              <div style={{ fontSize: 34 }}>{c.icon}</div>
              <h3 style={{ marginTop: 12 }}>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}