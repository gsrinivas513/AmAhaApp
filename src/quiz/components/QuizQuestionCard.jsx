import React from "react";
import OptionButton from "../ui/OptionButton";
import AudioButton from "../../components/AudioButton";

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
        background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 50%, #f5f9ff 100%)",
        padding: "16px 18px",
        borderRadius: 20,
        boxShadow: "0 12px 36px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
        border: "1px solid rgba(200,210,240,0.8)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Question count - progress indicator */}
      <div style={{ fontSize: 11, color: "#0284c7", marginBottom: 8, fontWeight: 600, letterSpacing: 0.5 }}>
        Q{index + 1}/{total}
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          height: 4,
          background: "#e0e7ff",
          borderRadius: 999,
          marginBottom: 14,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${((index + 1) / total) * 100}%`,
            height: "100%",
            background: "linear-gradient(90deg, #0284c7, #0ea5e9)",
            transition: "width 0.4s ease",
          }}
        />
      </div>

      {/* Question text with audio button inline */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#0b1220", lineHeight: 1.5, flex: 1 }}>
          {question}
        </div>
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          <AudioButton 
            text={question}
            variant="outline"
            size="sm"
            ariaLabel="Read question aloud"
          />
        </div>
      </div>

      {/* Options */}
      <div style={{ display: "grid", gap: 12 }}>
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

      {/* ✅ Answer feedback message */}
      {submitted && (
        <div
          style={{
            marginTop: 20,
            padding: "14px 16px",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            background: isCorrect ? "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)" : "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
            color: isCorrect ? "#047857" : "#991b1b",
            border: `1px solid ${isCorrect ? "#6ee7b7" : "#fca5a5"}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18 }}>{isCorrect ? "✅" : "❌"}</span>
          <span>
            {isCorrect
              ? "Correct! Excellent work! 🎉"
              : "Oops! The correct answer is highlighted above."}
          </span>
        </div>
      )}
    </div>
  );
}