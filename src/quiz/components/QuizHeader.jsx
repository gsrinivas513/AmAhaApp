export default function QuizHeader({ category, difficulty, level }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 22, fontWeight: 800 }}>
        Quiz — {category} — {difficulty} — Level {level}
      </div>
      <div style={{ color: "#666", fontSize: 14, marginTop: 4 }}>
        Questions randomized every time
      </div>
    </div>
  );
}