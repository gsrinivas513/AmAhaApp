// src/puzzles/PuzzlePlayPage.jsx
// Loads a puzzle and renders the correct type.
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPuzzleById } from "../quiz/services/puzzleService";
import MatchingPuzzle from "./MatchingPuzzle";
import OrderingPuzzle from "./OrderingPuzzle";
import DragPuzzle from "./DragPuzzle";
import PuzzleFinish from "./PuzzleFinish";

export default function PuzzlePlayPage() {
  const { categoryName, topicName, subtopicName, puzzleId } = useParams();
  const [puzzle, setPuzzle] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    getPuzzleById(puzzleId).then(data => {
      console.log("🧩 Puzzle loaded:", data);
      if (data) {
        console.log("  - Type:", data.type);
        console.log("  - Title:", data.title);
      }
      setPuzzle(data);
    });
  }, [puzzleId]);

  if (!puzzle) return <div className="p-8 text-center">Loading...</div>;
  if (completed) return <PuzzleFinish puzzle={puzzle} />;

  console.log("🎮 Rendering puzzle type:", puzzle.type);

  switch (puzzle.type) {
    case "matching":
      return <MatchingPuzzle puzzle={puzzle} onComplete={() => setCompleted(true)} />;
    case "ordering":
      return <OrderingPuzzle puzzle={puzzle} onComplete={() => setCompleted(true)} />;
    case "drag":
      return <DragPuzzle puzzle={puzzle} onComplete={() => setCompleted(true)} />;
    default:
      return (
        <div className="p-8 text-center">
          <div className="text-red-600 mb-4">Unknown puzzle type: <b>{puzzle.type}</b></div>
          <div className="text-gray-600 text-sm">
            <p>Puzzle ID: {puzzle.id}</p>
            <p>Title: {puzzle.title}</p>
            <details className="mt-4 text-left">
              <summary className="cursor-pointer font-bold">Full puzzle data:</summary>
              <pre className="bg-gray-100 p-4 mt-2 overflow-auto text-xs">
                {JSON.stringify(puzzle, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      );
  }
}
