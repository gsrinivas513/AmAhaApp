// src/puzzles/DragPuzzle.jsx
// Drag & drop puzzle UI with attractive design
import React, { useState, useMemo } from "react";
import SiteLayout from "../layouts/SiteLayout";

export default function DragPuzzle({ puzzle, onComplete, isInline = false }) {
  // Parse draggables and targets from various data formats
  const { draggables, targets, correctAnswers } = useMemo(() => {
    let draggables = [];
    let targets = [];
    let correctAnswers = {};
    
    // Format 1: puzzle.data.draggables and puzzle.data.targets (legacy)
    if (puzzle.data?.draggables && puzzle.data?.targets) {
      draggables = Array.isArray(puzzle.data.draggables) 
        ? puzzle.data.draggables 
        : puzzle.data.draggables.split(",").map(s => s.trim());
      targets = Array.isArray(puzzle.data.targets) 
        ? puzzle.data.targets 
        : puzzle.data.targets.split(",").map(s => s.trim());
    }
    // Format 2: puzzle.items and puzzle.dropZones (new format from InitializePuzzleFeature)
    else if (puzzle.items && puzzle.dropZones) {
      draggables = puzzle.items.map(item => item.text || item.label || String(item.id));
      targets = puzzle.dropZones;
      // Build correct answers map
      puzzle.items.forEach(item => {
        const itemLabel = item.text || item.label || String(item.id);
        correctAnswers[itemLabel] = item.correctZone;
      });
    }
    // Format 3: puzzle.draggables and puzzle.targets (direct)
    else if (puzzle.draggables && puzzle.targets) {
      draggables = Array.isArray(puzzle.draggables) 
        ? puzzle.draggables 
        : puzzle.draggables.split(",").map(s => s.trim());
      targets = Array.isArray(puzzle.targets) 
        ? puzzle.targets 
        : puzzle.targets.split(",").map(s => s.trim());
    }
    
    return { draggables, targets, correctAnswers };
  }, [puzzle]);

  const [placed, setPlaced] = useState({});
  const [done, setDone] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);

  function handleDragStart(item) {
    setDraggedItem(item);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(target) {
    if (draggedItem) {
      setPlaced(p => ({ ...p, [draggedItem]: target }));
      setDraggedItem(null);
    }
  }

  function handlePlace(item, target) {
    setPlaced(p => ({ ...p, [item]: target }));
  }

  function check() {
    // Check if all items are placed correctly
    let allCorrect = true;
    
    if (Object.keys(correctAnswers).length > 0) {
      // Validate against correct answers
      allCorrect = draggables.every(item => {
        const userAnswer = placed[item];
        const correctAnswer = correctAnswers[item];
        return userAnswer === correctAnswer;
      });
    } else {
      // Simple check: all items are placed in some target
      allCorrect = draggables.every(item => placed[item]);
    }
    
    setIsCorrect(allCorrect);
    setDone(true);
    setAttempts(attempts + 1);
    if (allCorrect) {
      setTimeout(() => onComplete(), 1500);
    }
  }

  function reset() {
    setDone(false);
    setIsCorrect(false);
    setPlaced({});
    setAttempts(0);
  }

  if (draggables.length === 0 || targets.length === 0) {
    return <div className="p-8 text-center text-red-600">No items or targets found in puzzle</div>;
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
                <p className="text-gray-700">Drag each item to the correct category</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">2</span>
                <p className="text-gray-700">Match items with their correct drop zone</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">3</span>
                <p className="text-gray-700">Click "Check" when all items are placed</p>
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

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🎨 {puzzle.title}</h1>
            <p className="text-gray-600">{puzzle.description}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-pink-500">🎯</div>
              <div className="text-xs text-gray-500 mt-1">Attempts</div>
              <div className="text-2xl font-bold text-gray-800">{attempts}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">✓</div>
              <div className="text-xs text-gray-500 mt-1">Status</div>
              <div className="text-sm font-bold text-gray-800">{done ? (isCorrect ? "✅ Done" : "❌ Wrong") : "🎮 Playing"}</div>
            </div>
          </div>

          {/* Main Puzzle Area */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            {/* Items to Drag */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📦 Items to Sort:</h3>
              <div className="flex flex-wrap gap-3">
                {draggables.map(item => (
                  <div
                    key={item}
                    draggable={!done}
                    onDragStart={() => handleDragStart(item)}
                    onDragEnd={() => setDraggedItem(null)}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all transform cursor-grab active:cursor-grabbing ${
                      placed[item]
                        ? "bg-gray-200 text-gray-500 opacity-50"
                        : "bg-gradient-to-r from-pink-400 to-orange-400 text-white shadow-lg hover:shadow-xl hover:scale-105"
                    } ${draggedItem === item ? "opacity-60 scale-95" : ""} ${done ? "cursor-not-allowed" : ""}`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Drop Zones */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">🎯 Categories:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {targets.map(target => (
                  <div
                    key={target}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(target)}
                    className={`border-3 border-dashed rounded-xl p-6 min-h-[140px] transition ${
                      draggedItem ? "border-purple-500 bg-purple-100" : "border-purple-300 bg-purple-50"
                    }`}
                  >
                    <h4 className="font-bold text-purple-700 mb-4 text-lg">📍 {target}</h4>
                    <div className="space-y-2">
                      {draggables
                        .filter(item => placed[item] === target)
                        .map(item => (
                          <div
                            key={item}
                            draggable={!done}
                            onDragStart={() => handleDragStart(item)}
                            onDragEnd={() => setDraggedItem(null)}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-teal-400 text-white font-semibold cursor-grab active:cursor-grabbing hover:shadow-md transition"
                          >
                            ✓ {item}
                          </div>
                        ))}
                      {draggables.filter(item => placed[item] === target).length === 0 && (
                        <p className="text-purple-400 text-sm italic">Drag items here...</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unplaced Items Counter */}
            {Object.keys(draggables.filter(item => !placed[item])).length > 0 && (
              <p className="text-center text-gray-600 text-sm mt-6">
                📌 {draggables.filter(item => !placed[item]).length} items remaining
              </p>
            )}
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
                  disabled={draggables.some(item => !placed[item])}
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
                    <h2 className="text-2xl font-bold text-green-600 mb-2">Perfect Match!</h2>
                    <p className="text-gray-600 mb-4">All items are correctly sorted!</p>
                  </div>
                ) : (
                  <div className="text-center flex-1">
                    <div className="text-6xl mb-4">🤔</div>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Not Quite Right</h2>
                    <p className="text-gray-600 mb-4">Check your placements and try again!</p>
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
