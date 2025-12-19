import React from "react";
import OptionButton from "../ui/OptionButton";

/**
 * 🔒 UI BASELINE — DO NOT MODIFY STYLES WITHOUT APPROVAL
 *
 * Pure presentational component
 * - No quiz logic
 * - No timers
 * - No side effects
 */

export default function QuizQuestionCard({
  question,
  options,
  correctAnswer,
  selected,
  submitted,
  onSelect,
  index,
  total,
}) {
  if (!question) return null;

  const isCorrect = selected === correctAnswer;

  return (
    <div
      className="slide-in"
      style={{
        background: "#ffffff",
        padding: 22,
        borderRadius: 14,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      {/* Question count */}
      <div style={{ fontSize: 13, color: "#777", marginBottom: 8 }}>
        Question {index + 1} / {total}
      </div>

      {/* Question text */}
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
        {question}
      </div>

      {/* Options */}
      <div style={{ display: "grid", gap: 10 }}>
        {Array.isArray(options) &&
          options.map((opt, i) => {
            let state = "default";

            if (!submitted) {
              if (opt === selected) {
                state = "selected";
              }
            } else {
              if (opt === correctAnswer) {
                state = "correct"; // ✅ green
              } else if (opt === selected) {
                state = "wrong"; // ❌ red
              } else {
                state = "disabled"; // muted
              }
            }

            return (
              <OptionButton
                key={`${opt}-${i}`}
                label={String.fromCharCode(65 + i)}
                text={opt}
                state={state}
                onClick={() => {
                  if (!submitted) onSelect(opt);
                }}
              />
            );
          })}
      </div>

      {/* ✅ A2.3 — Answer feedback message */}
      {submitted && (
        <div
          style={{
            marginTop: 14,
            fontSize: 14,
            fontWeight: 600,
            color: isCorrect ? "#2e7d32" : "#c62828",
          }}
        >
          {isCorrect
            ? "Correct! Nice work 👏"
            : "Oops! The correct answer is highlighted above."}
        </div>
      )}
    </div>
  );
}