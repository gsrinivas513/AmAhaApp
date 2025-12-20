// src/quiz/ui/OptionButton.jsx
import React from "react";
import { useUIConfig } from "../../ui/useUIConfig";

export default function OptionButton({
  label,
  text,
  onClick,
  state, // "default" | "selected" | "correct" | "wrong" | "disabled"
}) {
  const { microAnimations, loading } = useUIConfig();

  const enabled = microAnimations?.enabled && !loading;

  /* ---------- SAFE FALLBACKS ---------- */
  const selectScale = enabled ? microAnimations.optionSelectScale : 1;
  const hoverScale = enabled ? microAnimations.optionHoverScale : 1;
  const transitionMs = enabled ? microAnimations.transitionMs : 0;
  const pulseScale = enabled ? microAnimations.optionSelectScale : 1.04;

  let background = "#fff";
  let borderColor = "#e6e6e6";
  let transform = "scale(1)";
  let animation = "none";
  let opacity = 1;

  /* ---------- STATES ---------- */

  if (state === "selected") {
    background = "#eef4ff";
    borderColor = "#6C63FF";
    transform = `scale(${selectScale})`;
  }

  if (state === "correct") {
    background = "#e8ffed";
    borderColor = "#4caf50";

    if (enabled && microAnimations.correctPulse) {
      animation = "pulse 0.35s ease-out";
    }
  }

  if (state === "wrong") {
    background = "#ffecec";
    borderColor = "#f44336";

    if (enabled && microAnimations.wrongShake) {
      animation = "shake 0.3s";
    }
  }

  if (state === "disabled") {
    opacity = 0.55;
  }

  return (
    <>
      <button
        onClick={onClick}
        disabled={state === "disabled"}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 12,
          border: `1px solid ${borderColor}`,
          background,
          textAlign: "left",
          fontSize: 15,
          cursor: state === "disabled" ? "default" : "pointer",
          opacity,
          transform,
          animation,
          transition: enabled
            ? `transform ${transitionMs}ms ease,
               background ${transitionMs}ms ease`
            : "none",
        }}
        onMouseEnter={(e) => {
          if (enabled && state === "default") {
            e.currentTarget.style.transform = `scale(${hoverScale})`;
          }
        }}
        onMouseLeave={(e) => {
          if (enabled && state === "default") {
            e.currentTarget.style.transform = "scale(1)";
          }
        }}
      >
        <b style={{ marginRight: 8 }}>{label}.</b>
        {text}
      </button>

      {/* 🎞 Animations */}
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
            50% { transform: scale(${pulseScale}); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </>
  );
}