// src/puzzles/OrderingPuzzle.jsx
// Ordering puzzle UI.
import React, { useState, useMemo } from "react";

export default function OrderingPuzzle({ puzzle, onComplete }) {
  // Parse items from either data.items or correctAnswer
  const initialItems = useMemo(() => {
    if (puzzle.data?.items && Array.isArray(puzzle.data.items)) {
      return puzzle.data.items;
    }
    
    // Parse from correctAnswer string: "3,1,2" or similar
    if (puzzle.correctAnswer && typeof puzzle.correctAnswer === "string") {
      return puzzle.correctAnswer.split(",").map(s => s.trim());
    }
    
    return [];
  }, [puzzle]);

  const [order, setOrder] = useState(initialItems);
  const [done, setDone] = useState(false);

  function move(idx, dir) {
    const newOrder = [...order];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= newOrder.length) return;
    [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];
    setOrder(newOrder);
  }

  function check() {
    const correct = [...order].sort((a, b) => a - b).every((v, i) => v === order[i]);
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
      {done && <div className="mt-4 text-green-600 font-bold">Puzzle Complete!</div>}
    </div>
  );
}
