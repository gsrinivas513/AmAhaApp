import * as PIXI from "pixi.js";

(async () => {
  /* ========================== CONFIG ========================== */
  const ROWS = 4;
  const COLS = 4;

  const APP_WIDTH = 900;
  const APP_HEIGHT = 750;

  const BOARD_X = 20;
  const BOARD_Y = 20;
  const BOARD_SIZE = 500; // Balanced size to fit board + tray

  const TRAY_Y = 540;
  const TRAY_HEIGHT = 200;

  const PIECE_GAP = 8;
  const PIECE_SIZE = BOARD_SIZE / COLS;

  /* ========================== PIXI APP (v8) ========================== */
  const app = new PIXI.Application();
  await app.init({
    width: APP_WIDTH,
    height: APP_HEIGHT,
    backgroundColor: 0xf6f6f6,
    antialias: true,
  });

  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.body.style.overflow = "hidden";
  document.body.appendChild(app.canvas);

  console.log("✅ App initialized");

  /* ========================== LAYERS ========================== */
  const boardLayer = new PIXI.Container();
  const trayLayer = new PIXI.Container();
  const dragLayer = new PIXI.Container();
  const uiLayer = new PIXI.Container();

  app.stage.addChild(boardLayer, trayLayer, dragLayer, uiLayer);

  /* ========================== TRAY SETUP ========================== */
  trayLayer.y = TRAY_Y;

  // Calculate tray width to show puzzle pieces with scroll buttons
  const TRAY_VIEWPORT_WIDTH = APP_WIDTH - 100; // Full width minus button space
  const TRAY_VIEWPORT_X = 50; // Center with button space
  
  const trayBg = new PIXI.Graphics()
    .rect(0, 0, TRAY_VIEWPORT_WIDTH, TRAY_HEIGHT)
    .fill(0xf0f0f0)
    .stroke({ width: 1, color: 0xdcdcdc });

  trayBg.x = TRAY_VIEWPORT_X;
  trayLayer.addChild(trayBg);

  // Create tray viewport container with scrolling
  const trayViewport = new PIXI.Container();
  const trayContainer = new PIXI.Container();
  trayViewport.addChild(trayContainer);
  trayViewport.x = TRAY_VIEWPORT_X;
  trayLayer.addChild(trayViewport);

  // Apply mask to tray viewport (only show 4 pieces width)
  const trayMask = new PIXI.Graphics()
    .rect(0, 0, TRAY_VIEWPORT_WIDTH, TRAY_HEIGHT)
    .fill(0xffffff);
  trayViewport.mask = trayMask;
  trayViewport.addChild(trayMask);

  /* ========================== LOAD IMAGE ========================== */
  const texture = await PIXI.Assets.load("/kids.png");
  console.log("✅ Image loaded:", texture.width, "x", texture.height);
  
  if (!texture || texture.width === 0 || texture.height === 0) {
    console.error("❌ Failed to load texture properly!");
    return;
  }

  /* ========================== BOARD (AFTER TEXTURE LOADS) ========================== */
  // Create board background with the full puzzle image
  const boardBg = new PIXI.Sprite(texture);
  boardBg.x = BOARD_X;
  boardBg.y = BOARD_Y;
  boardBg.width = BOARD_SIZE;
  boardBg.height = BOARD_SIZE;
  
  // Add blur filter to make the background less visible
  const blurFilter = new PIXI.BlurFilter({ strength: 8 });
  boardBg.filters = [blurFilter];
  
  // Reduce alpha for additional blur effect
  boardBg.alpha = 0.6;
  
  boardLayer.addChild(boardBg);

  // Create board border
  const boardBorder = new PIXI.Graphics()
    .rect(BOARD_X, BOARD_Y, BOARD_SIZE, BOARD_SIZE)
    .stroke({ width: 2, color: 0xcccccc });
  boardLayer.addChild(boardBorder);

  // Draw grid lines on the board
  const gridLines = new PIXI.Graphics();
  
  // Vertical lines
  for (let c = 1; c < COLS; c++) {
    const x = BOARD_X + c * PIECE_SIZE;
    gridLines.moveTo(x, BOARD_Y);
    gridLines.lineTo(x, BOARD_Y + BOARD_SIZE);
  }
  
  // Horizontal lines
  for (let r = 1; r < ROWS; r++) {
    const y = BOARD_Y + r * PIECE_SIZE;
    gridLines.moveTo(BOARD_X, y);
    gridLines.lineTo(BOARD_X + BOARD_SIZE, y);
  }
  
  gridLines.stroke({ width: 1, color: 0xdddddd, alpha: 0.5 });
  boardLayer.addChild(gridLines);

  /* ========================== CREATE PIECES ========================== */
  const pieces = [];
  let pieceIndex = 0;

  // Create all pieces in grid order first
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const piece = createPiece(texture, r, c);
      piece.gridRow = r;
      piece.gridCol = c;
      pieces.push(piece);
      pieceIndex++;
    }
  }

  // Shuffle the pieces array for random tray order
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  const shuffledPieces = shuffleArray(pieces);

  // Add shuffled pieces to tray in random order
  shuffledPieces.forEach((piece, index) => {
    piece.x = index * (PIECE_SIZE + PIECE_GAP) + 10;
    piece.y = 15;
    piece.originalX = piece.x;
    piece.originalY = piece.y;
    trayContainer.addChild(piece);
  });

  console.log("✅ Pieces created:", pieces.length);

  // Initialize piece tracking
  pieces.forEach(p => {
    p.onBoard = false;
  });

  /* ========================== PROGRESS DISPLAY ========================== */
  const progressText = new PIXI.Text({
    text: `Progress: 0/${pieces.length}`,
    style: {
      fontSize: 16,
      fill: 0x333333,
      fontFamily: "Arial",
    },
  });
  progressText.position.set(BOARD_X, BOARD_Y - 30);
  boardLayer.addChild(progressText);

  // Function to update progress
  function updateProgress() {
    const placedCount = pieces.filter(p => p.onBoard).length;
    progressText.text = `Progress: ${placedCount}/${pieces.length}`;
    
    if (placedCount === pieces.length) {
      progressText.text += " - COMPLETED! 🎉";
    }
  }

  /* ========================== TRAY SCROLL ========================== */
  let scrollOffsetX = 0;
  const scrollStep = PIECE_SIZE + PIECE_GAP;
  const totalTrayContentWidth = pieces.length * scrollStep + 20;
  const minScroll = TRAY_VIEWPORT_WIDTH - totalTrayContentWidth; // This will be NEGATIVE
  const maxScroll = 0; // Can't scroll past the beginning

  console.log("Scroll config - step:", scrollStep, "minScroll:", minScroll, "totalWidth:", totalTrayContentWidth);

  const scrollLeftBtn = createArrowButton("<", 10, TRAY_Y + TRAY_HEIGHT / 2 - 22.5);
  const scrollRightBtn = createArrowButton(">", APP_WIDTH - 40, TRAY_Y + TRAY_HEIGHT / 2 - 22.5);

  scrollLeftBtn.on("pointerdown", () => {
    scrollOffsetX = Math.min(scrollOffsetX + scrollStep, maxScroll);
    trayContainer.x = scrollOffsetX;
    console.log("Scroll left - new offset:", scrollOffsetX);
  });

  scrollRightBtn.on("pointerdown", () => {
    scrollOffsetX = Math.max(scrollOffsetX - scrollStep, minScroll);
    trayContainer.x = scrollOffsetX;
    console.log("Scroll right - new offset:", scrollOffsetX);
  });

  uiLayer.addChild(scrollLeftBtn, scrollRightBtn);

  /* ========================== PIECE CREATION ========================== */
  function createPiece(texture, row, col) {
    const piece = new PIXI.Container();
    piece.eventMode = "static";
    piece.cursor = "pointer";

    // Store original position for drag cancellation
    piece.gridRow = row;
    piece.gridCol = col;

    // Create clipping mask for this piece
    const mask = new PIXI.Graphics()
      .rect(0, 0, PIECE_SIZE, PIECE_SIZE)
      .fill({ color: 0xffffff });

    // Create sprite with scaled texture to match board background
    // The board shows the full 1024x1024 image scaled to BOARD_SIZE (420x420)
    // So each piece's sprite should also be scaled by the same factor
    const scale = BOARD_SIZE / texture.width;
    
    const sprite = new PIXI.Sprite(texture);
    sprite.scale.set(scale);
    
    // Position sprite to show the correct portion
    sprite.position.set(-col * PIECE_SIZE, -row * PIECE_SIZE);
    sprite.mask = mask;

    // Create border
    const border = new PIXI.Graphics()
      .rect(0, 0, PIECE_SIZE, PIECE_SIZE)
      .stroke({ width: 2, color: 0x000000 });

    // Add children: mask, sprite (with mask), border on top
    piece.addChild(mask, sprite, border);

    // Drag tracking - attach to piece
    piece.isDragging = false;
    piece.dragStartGlobalX = 0;
    piece.dragStartGlobalY = 0;
    piece.dragStartPieceX = 0;
    piece.dragStartPieceY = 0;
    piece.movedDistance = 0;

    piece.on("pointerdown", (e) => onPiecePointerDown.call(piece, e));
    piece.on("pointermove", (e) => onPiecePointerMove.call(piece, e));
    piece.on("pointerup", (e) => onPiecePointerUp.call(piece, e));
    piece.on("pointerupoutside", (e) => onPiecePointerUp.call(piece, e));

    return piece;
  }

  /* ========================== PIECE DRAG HANDLERS ========================== */
  function onPiecePointerDown(e) {
    this.isDragging = false;
    this.dragStartX = e.global.x;
    this.dragStartY = e.global.y;
    this.movedDistance = 0;
    this.pieceStartX = this.x;
    this.pieceStartY = this.y;
    this.startParent = this.parent;
    
    // Get the piece's current global position
    const globalPos = this.getGlobalPosition();
    this.globalStartX = globalPos.x;
    this.globalStartY = globalPos.y;
    
    console.log("Piece down - local:", this.pieceStartX, this.pieceStartY, "global:", this.globalStartX, this.globalStartY);
  }

  function onPiecePointerMove(e) {
    if (e.buttons === 0) return;
    
    const deltaX = e.global.x - this.dragStartX;
    const deltaY = e.global.y - this.dragStartY;
    this.movedDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Start dragging after 5px movement
    if (!this.isDragging && this.movedDistance > 5) {
      this.isDragging = true;
      this.alpha = 0.8;
      
      // Move to drag layer at the correct global position
      dragLayer.addChild(this);
      this.position.set(this.globalStartX, this.globalStartY);
      
      // Update reference for continued dragging
      this.dragRefX = this.globalStartX;
      this.dragRefY = this.globalStartY;
      
      console.log("Started dragging - moved to dragLayer at:", this.globalStartX, this.globalStartY);
    }

    // Move piece while dragging
    if (this.isDragging) {
      const newDeltaX = e.global.x - this.dragStartX;
      const newDeltaY = e.global.y - this.dragStartY;
      
      this.position.set(
        this.dragRefX + newDeltaX,
        this.dragRefY + newDeltaY
      );
    }
  }

  function onPiecePointerUp(e) {
    this.alpha = 1;

    if (this.isDragging) {
      const globalPos = this.getGlobalPosition();
      
      // Calculate piece bounds (top-left is at globalPos)
      const pieceLeft = globalPos.x;
      const pieceTop = globalPos.y;
      const pieceRight = pieceLeft + PIECE_SIZE;
      const pieceBottom = pieceTop + PIECE_SIZE;
      
      // Check if at least 50% of piece is over the board
      const overlapLeft = Math.max(pieceLeft, BOARD_X);
      const overlapTop = Math.max(pieceTop, BOARD_Y);
      const overlapRight = Math.min(pieceRight, BOARD_X + BOARD_SIZE);
      const overlapBottom = Math.min(pieceBottom, BOARD_Y + BOARD_SIZE);
      
      const overlapWidth = Math.max(0, overlapRight - overlapLeft);
      const overlapHeight = Math.max(0, overlapBottom - overlapTop);
      const overlapArea = overlapWidth * overlapHeight;
      const requiredArea = (PIECE_SIZE * PIECE_SIZE) / 2;

      const isOverBoard = overlapArea >= requiredArea;

      console.log("Released - globalPos:", globalPos.x, globalPos.y, "isOverBoard:", isOverBoard);

      if (isOverBoard) {
        // Calculate grid cell from piece's top-left corner
        const relX = pieceLeft - BOARD_X;
        const relY = pieceTop - BOARD_Y;
        
        const gridCol = Math.round(relX / PIECE_SIZE);
        const gridRow = Math.round(relY / PIECE_SIZE);
        
        // Clamp to valid grid positions
        const validCol = Math.max(0, Math.min(COLS - 1, gridCol));
        const validRow = Math.max(0, Math.min(ROWS - 1, gridRow));
        
        // Position at exact grid cell location
        const gridX = BOARD_X + validCol * PIECE_SIZE;
        const gridY = BOARD_Y + validRow * PIECE_SIZE;
        
        console.log("Placed at grid [", validRow, ",", validCol, "]");
        boardLayer.addChild(this);
        this.position.set(gridX, gridY);
        this.onBoard = true;
        this.boardRow = validRow;
        this.boardCol = validCol;
        updateProgress();
      } else {
        // Return to tray
        console.log("Returned to tray");
        trayContainer.addChild(this);
        this.position.set(this.pieceStartX, this.pieceStartY);
        this.onBoard = false;
        updateProgress();
      }
      
      this.isDragging = false;
    }
  }

  /* ========================== ARROW BUTTON ========================== */
  function createArrowButton(label, x, y) {
    const btn = new PIXI.Container();
    btn.x = x;
    btn.y = y;
    btn.eventMode = "static";
    btn.cursor = "pointer";

    const bg = new PIXI.Graphics()
      .roundRect(0, 0, 45, 45, 6)
      .fill({ color: 0xffffff })
      .stroke({ width: 2, color: 0x999999 });

    const text = new PIXI.Text({
      text: label,
      style: {
        fontSize: 24,
        fill: 0x000000,
        fontWeight: "bold",
        fontFamily: "Arial",
      },
    });

    text.anchor.set(0.5);
    text.position.set(22.5, 22.5);

    btn.addChild(bg, text);
    
    // Add hover effects
    btn.on("pointerenter", () => {
      bg.clear().roundRect(0, 0, 45, 45, 6).fill({ color: 0xf0f0f0 }).stroke({ width: 2, color: 0x666666 });
    });
    
    btn.on("pointerleave", () => {
      bg.clear().roundRect(0, 0, 45, 45, 6).fill({ color: 0xffffff }).stroke({ width: 2, color: 0x999999 });
    });

    return btn;
  }

  console.log("✅ Jigsaw puzzle ready!");
})();