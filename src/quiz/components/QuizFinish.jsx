// src/quiz/components/QuizFinish.jsx
import React from "react";
import { useAuth } from "../../components/AuthProvider";
import LoginGate from "../../auth/LoginGate";
import AdCard from "../../ads/AdCard";

export default function QuizFinish({
  correctCount,
  totalQuestions,
  xpEarned,
  coinsEarned,
  onNextLevel,
  onRetry,
  onBack,
}) {
  const { user } = useAuth();
  const passed = correctCount === totalQuestions;

  return (
    <div
      className="finish-card"
      style={{
        maxWidth: 420,
        margin: "40px auto",
        padding: 28,
        background: "#fff",
        borderRadius: 18,
        textAlign: "center",
        boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
        animation: passed
          ? "finishPop 0.6s ease-out"
          : "finishShake 0.45s ease-out",
      }}
    >
      {/* TITLE */}
      <h2 style={{ marginBottom: 10 }}>
        {passed ? "Level Complete 🎉" : "Level Failed ❌"}
      </h2>

      <p style={{ color: "#555", marginBottom: 20 }}>
        {passed
          ? "Excellent! You cleared this level."
          : "Don’t worry — try again and master it!"}
      </p>

      {/* STATS */}
      <div style={{ fontSize: 15, marginBottom: 12 }}>
        ✅ Correct: {correctCount} / {totalQuestions}
      </div>

      <div style={{ fontSize: 14, color: "#555" }}>
        ⭐ XP: {xpEarned} &nbsp; | &nbsp; 🪙 Coins: {coinsEarned}
      </div>

      {/* 💰 FINISH SCREEN AD — HIGH CTR */}
      {passed && <AdCard slot="finish_screen" />}

      {/* 🔒 SAVE PROGRESS GATE (GUEST ONLY) */}
      {passed && !user && (
        <div style={{ marginTop: 24 }}>
          <LoginGate
            title="Save your progress"
            message="Sign in to save progress, earn badges, and appear on leaderboards."
            onContinue={onNextLevel}
          />
        </div>
      )}

      {/* ACTIONS */}
      <div style={{ marginTop: 24 }}>
        {passed && user && (
          <ActionButton onClick={onNextLevel} primary>
            Continue →
          </ActionButton>
        )}

        {!passed && (
          <>
            <ActionButton onClick={onRetry} primary>
              Retry 🔁
            </ActionButton>
            <ActionButton onClick={onBack}>
              Back to Levels
            </ActionButton>
          </>
        )}
      </div>

      {/* ANIMATIONS */}
      <style>
        {`
          @keyframes finishPop {
            0% { transform: scale(0.9); opacity: 0; }
            60% { transform: scale(1.05); }
            100% { transform: scale(1); opacity: 1; }
          }

          @keyframes finishShake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            50% { transform: translateX(6px); }
            75% { transform: translateX(-4px); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
}

/* ---------------- BUTTON ---------------- */

function ActionButton({ children, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        marginTop: 12,
        padding: "14px",
        borderRadius: 14,
        border: primary ? "none" : "1px solid #ddd",
        background: primary ? "#6C63FF" : "#fff",
        color: primary ? "#fff" : "#333",
        fontWeight: 700,
        cursor: "pointer",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow =
          "0 10px 25px rgba(108,99,255,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {children}
    </button>
  );
}