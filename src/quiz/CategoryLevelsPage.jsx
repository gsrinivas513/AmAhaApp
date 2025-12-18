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
import LockedLevelCard from "./components/LockedLevelCard";
import ResumeBanner from "./components/ResumeBanner";
import { loadResumeState, clearResumeState } from "./services/resumeService";

const QUESTIONS_PER_LEVEL = 5;

export default function CategoryLevelsPage() {
  const { category, difficulty } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resume, setResume] = useState(null);

  const [levels, setLevels] = useState([]);
  const [highestCompleted, setHighestCompleted] = useState(0);
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
      setHighestCompleted(completed);
    }

    loadProgress();
  }, [user, category, difficulty]);

    useEffect(() => {
    async function loadResume() {
      if (!user) return;

      const data = await loadResumeState(user);
      if (data) setResume(data);
    }

    loadResume();
  }, [user]);

  /* ---------------- LOAD LEVELS ---------------- */
  useEffect(() => {
    async function loadLevels() {
      setLoading(true);
      try {
        const q = query(
          collection(db, "questions"),
          where("category", "==", category),
          where("level", "==", difficulty)
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

  return (
  <SiteLayout>
    <div>

      {/* PAGE TITLE */}
      <h2 style={{ marginBottom: 8 }}>
        Select Level — {category} / {difficulty}
      </h2>

      {/* 🔁 RESUME BANNER (NEW) */}
      {resume && (
        <ResumeBanner
          resume={resume}
          onResume={() =>
            navigate(
              `/quiz/${resume.category}/${resume.difficulty}/${resume.level}`
            )
          }
          onDiscard={async () => {
            await clearResumeState(user);
            setResume(null);
          }}
        />
      )}

      {/* GUEST INFO BANNER */}
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

      {/* LOADING */}
      {loading && <div>Loading levels…</div>}

      {/* LEVEL GRID */}
      {!loading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16,
            marginTop: 20,
          }}
        >
          {levels.map((lvl) => {
            const isCompleted = lvl.level <= highestCompleted;
            const isNext =
              lvl.level === highestCompleted + 1 &&
              !isCompleted;

              return (

            <div
              key={lvl.level}
              style={{
                padding: 16,
                borderRadius: 12,
                background: isCompleted
                  ? "#e8ffed"
                  : isNext
                  ? "#eef4ff"
                  : "#f2f2f2",
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                opacity: 1,
                textAlign: "center",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: lvl.unlocked ? "pointer" : "default",
              }}
              onMouseEnter={(e) => {
                if (lvl.unlocked) {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 32px rgba(0,0,0,0.12)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(0,0,0,0.06)";
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700 }}>
                Level {lvl.level}
              </div>

              {isCompleted && (
                <div style={{ marginTop: 6, color: "#4caf50", fontWeight: 600 }}>
                  ✓ Completed
                </div>
              )}

              {!isCompleted && isNext && (
                <div style={{ marginTop: 6, color: "#ff9800", fontWeight: 600 }}>
                  ⭐ Next Level
                </div>
              )}

              {lvl.unlocked ? (
                <button
                  onClick={() =>
                    navigate(`/quiz/${category}/${difficulty}/${lvl.level}`)
                  }
                  style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    background: isCompleted
                      ? "#4caf50"
                      : isNext
                      ? "#6C63FF"
                      : "#9e9e9e",
                    color: "#fff",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                    fontWeight: 700,
                  }}
                >
                  {isCompleted
                    ? "Replay"
                    : isNext
                    ? "Start Next"
                    : "Locked"}
                </button>
              ) : (
                <LockedLevelCard
                  reason={
                    !user
                      ? "Sign in to unlock more levels"
                      : "Complete previous level to unlock"
                  }
                />
              )}
            </div>
              );
           })}
        </div>
      )}
    </div>
  </SiteLayout>
);
}