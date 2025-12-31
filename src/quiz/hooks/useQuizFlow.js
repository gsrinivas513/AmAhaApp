// src/quiz/hooks/useQuizFlow.js
import { useEffect, useMemo, useState } from "react";
import { saveResumeState, clearResumeState } from "../services/resumeService";
import { saveLevelCompletion } from "../services/levelProgressService";
import { QUESTIONS_PER_LEVEL } from "../constants";

export function useQuizFlow({
  questions,
  user,
  category,
  difficulty,
  level,
  initialIndex = 0,
}) {
  const levelNumber = Number(level);
  const [transitioning, setTransitioning] = useState(false);

  // 🔹 Slice questions for THIS level
  const levelQuestions = useMemo(() => {
    const start = (levelNumber - 1) * QUESTIONS_PER_LEVEL;
    const end = start + QUESTIONS_PER_LEVEL;
    return questions.slice(start, end);
  }, [questions, levelNumber]);

  // 🔹 State
  const [index, setIndex] = useState(initialIndex);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);

  const current = levelQuestions[index] || null;

  if (current && current.correctAnswer === undefined) {
    console.error("❌ correctAnswer missing in question:", current);
  }
  // 🔁 RESET when level changes (AFTER slicing exists)
  useEffect(() => {
    setIndex(0);
    setSelected(null);
    setSubmitted(false);
    setFinished(false);
    setCorrectCount(0);
    setXpEarned(0);
    setCoinsEarned(0);
  }, [levelNumber]);

  function reset() {
  setIndex(0);
  setSelected(null);
  setSubmitted(false);
  setFinished(false);
  setCorrectCount(0);
  setXpEarned(0);
  setCoinsEarned(0);
  }

  const progressPct =
    levelQuestions.length === 0
      ? 0
      : ((index + (submitted ? 1 : 0)) / levelQuestions.length) * 100;

  /* ---------- ACTIONS ---------- */

  function submitAnswer() {
    if (submitted || !current) return;

    if (selected === current.correctAnswer) {
      setCorrectCount(c => c + 1);
      setXpEarned(x => x + 10);
      setCoinsEarned(c => c + 5);
    }

    setSubmitted(true);
  }

async function nextQuestion() {
  // 🛑 GUARD: block spam & post-finish
  if (transitioning || finished) return;

  setTransitioning(true); // 🔒 lock

  const hasMore = index + 1 < levelQuestions.length;

  if (hasMore) {
    if (user) {
      await saveResumeState({
        user,
        category,
        difficulty,
        level,
        index: index + 1,
      });
    }

    setIndex(i => i + 1);
    setSelected(null);
    setSubmitted(false);
  } else {
    // ✅ LAST QUESTION
    if (user) {
      await clearResumeState(user);

      // ✅ Complete level ONLY if all answers correct
      if (correctCount === levelQuestions.length) {
        await saveLevelCompletion({
          user,
          category,
          difficulty,
          level: Number(level),
        });

        setXpEarned(50);
        setCoinsEarned(20);
      } else {
        setXpEarned(0);
        setCoinsEarned(0);
      }
    }

    setFinished(true);
  }

  // 🔓 ALWAYS unlock (both paths)
  setTimeout(() => setTransitioning(false), 250);
}

const canSubmit = selected !== null && !submitted;

  return {
    index,
    current,
    submitted,
    finished,
    progressPct,
    correctCount,
    totalQuestions: levelQuestions.length,
    xpEarned,
    coinsEarned,
    setIndex,
    reset, // ✅ ADD THIS
    transitioning,
    questionProps: {
      question: current?.question || current?.text,
      options: (Array.isArray(current?.options) ? current.options : []) || [],
      correctAnswer: current?.correctAnswer ?? "",
      selected,
      submitted,
      onSelect: setSelected,
      index,
      total: levelQuestions.length,
    },
      actionProps: {
        submitted,
        canSubmit,          // ✅ THIS WAS MISSING / WRONG
        onSubmit: submitAnswer,
        onNext: nextQuestion,
        isLast: index + 1 === levelQuestions.length,
      },
  };
}