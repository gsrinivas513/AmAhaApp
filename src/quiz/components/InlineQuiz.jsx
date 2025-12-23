// src/quiz/components/InlineQuiz.jsx
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

import {
  getHighestCompletedLevel,
  markLevelCompleted,
} from "../services/progressService";

import QuizProgressTimer from "./QuizProgressTimer";
import QuizQuestionCard from "./QuizQuestionCard";
import QuizFinish from "./QuizFinish";
import QuizActions from "../ui/QuizActions";

import { useQuizQuestions } from "../hooks/useQuizQuestions";
import { useQuizFlow } from "../hooks/useQuizFlow";
import { useQuizTimer } from "../hooks/useQuizTimer";
import { useResumeQuiz } from "../hooks/useResumeQuiz";
import { useSoundFX } from "../hooks/useSoundFX";

import ConfettiBurst from "../ui/ConfettiBurst";
import { useCelebration } from "../hooks/useCelebration";
import { trackEvent } from "../../analytics/trackEvent";

import RewardToast from "../ui/RewardToast";
import { useRewardToast } from "../ui/useRewardToast";

export default function InlineQuiz({ 
  categoryName, 
  topicName, 
  subtopicName, 
  difficulty, 
  level,
  onClose,
  onComplete
}) {
  const currentLevel = Number(level);
  const { user } = useAuth();

  // We need the subcategory ID for tracking progress
  const [categoryId, setCategoryId] = useState(null);
  
  useEffect(() => {
    async function loadCategoryId() {
      if (!subtopicName) return;
      
      const decodedSubtopicName = decodeURIComponent(subtopicName);
      const subcatQuery = query(
        collection(db, "subtopics"),
        where("name", "==", decodedSubtopicName)
      );
      const subcatSnap = await getDocs(subcatQuery);
      
      if (!subcatSnap.empty) {
        setCategoryId(subcatSnap.docs[0].id);
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

  /* Analytics — quiz start */
  useEffect(() => {
    if (!categoryId) return;
    
    trackEvent("quiz_start", {
      userId: user?.uid || "guest",
      category: categoryId,
      difficulty,
      level: currentLevel,
    });
  }, [categoryId, difficulty, currentLevel, user]);

  /* Load questions */
  const { questions, loading } = useQuizQuestions(
    subtopicName,
    difficulty
  );

  console.log("🎮 InlineQuiz state:", { 
    subtopicName, 
    difficulty, 
    level: currentLevel, 
    questionsCount: questions?.length, 
    loading,
    categoryId 
  });

  /* Quiz flow */
  const flow = useQuizFlow({
    questions: questions || [],
    user,
    category: categoryId,
    difficulty,
    level: currentLevel,
  });
  
  const timer = useQuizTimer(flow, (questions || []).length);

  /* Resume from saved state */
  useResumeQuiz({
    user,
    category: categoryId,
    difficulty,
    level: currentLevel,
    flow,
  });

  /* Celebration */
  const celebrate = useCelebration(
    flow.finished &&
      flow.correctCount === flow.totalQuestions &&
      flow.totalQuestions > 0
  );

  /* Completion logic */
  useEffect(() => {
    if (!flow.finished || completionTracked.current || !categoryId) return;

    const handleCompletion = async () => {
      const passed = flow.correctCount === flow.totalQuestions;

      trackEvent("quiz_complete", {
        userId: user?.uid || "guest",
        category: categoryId,
        difficulty,
        level: currentLevel,
        passed,
      });

      if (passed) {
        // Mark as completed first
        console.log("💾 Marking level as completed:", { user: user?.uid, categoryId, difficulty, level: currentLevel });
        await markLevelCompleted(user, categoryId, difficulty, currentLevel);
        console.log("✅ Level marked as completed");
        
        // Show rewards in quiz
        showReward({
          xp: flow.xpEarned,
          coins: flow.coinsEarned,
        });
        
        // Auto-close after 1 second and trigger celebration
        setTimeout(() => {
          console.log("🎊 Calling onComplete callback");
          if (onComplete) {
            onComplete(passed, currentLevel + 1, flow.xpEarned, flow.coinsEarned);
          } else {
            console.warn("⚠️ onComplete callback is not defined!");
          }
        }, 1000);
      }

      completionTracked.current = true;
    };

    handleCompletion();
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
    onComplete,
  ]);

  /* Current question */
  const currentQ = flow.current;
  
  console.log("📝 Current question:", { 
    currentQ, 
    index: flow.index,
    totalQuestions: flow.totalQuestions,
    finished: flow.finished 
  });

  if (loading) {
    return (
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          padding: 40,
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        Loading quiz...
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          padding: 40,
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ marginBottom: 20 }}>No questions available for this level.</p>
        <button
          onClick={onClose}
          style={{
            padding: "12px 24px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Back to Levels
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: "24px 32px 32px 32px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        position: "relative",
        minHeight: "600px",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #e5e7eb",
      }}
    >
      {/* Back to levels button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          background: "transparent",
          border: "none",
          fontSize: 14,
          cursor: "pointer",
          color: "#3b82f6",
          padding: "8px 12px",
          borderRadius: 8,
          transition: "all 0.2s",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#eff6ff";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "transparent";
        }}
      >
        ← Back to Levels
      </button>

      {/* Quiz header info */}
      <div style={{ marginBottom: 32, marginTop: 20, textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#1f2937", marginBottom: 8 }}>
          Level {currentLevel} (
          {difficulty === "easy" && "🟢 "}
          {difficulty === "medium" && "🟡 "}
          {difficulty === "hard" && "🔴 "}
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})
        </h2>
      </div>

      {/* Quiz content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {!flow.finished ? (
          <>
            <QuizProgressTimer
              progressPct={flow.progressPct}
              timeMs={timer.timeMs}
              totalMs={timer.totalMs}
              warn={timer.warn}
            />

            {flow.current && (
              <>
                <QuizQuestionCard {...flow.questionProps} />
                <QuizActions {...flow.actionProps} />
              </>
            )}
          </>
        ) : flow.correctCount === flow.totalQuestions ? (
          /* Passed - show simple success message, celebration happens on main page */
          <div style={{ 
            textAlign: "center", 
            padding: "60px 20px",
            animation: "fadeIn 0.5s ease-in-out"
          }}>
            <div style={{ fontSize: 80, marginBottom: 20 }}>🎉</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#047857", marginBottom: 12 }}>
              Perfect!
            </h2>
            <p style={{ fontSize: 18, color: "#6b7280", marginBottom: 20 }}>
              {flow.correctCount} out of {flow.totalQuestions} correct
            </p>
            <div style={{ 
              display: "inline-block",
              padding: "8px 16px",
              background: "#dcfce7",
              borderRadius: 12,
              color: "#166534",
              fontSize: 14,
              fontWeight: 600,
            }}>
              Loading celebration...
            </div>
          </div>
        ) : (
          /* Failed - show retry options */
          <QuizFinish
            correctCount={flow.correctCount}
            totalQuestions={flow.totalQuestions}
            xpEarned={flow.xpEarned}
            coinsEarned={flow.coinsEarned}
            level={currentLevel}
            difficulty={difficulty}
            onRetry={flow.reset}
            onBack={onClose}
          />
        )}
      </div>

      {/* Confetti */}
      {celebrate.showConfetti && <ConfettiBurst />}

      {/* Reward toast */}
      {reward && <RewardToast xp={reward.xp} coins={reward.coins} />}
    </div>
  );
}
