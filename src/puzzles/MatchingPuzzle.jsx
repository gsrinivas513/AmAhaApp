// src/puzzles/MatchingPuzzle.jsx
// Matching pairs puzzle UI.
import React, { useState, useMemo } from "react";

export default function MatchingPuzzle({ puzzle, onComplete }) {
  // Parse pairs from various data formats
  const pairs = useMemo(() => {
    // Format 1: puzzle.data.pairs with {left, right}
    if (puzzle.data?.pairs && Array.isArray(puzzle.data.pairs)) {
      return puzzle.data.pairs.map(p => ({
        left: p.left || p.image || p.id,
        right: p.right || p.match || p.id
      }));
    }
    
    // Format 2: puzzle.pairs with {image, match} (new format from InitializePuzzleFeature)
    if (puzzle.pairs && Array.isArray(puzzle.pairs)) {
      return puzzle.pairs.map(p => ({
        left: p.left || p.image || String(p.id),
        right: p.right || p.match || String(p.id)
      }));
    }
    
    // Format 3: Parse from correctAnswer string: "1-One,2-Two,3-Three"
    if (puzzle.correctAnswer && typeof puzzle.correctAnswer === "string") {
      return puzzle.correctAnswer.split(",").map(pair => {
        const [left, right] = pair.split("-");
        return { left: left.trim(), right: right.trim() };
      });
    }
    
    return [];
  }, [puzzle]);

  const [matches, setMatches] = useState({});
  const [done, setDone] = useState(false);

  function handleMatch(left, right) {
    setMatches(m => ({ ...m, [left]: right }));
  }

  function check() {
    const correct = pairs.every(pair => matches[pair.left] === pair.right);
    setDone(true);
    if (correct) onComplete();
  }

  if (pairs.length === 0) {
    return <div className="p-8 text-center text-red-600">No pairs found in puzzle</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow pastel-card">
      <h2 className="font-bold text-xl mb-4">Match the pairs</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          {pairs.map(pair => (
            <div key={pair.left} className="mb-2">{pair.left}</div>
          ))}
        </div>
        <div>
          {pairs.map(pair => (
            <select
              key={pair.left}
              value={matches[pair.left] || ""}
              onChange={e => handleMatch(pair.left, e.target.value)}
              className="rounded border p-1 w-full"
              disabled={done}
            >
              <option value="">Select</option>
              {pairs.map(p => (
                <option key={p.right} value={p.right}>{p.right}</option>
              ))}
            </select>
          ))}
        </div>
      </div>
      {!done && <button className="btn-primary" onClick={check}>Check</button>}
      {done && <div className="mt-4 text-green-600 font-bold">Puzzle Complete!</div>}
    </div>
  );
}
