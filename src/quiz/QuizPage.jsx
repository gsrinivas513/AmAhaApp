import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { useAuth } from "../components/AuthProvider";

import QuizHeader from "./components/QuizHeader";
import QuizProgressTimer from "./components/QuizProgressTimer";
import QuizQuestionCard from "./components/QuizQuestionCard";
import QuizActions from "./components/QuizActions";
import QuizFinish from "./components/QuizFinish";

import { useQuizQuestions } from "./hooks/useQuizQuestions";
import { useQuizTimer } from "./hooks/useQuizTimer";
import { useQuizFlow } from "./hooks/useQuizFlow";
import { useResumeQuiz } from "./hooks/useResumeQuiz";

export default function QuizPage() {
  const { category, difficulty, level } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  /* ---------------- LOAD QUESTIONS ---------------- */
  const { questions, loading } = useQuizQuestions(category, difficulty);

  /* ---------------- QUIZ FLOW (STATE ONLY) ---------------- */
  const flow = useQuizFlow({
    questions,
    user,
    category,
    difficulty,
    level,
  });

  /* ---------------- TIMER ---------------- */
  const timer = useQuizTimer(
    !flow.submitted && !flow.finished,
    flow.index
  );

  /* ---------------- RESUME ---------------- */
  const resume = useResumeQuiz({
    user,
    category,
    difficulty,
    setIndex: flow.setIndex,
  });

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
        <QuizFinish
          onBack={() =>
            navigate(`/quiz/${category}/${difficulty}`)
          }
        />
      )}
    </SiteLayout>
  );
}