/**
 * MoveTool Component
 * Move selected content or layers
 */

import React, { useState, useRef, useCallback } from 'react';

const MoveTool = ({ canvas, selection, onMove, theme = 'light' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(canvas);

  // Handle mouse down
  const handleMouseDown = useCallback((e) => {
    if (!selection.isActive || !selection.bounds) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is on selection
    const { x: sx, y: sy, width, height } = selection.bounds;
    if (x >= sx && x <= sx + width && y >= sy && y <= sy + height) {
      setIsDragging(true);
      setDragStart({ x, y });
      setOffset({ x: 0, y: 0 });
    }
  }, [selection]);

  // Handle mouse move
  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !dragStart || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let deltaX = x - dragStart.x;
    let deltaY = y - dragStart.y;

    // Snap to grid if Ctrl is pressed
    if (e.ctrlKey) {
      deltaX = Math.round(deltaX / 10) * 10;
      deltaY = Math.round(deltaY / 10) * 10;
    }

    setOffset({ x: deltaX, y: deltaY });
  }, [isDragging, dragStart]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    if (offset.x !== 0 || offset.y !== 0) {
      onMove({
        deltaX: offset.x,
        deltaY: offset.y,
      });
    }

    setIsDragging(false);
    setDragStart(null);
    setOffset({ x: 0, y: 0 });
  }, [isDragging, offset, onMove]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (!selection.isActive) return;

    const step = e.shiftKey ? 10 : 1;
    let deltaX = 0;
    let deltaY = 0;

    switch (e.key) {
      case 'ArrowUp':
        deltaY = -step;
        e.preventDefault();
        break;
      case 'ArrowDown':
        deltaY = step;
        e.preventDefault();
        break;
      case 'ArrowLeft':
        deltaX = -step;
        e.preventDefault();
        break;
      case 'ArrowRight':
        deltaX = step;
        e.preventDefault();
        break;
      default:
        return;
    }

    if (deltaX !== 0 || deltaY !== 0) {
      onMove({ deltaX, deltaY });
    }
  }, [selection.isActive, onMove]);

  // Add event listeners
  React.useEffect(() => {
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas, handleMouseDown, handleMouseMove, handleMouseUp, handleKeyDown]);

  // Draw move feedback
  React.useEffect(() => {
    if (!isDragging || !canvas || !selection.bounds) return;

    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);

    // Draw moved selection outline
    const { x, y, width, height } = selection.bounds;
    const newX = x + offset.x;
    const newY = y + offset.y;

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.lineDashOffset = 0;
    ctx.strokeRect(newX, newY, width, height);

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.lineDashOffset = 4;
    ctx.strokeRect(newX, newY, width, height);

    ctx.setLineDash([]);

    // Draw movement arrow
    if (offset.x !== 0 || offset.y !== 0) {
      const startX = x + width / 2;
      const startY = y + height / 2;
      const endX = newX + width / 2;
      const endY = newY + height / 2;

      ctx.strokeStyle = '#4A90E2';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Arrow head
      const angle = Math.atan2(endY - startY, endX - startX);
      const arrowSize = 10;
      ctx.fillStyle = '#4A90E2';
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    }

    // Draw offset text
    ctx.fillStyle = theme === 'dark' ? '#FFFFFF' : '#000000';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(
      `Δ X:${offset.x.toFixed(0)} Y:${offset.y.toFixed(0)}`,
      x + width / 2 + 10,
      y - 10
    );
  }, [isDragging, canvas, selection.bounds, offset, theme]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        cursor: selection.isActive ? 'grab' : 'default',
        zIndex: 10,
      }}
    >
      {selection.isActive && (
        <div
          style={{
            padding: '12px',
            background: theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
            borderRadius: '4px',
            color: theme === 'dark' ? '#e0e0e0' : '#333',
            fontSize: '12px',
            position: 'absolute',
            top: '10px',
            left: '10px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Move</div>
          <div style={{ marginBottom: '5px' }}>
            Δ X: {offset.x.toFixed(0)} | Δ Y: {offset.y.toFixed(0)}
          </div>
          <div style={{ fontSize: '11px', opacity: 0.8 }}>
            • Drag to move<br/>
            • Arrow keys (±1px)<br/>
            • Shift + Arrow (±10px)<br/>
            • Ctrl + Drag (grid snap)
          </div>
        </div>
      )}
    </div>
  );
};

export default MoveTool;
