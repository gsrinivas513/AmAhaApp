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
  const [selectedPuzzleIndex, setSelectedPuzzleIndex] = useState(0);

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

  const currentPuzzle = puzzles[selectedPuzzleIndex];

  // If a puzzle is selected, show it fullscreen
  if (currentPuzzle) {
    return (
      <div className="puzzle-fullscreen-wrapper">
        {/* Back button overlay */}
        <button
          className="puzzle-back-overlay-btn"
          onClick={() => setSelectedPuzzleIndex(null)}
        >
          ← Back to Puzzles
        </button>

        {/* Render the puzzle in fullscreen */}
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
              window.location.reload();
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="puzzle-unified-page">
      {/* Header */}
      <div className="puzzle-unified-header">
        <h1>🧩 {subtopicName} Puzzles</h1>
        <p>Complete all puzzles to master this topic!</p>
      </div>

      {/* Puzzle tabs - scroll horizontally */}
      <div className="puzzle-tabs-container">
        <div className="puzzle-tabs-scroll">
          {puzzles.map((puzzle, index) => {
            const isCompleted = progress[puzzle.id]?.completed;
            const isPreviousCompleted = index === 0 || progress[puzzles[index - 1]?.id]?.completed;
            const isLocked = index > 0 && !isPreviousCompleted;
            const isActive = selectedPuzzleIndex === index;

            return (
              <button
                key={puzzle.id}
                className={`puzzle-tab ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${isLocked ? "locked" : ""}`}
                onClick={() => handlePuzzleClick(puzzle, index)}
                disabled={isLocked}
              >
                <span className="tab-number">{index + 1}</span>
                <span className="tab-icon">
                  {isLocked ? "🔒" : isCompleted ? "✅" : "🎮"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer with progress and navigation */}
      <div className="puzzle-unified-footer">
        <div className="progress-info">
          <span>Completed: {Object.values(progress).filter((p) => p.completed).length}/{puzzles.length}</span>
        </div>
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

export default PuzzleLevelPath;
