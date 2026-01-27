/**
 * ToolFactory Service
 * Factory for creating and managing different drawing tools
 */

import { TOOLS } from '../utils/constants';
import {
  drawLine,
  drawRectangle,
  drawCircle,
  drawEllipse,
  drawPolygon,
  drawText,
  floodFill,
  getMousePos,
} from '../utils/canvasUtils';

export class Tool {
  constructor(name, icon, category) {
    this.name = name;
    this.icon = icon;
    this.category = category;
  }

  onMouseDown(x, y, ctx, options) {}
  onMouseMove(x, y, ctx, options) {}
  onMouseUp(x, y, ctx, options) {}
}

export class PencilTool extends Tool {
  constructor() {
    super(TOOLS.PENCIL, '✏️', 'DRAWING');
    this.isDrawing = false;
  }

  onMouseDown(x, y, ctx, options) {
    this.isDrawing = true;
    ctx.globalAlpha = options.opacity;
    ctx.strokeStyle = options.color;
    ctx.lineWidth = options.brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.moveTo(x, y);
    this.lastX = x;
    this.lastY = y;
  }

  onMouseMove(x, y, ctx, options) {
    if (!this.isDrawing) return;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  onMouseUp(x, y, ctx, options) {
    if (!this.isDrawing) return;
    ctx.closePath();
    ctx.globalAlpha = 1;
    this.isDrawing = false;
  }
}

export class EraserTool extends Tool {
  constructor() {
    super(TOOLS.ERASER, '🧹', 'DRAWING');
    this.isDrawing = false;
  }

  onMouseDown(x, y, ctx, options) {
    this.isDrawing = true;
    ctx.globalAlpha = options.opacity;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.lineWidth = options.brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  onMouseMove(x, y, ctx, options) {
    if (!this.isDrawing) return;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  onMouseUp(x, y, ctx, options) {
    ctx.closePath();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    this.isDrawing = false;
  }
}

export class LineTool extends Tool {
  constructor() {
    super(TOOLS.LINE, '📏', 'SHAPES');
    this.startX = 0;
    this.startY = 0;
    this.tempCanvas = null;
    this.tempCtx = null;
  }

  onMouseDown(x, y, ctx, options) {
    this.startX = x;
    this.startY = y;
    // Save current canvas state
    const canvas = ctx.canvas;
    this.tempCanvas = document.createElement('canvas');
    this.tempCanvas.width = canvas.width;
    this.tempCanvas.height = canvas.height;
    this.tempCtx = this.tempCanvas.getContext('2d');
    this.tempCtx.drawImage(canvas, 0, 0);
  }

  onMouseMove(x, y, ctx, options) {
    // Restore and preview
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.tempCanvas, 0, 0);
    drawLine(ctx, this.startX, this.startY, x, y, options.color, options.brushSize, options.opacity);
  }

  onMouseUp(x, y, ctx, options) {
    drawLine(ctx, this.startX, this.startY, x, y, options.color, options.brushSize, options.opacity);
  }
}

export class RectangleTool extends Tool {
  constructor() {
    super(TOOLS.RECTANGLE, '▭', 'SHAPES');
    this.startX = 0;
    this.startY = 0;
    this.tempCanvas = null;
    this.tempCtx = null;
  }

  onMouseDown(x, y, ctx, options) {
    this.startX = x;
    this.startY = y;
    const canvas = ctx.canvas;
    this.tempCanvas = document.createElement('canvas');
    this.tempCanvas.width = canvas.width;
    this.tempCanvas.height = canvas.height;
    this.tempCtx = this.tempCanvas.getContext('2d');
    this.tempCtx.drawImage(canvas, 0, 0);
  }

  onMouseMove(x, y, ctx, options) {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.tempCanvas, 0, 0);
    drawRectangle(ctx, this.startX, this.startY, x, y, options.color, options.brushSize, options.opacity);
  }

  onMouseUp(x, y, ctx, options) {
    drawRectangle(ctx, this.startX, this.startY, x, y, options.color, options.brushSize, options.opacity);
  }
}

export class CircleTool extends Tool {
  constructor() {
    super(TOOLS.CIRCLE, '○', 'SHAPES');
    this.startX = 0;
    this.startY = 0;
    this.tempCanvas = null;
    this.tempCtx = null;
  }

  onMouseDown(x, y, ctx, options) {
    this.startX = x;
    this.startY = y;
    const canvas = ctx.canvas;
    this.tempCanvas = document.createElement('canvas');
    this.tempCanvas.width = canvas.width;
    this.tempCanvas.height = canvas.height;
    this.tempCtx = this.tempCanvas.getContext('2d');
    this.tempCtx.drawImage(canvas, 0, 0);
  }

  onMouseMove(x, y, ctx, options) {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.tempCanvas, 0, 0);
    const radius = Math.sqrt((x - this.startX) ** 2 + (y - this.startY) ** 2);
    drawCircle(ctx, this.startX, this.startY, radius, options.color, options.brushSize, options.opacity);
  }

  onMouseUp(x, y, ctx, options) {
    const radius = Math.sqrt((x - this.startX) ** 2 + (y - this.startY) ** 2);
    drawCircle(ctx, this.startX, this.startY, radius, options.color, options.brushSize, options.opacity);
  }
}

export class BucketFillTool extends Tool {
  constructor() {
    super(TOOLS.BUCKET, '🪣', 'FILL');
  }

  onMouseDown(x, y, ctx, options) {
    floodFill(ctx, Math.floor(x), Math.floor(y), ctx.canvas, options.color);
  }
}

export class TextTool extends Tool {
  constructor() {
    super(TOOLS.TEXT, 'T', 'SPECIAL');
  }

  onMouseDown(x, y, ctx, options) {
    // Text input will be handled by component UI
  }

  drawText(x, y, text, ctx, options) {
    drawText(ctx, text, x, y, options.fontSize || 24, options.color, options.fontFamily || 'Arial');
  }
}

export class ToolFactory {
  static createTool(toolType) {
    const tools = {
      [TOOLS.PENCIL]: new PencilTool(),
      [TOOLS.ERASER]: new EraserTool(),
      [TOOLS.LINE]: new LineTool(),
      [TOOLS.RECTANGLE]: new RectangleTool(),
      [TOOLS.CIRCLE]: new CircleTool(),
      [TOOLS.BUCKET]: new BucketFillTool(),
      [TOOLS.TEXT]: new TextTool(),
    };

    return tools[toolType] || new PencilTool();
  }

  static getAllTools() {
    return [
      TOOLS.PENCIL,
      TOOLS.ERASER,
      TOOLS.LINE,
      TOOLS.RECTANGLE,
      TOOLS.CIRCLE,
      TOOLS.BUCKET,
      TOOLS.TEXT,
    ];
  }

  static getToolsByCategory(category) {
    const categoryTools = {
      DRAWING: [TOOLS.PENCIL, TOOLS.ERASER],
      SHAPES: [TOOLS.LINE, TOOLS.RECTANGLE, TOOLS.CIRCLE],
      FILL: [TOOLS.BUCKET],
      SPECIAL: [TOOLS.TEXT],
    };

    return categoryTools[category] || [];
  }
}
