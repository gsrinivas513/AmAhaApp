/**
 * MagicWandTool Component
 * Color-based selection using flood fill algorithm
 */

import React, { useState, useRef, useCallback } from 'react';

const MagicWandTool = ({ canvas, selection, onSelectionChange, theme = 'light' }) => {
  const [tolerance, setTolerance] = useState(30);
  const [contiguous, setContiguous] = useState(true);
  const [mode, setMode] = useState('replace'); // 'replace' | 'add' | 'subtract'

  const canvasRef = useRef(canvas);

  // Color distance calculation
  const colorDistance = useCallback((c1, c2) => {
    const dr = c1[0] - c2[0];
    const dg = c1[1] - c2[1];
    const db = c1[2] - c2[2];
    const da = (c1[3] || 255) - (c2[3] || 255);
    return Math.sqrt(dr * dr + dg * dg + db * db + da * da);
  }, []);

  // Flood fill algorithm
  const floodFill = useCallback(
    (imageData, x, y, tolerance, contiguous) => {
      const { data, width, height } = imageData;
      const selectedPixels = new Set();
      const stack = [x + y * width];
      const visited = new Set();

      // Get target color
      const pixelIndex = (x + y * width) * 4;
      const targetColor = [data[pixelIndex], data[pixelIndex + 1], data[pixelIndex + 2], data[pixelIndex + 3]];

      while (stack.length > 0) {
        const currentIndex = stack.pop();
        if (visited.has(currentIndex)) continue;
        visited.add(currentIndex);

        const cx = currentIndex % width;
        const cy = Math.floor(currentIndex / width);

        if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;

        const currentPixelIndex = currentIndex * 4;
        const currentColor = [
          data[currentPixelIndex],
          data[currentPixelIndex + 1],
          data[currentPixelIndex + 2],
          data[currentPixelIndex + 3],
        ];

        // Check if color matches
        if (colorDistance(currentColor, targetColor) <= tolerance * 2) {
          selectedPixels.add(currentIndex);

          // Add neighbors
          if (contiguous) {
            // 4-connectivity
            const neighbors = [
              currentIndex - 1, // left
              currentIndex + 1, // right
              currentIndex - width, // up
              currentIndex + width, // down
            ];

            for (const neighbor of neighbors) {
              if (!visited.has(neighbor) && neighbor >= 0 && neighbor < width * height) {
                stack.push(neighbor);
              }
            }
          } else {
            // 8-connectivity
            const neighbors = [
              currentIndex - 1,
              currentIndex + 1,
              currentIndex - width,
              currentIndex + width,
              currentIndex - width - 1,
              currentIndex - width + 1,
              currentIndex + width - 1,
              currentIndex + width + 1,
            ];

            for (const neighbor of neighbors) {
              if (!visited.has(neighbor) && neighbor >= 0 && neighbor < width * height) {
                stack.push(neighbor);
              }
            }
          }
        }
      }

      return selectedPixels;
    },
    [colorDistance]
  );

  // Handle canvas click
  const handleCanvasClick = useCallback(
    (e) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);

      // Get image data
      const ctx = canvasRef.current.getContext('2d');
      const imageData = ctx.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      // Perform flood fill
      const selectedPixels = floodFill(imageData, x, y, tolerance, contiguous);

      // Calculate bounds
      if (selectedPixels.size > 0) {
        let minX = canvasRef.current.width;
        let minY = canvasRef.current.height;
        let maxX = 0;
        let maxY = 0;

        selectedPixels.forEach((pixelIndex) => {
          const px = pixelIndex % canvasRef.current.width;
          const py = Math.floor(pixelIndex / canvasRef.current.width);

          minX = Math.min(minX, px);
          minY = Math.min(minY, py);
          maxX = Math.max(maxX, px);
          maxY = Math.max(maxY, py);
        });

        onSelectionChange({
          type: 'wand',
          pixels: selectedPixels,
          bounds: {
            x: minX,
            y: minY,
            width: maxX - minX + 1,
            height: maxY - minY + 1,
          },
        });
      }
    },
    [tolerance, contiguous, floodFill, onSelectionChange]
  );

  // Add event listener
  React.useEffect(() => {
    if (!canvas) return;

    canvas.addEventListener('click', handleCanvasClick);
    return () => canvas.removeEventListener('click', handleCanvasClick);
  }, [canvas, handleCanvasClick]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        cursor: 'cell',
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
          minWidth: '200px',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Magic Wand</div>

        {/* Tolerance Slider */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>
            Tolerance: {tolerance}
          </label>
          <input
            type="range"
            min="0"
            max="255"
            value={tolerance}
            onChange={(e) => setTolerance(parseInt(e.target.value))}
            style={{
              width: '100%',
              height: '4px',
              borderRadius: '2px',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              outline: 'none',
              cursor: 'pointer',
            }}
          />
          <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>
            Lower = stricter matching
          </div>
        </div>

        {/* Contiguous Toggle */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={contiguous}
              onChange={(e) => setContiguous(e.target.checked)}
              style={{ marginRight: '6px', cursor: 'pointer' }}
            />
            <span>Contiguous only</span>
          </label>
          <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px', marginLeft: '20px' }}>
            Only connected pixels
          </div>
        </div>

        {/* Mode Selection */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{
              width: '100%',
              padding: '4px',
              borderRadius: '3px',
              border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
              background: theme === 'dark' ? '#222' : '#f0f0f0',
              color: theme === 'dark' ? '#e0e0e0' : '#333',
              cursor: 'pointer',
            }}
          >
            <option value="replace">Replace</option>
            <option value="add">Add (Shift)</option>
            <option value="subtract">Subtract (Ctrl)</option>
          </select>
        </div>

        <div style={{ fontSize: '11px', opacity: 0.8, borderTop: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`, paddingTop: '8px' }}>
          Click to select by color
        </div>
      </div>
    </div>
  );
};

export default MagicWandTool;
