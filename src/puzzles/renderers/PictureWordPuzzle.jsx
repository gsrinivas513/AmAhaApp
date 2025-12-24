// src/puzzles/renderers/PictureWordPuzzle.jsx
// Picture-word matching puzzle renderer
import React, { useState, useEffect } from "react";
import { savePuzzleProgress } from "../../quiz/services/visualPuzzleService";
import "../../styles/puzzle-renderers.css";

function PictureWordPuzzle({ puzzle, onComplete }) {
  const [pairs, setPairs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const [attempts, setAttempts] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const puzzlePairs = puzzle.data.pairs || [];
    setPairs(puzzlePairs.map((p) => ({ ...p, position: Math.random() })));
  }, [puzzle]);

  useEffect(() => {
    if (matched.size === pairs.length && pairs.length > 0) {
      setShowCelebration(true);
      savePuzzleProgress(puzzle.id, {
        completed: true,
        attempts,
        score: Math.max(0, 100 - attempts * 5),
      });
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [matched, pairs.length, puzzle.id, attempts, onComplete]);

  const handleImageClick = (pairId) => {
    if (matched.has(pairId)) return;

    if (selected === null) {
      setSelected(pairId);
    } else if (selected === pairId) {
      setSelected(null);
    } else {
      // Check if match
      if (validateMatch(selected, pairId)) {
        setMatched((prev) => new Set([...prev, selected, pairId]));
        setSelected(null);
      } else {
        setAttempts((prev) => prev + 1);
        setSelected(null);
      }
    }
  };

  const validateMatch = (id1, id2) => {
    // Simple validation - in real app, could use correctAnswer field
    return true; // Auto-match for demo
  };

  return (
    <div className="puzzle-container picture-word-puzzle">
      <div className="puzzle-header">
        <h2>{puzzle.title}</h2>
        <div className="puzzle-stats">
          <span>Attempts: {attempts}</span>
          <span>Matched: {matched.size}/{pairs.length}</span>
        </div>
      </div>

      {showCelebration && (
        <div className="celebration">
          <div className="confetti">🎉</div>
          <h3>Amazing! You matched everything!</h3>
        </div>
      )}

      <div className={`puzzle-content grid-${puzzle.data.layout || "grid-2x2"}`}>
        {pairs.map((pair) => (
          <div
            key={pair.id}
            className={`puzzle-card ${
              matched.has(pair.id) ? "matched" : ""
            } ${selected === pair.id ? "selected" : ""}`}
            onClick={() => handleImageClick(pair.id)}
          >
            <div className="card-inner">
              <img src={pair.image} alt={pair.word} />
              <span className="card-label">{pair.word}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PictureWordPuzzle;
