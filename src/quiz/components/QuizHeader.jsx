export default function QuizHeader({ category, difficulty, level }) {
  // Color mapping for difficulty levels
  const difficultyColors = {
    easy: { bg: "#bbf7d0", text: "#047857", border: "#6ee7b7" },
    medium: { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
    hard: { bg: "#fecaca", text: "#991b1b", border: "#fca5a5" },
    expert: { bg: "#e9d5ff", text: "#6b21a8", border: "#c7b2ff" },
  };

  const difficultyStyle = difficultyColors[difficulty?.toLowerCase()] || difficultyColors.medium;

  return (
    <div
      style={{
        marginBottom: 28,
        background: "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 50%, #fce7f3 100%)",
        padding: "24px 28px",
        borderRadius: 20,
        border: "1px solid rgba(59, 130, 246, 0.2)",
        boxShadow: "0 12px 32px rgba(59, 130, 246, 0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Category & Level */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 24 }}>📚</span>
        <div>
          <div style={{ fontSize: 14, color: "#64748b", fontWeight: 600, letterSpacing: 0.5 }}>
            CATEGORY
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0b1220" }}>
            {category}
          </div>
        </div>
      </div>

      {/* Difficulty & Level badges */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div
          style={{
            background: difficultyStyle.bg,
            color: difficultyStyle.text,
            padding: "8px 14px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
            border: `1px solid ${difficultyStyle.border}`,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {difficulty}
        </div>
        <div
          style={{
            background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
            color: "#1e40af",
            padding: "8px 14px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
            border: "1px solid #93c5fd",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>⭐</span> Level {level}
        </div>
      </div>

      {/* Info text */}
      <div style={{ color: "#64748b", fontSize: 12, marginTop: 12, fontStyle: "italic" }}>
        ✨ Questions randomized every time
      </div>
    </div>
  );
}