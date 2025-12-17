export default function QuizFinish({ onBack }) {
  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Level Complete 🎉</h2>
      <div onClick={onBack} style={{ marginTop: 12, cursor: "pointer", color: "#6C63FF" }}>
        ← Back to Levels
      </div>
    </div>
  );
}