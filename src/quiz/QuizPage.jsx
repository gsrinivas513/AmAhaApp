import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { useAuth } from "../components/AuthProvider";

import QuizHeader from "./components/QuizHeader";
import QuizProgressTimer from "./components/QuizProgressTimer";
import QuizQuestionCard from "./components/QuizQuestionCard";
import QuizActions from "./components/QuizActions";
import QuizFinish from "./components/QuizFinish";
import LevelCompleteSummary from "./components/LevelCompleteSummary";

import { useQuizQuestions } from "./hooks/useQuizQuestions";
import { useQuizFlow } from "./hooks/useQuizFlow";
import { useQuizTimer } from "./hooks/useQuizTimer";
import { useResumeQuiz } from "./hooks/useResumeQuiz";

export default function QuizPage() {
  const { category, difficulty, level } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  /* 1️⃣ Load questions */
  const { questions, loading } = useQuizQuestions(category, difficulty);

  /* 2️⃣ Quiz flow */
  const flow = useQuizFlow({
    questions,
    user,
    category,
    difficulty,
    level,
  });

  /* 3️⃣ Timer */
  const timer = useQuizTimer(
    !flow.submitted && !flow.finished,
    flow.index
  );

  /* 4️⃣ Resume hook */
  const resume = useResumeQuiz({
    user,
    category,
    difficulty,
    setIndex: flow.setIndex,
  });

  /* 5️⃣ Derived UI flag (AFTER resume exists) */
  const shouldBlockQuiz = resume.banner !== null;

  if (loading) {
    return (
      <SiteLayout>
        <div>Loading quiz…</div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      {/* RESUME BANNER */}
      {resume.banner}

      <QuizHeader
        category={category}
        difficulty={difficulty}
        level={level}
      />

{/* PROGRESS + TIMER (hide when resume banner is active) */}
{!shouldBlockQuiz && !flow.finished && (
  <QuizProgressTimer
    progressPct={flow.progressPct}
    timeMs={timer.timeMs}
    totalMs={timer.totalMs}
    warn={timer.warn}
  />
)}

{/* QUIZ UI (BLOCKED until resume decision) */}
{!shouldBlockQuiz && !flow.finished && flow.current && (
  <>
    <QuizQuestionCard {...flow.questionProps} />
    <QuizActions {...flow.actionProps} />
  </>
)}

{flow.finished && (
  <QuizFinish
    totalQuestions={flow.totalQuestions}
    correctAnswers={flow.correctCount}
    xpEarned={flow.correctCount * 10}     // temporary
    coinsEarned={flow.correctCount * 2}   // temporary
    onBack={() =>
      navigate(`/quiz/${category}/${difficulty}`)
    }
  />
)}
    </SiteLayout>
  );
}