import React from "react";
import {
  SubmitButton,
  NextButton,
  SkipButton,
} from "../ui/QuizButtons";

export default function QuizActions({
  submitted,
  onSubmit,
  onNext,
  isLast,
}) {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
      {!submitted ? (
        <SubmitButton onClick={onSubmit} />
      ) : (
        <NextButton onClick={onNext} isLast={isLast} />
      )}

      <SkipButton onClick={onNext} />
    </div>
  );
}