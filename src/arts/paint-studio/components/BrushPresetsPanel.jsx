import React, { useState, useMemo } from 'react';
import { BRUSH_PRESETS, PRESET_CATEGORIES } from '../utils/constants';
import '../styles/BrushPresetsPanel.css';

/**
 * BrushPresetsPanel
 * Displays visual brush preset library inspired by Krita's docker system
 * Users can quickly select presets and apply them to current brush settings
 */
const BrushPresetsPanel = ({ currentBrush, onApplyPreset, theme = 'light' }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPreset, setHoveredPreset] = useState(null);

  // Get all unique categories from presets
  const categories = useMemo(() => {
    const cats = new Set(['All']);
    Object.values(BRUSH_PRESETS).forEach(preset => {
      cats.add(preset.category);
    });
    return Array.from(cats);
  }, []);

  // Filter presets based on category and search
  const filteredPresets = useMemo(() => {
    return Object.entries(BRUSH_PRESETS).filter(([key, preset]) => {
      const matchesCategory = selectedCategory === 'All' || preset.category === selectedCategory;
      const matchesSearch = 
        preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preset.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handlePresetClick = (presetKey, preset) => {
    onApplyPreset({
      size: preset.size,
      hardness: preset.hardness,
      opacity: preset.opacity,
      spacing: preset.spacing,
      presetName: preset.name,
    });
  };

  const getPresetStyle = (preset) => {
    // Create visual preview circle background gradient
    const hardnessColor = `rgba(0, 0, 0, ${1 - preset.hardness})`;
    return {
      background: `radial-gradient(circle, ${preset.color} 0%, ${hardnessColor} ${Math.round(preset.hardness * 100)}%)`,
      opacity: preset.opacity,
    };
  };

  const isPresetActive = (preset) => {
    return (
      currentBrush.size === preset.size &&
      currentBrush.hardness === preset.hardness &&
      currentBrush.opacity === preset.opacity
    );
  };

  return (
    <div className={`brush-presets-panel ${theme}`}>
      {/* Header */}
      <div className="presets-header">
        <h3 className="presets-title">📌 Brush Presets</h3>
        <p className="presets-subtitle">{filteredPresets.length} presets available</p>
      </div>

      {/* Search Bar */}
      <div className="presets-search-container">
        <input
          type="text"
          placeholder="🔍 Search presets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="presets-search-input"
        />
      </div>

      {/* Category Tabs */}
      <div className="presets-categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Presets Grid */}
      <div className="presets-grid">
        {filteredPresets.length > 0 ? (
          filteredPresets.map(([presetKey, preset]) => (
            <div
              key={presetKey}
              className={`preset-item ${isPresetActive(preset) ? 'active' : ''}`}
              onClick={() => handlePresetClick(presetKey, preset)}
              onMouseEnter={() => setHoveredPreset(presetKey)}
              onMouseLeave={() => setHoveredPreset(null)}
            >
              {/* Visual Preset Circle */}
              <div
                className="preset-preview"
                style={getPresetStyle(preset)}
                title={preset.description}
              />

              {/* Preset Name */}
              <div className="preset-name">{preset.name}</div>

              {/* Hover Info */}
              {hoveredPreset === presetKey && (
                <div className="preset-tooltip">
                  <div className="tooltip-content">
                    <strong>{preset.name}</strong>
                    <div className="tooltip-info">
                      <span>Size: {preset.size}px</span>
                      <span>Hardness: {Math.round(preset.hardness * 100)}%</span>
                      <span>Opacity: {Math.round(preset.opacity * 100)}%</span>
                      <span>Spacing: {preset.spacing}px</span>
                    </div>
                    <p className="tooltip-description">{preset.description}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="presets-empty">
            <p>No presets found</p>
            <small>Try a different search or category</small>
          </div>
        )}
      </div>

      {/* Current Brush Info */}
      <div className="current-brush-info">
        <h4>Current Brush</h4>
        <div className="brush-stats">
          <div className="stat-row">
            <span>Size:</span>
            <strong>{currentBrush.size}px</strong>
          </div>
          <div className="stat-row">
            <span>Hardness:</span>
            <strong>{Math.round(currentBrush.hardness * 100)}%</strong>
          </div>
          <div className="stat-row">
            <span>Opacity:</span>
            <strong>{Math.round(currentBrush.opacity * 100)}%</strong>
          </div>
          <div className="stat-row">
            <span>Spacing:</span>
            <strong>{currentBrush.spacing}px</strong>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="presets-footer">
        <small>💡 Click any preset to apply it instantly</small>
      </div>
    </div>
  );
};

export default BrushPresetsPanel;
