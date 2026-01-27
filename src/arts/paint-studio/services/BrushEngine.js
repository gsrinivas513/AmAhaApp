/**
 * BrushEngine Service
 * Advanced brush rendering with pressure, spacing, and dynamics
 */

import { getMousePos } from '../utils/canvasUtils';

export class BrushEngine {
  constructor(ctx, options = {}) {
    this.ctx = ctx;
    this.color = options.color || '#000000';
    this.size = options.size || 5;
    this.opacity = options.opacity || 1;
    this.hardness = options.hardness || 1;
    this.spacing = options.spacing || 5;
    this.roundness = options.roundness || 1;
    this.angle = options.angle || 0;
    this.pressure = options.pressure || 1;
    this.lastX = 0;
    this.lastY = 0;
    this.lastPressure = 1;
  }

  drawPoint(x, y, pressure = this.pressure) {
    const size = this.size * pressure;
    const alpha = this.opacity * pressure;

    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = this.color;

    // Create brush stamp based on hardness
    const softness = 1 - this.hardness;
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size / 2);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(Math.max(0, 1 - softness), this.color);
    gradient.addColorStop(1, `rgba(0,0,0,0)`);

    this.ctx.fillStyle = this.hardness === 1 ? this.color : gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.globalAlpha = 1;
  }

  drawStroke(x, y, pressure = this.pressure) {
    const distance = Math.sqrt((x - this.lastX) ** 2 + (y - this.lastY) ** 2);
    const steps = Math.ceil(distance / this.spacing);

    for (let i = 0; i <= steps; i++) {
      const t = steps > 0 ? i / steps : 0;
      const interpX = this.lastX + (x - this.lastX) * t;
      const interpY = this.lastY + (y - this.lastY) * t;
      const interpPressure = this.lastPressure + (pressure - this.lastPressure) * t;

      this.drawPoint(interpX, interpY, interpPressure);
    }

    this.lastX = x;
    this.lastY = y;
    this.lastPressure = pressure;
  }

  beginStroke(x, y, pressure = this.pressure) {
    this.lastX = x;
    this.lastY = y;
    this.lastPressure = pressure;
    this.drawPoint(x, y, pressure);
  }

  endStroke() {
    this.ctx.globalAlpha = 1;
    this.ctx.globalCompositeOperation = 'source-over';
  }

  updateOptions(options) {
    Object.keys(options).forEach((key) => {
      if (key in this) {
        this[key] = options[key];
      }
    });
  }

  // Get brush stamp as ImageData for advanced effects
  getBrushStamp() {
    const tempCanvas = document.createElement('canvas');
    const size = this.size;
    tempCanvas.width = size;
    tempCanvas.height = size;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.fillStyle = this.color;
    tempCtx.globalAlpha = this.opacity;

    const gradient = tempCtx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(this.hardness, this.color);
    gradient.addColorStop(1, `rgba(0,0,0,0)`);

    tempCtx.fillStyle = gradient;
    tempCtx.beginPath();
    tempCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    tempCtx.fill();

    return tempCanvas;
  }
}
