/**
 * useToolOptions Hook
 * Manages tool-specific options and settings
 */

import { useState, useCallback } from 'react';

export const useToolOptions = () => {
  // Tool options state
  const [toolOptions, setToolOptions] = useState({
    // Pencil options
    hardness: 0.8,
    stabilization: 0,
    
    // Brush options
    brushShape: 'Circle',
    textureAmount: 0,
    
    // Eraser options
    feather: 0,
    
    // Line options
    cornerRadius: 0,
    antiAlias: true,
    
    // Rectangle/Circle options
    fillType: 'Solid',
    strokeWidth: 1,
    
    // Bucket options
    tolerance: 30,
    contiguous: true,
    
    // Text options
    fontSize: 16,
    fontFamily: 'Arial',
    alignment: 'Left',
  });

  const setToolOption = useCallback((optionId, value) => {
    setToolOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  }, []);

  const getToolOptions = useCallback((tool) => {
    const toolDefaults = {
      pencil: {
        hardness: toolOptions.hardness,
        stabilization: toolOptions.stabilization,
      },
      brush: {
        brushShape: toolOptions.brushShape,
        textureAmount: toolOptions.textureAmount,
        hardness: toolOptions.hardness,
      },
      eraser: {
        hardness: toolOptions.hardness,
        feather: toolOptions.feather,
      },
      line: {
        cornerRadius: toolOptions.cornerRadius,
        antiAlias: toolOptions.antiAlias,
      },
      rectangle: {
        cornerRadius: toolOptions.cornerRadius,
        fillType: toolOptions.fillType,
      },
      circle: {
        fillType: toolOptions.fillType,
        strokeWidth: toolOptions.strokeWidth,
      },
      bucket: {
        tolerance: toolOptions.tolerance,
        contiguous: toolOptions.contiguous,
      },
      text: {
        fontSize: toolOptions.fontSize,
        fontFamily: toolOptions.fontFamily,
        alignment: toolOptions.alignment,
      },
    };

    return toolDefaults[tool] || {};
  }, [toolOptions]);

  const resetToolOptions = useCallback(() => {
    setToolOptions({
      hardness: 0.8,
      stabilization: 0,
      brushShape: 'Circle',
      textureAmount: 0,
      feather: 0,
      cornerRadius: 0,
      antiAlias: true,
      fillType: 'Solid',
      strokeWidth: 1,
      tolerance: 30,
      contiguous: true,
      fontSize: 16,
      fontFamily: 'Arial',
      alignment: 'Left',
    });
  }, []);

  const saveToolPreset = useCallback((presetName, tool) => {
    const preset = {
      name: presetName,
      tool,
      options: getToolOptions(tool),
      timestamp: new Date().toISOString(),
    };

    // Save to localStorage
    const presets = JSON.parse(localStorage.getItem('toolPresets') || '[]');
    presets.push(preset);
    localStorage.setItem('toolPresets', JSON.stringify(presets));

    return preset;
  }, [getToolOptions]);

  const loadToolPreset = useCallback((presetName) => {
    const presets = JSON.parse(localStorage.getItem('toolPresets') || '[]');
    const preset = presets.find((p) => p.name === presetName);

    if (preset) {
      // Apply all options from preset
      Object.entries(preset.options).forEach(([key, value]) => {
        setToolOption(key, value);
      });
      return preset;
    }

    return null;
  }, [setToolOption]);

  const getToolPresets = useCallback(() => {
    return JSON.parse(localStorage.getItem('toolPresets') || '[]');
  }, []);

  return {
    toolOptions,
    setToolOption,
    getToolOptions,
    resetToolOptions,
    saveToolPreset,
    loadToolPreset,
    getToolPresets,
  };
};
