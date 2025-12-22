export default function QuizProgressTimer({
  progressPct,
  timeMs,
  totalMs,
  warn,
}) {
  const timerPct = (timeMs / totalMs) * 100;
  const secondsRemaining = Math.ceil(timeMs / 1000);

  return (
    <div style={{ display: "flex", gap: 28, marginBottom: 10, alignItems: "stretch" }}>
      {/* Progress bar - Questions answered */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 8, letterSpacing: 0.5 }}>
          PROGRESS
        </div>
        <div
          style={{
            height: 10,
            background: "rgba(255, 255, 255, 0.6)",
            borderRadius: 999,
            overflow: "hidden",
            boxShadow: "inset 0 2px 4px rgba(15,23,42,0.08)",
            border: "1px solid rgba(255,255,255,0.4)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #0284c7, #0ea5e9)",
              transition: "width 300ms ease",
              boxShadow: "0 0 12px rgba(2, 132, 199, 0.4)",
            }}
          />
        </div>
      </div>

      {/* Timer circle */}
      <div style={{ width: 110, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, marginBottom: 6, letterSpacing: 0.5 }}>
          TIME
        </div>
        <div
          style={{
            width: 72,
            height: 72,
            margin: "0 auto",
            borderRadius: "50%",
            background: warn
              ? "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)"
              : "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
            color: warn ? "#7f1d1d" : "#1e40af",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: 28,
            boxShadow: warn
              ? "0 8px 20px rgba(220,38,38,0.2)"
              : "0 8px 20px rgba(2,132,199,0.15)",
            border: warn ? "2px solid #f87171" : "2px solid #93c5fd",
            position: "relative",
            flexDirection: "column",
          }}
        >
          {secondsRemaining}
          <span style={{ fontSize: 9, fontWeight: 700, marginTop: -2 }}>Sec</span>
        </div>
      </div>
    </div>
  );
}