// src/puzzles/PuzzlePlayPage.jsx
// Loads a puzzle and renders the correct type.
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { getPuzzleById } from "../quiz/services/puzzleService";
import MatchingPuzzle from "./MatchingPuzzle";
import OrderingPuzzle from "./OrderingPuzzle";
import DragPuzzle from "./DragPuzzle";
import PuzzleFinish from "./PuzzleFinish";
import { trackPuzzleCompletion } from "../utils/integratedTracking";
import { checkAndUnlockAchievements, updateUserLevel } from "../services/gamificationService";
import PracticeModeWrapper from "../components/GameModeWrappers/PracticeModeWrapper";

export default function PuzzlePlayPage() {
  const { categoryName, topicName, subtopicName, puzzleId } = useParams();
  const { user } = useAuth();
  const [puzzle, setPuzzle] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());

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

  const handlePuzzleComplete = async () => {
    // Track puzzle completion
    const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
    
    if (puzzle) {
      await trackPuzzleCompletion({
        puzzleId: puzzle.id,
        puzzleTitle: puzzle.title,
        category: categoryName || puzzle.category || 'Unknown',
        difficulty: puzzle.difficulty || 'Medium',
        timeSpent: timeSpentSeconds,
        xpEarned: puzzle.xp || 10,
        coinsEarned: puzzle.coins || 5,
      });

      // Check for achievements
      if (user?.uid) {
        await checkAndUnlockAchievements(user.uid);
        await updateUserLevel(user.uid, puzzle.xp || 10);
      }
    }

    setCompleted(true);
  };

  if (!puzzle) return <div className="p-8 text-center">Loading...</div>;
  if (completed) return <PuzzleFinish puzzle={puzzle} user={user} />;

  console.log("🎮 Rendering puzzle type:", puzzle.type);

  // Normalize puzzle type to handle different naming conventions
  const normalizedType = puzzle.type?.toLowerCase().replace(/-/g, '');

  const puzzleComponent = (() => {
    switch (normalizedType) {
      case "matching":
      case "matchingpairs":
      case "findpairs":
        return <MatchingPuzzle puzzle={puzzle} onComplete={handlePuzzleComplete} />;
      case "ordering":
        return <OrderingPuzzle puzzle={puzzle} onComplete={handlePuzzleComplete} />;
      case "drag":
      case "dragdrop":
        return <DragPuzzle puzzle={puzzle} onComplete={handlePuzzleComplete} />;
      case "pictureword":
      case "spotdifference":
      case "pictureshadow":
        // For visual puzzles that don't have dedicated components yet
        return (
          <div className="p-8 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🧩</div>
            <h1 className="text-2xl font-bold mb-4">{puzzle.title}</h1>
            <p className="text-gray-600 mb-6">{puzzle.description}</p>
            
            {puzzle.imageUrl && (
              <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={puzzle.imageUrl} 
                  alt={puzzle.title}
                  className="w-full max-h-64 object-cover"
                />
              </div>
            )}
            
            {puzzle.hints && puzzle.hints.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-yellow-800 mb-2">💡 Hints:</h3>
                <ul className="text-sm text-yellow-700">
                  {puzzle.hints.map((hint, i) => (
                    <li key={i}>• {hint}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>Answer:</strong> {puzzle.correctAnswer || "Complete the puzzle to find out!"}
              </p>
            </div>
            
            <button 
              onClick={handlePuzzleComplete}
              className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
            >
              ✓ Mark as Complete
            </button>
          </div>
        );
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
  })();

  // Wrap puzzle in Practice Mode (hints + explanations enabled)
  return <PracticeModeWrapper baseXP={puzzle.xp || 10} hints={true} explanations={true}>
    {puzzleComponent}
  </PracticeModeWrapper>;
}
