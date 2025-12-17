// src/quiz/ui/QuizProgress.jsx
export default function QuizProgress({
  progressPct,
  timeMs,
  totalMs
}) {
  const warn = timeMs <= 5000;
  const timerPct = (timeMs / totalMs) * 100;

  return (
    <div style={{ display: "flex", gap: 24, marginBottom: 28 }}>
      {/* Progress */}
      <div style={{ flex: 1 }}>
        <div style={{ height: 10, background: "#eee", borderRadius: 999 }}>
          <div
            style={{
              height: "100%",
              width: `${progressPct}%`,
              background: "linear-gradient(90deg,#6C63FF,#8A78FF)",
              transition: "width 300ms linear",
            }}
          />
        </div>
      </div>

      {/* Timer */}
      <div style={{ width: 180, textAlign: "center" }}>
        <div
          style={{
            width: 54,
            height: 54,
            margin: "0 auto 8px",
            borderRadius: "50%",
            background: warn ? "#ffe5e5" : "#eef1ff",
            color: warn ? "#d32f2f" : "#3f51b5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 20,
          }}
        >
          {Math.ceil(timeMs / 1000)}
        </div>

        <div style={{ height: 8, background: "#eee", borderRadius: 6 }}>
          <div
            style={{
              height: "100%",
              width: `${timerPct}%`,
              background: warn ? "#ff6b6b" : "#6C63FF",
              transition: "width 120ms linear",
            }}
          />
        </div>
      </div>
    </div>
  );
}