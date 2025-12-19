// src/home/components/HomeHero.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomeHero() {
  const navigate = useNavigate();

  return (
    <section style={styles.wrapper}>
      <div style={styles.container}>
        {/* LEFT CONTENT */}
        <div style={styles.left}>
          <h1 style={styles.title}>
            Learn. Play. Win. 🏆
          </h1>

          <p style={styles.subtitle}>
            Fun quizzes for kids, students, and curious minds.
            Learn something new every day — one question at a time.
          </p>

          <div style={styles.actions}>
            <button
              style={styles.primaryBtn}
              onClick={() => navigate("/quiz")}
            >
              ▶ Start Quiz
            </button>

            <button
              style={styles.secondaryBtn}
              onClick={() => navigate("/leaderboard/kids")}
            >
              🏅 View Leaderboard
            </button>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div style={styles.right}>
          <div style={styles.artCard}>
            🎨 Knowledge is power
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- STYLES (Quiz.com inspired) ---------- */

const styles = {
  wrapper: {
    padding: "80px 20px",
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 40,
    alignItems: "center",
  },
  left: {},
  title: {
    fontSize: 42,
    fontWeight: 800,
    lineHeight: 1.2,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 17,
    maxWidth: 480,
    marginBottom: 28,
  },
  actions: {
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
  },
  primaryBtn: {
    padding: "14px 26px",
    background: "#6C63FF",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "14px 26px",
    background: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
  right: {
    display: "flex",
    justifyContent: "center",
  },
  artCard: {
    width: 260,
    height: 260,
    borderRadius: 24,
    background:
      "linear-gradient(135deg, #6C63FF, #8B85FF)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 700,
    boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
  },
};