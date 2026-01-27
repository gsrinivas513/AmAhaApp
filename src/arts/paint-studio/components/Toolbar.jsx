/**
 * Toolbar Component
 * Tool selection and primary controls
 */

import React from 'react';
import { TOOLS, TOOL_CATEGORIES, BRUSH_PRESETS } from '../utils/constants';

export const Toolbar = ({
  currentTool,
  onToolSelect,
  brushSize,
  onBrushSizeChange,
  opacity,
  onOpacityChange,
  color,
  onColorChange,
  theme = {},
}) => {
  const toolIcons = {
    [TOOLS.PENCIL]: '✏️',
    [TOOLS.BRUSH]: '🖌️',
    [TOOLS.ERASER]: '🧹',
    [TOOLS.BUCKET]: '🪣',
    [TOOLS.EYEDROPPER]: '🎨',
    [TOOLS.LINE]: '📏',
    [TOOLS.RECTANGLE]: '▭',
    [TOOLS.CIRCLE]: '○',
    [TOOLS.POLYGON]: '◆',
    [TOOLS.FREEFORM]: '✏️',
    [TOOLS.TEXT]: 'T',
    [TOOLS.GRADIENT]: '◀▶',
    [TOOLS.BLUR]: '◉',
    [TOOLS.SMUDGE]: '👆',
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        padding: '16px',
        background: theme.surfacePrimary || '#f5f5f5',
        borderBottom: `2px solid ${theme.border || '#ddd'}`,
        alignItems: 'center',
        flexWrap: 'wrap',
        overflowX: 'auto',
      }}
    >
      {/* Tool Selection */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <label style={{ fontWeight: 600, color: theme.textPrimary || '#000' }}>Tools:</label>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {[TOOLS.PENCIL, TOOLS.ERASER, TOOLS.LINE, TOOLS.RECTANGLE, TOOLS.CIRCLE, TOOLS.BUCKET, TOOLS.TEXT].map(
            (tool) => (
              <button
                key={tool}
                onClick={() => onToolSelect(tool)}
                title={tool}
                style={{
                  padding: '8px 12px',
                  background: currentTool === tool ? (theme.accentPrimary || '#007bff') : (theme.surfaceSecondary || '#e0e0e0'),
                  color: currentTool === tool ? '#fff' : (theme.textPrimary || '#000'),
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  if (currentTool !== tool) {
                    e.currentTarget.style.background = theme.accentSecondary || '#80bdff';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentTool !== tool) {
                    e.currentTarget.style.background = theme.surfaceSecondary || '#e0e0e0';
                  }
                }}
              >
                {toolIcons[tool] || tool.charAt(0).toUpperCase()}
              </button>
            )
          )}
        </div>
      </div>

      {/* Brush Size */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <label style={{ fontWeight: 600, color: theme.textPrimary || '#000' }}>Size:</label>
        <input
          type="range"
          min="1"
          max="100"
          value={brushSize}
          onChange={(e) => onBrushSizeChange(Number(e.target.value))}
          style={{ width: '120px' }}
        />
        <span style={{ color: theme.textSecondary || '#666', minWidth: '40px' }}>{brushSize}px</span>
      </div>

      {/* Opacity */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <label style={{ fontWeight: 600, color: theme.textPrimary || '#000' }}>Opacity:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={opacity}
          onChange={(e) => onOpacityChange(Number(e.target.value))}
          style={{ width: '120px' }}
        />
        <span style={{ color: theme.textSecondary || '#666', minWidth: '40px' }}>{Math.round(opacity * 100)}%</span>
      </div>

      {/* Color Picker */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <label style={{ fontWeight: 600, color: theme.textPrimary || '#000' }}>Color:</label>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            style={{
              width: '40px',
              height: '40px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          />
          <span style={{ color: theme.textSecondary || '#666', fontFamily: 'monospace' }}>{color}</span>
        </div>
      </div>
    </div>
  );
};
