// src/puzzles/renderers/JigsawPuzzle.jsx
import React, { useState, useMemo, useEffect } from "react";

// Generate a jigsaw piece path with LARGE, PROMINENT interlocking tabs (like puzzlefree.game)
const generatePiecePath = (col, row, cols, rows, scale = 100) => {
  const pieceWidth = scale / cols;
  const pieceHeight = scale / rows;
  const tabDepth = Math.min(pieceWidth, pieceHeight) * 0.5;
  
  const x0 = col * pieceWidth;
  const y0 = row * pieceHeight;
  const x1 = (col + 1) * pieceWidth;
  const y1 = (row + 1) * pieceHeight;
  
  let path = `M ${x0} ${y0}`;
  
  // Top
  if (row === 0) {
    path += ` L ${x1} ${y0}`;
  } else {
    path += ` L ${x0 + pieceWidth * 0.1} ${y0}`;
    if ((col + row) % 2 === 0) {
      path += ` Q ${x0 + pieceWidth * 0.5} ${y0 - tabDepth}, ${x0 + pieceWidth * 0.9} ${y0}`;
    } else {
      path += ` Q ${x0 + pieceWidth * 0.5} ${y0 + tabDepth}, ${x0 + pieceWidth * 0.9} ${y0}`;
    }
    path += ` L ${x1} ${y0}`;
  }
  
  // Right
  if (col === cols - 1) {
    path += ` L ${x1} ${y1}`;
  } else {
    path += ` L ${x1} ${y0 + pieceHeight * 0.1}`;
    if ((col + row + 1) % 2 === 0) {
      path += ` Q ${x1 + tabDepth} ${y0 + pieceHeight * 0.5}, ${x1} ${y0 + pieceHeight * 0.9}`;
    } else {
      path += ` Q ${x1 - tabDepth} ${y0 + pieceHeight * 0.5}, ${x1} ${y0 + pieceHeight * 0.9}`;
    }
    path += ` L ${x1} ${y1}`;
  }
  
  // Bottom
  if (row === rows - 1) {
    path += ` L ${x0} ${y1}`;
  } else {
    path += ` L ${x0 + pieceWidth * 0.9} ${y1}`;
    if ((col + row) % 2 === 0) {
      path += ` Q ${x0 + pieceWidth * 0.5} ${y1 + tabDepth}, ${x0 + pieceWidth * 0.1} ${y1}`;
    } else {
      path += ` Q ${x0 + pieceWidth * 0.5} ${y1 - tabDepth}, ${x0 + pieceWidth * 0.1} ${y1}`;
    }
    path += ` L ${x0} ${y1}`;
  }
  
  // Left
  if (col === 0) {
    path += ` L ${x0} ${y0}`;
  } else {
    path += ` L ${x0} ${y0 + pieceHeight * 0.9}`;
    if ((col + row + 1) % 2 === 0) {
      path += ` Q ${x0 - tabDepth} ${y0 + pieceHeight * 0.5}, ${x0} ${y0 + pieceHeight * 0.1}`;
    } else {
      path += ` Q ${x0 + tabDepth} ${y0 + pieceHeight * 0.5}, ${x0} ${y0 + pieceHeight * 0.1}`;
    }
    path += ` L ${x0} ${y0}`;
  }
  
  return path;
};

