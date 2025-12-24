// src/puzzles/renderers/PictureShadowPuzzle.jsx
// Picture-shadow matching puzzle renderer
import React, { useState, useEffect } from "react";
import { savePuzzleProgress } from "../../quiz/services/visualPuzzleService";
import "../../styles/puzzle-renderers.css";

function PictureShadowPuzzle({ puzzle, onComplete }) {
  const [pairs, setPairs] = useState([]);
  const [shadowOrder, setShadowOrder] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [attempts, setAttempts] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const puzzlePairs = puzzle.data.pairs || [];
    // Shuffle shadows
    const shuffled = [...puzzlePairs].sort(() => Math.random() - 0.5);
    setPairs(puzzlePairs);
    setShadowOrder(shuffled.map((p) => p.id));
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

  const handleMatch = (pictureId, shadowId) => {
    if (matched.has(pictureId)) return;

    const picture = pairs.find((p) => p.id === pictureId);
    const shadow = pairs.find((p) => p.id === shadowId);

    if (picture && shadow && picture.id === shadow.id) {
      setMatched((prev) => new Set([...prev, pictureId]));
    } else {
      setAttempts((prev) => prev + 1);
    }
  };

  return (
    <div className="puzzle-container picture-shadow-puzzle">
      <div className="puzzle-header">
        <h2>{puzzle.title}</h2>
        <div className="puzzle-stats">
          <span>Matched: {matched.size}/{pairs.length}</span>
          <span>Attempts: {attempts}</span>
        </div>
      </div>

      {showCelebration && (
        <div className="celebration">
          <div className="confetti">🎉</div>
          <h3>Perfect Matching!</h3>
        </div>
      )}

      <div className="shadow-matching">
        <div className="pictures-section">
          <h3>Pictures</h3>
          <div className="pictures-grid">
            {pairs.map((pair) => (
              <div
                key={pair.id}
                className={`picture-item ${
                  matched.has(pair.id) ? "matched" : ""
                }`}
              >
                <img src={pair.image} alt="Picture" />
              </div>
            ))}
          </div>
        </div>

        <div className="shadows-section">
          <h3>Shadows</h3>
          <div className="shadows-grid">
            {shadowOrder.map((shadowId) => {
              const pair = pairs.find((p) => p.id === shadowId);
              return (
                <div
                  key={shadowId}
                  className={`shadow-item ${
                    matched.has(pair.id) ? "matched" : ""
                  }`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = "link";
                    e.dataTransfer.setData("shadowId", shadowId);
                  }}
                >
                  <img src={pair.shadow} alt="Shadow" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="drag-hint">
        <p>Drag shadows to match with pictures!</p>
      </div>
    </div>
  );
}

export default PictureShadowPuzzle;
