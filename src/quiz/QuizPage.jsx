// src/quiz/QuizPage.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { useAuth } from "../components/AuthProvider";

import QuizHeader from "./components/QuizHeader";
import QuizProgressTimer from "./components/QuizProgressTimer";
import QuizQuestionCard from "./components/QuizQuestionCard";
import QuizActions from "./components/QuizActions";
import QuizFinish from "./components/QuizFinish";

import { useQuizQuestions } from "./hooks/useQuizQuestions";
import { useQuizFlow } from "./hooks/useQuizFlow";
import { useQuizTimer } from "./hooks/useQuizTimer";
import { useResumeQuiz } from "./hooks/useResumeQuiz";
import { getHighestCompletedLevel } from "./services/progressService";

export default function QuizPage() {
  const { category, difficulty, level } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  /* --------------------------------------------------
   * 1️⃣ Normalize legacy difficulty URLs
   * -------------------------------------------------- */
  useEffect(() => {
    if (difficulty === "basic") {
      navigate(`/quiz/${category}/easy`, { replace: true });
    }
    if (difficulty === "intermediate") {
      navigate(`/quiz/${category}/medium`, { replace: true });
    }
    if (difficulty === "advanced") {
      navigate(`/quiz/${category}/hard`, { replace: true });
    }
  }, [difficulty, category, navigate]);

  /* --------------------------------------------------
   * 2️⃣ Load ALL questions for category + difficulty
   * -------------------------------------------------- */
  const { questions, loading } = useQuizQuestions(category, difficulty);

  /* --------------------------------------------------
   * 3️⃣ Resume hook
   * -------------------------------------------------- */
  const resume = useResumeQuiz({
    user,
    category,
    difficulty,
    level,
  });

  /* --------------------------------------------------
   * 4️⃣ Initial index (resume or fresh)
   * -------------------------------------------------- */
  const initialIndex = resume.resumeData?.index ?? 0;

  /* --------------------------------------------------
   * 5️⃣ Quiz flow (handles level slicing internally)
   * -------------------------------------------------- */
  const flow = useQuizFlow({
    questions,
    user,
    category,
    difficulty,
    level,
    initialIndex,
  });

  const isQuizPaused = resume.isPaused;
  const isQuizActive = !flow.finished && !isQuizPaused;

  /* --------------------------------------------------
   * 6️⃣ Timer
   * -------------------------------------------------- */
  const timer = useQuizTimer(
    isQuizActive && !flow.submitted,
    flow.index
  );

  /* --------------------------------------------------
   * 7️⃣ Level access guard (CORRECT)
   * -------------------------------------------------- */
  useEffect(() => {
    async function guardLevelAccess() {
      if (!user) {
        if (Number(level) !== 1) {
          navigate(`/quiz/${category}/${difficulty}`, { replace: true });
        }
        return;
      }

      const highestCompleted = await getHighestCompletedLevel(
        user,
        category,
        difficulty
      );

      if (Number(level) > highestCompleted + 1) {
        navigate(`/quiz/${category}/${difficulty}`, { replace: true });
      }
    }

    guardLevelAccess();
  }, [user, level, category, difficulty, navigate]); 

  /* --------------------------------------------------
   * 8️⃣ HARD GUARD — only if NO questions exist at all
   * -------------------------------------------------- */
  useEffect(() => {
    if (loading) return;

    // 🚫 No questions for this difficulty at all
    if (questions.length === 0) {
      console.warn("🚫 No questions found → redirecting");
      navigate(`/quiz/${category}/${difficulty}`, { replace: true });
    }
  }, [loading, questions.length, category, difficulty, navigate]);
 
  /* --------------------------------------------------
   * 9️⃣ Loading state
   * -------------------------------------------------- */
  if (loading) {
    return (
      <SiteLayout>
        <div>Loading quiz…</div>
      </SiteLayout>
    );
  }

  /* --------------------------------------------------
   * 10️⃣ Render
   * -------------------------------------------------- */
  return (
    <SiteLayout>
      {/* 🔁 Resume banner (single confirmation) */}
      {resume.banner}

      <QuizHeader
        category={category}
        difficulty={difficulty}
        level={level}
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

      {/* ❓ Quiz UI */}
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

          /* ▶️ Go to NEXT level (only shown if passed) */
          onNextLevel={() => {
            const nextLevel = Number(level) + 1;
            navigate(
              `/quiz/${category}/${difficulty}/${nextLevel}`
            );
          }}

          /* 🔁 Retry SAME level */
          onRetry={() => {
              // reset quiz locally without navigation
              flow.setIndex(0);
              flow.reset(); // 👈 we will add this
          }}

          /* ⬅️ Back to level selection */
          onBack={() =>
            navigate(`/quiz/${category}/${difficulty}`)
          }
          
        />
      )}
    </SiteLayout>
  );
}