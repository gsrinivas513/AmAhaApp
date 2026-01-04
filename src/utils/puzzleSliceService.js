// src/utils/puzzleSliceService.js
// Client-side puzzle piece generation using Canvas with jigsaw curves

/**
 * Generate puzzle pieces using Canvas rendering
 * This creates image data URLs for each puzzle piece with proper jigsaw curves
 */
export async function generatePuzzlePieceSvg(imageUrl, col, row, rows, cols, size = 120) {
  return new Promise((resolve) => {
    const imageWidth = 1200;
    const imageHeight = (imageWidth * 9) / 16;
    const pieceWidth = imageWidth / cols;
    const pieceHeight = imageHeight / rows;

    const x0 = col * pieceWidth;
    const y0 = row * pieceHeight;

    // Create a canvas for the piece
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    // Load the image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Draw the jigsaw shape on the canvas
      drawJigsawPiece(ctx, size, col, row, rows, cols, img, imageWidth, imageHeight, x0, y0, pieceWidth, pieceHeight);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      // Fallback: solid color with border if image fails to load
      ctx.fillStyle = "#4f46e5";
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, size, size);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = imageUrl;
  });
}

/**
 * Draw a realistic jigsaw piece with proper interlocking tabs/slots
 */
function drawJigsawPiece(ctx, size, col, row, rows, cols, img, imageWidth, imageHeight, x0, y0, pieceWidth, pieceHeight) {
  const padding = 12;
  const innerSize = size - padding * 2;
  
  // Determine tab/slot for each edge based on piece position
  const hasTopTab = row === 0 ? null : (col + row) % 2 === 0;
  const hasRightTab = col === cols - 1 ? null : (col + row + 1) % 2 === 0;
  const hasBottomTab = row === rows - 1 ? null : (col + row) % 2 === 0;
  const hasLeftTab = col === 0 ? null : (col + row + 1) % 2 === 0;

  // Tab/slot depth and width
  const tabDepth = innerSize * 0.25;
  const tabWidth = innerSize * 0.4;

  // Create path using cubic Bézier curves for smooth, realistic edges
  const path = new Path2D();

  // Start at top-left corner
  path.moveTo(padding, padding);

  // TOP EDGE
  if (row === 0) {
    // Straight edge for border piece
    path.lineTo(size - padding, padding);
  } else {
    drawEdgeWithTab(path, padding, padding, size - padding, padding, hasTopTab, tabDepth, tabWidth, true);
  }

  // RIGHT EDGE
  if (col === cols - 1) {
    // Straight edge for border piece
    path.lineTo(size - padding, size - padding);
  } else {
    drawEdgeWithTab(path, size - padding, padding, size - padding, size - padding, hasRightTab, tabDepth, tabWidth, false);
  }

  // BOTTOM EDGE
  if (row === rows - 1) {
    // Straight edge for border piece
    path.lineTo(padding, size - padding);
  } else {
    drawEdgeWithTab(path, size - padding, size - padding, padding, size - padding, hasBottomTab, tabDepth, tabWidth, true);
  }

  // LEFT EDGE
  if (col === 0) {
    // Straight edge for border piece
    path.lineTo(padding, padding);
  } else {
    drawEdgeWithTab(path, padding, size - padding, padding, padding, hasLeftTab, tabDepth, tabWidth, false);
  }

  // Clip to jigsaw shape
  ctx.save();
  ctx.clip(path);

  // Calculate image position and scale
  const scaledImageWidth = (imageWidth / pieceWidth) * size;
  const scaledImageHeight = (imageHeight / pieceHeight) * size;
  const offsetX = -(x0 / pieceWidth) * size;
  const offsetY = -(y0 / pieceHeight) * size;

  // Draw the image portion
  ctx.drawImage(img, offsetX, offsetY, scaledImageWidth, scaledImageHeight);

  ctx.restore();

  // Draw the border
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 2;
  ctx.stroke(path);
}

/**
 * Draw an edge with either a tab (protrusion) or slot (indentation)
 * isHorizontal: true for top/bottom edges, false for left/right edges
 */
function drawEdgeWithTab(path, x1, y1, x2, y2, hasTab, tabDepth, tabWidth, isHorizontal) {
  if (isHorizontal) {
    // Horizontal edge (top or bottom)
    const midX = x1 + (x2 - x1) / 2;
    const tabStartX = midX - tabWidth / 2;
    const tabEndX = midX + tabWidth / 2;
    
    // Draw first half of edge
    path.lineTo(tabStartX, y1);
    
    if (hasTab === true) {
      // TAB (protrusion outward)
      const outY = y1 - tabDepth;
      path.bezierCurveTo(
        tabStartX - tabWidth * 0.2, outY,
        tabEndX + tabWidth * 0.2, outY,
        tabEndX, y1
      );
    } else if (hasTab === false) {
      // SLOT (indentation inward)
      const inY = y1 + tabDepth;
      path.bezierCurveTo(
        tabStartX - tabWidth * 0.2, inY,
        tabEndX + tabWidth * 0.2, inY,
        tabEndX, y1
      );
    } else {
      // Straight edge
      path.lineTo(tabEndX, y1);
    }
    
    // Draw second half of edge
    path.lineTo(x2, y2);
  } else {
    // Vertical edge (left or right)
    const midY = y1 + (y2 - y1) / 2;
    const tabStartY = midY - tabWidth / 2;
    const tabEndY = midY + tabWidth / 2;
    
    // Draw first half of edge
    path.lineTo(x1, tabStartY);
    
    if (hasTab === true) {
      // TAB (protrusion outward)
      const outX = x1 - tabDepth;
      path.bezierCurveTo(
        outX, tabStartY - tabWidth * 0.2,
        outX, tabEndY + tabWidth * 0.2,
        x1, tabEndY
      );
    } else if (hasTab === false) {
      // SLOT (indentation inward)
      const inX = x1 + tabDepth;
      path.bezierCurveTo(
        inX, tabStartY - tabWidth * 0.2,
        inX, tabEndY + tabWidth * 0.2,
        x1, tabEndY
      );
    } else {
      // Straight edge
      path.lineTo(x1, tabEndY);
    }
    
    // Draw second half of edge
    path.lineTo(x2, y2);
  }
}
