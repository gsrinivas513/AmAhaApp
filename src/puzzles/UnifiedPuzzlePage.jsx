import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { getPuzzleById } from "../quiz/services/puzzleService";
import { useAuth } from "../components/AuthProvider";
import { getRandomPuzzleByCategory } from "./quickPlayService";

// Puzzle components - will refactor these to work inline
import MatchingPuzzle from "./MatchingPuzzle";
import DragPuzzle from "./DragPuzzle";

// Visual puzzle renderers (includes OrderingPuzzle)
import PictureWordPuzzle from "./renderers/PictureWordPuzzle";
import SpotDifferencePuzzle from "./renderers/SpotDifferencePuzzle";
import FindPairPuzzle from "./renderers/FindPairPuzzle";
import PictureShadowPuzzle from "./renderers/PictureShadowPuzzle";
import OrderingPuzzle from "./renderers/OrderingPuzzle";

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
        console.log("📍 Loading puzzle with ID:", puzzleId);
        const data = await getPuzzleById(puzzleId);
        console.log("🧩 Puzzle loaded:", data);
        if (data) {
          console.log("  - Type:", data.type);
          console.log("  - Title:", data.title);
          console.log("  - Full data:", data);
        } else {
          console.warn("⚠️ Puzzle not found with ID:", puzzleId);
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
    navigate(-1); // Go back to previous page in history
  };

  // Handle quick play random puzzle
  const handleQuickPlayRandom = async () => {
    try {
      const randomPuzzle = await getRandomPuzzleByCategory(categoryName || "General");
      if (randomPuzzle) {
        navigate(`/play/${randomPuzzle.id}`);
      }
    } catch (error) {
      console.error("Error loading random puzzle:", error);
    }
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
    case "pictureword":
      puzzleComponent = (
        <PictureWordPuzzle
          puzzle={puzzle}
          onComplete={handlePuzzleComplete}
        />
      );
      break;
    case "spotdifference":
      puzzleComponent = (
        <SpotDifferencePuzzle
          puzzle={puzzle}
          onComplete={handlePuzzleComplete}
        />
      );
      break;
    case "findpair":
    case "findpairs":
      puzzleComponent = (
        <FindPairPuzzle
          puzzle={puzzle}
          onComplete={handlePuzzleComplete}
        />
      );
      break;
    case "pictureshadow":
      puzzleComponent = (
        <PictureShadowPuzzle
          puzzle={puzzle}
          onComplete={handlePuzzleComplete}
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

  // Show completion modal inline (overlay on same page)
  return (
    <SiteLayout>
      {/* Puzzle Content */}
      <div style={{ background: "#ffffff", minHeight: "100vh", padding: "12px 12px 32px 12px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Button Container */}
          <div className="mb-6 flex justify-between items-center">
            {/* Back Button */}
            <button
              onClick={handleNavigateBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all font-semibold text-white text-sm shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <span>←</span> Back to Explore More Puzzles
            </button>
            {/* Quick Play Random Button */}
            <button
              onClick={handleQuickPlayRandom}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all font-semibold text-white text-sm shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <span>⚡</span> Quick Play Random
            </button>
          </div>
          {puzzleComponent}
        </div>
      </div>

      {/* Completion Modal - Overlay on same page */}
      {completed && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
            <div className="text-6xl mb-6 animate-bounce">🎉</div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Puzzle Complete!</h1>
            <p className="text-gray-600 mb-8">Great job! You solved the puzzle.</p>

            <div className="flex gap-4 justify-center flex-col sm:flex-row">
              <button
                onClick={handleNavigateBack}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                ← Back to Puzzles
              </button>
              <button
                onClick={() => {
                  setCompleted(false);
                  setPuzzle(null);
                  // Reload puzzle to reset it
                  window.location.reload();
                }}
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
