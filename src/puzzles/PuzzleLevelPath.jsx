// src/puzzles/PuzzleLevelPath.jsx
// Candy Crush-style level path for puzzles with inline puzzle playing
import React, { useState, useEffect } from "react";
import { getAllPuzzleProgress, getVisualPuzzlesBySubtopic } from "../quiz/services/visualPuzzleService";
import { useNavigate } from "react-router-dom";
import PictureWordPuzzle from "./renderers/PictureWordPuzzle";
import SpotDifferencePuzzle from "./renderers/SpotDifferencePuzzle";
import FindPairPuzzle from "./renderers/FindPairPuzzle";
import PictureShadowPuzzle from "./renderers/PictureShadowPuzzle";
import OrderingPuzzle from "./renderers/OrderingPuzzle";
import { getRandomPuzzleBySubtopic } from "./quickPlayService";
import "../styles/puzzle-level-path.css";

function PuzzleLevelPath({
  categoryName,
  topicName,
  subtopicName,
  subtopicId,
}) {
  const navigate = useNavigate();
  const [puzzles, setPuzzles] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPuzzleIndex, setSelectedPuzzleIndex] = useState(null);
  const [userExplicitlyWentBack, setUserExplicitlyWentBack] = useState(false);

  useEffect(() => {
    const loadPuzzles = async () => {
      try {
        console.log("🔍 PuzzleLevelPath: Loading puzzles for subtopicId:", subtopicId);
        const puzzleList = await getVisualPuzzlesBySubtopic(subtopicId);
        console.log("✅ PuzzleLevelPath: Loaded puzzles:", puzzleList);
        setPuzzles(puzzleList);

        // Load progress
        const userProgress = await getAllPuzzleProgress();
        const progressMap = {};
        userProgress.forEach((p) => {
          progressMap[p.puzzleId] = p;
        });
        setProgress(progressMap);
      } catch (err) {
        console.error("❌ Error loading puzzles:", err);
      } finally {
        setLoading(false);
      }
    };

    if (subtopicId) {
      loadPuzzles();
    } else {
      console.warn("⚠️ PuzzleLevelPath: No subtopicId provided");
      setLoading(false);
    }
  }, [subtopicId]);

  const handleQuickPlayBySubtopic = async () => {
    const decodedCategoryName = decodeURIComponent(categoryName);
    const decodedTopicName = decodeURIComponent(topicName);
    const decodedSubtopicName = decodeURIComponent(subtopicName);
    
    const puzzle = await getRandomPuzzleBySubtopic(decodedCategoryName, decodedTopicName, decodedSubtopicName);
    if (puzzle) navigate(`/play/${puzzle.id}`);
  };

  if (loading) {
    return <div className="level-path-loading">Loading puzzles...</div>;
  }

  const handlePuzzleClick = (puzzle, index) => {
    // Check if puzzle is unlocked
    const previousPuzzleCompleted = index === 0 || progress[puzzles[index - 1]?.id]?.completed;

    if (previousPuzzleCompleted || index === 0) {
      setSelectedPuzzleIndex(index);
    }
  };

  if (puzzles.length === 0) {
    return (
      <div className="puzzle-unified-page">
        <div className="empty-state">
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧩</div>
          <h3>No Puzzles Found</h3>
          <p>It looks like there are no puzzles in this category yet.</p>
          <button
            className="btn-back-path"
            onClick={() => navigate(`/puzzle/${categoryName}/${topicName}`)}
          >
            ← Back to Topics
          </button>
        </div>
      </div>
    );
  }

  // Always select the first puzzle to show it directly (no level selection screen)
  if (selectedPuzzleIndex === null && !userExplicitlyWentBack) {
    setSelectedPuzzleIndex(0);
  }

  const currentPuzzle = puzzles[selectedPuzzleIndex];

  // If a puzzle is selected, show it fullscreen
  if (currentPuzzle !== undefined && currentPuzzle !== null) {
    console.log("🎮 Rendering puzzle:", currentPuzzle.type, currentPuzzle);
    
    return (
      <div className="puzzle-fullscreen-wrapper">
        {/* Header with back button and quick play */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          background: "rgba(255, 255, 255, 0.95)",
          borderBottom: "1px solid #e0e0e0",
          zIndex: 100
        }}>
          <button
            onClick={() => navigate(`/puzzle/${categoryName}/${topicName}`)}
            style={{
              padding: "8px 16px",
              background: "#f0f0f0",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              color: "#333"
            }}
          >
            ← Back to Puzzles
          </button>
          <button
            onClick={handleQuickPlayBySubtopic}
            style={{
              padding: "8px 16px",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              color: "white"
            }}
          >
            ⚡ Quick Play
          </button>
        </div>

        {/* Render the puzzle in fullscreen with top padding for header */}
        {currentPuzzle.type === "find-pair" && (
          <FindPairPuzzle
            puzzle={currentPuzzle}
            onComplete={() => {
              window.location.reload();
            }}
          />
        )}
        {currentPuzzle.type === "picture-word" && (
          <PictureWordPuzzle
            puzzle={currentPuzzle}
            onComplete={() => {
              window.location.reload();
            }}
          />
        )}
        {currentPuzzle.type === "spot-difference" && (
          <SpotDifferencePuzzle
            puzzle={currentPuzzle}
            onComplete={() => {
              window.location.reload();
            }}
          />
        )}
        {currentPuzzle.type === "picture-shadow" && (
          <PictureShadowPuzzle
            puzzle={currentPuzzle}
            onComplete={() => {
              window.location.reload();
            }}
          />
        )}
        {currentPuzzle.type === "ordering" && (
          <OrderingPuzzle
            puzzle={currentPuzzle}
            onComplete={() => {
              // Check if this is an Ascending order puzzle for Size
              if (currentPuzzle.data?.type === "size" && currentPuzzle.title?.includes("Ascending")) {
                // Navigate to Descending puzzle instead of reloading
                const nextIndex = selectedPuzzleIndex + 1;
                if (nextIndex < puzzles.length) {
                  setSelectedPuzzleIndex(nextIndex);
                } else {
                  window.location.reload();
                }
              } else {
                window.location.reload();
              }
            }}
          />
        )}
        
        {/* Fallback: If no puzzle type matched, show error */}
        {currentPuzzle.type !== "find-pair" && 
         currentPuzzle.type !== "picture-word" && 
         currentPuzzle.type !== "spot-difference" && 
         currentPuzzle.type !== "picture-shadow" && 
         currentPuzzle.type !== "ordering" && (
          <div className="puzzle-error" style={{ padding: "20px", textAlign: "center" }}>
            <h2>❌ Puzzle Type Not Supported</h2>
            <p>Type: {currentPuzzle.type}</p>
            <p>Supported types: find-pair, picture-word, spot-difference, picture-shadow, ordering</p>
            <button
              className="btn-back-path"
              onClick={() => navigate(`/puzzle/${categoryName}/${topicName}`)}
            >
              ← Go Back
            </button>
          </div>
        )}
      </div>
    );
  }

  // No puzzle selected yet - shouldn't happen due to automatic selection above
  return null;
}

export default PuzzleLevelPath;
