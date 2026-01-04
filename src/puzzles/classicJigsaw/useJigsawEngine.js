import { useState, useEffect } from "react";
import { shouldSnap } from "./snapUtils";

export function useJigsawEngine(initialPieces) {
  const [pieces, setPieces] = useState(initialPieces);
  const [moves, setMoves] = useState(0);
  const [startTime] = useState(Date.now());

  // Update pieces when initialPieces changes
  useEffect(() => {
    setPieces(initialPieces);
  }, [initialPieces]);

  const placed = pieces.filter(p => p.locked).length;
  const total = pieces.length;
  const progress = total > 0 ? Math.round((placed / total) * 100) : 0;

  function trySnap(id, x, y) {
    setPieces(prev =>
      prev.map(p => {
        if (p.id !== id || p.locked) return p;

        if (shouldSnap(x, y, p.correctX, p.correctY)) {
          return {
            ...p,
            x: p.correctX,
            y: p.correctY,
            locked: true,
          };
        }

        return { ...p, x, y };
      })
    );
    setMoves(m => m + 1);
  }

  return {
    pieces,
    trySnap,
    moves,
    progress,
    time: Math.floor((Date.now() - startTime) / 1000),
    placed,
    total,
  };
}
