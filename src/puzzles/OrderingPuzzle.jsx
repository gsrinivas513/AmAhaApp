// src/puzzles/OrderingPuzzle.jsx
// Ordering puzzle UI.
import React, { useState, useMemo } from "react";

export default function OrderingPuzzle({ puzzle, onComplete }) {
  // Parse items and correctOrder from various data formats
  const { initialItems, correctOrder } = useMemo(() => {
    let items = [];
    let correct = [];
    
    // Format 1: puzzle.data.items (legacy)
    if (puzzle.data?.items && Array.isArray(puzzle.data.items)) {
      items = puzzle.data.items;
      correct = puzzle.data.correctOrder || [...items].sort();
    }
    // Format 2: puzzle.items and puzzle.correctOrder (new format from InitializePuzzleFeature)
    else if (puzzle.items && Array.isArray(puzzle.items)) {
      items = puzzle.items;
      correct = puzzle.correctOrder || [...items].sort();
    }
    // Format 3: Parse from correctAnswer string: "3,1,2" or similar
    else if (puzzle.correctAnswer && typeof puzzle.correctAnswer === "string") {
      items = puzzle.correctAnswer.split(",").map(s => s.trim());
      correct = [...items].sort();
    }
    
    return { initialItems: items, correctOrder: correct };
  }, [puzzle]);

  const [order, setOrder] = useState(initialItems);
  const [done, setDone] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  function move(idx, dir) {
    const newOrder = [...order];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= newOrder.length) return;
    [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];
    setOrder(newOrder);
  }

  function check() {
    // Check if current order matches correct order
    const correct = order.every((item, idx) => item === correctOrder[idx]);
    setIsCorrect(correct);
    setDone(true);
    if (correct) onComplete();
  }

  if (initialItems.length === 0) {
    return <div className="p-8 text-center text-red-600">No items found in puzzle</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow pastel-card">
      <h2 className="font-bold text-xl mb-4">Arrange in order</h2>
      <ul className="mb-4">
        {order.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-100 rounded">{item}</span>
            <button className="btn" onClick={() => move(idx, -1)} disabled={done}>↑</button>
            <button className="btn" onClick={() => move(idx, 1)} disabled={done}>↓</button>
          </li>
        ))}
      </ul>
      {!done && <button className="btn-primary" onClick={check}>Check</button>}
      {done && isCorrect && <div className="mt-4 text-green-600 font-bold">🎉 Correct! Puzzle Complete!</div>}
      {done && !isCorrect && (
        <div className="mt-4">
          <div className="text-red-600 font-bold mb-2">❌ Not quite right. Try again!</div>
          <button className="btn-primary" onClick={() => { setDone(false); setOrder(initialItems); }}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
