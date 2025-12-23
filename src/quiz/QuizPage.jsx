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
  const { categoryName, topicName, subtopicName, difficulty, level } = useParams();
  const currentLevel = Number(level);
  
  console.log("🎮 QuizPage params:", { categoryName, topicName, subtopicName, difficulty, level, currentLevel });

  const navigate = useNavigate();
  const { user } = useAuth();

  // We need the subcategory ID for tracking progress, so we'll load it
  const [categoryId, setCategoryId] = useState(null);
  
  useEffect(() => {
    async function loadCategoryId() {
      if (!subtopicName) {
        console.log("⚠️ No subtopicName provided");
        return;
      }
      
      const { collection, getDocs, query, where } = await import("firebase/firestore");
      const { db } = await import("../firebase/firebaseConfig");
      
      const decodedSubtopicName = decodeURIComponent(subtopicName);
      console.log("🔍 Loading categoryId for subtopic:", decodedSubtopicName);
      
      const subcatQuery = query(
        collection(db, "subtopics"),
        where("name", "==", decodedSubtopicName)
      );
      const subcatSnap = await getDocs(subcatQuery);
      
      console.log("📦 Subcategory query results:", subcatSnap.size);
      
      if (!subcatSnap.empty) {
        const id = subcatSnap.docs[0].id;
        console.log("✅ Found categoryId:", id);
        setCategoryId(id);
      } else {
        console.log("❌ No subcategory found with name:", decodedSubtopicName);
      }
    }
    
    loadCategoryId();
  }, [subtopicName]);

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
    if (!categoryId) return;
    
    trackEvent("quiz_start", {
      userId: user?.uid || "guest",
      category: categoryId,
      difficulty,
      level: currentLevel,
    });
  }, [categoryId, difficulty, currentLevel, user]);

  /* --------------------------------------------------
   * Load questions
   * -------------------------------------------------- */
  console.log("📚 useQuizQuestions called with:", { subtopicName, difficulty });
  const { questions, loading } = useQuizQuestions(subtopicName, difficulty);
  console.log("📚 useQuizQuestions result:", { questionsCount: questions.length, loading });

  /* --------------------------------------------------
   * Resume
   * -------------------------------------------------- */
  const resume = useResumeQuiz({
    user,
    category: categoryId,
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
    category: categoryId,
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
      if (!categoryId) return;
      
      console.log("🔐 Level access guard check:", { user: !!user, currentLevel, categoryId });
      
      // Guest: allow level 1 & 2 only
      if (!user) {
        if (currentLevel > 2) {
          console.log("⛔ Guest trying to access level", currentLevel, "- redirecting");
          navigate(`/quiz/${categoryName}/${topicName}/${subtopicName}/${difficulty}`, { replace: true });
        }
        return;
      }

      const highest = await getHighestCompletedLevel(
        user,
        categoryId,
        difficulty
      );

      console.log("📊 Highest completed level:", highest, "- Current level:", currentLevel);

      if (cancelled) return;

      if (currentLevel > highest + 1) {
        console.log("⛔ User trying to access level", currentLevel, "but highest is", highest, "- redirecting");
        navigate(`/quiz/${categoryName}/${topicName}/${subtopicName}/${difficulty}`, { replace: true });
      }
    }

    guard();
    return () => {
      cancelled = true;
    };
  }, [user, currentLevel, categoryId, difficulty, navigate, categoryName, topicName, subtopicName]);

  /* --------------------------------------------------
   * Hard guard — no questions
   * -------------------------------------------------- */
  useEffect(() => {
    // Don't redirect until we've had a chance to load questions
    // categoryId being null means we're still loading the subcategory
    if (!loading && questions.length === 0 && categoryId !== null) {
      console.log("⛔ No questions found - redirecting");
      navigate(`/quiz/${categoryName}/${topicName}/${subtopicName}/${difficulty}`, { replace: true });
    } else if (!loading && questions.length === 0 && categoryId === null) {
      console.log("⚠️ No questions yet, but categoryId still loading...");
    } else if (!loading && questions.length > 0) {
      console.log("✅ Questions loaded successfully:", questions.length);
    }
  }, [loading, questions.length, categoryId, categoryName, topicName, subtopicName, difficulty, navigate]);

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
    if (!flow.finished || completionTracked.current || !categoryId) return;

    const passed = flow.correctCount === flow.totalQuestions;

    // 📊 Analytics
    trackEvent("quiz_complete", {
      userId: user?.uid || "guest",
      category: categoryId,
      difficulty,
      level: currentLevel,
      passed,
    });

    // ✅ Save progress (guest OR user)
    if (passed) {
      markLevelCompleted(
        user,
        categoryId,
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
    categoryId,
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

      {/* Main Quiz Container - Clean white background */}
      <div
        style={{
          background: "#ffffff",
          minHeight: "100vh",
          padding: "12px 12px 32px 12px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", flex: 1, width: "100%", display: "flex", flexDirection: "column" }}>
          <QuizHeader
            category={subtopicName}
            difficulty={difficulty}
            level={currentLevel}
            categoryName={categoryName}
            topicName={topicName}
            soundOn={soundOn}
            onToggleSound={() => setSoundOn((s) => !s)}
            onNavigate={(target) => {
              switch(target) {
                case 'home':
                  navigate('/');
                  break;
                case 'category':
                  navigate(`/quiz/${categoryName}`);
                  break;
                case 'topic':
                  navigate(`/quiz/${categoryName}/${topicName}`);
                  break;
                case 'levels':
                  navigate(`/quiz/${categoryName}/${topicName}/${subtopicName}/${difficulty}`);
                  break;
              }
            }}
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
                navigate(`/quiz/${categoryName}/${topicName}/${subtopicName}/${difficulty}/${currentLevel + 1}`)
              }
              onRetry={flow.reset}
              onBack={() =>
                navigate(`/quiz/${categoryName}/${topicName}/${subtopicName}/${difficulty}`)
              }
            />
          )}
        </div>
      </div>
    </SiteLayout>
  );
}