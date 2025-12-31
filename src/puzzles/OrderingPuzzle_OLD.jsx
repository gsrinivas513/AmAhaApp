// src/puzzles/OrderingPuzzle.jsx
// Ordering puzzle UI with two-box layout (left: items, right: ordered positions)
import React, { useState, useMemo } from "react";
import SiteLayout from "../layouts/SiteLayout";

export default function OrderingPuzzle({ puzzle, onComplete, isInline = false }) {
  // Helper function to get display text from item (handles both strings and objects)
  const getItemDisplay = (item) => {
    if (typeof item === 'string') {
      return item;
    }
    if (typeof item === 'object' && item !== null) {
      // Try different property names that might contain the display text
      return item.label || item.title || item.text || item.name || String(item.id || item.number || '');
    }
    return String(item);
  };

  // Helper function to get image URL from item
  const getItemImage = (item) => {
    if (typeof item === 'object' && item !== null) {
      return item.image || item.imageUrl || item.img || null;
    }
    return null;
  };

  // Parse items and correctOrder from various data formats
  const { itemsList, correctOrderList } = useMemo(() => {
    let items = [];
    let correctOrder = [];
    
    // Format 1: puzzle.data.items (legacy)
    if (puzzle.data?.items && Array.isArray(puzzle.data.items)) {
      items = puzzle.data.items;
      correctOrder = puzzle.data.correctOrder || [...items].sort((a, b) => {
        const aOrder = typeof a === 'object' ? a.order : a;
        const bOrder = typeof b === 'object' ? b.order : b;
        return (aOrder || 0) - (bOrder || 0);
      });
    }
    // Format 2: puzzle.items and puzzle.correctOrder (new format from InitializePuzzleFeature)
    else if (puzzle.items && Array.isArray(puzzle.items)) {
      items = puzzle.items;
      correctOrder = puzzle.correctOrder || [...items].sort((a, b) => {
        const aOrder = typeof a === 'object' ? a.order : a;
        const bOrder = typeof b === 'object' ? b.order : b;
        return (aOrder || 0) - (bOrder || 0);
      });
    }
    // Format 3: Parse from correctAnswer string: "3,1,2" or similar
    else if (puzzle.correctAnswer && typeof puzzle.correctAnswer === "string") {
      items = puzzle.correctAnswer.split(",").map(s => s.trim());
      correctOrder = [...items].sort();
    }
    
    return { itemsList: items, correctOrderList: correctOrder };
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

  function handleDrop(positionIndex) {
    if (draggedItem) {
      setPlaced(p => ({ ...p, [draggedItem]: positionIndex }));
      setDraggedItem(null);
    }
  }

  function handleRemoveFromPosition(positionIndex) {
    // Find item at this position and remove it
    setPlaced(p => {
      const newPlaced = { ...p };
      Object.keys(newPlaced).forEach(key => {
        if (newPlaced[key] === positionIndex) {
          delete newPlaced[key];
        }
      });
      return newPlaced;
    });
  }

  function check() {
    // Check if all items are placed in correct order
    let allCorrect = true;
    
    for (let i = 0; i < correctOrderList.length; i++) {
      const expectedItem = correctOrderList[i];
      const placedItem = Object.keys(placed).find(key => placed[key] === i);
      
      if (!placedItem) {
        allCorrect = false;
        break;
      }
      
      const expectedDisplay = getItemDisplay(expectedItem);
      const placedDisplay = getItemDisplay(itemsList.find(item => getItemDisplay(item) === placedItem) || placedItem);
      
      if (expectedDisplay !== placedDisplay) {
        allCorrect = false;
        break;
      }
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
    setDraggedItem(null);
  }

  if (itemsList.length === 0) {
    return <div className="p-8 text-center text-red-600">No items found in puzzle</div>;
  }

  // Shuffle items for display on left side
  const shuffledItems = [...itemsList].sort(() => Math.random() - 0.5);

  // Get items not yet placed
  const unplacedItems = shuffledItems.filter(item => {
    const itemDisplay = getItemDisplay(item);
    return !Object.keys(placed).includes(itemDisplay);
  });

  // Calculate grid columns based on count
  const getGridColumns = (count) => {
    if (count <= 4) return 2;
    if (count <= 9) return 3;
    return 4;
  };

  const gridCols = getGridColumns(itemsList.length);
  const gridColsClass = `grid-cols-${gridCols}`;

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
                <p className="text-gray-700">Drag items from left to right boxes</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">2</span>
                <p className="text-gray-700">Place them in correct order positions</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">3</span>
                <p className="text-gray-700">Click "Check" to verify your answer</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">4</span>
                <p className="text-gray-700">Try to get all items in the right places</p>
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

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-teal-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🔢 {puzzle.title}</h1>
            <p className="text-gray-600">{puzzle.description}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-orange-500">⏱️</div>
              <div className="text-xs text-gray-500 mt-1">Attempts</div>
              <div className="text-2xl font-bold text-gray-800">{attempts}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-teal-500">✓</div>
              <div className="text-xs text-gray-500 mt-1">Status</div>
              <div className="text-sm font-bold text-gray-800">{done ? (isCorrect ? "✅ Done" : "❌ Wrong") : "🎮 Playing"}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">📦</div>
              <div className="text-xs text-gray-500 mt-1">Placed</div>
              <div className="text-2xl font-bold text-gray-800">{Object.keys(placed).length}/{itemsList.length}</div>
            </div>
          </div>

          {/* Two-Box Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            {/* Left: Items Pool */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>📦</span> Items to Order
              </h2>
              <div className="min-h-96">
                {unplacedItems.length > 0 ? (
                  <div className={`grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-${gridCols}`}>
                    {unplacedItems.map((item) => {
                      const itemDisplay = getItemDisplay(item);
                      return (
                        <div
                          key={itemDisplay}
                          draggable
                          onDragStart={() => handleDragStart(itemDisplay)}
                          className={`p-3 rounded-lg border-2 border-solid cursor-move transition-all flex flex-col items-center justify-center text-center min-h-32 ${
                            draggedItem === itemDisplay
                              ? "opacity-50 scale-95 bg-blue-200 border-blue-400"
                              : "bg-gradient-to-r from-blue-100 to-blue-50 border-blue-200 hover:shadow-md hover:scale-105"
                          }`}
                        >
                          {getItemImage(item) && (
                            <img 
                              src={getItemImage(item)} 
                              alt={itemDisplay}
                              className="w-16 h-16 rounded-lg object-cover mb-2"
                            />
                          )}
                          <span className="text-sm font-semibold text-gray-800 line-clamp-2">
                            {itemDisplay}
                          </span>
                          <span className="text-gray-400 text-xs mt-1">⋮⋮</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">✅ All items placed!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order Positions */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>🎯</span> Order Positions
              </h2>
              <div className={`grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-${gridCols}`}>
                {correctOrderList.map((_, positionIndex) => {
                  // Find item placed at this position
                  const placedItemKey = Object.keys(placed).find(key => placed[key] === positionIndex);
                  const placedItem = placedItemKey ? itemsList.find(item => getItemDisplay(item) === placedItemKey) : null;
                  
                  return (
                    <div
                      key={positionIndex}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(positionIndex)}
                      className={`p-3 rounded-lg border-2 border-dashed transition-all min-h-32 relative flex flex-col items-center justify-center text-center ${
                        placedItem 
                          ? "bg-green-50 border-green-400"
                          : "bg-gray-50 border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                      }`}
                    >
                      <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-sm">
                        {positionIndex + 1}
                      </div>
                      <div className="w-full">
                        {placedItem ? (
                          <div className="flex flex-col items-center gap-2">
                            {getItemImage(placedItem) && (
                              <img 
                                src={getItemImage(placedItem)} 
                                alt={getItemDisplay(placedItem)}
                                className="w-14 h-14 rounded-lg object-cover"
                              />
                            )}
                            <span className="text-xs font-semibold text-gray-800 line-clamp-2">
                              {getItemDisplay(placedItem)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">Drop here</span>
                        )}
                      </div>
                      {placedItem && (
                        <button
                          onClick={() => handleRemoveFromPosition(positionIndex)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center transition"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={check}
              disabled={done || Object.keys(placed).length !== itemsList.length}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ✓ Check Answer
            </button>
            <button
              onClick={reset}
              className="px-8 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold rounded-lg hover:shadow-lg transition"
            >
              🔄 Reset
            </button>
          </div>

          {/* Result Message */}
          {done && (
            <div className={`rounded-2xl p-8 text-center mb-6 ${
              isCorrect 
                ? "bg-gradient-to-r from-green-100 to-teal-100 border-2 border-green-400" 
                : "bg-gradient-to-r from-red-100 to-orange-100 border-2 border-red-400"
            }`}
            >
              <p className={`text-2xl font-bold ${
                isCorrect ? "text-green-700" : "text-red-700"
              }`}
              >
                {isCorrect ? "🎉 Perfect! You got it right!" : "❌ Not quite right. Try again!"}
              </p>
            </div>
          )}
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
