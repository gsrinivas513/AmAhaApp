import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { generateJigsawPieces } from './classicJigsaw/generateJigsawPieces';
import { createAllJigsawPieces } from './classicJigsaw/pixi-jigsaw-renderer';
import { useTheme } from '../context/ThemeContext';

const APP_WIDTH = 1100;
const APP_HEIGHT = 750;

const BOARD_X = 20;
const BOARD_Y = 20;
const BOARD_SIZE = 500;

const TRAY_Y = 540;
const TRAY_HEIGHT = 180;

const PIECE_GAP = 8;

export default function JigsawGamePixi({ puzzle }) {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedVariantId, setSelectedVariantId] = useState(0);

  useEffect(() => {
    if (!puzzle?.data?.imageUrl || !canvasRef.current) return;

    const initGame = async () => {
      try {
        // Get rows and cols from selected variant
        const allVariants = puzzle?.data?.allVariants || [];
        const selectedVariant = allVariants[selectedVariantId] || puzzle?.data?.selectedVariant;
        const ROWS = selectedVariant?.rows || puzzle?.data?.rows || 4;
        const COLS = selectedVariant?.cols || puzzle?.data?.cols || 3;
        
        // Calculate optimal board size based on container
        const containerWidth = canvasRef.current.clientWidth || 1200;
        const containerHeight = canvasRef.current.clientHeight || 700;
        
        // Use as much space as possible
        const maxWidth = containerWidth - 20;
        const maxHeight = containerHeight - 20;
        
        // Board size calculation - calculate piece size first to ensure equal square pieces
        // Piece size = min(width/cols, height/rows) to ensure square pieces that fit
        const maxPieceWidthSize = (maxWidth * 0.85) / COLS;
        const maxPieceHeightSize = (maxHeight * 0.55) / ROWS;
        const PIECE_SIZE = Math.min(maxPieceWidthSize, maxPieceHeightSize);  // Square pieces
        
        // Board dimensions - EXACT multiple of piece size for perfect grid alignment
        const BOARD_WIDTH = COLS * PIECE_SIZE;   // Exactly COLS pieces wide
        const BOARD_HEIGHT = ROWS * PIECE_SIZE;  // Exactly ROWS pieces tall
        const BOARD_SIZE = Math.max(BOARD_WIDTH, BOARD_HEIGHT);  // For border calculations
        
        const APP_WIDTH = containerWidth;
        const APP_HEIGHT = containerHeight;
        const BOARD_X = (APP_WIDTH - BOARD_WIDTH) / 2;  // Center horizontally
        const BOARD_Y = 20;  // Top margin
        
        const TRAY_Y = BOARD_Y + BOARD_HEIGHT + 20;
        const TRAY_HEIGHT = Math.max(200, APP_HEIGHT - TRAY_Y - 20);
        const PIECE_GAP = 8;
        
        console.log('🎮 [JigsawGamePixi] Game dimensions:', {
          ROWS, COLS, PIECE_SIZE, BOARD_WIDTH, BOARD_HEIGHT,
          APP_WIDTH, APP_HEIGHT, BOARD_X, BOARD_Y
        });
        
        // Create PIXI App
        const app = new PIXI.Application();
        await app.init({
          width: APP_WIDTH,
          height: APP_HEIGHT,
          backgroundColor: 0xffffff,
          antialias: true,
          resolution: 1,
        });

        appRef.current = app;
        canvasRef.current.innerHTML = '';
        canvasRef.current.appendChild(app.canvas);

        // ONE main container with border - everything inside
        const mainContainer = new PIXI.Container();
        app.stage.addChild(mainContainer);
        
        // Draw outer border
        const border = new PIXI.Graphics()
          .rect(10, 10, APP_WIDTH - 20, APP_HEIGHT - 20)
          .stroke({ width: 2, color: 0xcccccc });
        mainContainer.addChild(border);

        // Layers inside main container
        const boardLayer = new PIXI.Container();
        const trayLayer = new PIXI.Container();
        const dragLayer = new PIXI.Container();
        const uiLayer = new PIXI.Container();

        mainContainer.addChild(boardLayer, trayLayer, dragLayer, uiLayer);
        
        // Reposition board to be inside the border
        boardLayer.x = 10;
        boardLayer.y = 10;
        
        // Tray positioned right below the board, still inside border
        trayLayer.x = 10;
        trayLayer.y = TRAY_Y;

        // Load image
        const texture = await PIXI.Assets.load(puzzle.data.imageUrl);
        if (!texture || texture.width === 0) {
          console.error('❌ Image failed to load');
          return;
        }

        const baseTexture = texture.baseTexture;
        console.log('✅ Image loaded:', texture.width, 'x', texture.height);

        // Board background (blurred)
        const boardBg = new PIXI.Sprite(texture);
        boardBg.x = BOARD_X;
        boardBg.y = BOARD_Y;
        boardBg.width = BOARD_WIDTH;
        boardBg.height = BOARD_HEIGHT;
        const blurFilter = new PIXI.BlurFilter({ strength: 8 });
        boardBg.filters = [blurFilter];
        boardBg.alpha = 0.6;
        boardLayer.addChild(boardBg);

        // Board inner border (around puzzle area, not outer border)
        const boardBorder = new PIXI.Graphics()
          .rect(BOARD_X, BOARD_Y, BOARD_WIDTH, BOARD_HEIGHT)
          .stroke({ width: 1, color: 0xdddddd });
        boardLayer.addChild(boardBorder);

        // Grid lines
        const gridLines = new PIXI.Graphics();
        for (let c = 1; c < COLS; c++) {
          const x = BOARD_X + c * PIECE_SIZE;
          gridLines.moveTo(x, BOARD_Y);
          gridLines.lineTo(x, BOARD_Y + BOARD_HEIGHT);
        }
        for (let r = 1; r < ROWS; r++) {
          const y = BOARD_Y + r * PIECE_SIZE;
          gridLines.moveTo(BOARD_X, y);
          gridLines.lineTo(BOARD_X + BOARD_WIDTH, y);
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
        progressText.position.set(BOARD_X, BOARD_Y - 50);
        boardLayer.addChild(progressText);

        // Generate jigsaw pieces with curved edges using the SVG path generator
        const pieceWidth = texture.width / COLS;
        const pieceHeight = texture.height / ROWS;

        console.log(`🧩 Generating ${ROWS * COLS} pieces with curved edges...`);
        const pieceDataArray = generateJigsawPieces(texture, ROWS, COLS);
        
        // Create PixiJS pieces from the data
        const pieces = createAllJigsawPieces(
          pieceDataArray,
          baseTexture,
          pieceWidth,
          pieceHeight,
          APP_WIDTH,
          APP_HEIGHT
        );
        console.log(`✨ Created ${pieces.length} pieces with curved edges`);

        // Mark pieces as not on board initially
        pieces.forEach(p => p.onBoard = false);

        // Shuffle
        const shuffled = [...pieces].sort(() => Math.random() - 0.5);
        
        // Define tray dimensions first (needed for VISIBLE_PIECES_COUNT calculation)
        const TRAY_VIEWPORT_WIDTH = APP_WIDTH - 40;
        const TRAY_VIEWPORT_X = 20;
        
        // Calculate how many pieces fit in horizontal view (based on actual piece width)
        const avgPieceDisplayWidth = pieceWidth * 0.8; // Curved pieces are slightly smaller than bounding box
        const VISIBLE_PIECES_COUNT = Math.max(3, Math.floor((TRAY_VIEWPORT_WIDTH - 100) / (avgPieceDisplayWidth + 2)));
        
        // Position all pieces in a single horizontal row - TIGHT PACKING
        const minGap = 5;  // Gap between pieces
        
        // Start from left edge with small margin
        const startX = TRAY_VIEWPORT_X + 10;
        
        shuffled.forEach((piece, idx) => {
          piece.x = startX + idx * (pieceWidth + minGap);
          piece.y = (TRAY_HEIGHT - pieceHeight) / 2;  // Center vertically in tray
          piece.originalX = piece.x;
          piece.originalY = piece.y;
        });
        console.log(`✅ Pieces positioned: tight packing, gap=${minGap}px, count=${shuffled.length}`);

        // Progress update
        function updateProgress() {
          const placed = pieces.filter(p => p.onBoard).length;
          progressText.text = `Progress: ${placed}/${pieces.length}`;
          if (placed === pieces.length) {
            progressText.text += ' - COMPLETED! 🎉';
          }
        }

        // Tray UI - no background box, pieces sit directly inside main container
        // (tray background removed - just use white space inside the orange border)

        // Tray label removed - use space for pieces

        // Tray viewport - simple container for pieces
        const trayViewport = new PIXI.Container();
        const trayContainer = new PIXI.Container();
        trayViewport.addChild(trayContainer);
        trayViewport.x = 0;  // Don't offset viewport, let pieces be positioned directly
        trayViewport.y = 0;  
        trayLayer.addChild(trayViewport);

        // NO MASK - just let pieces render freely

        // Scroll offset for pieces
        let scrollOffsetX = 0;
        const scrollStepSize = pieceWidth + minGap;  // Step size for horizontal scroll

        // Scroll button function
        function createModernArrow(isLeft) {
          const btn = new PIXI.Container();
          btn.eventMode = 'static';
          btn.cursor = 'pointer';

          const bg = new PIXI.Graphics()
            .rect(0, 0, 45, 70)
            .fill(0x4b5563)
            .stroke({ width: 1, color: 0x374151 });
          bg.cornerRadius = 4;

          const arrow = new PIXI.Text({
            text: isLeft ? '‹' : '›',
            style: {
              fontSize: 32,
              fill: 0xffffff,
              fontFamily: 'Arial',
              fontWeight: 'bold',
            },
          });
          arrow.anchor.set(0.5);
          arrow.position.set(22.5, 35);

          btn.addChild(bg, arrow);

          btn.on('pointerdown', () => {
            scrollOffsetX += isLeft ? scrollStepSize : -scrollStepSize;
            // Clamp to bounds
            const maxScroll = 0;
            const minScroll = -(shuffled.length - VISIBLE_PIECES_COUNT) * scrollStepSize;
            scrollOffsetX = Math.max(minScroll, Math.min(maxScroll, scrollOffsetX));
            trayContainer.x = scrollOffsetX;
          });

          btn.on('pointerenter', () => {
            bg.clear().rect(0, 0, 45, 70).fill(0x5a6370).stroke({ width: 1, color: 0x4b5563 });
            arrow.style.fill = 0xf3f4f6;
          });

          btn.on('pointerleave', () => {
            bg.clear().rect(0, 0, 45, 70).fill(0x4b5563).stroke({ width: 1, color: 0x374151 });
            arrow.style.fill = 0xffffff;
          });

          return btn;
        }

        // Add scroll buttons
        const scrollLeftBtn = createModernArrow(true);
        const scrollRightBtn = createModernArrow(false);
        scrollLeftBtn.x = TRAY_VIEWPORT_X - 50;
        scrollLeftBtn.y = TRAY_Y + TRAY_HEIGHT / 2 - 35;
        scrollRightBtn.x = TRAY_VIEWPORT_X + TRAY_VIEWPORT_WIDTH + 5;
        scrollRightBtn.y = TRAY_Y + TRAY_HEIGHT / 2 - 35;
        
        uiLayer.addChild(scrollLeftBtn, scrollRightBtn);

        // NOW add pieces to trayContainer after it's created
        console.log(`📦 Adding ${shuffled.length} pieces to trayContainer...`);
        shuffled.forEach((piece) => {
          trayContainer.addChild(piece);
        });
        console.log(`✅ All pieces added to tray - trayContainer has ${trayContainer.children.length} children`);

        // Scroll state
        // Pieces will be scrolled with modern arrow buttons (created above)

        // Add event listeners to pieces (after they're positioned)
        shuffled.forEach((piece) => {
          piece.on('pointerdown', (e) => onPieceDown.call(piece, e));
          piece.on('pointermove', (e) => onPieceMove.call(piece, e));
          piece.on('pointerup', (e) => onPieceUp.call(piece, e));
          piece.on('pointerupoutside', (e) => onPieceUp.call(piece, e));
        });

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
            const overlapRight = Math.min(pieceRight, BOARD_X + BOARD_WIDTH);
            const overlapBottom = Math.min(pieceBottom, BOARD_Y + BOARD_HEIGHT);

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
  }, [puzzle, selectedVariantId]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: theme.background,
        minHeight: '600px',
      }}
    >
      {/* Canvas Container - Takes most of the space */}
      <div
        ref={canvasRef}
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '500px',
          background: theme.background,
        }}
      />
    </div>
  );
}
