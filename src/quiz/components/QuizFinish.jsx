// src/quiz/components/QuizFinish.jsx
export default function QuizFinish({
  onBack,
  totalQuestions = 0,
  correctAnswers = 0,
  xpEarned = 0,
  coinsEarned = 0,
}) {
  return (
    <div
      style={{
        maxWidth: 420,
        margin: "40px auto",
        background: "#fff",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: 12 }}>Level Complete 🎉</h2>

      <div style={{ fontSize: 15, color: "#555", marginBottom: 20 }}>
        Great job! Here’s how you did:
      </div>

      {/* SUMMARY STATS */}
      <div style={{ textAlign: "left", marginBottom: 20 }}>
        <div style={{ marginBottom: 8 }}>
          ✅ Correct Answers: <b>{correctAnswers}</b> / {totalQuestions}
        </div>
        <div style={{ marginBottom: 8 }}>
          ⭐ XP Earned: <b>{xpEarned}</b>
        </div>
        <div>
          🪙 Coins Earned: <b>{coinsEarned}</b>
        </div>
      </div>

      {/* ACTION */}
      <button
        onClick={onBack}
        style={{
          padding: "12px 18px",
          background: "#6C63FF",
          color: "#fff",
          borderRadius: 10,
          border: "none",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Back to Levels
      </button>
    </div>
  );
}