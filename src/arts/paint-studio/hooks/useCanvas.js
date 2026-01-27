/**
 * useCanvas Hook
 * Manages canvas setup, rendering, and state
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import { CANVAS_DEFAULTS } from '../utils/constants';

export const useCanvas = (width = CANVAS_DEFAULTS.WIDTH, height = CANVAS_DEFAULTS.HEIGHT) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = CANVAS_DEFAULTS.BG_COLOR;
    ctx.fillRect(0, 0, width, height);
    contextRef.current = ctx;
  }, [width, height]);

  useEffect(() => {
    setupCanvas();
  }, [setupCanvas]);

  const clearCanvas = useCallback(() => {
    if (!contextRef.current) return;
    const ctx = contextRef.current;
    ctx.fillStyle = CANVAS_DEFAULTS.BG_COLOR;
    ctx.fillRect(0, 0, width, height);
  }, [width, height]);

  const getCanvasState = useCallback(() => {
    return canvasRef.current?.toDataURL() || null;
  }, []);

  const restoreCanvasState = useCallback((imageData) => {
    if (!contextRef.current || !imageData) return;
    const img = new Image();
    img.onload = () => {
      const ctx = contextRef.current;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageData;
  }, [width, height]);

  const zoomIn = useCallback((factor = 1.2) => {
    setZoomLevel((prev) => Math.min(CANVAS_DEFAULTS.MAX_ZOOM, prev * factor));
  }, []);

  const zoomOut = useCallback((factor = 1.2) => {
    setZoomLevel((prev) => Math.max(CANVAS_DEFAULTS.MIN_ZOOM, prev / factor));
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setPanX(0);
    setPanY(0);
  }, []);

  const pan = useCallback((dx, dy) => {
    setPanX((prev) => prev + dx);
    setPanY((prev) => prev + dy);
  }, []);

  const renderLayers = useCallback((layers) => {
    if (!contextRef.current) return;
    const ctx = contextRef.current;

    // Clear canvas
    ctx.fillStyle = CANVAS_DEFAULTS.BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    // Render visible layers from bottom to top
    [...layers].reverse().forEach((layer) => {
      if (!layer.visible) return;

      ctx.globalAlpha = layer.opacity;
      ctx.globalCompositeOperation = layer.blendingMode;
      ctx.drawImage(layer.canvas, 0, 0);
    });

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }, [width, height]);

  return {
    canvasRef,
    contextRef,
    zoomLevel,
    panX,
    panY,
    setupCanvas,
    clearCanvas,
    getCanvasState,
    restoreCanvasState,
    zoomIn,
    zoomOut,
    resetZoom,
    pan,
    setZoomLevel,
    setPanX,
    setPanY,
    renderLayers,
  };
};
