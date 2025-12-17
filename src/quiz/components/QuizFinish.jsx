export default function QuizFinish({ onBack }) {
  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Level Complete 🎉</h2>
      <button
        onClick={onBack}
        style={{
          padding: "12px 18px",
          background: "#6C63FF",
          color: "#fff",
          borderRadius: 8,
          border: "none",
          marginTop: 12,
        }}
      >
        Back to Levels
      </button>
    </div>
  );
}