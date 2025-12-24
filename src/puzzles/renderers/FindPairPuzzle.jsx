// src/puzzles/renderers/FindPairPuzzle.jsx
// Find matching pairs (memory game) puzzle renderer
import React, { useState, useEffect } from "react";
import { savePuzzleProgress } from "../../quiz/services/visualPuzzleService";
import "../../styles/puzzle-renderers.css";

function FindPairPuzzle({ puzzle, onComplete }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState(new Set());
  const [matched, setMatched] = useState(new Set());
  const [attempts, setAttempts] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Shuffle cards
    const shuffledCards = (puzzle.data.cards || [])
      .map((card) => ({ ...card, id: card.id || `card-${Math.random()}` }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
  }, [puzzle]);

  useEffect(() => {
    if (matched.size === cards.length && cards.length > 0) {
      setShowCelebration(true);
      savePuzzleProgress(puzzle.id, {
        completed: true,
        attempts,
        score: Math.max(0, 100 - attempts * 2),
      });
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [matched, cards.length, puzzle.id, attempts, onComplete]);

  const handleCardClick = (index) => {
    if (matched.has(index) || flipped.has(index)) return;

    const newFlipped = new Set([...flipped, index]);
    setFlipped(newFlipped);

    if (newFlipped.size === 2) {
      const [first, second] = Array.from(newFlipped);
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (cardsMatch(firstCard, secondCard)) {
        setMatched((prev) => new Set([...prev, first, second]));
        setFlipped(new Set());
      } else {
        setAttempts((prev) => prev + 1);
        setTimeout(() => setFlipped(new Set()), 600);
      }
    }
  };

  const cardsMatch = (card1, card2) => {
    // For now, simple image comparison
    return card1.image === card2.image;
  };

  return (
    <div className="puzzle-container find-pair-puzzle">
      <div className="puzzle-header">
        <h2>{puzzle.title}</h2>
        <div className="puzzle-stats">
          <span>Matched: {matched.size / 2}/{cards.length / 2}</span>
          <span>Attempts: {attempts}</span>
        </div>
      </div>

      {showCelebration && (
        <div className="celebration">
          <div className="confetti">🎉</div>
          <h3>Excellent Memory!</h3>
        </div>
      )}

      <div className={`memory-grid grid-${puzzle.data.layout || "grid-2x4"}`}>
        {cards.map((card, index) => (
          <div
            key={index}
            className={`memory-card ${
              flipped.has(index) ? "flipped" : ""
            } ${matched.has(index) ? "matched" : ""}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-inner">
              <div className="card-back">?</div>
              <div className="card-front">
                <img src={card.image} alt="Card" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FindPairPuzzle;
