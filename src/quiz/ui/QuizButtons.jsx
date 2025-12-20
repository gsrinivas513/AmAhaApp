import React from "react";

/* 🔒 UI BASELINE — QUIZ ACTION BUTTONS
   Matches modern design system with gradients, shadows, and responsive states
*/

const baseStyle = {
  padding: "16px 22px",
  borderRadius: 16,
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: 16,
  transition: "all 0.3s ease",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
};

/* ---------- SUBMIT ---------- */
export function SubmitButton({ onClick, disabled }) {
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      style={{
        ...baseStyle,
        background: disabled
          ? "linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)"
          : "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
        color: "#ffffff",
        boxShadow: disabled
          ? "0 4px 12px rgba(15,23,42,0.08)"
          : "0 12px 28px rgba(2,132,199,0.35)",
        border: disabled ? "1px solid #9ca3af" : "none",
        opacity: disabled ? 0.75 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.boxShadow = "0 12px 28px rgba(2,132,199,0.4)";
          e.target.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.boxShadow = "0 12px 28px rgba(2,132,199,0.35)";
          e.target.style.transform = "translateY(0)";
        }
      }}
    >
      <span>✅</span> Submit Answer
    </button>
  );
}

/* ---------- NEXT / FINISH ---------- */
export function NextButton({ onClick, isLast }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...baseStyle,
        background: isLast
          ? "linear-gradient(135deg, #059669 0%, #10b981 100%)"
          : "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
        color: "#ffffff",
        boxShadow: isLast
          ? "0 12px 28px rgba(5,150,105,0.35)"
          : "0 12px 28px rgba(2,132,199,0.35)",
        flex: 1,
      }}
      onMouseEnter={(e) => {
        e.target.style.boxShadow = isLast
          ? "0 16px 36px rgba(5,150,105,0.4)"
          : "0 16px 36px rgba(2,132,199,0.4)";
        e.target.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.target.style.boxShadow = isLast
          ? "0 12px 28px rgba(5,150,105,0.35)"
          : "0 12px 28px rgba(2,132,199,0.35)";
        e.target.style.transform = "translateY(0)";
      }}
    >
      <span>{isLast ? "🏆" : "▶️"}</span>
      {isLast ? "Finish Quiz" : "Next Question"}
    </button>
  );
}

/* ---------- SKIP ---------- */
export function SkipButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...baseStyle,
        background: "linear-gradient(135deg, #ffffff 0%, #f5f7fb 100%)",
        color: "#64748b",
        boxShadow: "0 6px 16px rgba(15,23,42,0.1)",
        border: "2px solid #e0e7ff",
      }}
      onMouseEnter={(e) => {
        e.target.style.boxShadow = "0 10px 24px rgba(15,23,42,0.12)";
        e.target.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.target.style.boxShadow = "0 6px 16px rgba(15,23,42,0.1)";
        e.target.style.transform = "translateY(0)";
      }}
    >
      <span>⏭️</span> Skip Question
    </button>
  );
}