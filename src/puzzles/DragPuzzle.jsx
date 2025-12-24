// src/puzzles/DragPuzzle.jsx
// Drag & drop puzzle UI (simplified for demo).
import React, { useState, useMemo } from "react";

export default function DragPuzzle({ puzzle, onComplete }) {
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
    
    setDone(true);
    if (allCorrect) onComplete();
  }

  if (draggables.length === 0 || targets.length === 0) {
    return <div className="p-8 text-center text-red-600">No items or targets found in puzzle</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow pastel-card">
      <h2 className="font-bold text-xl mb-4">Drag to categorize</h2>
      <div className="mb-4">
        {draggables.map(item => (
          <div key={item} className="mb-2 flex items-center gap-2">
            <span className="px-3 py-1 bg-pink-100 rounded">{item}</span>
            <select
              value={placed[item] || ""}
              onChange={e => handlePlace(item, e.target.value)}
              className="rounded border p-1"
              disabled={done}
            >
              <option value="">Select category</option>
              {targets.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      {!done && <button className="btn-primary" onClick={check}>Check</button>}
      {done && <div className="mt-4 text-green-600 font-bold">Puzzle Complete!</div>}
    </div>
  );
}
