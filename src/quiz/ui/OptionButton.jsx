// src/quiz/ui/OptionButton.jsx
import React, { useState } from "react";
import { useUIConfig } from "../../ui/useUIConfig";
import { ttsService } from "../../utils/textToSpeech";

export default function OptionButton({
  label,
  text,
  onClick,
  state, // "default" | "selected" | "correct" | "wrong" | "disabled"
}) {
  const { microAnimations, loading } = useUIConfig();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const enabled = microAnimations?.enabled && !loading;

  /* ---------- SAFE FALLBACKS ---------- */
  const selectScale = enabled ? microAnimations.optionSelectScale : 1;
  const hoverScale = enabled ? microAnimations.optionHoverScale : 1;
  const transitionMs = enabled ? microAnimations.transitionMs : 300;
  const pulseScale = enabled ? microAnimations.optionSelectScale : 1.04;

  // Handle audio playback for option text
  const handlePlayAudio = (e) => {
    e.stopPropagation();
    
    if (isPlayingAudio) {
      ttsService.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      ttsService.speak(text, {
        rate: 0.85,
        pitch: 1.05,
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false),
      });
    }
  };

  // Design system color mappings
  const stateStyles = {
    default: {
      bg: "linear-gradient(135deg, #ffffff 0%, #f5f7fb 100%)",
      border: "2px solid #e0e7ff",
      text: "#0b1220",
      labelBg: "#e8ecff",
      labelText: "#0284c7",
      shadow: "0 6px 16px rgba(15,23,42,0.1)",
    },
    selected: {
      bg: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
      border: "2px solid #0284c7",
      text: "#1e40af",
      labelBg: "#0284c7",
      labelText: "#ffffff",
      shadow: "0 10px 28px rgba(2,132,199,0.25)",
    },
    correct: {
      bg: "linear-gradient(135deg, #bbf7d0 0%, #86efac 100%)",
      border: "2px solid #047857",
      text: "#065f46",
      labelBg: "#047857",
      labelText: "#ffffff",
      shadow: "0 10px 28px rgba(4,120,87,0.25)",
    },
    wrong: {
      bg: "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)",
      border: "2px solid #dc2626",
      text: "#7f1d1d",
      labelBg: "#dc2626",
      labelText: "#ffffff",
      shadow: "0 10px 28px rgba(220,38,38,0.25)",
    },
    disabled: {
      bg: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
      border: "1px solid #d1d5db",
      text: "#9ca3af",
      labelBg: "#d1d5db",
      labelText: "#9ca3af",
      shadow: "0 3px 8px rgba(15,23,42,0.06)",
    },
  };

  const style = stateStyles[state] || stateStyles.default;

  return (
    <>
      <button
        onClick={onClick}
        disabled={state === "disabled" || state === "correct" || state === "wrong"}
        style={{
          width: "100%",
          padding: "16px 18px",
          borderRadius: 14,
          border: style.border,
          background: style.bg,
          color: style.text,
          fontSize: 16,
          fontWeight: 500,
          cursor: state === "disabled" || state === "correct" || state === "wrong" ? "default" : "pointer",
          boxShadow: style.shadow,
          transition: enabled ? `all ${transitionMs}ms ease` : "none",
          display: "flex",
          alignItems: "center",
          gap: 16,
          outline: "none",
        }}
        onMouseEnter={(e) => {
          if (enabled && state === "default") {
            e.currentTarget.style.transform = `scale(${hoverScale})`;
            e.currentTarget.style.boxShadow = "0 12px 28px rgba(15,23,42,0.15)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = style.shadow;
        }}
      >
        {/* Label circle */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 42,
            height: 42,
            borderRadius: "50%",
            background: style.labelBg,
            color: style.labelText,
            fontWeight: "700",
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          {label}
        </span>

        {/* Option text */}
        <span style={{ flex: 1, textAlign: "left", lineHeight: 1.4 }}>
          {text}
        </span>

        {/* Audio play button for option */}
        <button
          onClick={handlePlayAudio}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            transition: "all 200ms ease",
            opacity: 0.7,
            marginLeft: "auto",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.7";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="Read option aloud"
          aria-label="Read option aloud"
        >
          {isPlayingAudio ? "🔊" : "🔉"}
        </button>

        {/* State indicator icons */}
        {state === "correct" && <span style={{ fontSize: 20 }}>✅</span>}
        {state === "wrong" && <span style={{ fontSize: 20 }}>❌</span>}
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