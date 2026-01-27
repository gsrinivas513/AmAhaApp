/**
 * PixiJS Jigsaw Puzzle Piece Renderer
 * Converts SVG paths to PixiJS graphics with proper image masking
 * Inspired by the Unity reference implementation with Bézier curves
 */

import * as PIXI from 'pixi.js';

/**
 * Parse SVG path string into coordinate array
 */
function parseSVGPath(pathStr) {
  const points = [];
  const commands = pathStr.match(/[MLC][^MLC]*/g) || [];

  let currentX = 0;
  let currentY = 0;

  for (const cmd of commands) {
    const parts = cmd.match(/[\d.-]+/g) || [];
    const type = cmd[0];

    if (type === 'M') {
      currentX = parseFloat(parts[0]);
      currentY = parseFloat(parts[1]);
      points.push({ x: currentX, y: currentY, type: 'MOVE' });
    } else if (type === 'L') {
      currentX = parseFloat(parts[0]);
      currentY = parseFloat(parts[1]);
      points.push({ x: currentX, y: currentY, type: 'LINE' });
    } else if (type === 'C') {
      // Cubic Bézier curve - approximate with line segments
      const cp1x = parseFloat(parts[0]);
      const cp1y = parseFloat(parts[1]);
      const cp2x = parseFloat(parts[2]);
      const cp2y = parseFloat(parts[3]);
      const endX = parseFloat(parts[4]);
      const endY = parseFloat(parts[5]);

      // Approximate curve with multiple line segments
      const steps = 20;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const t1 = 1 - t;

        // De Casteljau algorithm for cubic Bézier
        const x = 
          t1 * t1 * t1 * currentX +
          3 * t1 * t1 * t * cp1x +
          3 * t1 * t * t * cp2x +
          t * t * t * endX;

        const y = 
          t1 * t1 * t1 * currentY +
          3 * t1 * t1 * t * cp1y +
          3 * t1 * t * t * cp2y +
          t * t * t * endY;

        points.push({ x, y, type: 'CURVE' });
      }

      currentX = endX;
      currentY = endY;
    }
  }

  return points;
}

/**
 * Create a PixiJS piece with curved edges and PROPERLY MASKED image texture
 * Uses a mask graphic that's part of the scene graph
 */
export function createJigsawPiece(
  pieceData,
  baseTexture,
  pieceWidth,
  pieceHeight,
  containerWidth,
  containerHeight
) {
  const piece = new PIXI.Container();
  piece.gridRow = pieceData.row;
  piece.gridCol = pieceData.col;
  piece.correctX = pieceData.correctX;
  piece.correctY = pieceData.correctY;
  piece.width = pieceWidth;
  piece.height = pieceHeight;

  // Parse the SVG path to get curve points
  const pathPoints = parseSVGPath(pieceData.path);

  // Create the mask shape - MUST be added to piece for masking to work
  const maskGraphics = new PIXI.Graphics();
  maskGraphics.moveTo(pathPoints[0].x, pathPoints[0].y);
  for (let i = 1; i < pathPoints.length; i++) {
    maskGraphics.lineTo(pathPoints[i].x, pathPoints[i].y);
  }
  maskGraphics.closePath();
  maskGraphics.fill(0xffffff);
  
  // Add mask to piece but make it invisible
  piece.addChild(maskGraphics);
  maskGraphics.visible = false;

  // Create texture region for this piece
  const sourceX = pieceData.col * pieceWidth;
  const sourceY = pieceData.row * pieceHeight;

  const pieceTexture = new PIXI.Texture(
    baseTexture,
    new PIXI.Rectangle(sourceX, sourceY, pieceWidth, pieceHeight)
  );

  // Create sprite from texture
  const sprite = new PIXI.Sprite(pieceTexture);
  sprite.position.set(0, 0);
  
  // Apply the mask to the sprite using the graphics object
  sprite.mask = maskGraphics;

  // Add sprite to piece
  piece.addChild(sprite);

  // Draw the outline/border on top using the same curved path
  const outline = new PIXI.Graphics();
  outline.moveTo(pathPoints[0].x, pathPoints[0].y);
  for (let i = 1; i < pathPoints.length; i++) {
    outline.lineTo(pathPoints[i].x, pathPoints[i].y);
  }
  outline.closePath();
  outline.stroke({ width: 1.5, color: 0xaaaaaa });
  piece.addChild(outline);

  // Interaction
  piece.eventMode = 'static';
  piece.cursor = 'grab';
  piece.isDragging = false;
  piece.dragStartX = 0;
  piece.dragStartY = 0;
  piece.movedDistance = 0;

  if (pieceData.row === 0 && pieceData.col === 0) {
    console.log('✨ Piece [0,0] with masked image:', {
      pathPoints: pathPoints.length,
      sprite_position: `${sprite.x}, ${sprite.y}`,
      sprite_size: `${sprite.width}, ${sprite.height}`,
      mask_added: !!maskGraphics,
      sprite_mask_set: !!sprite.mask
    });
  }

  return piece;
}

/**
 * Create all pieces for the puzzle
 */
export function createAllJigsawPieces(
  pieceDataArray,
  baseTexture,
  pieceWidth,
  pieceHeight,
  containerWidth,
  containerHeight
) {
  const pieces = [];

  for (const pieceData of pieceDataArray) {
    const piece = createJigsawPiece(
      pieceData,
      baseTexture,
      pieceWidth,
      pieceHeight,
      containerWidth,
      containerHeight
    );
    pieces.push(piece);
  }

  return pieces;
}

