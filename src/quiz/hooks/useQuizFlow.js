// src/quiz/hooks/useQuizFlow.js
import { useMemo, useState } from "react";
import { saveResumeState, clearResumeState } from "../services/resumeService";
import saveLevelCompletion from "../services/levelProgressService";

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
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);

  const current = questions[index];

  const progressPct = useMemo(() => {
    if (!questions.length) return 0;
    return ((index + (submitted ? 1 : 0)) / questions.length) * 100;
  }, [index, submitted, questions.length]);

  /* ---------- ACTIONS ---------- */

function submitAnswer() {
  if (submitted) return;

  if (selected === current.correctAnswer) {
    setCorrectCount(c => c + 1);
    setXpEarned(x => x + 10);     // example
    setCoinsEarned(c => c + 5);   // example
  }

  setSubmitted(true);
}

async function nextQuestion() {
  const nextIndex = index + 1;
  const hasMoreQuestions = nextIndex < questions.length;

  if (hasMoreQuestions) {
    // ✅ SAVE RESUME ONLY IF QUIZ CONTINUES
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
    // ✅ LAST QUESTION → CLEAR RESUME
      // ✅ CLEAR RESUME
  if (user) {
    await clearResumeState(user);

    // ✅ SAVE LEVEL COMPLETION (THIS WAS MISSING)
    await saveLevelCompletion({
      user,
      category,
      difficulty,
      level: Number(level),
    });
  }
    // 🔹 ADD THESE 2 LINES HERE (Phase 7.6 – Step 3)
    setXpEarned(50);
    setCoinsEarned(20);
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
  // state
  index,
  current,
  submitted,
  finished,
  progressPct,
  correctCount,
  totalQuestions: questions.length,
  xpEarned,
  coinsEarned,

  // setters
  setIndex,

  // ui bindings
  questionProps,
  actionProps,
};
}