// src/puzzles/renderers/OrderingPuzzle.jsx
// Ordering/sequencing puzzle renderer
import React, { useState, useEffect } from "react";
import { savePuzzleProgress } from "../../quiz/services/visualPuzzleService";
import "../../styles/puzzle-renderers.css";

function OrderingPuzzle({ puzzle, onComplete }) {
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const puzzleItems = puzzle.data.items || [];
    // Shuffle items
    const shuffled = [...puzzleItems].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setOrder([]);
  }, [puzzle]);

  useEffect(() => {
    if (order.length === items.length && items.length > 0) {
      // Check if order is correct
      const isCorrect = order.every((id, index) => {
        const item = items.find((i) => i.id === id);
        return item && item.order === index + 1;
      });

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
      }
    }
  }, [order, items, puzzle.id, attempts, onComplete]);

  const handleDragStart = (e, itemId) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("itemId", itemId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropOnSequence = (e) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("itemId");
    if (!order.includes(itemId)) {
      setOrder([...order, itemId]);
    }
  };

  const handleRemoveFromSequence = (index) => {
    setOrder(order.filter((_, i) => i !== index));
    setAttempts((prev) => prev + 1);
  };

  const getAvailableItems = () => {
    return items.filter((item) => !order.includes(item.id));
  };

  return (
    <div className="puzzle-container ordering-puzzle">
      <div className="puzzle-header">
        <h2>{puzzle.title}</h2>
        <div className="puzzle-stats">
          <span>Progress: {order.length}/{items.length}</span>
        </div>
      </div>

      {showCelebration && (
        <div className="celebration">
          <div className="confetti">🎉</div>
          <h3>Perfect Sequence!</h3>
        </div>
      )}

      <div className="ordering-content">
        <div className="sequence-builder">
          <h3>Arrange in order:</h3>
          <div
            className="sequence-area"
            onDragOver={handleDragOver}
            onDrop={handleDropOnSequence}
          >
            {order.length === 0 && (
              <p className="drop-hint">Drag items here in correct order</p>
            )}
            {order.map((itemId, index) => {
              const item = items.find((i) => i.id === itemId);
              return (
                <div key={itemId} className="sequence-step">
                  <span className="step-number">{index + 1}</span>
                  <div className="step-content">
                    {item.image && <img src={item.image} alt="" />}
                    {item.label && <span>{item.label}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFromSequence(index)}
                    className="btn-remove-step"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="items-available">
          <h3>Items to arrange:</h3>
          <div className="items-grid">
            {getAvailableItems().map((item) => (
              <div
                key={item.id}
                className="draggable-item"
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
              >
                {item.image && <img src={item.image} alt="" />}
                {item.label && <span className="item-label">{item.label}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderingPuzzle;
