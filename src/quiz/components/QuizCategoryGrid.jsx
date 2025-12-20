import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    key: "kids",
    title: "Kids",
    desc: "Fun & simple quizzes for young minds",
    color: ["#FFEDD5", "#FED7AA"],
    icon: "🧸",
  },
  {
    key: "students",
    title: "Students",
    desc: "School-level learning quizzes",
    color: ["#E0F2FE", "#BAE6FD"],
    icon: "🎓",
  },
  {
    key: "programming",
    title: "Programming",
    desc: "Test your coding knowledge",
    color: ["#ECFDF5", "#BBF7D0"],
    icon: "💻",
  },
  {
    key: "movies",
    title: "Movies",
    desc: "Cinema, actors & trivia",
    color: ["#FCE7F3", "#FBCFE8"],
    icon: "🎬",
  },
  {
    key: "science",
    title: "Science",
    desc: "Biology, physics & curious facts",
    color: ["#EEF2FF", "#E9D5FF"],
    icon: "🔬",
  },
  {
    key: "history",
    title: "History",
    desc: "Events, dates & famous people",
    color: ["#FEF3C7", "#FDE68A"],
    icon: "🏺",
  },
  {
    key: "geography",
    title: "Geography",
    desc: "Places, maps & landmarks",
    color: ["#E0F7FA", "#B2EBF2"],
    icon: "🗺️",
  },
  {
    key: "sports",
    title: "Sports",
    desc: "Rules, players & records",
    color: ["#FFF7ED", "#FFEDD5"],
    icon: "🏅",
  },
  {
    key: "languages",
    title: "Languages",
    desc: "Words, grammar & expressions",
    color: ["#F0FFF4", "#DCFCE7"],
    icon: "🗣️",
  },
  {
    key: "art",
    title: "Art",
    desc: "Design, painting & culture",
    color: ["#FFF1F2", "#FFE4E6"],
    icon: "🎨",
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
            gap: 20,
          }}
        >
          {categories.map((c) => (
            <div
              key={c.key}
              onClick={() => navigate(`/quiz/${c.key}`)}
              style={{
                cursor: "pointer",
                padding: 18,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${c.color[0]} 0%, ${c.color[1]} 100%)`,
                boxShadow: "0 14px 42px rgba(2,6,23,0.10)",
                border: "1px solid rgba(255,255,255,0.6)",
                minHeight: 140,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                transition: "transform 220ms ease, box-shadow 220ms ease",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 18px 48px rgba(2,6,23,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(2,6,23,0.08)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 30,
                    background: "rgba(255,255,255,0.72)",
                    boxShadow: "0 10px 30px rgba(2,6,23,0.12)",
                    border: "1px solid rgba(255,255,255,0.6)",
                    flexShrink: 0,
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  {c.icon}
                </div>

                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: "#0b1220" }}>{c.title}</h3>
                  <p style={{ margin: 0, marginTop: 6, color: "#334155" }}>{c.desc}</p>
                </div>
              </div>

              <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end" }}>
                <span style={{ fontSize: 12, color: "#0b1220", fontWeight: 700 }}>Start →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}