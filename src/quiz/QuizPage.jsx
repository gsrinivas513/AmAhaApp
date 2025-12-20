// src/quiz/QuizPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { useAuth } from "../components/AuthProvider";

import QuizHeader from "./components/QuizHeader";
import QuizProgressTimer from "./components/QuizProgressTimer";
import QuizQuestionCard from "./components/QuizQuestionCard";
import QuizFinish from "./components/QuizFinish";
import QuizActions from "./ui/QuizActions";

import { useQuizQuestions } from "./hooks/useQuizQuestions";
import { useQuizFlow } from "./hooks/useQuizFlow";
import { useQuizTimer } from "./hooks/useQuizTimer";
import { useResumeQuiz } from "./hooks/useResumeQuiz";
import { useSoundFX } from "./hooks/useSoundFX";
import { getHighestCompletedLevel } from "./services/progressService";

import ConfettiBurst from "./ui/ConfettiBurst";
import { useCelebration } from "./hooks/useCelebration";
import { trackEvent } from "../analytics/trackEvent";

export default function QuizPage() {
  const { category, difficulty, level } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  /* 🔊 Sound */
  const [soundOn, setSoundOn] = useState(true);
  const sound = useSoundFX(soundOn);

  /* 🧠 Prevent duplicate analytics */
  const completionTracked = useRef(false);

  /* --------------------------------------------------
   * 🔍 Analytics — quiz start (FIXED)
   * -------------------------------------------------- */
  useEffect(() => {
    trackEvent("quiz_start", {
      userId: user?.uid || "guest",
      category,
      difficulty,
      level: Number(level),
    });
  }, [category, difficulty, level, user]);

  /* --------------------------------------------------
   * Normalize legacy difficulty URLs
   * -------------------------------------------------- */
  useEffect(() => {
    if (difficulty === "basic")
      navigate(`/quiz/${category}/easy`, { replace: true });
    if (difficulty === "intermediate")
      navigate(`/quiz/${category}/medium`, { replace: true });
    if (difficulty === "advanced")
      navigate(`/quiz/${category}/hard`, { replace: true });
  }, [difficulty, category, navigate]);

  /* --------------------------------------------------
   * Load questions
   * -------------------------------------------------- */
  const { questions, loading } = useQuizQuestions(category, difficulty);

  /* --------------------------------------------------
   * Resume
   * -------------------------------------------------- */
  const resume = useResumeQuiz({ user, category, difficulty, level });
  const initialIndex = resume.resumeData?.index ?? 0;

  /* --------------------------------------------------
   * Quiz flow
   * -------------------------------------------------- */
  const flow = useQuizFlow({
    questions,
    user,
    category,
    difficulty,
    level,
    initialIndex,
    sound,
  });

  const isQuizPaused = resume.isPaused;
  const isQuizActive = !flow.finished && !isQuizPaused;

  /* --------------------------------------------------
   * Timer
   * -------------------------------------------------- */
  const timer = useQuizTimer(
    isQuizActive && !flow.submitted,
    flow.index
  );

  /* --------------------------------------------------
   * Level access guard
   * -------------------------------------------------- */
  useEffect(() => {
    async function guard() {
      if (!user) {
        if (Number(level) !== 1) {
          navigate(`/quiz/${category}/${difficulty}`, { replace: true });
        }
        return;
      }

      const highest = await getHighestCompletedLevel(
        user,
        category,
        difficulty
      );

      if (Number(level) > highest + 1) {
        navigate(`/quiz/${category}/${difficulty}`, { replace: true });
      }
    }
    guard();
  }, [user, level, category, difficulty, navigate]);

  /* --------------------------------------------------
   * Hard guard — no questions
   * -------------------------------------------------- */
  useEffect(() => {
    if (!loading && questions.length === 0) {
      navigate(`/quiz/${category}/${difficulty}`, { replace: true });
    }
  }, [loading, questions.length, category, difficulty, navigate]);

  /* --------------------------------------------------
   * 🎉 Celebration
   * -------------------------------------------------- */
  const celebrate = useCelebration(
    flow.finished &&
      flow.correctCount === flow.totalQuestions &&
      flow.totalQuestions > 0
  );

  /* --------------------------------------------------
   * 📊 Analytics — quiz completion (NEW)
   * -------------------------------------------------- */
  useEffect(() => {
    if (!flow.finished || completionTracked.current) return;

    const passed = flow.correctCount === flow.totalQuestions;

    trackEvent("quiz_complete", {
      userId: user?.uid || "guest",
      category,
      difficulty,
      level: Number(level),
      passed,
    });

    trackEvent(passed ? "level_pass" : "level_fail", {
      userId: user?.uid || "guest",
      category,
      difficulty,
      level: Number(level),
      correct: flow.correctCount,
      total: flow.totalQuestions,
    });

    completionTracked.current = true;
  }, [flow.finished]);

  /* --------------------------------------------------
   * Loading
   * -------------------------------------------------- */
  if (loading) {
    return (
      <SiteLayout>
        <div>Loading quiz…</div>
      </SiteLayout>
    );
  }

  /* --------------------------------------------------
   * Render
   * -------------------------------------------------- */
  return (
    <SiteLayout>
      {/* 🎉 CONFETTI */}
      {celebrate && <ConfettiBurst />}

      {/* 🔊 SOUND */}
      <audio ref={sound.bind.correct} src="/sounds/correct.mp3" />
      <audio ref={sound.bind.wrong} src="/sounds/wrong.mp3" />
      <audio ref={sound.bind.success} src="/sounds/success.mp3" />

      {/* 🔁 Resume */}
      {resume.banner}

      <QuizHeader
        category={category}
        difficulty={difficulty}
        level={level}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn(s => !s)}
      />

      {/* ⏱️ Timer */}
      {!isQuizPaused && !flow.finished && (
        <QuizProgressTimer
          progressPct={flow.progressPct}
          timeMs={timer.timeMs}
          totalMs={timer.totalMs}
          warn={timer.warn}
        />
      )}

      {/* ❓ Quiz */}
      {!isQuizPaused && !flow.finished && flow.current && (
        <>
          <QuizQuestionCard {...flow.questionProps} />
          <QuizActions {...flow.actionProps} />
        </>
      )}

      {/* 🎉 Finish */}
      {flow.finished && (
        <QuizFinish
          correctCount={flow.correctCount}
          totalQuestions={flow.totalQuestions}
          xpEarned={flow.xpEarned}
          coinsEarned={flow.coinsEarned}
          onNextLevel={() =>
            navigate(`/quiz/${category}/${difficulty}/${Number(level) + 1}`)
          }
          onRetry={flow.reset}
          onBack={() => navigate(`/quiz/${category}/${difficulty}`)}
        />
      )}
    </SiteLayout>
  );
}