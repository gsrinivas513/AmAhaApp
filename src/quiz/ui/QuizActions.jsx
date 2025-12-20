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
        gap: 14,
        marginTop: 28,
        alignItems: "center",
      }}
    >
      {!submitted ? (
        <>
          <SubmitButton
            onClick={onSubmit}
            disabled={!canSubmit}
            aria-disabled={!canSubmit}
          />

          <SkipButton onClick={onNext} />
        </>
      ) : (
        <NextButton onClick={onNext} isLast={isLast} />
      )}
    </div>
  );
}