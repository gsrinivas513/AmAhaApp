/**
 * useSelection Hook
 * Manages selection state including bounds, path, pixels, and properties
 */

import { useState, useCallback } from 'react';

export const useSelection = () => {
  const [selection, setSelection] = useState({
    isActive: false,
    type: null, // 'rectangle' | 'free' | 'wand'
    bounds: null, // { x, y, width, height }
    path: [], // For free select
    pixels: new Set(), // For magic wand
    feather: 0,
    antiAlias: true,
    mode: 'replace', // 'replace' | 'add' | 'subtract' | 'intersect'
  });

  const [savedSelections, setSavedSelections] = useState([]);

  // Create rectangular selection
  const setRectangleSelection = useCallback((x, y, width, height) => {
    setSelection((prev) => ({
      ...prev,
      isActive: true,
      type: 'rectangle',
      bounds: { x, y, width, height },
      path: [],
      pixels: new Set(),
    }));
  }, []);

  // Create free-form selection
  const setFreeSelection = useCallback((points) => {
    setSelection((prev) => ({
      ...prev,
      isActive: true,
      type: 'free',
      path: points,
      bounds: calculateBoundsFromPath(points),
      pixels: new Set(),
    }));
  }, []);

  // Create magic wand selection
  const setWandSelection = useCallback((pixelSet, bounds) => {
    setSelection((prev) => ({
      ...prev,
      isActive: true,
      type: 'wand',
      pixels: pixelSet,
      bounds,
      path: [],
    }));
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelection((prev) => ({
      ...prev,
      isActive: false,
      type: null,
      bounds: null,
      path: [],
      pixels: new Set(),
    }));
  }, []);

  // Update selection property
  const setSelectionProperty = useCallback((property, value) => {
    setSelection((prev) => ({
      ...prev,
      [property]: value,
    }));
  }, []);

  // Invert selection
  const invertSelection = useCallback(() => {
    // Inverse flag will be handled in rendering
    setSelection((prev) => ({
      ...prev,
      inverted: !prev.inverted,
    }));
  }, []);

  // Grow selection
  const growSelection = useCallback((pixels) => {
    if (!selection.bounds) return;

    const newBounds = {
      x: Math.max(0, selection.bounds.x - pixels),
      y: Math.max(0, selection.bounds.y - pixels),
      width: selection.bounds.width + pixels * 2,
      height: selection.bounds.height + pixels * 2,
    };

    setSelection((prev) => ({
      ...prev,
      bounds: newBounds,
    }));
  }, [selection.bounds]);

  // Shrink selection
  const shrinkSelection = useCallback((pixels) => {
    if (!selection.bounds) return;

    const newBounds = {
      x: selection.bounds.x + pixels,
      y: selection.bounds.y + pixels,
      width: Math.max(0, selection.bounds.width - pixels * 2),
      height: Math.max(0, selection.bounds.height - pixels * 2),
    };

    setSelection((prev) => ({
      ...prev,
      bounds: newBounds,
    }));
  }, [selection.bounds]);

  // Feather selection
  const featherSelection = useCallback((radius) => {
    setSelection((prev) => ({
      ...prev,
      feather: radius,
    }));
  }, []);

  // Get selection mask (boolean array)
  const getSelectionMask = useCallback((width, height) => {
    const mask = new Uint8ClampedArray(width * height);

    if (!selection.isActive) {
      return mask;
    }

    if (selection.type === 'rectangle' && selection.bounds) {
      const { x, y, width: w, height: h } = selection.bounds;
      for (let py = Math.max(0, y); py < Math.min(height, y + h); py++) {
        for (let px = Math.max(0, x); px < Math.min(width, x + w); px++) {
          mask[py * width + px] = 255;
        }
      }
    } else if (selection.type === 'free' && selection.path.length > 0) {
      fillPathMask(mask, width, height, selection.path);
    } else if (selection.type === 'wand' && selection.pixels.size > 0) {
      selection.pixels.forEach((pixelIndex) => {
        mask[pixelIndex] = 255;
      });
    }

    // Apply feathering if needed
    if (selection.feather > 0) {
      return featherMask(mask, width, height, selection.feather);
    }

    return mask;
  }, [selection]);

  // Save selection
  const saveSelection = useCallback((name) => {
    const selectionData = {
      name,
      timestamp: new Date().toISOString(),
      type: selection.type,
      bounds: selection.bounds,
      path: selection.path,
      // Don't save pixel set - too large
      feather: selection.feather,
      antiAlias: selection.antiAlias,
    };

    setSavedSelections((prev) => [...prev, selectionData]);

    // Also save to localStorage
    const saved = JSON.parse(localStorage.getItem('savedSelections') || '[]');
    saved.push(selectionData);
    localStorage.setItem('savedSelections', JSON.stringify(saved));

    return selectionData;
  }, [selection]);

  // Load selection
  const loadSelection = useCallback((name) => {
    const found = savedSelections.find((s) => s.name === name);
    if (!found) return null;

    setSelection((prev) => ({
      ...prev,
      isActive: true,
      type: found.type,
      bounds: found.bounds,
      path: found.path,
      feather: found.feather,
      antiAlias: found.antiAlias,
    }));

    return found;
  }, [savedSelections]);

  // Get saved selections
  const getSavedSelections = useCallback(() => {
    return savedSelections;
  }, [savedSelections]);

  // Delete saved selection
  const deleteSelection = useCallback((name) => {
    setSavedSelections((prev) => prev.filter((s) => s.name !== name));

    const saved = JSON.parse(localStorage.getItem('savedSelections') || '[]');
    const updated = saved.filter((s) => s.name !== name);
    localStorage.setItem('savedSelections', JSON.stringify(updated));
  }, []);

  return {
    selection,
    setRectangleSelection,
    setFreeSelection,
    setWandSelection,
    clearSelection,
    setSelectionProperty,
    invertSelection,
    growSelection,
    shrinkSelection,
    featherSelection,
    getSelectionMask,
    saveSelection,
    loadSelection,
    getSavedSelections,
    deleteSelection,
  };
};

