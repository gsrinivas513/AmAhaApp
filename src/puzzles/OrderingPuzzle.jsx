// src/puzzles/OrderingPuzzle.jsx
// Ordering puzzle UI with attractive design and level selection
import React, { useState, useMemo } from "react";
import SiteLayout from "../layouts/SiteLayout";

export default function OrderingPuzzle({ puzzle, onComplete, isInline = false }) {
  // Parse items and correctOrder from various data formats
  const { initialItems, correctOrder, allLevels } = useMemo(() => {
    let items = [];
    let correct = [];
    let levels = [];
    
    // Format 1: puzzle.data.items (legacy)
    if (puzzle.data?.items && Array.isArray(puzzle.data.items)) {
      items = puzzle.data.items;
      correct = puzzle.data.correctOrder || [...items].sort();
      levels = puzzle.data.levels || puzzle.data.numberRanges || [];
    }
    // Format 2: puzzle.items and puzzle.correctOrder (new format from InitializePuzzleFeature)
    else if (puzzle.items && Array.isArray(puzzle.items)) {
      items = puzzle.items;
      correct = puzzle.correctOrder || [...items].sort();
      levels = puzzle.levels || [];
    }
    // Format 3: Parse from correctAnswer string: "3,1,2" or similar
    else if (puzzle.correctAnswer && typeof puzzle.correctAnswer === "string") {
      items = puzzle.correctAnswer.split(",").map(s => s.trim());
      correct = [...items].sort();
    }
    
    return { initialItems: items, correctOrder: correct, allLevels: levels };
  }, [puzzle]);

  // Level selection state
  const [selectedLevel, setSelectedLevel] = useState(0);
  
  // Filter items for current level
  const getItemsForLevel = (items, level) => {
    if (!allLevels || allLevels.length === 0) {
      return items; // No levels defined, return all items
    }
    
    if (level >= allLevels.length) {
      return items; // Invalid level, return all items
    }
    
    const levelConfig = allLevels[level];
    if (!levelConfig) return items;
    
    // Filter items based on range (start and end)
    return items.filter(item => {
      const itemDisplay = String(item);
      const itemNum = parseInt(itemDisplay);
      
      if (isNaN(itemNum)) return false;
      
      const start = levelConfig.start || levelConfig.min;
      const end = levelConfig.end || levelConfig.max;
      return itemNum >= start && itemNum <= end;
    });
  };

  const levelItems = useMemo(() => {
    return getItemsForLevel(initialItems, selectedLevel);
  }, [initialItems, selectedLevel, allLevels]);

  const levelCorrectOrder = useMemo(() => {
    return getItemsForLevel(correctOrder, selectedLevel);
  }, [correctOrder, selectedLevel, allLevels]);

  const [order, setOrder] = useState(levelItems);
  const [done, setDone] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [moves, setMoves] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Update order when level changes
  React.useEffect(() => {
    setOrder(levelItems);
    setDone(false);
    setIsCorrect(false);
    setMoves(0);
    setDraggedIndex(null);
  }, [selectedLevel, levelItems]);

  function move(idx, dir) {
    const newOrder = [...order];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= newOrder.length) return;
    [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];
    setOrder(newOrder);
    setMoves(moves + 1);
  }

  function handleDragStart(idx) {
    setDraggedIndex(idx);
  }

  function handleDrop(targetIdx) {
    if (draggedIndex === null || draggedIndex === targetIdx) return;
    const newOrder = [...order];
    [newOrder[draggedIndex], newOrder[targetIdx]] = [newOrder[targetIdx], newOrder[draggedIndex]];
    setOrder(newOrder);
    setMoves(moves + 1);
    setDraggedIndex(null);
  }

  function check() {
    // Check if current order matches correct order for current level
    const correct = order.every((item, idx) => item === levelCorrectOrder[idx]);
    setIsCorrect(correct);
    setDone(true);
    if (correct) {
      setTimeout(() => onComplete(), 1500);
    }
  }

  function reset() {
    setDone(false);
    setIsCorrect(false);
    setOrder(levelItems);
    setMoves(0);
    setDraggedIndex(null);
  }

  if (initialItems.length === 0) {
    return <div className="p-8 text-center text-red-600">No items found in puzzle</div>;
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
                <p className="text-gray-700">Arrange all items in the correct order</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">2</span>
                <p className="text-gray-700">Use ↑↓ buttons to move items up or down</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">3</span>
                <p className="text-gray-700">Click "Check" to verify your answer</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">4</span>
                <p className="text-gray-700">Try to solve it in as few moves as possible</p>
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

      <div className={isInline ? "py-0" : "min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-teal-50 py-8"}>
        <div className={isInline ? "" : "max-w-2xl mx-auto px-4"}>
          {/* Header */}
          <div className={isInline ? "mb-4" : "text-center mb-8"}>
            <h1 className={isInline ? "text-2xl font-bold text-gray-800 mb-2" : "text-4xl font-bold text-gray-800 mb-2"}>🔢 {puzzle.title}</h1>
            <p className="text-gray-600">{puzzle.description}</p>
          </div>

          {/* Level Selection - Only show if levels are defined and NOT inline */}
          {!isInline && allLevels && allLevels.length > 0 && (
            <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">📚 Select Level</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {allLevels.map((level, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedLevel(index)}
                    className={`p-4 rounded-lg font-bold transition text-center ${
                      selectedLevel === index
                        ? 'bg-gradient-to-r from-orange-500 to-teal-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-xl font-bold">Level {index + 1}</div>
                    <div className="text-xs mt-1 opacity-90">
                      {level.start || level.min}-{level.end || level.max}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-orange-500">⏱️</div>
              <div className="text-xs text-gray-500 mt-1">Moves</div>
              <div className="text-2xl font-bold text-gray-800">{moves}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-teal-500">✓</div>
              <div className="text-xs text-gray-500 mt-1">Status</div>
              <div className="text-sm font-bold text-gray-800">{done ? (isCorrect ? "✅ Done" : "❌ Wrong") : "🎮 Playing"}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">💡</div>
              <div className="text-xs text-gray-500 mt-1">Items</div>
              <div className="text-2xl font-bold text-gray-800">{order.length}</div>
            </div>
          </div>

          {/* Puzzle Area */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="space-y-3">
              {order.map((item, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(idx)}
                  className={`flex items-center gap-4 p-4 rounded-lg cursor-move transition-all ${
                    draggedIndex === idx
                      ? "opacity-50 scale-95"
                      : "bg-gradient-to-r from-blue-100 to-blue-50 hover:shadow-md hover:scale-102"
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    {typeof item === 'object' && item.image && (
                      <img 
                        src={item.image} 
                        alt={item.label} 
                        className="w-10 h-10 object-cover rounded" 
                      />
                    )}
                    {typeof item === 'object' && item.color && !item.image && (
                      <div 
                        className="w-6 h-6 rounded" 
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                    <span className="text-lg font-semibold text-gray-800">
                      {typeof item === 'object' ? item.label : item}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => move(idx, -1)}
                      disabled={done || idx === 0}
                      className="p-2 rounded-lg bg-orange-100 hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      title="Move up"
                    >
                      ⬆️
                    </button>
                    <button
                      onClick={() => move(idx, 1)}
                      disabled={done || idx === order.length - 1}
                      className="p-2 rounded-lg bg-teal-100 hover:bg-teal-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      title="Move down"
                    >
                      ⬇️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions text */}
            <p className="text-center text-gray-600 text-sm mt-6">
              📌 Arrange the items in order from 1 to {order.length}
            </p>
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
                  onClick={check}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-lg text-white font-bold rounded-lg transition"
                >
                  ✓ Check Answer
                </button>
              </>
            ) : (
              <>
                {isCorrect ? (
                  <div className="text-center flex-1">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-green-600 mb-2">Awesome! You Won!</h2>
                    <p className="text-gray-600 mb-4">You solved it in {moves} moves</p>
                  </div>
                ) : (
                  <div className="text-center flex-1">
                    <div className="text-6xl mb-4">🤔</div>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Not Quite Right</h2>
                    <p className="text-gray-600 mb-4">Check your order and try again!</p>
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
