// src/puzzles/PuzzleLevelPath.jsx
// Candy Crush-style level path for puzzles
import React, { useState, useEffect } from "react";
import { getAllPuzzleProgress, getVisualPuzzlesBySubtopic } from "../quiz/services/visualPuzzleService";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const loadPuzzles = async () => {
      try {
        const puzzleList = await getVisualPuzzlesBySubtopic(subtopicId);
        setPuzzles(puzzleList);

        // Load progress
        const userProgress = await getAllPuzzleProgress();
        const progressMap = {};
        userProgress.forEach((p) => {
          progressMap[p.puzzleId] = p;
        });
        setProgress(progressMap);
      } catch (err) {
        console.error("Error loading puzzles:", err);
      } finally {
        setLoading(false);
      }
    };

    if (subtopicId) {
      loadPuzzles();
    }
  }, [subtopicId]);

  if (loading) {
    return <div className="level-path-loading">Loading puzzles...</div>;
  }

  const handlePuzzleClick = (puzzle, index) => {
    // Check if puzzle is unlocked
    const previousPuzzleCompleted = index === 0 || progress[puzzles[index - 1]?.id]?.completed;

    if (previousPuzzleCompleted || index === 0) {
      navigate(
        `/puzzle/${categoryName}/${topicName}/${subtopicName}/${puzzle.id}`
      );
    }
  };

  return (
    <div className="puzzle-level-path">
      <div className="path-header">
        <h2>🧩 {subtopicName} Puzzles</h2>
        <p>Solve all puzzles to unlock rewards!</p>
      </div>

      <div className="level-path-container">
        {puzzles.map((puzzle, index) => {
          const isCompleted = progress[puzzle.id]?.completed;
          const isPreviousCompleted = index === 0 || progress[puzzles[index - 1]?.id]?.completed;
          const isLocked = index > 0 && !isPreviousCompleted;

          return (
            <React.Fragment key={puzzle.id}>
              {index > 0 && (
                <div className={`path-connector ${isCompleted ? "completed" : ""}`}>
                  <div className="connector-line"></div>
                </div>
              )}

              <button
                className={`level-bubble ${isCompleted ? "completed" : ""} ${
                  isLocked ? "locked" : ""
                }`}
                onClick={() => handlePuzzleClick(puzzle, index)}
                disabled={isLocked}
                title={isLocked ? "Complete previous puzzle first" : puzzle.title}
              >
                <span className="level-number">{index + 1}</span>
                <div className="level-content">
                  {isLocked ? (
                    <span className="lock-icon">🔒</span>
                  ) : isCompleted ? (
                    <span className="completed-icon">✓</span>
                  ) : (
                    <span className="puzzle-icon">
                      {puzzle.type === "picture-word" && "🖼️"}
                      {puzzle.type === "spot-difference" && "👁️"}
                      {puzzle.type === "find-pair" && "🧩"}
                      {puzzle.type === "picture-shadow" && "🌑"}
                      {puzzle.type === "ordering" && "🔢"}
                    </span>
                  )}
                </div>
                <div className="level-info">
                  <p className="level-title">{puzzle.title}</p>
                  {puzzle.difficulty && (
                    <span className={`difficulty ${puzzle.difficulty}`}>
                      {puzzle.difficulty}
                    </span>
                  )}
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <div className="path-footer">
        <div className="progress-summary">
          <span>Completed: {Object.values(progress).filter((p) => p.completed).length}/{puzzles.length}</span>
        </div>
        <button
          className="btn-back-path"
          onClick={() =>
            navigate(`/puzzle/${categoryName}/${topicName}`)
          }
        >
          ← Back to Topics
        </button>
      </div>
    </div>
  );
}

export default PuzzleLevelPath;
