/**
 * Canvas Utility Functions
 * Drawing operations, pixel manipulation, geometry
 */

export const getMousePos = (canvas, event, zoomLevel = 1) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) / zoomLevel,
    y: (event.clientY - rect.top) / zoomLevel,
  };
};

export const getTouchPos = (canvas, touch, zoomLevel = 1) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (touch.clientX - rect.left) / zoomLevel,
    y: (touch.clientY - rect.top) / zoomLevel,
  };
};

export const drawLine = (ctx, fromX, fromY, toX, toY, color, size, opacity) => {
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
  ctx.globalAlpha = 1;
};

export const drawRectangle = (ctx, fromX, fromY, toX, toY, color, size, opacity, filled = false) => {
  ctx.globalAlpha = opacity;
  const width = toX - fromX;
  const height = toY - fromY;

  if (filled) {
    ctx.fillStyle = color;
    ctx.fillRect(fromX, fromY, width, height);
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.strokeRect(fromX, fromY, width, height);
  }
  ctx.globalAlpha = 1;
};

export const drawCircle = (ctx, centerX, centerY, radius, color, size, opacity, filled = false) => {
  ctx.globalAlpha = opacity;
  ctx.beginPath();
  ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);

  if (filled) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
};

export const drawEllipse = (ctx, centerX, centerY, radiusX, radiusY, color, size, opacity, filled = false) => {
  ctx.globalAlpha = opacity;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, Math.abs(radiusX), Math.abs(radiusY), 0, 0, Math.PI * 2);

  if (filled) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
};

export const drawPolygon = (ctx, points, color, size, opacity, filled = false) => {
  if (points.length < 2) return;

  ctx.globalAlpha = opacity;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.closePath();

  if (filled) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
};

export const drawText = (ctx, text, x, y, fontSize, color, fontFamily = 'Arial') => {
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textBaseline = 'top';
  ctx.fillText(text, x, y);
};

export const floodFill = (ctx, x, y, canvas, fillColor) => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const pixelIndex = (y * canvas.width + x) * 4;
  const targetColor = [data[pixelIndex], data[pixelIndex + 1], data[pixelIndex + 2], data[pixelIndex + 3]];

  const fillRgb = hexToRgb(fillColor);
  const fillArray = [fillRgb.r, fillRgb.g, fillRgb.b, 255];

  if (colorsMatch(targetColor, fillArray)) return;

  const stack = [[x, y]];
  const visited = new Set();

  while (stack.length > 0) {
    const [cx, cy] = stack.pop();
    const key = `${cx},${cy}`;

    if (visited.has(key) || cx < 0 || cx >= canvas.width || cy < 0 || cy >= canvas.height) continue;
    visited.add(key);

    const idx = (cy * canvas.width + cx) * 4;
    if (colorsMatch([data[idx], data[idx + 1], data[idx + 2], data[idx + 3]], targetColor, 50)) {
      data[idx] = fillArray[0];
      data[idx + 1] = fillArray[1];
      data[idx + 2] = fillArray[2];
      data[idx + 3] = fillArray[3];

      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

export const colorsMatch = (color1, color2, tolerance = 0) => {
  return Math.abs(color1[0] - color2[0]) <= tolerance &&
    Math.abs(color1[1] - color2[1]) <= tolerance &&
    Math.abs(color1[2] - color2[2]) <= tolerance &&
    Math.abs(color1[3] - color2[3]) <= tolerance;
};

export const createGradient = (ctx, fromX, fromY, toX, toY, color1, color2) => {
  const gradient = ctx.createLinearGradient(fromX, fromY, toX, toY);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  return gradient;
};

export const createRadialGradient = (ctx, fromX, fromY, toX, toY, color1, color2) => {
  const distance = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
  const gradient = ctx.createRadialGradient(fromX, fromY, 0, fromX, fromY, distance);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  return gradient;
};

export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
};
