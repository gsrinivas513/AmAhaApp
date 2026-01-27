/**
 * FreeSelectTool Component
 * Freehand polygon selection (Lasso tool)
 */

import React, { useState, useRef, useCallback } from 'react';

const FreeSelectTool = ({ canvas, selection, onSelectionChange, theme = 'light' }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const [previewPath, setPreviewPath] = useState([]);

  const canvasRef = useRef(canvas);
  const lastPointRef = useRef(null);

  // Add point to path
  const addPoint = useCallback(
    (x, y) => {
      setPoints((prev) => [...prev, { x, y }]);
      lastPointRef.current = { x, y };
    },
    []
  );

  // Handle click to add points
  const handleCanvasClick = useCallback(
    (e) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // If close to start point and have enough points, close path
      if (points.length > 2) {
        const dist = Math.sqrt(
          Math.pow(x - points[0].x, 2) + Math.pow(y - points[0].y, 2)
        );
        if (dist < 10) {
          finishSelection();
          return;
        }
      }

      // Add new point if far enough from last point
      if (!lastPointRef.current || 
          Math.sqrt(Math.pow(x - lastPointRef.current.x, 2) + 
                   Math.pow(y - lastPointRef.current.y, 2)) > 3) {
        addPoint(x, y);
      }
    },
    [points, addPoint]
  );

  // Handle mouse move for preview
  const handleMouseMove = useCallback(
    (e) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update preview path
      if (points.length > 0) {
        setPreviewPath([...points, { x, y }]);
      }
    },
    [points]
  );

  // Undo last point
  const undoPoint = useCallback(() => {
    if (points.length > 0) {
      const newPoints = points.slice(0, -1);
      setPoints(newPoints);
      if (newPoints.length > 0) {
        lastPointRef.current = newPoints[newPoints.length - 1];
      } else {
        lastPointRef.current = null;
      }
    }
  }, [points]);

  // Finish selection
  const finishSelection = useCallback(() => {
    if (points.length < 3) {
      alert('Need at least 3 points for selection');
      return;
    }

    // Smooth path
    const smoothedPath = simplifyPath(points, 2);

    onSelectionChange({
      type: 'free',
      path: smoothedPath,
    });

    // Reset
    setPoints([]);
    setPreviewPath([]);
    lastPointRef.current = null;
  }, [points, onSelectionChange]);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        undoPoint();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        finishSelection();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setPoints([]);
        setPreviewPath([]);
        lastPointRef.current = null;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undoPoint, finishSelection]);

  // Add event listeners
  React.useEffect(() => {
    if (!canvas) return;

    canvas.addEventListener('click', handleCanvasClick);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [canvas, handleCanvasClick, handleMouseMove]);

  // Draw path on canvas
  React.useEffect(() => {
    if (!canvas || points.length === 0) return;

    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Redraw canvas
    ctx.putImageData(imageData, 0, 0);

    // Draw points
    ctx.fillStyle = '#FF6B6B';
    points.forEach((point, index) => {
      ctx.fillRect(point.x - 3, point.y - 3, 6, 6);

      // Draw number
      if (index > 0) {
        ctx.fillStyle = '#000000';
        ctx.font = '10px Arial';
        ctx.fillText(index.toString(), point.x + 5, point.y - 5);
        ctx.fillStyle = '#FF6B6B';
      }
    });

    // Draw preview line
    if (previewPath.length > 1) {
      ctx.strokeStyle = '#4A90E2';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(previewPath[0].x, previewPath[0].y);
      for (let i = 1; i < previewPath.length; i++) {
        ctx.lineTo(previewPath[i].x, previewPath[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw connection line from last point to first
    if (points.length > 2 && previewPath.length > 0) {
      const lastPreview = previewPath[previewPath.length - 1];
      const dist = Math.sqrt(
        Math.pow(lastPreview.x - points[0].x, 2) +
          Math.pow(lastPreview.y - points[0].y, 2)
      );

      if (dist < 10) {
        ctx.strokeStyle = '#90EE90';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(lastPreview.x, lastPreview.y);
        ctx.lineTo(points[0].x, points[0].y);
        ctx.stroke();
      }
    }
  }, [canvas, points, previewPath]);

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
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Free Select</div>
        <div>Points: {points.length}</div>
        <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.9 }}>
          • Click to add points<br/>
          • Enter to finish<br/>
          • Backspace to undo<br/>
          • Esc to cancel
        </div>
        <div style={{ marginTop: '8px', display: 'flex', gap: '5px' }}>
          <button
            onClick={undoPoint}
            disabled={points.length === 0}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              background: points.length === 0 ? '#ccc' : '#4A90E2',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: points.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            ↶ Undo
          </button>
          <button
            onClick={finishSelection}
            disabled={points.length < 3}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              background: points.length < 3 ? '#ccc' : '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: points.length < 3 ? 'not-allowed' : 'pointer',
            }}
          >
            ✓ Done
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Simplify path using Ramer-Douglas-Peucker algorithm
 */
function simplifyPath(points, tolerance = 2) {
  if (points.length <= 2) return points;

  const simplified = [points[0]];
  let maxDist = 0;
  let maxIdx = 0;

  // Find point with maximum distance
  for (let i = 1; i < points.length - 1; i++) {
    const dist = pointLineDistance(points[i], points[0], points[points.length - 1]);
    if (dist > maxDist) {
      maxDist = dist;
      maxIdx = i;
    }
  }

  // Recursively simplify if needed
  if (maxDist > tolerance) {
    const left = simplifyPath(points.slice(0, maxIdx + 1), tolerance);
    const right = simplifyPath(points.slice(maxIdx), tolerance);
    return [...left.slice(0, -1), ...right];
  } else {
    return [points[0], points[points.length - 1]];
  }
}

/**
 * Calculate perpendicular distance from point to line
 */
function pointLineDistance(point, lineStart, lineEnd) {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const t = Math.max(0, Math.min(1, ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (dx * dx + dy * dy)));
  const projX = lineStart.x + t * dx;
  const projY = lineStart.y + t * dy;
  return Math.sqrt(Math.pow(point.x - projX, 2) + Math.pow(point.y - projY, 2));
}

export default FreeSelectTool;
