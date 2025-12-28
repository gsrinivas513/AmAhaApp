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
  const [gridSize, setGridSize] = useState(4); // 4 = 4x4, 5 = 5x5, 6 = 6x6
  const [showRules, setShowRules] = useState(false); // Collapsible rules
  const [time, setTime] = useState(0); // Timer in seconds

  // Initialize cards based on grid size
  useEffect(() => {
    const allCards = puzzle.data.cards || [];
    const pairsNeeded = (gridSize * gridSize) / 2;
    
    // Take only the cards we need for this grid size
    let selectedCards = allCards.slice(0, pairsNeeded);
    
    // If we don't have enough cards, create duplicates
    while (selectedCards.length < pairsNeeded) {
      selectedCards = [...selectedCards, ...allCards];
    }
    
    selectedCards = selectedCards.slice(0, pairsNeeded);
    
    // Create pairs and shuffle
    const pairedCards = [];
    selectedCards.forEach((card) => {
      pairedCards.push(card);
      pairedCards.push({ ...card, id: `${card.id}-copy` });
    });
    
    const shuffledCards = pairedCards
      .map((card) => ({ ...card, id: card.id || `card-${Math.random()}` }))
      .sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlipped(new Set());
    setMatched(new Set());
    setAttempts(0);
  }, [puzzle, gridSize]);

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

  // Timer effect
  useEffect(() => {
    let timer;
    if (cards.length > 0 && matched.size < cards.length) {
      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cards.length, matched.size]);

  // Reset timer when changing grid size
  useEffect(() => {
    setTime(0);
  }, [gridSize]);

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

  const handleRestart = () => {
    setFlipped(new Set());
    setMatched(new Set());
    setAttempts(0);
  };

  const gameRules = [
    "🎯 Click on cards to reveal hidden images",
    "🧩 Find matching pairs of cards",
    "🎨 Match all pairs to complete the level",
    "⚡ Try to match pairs with fewer attempts",
    "🏆 Lower attempts = Higher score"
  ];

  // Full-screen game layout with single unified white board
  return (
    <div className="fp-fullscreen-game">
      {/* UNIFIED WHITE BOARD CONTAINER */}
      <div className="fp-unified-board">
        {/* Top section: Title and Controls */}
        <div className="fp-control-bar">
          {/* Title row */}
          <div className="fp-title">{puzzle.title}</div>
          
          {/* Controls row: Difficulty buttons, Game Rules toggle, New Game button */}
          <div className="fp-control-bar-row">
            {/* Difficulty buttons */}
            <div className="fp-difficulty-buttons">
              <button
                className={`fp-difficulty-btn ${gridSize === 4 ? "active" : ""}`}
                onClick={() => setGridSize(4)}
              >
                4×4
              </button>
              <button
                className={`fp-difficulty-btn ${gridSize === 5 ? "active" : ""}`}
                onClick={() => setGridSize(5)}
              >
                5×5
              </button>
              <button
                className={`fp-difficulty-btn ${gridSize === 6 ? "active" : ""}`}
                onClick={() => setGridSize(6)}
              >
                6×6
              </button>
            </div>

            {/* Game Rules toggle */}
            <button 
              className="fp-rules-toggle"
              onClick={() => setShowRules(true)}
            >
              Game Rules ▼
            </button>

            {/* New Game button */}
            <button className="fp-new-game-btn" onClick={handleRestart}>
              🔄 New Game
            </button>
          </div>

          {/* Stats display */}
          <div className="fp-stats-inline">
            <span>⏱ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</span>
            <span>Moves: {attempts}</span>
            <span>Matches: {matched.size / 2}/{cards.length / 2}</span>
            <span>Score: 0</span>
          </div>
        </div>

        {/* Main game board area */}
        <div className="fp-game-area">
          {/* Celebration overlay */}
          {showCelebration && (
            <div className="fp-celebration-overlay">
              <div className="fp-confetti">🎉</div>
              <h2>Excellent Memory!</h2>
            </div>
          )}

          {/* Memory grid - centered */}
          <div className={`fp-memory-grid-large fp-grid-${gridSize}x${gridSize}`}>
            {cards.map((card, index) => (
              <div
                key={index}
                className={`fp-memory-card-large ${flipped.has(index) ? "flipped" : ""} ${matched.has(index) ? "matched" : ""}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="fp-card-inner-large">
                  <div className="fp-card-back-large">?</div>
                  <div className="fp-card-front-large">
                    {card.image ? (
                      <img 
                        src={card.image} 
                        alt="Card" 
                        onError={(e) => {
                          if (e.target && e.target.parentElement) {
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML = `<span style="font-size: 1.5rem;">${card.emoji || "🎨"}</span>`;
                          }
                        }} 
                      />
                    ) : (
                      <span style={{ fontSize: "1.5rem" }}>{card.emoji || "🎨"}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty bottom section (for spacing balance) */}
        <div className="fp-bottom-controls"></div>
      </div>

      {/* Rules Modal Popup */}
      {showRules && (
        <div className="fp-rules-modal" onClick={() => setShowRules(false)}>
          <div className="fp-rules-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="fp-rules-modal-header">
              <h2 className="fp-rules-modal-title">Game Rules</h2>
              <button 
                className="fp-rules-close-btn"
                onClick={() => setShowRules(false)}
              >
                ✕
              </button>
            </div>
            <div className="fp-rules-list">
              {gameRules.map((rule, idx) => (
                <div key={idx} className="fp-rule-item-modal">
                  {rule}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindPairPuzzle;
