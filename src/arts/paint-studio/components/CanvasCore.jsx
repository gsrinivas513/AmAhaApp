/**
 * CanvasCore Component
 * Main canvas rendering and drawing logic
 */

import React, { useEffect, useRef } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { useTools } from '../hooks/useTools';
import { useLayers } from '../hooks/useLayers';
import { useHistory } from '../hooks/useHistory';
import { ToolFactory } from '../services/ToolFactory';
import { getMousePos } from '../utils/canvasUtils';
import { CANVAS_DEFAULTS } from '../utils/constants';

export const CanvasCore = ({
  onCanvasReady = null,
  onToolChange = null,
  width = CANVAS_DEFAULTS.WIDTH,
  height = CANVAS_DEFAULTS.HEIGHT,
}) => {
  const canvasRef = useRef(null);
  const { 
    contextRef, 
    zoomLevel, 
    panX, 
    panY,
    setupCanvas,
    clearCanvas,
    getCanvasState,
    restoreCanvasState,
    renderLayers,
  } = useCanvas(width, height);
  
  const toolManager = useTools();
  const layerManager = useLayers(width, height);
  const history = useHistory();

  const currentToolRef = useRef(null);
  const isDrawingRef = useRef(false);

  // Setup canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = CANVAS_DEFAULTS.BG_COLOR;
    ctx.fillRect(0, 0, width, height);
    
    contextRef.current = ctx;

    // Save initial state
    history.pushHistory(canvas.toDataURL());

    if (onCanvasReady) {
      onCanvasReady({
        canvas,
        context: ctx,
        tools: toolManager,
        layers: layerManager,
        history,
      });
    }
  }, []);

  // Update current tool when selection changes
  useEffect(() => {
    currentToolRef.current = ToolFactory.createTool(toolManager.currentTool);
    if (onToolChange) {
      onToolChange(toolManager.currentTool);
    }
  }, [toolManager.currentTool, onToolChange]);

  // Render layers when they change
  useEffect(() => {
    if (contextRef.current && canvasRef.current) {
      renderLayers(layerManager.layers);
    }
  }, [layerManager.layers, renderLayers]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const selectedLayer = layerManager.getSelectedLayer();
    if (!selectedLayer || selectedLayer.locked) return;

    const { x, y } = getMousePos(canvas, e, zoomLevel);
    
    isDrawingRef.current = true;

    // Use layer canvas as drawing context
    const layerCtx = selectedLayer.canvas.getContext('2d');
    const toolOptions = {
      ...toolManager.getToolOptions(),
      fontSize: 20,
    };

    currentToolRef.current.onMouseDown(x, y, layerCtx, toolOptions);
    renderLayers(layerManager.layers);
  };

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current) return;

    const canvas = canvasRef.current;
    const selectedLayer = layerManager.getSelectedLayer();
    if (!selectedLayer || selectedLayer.locked) return;

    const { x, y } = getMousePos(canvas, e, zoomLevel);

    const layerCtx = selectedLayer.canvas.getContext('2d');
    const toolOptions = {
      ...toolManager.getToolOptions(),
      fontSize: 20,
    };

    currentToolRef.current.onMouseMove(x, y, layerCtx, toolOptions);
    renderLayers(layerManager.layers);
  };

  const handleMouseUp = (e) => {
    if (!isDrawingRef.current) return;

    const canvas = canvasRef.current;
    const selectedLayer = layerManager.getSelectedLayer();
    if (!selectedLayer || selectedLayer.locked) return;

    const { x, y } = getMousePos(canvas, e, zoomLevel);

    const layerCtx = selectedLayer.canvas.getContext('2d');
    const toolOptions = {
      ...toolManager.getToolOptions(),
      fontSize: 20,
    };

    currentToolRef.current.onMouseUp(x, y, layerCtx, toolOptions);
    renderLayers(layerManager.layers);

    isDrawingRef.current = false;

    // Save to history
    history.pushHistory(canvasRef.current.toDataURL());
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        border: '2px solid #ccc',
        cursor: 'crosshair',
        display: 'block',
        transform: `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`,
        transformOrigin: '0 0',
        userSelect: 'none',
      }}
    />
  );
};
