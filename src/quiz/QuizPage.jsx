import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { useAuth } from "../components/AuthProvider";

import {
  getHighestCompletedLevel,
  markLevelCompleted,
} from "./services/progressService";

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

import ConfettiBurst from "./ui/ConfettiBurst";
import { useCelebration } from "./hooks/useCelebration";
import { trackEvent } from "../analytics/trackEvent";

import RewardToast from "./ui/RewardToast";
import { useRewardToast } from "./ui/useRewardToast";

export default function QuizPage() {
  const { category, difficulty, level } = useParams();
  const currentLevel = Number(level);

  const navigate = useNavigate();
  const { user } = useAuth();

  /* 🔊 Sound */
  const [soundOn, setSoundOn] = useState(true);
  const sound = useSoundFX(soundOn);

  /* 🎁 Reward toast */
  const { reward, showReward } = useRewardToast();

  /* 🧠 Prevent duplicate completion logic */
  const completionTracked = useRef(false);

  /* --------------------------------------------------
   * 📊 Analytics — quiz start
   * -------------------------------------------------- */
  useEffect(() => {
    trackEvent("quiz_start", {
      userId: user?.uid || "guest",
      category,
      difficulty,
      level: currentLevel,
    });
  }, [category, difficulty, currentLevel, user]);

  /* --------------------------------------------------
   * Load questions
   * -------------------------------------------------- */
  const { questions, loading } = useQuizQuestions(category, difficulty);

  /* --------------------------------------------------
   * Resume
   * -------------------------------------------------- */
  const resume = useResumeQuiz({
    user,
    category,
    difficulty,
    level: currentLevel,
  });

  const initialIndex = resume.resumeData?.index ?? 0;

  /* --------------------------------------------------
   * Quiz flow
   * -------------------------------------------------- */
  const flow = useQuizFlow({
    questions,
    user,
    category,
    difficulty,
    level: currentLevel,
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
   * 🔐 Level access guard
   * -------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;

    async function guard() {
      // Guest: allow level 1 & 2 only
      if (!user) {
        if (currentLevel > 2) {
          navigate(`/quiz/${category}/${difficulty}`, { replace: true });
        }
        return;
      }

      const highest = await getHighestCompletedLevel(
        user,
        category,
        difficulty
      );

      if (cancelled) return;

      if (currentLevel > highest + 1) {
        navigate(`/quiz/${category}/${difficulty}`, { replace: true });
      }
    }

    guard();
    return () => {
      cancelled = true;
    };
  }, [user, currentLevel, category, difficulty, navigate]);

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
   * ✅ Completion logic (SAVE + TOAST + ANALYTICS)
   * -------------------------------------------------- */
  useEffect(() => {
    if (!flow.finished || completionTracked.current) return;

    const passed = flow.correctCount === flow.totalQuestions;

    // 📊 Analytics
    trackEvent("quiz_complete", {
      userId: user?.uid || "guest",
      category,
      difficulty,
      level: currentLevel,
      passed,
    });

    // ✅ Save progress (guest OR user)
    if (passed) {
      markLevelCompleted(
        user,
        category,
        difficulty,
        currentLevel
      );

      // 🎁 Show XP & Coins (guest + user)
      showReward({
        xp: flow.xpEarned,
        coins: flow.coinsEarned,
      });
    }

    completionTracked.current = true;
  }, [
    flow.finished,
    flow.correctCount,
    flow.totalQuestions,
    flow.xpEarned,
    flow.coinsEarned,
    user,
    category,
    difficulty,
    currentLevel,
    showReward,
  ]);

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

      {/* 🎁 XP / Coins Toast */}
      {reward && (
        <RewardToast
          xp={reward.xp}
          coins={reward.coins}
        />
      )}

      {/* 🔊 SOUND */}
      <audio ref={sound.bind.correct} src="/sounds/correct.mp3" />
      <audio ref={sound.bind.wrong} src="/sounds/wrong.mp3" />
      <audio ref={sound.bind.success} src="/sounds/success.mp3" />

      {/* 🔁 Resume */}
      {resume.banner}

      {/* Main Quiz Container with Gradient Background */}
      <div
        style={{
          background: "linear-gradient(135deg, #f0f4f8 0%, #e0e7ff 50%, #f0f9ff 100%)",
          minHeight: "100vh",
          padding: "32px 20px",
          borderRadius: 0,
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <QuizHeader
            category={category}
            difficulty={difficulty}
            level={currentLevel}
            soundOn={soundOn}
            onToggleSound={() => setSoundOn((s) => !s)}
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
                navigate(`/quiz/${category}/${difficulty}/${currentLevel + 1}`)
              }
              onRetry={flow.reset}
              onBack={() =>
                navigate(`/quiz/${category}/${difficulty}`)
              }
            />
          )}
        </div>
      </div>
    </SiteLayout>
  );
}