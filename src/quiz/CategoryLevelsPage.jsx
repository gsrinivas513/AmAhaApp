// src/quiz/CategoryLevelsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../components/AuthProvider";

import { getHighestCompletedLevel } from "./services/progressService";
import { loadResumeState, clearResumeState } from "./services/resumeService";

import LevelResumeBanner from "./components/LevelResumeBanner";
import LevelCard from "./components/LevelCard";
import LoginGate from "../auth/LoginGate";
import AdCard from "../ads/AdCard";

import { QUESTIONS_PER_LEVEL } from "./constants";

export default function CategoryLevelsPage() {
  const { category, difficulty } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [levels, setLevels] = useState([]);
  const [highestCompleted, setHighestCompleted] = useState(0);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  /* --------------------------------------------------
   * Normalize legacy difficulty URLs
   * -------------------------------------------------- */
  useEffect(() => {
    const map = {
      basic: "easy",
      intermediate: "medium",
      advanced: "hard",
    };

    if (map[difficulty]) {
      navigate(`/quiz/${category}/${map[difficulty]}`, { replace: true });
    }
  }, [difficulty, category, navigate]);

  /* --------------------------------------------------
   * Load user progress
   * -------------------------------------------------- */
  useEffect(() => {
    async function loadProgress() {
      if (!user) {
        setHighestCompleted(0);
        return;
      }

      const completed = await getHighestCompletedLevel(
        user,
        category,
        difficulty
      );

      setHighestCompleted(completed || 0);
    }

    loadProgress();
  }, [user, category, difficulty]);

  /* --------------------------------------------------
   * Load resume state
   * -------------------------------------------------- */
  useEffect(() => {
    async function loadResume() {
      if (!user) return;

      const data = await loadResumeState(user);

      if (
        data &&
        data.category === category &&
        data.difficulty === difficulty &&
        typeof data.level === "number"
      ) {
        setResume(data);
      } else {
        setResume(null);
      }
    }

    loadResume();
  }, [user, category, difficulty]);

  /* --------------------------------------------------
   * Load levels (based on question count)
   * -------------------------------------------------- */
  useEffect(() => {
    async function loadLevels() {
      setLoading(true);

      try {
        const q = query(
          collection(db, "questions"),
          where("category", "==", category),
          where("difficulty", "==", difficulty)
        );

        const snap = await getDocs(q);
        const totalQuestions = snap.size;

        const totalLevels = Math.max(
          1,
          Math.ceil(totalQuestions / QUESTIONS_PER_LEVEL)
        );

        // ✅ LEVELS ARE NUMBERS ONLY (IMPORTANT)
        setLevels(
          Array.from({ length: totalLevels }, (_, i) => i + 1)
        );
      } catch (err) {
        console.error("Failed to load levels", err);
        setLevels([]);
      } finally {
        setLoading(false);
      }
    }

    loadLevels();
  }, [category, difficulty]);

  /* --------------------------------------------------
   * Render
   * -------------------------------------------------- */
  return (
    <SiteLayout>
      <div>
        {/* PAGE TITLE */}
        <h2 style={{ marginBottom: 8 }}>
          Select Level — {category} / {difficulty}
        </h2>

        {/* RESUME BANNER */}
        {resume && (
          <LevelResumeBanner
            level={resume.level}
            onResume={() =>
              navigate(
                `/quiz/${resume.category}/${resume.difficulty}/${resume.level}`,
                { state: { autoResume: true } }
              )
            }
            onDiscard={async () => {
              await clearResumeState(user);
              setResume(null);
            }}
          />
        )}

        {/* 💰 AD — HIGH CTR, LOW ANNOYANCE */}
        {!loading && levels.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <AdCard slot="levels_page" />
          </div>
        )}

        {/* LOADING */}
        {loading && <div>Loading levels…</div>}

        {/* LEVEL GRID */}
        {!loading && (
          <div
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 20,
            }}
          >
            {levels.map((level) => {
              const isCompleted = level <= highestCompleted;
              const isNext = level === highestCompleted + 1;
              const lockedForGuest = !user && level > 1;

              // 🔐 LOGIN WALL FOR GUESTS (LEVEL 2+)
              if (lockedForGuest) {
                return (
                  <LoginGate
                    key={level}
                    title={`Unlock Level ${level}`}
                    message="Sign in to unlock more levels, save progress, and earn rewards."
                  />
                );
              }

              return (
                <LevelCard
                  key={level}
                  level={level}
                  status={
                    isCompleted
                      ? "completed"
                      : isNext
                      ? "next"
                      : "locked"
                  }
                  onClick={() =>
                    navigate(
                      `/quiz/${category}/${difficulty}/${level}`
                    )
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}