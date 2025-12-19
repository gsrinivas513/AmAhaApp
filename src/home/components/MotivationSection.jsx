// src/home/components/MotivationSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function MotivationSection() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        padding: "80px 20px",
        background: "linear-gradient(135deg, #6C63FF, #8B85FF)",
        color: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "auto",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: 32, fontWeight: 800 }}>
          Knowledge Grows Daily 🌱
        </h2>

        <p
          style={{
            marginTop: 14,
            fontSize: 16,
            maxWidth: 560,
            marginLeft: "auto",
            marginRight: "auto",
            color: "#eef2ff",
          }}
        >
          Just 5 minutes a day can improve memory, confidence, and skills.
          Play quizzes, unlock levels, and become smarter every day.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginTop: 32,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/quiz")}
            style={primaryBtn}
          >
            Start Today 🚀
          </button>

          <button
            onClick={() => navigate("/leaderboard/kids")}
            style={secondaryBtn}
          >
            View Leaderboard 🏆
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- styles ---------------- */

const primaryBtn = {
  padding: "14px 28px",
  background: "#ffffff",
  color: "#6C63FF",
  border: "none",
  borderRadius: 14,
  fontSize: 16,
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "14px 26px",
  background: "transparent",
  border: "2px solid rgba(255,255,255,0.6)",
  color: "#fff",
  borderRadius: 14,
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
};