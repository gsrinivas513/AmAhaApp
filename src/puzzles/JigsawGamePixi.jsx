import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { generateJigsawPieces } from './classicJigsaw/generateJigsawPieces';

const ROWS = 4;
const COLS = 3;

const APP_WIDTH = 1100;
const APP_HEIGHT = 750;

const BOARD_X = 20;
const BOARD_Y = 20;
const BOARD_SIZE = 500;

const TRAY_Y = 540;
const TRAY_HEIGHT = 180;

const PIECE_GAP = 8;
const PIECE_SIZE = BOARD_SIZE / COLS;

export default function JigsawGamePixi({ puzzle }) {
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    if (!puzzle?.data?.imageUrl || !canvasRef.current) return;

    const initGame = async () => {
      try {
        // Create PIXI App
        const app = new PIXI.Application();
        await app.init({
          width: APP_WIDTH,
          height: APP_HEIGHT,
          backgroundColor: 0xf6f6f6,
          antialias: true,
        });

        appRef.current = app;
        canvasRef.current.innerHTML = '';
        canvasRef.current.appendChild(app.canvas);

        // Layers
        const boardLayer = new PIXI.Container();
        const trayLayer = new PIXI.Container();
        const dragLayer = new PIXI.Container();
        const uiLayer = new PIXI.Container();

        app.stage.addChild(boardLayer, trayLayer, dragLayer, uiLayer);
        trayLayer.y = TRAY_Y;

        // Load image
        const texture = await PIXI.Assets.load(puzzle.data.imageUrl);
        if (!texture || texture.width === 0) {
          console.error('❌ Image failed to load');
          return;
        }

        console.log('✅ Image loaded:', texture.width, 'x', texture.height);

        // Board background (blurred)
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

        // Progress text
        const progressText = new PIXI.Text({
          text: `Progress: 0/${ROWS * COLS}`,
          style: {
            fontSize: 16,
            fill: 0x333333,
            fontFamily: 'Arial',
          },
        });
        progressText.position.set(BOARD_X, BOARD_Y - 30);
        boardLayer.addChild(progressText);

        // Generate pieces
        const pieces = [];
        let pieceIndex = 0;
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            const piece = createPiece(texture, r, c);
            piece.gridRow = r;
            piece.gridCol = c;
            piece.onBoard = false;
            pieces.push(piece);
            pieceIndex++;
          }
        }

        // Shuffle
        const shuffled = [...pieces].sort(() => Math.random() - 0.5);
        shuffled.forEach((piece, idx) => {
          piece.x = idx * (PIECE_SIZE + PIECE_GAP) + 10;
          piece.y = 15;
          piece.originalX = piece.x;
          piece.originalY = piece.y;
          trayLayer.addChild(piece);
        });

        console.log('✅ Pieces created:', pieces.length);

        // Progress update
        function updateProgress() {
          const placed = pieces.filter(p => p.onBoard).length;
          progressText.text = `Progress: ${placed}/${pieces.length}`;
          if (placed === pieces.length) {
            progressText.text += ' - COMPLETED! 🎉';
          }
        }

        // Tray UI
        const TRAY_VIEWPORT_WIDTH = APP_WIDTH - 100;
        const TRAY_VIEWPORT_X = 50;

        const trayBg = new PIXI.Graphics()
          .rect(0, 0, TRAY_VIEWPORT_WIDTH, TRAY_HEIGHT)
          .fill(0xf0f0f0)
          .stroke({ width: 1, color: 0xdcdcdc });
        trayBg.x = TRAY_VIEWPORT_X;
        trayLayer.addChild(trayBg);

        // Tray viewport
        const trayViewport = new PIXI.Container();
        const trayContainer = new PIXI.Container();
        trayViewport.addChild(trayContainer);
        trayViewport.x = TRAY_VIEWPORT_X;
        trayLayer.addChild(trayViewport);

        const trayMask = new PIXI.Graphics()
          .rect(0, 0, TRAY_VIEWPORT_WIDTH, TRAY_HEIGHT)
          .fill(0xffffff);
        trayViewport.mask = trayMask;
        trayViewport.addChild(trayMask);

        // Scroll state
        let scrollOffsetX = 0;
        const scrollStep = PIECE_SIZE + PIECE_GAP;
        const totalTrayWidth = pieces.length * scrollStep + 20;
        const minScroll = TRAY_VIEWPORT_WIDTH - totalTrayWidth;
        const maxScroll = 0;

        // Scroll buttons
        const scrollLeftBtn = createArrowButton('<', 10, TRAY_Y + TRAY_HEIGHT / 2 - 22.5);
        const scrollRightBtn = createArrowButton('>', APP_WIDTH - 40, TRAY_Y + TRAY_HEIGHT / 2 - 22.5);

        scrollLeftBtn.on('pointerdown', () => {
          scrollOffsetX = Math.min(scrollOffsetX + scrollStep, maxScroll);
          trayContainer.x = scrollOffsetX;
        });

        scrollRightBtn.on('pointerdown', () => {
          scrollOffsetX = Math.max(scrollOffsetX - scrollStep, minScroll);
          trayContainer.x = scrollOffsetX;
        });

        uiLayer.addChild(scrollLeftBtn, scrollRightBtn);

        // Create piece function
        function createPiece(texture, row, col) {
          const piece = new PIXI.Container();
          piece.eventMode = 'static';
          piece.cursor = 'pointer';
          piece.gridRow = row;
          piece.gridCol = col;

          // Create SVG path from generator
          const svgPath = createSvgPath(row, col);
          const graphics = new PIXI.Graphics();
          // Simple rectangle for now - can be replaced with actual path rendering
          graphics.rect(0, 0, PIECE_SIZE, PIECE_SIZE).fill(0xffffff);

          // Clipping mask
          const mask = new PIXI.Graphics()
            .rect(0, 0, PIECE_SIZE, PIECE_SIZE)
            .fill(0xffffff);

          // Sprite with pattern
          const scale = BOARD_SIZE / texture.width;
          const sprite = new PIXI.Sprite(texture);
          sprite.scale.set(scale);
          sprite.position.set(-col * PIECE_SIZE, -row * PIECE_SIZE);
          sprite.mask = mask;

          // Border
          const border = new PIXI.Graphics()
            .rect(0, 0, PIECE_SIZE, PIECE_SIZE)
            .stroke({ width: 2, color: 0x000000 });

          piece.addChild(mask, sprite, border);

          // Drag state
          piece.isDragging = false;
          piece.dragStartX = 0;
          piece.dragStartY = 0;
          piece.movedDistance = 0;

          piece.on('pointerdown', (e) => onPieceDown.call(piece, e));
          piece.on('pointermove', (e) => onPieceMove.call(piece, e));
          piece.on('pointerup', (e) => onPieceUp.call(piece, e));
          piece.on('pointerupoutside', (e) => onPieceUp.call(piece, e));

          return piece;
        }

        // Helper to create SVG path (simplified)
        function createSvgPath(row, col) {
          // Placeholder - would use generateJigsawPieces logic
          return `rect(0,0,${PIECE_SIZE},${PIECE_SIZE})`;
        }

        // Drag handlers
        function onPieceDown(e) {
          this.isDragging = false;
          this.dragStartX = e.global.x;
          this.dragStartY = e.global.y;
          this.movedDistance = 0;
          this.pieceStartX = this.x;
          this.pieceStartY = this.y;
          this.startParent = this.parent;

          const globalPos = this.getGlobalPosition();
          this.globalStartX = globalPos.x;
          this.globalStartY = globalPos.y;
        }

        function onPieceMove(e) {
          if (e.buttons === 0) return;

          const deltaX = e.global.x - this.dragStartX;
          const deltaY = e.global.y - this.dragStartY;
          this.movedDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (!this.isDragging && this.movedDistance > 5) {
            this.isDragging = true;
            this.alpha = 0.8;
            dragLayer.addChild(this);
            this.position.set(this.globalStartX, this.globalStartY);
            this.dragRefX = this.globalStartX;
            this.dragRefY = this.globalStartY;
          }

          if (this.isDragging) {
            const newDeltaX = e.global.x - this.dragStartX;
            const newDeltaY = e.global.y - this.dragStartY;
            this.position.set(this.dragRefX + newDeltaX, this.dragRefY + newDeltaY);
          }
        }

        function onPieceUp(e) {
          this.alpha = 1;

          if (this.isDragging) {
            const globalPos = this.getGlobalPosition();
            const pieceLeft = globalPos.x;
            const pieceTop = globalPos.y;
            const pieceRight = pieceLeft + PIECE_SIZE;
            const pieceBottom = pieceTop + PIECE_SIZE;

            const overlapLeft = Math.max(pieceLeft, BOARD_X);
            const overlapTop = Math.max(pieceTop, BOARD_Y);
            const overlapRight = Math.min(pieceRight, BOARD_X + BOARD_SIZE);
            const overlapBottom = Math.min(pieceBottom, BOARD_Y + BOARD_SIZE);

            const overlapWidth = Math.max(0, overlapRight - overlapLeft);
            const overlapHeight = Math.max(0, overlapBottom - overlapTop);
            const overlapArea = overlapWidth * overlapHeight;
            const requiredArea = (PIECE_SIZE * PIECE_SIZE) / 2;

            const isOverBoard = overlapArea >= requiredArea;

            if (isOverBoard) {
              const relX = pieceLeft - BOARD_X;
              const relY = pieceTop - BOARD_Y;
              const gridCol = Math.round(relX / PIECE_SIZE);
              const gridRow = Math.round(relY / PIECE_SIZE);

              const validCol = Math.max(0, Math.min(COLS - 1, gridCol));
              const validRow = Math.max(0, Math.min(ROWS - 1, gridRow));

              const gridX = BOARD_X + validCol * PIECE_SIZE;
              const gridY = BOARD_Y + validRow * PIECE_SIZE;

              boardLayer.addChild(this);
              this.position.set(gridX, gridY);
              this.onBoard = true;
              updateProgress();
            } else {
              trayContainer.addChild(this);
              this.position.set(this.pieceStartX, this.pieceStartY);
              this.onBoard = false;
              updateProgress();
            }

            this.isDragging = false;
          }
        }

        function createArrowButton(label, x, y) {
          const btn = new PIXI.Container();
          btn.x = x;
          btn.y = y;
          btn.eventMode = 'static';
          btn.cursor = 'pointer';

          const bg = new PIXI.Graphics()
            .roundRect(0, 0, 45, 45, 6)
            .fill(0xffffff)
            .stroke({ width: 2, color: 0x999999 });

          const text = new PIXI.Text({
            text: label,
            style: {
              fontSize: 24,
              fill: 0x000000,
              fontWeight: 'bold',
              fontFamily: 'Arial',
            },
          });

          text.anchor.set(0.5);
          text.position.set(22.5, 22.5);

          btn.addChild(bg, text);

          btn.on('pointerenter', () => {
            bg.clear()
              .roundRect(0, 0, 45, 45, 6)
              .fill(0xf0f0f0)
              .stroke({ width: 2, color: 0x666666 });
          });

          btn.on('pointerleave', () => {
            bg.clear()
              .roundRect(0, 0, 45, 45, 6)
              .fill(0xffffff)
              .stroke({ width: 2, color: 0x999999 });
          });

          return btn;
        }

        console.log('✅ Jigsaw puzzle ready!');
      } catch (error) {
        console.error('❌ Error initializing game:', error);
      }
    };

    initGame();

    return () => {
      if (appRef.current) {
        appRef.current.destroy();
      }
    };
  }, [puzzle]);

  return (
    <div
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f6f6f6',
      }}
    />
  );
}
