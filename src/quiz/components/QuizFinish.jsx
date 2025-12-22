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
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "48px auto",
        padding: 0,
        background: passed
          ? "linear-gradient(135deg, #bbf7d0 0%, #86efac 100%)"
          : "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)",
        borderRadius: 20,
        boxShadow: passed
          ? "0 20px 48px rgba(4,120,87,0.25)"
          : "0 20px 48px rgba(220,38,38,0.25)",
        overflow: "hidden",
      }}
    >
      {/* Inner card with white background */}
      <div style={{ padding: 36, textAlign: "center" }}>
        {/* Large celebration emoji */}
        <div style={{ fontSize: 64, marginBottom: 16 }}>
          {passed ? "🎉" : "💪"}
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: passed ? "#065f46" : "#7f1d1d",
            marginBottom: 8,
          }}
        >
          {passed ? "Level Complete!" : "Try Again!"}
        </h2>

        {/* Subtitle */}
        <p
          style={{
            color: passed ? "#047857" : "#991b1b",
            marginBottom: 28,
            fontSize: 15,
            lineHeight: 1.5,
          }}
        >
          {passed
            ? "You mastered this level with excellent skill!"
            : "Almost there! Practice makes perfect. Give it another shot!"}
        </p>

        {/* Stats cards */}
        <div style={{ display: "grid", gap: 12, marginBottom: 28 }}>
          {/* Correct answers */}
          <div
            style={{
              background: passed ? "#ffffff" : "#ffffff",
              padding: 16,
              borderRadius: 14,
              border: passed ? "2px solid #6ee7b7" : "2px solid #fca5a5",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#64748b",
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              ACCURACY
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: passed ? "#047857" : "#991b1b",
              }}
            >
              {accuracy}%
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
              ✅ {correctCount} correct · ❌ {totalQuestions - correctCount} missed
            </div>
          </div>

          {/* Rewards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                background: "#ffffff",
                padding: 14,
                borderRadius: 12,
                border: "1px solid #e0e7ff",
              }}
            >
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
                XP EARNED
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: "#0284c7",
                  marginTop: 4,
                }}
              >
                +{xpEarned}
              </div>
            </div>
            <div
              style={{
                background: "#ffffff",
                padding: 14,
                borderRadius: 12,
                border: "1px solid #fef3c7",
              }}
            >
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
                COINS EARNED
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: "#d97706",
                  marginTop: 4,
                }}
              >
                +{coinsEarned}
              </div>
            </div>
          </div>
        </div>

        {/* Ad space */}
        {passed && <AdCard slot="finish_screen" />}

        {/* Actions */}
        <div style={{ display: "grid", gap: 10, marginTop: 28 }}>
          {passed ? (
            <ActionButton
              primary={true}
              onClick={onNextLevel}
              passed={passed}
            >
              🚀 Next Level
            </ActionButton>
          ) : (
            <>
              <ActionButton onClick={onRetry} passed={passed} primary={true}>
                🔁 Retry This Level
              </ActionButton>
              <ActionButton onClick={onBack} passed={passed} secondary={true}>
                ← Back to Levels
              </ActionButton>
            </>
          )}
        </div>

        {/* Sign-in upsell */}
        {passed && !user && (
          <div
            style={{
              marginTop: 24,
              padding: 14,
              background: "rgba(255,255,255,0.7)",
              borderRadius: 12,
              fontSize: 13,
              color: "#0b1220",
              lineHeight: 1.5,
            }}
          >
            Save progress and climb the global leaderboard!
            <br />
            <span style={{ fontWeight: 700, color: "#0284c7", cursor: "pointer" }}>
              ⭐ Sign in & Save Your Progress
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButton({ children, onClick, primary, secondary, passed }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "16px 20px",
        borderRadius: 14,
        border: secondary ? "2px solid rgba(0,0,0,0.1)" : "none",
        background: primary
          ? "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)"
          : secondary
          ? "transparent"
          : "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
        color: primary ? "#ffffff" : "#0b1220",
        fontWeight: 700,
        fontSize: 15,
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: primary ? "0 8px 20px rgba(2,132,199,0.3)" : "none",
      }}
      onMouseEnter={(e) => {
        if (primary) {
          e.target.style.boxShadow = "0 12px 28px rgba(2,132,199,0.4)";
          e.target.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        if (primary) {
          e.target.style.boxShadow = "0 8px 20px rgba(2,132,199,0.3)";
          e.target.style.transform = "translateY(0)";
        }
      }}
    >
      {children}
    </button>
  );
}