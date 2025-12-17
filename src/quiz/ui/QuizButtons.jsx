import React from "react";

/* 🔒 UI BASELINE — DO NOT CHANGE WITHOUT APPROVAL */

const baseStyle = {
  padding: "10px 16px",
  borderRadius: 8,          // ✅ CURVED
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 15,
};

export function SubmitButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "20px",
        borderRadius: "999px",   // 👈 EXTREME ROUND
        background: "red",       // 👈 VERY OBVIOUS
        color: "white",
        fontSize: 18,
      }}
    >
      SUBMIT TEST
    </button>
  );
}

export function NextButton({ onClick, isLast }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...baseStyle,
        background: "#4caf50",
        color: "#fff",
      }}
    >
      {isLast ? "Finish" : "Next"}
    </button>
  );
}

export function SkipButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...baseStyle,
        background: "#f5f6fb",
        border: "1px solid #ddd",
        color: "#333",
      }}
    >
      Skip
    </button>
  );
}