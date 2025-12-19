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
            let state = "idle";

            if (submitted) {
              if (opt === correctAnswer) {
                state = "correct";      // ✅ always green
              } else if (opt === selected) {
                state = "wrong";        // ❌ only wrong answer is red
              }
            } else {
              if (opt === selected) {
                state = "selected";     // only before submit
              }
            }

    return (
      <OptionButton
        key={opt}
        label={String.fromCharCode(65 + i)}
        text={opt}
        state={state}
        onClick={() => !submitted && onSelect(opt)}
      />
    );
  })}
      </div>
    </div>
  );
}