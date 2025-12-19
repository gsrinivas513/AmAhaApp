// src/quiz/CategoryLevelsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../components/AuthProvider";

import { getHighestCompletedLevel } from "./services/progressService";
import { isLevelUnlocked } from "./services/levelUnlockService";
import { loadResumeState, clearResumeState } from "./services/resumeService";

import LockedLevelCard from "./components/LockedLevelCard";
import LevelResumeBanner from "./components/LevelResumeBanner";
import LevelCard from "./components/LevelCard";


import { QUESTIONS_PER_LEVEL } from "./constants";

export default function CategoryLevelsPage() {
  
  const { category, difficulty } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [levels, setLevels] = useState([]);
  const [highestCompleted, setHighestCompleted] = useState(0);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD USER PROGRESS ---------------- */
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

  /* ---------------- LOAD RESUME ---------------- */
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

  /* ---------------- LOAD LEVELS ---------------- */
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

        const list = [];

        for (let i = 1; i <= totalLevels; i++) {
          list.push({
            level: i,
            unlocked: isLevelUnlocked({
              user,
              level: i,
              highestCompleted,
            }),
          });
        }

        setLevels(list);
      } catch (err) {
        console.error("Failed to load levels", err);
        setLevels([]);
      } finally {
        setLoading(false);
      }
    }

    loadLevels();
  }, [category, difficulty, user, highestCompleted]);

   useEffect(() => {
  const map = {
    basic: "easy",
    intermediate: "medium",
    advanced: "hard",
  };

  if (map[difficulty]) {
    navigate(`/quiz/${category}/${map[difficulty]}`, {
      replace: true,
    });
  }
}, [difficulty, category, navigate]);

  return (
    <SiteLayout>
      <div>
        {/* PAGE TITLE */}
        <h2 style={{ marginBottom: 8 }}>
          Select Level — {category} / {difficulty}
        </h2>

        {/* ---------- RESUME BANNER ---------- */}
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

        {/* ---------- GUEST INFO ---------- */}
        {!user && (
          <div
            style={{
              background: "#fff3cd",
              border: "1px solid #ffeeba",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              color: "#856404",
            }}
          >
            🔒 Guest users can play <b>Level 1 only</b>.
            <br />
            Sign in to unlock more levels and save progress.
          </div>
        )}

        {/* ---------- LOADING ---------- */}
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
            {levels.map((lvl) => {
              let status = "locked";

              if (lvl.level <= highestCompleted) {
                status = "completed";
              } else if (lvl.level === highestCompleted + 1) {
                status = "next";
              }

              return (
                <LevelCard
                  key={lvl.level}
                  level={lvl.level}
                  status={status}
                  onClick={() =>
                    navigate(
                      `/quiz/${category}/${difficulty}/${lvl.level}`
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