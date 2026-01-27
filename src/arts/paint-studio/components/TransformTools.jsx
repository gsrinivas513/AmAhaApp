/**
 * TransformTools Component
 * Rotate and Scale selected content
 */

import React, { useState, useRef, useCallback } from 'react';

const TransformTools = ({ canvas, selection, transformMode = 'rotate', onTransform, theme = 'light' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [angle, setAngle] = useState(0);
  const [scale, setScale] = useState({ x: 1, y: 1 });

  const canvasRef = useRef(canvas);

  // Calculate angle from center
  const calculateAngle = useCallback((x, y, centerX, centerY) => {
    const dx = x - centerX;
    const dy = y - centerY;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }, []);

  // Calculate scale factor from distance
  const calculateScale = useCallback((x, y, startX, startY, centerX, centerY) => {
    const startDist = Math.sqrt(
      Math.pow(startX - centerX, 2) + Math.pow(startY - centerY, 2)
    );
    const currentDist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    return startDist > 0 ? currentDist / startDist : 1;
  }, []);

  // Handle mouse down
  const handleMouseDown = useCallback((e) => {
    if (!selection.isActive || !selection.bounds) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x, y });
  }, [selection]);

  // Handle mouse move
  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !dragStart || !canvasRef.current || !selection.bounds) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = selection.bounds.x + selection.bounds.width / 2;
    const centerY = selection.bounds.y + selection.bounds.height / 2;

    if (transformMode === 'rotate') {
      let newAngle = calculateAngle(x, y, centerX, centerY);
      
      // Snap to 15° if Shift is pressed
      if (e.shiftKey) {
        newAngle = Math.round(newAngle / 15) * 15;
      }

      setAngle(newAngle);
    } else if (transformMode === 'scale') {
      const scaleFactor = calculateScale(x, y, dragStart.x, dragStart.y, centerX, centerY);

      // Maintain aspect ratio if Shift is pressed
      if (e.shiftKey) {
        setScale({ x: scaleFactor, y: scaleFactor });
      } else {
        // Allow independent scaling
        const yScale = e.ctrlKey ? scaleFactor : 1;
        setScale({ x: scaleFactor, y: yScale });
      }
    }
  }, [isDragging, dragStart, transformMode, selection.bounds, calculateAngle, calculateScale]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    if (transformMode === 'rotate' && angle !== 0) {
      onTransform({
        type: 'rotate',
        angle,
      });
    } else if (transformMode === 'scale' && (scale.x !== 1 || scale.y !== 1)) {
      onTransform({
        type: 'scale',
        scaleX: scale.x,
        scaleY: scale.y,
      });
    }

    setIsDragging(false);
    setDragStart(null);
    setAngle(0);
    setScale({ x: 1, y: 1 });
  }, [isDragging, transformMode, angle, scale, onTransform]);

  // Add event listeners
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

  // Draw transform feedback
  React.useEffect(() => {
    if (!isDragging || !canvas || !selection.bounds) return;

    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);

    const { x, y, width, height } = selection.bounds;
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    // Draw center point
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

    if (transformMode === 'rotate') {
      // Draw rotation handles at corners
      const corners = [
        { x: x, y: y },
        { x: x + width, y: y },
        { x: x + width, y: y + height },
        { x: x, y: y + height },
      ];

      ctx.fillStyle = '#4A90E2';
      corners.forEach((corner) => {
        ctx.fillRect(corner.x - 3, corner.y - 3, 6, 6);
      });

      // Draw rotation angle indicator
      const angle = calculateAngle(
        centerX + 100,
        centerY,
        centerX,
        centerY
      );
      const newAngle = (angle + (isDragging ? this.angle : 0)) % 360;

      ctx.strokeStyle = '#4A90E2';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + 100 * Math.cos((newAngle * Math.PI) / 180),
        centerY + 100 * Math.sin((newAngle * Math.PI) / 180)
      );
      ctx.stroke();

      // Draw angle text
      ctx.fillStyle = theme === 'dark' ? '#FFFFFF' : '#000000';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(`${angle.toFixed(1)}°`, centerX + 110, centerY - 10);
    } else if (transformMode === 'scale') {
      // Draw scale handles at corners
      const corners = [
        { x: x, y: y },
        { x: x + width, y: y },
        { x: x + width, y: y + height },
        { x: x, y: y + height },
      ];

      ctx.fillStyle = '#4CAF50';
      corners.forEach((corner) => {
        ctx.fillRect(corner.x - 4, corner.y - 4, 8, 8);
      });

      // Draw scale percentage
      ctx.fillStyle = theme === 'dark' ? '#FFFFFF' : '#000000';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(`${(scale.x * 100).toFixed(0)}%`, centerX, y - 10);
    }
  }, [isDragging, canvas, selection.bounds, transformMode, angle, scale, theme, calculateAngle]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        cursor: transformMode === 'rotate' ? 'crosshair' : 'nwse-resize',
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
          <div style={{ fontWeight: 'bold', marginBottom: '5px', textTransform: 'capitalize' }}>
            {transformMode}
          </div>

          {transformMode === 'rotate' && (
            <div>
              <div style={{ marginBottom: '5px' }}>
                Angle: {angle.toFixed(1)}°
              </div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>
                • Drag to rotate<br/>
                • Shift for 15° snap
              </div>
            </div>
          )}

          {transformMode === 'scale' && (
            <div>
              <div style={{ marginBottom: '5px' }}>
                Scale: {(scale.x * 100).toFixed(0)}%
              </div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>
                • Drag corner to scale<br/>
                • Shift to maintain aspect<br/>
                • Ctrl for Y-axis only
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransformTools;
