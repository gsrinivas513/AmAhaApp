// src/quiz/ui/SoundToggle.jsx
import React from "react";

export default function SoundToggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title="Sound effects"
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: 18,
      }}
    >
      {enabled ? "🔊" : "🔇"}
    </button>
  );
}