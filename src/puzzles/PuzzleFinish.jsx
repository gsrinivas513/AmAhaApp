// src/puzzles/PuzzleFinish.jsx
// Puzzle completion reward UI.
import React from "react";
import { Link } from "react-router-dom";

export default function PuzzleFinish({ puzzle }) {
  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow pastel-card text-center">
      <h2 className="text-2xl font-bold mb-4">🎉 Puzzle Complete!</h2>
      <div className="mb-2 text-lg">XP Earned: <span className="font-bold">{puzzle.xp}</span></div>
      <div className="mb-4 text-lg">Coins Earned: <span className="font-bold">{puzzle.coins}</span></div>
      <Link to={`/puzzle/${encodeURIComponent(puzzle.category)}`} className="btn-primary">Next Puzzle</Link>
    </div>
  );
}
