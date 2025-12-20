// src/quiz/CategoryLevelsPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../components/AuthProvider";

import { getHighestCompletedLevel } from "./services/progressService";
import { loadResumeState, clearResumeState } from "./services/resumeService";

import LevelResumeBanner from "./components/LevelResumeBanner";
import LevelCard from "./components/LevelCard";
import { QUESTIONS_PER_LEVEL } from "./constants";

/* =========================
   CONSTANTS
========================= */
const DIFFICULTIES = ["easy", "medium", "hard"];

const DIFFICULTY_COLOR = {
  easy: "#6366f1",
  medium: "#f59e0b",
  hard: "#ef4444",
};

export default function CategoryLevelsPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [difficulty, setDifficulty] = useState("easy");
  const [levels, setLevels] = useState([]);
  const [highestCompleted, setHighestCompleted] = useState(0);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  const levelRefs = useRef({});
  const theme = DIFFICULTY_COLOR[difficulty];

  /* =========================
     USER PROGRESS
  ========================= */
  useEffect(() => {
    let active = true;

    async function loadProgress() {
      if (!user) {
        active && setHighestCompleted(0);
        return;
      }

      const completed = await getHighestCompletedLevel(
        user,
        category,
        difficulty
      );
      active && setHighestCompleted(completed || 0);
    }

    loadProgress();
    return () => (active = false);
  }, [user, category, difficulty]);

  /* =========================
     RESUME
  ========================= */
  useEffect(() => {
    let active = true;

    async function loadResume() {
      if (!user) return;

      const data = await loadResumeState(user);
      if (
        active &&
        data &&
        data.category === category &&
        data.difficulty === difficulty
      ) {
        setResume(data);
      } else if (active) {
        setResume(null);
      }
    }

    loadResume();
    return () => (active = false);
  }, [user, category, difficulty]);

  /* =========================
     LOAD LEVELS
  ========================= */
  useEffect(() => {
    let active = true;

    async function loadLevels() {
      setLoading(true);
      try {
        const q = query(
          collection(db, "questions"),
          where("category", "==", category),
          where("difficulty", "==", difficulty)
        );

        const snap = await getDocs(q);
        const total = Math.max(
          1,
          Math.ceil(snap.size / QUESTIONS_PER_LEVEL)
        );

        active &&
          setLevels(Array.from({ length: total }, (_, i) => i + 1));
      } catch (e) {
        console.error(e);
      } finally {
        active && setLoading(false);
      }
    }

    loadLevels();
    return () => (active = false);
  }, [category, difficulty]);

  /* =========================
     AUTO SCROLL TO NEXT
  ========================= */
  useEffect(() => {
    if (loading) return;

    const target = highestCompleted + 1 || 1;
    const el = levelRefs.current[target];
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 400);
    }
  }, [loading, highestCompleted]);

  /* =========================
     RENDER
  ========================= */
  return (
    <SiteLayout>
      <h2 style={{ marginBottom: 16 }}>
        {category} — Levels
      </h2>

      {/* DIFFICULTY TABS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              border: "none",
              fontWeight: 700,
              background: d === difficulty ? theme : "#f3f4f6",
              color: d === difficulty ? "#fff" : "#374151",
              cursor: "pointer",
            }}
          >
            {d.toUpperCase()}
          </button>
        ))}
      </div>

      {/* RESUME */}
      {resume && (
        <LevelResumeBanner
          level={resume.level}
          onResume={() =>
            navigate(`/quiz/${category}/${difficulty}/${resume.level}`)
          }
          onDiscard={async () => {
            await clearResumeState(user);
            setResume(null);
          }}
        />
      )}

      {/* LEVEL PATH — CANDY CRUSH STYLE */}
      {loading ? (
        <div>Loading levels…</div>
      ) : (
        <div
          key={difficulty}
          style={{
            position: "relative",
            maxWidth: 420,
            margin: "40px auto 100px",
            height: levels.length * 90,
          }}
        >
          {/* CURVED PATH */}
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 400 ${levels.length * 90}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0,
            }}
          >
            <path
              d={levels
                .map((_, i) => {
                  const y = i * 80 + 40;
                  const x = i % 2 === 0 ? 80 : 320;
                  return `${i === 0 ? "M" : "Q"} ${x} ${y} 200 ${y + 40}`;
                })
                .join(" ")}
              fill="none"
              stroke="#e0e7ff"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>

          {/* LEVEL NODES */}
          {levels.map((level, index) => {
            const completed = level <= highestCompleted;
            const next = level === highestCompleted + 1;
            const locked = !user && level > 1;
            const isBoss = level % 5 === 0;

            const left = index % 2 === 0 ? 40 : 260;
            const top = index * 80;

            return (
              <div
                key={level}
                ref={(el) => (levelRefs.current[level] = el)}
                style={{
                  position: "absolute",
                  left,
                  top,
                  zIndex: 2,
                  animation: "levelPop 0.5s ease forwards",
                  animationDelay: `${index * 80}ms`,
                  opacity: 0,
                }}
              >
                <div
                  style={{
                    transform: isBoss ? "scale(1.1)" : "scale(1)",
                    filter: next
                      ? `drop-shadow(0 0 14px ${theme})`
                      : "none",
                    animation: next ? "pulse 1.6s infinite" : "none",
                  }}
                >
                  <LevelCard
                    level={level}
                    badge={isBoss ? "👑" : null}
                    status={
                      locked
                        ? "locked"
                        : completed
                        ? "completed"
                        : next
                        ? "next"
                        : "locked"
                    }
                    disabled={locked}
                    onClick={() =>
                      !locked &&
                      navigate(
                        `/quiz/${category}/${difficulty}/${level}`
                      )
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ANIMATIONS */}
      <style>{`
        @keyframes levelPop {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
      `}</style>
    </SiteLayout>
  );
}