/**
 * Helper: Calculate bounds from path points
 */
function calculateBoundsFromPath(points) {
  if (points.length === 0) return null;

  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;

  for (let i = 1; i < points.length; i++) {
    minX = Math.min(minX, points[i].x);
    minY = Math.min(minY, points[i].y);
    maxX = Math.max(maxX, points[i].x);
    maxY = Math.max(maxY, points[i].y);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Helper: Fill mask using path (simple scanline algorithm)
 */
function fillPathMask(mask, width, height, path) {
  if (path.length < 3) return;

  // Use scanline algorithm to fill polygon
  for (let y = 0; y < height; y++) {
    const intersections = [];

    // Find intersections with path
    for (let i = 0; i < path.length; i++) {
      const p1 = path[i];
      const p2 = path[(i + 1) % path.length];

      // Check if horizontal line at y intersects with edge
      if ((p1.y <= y && p2.y > y) || (p2.y <= y && p1.y > y)) {
        // Calculate intersection x
        const t = (y - p1.y) / (p2.y - p1.y);
        const x = p1.x + t * (p2.x - p1.x);
        intersections.push(Math.floor(x));
      }
    }

    // Sort intersections
    intersections.sort((a, b) => a - b);

    // Fill between pairs of intersections
    for (let i = 0; i < intersections.length - 1; i += 2) {
      for (let x = intersections[i]; x <= intersections[i + 1] && x < width; x++) {
        if (x >= 0) {
          mask[y * width + x] = 255;
        }
      }
    }
  }
}

/**
 * Helper: Apply feather effect to mask
 */
function featherMask(mask, width, height, radius) {
  // Simple blur approximation
  const output = new Uint8ClampedArray(mask);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sum = 0;
      let count = 0;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const ny = y + dy;
          const nx = x + dx;

          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            sum += mask[ny * width + nx];
            count++;
          }
        }
      }

      output[y * width + x] = Math.floor(sum / count);
    }
  }

  return output;
}
