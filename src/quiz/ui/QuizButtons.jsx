import React from "react";

/* 🔒 UI BASELINE — QUIZ ACTION BUTTONS
   Matches OptionButton style (curved, modern, consistent)
*/

const baseStyle = {
  padding: "12px 16px",
  borderRadius: 12,              // ✅ same curve as OptionButton
  border: "1px solid #e6e6e6",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 15,
  transition: "all 0.2s ease",
  textAlign: "center",
};

/* ---------- SUBMIT ---------- */
export function SubmitButton({ onClick, disabled }) {
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      style={{
        padding: "10px 16px",
        borderRadius: 12,
        background: disabled ? "#dcdcdc" : "#6C63FF",
        color: disabled ? "#888" : "#fff",
        border: "none",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        transition: "all 0.2s ease",
      }}
    >
      Submit
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
        background: "#4caf50",    // green
        color: "#fff",
        border: "none",
      }}
    >
      {isLast ? "Finish" : "Next"}
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
        background: "#f5f6fb",
        color: "#333",
      }}
    >
      Skip
    </button>
  );
}