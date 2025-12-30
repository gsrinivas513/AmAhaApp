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
  // Determine initial grid size from puzzle data layout or randomly select based on available cards
  const [gridSize, setGridSize] = useState(() => {
    const layout = puzzle.data?.layout;
    const availableCards = puzzle.data?.cards?.length || 0;
    
    // If layout is specified, use it
    if (layout === 'grid-2x4') return 2;
    if (layout === 'grid-3x4') return 3;
    if (layout === 'grid-4x4') return 4;
    if (layout === 'grid-5x5') return 5;
    if (layout === 'grid-6x6') return 6;
    
    // Otherwise, randomly select from available options based on card count
    const availableSizes = [];
    if (availableCards >= 8) availableSizes.push(2);   // 2x4
    if (availableCards >= 12) availableSizes.push(3);  // 3x4
    if (availableCards >= 16) availableSizes.push(4);  // 4x4
    if (availableCards >= 25) availableSizes.push(5);  // 5x5
    if (availableCards >= 36) availableSizes.push(6);  // 6x6
    
    if (availableSizes.length === 0) {
      return 4; // default to 4x4 if no size info
    }
    
    // Randomly select from available sizes
    return availableSizes[Math.floor(Math.random() * availableSizes.length)];
  });
  const [showRules, setShowRules] = useState(false); // Collapsible rules
  const [time, setTime] = useState(0); // Timer in seconds
  const [gameStarted, setGameStarted] = useState(false); // Track if game has started

  // Helper function to shuffle cards
  const shuffleCards = (cardsToShuffle) => {
    return cardsToShuffle
      .map((card) => ({ ...card, id: card.id || `card-${Math.random()}` }))
      .sort(() => Math.random() - 0.5);
  };

  // Initialize cards based on grid size
  useEffect(() => {
    // Safety check: ensure puzzle.data exists
    if (!puzzle || !puzzle.data) {
      console.error("❌ FindPairPuzzle: puzzle.data is undefined", { puzzle });
      setCards([]);
      return;
    }

    const allCards = puzzle.data.cards || [];
    
    // Calculate total cards and pairs needed based on grid size
    let totalCards, pairsNeeded;
    if (gridSize === 2) {
      // 2x4 = 8 cards = 4 pairs
      totalCards = 8;
      pairsNeeded = 4;
    } else if (gridSize === 3) {
      // 3x4 = 12 cards = 6 pairs
      totalCards = 12;
      pairsNeeded = 6;
    } else {
      // gridSize is rows, so gridSize x gridSize
      totalCards = gridSize * gridSize;
      pairsNeeded = totalCards / 2;
    }
    
    // Take all cards that match the total cards needed for this grid size
    // (Cards are already arranged as pairs by the admin editor)
    let selectedCards = allCards.slice(0, totalCards);
    
    // If we don't have enough cards, create duplicates from what we have
    while (selectedCards.length < totalCards) {
      const cardsToAdd = allCards.slice(0, totalCards - selectedCards.length);
      selectedCards = [...selectedCards, ...cardsToAdd];
    }
    
    selectedCards = selectedCards.slice(0, totalCards);
    
    // Auto-assign pairIds based on matching images if pairIds are missing
    const cardsWithPairIds = selectedCards.map((card, index) => {
      if (card.pairId) {
        return card; // Already has pairId
      }
      // Auto-assign pairId based on image matching
      let pairId = `pair-${Math.floor(index / 2)}`;
      
      // Find if this image matches another card
      const imageUrl = card.image;
      if (imageUrl) {
        for (let i = 0; i < selectedCards.length; i++) {
          if (i !== index && selectedCards[i].image === imageUrl) {
            // Use the same pairId as the matching card
            pairId = `auto-pair-${imageUrl}`;
            break;
          }
        }
      }
      
      return { ...card, pairId };
    });
    
    // Shuffle the already-paired cards (don't create pairs again)
    const shuffledCards = shuffleCards(cardsWithPairIds);
    
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

  // Timer effect - only start when game is started (first card clicked)
  useEffect(() => {
    let timer;
    if (gameStarted && cards.length > 0 && matched.size < cards.length) {
      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, cards.length, matched.size]);

  // Reset timer when changing grid size
  useEffect(() => {
    setTime(0);
  }, [gridSize]);

  const handleCardClick = (index) => {
    if (matched.has(index) || flipped.has(index)) return;

    // Start the game timer on first card click
    if (!gameStarted) {
      setGameStarted(true);
    }

    const newFlipped = new Set([...flipped, index]);
    setFlipped(newFlipped);

    if (newFlipped.size === 2) {
      const [first, second] = Array.from(newFlipped);
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (cardsMatch(firstCard, secondCard)) {
        // Show the matched cards for 800ms before marking as matched
        setTimeout(() => {
          setMatched((prev) => new Set([...prev, first, second]));
          setFlipped(new Set());
        }, 800);
      } else {
        // Show both cards for 800ms before flipping back
        setAttempts((prev) => prev + 1);
        setTimeout(() => setFlipped(new Set()), 800);
      }
    }
  };

  const cardsMatch = (card1, card2) => {
    // Match cards by pairId if available, otherwise by image
    if (card1.pairId && card2.pairId) {
      return card1.pairId === card2.pairId;
    }
    return card1.image === card2.image;
  };

  const handleRestart = () => {
    setFlipped(new Set());
    setMatched(new Set());
    setAttempts(0);
    setTime(0);
    setGameStarted(false);
    // Reshuffle the cards on restart
    setCards((prevCards) => shuffleCards(prevCards));
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
                className={`fp-difficulty-btn ${gridSize === 2 ? "active" : ""}`}
                onClick={() => setGridSize(2)}
              >
                2×4
              </button>
              <button
                className={`fp-difficulty-btn ${gridSize === 3 ? "active" : ""}`}
                onClick={() => setGridSize(3)}
              >
                3×4
              </button>
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

            {/* Action buttons */}
            <div className="fp-action-buttons">
              <button className="fp-high-scores-btn">
                🏆 High Scores
              </button>
              <button className="fp-restart-btn" onClick={handleRestart}>
                🔄 Restart
              </button>
              <button 
                className="fp-rules-btn"
                onClick={() => setShowRules(true)}
              >
                📋 Game Rules
              </button>
            </div>
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
          <div className={`fp-memory-grid-large ${
            gridSize === 2 ? 'fp-grid-2x4' :
            gridSize === 3 ? 'fp-grid-3x4' :
            gridSize === 4 ? 'fp-grid-4x4' :
            gridSize === 5 ? 'fp-grid-5x5' :
            'fp-grid-6x6'
          }`}>
            {cards.map((card, index) => (
              <div
                key={index}
                className={`fp-memory-card-large ${flipped.has(index) ? "flipped" : ""} ${matched.has(index) ? "matched" : ""}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="fp-card-inner-large">
                  <div className="fp-card-back-large">?</div>
                  <div className="fp-card-front-large" style={
                    card.image && card.image.startsWith('#') 
                      ? { background: card.image, position: 'relative' }
                      : {}
                  }>
                    {card.image && card.image.startsWith('#') ? (
                      // Color mode - show colored background
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: card.image,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}></div>
                    ) : card.image ? (
                      // Image mode
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
