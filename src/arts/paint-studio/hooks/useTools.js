/**
 * useTools Hook
 * Manages current tool selection and tool options
 */

import { useState, useCallback } from 'react';
import { TOOLS, BRUSH_PRESETS } from '../utils/constants';

export const useTools = (initialTool = TOOLS.PENCIL) => {
  const [currentTool, setCurrentTool] = useState(initialTool);
  const [brushSize, setBrushSize] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [hardness, setHardness] = useState(1);
  const [spacing, setSpacing] = useState(8);
  const [color, setColor] = useState('#000000');
  const [blendingMode, setBlendingMode] = useState('source-over');

  const selectTool = useCallback((tool) => {
    setCurrentTool(tool);
  }, []);

  const applyBrushPreset = useCallback((presetName) => {
    const preset = BRUSH_PRESETS[presetName];
    if (preset) {
      setBrushSize(preset.size);
      setOpacity(preset.opacity);
      setHardness(preset.hardness);
    }
  }, []);

  const getToolOptions = useCallback(() => {
    return {
      tool: currentTool,
      brushSize,
      opacity,
      hardness,
      spacing,
      color,
      blendingMode,
    };
  }, [currentTool, brushSize, opacity, hardness, spacing, color, blendingMode]);

  return {
    currentTool,
    brushSize,
    opacity,
    hardness,
    spacing,
    color,
    blendingMode,
    selectTool,
    setBrushSize,
    setOpacity,
    setHardness,
    setSpacing,
    setColor,
    setBlendingMode,
    applyBrushPreset,
    getToolOptions,
  };
};
