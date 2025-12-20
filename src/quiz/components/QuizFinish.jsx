// src/quiz/components/QuizFinish.jsx
import React from "react";
import { useAuth } from "../../components/AuthProvider";
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
      style={{
        maxWidth: 420,
        margin: "40px auto",
        padding: 28,
        background: "#fff",
        borderRadius: 18,
        textAlign: "center",
        boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
      }}
    >
      <h2>{passed ? "Level Complete 🎉" : "Level Failed ❌"}</h2>

      <p style={{ color: "#555", marginBottom: 20 }}>
        {passed
          ? "Excellent! You cleared this level."
          : "Try again and master it!"}
      </p>

      <div style={{ fontSize: 15 }}>
        ✅ Correct: {correctCount} / {totalQuestions}
      </div>

      <div style={{ fontSize: 14, color: "#555", marginBottom: 16 }}>
        ⭐ XP: {xpEarned} &nbsp; | &nbsp; 🪙 Coins: {coinsEarned}
      </div>

      {passed && <AdCard slot="finish_screen" />}

      {/* PRIMARY ACTION — ALWAYS WORKS */}
      <ActionButton primary onClick={onNextLevel}>
        Next Level →
      </ActionButton>

      {/* OPTIONAL SIGN-IN UPSELL */}
      {passed && !user && (
        <div
          style={{
            marginTop: 16,
            fontSize: 13,
            color: "#6b7280",
          }}
        >
          Save XP, badges & leaderboard position.
          <br />
          <b style={{ color: "#4f46e5", cursor: "pointer" }}>
            Sign in & Save ⭐
          </b>
        </div>
      )}

      {!passed && (
        <>
          <ActionButton onClick={onRetry}>Retry 🔁</ActionButton>
          <ActionButton onClick={onBack}>Back to Levels</ActionButton>
        </>
      )}
    </div>
  );
}

function ActionButton({ children, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        marginTop: 14,
        padding: "14px",
        borderRadius: 14,
        border: primary ? "none" : "1px solid #ddd",
        background: primary ? "#6366f1" : "#fff",
        color: primary ? "#fff" : "#333",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}