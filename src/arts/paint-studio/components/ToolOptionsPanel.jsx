import React, { useState } from 'react';
import '../styles/ToolOptionsPanel.css';

/**
 * ToolOptionsPanel Component
 * Context-aware tool options that change based on selected tool
 * Provides unique controls for each drawing tool
 */
const ToolOptionsPanel = ({ currentTool, toolOptions, onOptionChange, theme = 'light' }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Map tools to their specific options
  const toolConfigs = {
    pencil: {
      name: 'Pencil',
      icon: '✏️',
      options: [
        { id: 'hardness', label: 'Hardness', type: 'range', min: 0, max: 1, step: 0.1 },
        { id: 'stabilization', label: 'Stabilization', type: 'range', min: 0, max: 10, step: 1 },
      ],
    },
    brush: {
      name: 'Brush',
      icon: '🖌️',
      options: [
        { id: 'brushShape', label: 'Brush Shape', type: 'select', values: ['Circle', 'Square', 'Oval'] },
        { id: 'textureAmount', label: 'Texture', type: 'range', min: 0, max: 100, step: 10 },
      ],
    },
    eraser: {
      name: 'Eraser',
      icon: '🧹',
      options: [
        { id: 'hardness', label: 'Hardness', type: 'range', min: 0, max: 1, step: 0.1 },
        { id: 'feather', label: 'Feather', type: 'range', min: 0, max: 20, step: 1 },
      ],
    },
    line: {
      name: 'Line',
      icon: '📏',
      options: [
        { id: 'cornerRadius', label: 'Corner Radius', type: 'range', min: 0, max: 20, step: 1 },
        { id: 'antiAlias', label: 'Anti-aliasing', type: 'checkbox' },
      ],
    },
    rectangle: {
      name: 'Rectangle',
      icon: '◼️',
      options: [
        { id: 'cornerRadius', label: 'Corner Radius', type: 'range', min: 0, max: 50, step: 1 },
        { id: 'fillType', label: 'Fill Type', type: 'select', values: ['Solid', 'Gradient', 'None'] },
      ],
    },
    circle: {
      name: 'Circle',
      icon: '●',
      options: [
        { id: 'fillType', label: 'Fill Type', type: 'select', values: ['Solid', 'Gradient', 'None'] },
        { id: 'strokeWidth', label: 'Stroke Width', type: 'range', min: 0, max: 10, step: 1 },
      ],
    },
    bucket: {
      name: 'Bucket Fill',
      icon: '🪣',
      options: [
        { id: 'tolerance', label: 'Tolerance', type: 'range', min: 0, max: 100, step: 5 },
        { id: 'contiguous', label: 'Contiguous', type: 'checkbox' },
      ],
    },
    text: {
      name: 'Text',
      icon: '📝',
      options: [
        { id: 'fontSize', label: 'Font Size', type: 'range', min: 8, max: 72, step: 1 },
        { id: 'fontFamily', label: 'Font', type: 'select', values: ['Arial', 'Times', 'Courier', 'Georgia'] },
        { id: 'alignment', label: 'Alignment', type: 'select', values: ['Left', 'Center', 'Right'] },
      ],
    },
  };

  const config = toolConfigs[currentTool] || { name: 'Unknown Tool', icon: '?', options: [] };

  const handleOptionChange = (optionId, value) => {
    onOptionChange(optionId, value);
  };

  return (
    <div className={`tool-options-panel ${theme}`}>
      {/* Header */}
      <div className="options-header">
        <h3 className="options-title">
          {config.icon} {config.name} Options
        </h3>
      </div>

      {/* No Options Message */}
      {config.options.length === 0 && (
        <div className="options-empty">
          <p>No specific options for this tool</p>
        </div>
      )}

      {/* Tool Options */}
      {config.options.length > 0 && (
        <div className="options-container">
          {config.options.map((option) => (
            <div key={option.id} className="option-group">
              <label className="option-label">{option.label}</label>

              {option.type === 'range' && (
                <div className="option-range">
                  <input
                    type="range"
                    min={option.min}
                    max={option.max}
                    step={option.step}
                    value={toolOptions[option.id] || option.min}
                    onChange={(e) => handleOptionChange(option.id, parseFloat(e.target.value))}
                    className="range-slider"
                  />
                  <span className="range-value">
                    {typeof toolOptions[option.id] === 'number'
                      ? toolOptions[option.id].toFixed(option.step >= 1 ? 0 : 1)
                      : option.min}
                  </span>
                </div>
              )}

              {option.type === 'select' && (
                <select
                  value={toolOptions[option.id] || option.values[0]}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  className="option-select"
                >
                  {option.values.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              )}

              {option.type === 'checkbox' && (
                <label className="option-checkbox">
                  <input
                    type="checkbox"
                    checked={toolOptions[option.id] || false}
                    onChange={(e) => handleOptionChange(option.id, e.target.checked)}
                  />
                  <span>{toolOptions[option.id] ? 'Enabled' : 'Disabled'}</span>
                </label>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Advanced Toggle */}
      {config.options.length > 0 && (
        <div className="options-footer">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="advanced-toggle"
          >
            {showAdvanced ? '▼' : '▶'} Advanced
          </button>
        </div>
      )}

      {/* Advanced Options */}
      {showAdvanced && config.options.length > 0 && (
        <div className="advanced-options">
          <div className="advanced-info">
            <p>Advanced settings for professional control</p>
            <small>Adjust these for fine-tuning your tool behavior</small>
          </div>
        </div>
      )}

      {/* Preset Save */}
      {config.options.length > 0 && (
        <div className="options-actions">
          <button className="save-preset">💾 Save Preset</button>
        </div>
      )}
    </div>
  );
};

export default ToolOptionsPanel;
