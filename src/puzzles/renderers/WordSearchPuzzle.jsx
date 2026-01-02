// src/puzzles/renderers/WordSearchPuzzle.jsx
// Play renderer for Word Search puzzles using { gridRows, words }
import React, { useMemo, useState } from "react";

export default function WordSearchPuzzle({ puzzle, onComplete }) {
  const gridRows = useMemo(
    () => (Array.isArray(puzzle?.data?.gridRows) ? puzzle.data.gridRows : []),
    [puzzle?.data?.gridRows]
  );
  const grid = useMemo(() => gridRows.map(r => r.split("")), [gridRows]);
  const numRows = grid.length;
  const numCols = grid[0]?.length || 0;

  const targetWords = useMemo(
    () => (Array.isArray(puzzle?.data?.words) ? puzzle.data.words : []),
    [puzzle?.data?.words]
  );

  const [startCell, setStartCell] = useState(null); // { r, c }
  const [foundWords, setFoundWords] = useState([]); // normalized words
  const [message, setMessage] = useState("");

  const norm = (w) => String(w).toLowerCase().trim();
  const targetsNorm = useMemo(() => targetWords.map(norm), [targetWords]);

  const resetSelection = () => {
    setStartCell(null);
  };

  const getStep = (dr, dc) => {
    const sgn = (x) => (x === 0 ? 0 : x > 0 ? 1 : -1);
    return { sr: sgn(dr), sc: sgn(dc) };
  };

  const collectLine = (r1, c1, r2, c2) => {
    const dr = r2 - r1;
    const dc = c2 - c1;
    const { sr, sc } = getStep(dr, dc);

    // Require straight lines: horizontal, vertical, or diagonal
    const straight = (sr === 0 && sc !== 0) || (sr !== 0 && sc === 0) || (Math.abs(dr) === Math.abs(dc));
    if (!straight) return null;

    const len = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
    const letters = [];
    let r = r1, c = c1;
    for (let i = 0; i < len; i++) {
      if (r < 0 || c < 0 || r >= numRows || c >= numCols) return null;
      letters.push(grid[r][c]);
      r += sr; c += sc;
    }
    return letters.join("");
  };

  const tryMarkWord = (word) => {
    const n = norm(word);
    if (!targetsNorm.includes(n)) return false;
    if (foundWords.includes(n)) return true;
    setFoundWords(prev => [...prev, n]);
    if (foundWords.length + 1 === targetsNorm.length) {
      setMessage("🎉 All words found!");
      onComplete?.();
    } else {
      setMessage(`✅ Found: ${word}`);
    }
    return true;
  };

  const handleCellClick = (r, c) => {
    if (!startCell) {
      setStartCell({ r, c });
      setMessage("Select end cell to complete selection.");
      return;
    }
    const line = collectLine(startCell.r, startCell.c, r, c);
    if (!line) {
      setMessage("⚠️ Selection must be straight (H/V/diagonal).");
      resetSelection();
      return;
    }
    const word = line;
    const reversed = line.split("").reverse().join("");
    if (!tryMarkWord(word)) {
      if (!tryMarkWord(reversed)) {
        setMessage(`❌ Not a target word: ${word}`);
      }
    }
    resetSelection();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">🔤 Word Search</h2>
      <p className="text-gray-600 mb-4">Select a straight line from start to end to find words. Supports horizontal, vertical, and diagonal.</p>

      {/* Grid */}
      {numRows === 0 || numCols === 0 ? (
        <div className="p-6 text-red-600">Grid is empty.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${numCols}, 32px)`, gap: 6, justifyContent: "center" }}>
          {grid.map((row, rIdx) => (
            row.map((ch, cIdx) => {
              const isStart = startCell && startCell.r === rIdx && startCell.c === cIdx;
              return (
                <button
                  key={`cell-${rIdx}-${cIdx}`}
                  onClick={() => handleCellClick(rIdx, cIdx)}
                  className="w-8 h-8 flex items-center justify-center border rounded"
                  style={{
                    fontFamily: "monospace",
                    fontWeight: 700,
                    background: isStart ? "#dbeafe" : "#fff",
                    borderColor: isStart ? "#3b82f6" : "#e5e7eb",
                  }}
                  aria-label={`Row ${rIdx + 1} Col ${cIdx + 1}`}
                >
                  {ch}
                </button>
              );
            })
          ))}
        </div>
      )}

      {/* Words List */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Target Words ({foundWords.length}/{targetsNorm.length})</h3>
        {targetsNorm.length === 0 ? (
          <div className="text-gray-500">No target words provided.</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {targetWords.map((w, idx) => {
              const n = norm(w);
              const isFound = foundWords.includes(n);
              return (
                <span
                  key={`word-${idx}`}
                  className="px-3 py-1 rounded text-sm"
                  style={{
                    background: isFound ? "#dcfce7" : "#f3f4f6",
                    color: isFound ? "#166534" : "#374151",
                    border: `1px solid ${isFound ? '#22c55e' : '#e5e7eb'}`,
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Message */}
      {message && <div className="mt-4 text-sm" role="status">{message}</div>}
    </div>
  );
}
