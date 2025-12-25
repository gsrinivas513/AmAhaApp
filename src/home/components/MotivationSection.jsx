// src/home/components/MotivationSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function MotivationSection() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        padding: "72px 20px",
        marginTop: 48,
        marginBottom: 0,
        background: "linear-gradient(135deg, #6C63FF 0%, #8B85FF 50%, #5B5FEF 100%)",
        color: "#fff",
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background elements */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "-80px",
          width: "300px",
          height: "300px",
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: "50%",
        }}
      />

      <div
        style={{
          maxWidth: 900,
          margin: "auto",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h2 style={{ fontSize: "2.4rem", fontWeight: 900, marginBottom: 20, lineHeight: 1.2 }}>
          🌱 Knowledge Grows Daily
        </h2>

        <p
          style={{
            marginBottom: 20,
            fontSize: "1.1rem",
            maxWidth: 580,
            marginLeft: "auto",
            marginRight: "auto",
            color: "#eef2ff",
            lineHeight: 1.7,
            fontWeight: 500,
          }}
        >
          Just 5 minutes a day can transform your skills, boost confidence, and unlock your potential.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16,
            maxWidth: 500,
            margin: "32px auto",
            textAlign: "center",
          }}
        >
          <div style={{ background: "rgba(255, 255, 255, 0.15)", padding: "16px", borderRadius: "12px" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>📈</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>+2000% Skills Boost</div>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.15)", padding: "16px", borderRadius: "12px" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>🏆</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>50K+ Learners</div>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.15)", padding: "16px", borderRadius: "12px" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>🎯</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>Proven Results</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginTop: 40,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/quiz")}
            style={{
              ...primaryBtn,
              fontSize: "1.05rem",
              padding: "16px 32px",
            }}
          >
            🚀 Start Learning Today
          </button>

          <button
            onClick={() => navigate("/leaderboards")}
            style={{
              ...secondaryBtn,
              fontSize: "1.05rem",
              padding: "16px 32px",
            }}
          >
            🏆 See Leaderboard
          </button>
        </div>

        <p
          style={{
            marginTop: 32,
            fontSize: "0.95rem",
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          ✨ Free • No signup required • AI-powered learning
        </p>
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