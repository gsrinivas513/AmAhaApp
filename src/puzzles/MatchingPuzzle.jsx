// src/puzzles/MatchingPuzzle.jsx
// Matching pairs puzzle UI with attractive design
import React, { useState, useMemo } from "react";
import SiteLayout from "../layouts/SiteLayout";

export default function MatchingPuzzle({ puzzle, onComplete, isInline = false }) {
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
  const [isCorrect, setIsCorrect] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [attempts, setAttempts] = useState(0);

  function handleMatch(left, right) {
    setMatches(m => ({ ...m, [left]: right }));
  }

  function check() {
    const correct = pairs.every(pair => matches[pair.left] === pair.right);
    setIsCorrect(correct);
    setDone(true);
    setAttempts(attempts + 1);
    if (correct) {
      setTimeout(() => onComplete(), 1500);
    }
  }

  function reset() {
    setDone(false);
    setIsCorrect(false);
    setMatches({});
    setAttempts(0);
  }

  if (pairs.length === 0) {
    return <div className="p-8 text-center text-red-600">No pairs found in puzzle</div>;
  }

  const content = (
    <>
      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">How to Play</h2>
              <button 
                onClick={() => setShowInstructions(false)}
                className="text-2xl text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">1</span>
                <p className="text-gray-700">Look at items on the left</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">2</span>
                <p className="text-gray-700">Select matching items from the right</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">3</span>
                <p className="text-gray-700">Match all pairs correctly</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">4</span>
                <p className="text-gray-700">Click "Check" to verify</p>
              </div>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-teal-500 text-white font-bold rounded-lg hover:shadow-lg transition"
            >
              Got It! 🚀
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🎭 {puzzle.title}</h1>
            <p className="text-gray-600">{puzzle.description}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-indigo-500">🎯</div>
              <div className="text-xs text-gray-500 mt-1">Attempts</div>
              <div className="text-2xl font-bold text-gray-800">{attempts}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">✓</div>
              <div className="text-xs text-gray-500 mt-1">Status</div>
              <div className="text-sm font-bold text-gray-800">{done ? (isCorrect ? "✅ Done" : "❌ Wrong") : "🎮 Playing"}</div>
            </div>
          </div>

          {/* Puzzle Area */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Items to Match */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">📍 Match These:</h3>
                <div className="space-y-3">
                  {pairs.map((pair, idx) => (
                    <div
                      key={pair.left}
                      className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-indigo-100 to-blue-100 border-2 border-indigo-200"
                    >
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <span className="flex-1 text-lg font-semibold text-indigo-900">{pair.left}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Dropdowns */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">✓ With These:</h3>
                <div className="space-y-3">
                  {pairs.map((pair, idx) => (
                    <div key={pair.left} className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <select
                        value={matches[pair.left] || ""}
                        onChange={e => handleMatch(pair.left, e.target.value)}
                        className={`flex-1 rounded-lg border-2 px-3 py-2 font-semibold transition ${
                          matches[pair.left]
                            ? "border-green-400 bg-green-50 text-gray-800"
                            : "border-gray-300 bg-white text-gray-700"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        disabled={done}
                      >
                        <option value="">Select...</option>
                        {pairs.map(p => (
                          <option key={p.right} value={p.right}>
                            {p.right}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Progress</span>
                <span className="text-sm font-bold text-indigo-600">
                  {Object.keys(matches).filter(k => matches[k]).length}/{pairs.length}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                  style={{
                    width: `${(Object.keys(matches).filter(k => matches[k]).length / pairs.length) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            {!done ? (
              <>
                <button
                  onClick={() => setShowInstructions(true)}
                  className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition"
                >
                  📋 Rules
                </button>
                <button
                  onClick={reset}
                  className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition"
                >
                  🔄 Reset
                </button>
                <button
                  onClick={check}
                  disabled={!pairs.every(pair => matches[pair.left])}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-lg text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  ✓ Check Answer
                </button>
              </>
            ) : (
              <>
                {isCorrect ? (
                  <div className="text-center flex-1">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-green-600 mb-2">Perfect Matches!</h2>
                    <p className="text-gray-600 mb-4">All pairs matched correctly!</p>
                  </div>
                ) : (
                  <div className="text-center flex-1">
                    <div className="text-6xl mb-4">🤔</div>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Not All Correct</h2>
                    <p className="text-gray-600 mb-4">Some pairs don't match. Try again!</p>
                    <button
                      onClick={reset}
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-lg hover:shadow-lg transition"
                    >
                      🔄 Try Again
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  // Return with or without SiteLayout wrapper based on isInline flag
  if (isInline) {
    return content;
  }

  // For backward compatibility with old component usage (standalone mode)
  return (
    <SiteLayout>
      {content}
    </SiteLayout>
  );
}
