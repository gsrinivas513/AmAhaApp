// src/home/components/HeroSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import quizHero from "../../assets/illustrations/quiz-hero.svg";

export default function HeroSection() {
  const navigate = useNavigate();
  const isDesktop = window.matchMedia("(min-width: 900px)").matches;

  return (
    <section
      className="section-spacing"
      style={{
        padding: "80px 20px",
        background:
          "linear-gradient(180deg, #f9fafc 0%, #ffffff 100%)",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: 1100,
          margin: "auto",
          display: "grid",
          gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
          gap: 32,
          alignItems: "center",
        }}
      >
        {/* LEFT — TEXT */}
        <div>
          <h1 className="heading-xl">
            Learn. Play. <br />
            <span style={{ color: "#6C63FF" }}>
              Win Knowledge.
            </span>
          </h1>

          <p
            className="text-muted"
            style={{ maxWidth: 480, marginTop: 16 }}
          >
            Fun quizzes for kids, students, and curious minds.
            Build knowledge daily and unlock achievements.
          </p>

          <button
            onClick={() => navigate("/quiz")}
            style={{
              marginTop: 24,
              padding: "16px 28px",
              background: "#6C63FF",
              color: "#fff",
              border: "none",
              borderRadius: 14,
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 12px 30px rgba(108,99,255,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Start Playing →
          </button>
        </div>

        {/* RIGHT — ILLUSTRATION */}
        <div style={{ textAlign: "center" }}>
          <img
            src={quizHero}
            alt="Quiz illustration"
            style={{
              width: "100%",
              maxWidth: isDesktop ? 420 : 300,
              margin: "auto",
            }}
          />
        </div>
      </div>
    </section>
  );
}