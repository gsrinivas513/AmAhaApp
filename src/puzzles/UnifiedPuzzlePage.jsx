import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { getPuzzleById } from "../quiz/services/puzzleService";
import { useAuth } from "../components/AuthProvider";

// Puzzle components - will refactor these to work inline
import MatchingPuzzle from "./MatchingPuzzle";
import OrderingPuzzle from "./OrderingPuzzle";
import DragPuzzle from "./DragPuzzle";

export default function UnifiedPuzzlePage() {
  const { categoryName, topicName, puzzleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [puzzle, setPuzzle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  // Load puzzle data
  useEffect(() => {
    const loadPuzzle = async () => {
      try {
        setLoading(true);
        const data = await getPuzzleById(puzzleId);
        console.log("🧩 Puzzle loaded:", data);
        if (data) {
          console.log("  - Type:", data.type);
          console.log("  - Title:", data.title);
        }
        setPuzzle(data);
      } catch (error) {
        console.error("Error loading puzzle:", error);
      } finally {
        setLoading(false);
      }
    };

    if (puzzleId) {
      loadPuzzle();
    }
  }, [puzzleId]);

  // Handle puzzle completion
  const handlePuzzleComplete = () => {
    console.log("🎉 Puzzle completed!");
    setCompleted(true);
    // Could track progress here if needed
  };

  // Handle navigation back
  const handleNavigateBack = () => {
    navigate(`/puzzle/${encodeURIComponent(categoryName)}/${encodeURIComponent(topicName)}`);
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="p-8 text-center">Loading puzzle…</div>
      </SiteLayout>
    );
  }

  if (!puzzle) {
    return (
      <SiteLayout>
        <div className="p-8 text-center text-red-600">Puzzle not found</div>
      </SiteLayout>
    );
  }

  console.log("🎮 Rendering puzzle type:", puzzle.type);

  // Normalize puzzle type
  const normalizedType = puzzle.type?.toLowerCase().replace(/-/g, '');

  // Render appropriate puzzle component based on type
  let puzzleComponent = null;

  switch (normalizedType) {
    case "matching":
    case "matchingpairs":
    case "findpairs":
      puzzleComponent = (
        <MatchingPuzzle 
          puzzle={puzzle} 
          onComplete={handlePuzzleComplete}
          isInline={true}
        />
      );
      break;
    case "ordering":
      puzzleComponent = (
        <OrderingPuzzle 
          puzzle={puzzle} 
          onComplete={handlePuzzleComplete}
          isInline={true}
        />
      );
      break;
    case "drag":
    case "dragdrop":
      puzzleComponent = (
        <DragPuzzle 
          puzzle={puzzle} 
          onComplete={handlePuzzleComplete}
          isInline={true}
        />
      );
      break;
    case "pictureword":
    case "spotdifference":
    case "pictureshadow":
      // For visual puzzles without dedicated components yet
      puzzleComponent = (
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
      break;
    default:
      puzzleComponent = (
        <div className="p-8 text-center">
          <div className="text-red-600 mb-4">Unknown puzzle type: <b>{puzzle.type}</b></div>
          <div className="text-gray-600 text-sm">
            <p>Puzzle ID: {puzzle.id}</p>
            <p>Title: {puzzle.title}</p>
          </div>
        </div>
      );
  }

  // Show completion screen if puzzle is completed
  if (completed) {
    return (
      <SiteLayout>
        <div className="p-8 text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold mb-4">Puzzle Complete!</h1>
          <p className="text-gray-600 mb-8">Great job! You solved the puzzle.</p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleNavigateBack}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
            >
              ← Back to Puzzles
            </button>
            <button
              onClick={() => {
                setCompleted(false);
                setPuzzle(null);
              }}
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div style={{ background: "#ffffff", minHeight: "100vh", padding: "12px 12px 32px 12px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {puzzleComponent}
        </div>
      </div>
    </SiteLayout>
  );
}
