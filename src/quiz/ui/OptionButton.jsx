import React from "react";

export default function OptionButton({
  label,
  text,
  onClick,
  state, // "default" | "selected" | "correct" | "wrong"
}) {
  let background = "#fff";

  if (state === "selected") background = "#eef4ff";
  if (state === "correct") background = "#e8ffed";
  if (state === "wrong") background = "#ffecec";

  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 14px",
        borderRadius: 12,               // ✅ curved
        border: "1px solid #e6e6e6",
        background,
        textAlign: "left",
        fontSize: 15,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <b style={{ marginRight: 8 }}>{label}.</b>
      {text}
    </button>
  );
}