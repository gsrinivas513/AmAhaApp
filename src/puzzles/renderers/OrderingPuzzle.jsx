// src/puzzles/renderers/OrderingPuzzle.jsx
// Ordering/sequencing puzzle renderer
import React, { useState, useEffect, useMemo } from "react";
import { savePuzzleProgress } from "../../quiz/services/visualPuzzleService";
import "../../styles/puzzle-renderers.css";

function OrderingPuzzle({ puzzle, onComplete }) {
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]); // Store all items
  const [order, setOrder] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [dragOverSection, setDragOverSection] = useState(null);
  const [selectedRange, setSelectedRange] = useState("1-10"); // Track selected range
  const [selectedOrder, setSelectedOrder] = useState("ascending"); // Track sort order for size puzzles
  const [time, setTime] = useState(0); // Timer in seconds
  const [gameStarted, setGameStarted] = useState(false); // Track if game has started
  const [puzzleType, setPuzzleType] = useState("numbers"); // "numbers" or "size"

  // Determine puzzle type from data
  useEffect(() => {
    const displayType = puzzle.data?.displayType;
    
    // Check if it's a non-number template
    if (displayType === 'daysOfWeek' || displayType === 'monthsOfYear' || displayType === 'seasons' || displayType === 'alphabet') {
      setPuzzleType(displayType); // Use the template type directly
    } else if (puzzle.data?.type === "size" || displayType === "sizes" || puzzle.subtopicId === "ordering-size") {
      setPuzzleType("size");
    } else {
      setPuzzleType("numbers");
    }
  }, [puzzle.subtopicId, puzzle.data?.displayType]);

  // Get number ranges from puzzle data or generate defaults
  const getNumberRanges = () => {
    if (puzzle.data?.numberRanges && puzzle.data.numberRanges.length > 0) {
      return puzzle.data.numberRanges;
    }
    
    // Fallback: Generate from maxRange if available
    if (puzzle.data?.maxRange) {
      const ranges = [];
      for (let i = 1; i <= puzzle.data.maxRange; i += 10) {
        const start = i;
        const end = Math.min(i + 9, puzzle.data.maxRange);
        ranges.push({
          label: `${start}-${end}`,
          min: start,
          max: end,
        });
      }
      return ranges;
    }

    // Fallback to hardcoded ranges
    return [
      { label: "1-10", min: 1, max: 10 },
      { label: "11-20", min: 11, max: 20 },
      { label: "21-30", min: 21, max: 30 },
      { label: "31-40", min: 31, max: 40 },
      { label: "41-50", min: 41, max: 50 },
    ];
  };

  const numberRanges = getNumberRanges();

  // Calculate optimal grid columns based on item count to fit on screen
  const gridColumns = useMemo(() => {
    const itemCount = items.length;
    // Formula: use square root to balance rows and columns, but constrain between 4-6
    return Math.max(4, Math.min(6, Math.ceil(Math.sqrt(itemCount))));
  }, [items.length]);

  const gameRules = [
    "📋 Look at the items on the LEFT side",
    "🎯 Drag items to arrange them in the correct order",
    "📍 Drop items in the sequence area on the RIGHT",
    "❌ Click the × button to remove items from sequence",
    "✅ Arrange all items in correct order to complete"
  ];

  useEffect(() => {
    const puzzleItems = puzzle.data.items || [];
    setAllItems(puzzleItems);
    
    if (puzzleItems.length > 0) {
      // For Days and Seasons (no ranges), show all items
      if (puzzleType === 'daysOfWeek' || puzzleType === 'seasons') {
        let shuffled = [...puzzleItems].sort(() => Math.random() - 0.5);
        setItems(shuffled);
      }
      // For Months and Alphabet (with ranges), filter by selected range
      else if (puzzleType === 'monthsOfYear' || puzzleType === 'alphabet') {
        let rangeToUse = selectedRange;
        const rangeExists = numberRanges.some(r => r.label === selectedRange);
        if (!rangeExists && numberRanges.length > 0) {
          rangeToUse = numberRanges[0].label;
          setSelectedRange(rangeToUse);
        }
        
        const rangeConfig = numberRanges.find(r => r.label === rangeToUse);
        if (rangeConfig) {
          const filteredItems = puzzleItems.filter((item) => {
            const itemNumber = item.order;
            return itemNumber >= rangeConfig.min && itemNumber <= rangeConfig.max;
          });
          const shuffled = [...filteredItems].sort(() => Math.random() - 0.5);
          setItems(shuffled);
        } else {
          const shuffled = [...puzzleItems].sort(() => Math.random() - 0.5);
          setItems(shuffled);
        }
      }
      // For SIZE puzzles, show all items (no filtering by range)
      else if (puzzleType === "size") {
        let shuffled = [...puzzleItems].sort(() => Math.random() - 0.5);
        setItems(shuffled);
      } 
      // For NUMBER puzzles, filter by selected range
      else {
        let rangeToUse = selectedRange;
        const rangeExists = numberRanges.some(r => r.label === selectedRange);
        if (!rangeExists && numberRanges.length > 0) {
          rangeToUse = numberRanges[0].label;
          setSelectedRange(rangeToUse);
        }
        
        // Filter by selected range with the newly loaded items
        const rangeConfig = numberRanges.find(r => r.label === rangeToUse);
        if (rangeConfig) {
          const filteredItems = puzzleItems.filter((item) => {
            const itemNumber = item.number || parseInt(item.label) || item.order;
            return itemNumber >= rangeConfig.min && itemNumber <= rangeConfig.max;
          });
          const shuffled = [...filteredItems].sort(() => Math.random() - 0.5);
          setItems(shuffled);
        } else {
          // If no matching range, show all items
          const shuffled = [...puzzleItems].sort(() => Math.random() - 0.5);
          setItems(shuffled);
        }
      }
    } else {
      setItems([]);
    }
    setOrder([]);
  }, [puzzle.id, selectedRange, puzzleType]);

  // Timer effect - only start when game is started (first drag)
  useEffect(() => {
    let timer;
    if (gameStarted && items.length > 0 && order.length < items.length) {
      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, items.length, order.length]);

  // Reset timer when changing range
  useEffect(() => {
    setTime(0);
  }, [selectedRange]);

  // Filter items based on selected number range
  const filterItemsByRange = (allPuzzleItems, range) => {
    console.log("🔍 Filtering items for range:", range);
    const rangeConfig = numberRanges.find(r => r.label === range);
    if (!rangeConfig) {
      // If no range config found, use all items
      const shuffled = [...allPuzzleItems].sort(() => Math.random() - 0.5);
      console.log("⚠️ Range config not found, showing all:", shuffled.length);
      setItems(shuffled);
      setOrder([]);
      return;
    }

    // Filter items that fall within the selected range
    // Items can have a 'number' property or use their label/order as number
    const filteredItems = allPuzzleItems.filter((item) => {
      const itemNumber = item.number || parseInt(item.label) || item.order;
      return itemNumber >= rangeConfig.min && itemNumber <= rangeConfig.max;
    });

    console.log(`📊 Filtered ${filteredItems.length} items for range ${range}`);
    // Shuffle filtered items
    const shuffled = [...filteredItems].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setOrder([]);
  };

  // Handle range selection
  const handleRangeSelect = (range) => {
    console.log("🎯 User selected range:", range);
    setSelectedRange(range);
    // Directly filter from current allItems
    const rangeConfig = numberRanges.find(r => r.label === range);
    if (rangeConfig && allItems.length > 0) {
      const filteredItems = allItems.filter((item) => {
        const itemNumber = item.number || parseInt(item.label) || item.order;
        return itemNumber >= rangeConfig.min && itemNumber <= rangeConfig.max;
      });
      const shuffled = [...filteredItems].sort(() => Math.random() - 0.5);
      console.log(`✨ Loaded ${shuffled.length} items for range ${range}`);
      setItems(shuffled);
      setOrder([]);
    }
  };

  useEffect(() => {
    if (order.length === items.length && items.length > 0) {
      // Check if order is correct
      let isCorrect = false;

      if (puzzleType === "size") {
        // For size puzzles, check if items are in correct order based on selected order
        isCorrect = order.every((id, index) => {
          const item = items.find((i) => i.id === id);
          if (!item) return false;

          if (selectedOrder === "ascending") {
            // Check ascending order (small to large)
            return item.order === index + 1;
          } else {
            // Check descending order (large to small)
            const expectedOrder = items.length - index;
            return item.order === expectedOrder;
          }
        });
      } else {
        // For number puzzles, check normal ascending order
        isCorrect = order.every((id, index) => {
          const item = items.find((i) => i.id === id);
          return item && item.order === index + 1;
        });
      }

      if (isCorrect) {
        setShowCelebration(true);
        savePuzzleProgress(puzzle.id, {
          completed: true,
          attempts,
          score: 100,
        });
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        // Show wrong feedback
        setShowWrong(true);
        setAttempts(attempts + 1);
        setTimeout(() => {
          setShowWrong(false);
        }, 2000);
      }
    }
  }, [order, items, puzzle.id, attempts, onComplete, puzzleType]);

  const handleDragStart = (e, itemId) => {
    console.log("🎯 Drag started for item:", itemId, "Puzzle type:", puzzleType);
    if (!gameStarted) {
      setGameStarted(true);
    }
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("itemId", itemId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverSection("sequence");
  };

  const handleDropOnSequence = (e) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("itemId");
    if (!order.includes(itemId)) {
      setOrder([...order, itemId]);
      setAttempts((prev) => prev + 1);
    }
    setDragOverSection(null);
  };

  const handleRemoveFromSequence = (index) => {
    setOrder(order.filter((_, i) => i !== index));
    setAttempts((prev) => prev + 1);
  };

  const getAvailableItems = () => {
    return items.filter((item) => !order.includes(item.id));
  };

  return (
    <div className="op-fullscreen-game">
      {/* UNIFIED WHITE BOARD CONTAINER */}
      <div className="op-unified-board">
        {/* Control Bar Section */}
        <div className="op-control-bar">
          {/* Title Row */}
          <div className="op-title">
            {puzzleType === "daysOfWeek" && "📅 "}
            {puzzleType === "monthsOfYear" && "🗓️ "}
            {puzzleType === "seasons" && "🌍 "}
            {puzzleType === "alphabet" && "🔤 "}
            {(puzzleType === "numbers" || puzzleType === "size") && "🔢 "}
            {!["daysOfWeek", "monthsOfYear", "seasons", "alphabet", "numbers", "size"].includes(puzzleType) && "🎯 "}
            {puzzle.title}
          </div>
          
          {/* Controls Row */}
          <div className="op-control-bar-row">
            {/* Range/Order Buttons - Left side */}
            <div className="op-difficulty-buttons">
              {(puzzleType === "numbers" || puzzle.data?.numberRanges?.length > 0) && (
                <>
                  {numberRanges.map((range) => (
                    <button
                      key={range.label}
                      className={`op-range-btn ${selectedRange === range.label ? "active" : ""}`}
                      onClick={() => handleRangeSelect(range.label)}
                    >
                      {range.label}
                    </button>
                  ))}
                </>
              )}

              {puzzleType === "size" && (
                <>
                  <button
                    className={`op-range-btn ${selectedOrder === "ascending" ? "active" : ""}`}
                    onClick={() => {
                      setSelectedOrder("ascending");
                      setOrder([]);
                    }}
                  >
                    ↑ Small to Large
                  </button>
                  <button
                    className={`op-range-btn ${selectedOrder === "descending" ? "active" : ""}`}
                    onClick={() => {
                      setSelectedOrder("descending");
                      setOrder([]);
                    }}
                  >
                    ↓ Large to Small
                  </button>
                </>
              )}
            </div>

            {/* Action Buttons - Right side */}
            <div className="op-action-buttons">
              <button className="op-high-scores-btn">
                🏆 Scores
              </button>
              <button 
                className="op-reset-btn"
                onClick={() => {
                  setOrder([]);
                  setAttempts(0);
                  setTime(0);
                  setGameStarted(false);
                  setShowCelebration(false);
                }}
              >
                🔄 Restart
              </button>
              <button 
                className="op-rules-btn"
                onClick={() => setShowRules(true)}
              >
                📋 Rules
              </button>
            </div>
          </div>

          {/* Stats display - Single row */}
          <div className="op-stats-inline">
            <span>⏱ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</span>
            <span>Moves: {attempts}</span>
            <span>Progress: {order.length}/{items.length}</span>
            <span>Score: 0</span>
          </div>
        </div>

        {/* Main Game Content */}
        <div className="op-game-content">
          {/* Left Side: Items to Arrange */}
          <div className="op-items-section">
            <h3 className="op-section-title">🧩 Items to arrange:</h3>
            {items.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "2rem",
                color: "#999",
                backgroundColor: "#f9f9f9",
                borderRadius: "10px",
                border: "2px dashed #ccc"
              }}>
                <p>No items available for this range.</p>
                <p style={{ fontSize: "0.9rem", margin: "0.5rem 0 0 0" }}>
                  Make sure the puzzle has items configured.
                </p>
              </div>
            ) : (
              <div 
                className="op-items-grid"
                style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}
              >
                {getAvailableItems().map((item) => (
                  <div
                    key={item.id}
                    className="op-draggable-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                  >
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.label || "Item"} 
                        className="op-item-image"
                      />
                    )}
                    {item.label && (
                      <span className="op-item-label">{item.label}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Sequence Builder */}
          <div className="op-sequence-section">
            <h3 className="op-section-title">📍 Arrange in order ({order.length}/{items.length}):</h3>
            <div
              className={`op-sequence-area ${dragOverSection === "sequence" ? "drag-over" : ""}`}
              onDragOver={handleDragOver}
              onDrop={handleDropOnSequence}
              onDragLeave={() => setDragOverSection(null)}
              style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}
            >
              {/* Show numbered slots for each item */}
              {Array.from({ length: items.length }).map((_, index) => {
                const itemId = order[index];
                const item = items.find((i) => i.id === itemId);
                
                return (
                  <div key={index} className="op-sequence-slot">
                    <div className="op-slot-number">{index + 1}</div>
                    {item ? (
                      <div className="op-slot-content filled">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.label || "Item"} 
                            className="op-slot-image"
                          />
                        )}
                        {item.label && (
                          <span className="op-slot-label">{item.label}</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveFromSequence(index)}
                          className="op-btn-remove-slot"
                          title="Remove this item"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="op-slot-content empty">
                        <span className="op-slot-placeholder">Position {index + 1}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Celebration Overlay */}
        {showCelebration && (
          <div className="op-celebration-overlay">
            <div className="op-celebration-content">
              <div className="op-celebration-emoji">🎉</div>
              <h2 className="op-celebration-text">Perfect Sequence!</h2>
              <p className="op-celebration-subtext">Great job arranging all items correctly!</p>
            </div>
          </div>
        )}

        {/* Wrong Answer Overlay */}
        {showWrong && (
          <div className="op-celebration-overlay">
            <div className="op-celebration-content op-celebration-wrong">
              <div className="op-celebration-emoji">❌</div>
              <h2 className="op-celebration-text">Not Quite Right!</h2>
              <p className="op-celebration-subtext">Keep trying! You've attempted this {attempts} time{attempts > 1 ? 's' : ''}</p>
            </div>
          </div>
        )}
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="op-rules-modal" onClick={() => setShowRules(false)}>
          <div className="op-rules-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="op-rules-modal-header">
              <h2 className="op-rules-modal-title">📋 Game Rules</h2>
              <button 
                className="op-rules-close-btn"
                onClick={() => setShowRules(false)}
              >
                ✕
              </button>
            </div>
            <div className="op-rules-list">
              {gameRules.map((rule, idx) => (
                <div key={idx} className="op-rule-item">
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

export default OrderingPuzzle;
