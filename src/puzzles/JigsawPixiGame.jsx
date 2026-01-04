import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

export default function JigsawPixiGame({ puzzle, onProgress }) {
  const containerRef = useRef(null);
  const appRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initGame = async () => {
      try {
        if (!containerRef.current) return;

        // Load image first
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = async () => {
          await setupGame(img);
        };
        img.onerror = () => {
          setError('Failed to load image');
          setLoading(false);
        };
        img.src = puzzle.data.imageUrl;
      } catch (err) {
        console.error('Init error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initGame();

    return () => {
      if (appRef.current) {
        appRef.current.destroy();
        appRef.current = null;
      }
    };
  }, [puzzle]);

  const setupGame = async (imageElement) => {
    try {
      // Constants
      const APP_WIDTH = 900;
      const APP_HEIGHT = 750;
      const BOARD_X = 20;
      const BOARD_Y = 20;
      const BOARD_SIZE = 500;
      const TRAY_Y = BOARD_Y + BOARD_SIZE + 30;
      const TRAY_HEIGHT = 180;
      const PIECE_GAP = 8;
      const ROWS = 4;
      const COLS = 4;
      const PIECE_SIZE = BOARD_SIZE / COLS;

      // Create PIXI app
      const app = new PIXI.Application();
      await app.init({
        width: APP_WIDTH,
        height: APP_HEIGHT,
        backgroundColor: 0xf6f6f6,
        antialias: true,
        resolution: 1,
      });

      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(app.canvas);
      }

      appRef.current = app;

      // Create layers
      const boardLayer = new PIXI.Container();
      const trayLayer = new PIXI.Container();
      const dragLayer = new PIXI.Container();
      const uiLayer = new PIXI.Container();

      app.stage.addChild(boardLayer, trayLayer, dragLayer, uiLayer);

      // Load texture from image
      const texture = PIXI.Texture.from(imageElement);
      console.log('✅ Texture loaded:', imageElement.width, 'x', imageElement.height);

      // Board background (full image with blur)
      const boardBg = new PIXI.Sprite(texture);
      boardBg.x = BOARD_X;
      boardBg.y = BOARD_Y;
      boardBg.width = BOARD_SIZE;
      boardBg.height = BOARD_SIZE;

      const blurFilter = new PIXI.BlurFilter({ strength: 8 });
      boardBg.filters = [blurFilter];
      boardBg.alpha = 0.6;
      boardLayer.addChild(boardBg);

      // Board border
      const boardBorder = new PIXI.Graphics()
        .rect(BOARD_X, BOARD_Y, BOARD_SIZE, BOARD_SIZE)
        .stroke({ width: 2, color: 0xcccccc });
      boardLayer.addChild(boardBorder);

      // Grid lines
      const gridLines = new PIXI.Graphics();
      for (let c = 1; c < COLS; c++) {
        const x = BOARD_X + c * PIECE_SIZE;
        gridLines.moveTo(x, BOARD_Y);
        gridLines.lineTo(x, BOARD_Y + BOARD_SIZE);
      }
      for (let r = 1; r < ROWS; r++) {
        const y = BOARD_Y + r * PIECE_SIZE;
        gridLines.moveTo(BOARD_X, y);
        gridLines.lineTo(BOARD_X + BOARD_SIZE, y);
      }
      gridLines.stroke({ width: 1, color: 0xdddddd, alpha: 0.5 });
      boardLayer.addChild(gridLines);

      // Tray background
      const TRAY_VIEWPORT_WIDTH = APP_WIDTH - 100;
      const TRAY_VIEWPORT_X = 50;

      const trayBg = new PIXI.Graphics()
        .rect(0, 0, TRAY_VIEWPORT_WIDTH, TRAY_HEIGHT)
        .fill(0xf0f0f0)
        .stroke({ width: 1, color: 0xdcdcdc });

      trayBg.x = TRAY_VIEWPORT_X;
      trayBg.y = TRAY_Y;
      trayLayer.addChild(trayBg);

      // Tray container with mask for clipping
      const trayContainer = new PIXI.Container();
      trayContainer.x = TRAY_VIEWPORT_X;
      trayContainer.y = TRAY_Y;

      const trayMask = new PIXI.Graphics()
        .rect(0, 0, TRAY_VIEWPORT_WIDTH, TRAY_HEIGHT)
        .fill(0xffffff);
      trayContainer.mask = trayMask;
      trayContainer.addChild(trayMask);

      trayLayer.addChild(trayContainer);

      // Create pieces array
      const pieces = [];

      // Helper function to create a piece
      const createPiece = (row, col) => {
        const piece = new PIXI.Container();
        piece.eventMode = 'static';
        piece.cursor = 'pointer';

        // Store metadata
        piece.gridRow = row;
        piece.gridCol = col;
        piece.onBoard = false;
        piece.targetX = BOARD_X + col * PIECE_SIZE;
        piece.targetY = BOARD_Y + row * PIECE_SIZE;

        // Create mask
        const mask = new PIXI.Graphics()
          .rect(0, 0, PIECE_SIZE, PIECE_SIZE)
          .fill({ color: 0xffffff });

        // Create sprite with scaled texture
        const scale = BOARD_SIZE / imageElement.width;
        const sprite = new PIXI.Sprite(texture);
        sprite.scale.set(scale);
        sprite.position.set(-col * PIECE_SIZE, -row * PIECE_SIZE);
        sprite.mask = mask;

        // Create border
        const border = new PIXI.Graphics()
          .rect(0, 0, PIECE_SIZE, PIECE_SIZE)
          .stroke({ width: 2, color: 0x000000 });

        // Add in order: mask, sprite, border
        piece.addChild(mask, sprite, border);

        return piece;
      };

      // Create all pieces
      let pieceIndex = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const piece = createPiece(r, c);
          piece.pieceId = pieceIndex++;

          // Position in tray
          piece.x = pieces.length * (PIECE_SIZE + PIECE_GAP) + 10;
          piece.y = 15;
          piece.origX = piece.x;
          piece.origY = piece.y;

          pieces.push(piece);
          trayContainer.addChild(piece);
        }
      }

      console.log('✅ Created', pieces.length, 'pieces');

      // Drag and drop handlers
      const handlePieceDown = (piece) => {
        dragLayer.addChild(piece);
        piece.isDragging = true;
      };

      const handlePieceUp = (piece) => {
        const SNAP_DISTANCE = 18;
        const targetX = piece.targetX;
        const targetY = piece.targetY;

        if (
          Math.abs(piece.x + TRAY_VIEWPORT_X - targetX) < SNAP_DISTANCE &&
          Math.abs(piece.y + TRAY_VIEWPORT_Y - targetY) < SNAP_DISTANCE
        ) {
          // Snap to board
          piece.x = targetX - TRAY_VIEWPORT_X;
          piece.y = targetY - TRAY_VIEWPORT_Y;
          piece.onBoard = true;
          piece.eventMode = 'none';
          boardLayer.addChild(piece);
          updateProgress();
        } else {
          // Return to tray
          piece.x = piece.origX;
          piece.y = piece.origY;
          trayContainer.addChild(piece);
        }

        piece.isDragging = false;
      };

      // Add drag listeners to pieces
      pieces.forEach(piece => {
        piece.on('pointerdown', () => handlePieceDown(piece));

        piece.on('pointermove', (e) => {
          if (piece.isDragging) {
            piece.x = e.global.x - TRAY_VIEWPORT_X;
            piece.y = e.global.y - TRAY_VIEWPORT_Y;
          }
        });

        piece.on('pointerup', () => handlePieceUp(piece));
        piece.on('pointerupoutside', () => handlePieceUp(piece));
      });

      // Progress text
      const progressText = new PIXI.Text({
        text: `Progress: 0/${pieces.length}`,
        style: {
          fontSize: 16,
          fill: 0x333333,
          fontFamily: 'Arial',
        },
      });
      progressText.position.set(BOARD_X, BOARD_Y - 30);
      boardLayer.addChild(progressText);

      // Update progress function
      const updateProgress = () => {
        const placed = pieces.filter(p => p.onBoard).length;
        progressText.text = `Progress: ${placed}/${pieces.length}`;

        if (placed === pieces.length) {
          progressText.text += ' - COMPLETED! 🎉';
          if (onProgress) onProgress(100);
        } else if (onProgress) {
          onProgress((placed / pieces.length) * 100);
        }
      };

      // Scroll buttons
      const createButton = (text, x, y) => {
        const btn = new PIXI.Container();
        btn.x = x;
        btn.y = y;
        btn.eventMode = 'static';
        btn.cursor = 'pointer';

        const bg = new PIXI.Graphics()
          .rect(-20, -22.5, 40, 45)
          .fill(0xc8b6ff)
          .stroke({ width: 2, color: 0x7c3aed });

        const lbl = new PIXI.Text({
          text,
          style: { fontSize: 24, fill: 0x333333, fontFamily: 'Arial' },
        });
        lbl.anchor.set(0.5);

        btn.addChild(bg, lbl);
        return btn;
      };

      const scrollLeftBtn = createButton('<', 10, TRAY_Y + TRAY_HEIGHT / 2);
      const scrollRightBtn = createButton('>', APP_WIDTH - 40, TRAY_Y + TRAY_HEIGHT / 2);

      let scrollOffset = 0;
      const scrollStep = PIECE_SIZE + PIECE_GAP;

      scrollLeftBtn.on('pointerdown', () => {
        scrollOffset = Math.min(scrollOffset + scrollStep, 0);
        pieces.forEach(p => {
          if (!p.onBoard) {
            p.x += scrollStep;
          }
        });
      });

      scrollRightBtn.on('pointerdown', () => {
        scrollOffset = Math.max(scrollOffset - scrollStep, -(pieces.length * scrollStep));
        pieces.forEach(p => {
          if (!p.onBoard) {
            p.x -= scrollStep;
          }
        });
      });

      uiLayer.addChild(scrollLeftBtn, scrollRightBtn);

      setLoading(false);
      console.log('✅ Game setup complete');
    } catch (err) {
      console.error('Setup error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (error) {
    return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;
  }

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
    >
      {loading && <div style={{ padding: '20px' }}>Loading puzzle...</div>}
    </div>
  );
}