export default function JigsawPuzzle({ puzzle, onComplete, selectedVariant }) {
  const data = puzzle?.data || {};
  const baseRows = Math.max(2, parseInt(data.rows || 3, 10));
  const baseCols = Math.max(2, parseInt(data.cols || 4, 10));
  
  const variants = Array.isArray(data.variants) && data.variants.length > 0
    ? data.variants
    : [
        { label: "Easy", rows: baseRows, cols: baseCols },
        { label: "Medium", rows: baseRows + 1, cols: baseCols + 2 },
      ];

  const initialIdx = selectedVariant
    ? variants.findIndex(v => v.label === selectedVariant)
    : 0;

  const [selectedIdx, setSelectedIdx] = useState(Math.max(0, initialIdx));

  useEffect(() => {
    if (selectedVariant) {
      const idx = variants.findIndex(v => v.label === selectedVariant);
      if (idx !== -1) {
        setSelectedIdx(idx);
      }
    }
  }, [selectedVariant, variants]);

  const selected = variants[selectedIdx] || variants[0];

  // Generate all pieces with random positions - PERSISTENT across re-renders
  const [piecesWithPositions] = useState(() => {
    const pieces = [];
    const PIECE_SIZE = 120; // Approximate pixel size per piece
    
    for (let row = 0; row < selected.rows; row++) {
      for (let col = 0; col < selected.cols; col++) {
        // Random scatter in a wide area
        const randomX = Math.random() * 800 - 400;
        const randomY = Math.random() * 600 - 300;
        const randomRotation = Math.random() * 45 - 22.5;
        
        pieces.push({
          id: `${row}-${col}`,
          row,
          col,
          path: generatePiecePath(col, row, selected.cols, selected.rows, 100),
          offsetX: randomX,
          offsetY: randomY,
          rotation: randomRotation,
        });
      }
    }
    return pieces;
  });

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ margin: 0 }}>{puzzle.title || "Jigsaw Puzzle"}</h2>
      <p style={{ margin: "6px 0 12px", color: "#64748b" }}>
        Assemble the scattered pieces by dragging them into place.
      </p>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12, flexWrap: 'wrap' }}>
        <label style={{ fontWeight: 600 }}>Difficulty Level</label>
        <select value={selectedIdx} onChange={(e) => setSelectedIdx(parseInt(e.target.value, 10))} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: 8 }}>
          {variants.map((v, i) => (
            <option key={`${v.label}-${i}`} value={i}>
              {v.label} ({v.rows} × {v.cols} = {v.rows * v.cols} pieces)
            </option>
          ))}
        </select>
        <span style={{ color: "#64748b", fontWeight: 600 }}>🧩 {selected.rows * selected.cols} pieces</span>
      </div>

      {/* Main puzzle board - scattered pieces */}
      <div style={{ position: "relative", width: "100%", maxWidth: 1100, margin: "0 auto", height: 750, background: "linear-gradient(135deg, #e8eef2 0%, #f1f5f9 100%)", borderRadius: 12, overflow: "hidden", border: "4px solid #1e293b", boxShadow: "0 12px 24px rgba(0,0,0,0.3)" }}>
        {data.imageUrl && (
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            viewBox={`0 0 1100 750`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Clipping paths for each piece - with proper interlocking shapes */}
              {piecesWithPositions.map((piece) => (
                <clipPath key={`clip-${piece.id}`} id={`clip-${piece.id}`}>
                  <path d={piece.path} fill="black" />
                </clipPath>
              ))}
              
              {/* Shadow filter */}
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="3" stdDeviation="4" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Render each scattered piece as individual, isolated element */}
            {piecesWithPositions.map((piece) => {
              const imageScale = 100 / selected.cols; // Scale factor for image positioning
              const centerX = 550 + piece.offsetX;
              const centerY = 375 + piece.offsetY;
              
              return (
                <g
                  key={`piece-${piece.id}`}
                  transform={`translate(${centerX}, ${centerY}) rotate(${piece.rotation})`}
                  filter="url(#shadow)"
                  style={{ cursor: "grab" }}
                >
                  {/* Piece background/fill - light color so interlocking shows */}
                  <path
                    d={piece.path}
                    fill="#ffffff"
                    stroke="#0f172a"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Image content clipped to piece shape */}
                  <image
                    href={data.imageUrl}
                    x={-piece.col * imageScale}
                    y={-piece.row * imageScale}
                    width={imageScale * selected.cols}
                    height={imageScale * selected.rows}
                    clipPath={`url(#clip-${piece.id})`}
                    preserveAspectRatio="none"
                  />
                  
                  {/* Edge highlight for 3D effect */}
                  <path
                    d={piece.path}
                    fill="none"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="0.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.5"
                  />
                  
                  {/* Inner shadow for depth */}
                  <path
                    d={piece.path}
                    fill="none"
                    stroke="rgba(0,0,0,0.15)"
                    strokeWidth="0.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              );
            })}
          </svg>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
        <button onClick={() => onComplete && onComplete()} style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #10b981", background: "#10b981", color: "white", fontWeight: 600 }}>
          ✓ Mark Complete
        </button>
      </div>
    </div>
  );
}
