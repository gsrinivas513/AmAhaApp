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
            width: "100%",
            maxWidth: "100%",
            margin: "0 auto",
            padding: "40px 20px",
            background: "linear-gradient(180deg, #a8e6cf 0%, #dcedc8 50%, #fff9c4 100%)",
            minHeight: `${Math.max(levels.length * 160, 600)}px`,
            borderRadius: 0,
          }}
        >
          {/* SVG Path for winding road */}
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 400 ${levels.length * 160}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0,
              pointerEvents: "none",
            }}
            preserveAspectRatio="none"
          >
            {/* Main road path - winding left and right */}
            <defs>
              <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e0f2f1" />
                <stop offset="50%" stopColor="#b2dfdb" />
                <stop offset="100%" stopColor="#e0f2f1" />
              </linearGradient>
            </defs>

            {/* Winding path */}
            <path
              d={(() => {
                let pathData = `M 200 40`;
                for (let i = 0; i < levels.length; i++) {
                  const y = 60 + i * 160;
                  const isLeft = i % 2 === 0;
                  const x = isLeft ? 80 : 320;
                  const nextY = y + 80;
                  const midY = y + 40;

                  if (i === 0) {
                    pathData += ` Q ${x} ${midY} ${x} ${y}`;
                  } else {
                    const prevIsLeft = (i - 1) % 2 === 0;
                    const prevX = prevIsLeft ? 80 : 320;
                    pathData += ` Q ${(prevX + x) / 2} ${midY} ${x} ${y}`;
                  }

                  if (i < levels.length - 1) {
                    pathData += ` L ${x} ${nextY}`;
                  }
                }
                return pathData;
              })()}
              fill="none"
              stroke="url(#roadGradient)"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Road dashed center line */}
            <path
              d={(() => {
                let pathData = `M 200 40`;
                for (let i = 0; i < levels.length; i++) {
                  const y = 60 + i * 160;
                  const isLeft = i % 2 === 0;
                  const x = isLeft ? 80 : 320;
                  const nextY = y + 80;
                  const midY = y + 40;

                  if (i === 0) {
                    pathData += ` Q ${x} ${midY} ${x} ${y}`;
                  } else {
                    const prevIsLeft = (i - 1) % 2 === 0;
                    const prevX = prevIsLeft ? 80 : 320;
                    pathData += ` Q ${(prevX + x) / 2} ${midY} ${x} ${y}`;
                  }

                  if (i < levels.length - 1) {
                    pathData += ` L ${x} ${nextY}`;
                  }
                }
                return pathData;
              })()}
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeDasharray="6 10"
              strokeLinecap="round"
              opacity={0.6}
            />
          </svg>

          {/* LEVEL NODES */}
          <div style={{ position: "relative", zIndex: 2, height: "100%" }}>
            {levels.map((level, index) => {
              const completed = level <= highestCompleted;
              const next = level === highestCompleted + 1;
              const locked = !user && level > 1;
              const isBoss = level % 5 === 0;

              const isLeft = index % 2 === 0;
              const x = isLeft ? 80 : 320;
              const y = 60 + index * 160;

              return (
                <div
                  key={level}
                  ref={(el) => (levelRefs.current[level] = el)}
                  style={{
                    position: "absolute",
                    left: x - 48,
                    top: y - 48,
                    width: 96,
                    height: 96,
                    zIndex: 3,
                    animation: "levelPop 0.5s ease forwards",
                    animationDelay: `${index * 80}ms`,
                    opacity: 0,
                  }}
                >
                  <div
                    style={{
                      transform: isBoss ? "scale(1.1)" : "scale(1)",
                      filter: next ? `drop-shadow(0 8px 24px ${theme}66)` : "none",
                      animation: next ? "pulse 1.6s infinite" : "none",
                      display: "inline-block",
                      width: "100%",
                      height: "100%",
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

          {/* Decorative side elements - motivation badges */}
          <div
            style={{
              position: "absolute",
              left: 10,
              top: "10%",
              fontSize: 42,
              zIndex: 1,
              animation: "float 3s ease-in-out infinite",
            }}
          >
            🏆
          </div>
          <div
            style={{
              position: "absolute",
              right: 12,
              top: "25%",
              fontSize: 48,
              zIndex: 1,
              animation: "bounce 2s ease-in-out infinite",
            }}
          >
            ⭐
          </div>
          <div
            style={{
              position: "absolute",
              left: 15,
              top: "45%",
              fontSize: 40,
              zIndex: 1,
              animation: "spin 4s linear infinite",
            }}
          >
            🪙
          </div>
          <div
            style={{
              position: "absolute",
              right: 10,
              top: "60%",
              fontSize: 44,
              zIndex: 1,
              animation: "float 3.5s ease-in-out infinite",
            }}
          >
            🥇
          </div>
          <div
            style={{
              position: "absolute",
              left: 12,
              bottom: "15%",
              fontSize: 46,
              zIndex: 1,
              animation: "bounce 2.5s ease-in-out infinite",
            }}
          >
            🎖️
          </div>

          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
            @keyframes bounce {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-15px); }
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
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