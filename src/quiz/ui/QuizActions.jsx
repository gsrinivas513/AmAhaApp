import React from "react";
import {
  SubmitButton,
  NextButton,
  SkipButton,
} from "./QuizButtons";

export default function QuizActions({
  submitted,
  canSubmit,
  onSubmit,
  onNext,
  isLast,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        marginTop: 18,
        alignItems: "center",
      }}
    >
      {!submitted ? (
        <>
          <SubmitButton
            onClick={onSubmit}
            disabled={!canSubmit}          // ✅ enable only after select
            aria-disabled={!canSubmit}    // ♿ accessibility
          />

          <SkipButton onClick={onNext} />
        </>
      ) : (
        <NextButton onClick={onNext} isLast={isLast} />
      )}
    </div>
  );
}