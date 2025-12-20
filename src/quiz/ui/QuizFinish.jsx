// src/quiz/components/QuizFinish.jsx
import React from "react";
import { useAuth } from "../../components/AuthProvider";
import LoginGate from "../../auth/LoginGate";

export default function QuizFinish({
  correctCount,
  totalQuestions,
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
        padding: 24,
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}
    >
      {/* RESULT */}
      <h2 style={{ marginBottom: 8 }}>
        {passed ? "Level Complete 🎉" : "Level Failed ❌"}
      </h2>

      <p style={{ color: "#555", marginBottom: 16 }}>
        {passed
          ? "Great job! You answered all questions correctly."
          : "You need to answer all questions correctly to pass this level."}
      </p>

      {/* SAVE PROGRESS GATE (GUEST ONLY) */}
      {!user && (
        <LoginGate
          reason="Sign in to save your progress, unlock levels, and earn rewards"
        />
      )}

      {/* ACTIONS */}
      <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
        {passed && user && (
          <button
            onClick={onNextLevel}
            style={primaryBtn}
          >
            Continue to Next Level →
          </button>
        )}

        {!passed && (
          <button
            onClick={onRetry}
            style={primaryBtn}
          >
            Retry Level 🔁
          </button>
        )}

        <button
          onClick={onBack}
          style={secondaryBtn}
        >
          ← Back to Levels
        </button>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const primaryBtn = {
  padding: "12px 18px",
  background: "#6C63FF",
  color: "#fff",
  borderRadius: 10,
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "12px 18px",
  background: "#f5f6fb",
  color: "#333",
  borderRadius: 10,
  border: "1px solid #ddd",
  fontWeight: 600,
  cursor: "pointer",
};