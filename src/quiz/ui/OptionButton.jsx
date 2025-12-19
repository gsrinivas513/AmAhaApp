import React from "react";

export default function OptionButton({
  label,
  text,
  onClick,
  state, // "default" | "selected" | "correct" | "wrong" | "disabled"
}) {
  let background = "#fff";
  let borderColor = "#e6e6e6";
  let transform = "scale(1)";
  let animation = "none";
  let opacity = 1;

  if (state === "selected") {
    background = "#eef4ff";
    borderColor = "#6C63FF";
  }

  if (state === "correct") {
    background = "#e8ffed";
    borderColor = "#4caf50";
    animation = "pulse 0.35s ease-out";
  }

  if (state === "wrong") {
    background = "#ffecec";
    borderColor = "#f44336";
    animation = "shake 0.3s";
  }

  if (state === "disabled") {
    opacity = 0.55;
  }

  return (
    <>
      <button
        onClick={onClick}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 12,
          border: `1px solid ${borderColor}`,
          background,
          textAlign: "left",
          fontSize: 15,
          cursor: state === "disabled" ? "default" : "pointer",

          transform,
          animation,
          opacity,

          transition: "background 0.2s ease, transform 0.2s ease",
        }}
        disabled={state === "disabled"}
      >
        <b style={{ marginRight: 8 }}>{label}.</b>
        {text}
      </button>

      <style>
        {`
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            50% { transform: translateX(4px); }
            75% { transform: translateX(-4px); }
            100% { transform: translateX(0); }
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.04); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </>
  );
}