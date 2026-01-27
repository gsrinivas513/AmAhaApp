/**
 * RectangleSelectTool Component
 * Allows selection of rectangular areas on canvas
 */

import React, { useState, useRef, useCallback } from 'react';

const RectangleSelectTool = ({ canvas, selection, onSelectionChange, theme = 'light' }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(false);

  const canvasRef = useRef(canvas);

  // Handle mouse down - start selection
  const handleMouseDown = useCallback(
    (e) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setIsSelecting(true);
      setStartPoint({ x, y });
      setCurrentPoint({ x, y });
    },
    []
  );

  // Handle mouse move - update selection preview
  const handleMouseMove = useCallback(
    (e) => {
      if (!isSelecting || !startPoint || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let finalX = x;
      let finalY = y;

      // Maintain aspect ratio if shift is pressed
      if (e.shiftKey) {
        const deltaX = x - startPoint.x;
        const deltaY = y - startPoint.y;
        const delta = Math.max(Math.abs(deltaX), Math.abs(deltaY));
        finalX = startPoint.x + (deltaX >= 0 ? delta : -delta);
        finalY = startPoint.y + (deltaY >= 0 ? delta : -delta);
      }

      setCurrentPoint({ x: finalX, y: finalY });
    },
    [isSelecting, startPoint]
  );

  // Handle mouse up - finish selection
  const handleMouseUp = useCallback(() => {
    if (!isSelecting || !startPoint || !currentPoint) {
      setIsSelecting(false);
      return;
    }

    // Calculate selection bounds
    const x = Math.min(startPoint.x, currentPoint.x);
    const y = Math.min(startPoint.y, currentPoint.y);
    const width = Math.abs(currentPoint.x - startPoint.x);
    const height = Math.abs(currentPoint.y - startPoint.y);

    // Only create selection if area is large enough
    if (width > 5 && height > 5) {
      onSelectionChange({
        type: 'rectangle',
        bounds: { x, y, width, height },
      });
    }

    setIsSelecting(false);
    setStartPoint(null);
    setCurrentPoint(null);
  }, [isSelecting, startPoint, currentPoint, onSelectionChange]);

  // Add/remove event listeners
  React.useEffect(() => {
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [canvas, handleMouseDown, handleMouseMove, handleMouseUp]);

  // Draw selection outline on canvas
  React.useEffect(() => {
    if (!isSelecting || !startPoint || !currentPoint || !canvas) return;

    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Redraw canvas
    ctx.putImageData(imageData, 0, 0);

    // Draw selection rectangle
    const x = Math.min(startPoint.x, currentPoint.x);
    const y = Math.min(startPoint.y, currentPoint.y);
    const width = Math.abs(currentPoint.x - startPoint.x);
    const height = Math.abs(currentPoint.y - startPoint.y);

    // Marching ants outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.lineDashOffset = 0;
    ctx.strokeRect(x, y, width, height);

    // White outline for contrast
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.lineDashOffset = 4;
    ctx.strokeRect(x, y, width, height);

    ctx.setLineDash([]);

    // Draw dimension text
    if (width > 0 && height > 0) {
      ctx.fillStyle = theme === 'dark' ? '#FFFFFF' : '#000000';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`${Math.round(width)} × ${Math.round(height)}`, x + 5, y - 5);
    }
  }, [isSelecting, startPoint, currentPoint, canvas, theme]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        cursor: 'crosshair',
        zIndex: 10,
      }}
    >
      <div
        style={{
          padding: '8px',
          background: theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
          borderRadius: '4px',
          color: theme === 'dark' ? '#e0e0e0' : '#333',
          fontSize: '12px',
          position: 'absolute',
          top: '10px',
          left: '10px',
        }}
      >
        <div>
          <input
            type="checkbox"
            checked={maintainAspectRatio}
            onChange={(e) => setMaintainAspectRatio(e.target.checked)}
            style={{ marginRight: '5px' }}
          />
          <label>Square (Shift)</label>
        </div>
        <div style={{ marginTop: '5px', fontSize: '11px', opacity: 0.8 }}>
          Drag to select area
        </div>
      </div>
    </div>
  );
};

export default RectangleSelectTool;
