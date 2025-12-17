// src/quiz/hooks/useQuizFlow.js
import { useMemo, useState } from "react";

export function useQuizFlow({
  questions,
  user,
  category,
  difficulty,
  level,
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);

  // ✅ Current question
  const current = questions[index];

  // ✅ Progress %
  const progressPct = useMemo(() => {
    if (!questions.length) return 0;
    return ((index + (submitted ? 1 : 0)) / questions.length) * 100;
  }, [index, submitted, questions.length]);

  /* ---------------- ACTION HANDLERS ---------------- */

  function submitAnswer() {
    if (submitted) return;
    setSubmitted(true);
  }

  function nextQuestion() {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setSelected(null);
      setSubmitted(false); // ✅ VERY IMPORTANT (timer restarts)
    } else {
      setFinished(true);
    }
  }

  function skipQuestion() {
    nextQuestion();
  }

  /* ---------------- PROPS FOR UI ---------------- */

  const questionProps = {
    question: current?.question,
    options: current?.options || [],
    correctAnswer: current?.correctAnswer,
    selected,
    submitted,
    onSelect: setSelected,
    index,
    total: questions.length,
  };

  const actionProps = {
    submitted,
    onSubmit: submitAnswer,
    onNext: nextQuestion,
    onSkip: skipQuestion,
    isLast: index + 1 === questions.length,
  };

  return {
    // state
    index,
    current,
    submitted,
    finished,
    progressPct,

    // setters (used by resume)
    setIndex,

    // ui bindings
    questionProps,
    actionProps,
  };
}