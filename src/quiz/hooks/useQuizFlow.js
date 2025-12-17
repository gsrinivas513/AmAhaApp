// src/quiz/hooks/useQuizFlow.js
import { useMemo, useState } from "react";
import { saveResumeState, clearResumeState } from "../services/resumeService";

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

  const current = questions[index];

  const progressPct = useMemo(() => {
    if (!questions.length) return 0;
    return ((index + (submitted ? 1 : 0)) / questions.length) * 100;
  }, [index, submitted, questions.length]);

  /* ---------- ACTIONS ---------- */

  function submitAnswer() {
    if (submitted) return;
    setSubmitted(true);
  }

  async function nextQuestion() {
    const nextIndex = index + 1;

    if (nextIndex < questions.length) {
      // ✅ SAVE RESUME STATE HERE (THIS WAS MISSING)
      if (user) {
        await saveResumeState({
          user,
          category,
          difficulty,
          level,
          index: nextIndex,
        });
      }

      setIndex(nextIndex);
      setSelected(null);
      setSubmitted(false);
    } else {
      // ✅ QUIZ FINISHED → CLEAR RESUME
      if (user) {
        await clearResumeState(user);
      }
      setFinished(true);
    }
  }

  function skipQuestion() {
    nextQuestion();
  }

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
    index,
    current,
    submitted,
    finished,
    progressPct,
    setIndex,
    questionProps,
    actionProps,
  };
}