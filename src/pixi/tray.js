import * as PIXI from "pixi.js";

/* ================== CONFIG ================== */
const TRAY_Y = 520;
const TRAY_HEIGHT = 130;
const PIECE_SIZE = 90;
const GAP = 12;
const SCROLL_STEP = PIECE_SIZE + GAP;

/* ================== CREATE TRAY ================== */
export function createTray(app, pieces) {
  const trayViewport = new PIXI.Container();
  const trayContainer = new PIXI.Container();

  trayViewport.y = TRAY_Y;
  trayViewport.addChild(trayContainer);
  app.stage.addChild(trayViewport);

  /* ---- MASK (viewport window) ---- */
  const mask = new PIXI.Graphics()
    .rect(0, 0, app.screen.width, TRAY_HEIGHT)
    .fill(0xffffff);

  trayViewport.mask = mask;
  trayViewport.addChild(mask);

  /* ---- ADD PIECES HORIZONTALLY ---- */
  pieces.forEach((piece, index) => {
    piece.x = index * SCROLL_STEP;
    piece.y = 10;
    trayContainer.addChild(piece);
  });

  /* ---- SCROLL STATE ---- */
  let offsetX = 0;
  const maxScroll =
    Math.min(0, app.screen.width - pieces.length * SCROLL_STEP - 20);

  /* ================== ARROWS ================== */
  const leftBtn = arrowButton("<", 20, TRAY_Y + 40);
  const rightBtn = arrowButton(">", app.screen.width - 60, TRAY_Y + 40);

  app.stage.addChild(leftBtn, rightBtn);

  leftBtn.on("pointerdown", () => {
    offsetX = Math.min(offsetX + SCROLL_STEP, 0);
    trayContainer.x = offsetX;
  });

  rightBtn.on("pointerdown", () => {
    offsetX = Math.max(offsetX - SCROLL_STEP, maxScroll);
    trayContainer.x = offsetX;
  });

  return trayContainer;
}

/* ================== BUTTON ================== */
function arrowButton(label, x, y) {
  const btn = new PIXI.Container();
  btn.x = x;
  btn.y = y;
  btn.eventMode = "static";
  btn.cursor = "pointer";

  const bg = new PIXI.Graphics()
    .roundRect(0, 0, 40, 40, 8)
    .fill(0xf0f0f0)
    .stroke({ width: 2, color: 0xcccccc });

  const text = new PIXI.Text({
    text: label,
    style: { fontSize: 22, fill: 0x333333 },
  });

  text.anchor.set(0.5);
  text.position.set(20, 20);

  btn.addChild(bg, text);
  return btn;
}