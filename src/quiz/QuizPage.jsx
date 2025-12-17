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

  /* 1️⃣ LOAD QUESTIONS (FIRST) */
  const { questions, loading } = useQuizQuestions(category, difficulty);

  /* 2️⃣ QUIZ FLOW (DEPENDS ON QUESTIONS) */
  const flow = useQuizFlow({
    questions,
    user,
    category,
    difficulty,
    level,
  });

  /* 3️⃣ TIMER (DEPENDS ON FLOW) */
  const timer = useQuizTimer(
    !flow.submitted && !flow.finished,
    flow.index
  );

  /* 4️⃣ RESUME (DEPENDS ON setIndex) */
  const resume = useResumeQuiz({
    user,
    category,
    difficulty,
    setIndex: flow.setIndex,
  });

  /* 5️⃣ LOADING STATE */
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

      {/* HEADER */}
      <QuizHeader
        category={category}
        difficulty={difficulty}
        level={level}
      />

      {/* PROGRESS + TIMER */}
      <QuizProgressTimer
        progressPct={flow.progressPct}
        timeMs={timer.timeMs}
        totalMs={timer.totalMs}
        warn={timer.warn}
      />

      {/* QUESTION + ACTIONS */}
      {!flow.finished && flow.current && (
        <>
          <QuizQuestionCard {...flow.questionProps} />
          <QuizActions {...flow.actionProps} />
        </>
      )}

      {/* FINISH */}

{flow.finished && (
  <LevelCompleteSummary
    level={Number(level)}
xpEarned={flow.xpEarned}
coinsEarned={flow.coinsEarned}
    showNext={true}
    onBack={() =>
      navigate(`/quiz/${category}/${difficulty}`)
    }
    onNext={() =>
      navigate(`/quiz/${category}/${difficulty}/${Number(level) + 1}`)
    }
  />
)}


    </SiteLayout>
  );
}