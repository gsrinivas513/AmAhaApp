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
import InlineQuiz from "./components/InlineQuiz";
import ConfettiBurst from "./ui/ConfettiBurst";
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
  const { categoryName, topicName, subtopicName, difficulty: difficultyParam } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [difficulty, setDifficulty] = useState(difficultyParam || "easy");
  const [levels, setLevels] = useState([]);
  const [highestCompleted, setHighestCompleted] = useState(0);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState(null); // Subcategory or Category metadata
  const [parentCategory, setParentCategory] = useState(null); // Parent category if this is a subcategory
  const [topics, setTopics] = useState([]); // All topics in this category
  const [subtopics, setSubtopics] = useState([]); // All subtopics in this topic
  const [showAllTopics, setShowAllTopics] = useState(false); // Toggle for showing all topics
  const [showAllSubtopics, setShowAllSubtopics] = useState(false); // Toggle for showing all subtopics
  const [selectedLevel, setSelectedLevel] = useState(null); // Track which level is selected for inline quiz
  const [celebratingLevel, setCelebratingLevel] = useState(null); // Track which level just completed for celebration
  const [showCelebration, setShowCelebration] = useState(false); // Show celebration overlay
  const [levelCounts, setLevelCounts] = useState({ easy: 0, medium: 0, hard: 0 }); // Level counts per difficulty
  const [fadeIn, setFadeIn] = useState(true); // Fade animation control

  const levelRefs = useRef({});
  const theme = DIFFICULTY_COLOR[difficulty];

  /* =========================
     RESET SELECTED LEVEL WHEN DIFFICULTY CHANGES
  ========================= */
  useEffect(() => {
    setSelectedLevel(null);
    // Smooth fade on difficulty change
    setFadeIn(false);
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, [difficulty]);

  /* =========================
     SMOOTH FADE TRANSITION ON ROUTE CHANGE (NOT DIFFICULTY)
  ========================= */
  useEffect(() => {
    setFadeIn(false);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, [categoryName, topicName, subtopicName]);

  /* =========================
     LOAD CATEGORY/SUBCATEGORY METADATA
  ========================= */
  useEffect(() => {
    let active = true;

    async function loadMetadata() {
      try {
        // Load subcategory by name
        const decodedSubtopicName = decodeURIComponent(subtopicName);
        const subcatByNameQuery = query(
          collection(db, "subtopics"),
          where("name", "==", decodedSubtopicName)
        );
        const subcatByNameSnap = await getDocs(subcatByNameQuery);
        
        if (!subcatByNameSnap.empty) {
          const subcatData = { id: subcatByNameSnap.docs[0].id, ...subcatByNameSnap.docs[0].data() };
          if (active) setCategoryData(subcatData);
          
          // Load parent category by name
          const decodedCategoryName = decodeURIComponent(categoryName);
          const categoryQuery = query(
            collection(db, "categories"),
            where("name", "==", decodedCategoryName)
          );
          const categorySnap = await getDocs(categoryQuery);
          if (!categorySnap.empty && active) {
            setParentCategory({ id: categorySnap.docs[0].id, ...categorySnap.docs[0].data() });
          }
        } else {
          console.warn("Subcategory not found:", decodedSubtopicName);
        }
      } catch (error) {
        console.error("Error loading metadata:", error);
      }
    }

    if (subtopicName && categoryName) {
      loadMetadata();
    }
    return () => (active = false);
  }, [subtopicName, categoryName]);

  /* =========================
     LOAD ALL SUBTOPICS FOR THIS TOPIC
  ========================= */
  useEffect(() => {
    let active = true;

    async function loadSubtopics() {
      try {
        const decodedTopicName = decodeURIComponent(topicName);
        const topicQuery = query(
          collection(db, "topics"),
          where("name", "==", decodedTopicName)
        );
        const topicSnap = await getDocs(topicQuery);
        
        if (!topicSnap.empty) {
          const topicId = topicSnap.docs[0].id;
          
          // Load all subtopics for this topic
          const subtopicsQuery = query(
            collection(db, "subtopics"),
            where("topicId", "==", topicId)
          );
          const subtopicsSnap = await getDocs(subtopicsQuery);
          
          if (active) {
            const subtopicsData = subtopicsSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setSubtopics(subtopicsData);
          }
        }
      } catch (error) {
        console.error("Error loading subtopics:", error);
      }
    }

    if (topicName) {
      loadSubtopics();
    }
    return () => (active = false);
  }, [topicName]);

  /* =========================
     LOAD ALL TOPICS FOR THIS CATEGORY
  ========================= */
  useEffect(() => {
    let active = true;

    async function loadTopics() {
      try {
        const decodedCategoryName = decodeURIComponent(categoryName);
        const categoryQuery = query(
          collection(db, "categories"),
          where("name", "==", decodedCategoryName)
        );
        const categorySnap = await getDocs(categoryQuery);
        
        if (!categorySnap.empty) {
          const categoryId = categorySnap.docs[0].id;
          
          // Load all topics for this category
          const topicsQuery = query(
            collection(db, "topics"),
            where("categoryId", "==", categoryId)
          );
          const topicsSnap = await getDocs(topicsQuery);
          
          if (active) {
            const topicsData = topicsSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setTopics(topicsData);
          }
        }
      } catch (error) {
        console.error("Error loading topics:", error);
      }
    }

    if (categoryName) {
      loadTopics();
    }
    return () => (active = false);
  }, [categoryName]);

  /* =========================
     USER PROGRESS
  ========================= */
  useEffect(() => {
    let active = true;

    async function loadProgress() {
      if (!user || !categoryData) {
        active && setHighestCompleted(0);
        return;
      }

      const completed = await getHighestCompletedLevel(
        user,
        categoryData.id,
        difficulty
      );
      active && setHighestCompleted(completed || 0);
    }

    loadProgress();
    return () => (active = false);
  }, [user, categoryData, difficulty]);

  /* =========================
     RESUME
  ========================= */
  useEffect(() => {
    let active = true;

    async function loadResume() {
      if (!user || !categoryData) return;

      const data = await loadResumeState(user);
      if (
        active &&
        data &&
        data.category === categoryData.id &&
        data.difficulty === difficulty
      ) {
        setResume(data);
      } else if (active) {
        setResume(null);
      }
    }

    loadResume();
    return () => (active = false);
  }, [user, categoryData, difficulty]);

  /* =========================
     LOAD LEVELS
  ========================= */
  useEffect(() => {
    let active = true;

    async function loadLevels() {
      setLoading(true);
      try {
        if (!categoryData) return;
        
        // Query by subtopic name (always for this new URL structure)
        const queryField = "subtopic";
        const queryValue = categoryData.name;
        
        console.log("🔍 Querying questions:", { queryField, queryValue, difficulty });
        
        const q = query(
          collection(db, "questions"),
          where(queryField, "==", queryValue),
          where("difficulty", "==", difficulty)
        );

        const snap = await getDocs(q);
        console.log("📊 Found questions:", snap.size);
        
        const total = Math.max(
          1,
          Math.ceil(snap.size / QUESTIONS_PER_LEVEL)
        );

        active &&
          setLevels(Array.from({ length: total }, (_, i) => i + 1));
      } catch (e) {
        console.error("❌ Error loading levels:", e);
      } finally {
        active && setLoading(false);
      }
    }

    loadLevels();
    return () => (active = false);
  }, [categoryData, difficulty]);

  /* =========================
     LOAD LEVEL COUNTS FOR ALL DIFFICULTIES
  ========================= */
  useEffect(() => {
    let active = true;

    async function loadAllLevelCounts() {
      if (!categoryData) return;
      
      const counts = { easy: 0, medium: 0, hard: 0 };
      
      for (const diff of ["easy", "medium", "hard"]) {
        try {
          const q = query(
            collection(db, "questions"),
            where("subtopic", "==", categoryData.name),
            where("difficulty", "==", diff)
          );
          const snap = await getDocs(q);
          counts[diff] = Math.max(1, Math.ceil(snap.size / QUESTIONS_PER_LEVEL));
        } catch (e) {
          console.error(`Error loading ${diff} level count:`, e);
        }
      }
      
      if (active) {
        setLevelCounts(counts);
      }
    }

    loadAllLevelCounts();
    return () => (active = false);
  }, [categoryData]);

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
      <div 
        style={{
          opacity: fadeIn ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          willChange: 'opacity'
        }}
      >
      {/* Breadcrumb Navigation */}
      <div className="mb-4">
        <button
          onClick={() => {
            if (parentCategory) {
              // If viewing subcategory, go back to subcategory list
              navigate(`/subcategories/${parentCategory.id}`);
            } else {
              // Otherwise go to home
              navigate("/");
            }
          }}
          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 transition-colors"
        >
          ← {parentCategory ? `Back to ${parentCategory.label || parentCategory.name}` : "Back to Home"}
        </button>
      </div>

      {/* Category/Subcategory Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {categoryData?.icon && <span className="text-4xl">{categoryData.icon}</span>}
          <h2 className="text-3xl font-bold text-gray-900">
            {categoryData?.label || categoryData?.name || decodeURIComponent(subtopicName)}
          </h2>
        </div>
        {categoryData?.description && (
          <p className="text-gray-600 ml-14">{categoryData.description}</p>
        )}
      </div>

      {/* Topics Navigation Bar */}
      {topics.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#374151", marginBottom: 12 }}>
            Choose Topic:
          </h3>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {(showAllTopics ? topics : topics.slice(0, 4)).map((topic) => {
              const isActive = topic.name === decodeURIComponent(topicName);
              return (
                <button
                  key={topic.id}
                  onClick={async () => {
                    const isActive = topic.name === decodeURIComponent(topicName);
                    if (isActive) return;
                    
                    // Fade out
                    setFadeIn(false);
                    await new Promise(resolve => setTimeout(resolve, 150));
                    
                    try {
                      // Load subtopics for this topic
                      const subtopicsQuery = query(
                        collection(db, "subtopics"),
                        where("topicId", "==", topic.id)
                      );
                      const subtopicsSnap = await getDocs(subtopicsQuery);
                      
                      if (subtopicsSnap.size > 0) {
                        // Navigate to first subtopic of this topic
                        const firstSubtopic = subtopicsSnap.docs[0].data();
                        navigate(`/quiz/${categoryName}/${topic.name}/${firstSubtopic.name}/${difficulty}`);
                      } else {
                        setFadeIn(true);
                        alert("No subtopics found for this topic");
                      }
                    } catch (error) {
                      setFadeIn(true);
                      console.error("Error loading subtopics:", error);
                    }
                  }}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 999,
                    border: isActive ? "2px solid #10b981" : "2px solid transparent",
                    fontWeight: 700,
                    fontSize: 14,
                    background: isActive ? "#10b981" : "#f3f4f6",
                    color: isActive ? "#ffffff" : "#374151",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textTransform: "capitalize",
                    letterSpacing: "0.3px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.background = "#e5e7eb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.background = "#f3f4f6";
                    }
                  }}
                >
                  {topic.icon && <span style={{ marginRight: 6 }}>{topic.icon}</span>}
                  {topic.label || topic.name}
                </button>
              );
            })}
            {topics.length > 4 && (
              <button
                onClick={() => setShowAllTopics(!showAllTopics)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  border: "none",
                  fontWeight: 600,
                  fontSize: 14,
                  background: "transparent",
                  color: "#059669",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#047857";
                  e.target.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#059669";
                  e.target.style.textDecoration = "none";
                }}
              >
                {showAllTopics ? "Show Less" : `Show More (${topics.length - 4})`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Subtopics Navigation Bar */}
      {subtopics.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#374151", marginBottom: 12 }}>
            Choose Subtopic:
          </h3>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {(showAllSubtopics ? subtopics : subtopics.slice(0, 4)).map((subtopic) => {
              const isActive = subtopic.name === decodeURIComponent(subtopicName);
              const hasImage = subtopic.imageUrl && subtopic.imageUrl.trim() !== "";
              
              return (
                <button
                  key={subtopic.id}
                  onClick={async () => {
                    const isActive = subtopic.name === decodeURIComponent(subtopicName);
                    if (isActive) return;
                    
                    // Fade out before navigation
                    setFadeIn(false);
                    await new Promise(resolve => setTimeout(resolve, 150));
                    navigate(`/quiz/${categoryName}/${topicName}/${subtopic.name}/${difficulty}`);
                  }}
                  style={{
                    padding: hasImage ? "8px 16px" : "10px 20px",
                    borderRadius: 999,
                    border: isActive ? "2px solid #3b82f6" : "2px solid transparent",
                    fontWeight: 700,
                    fontSize: 14,
                    background: isActive ? "#3b82f6" : "#f3f4f6",
                    color: isActive ? "#ffffff" : "#374151",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textTransform: "capitalize",
                    letterSpacing: "0.3px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.background = "#e5e7eb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.background = "#f3f4f6";
                    }
                  }}
                >
                  {hasImage ? (
                    <img
                      src={subtopic.imageUrl}
                      alt={subtopic.name}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "inline";
                      }}
                    />
                  ) : null}
                  {subtopic.icon && (
                    <span style={{ display: hasImage ? "none" : "inline" }}>
                      {subtopic.icon}
                    </span>
                  )}
                  <span>{subtopic.label || subtopic.name}</span>
                </button>
              );
            })}
            {subtopics.length > 4 && (
              <button
                onClick={() => setShowAllSubtopics(!showAllSubtopics)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  border: "none",
                  fontWeight: 600,
                  fontSize: 14,
                  background: "transparent",
                  color: "#2563eb",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#1d4ed8";
                  e.target.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#2563eb";
                  e.target.style.textDecoration = "none";
                }}
              >
                {showAllSubtopics ? "Show Less" : `Show More (${subtopics.length - 4})`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* DIFFICULTY TABS */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Choose Difficulty:</h3>
        <div style={{ display: "flex", gap: 10 }}>
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={async () => {
                if (d === difficulty) return;
                setDifficulty(d);
              }}
              style={{
                padding: "12px 24px",
                borderRadius: 999,
                border: d === difficulty ? "2px solid" : "2px solid transparent",
                fontWeight: 700,
                fontSize: "14px",
                background: d === difficulty ? theme : "#f3f4f6",
                color: d === difficulty ? "#fff" : "#374151",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
              onMouseEnter={(e) => {
                if (d !== difficulty) {
                  e.target.style.background = "#e5e7eb";
                }
              }}
              onMouseLeave={(e) => {
                if (d !== difficulty) {
                  e.target.style.background = "#f3f4f6";
                }
              }}
            >
              {d === "easy" && "🟢 "}
              {d === "medium" && "🟡 "}
              {d === "hard" && "🔴 "}
              {d} {levelCounts[d] > 0 && `(${levelCounts[d]})`}
            </button>
          ))}
        </div>
      </div>

      {/* RESUME */}
      {resume && (
        <LevelResumeBanner
          level={resume.level}
          onResume={() =>
            navigate(`/quiz/${categoryName}/${topicName}/${subtopicName}/${difficulty}/${resume.level}`)
          }
          onDiscard={async () => {
            await clearResumeState(user);
            setResume(null);
          }}
        />
      )}

      {/* Inline Quiz - shows when a level is clicked */}
      {selectedLevel ? (
        <div style={{ marginBottom: 40 }}>
          <InlineQuiz
            categoryName={categoryName}
            topicName={topicName}
            subtopicName={subtopicName}
            difficulty={difficulty}
            level={selectedLevel}
            onClose={() => setSelectedLevel(null)}
            onComplete={async (passed, nextLevel, xpEarned, coinsEarned) => {
              console.log("🎯 Quiz completed callback received:", { passed, nextLevel, level: selectedLevel, xpEarned, coinsEarned });
              
              if (passed) {
                // Close the quiz first
                console.log("✨ Closing quiz and preparing celebration");
                setSelectedLevel(null);
                
                // Wait a bit for UI to update
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Reload progress
                if (user && categoryData) {
                  console.log("📊 Reloading progress for:", { userId: user?.uid, categoryId: categoryData.id, difficulty });
                  const completed = await getHighestCompletedLevel(
                    user,
                    categoryData.id,
                    difficulty
                  );
                  console.log("✅ New highest completed level:", completed);
                  setHighestCompleted(completed);
                } else if (!user && categoryData) {
                  // For guest users, we need to read from localStorage
                  const guestProgress = JSON.parse(localStorage.getItem("quiz_guest_progress") || "{}");
                  const completed = guestProgress[categoryData?.id]?.[difficulty]?.highestCompleted || 0;
                  console.log("👤 Guest highest completed level:", completed);
                  setHighestCompleted(completed);
                }
                
                // Show celebration
                console.log("🎊 Setting celebration state");
                setTimeout(() => {
                  setCelebratingLevel({ 
                    level: selectedLevel, 
                    xpEarned, 
                    coinsEarned,
                    nextLevel 
                  });
                  setShowCelebration(true);
                  console.log("🎉 Celebration should be visible now");
                  
                  // Hide celebration after 3 seconds
                  setTimeout(() => {
                    console.log("👋 Hiding celebration");
                    setShowCelebration(false);
                    setCelebratingLevel(null);
                  }, 3000);
                }, 200);
              }
            }}
          />
        </div>
      ) : loading ? (
        <div>Loading levels…</div>
      ) : (
        /* LEVEL PATH — CANDY CRUSH STYLE */
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "100%",
            margin: "0 auto",
            padding: "40px 20px",
            background: "linear-gradient(180deg, #a8e6cf 0%, #dcedc8 50%, #fff9c4 100%)",
            minHeight: `${Math.max(levels.length * 150 + 200, 700)}px`,
            borderRadius: 0,
            opacity: fadeIn ? 1 : 0.5,
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          {/* SVG Path for winding road */}
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 400 ${levels.length * 150 + 200}`}
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
                let pathData = '';
                
                for (let i = 0; i < levels.length; i++) {
                  const isLeft = i % 2 === 0;
                  const x = isLeft ? 80 : 320;
                  const y = 100 + i * 150;

                  if (i === 0) {
                    pathData = `M ${x} ${y}`;
                  } else {
                    const prevIsLeft = (i - 1) % 2 === 0;
                    const prevX = prevIsLeft ? 80 : 320;
                    const prevY = 100 + (i - 1) * 150;
                    
                    // Smooth curves between levels
                    const controlY = (prevY + y) / 2;
                    pathData += ` C ${prevX} ${controlY}, ${x} ${controlY}, ${x} ${y}`;
                  }
                }
                return pathData;
              })()}
              fill="none"
              stroke="url(#roadGradient)"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Road dashed center line */}
            <path
              d={(() => {
                let pathData = '';
                
                for (let i = 0; i < levels.length; i++) {
                  const isLeft = i % 2 === 0;
                  const x = isLeft ? 80 : 320;
                  const y = 100 + i * 150;

                  if (i === 0) {
                    pathData = `M ${x} ${y}`;
                  } else {
                    const prevIsLeft = (i - 1) % 2 === 0;
                    const prevX = prevIsLeft ? 80 : 320;
                    const prevY = 100 + (i - 1) * 150;
                    
                    const controlY = (prevY + y) / 2;
                    pathData += ` C ${prevX} ${controlY}, ${x} ${controlY}, ${x} ${y}`;
                  }
                }
                return pathData;
              })()}
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeDasharray="12 18"
              strokeLinecap="round"
              opacity={0.8}
            />
          </svg>

          {/* LEVEL NODES */}
          <div style={{ position: "relative", zIndex: 2, height: "100%" }}>
            {levels.map((level, index) => {
              const completed = level <= highestCompleted;
              const next = level === highestCompleted + 1;
              const locked = level > highestCompleted + 1 || (!user && level > 2);
              const isBoss = level % 5 === 0;

              // Alternate levels on left and right sides of the road
              const isLeft = index % 2 === 0;
              // Position on alternating sides - more spacing for clear left/right
              const x = isLeft ? 80 : 320;
              const y = 100 + index * 150;

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
                      onClick={() => {
                        if (!locked) {
                          console.log("🚀 Opening inline quiz for level:", level);
                          setSelectedLevel(level);
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decorative elements - positioned dynamically near levels */}
          {levels.map((level, index) => {
            // Match level positions
            const isLeft = index % 2 === 0;
            const x = isLeft ? 90 : 290;
            const y = 80 + index * 130;
            const offset = Math.floor(index / 3) % 2 === 0 ? 0 : 20;
            const finalX = isLeft ? x + offset : x - offset;
            
            // Show decorative badges at specific levels with varied positioning
            const badges = [];
            
            if (level === 2) {
              badges.push(
                <div
                  key={`badge-${level}-star`}
                  style={{
                    position: "absolute",
                    left: isLeft ? x + 110 : x - 140,
                    top: y - 30,
                    fontSize: 36,
                    zIndex: 1,
                    animation: "bounce 2s ease-in-out infinite",
                    animationDelay: "0.3s",
                  }}
                >
                  ⭐
                </div>
              );
            }
            
            if (level === 4) {
              badges.push(
                <div
                  key={`badge-${level}-coin`}
                  style={{
                    position: "absolute",
                    left: isLeft ? x + 100 : x - 130,
                    top: y + 10,
                    fontSize: 34,
                    zIndex: 1,
                    animation: "spin 4s linear infinite",
                  }}
                >
                  🪙
                </div>
              );
            }
            
            if (level === 6) {
              badges.push(
                <div
                  key={`badge-${level}-medal`}
                  style={{
                    position: "absolute",
                    left: isLeft ? x + 105 : x - 135,
                    top: y - 20,
                    fontSize: 38,
                    zIndex: 1,
                    animation: "float 3.5s ease-in-out infinite",
                    animationDelay: "0.5s",
                  }}
                >
                  🥇
                </div>
              );
            }
            
            if (level === levels.length) {
              // Big trophy only at the very last level
              badges.push(
                <div
                  key={`badge-${level}-trophy`}
                  style={{
                    position: "absolute",
                    left: isLeft ? x + 115 : x - 145,
                    top: y - 10,
                    fontSize: 56,
                    zIndex: 1,
                    animation: "float 3s ease-in-out infinite",
                  }}
                >
                  🏆
                </div>
              );
            }
            
            if (level === 8) {
              badges.push(
                <div
                  key={`badge-${level}-gem`}
                  style={{
                    position: "absolute",
                    left: isLeft ? x + 108 : x - 138,
                    top: y + 5,
                    fontSize: 36,
                    zIndex: 1,
                    animation: "bounce 2.5s ease-in-out infinite",
                    animationDelay: "0.7s",
                  }}
                >
                  💎
                </div>
              );
            }
            
            return badges;
          })}

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

      {/* Celebration Overlay */}
      {showCelebration && celebratingLevel && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9998,
              animation: "fadeIn 0.3s ease-in-out",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: 24,
                padding: 48,
                textAlign: "center",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                animation: "celebrationPop 0.5s ease-out",
                maxWidth: 500,
              }}
            >
              <div style={{ fontSize: 80, marginBottom: 16, animation: "bounce 1s ease-in-out infinite" }}>
                🎉
              </div>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: "#fff", marginBottom: 12 }}>
                Level {celebratingLevel.level} Complete!
              </h2>
              <p style={{ fontSize: 18, color: "#e0e7ff", marginBottom: 32 }}>
                Outstanding work!
              </p>
              
              <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 32 }}>
                <div style={{ 
                  background: "rgba(255,255,255,0.2)", 
                  borderRadius: 16, 
                  padding: "16px 24px",
                  backdropFilter: "blur(10px)",
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>
                    +{celebratingLevel.xpEarned} XP
                  </div>
                </div>
                <div style={{ 
                  background: "rgba(255,255,255,0.2)", 
                  borderRadius: 16, 
                  padding: "16px 24px",
                  backdropFilter: "blur(10px)",
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🪙</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>
                    +{celebratingLevel.coinsEarned} Coins
                  </div>
                </div>
              </div>

              {celebratingLevel.nextLevel && (
                <div style={{ 
                  background: "rgba(255,255,255,0.15)", 
                  borderRadius: 12, 
                  padding: 16,
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 600,
                }}>
                  🔓 Level {celebratingLevel.nextLevel} Unlocked!
                </div>
              )}
            </div>
          </div>
          
          {/* Confetti on top */}
          <ConfettiBurst />
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes celebrationPop {
          0% { 
            opacity: 0;
            transform: scale(0.5) translateY(50px);
          }
          100% { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
      </div>
    </SiteLayout>
  );
}