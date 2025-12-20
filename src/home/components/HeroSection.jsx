// src/home/components/HeroSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import quizHero from "../../assets/illustrations/quiz-hero.svg";

export default function HeroSection() {
  const navigate = useNavigate();
  const isDesktop = window.matchMedia("(min-width: 900px)").matches;

  return (
    <section
      style={{
        padding: isDesktop ? "56px 20px" : "40px 16px",
        background: "linear-gradient(180deg, #fbfbff 0%, #ffffff 100%)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isDesktop ? "1.1fr 0.9fr" : "1fr",
          gap: isDesktop ? 40 : 28,
          alignItems: "center",
        }}
      >
        {/* ================= LEFT — HERO CARD ================= */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #FEF2F8 0%, #EEF2FF 50%, #F0F9FF 100%)",
            borderRadius: 28,
            padding: isDesktop ? "42px" : "28px",
            color: "#111827",
            boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
          }}
        >
          <h1
            style={{
              fontSize: isDesktop ? 38 : 30,
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 16,
              letterSpacing: "-0.5px",
            }}
          >
            Play quizzes.
            <br />
            <span style={{ color: "#4f46e5" }}>
              Learn faster.
            </span>
          </h1>

          <p
            style={{
              fontSize: 15,
              color: "#4b5563",
              maxWidth: 420,
              marginBottom: 28,
              lineHeight: 1.6,
            }}
          >
            Fun quizzes for kids, students, and curious minds.
            Unlock levels, earn rewards, and enjoy learning every day.
          </p>

          <button
            onClick={() => navigate("/quiz")}
            style={{
              width: isDesktop ? "auto" : "100%",
              padding: "14px 26px",
              borderRadius: 999,
              border: "none",
              background:
                "linear-gradient(180deg, #6366F1 0%, #4F46E5 100%)",
              color: "#ffffff",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 6px 16px rgba(79,70,229,0.35)",
              transition:
                "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 10px 22px rgba(79,70,229,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(79,70,229,0.35)";
            }}
          >
            🎯 Start Playing
          </button>
        </div>

        {/* ================= RIGHT — ILLUSTRATION ================= */}
        <div style={{ textAlign: "center" }}>
          <img
            src={quizHero}
            alt="Quiz illustration"
            style={{
              width: "100%",
              maxWidth: isDesktop ? 360 : 260,
              opacity: 0.96,
            }}
          />
        </div>
      </div>
    </section>
  );
}