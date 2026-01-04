/**
 * REAL Jigsaw Piece Generator
 * - Generates curved SVG paths
 * - Supports tabs, blanks, flat edges
 * - Ensures interlocking neighbors
 */

const TAB_SIZE_RATIO = 0.25; // depth of tab relative to edge length

function opposite(edge) {
  if (edge === "tab") return "blank";
  if (edge === "blank") return "tab";
  return "flat";
}

/**
 * Create one edge path
 */
function createEdgePath(type, length, depth) {
  if (type === "flat") {
    return `L ${length} 0`;
  }

  const d = depth;
  const l = length;

  if (type === "tab") {
    return `
      C ${l * 0.3} ${-d},
        ${l * 0.7} ${-d},
        ${l} 0
    `;
  }

  // blank
  return `
    C ${l * 0.3} ${d},
      ${l * 0.7} ${d},
      ${l} 0
  `;
}

/**
 * Rotate coordinates 90deg clockwise around origin
 * (x, y) => (y, -x) then adjust for new bounds
 */
function rotateCoords(x, y, angle) {
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [x * cos - y * sin, x * sin + y * cos];
}

/**
 * Transform edge path for right/bottom/left sides
 */
function transformEdgePath(pathStr, angle, width, height) {
  // For now, just return the original path
  // We'll handle rotations differently
  return pathStr;
}

/**
 * Generate SVG path for a single piece
 */
function generatePiecePath(edges, width, height) {
  const depth = Math.min(width, height) * TAB_SIZE_RATIO;

  let d = `M 0 0 `;

  // TOP edge (runs left to right)
  d += createEdgePath(edges.top, width, depth);

  // RIGHT edge (runs top to bottom) - stays within bounds
  d += ` L ${width} 0 `;
  if (edges.right === "flat") {
    d += `L ${width} ${height}`;
  } else if (edges.right === "tab") {
    // Tab goes OUTWARD (but we'll keep coordinate within)
    d += `C ${width + depth} ${height * 0.3}, ${width + depth} ${height * 0.7}, ${width} ${height}`;
  } else {
    // Blank goes INWARD
    d += `C ${width - depth} ${height * 0.3}, ${width - depth} ${height * 0.7}, ${width} ${height}`;
  }

  // BOTTOM edge (runs right to left)
  d += ` L ${width} ${height} `;
  if (edges.bottom === "flat") {
    d += `L 0 ${height}`;
  } else if (edges.bottom === "tab") {
    d += `C ${width * 0.7} ${height + depth}, ${width * 0.3} ${height + depth}, 0 ${height}`;
  } else {
    d += `C ${width * 0.7} ${height - depth}, ${width * 0.3} ${height - depth}, 0 ${height}`;
  }

  // LEFT edge (runs bottom to top)
  d += ` L 0 ${height} `;
  if (edges.left === "flat") {
    d += `L 0 0`;
  } else if (edges.left === "tab") {
    d += `C ${-depth} ${height * 0.7}, ${-depth} ${height * 0.3}, 0 0`;
  } else {
    d += `C ${depth} ${height * 0.7}, ${depth} ${height * 0.3}, 0 0`;
  }

  d += " Z";
  return d;
}

/**
 * Main generator
 */
export function generateJigsawPieces(image, rows, cols) {
  const imgWidth = image.width;
  const imgHeight = image.height;

  const pieceWidth = imgWidth / cols;
  const pieceHeight = imgHeight / rows;

  // Step 1: Assign edges
  const edgeMap = [];

  for (let r = 0; r < rows; r++) {
    edgeMap[r] = [];
    for (let c = 0; c < cols; c++) {
      const edges = {};

      edges.top =
        r === 0 ? "flat" : opposite(edgeMap[r - 1][c].bottom);

      edges.left =
        c === 0 ? "flat" : opposite(edgeMap[r][c - 1].right);

      edges.right =
        c === cols - 1
          ? "flat"
          : Math.random() > 0.5
          ? "tab"
          : "blank";

      edges.bottom =
        r === rows - 1
          ? "flat"
          : Math.random() > 0.5
          ? "tab"
          : "blank";

      edgeMap[r][c] = edges;
    }
  }

  // Step 2: Build pieces
  const pieces = [];

  let id = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * pieceWidth;
      const y = r * pieceHeight;

      const path = generatePiecePath(
        edgeMap[r][c],
        pieceWidth,
        pieceHeight
      );

      pieces.push({
        id: `piece-${id++}`,
        row: r,
        col: c,
        path,
        correctX: x,
        correctY: y,
        x: Math.random() * imgWidth * 0.6,
        y: imgHeight + Math.random() * 150,
        locked: false,
      });
    }
  }

  return pieces;
}
