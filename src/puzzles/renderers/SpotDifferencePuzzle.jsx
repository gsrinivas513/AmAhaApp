// src/puzzles/renderers/SpotDifferencePuzzle.jsx
// Spot the difference puzzle renderer
import React, { useState, useEffect, useRef } from "react";
import { savePuzzleProgress } from "../../quiz/services/visualPuzzleService";
import "../../styles/puzzle-renderers.css";

function SpotDifferencePuzzle({ puzzle, onComplete }) {
  const [differences, setDifferences] = useState([]);
  const [found, setFound] = useState(new Set());
  const [attempts, setAttempts] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setDifferences(puzzle.data.differences || []);
  }, [puzzle]);

  useEffect(() => {
    if (found.size === differences.length && differences.length > 0) {
      setShowCelebration(true);
      savePuzzleProgress(puzzle.id, {
        completed: true,
        attempts,
        score: Math.max(0, 100 - attempts * 3),
      });
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [found, differences.length, puzzle.id, attempts, onComplete]);

  const handleImageClick = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if click is near any difference
    let hitDifference = null;
    for (const diff of differences) {
      const distance = Math.sqrt(
        Math.pow(diff.x - x, 2) + Math.pow(diff.y - y, 2)
      );
      const threshold = (diff.radius / rect.width) * 100;

      if (distance < threshold && !found.has(diff.id)) {
        hitDifference = diff;
        break;
      }
    }

    if (hitDifference) {
      setFound((prev) => new Set([...prev, hitDifference.id]));
    } else {
      setAttempts((prev) => prev + 1);
    }
  };

  return (
    <div className="puzzle-container spot-difference-puzzle">
      <div className="puzzle-header">
        <h2>{puzzle.title}</h2>
        <div className="puzzle-stats">
          <span>Found: {found.size}/{differences.length}</span>
          <span>Attempts: {attempts}</span>
        </div>
      </div>

      {showCelebration && (
        <div className="celebration">
          <div className="confetti">🎉</div>
          <h3>Perfect! You found all differences!</h3>
        </div>
      )}

      <div className="spot-difference-images">
        <div className="image-container">
          <img src={puzzle.data.imageA} alt="Image A" />
          <p>Find the differences</p>
        </div>

        <div className="image-container clickable" ref={containerRef}>
          <img
            src={puzzle.data.imageB}
            alt="Image B"
            onClick={handleImageClick}
            style={{ cursor: "crosshair" }}
          />
          {differences.map((diff) => (
            <div
              key={diff.id}
              className={`difference-marker ${found.has(diff.id) ? "found" : ""}`}
              style={{
                left: `${diff.x}%`,
                top: `${diff.y}%`,
                width: `${(diff.radius * 2)}px`,
                height: `${(diff.radius * 2)}px`,
              }}
            />
          ))}
          <p>Click on differences</p>
        </div>
      </div>

      <div className="differences-tracker">
        <h4>Found ({found.size}/{differences.length})</h4>
        <div className="tracker-dots">
          {differences.map((diff) => (
            <span
              key={diff.id}
              className={`dot ${found.has(diff.id) ? "found" : ""}`}
              title={`Difference ${differences.indexOf(diff) + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SpotDifferencePuzzle;
