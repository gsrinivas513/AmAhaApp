/**
 * LayerPanel Component
 * Layer management and manipulation with blend modes
 */

import React, { useState } from 'react';
import { BLENDING_MODES } from '../utils/constants';

export const LayerPanel = ({
  layers = [],
  selectedLayerId,
  onSelectLayer,
  onAddLayer,
  onDeleteLayer,
  onRenameLayer,
  onSetOpacity,
  onToggleVisibility,
  onSetBlendingMode,
  theme = {},
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [expandedBlendId, setExpandedBlendId] = useState(null);

  const handleRenameStart = (layer) => {
    setEditingId(layer.id);
    setEditingName(layer.name);
  };

  const handleRenameSave = (id) => {
    if (editingName.trim()) {
      onRenameLayer(id, editingName);
    }
    setEditingId(null);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: theme.surfacePrimary || '#f5f5f5',
        borderLeft: `2px solid ${theme.border || '#ddd'}`,
        padding: '12px',
        minWidth: '200px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: `2px solid ${theme.border || '#ddd'}`,
        }}
      >
        <h3 style={{ margin: 0, color: theme.textPrimary || '#000', fontSize: '14px', fontWeight: 700 }}>
          🎨 Layers
        </h3>
        <button
          onClick={onAddLayer}
          title="Add new layer"
          style={{
            padding: '4px 8px',
            background: theme.accentPrimary || '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          + New
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {layers.map((layer) => (
          <div
            key={layer.id}
            onClick={() => onSelectLayer(layer.id)}
            style={{
              padding: '8px',
              marginBottom: '4px',
              background: selectedLayerId === layer.id ? (theme.accentPrimary || '#007bff') : (theme.surfaceSecondary || '#e0e0e0'),
              color: selectedLayerId === layer.id ? '#fff' : (theme.textPrimary || '#000'),
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Visibility Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility(layer.id);
                }}
                title={layer.visible ? 'Hide' : 'Show'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: 0,
                  color: 'inherit',
                }}
              >
                {layer.visible ? '👁️' : '🚫'}
              </button>

              {/* Layer Name */}
              {editingId === layer.id ? (
                <input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleRenameSave(layer.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameSave(layer.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    flex: 1,
                    padding: '4px',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid currentColor',
                    borderRadius: '3px',
                    color: 'inherit',
                    fontFamily: 'inherit',
                  }}
                />
              ) : (
                <span
                  onDoubleClick={() => handleRenameStart(layer)}
                  style={{ flex: 1, fontSize: '12px', cursor: 'text' }}
                >
                  {layer.name}
                </span>
              )}
            </div>

            {/* Opacity Control */}
            <div
              style={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                fontSize: '10px',
              }}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={layer.opacity}
                onChange={(e) => onSetOpacity(layer.id, Number(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '60px',
                }}
              />
              <span>{Math.round(layer.opacity * 100)}%</span>
            </div>

            {/* Blend Mode Control */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedBlendId(expandedBlendId === layer.id ? null : layer.id);
                }}
                title="Blend mode"
                style={{
                  padding: '4px 8px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '10px',
                  color: 'inherit',
                  fontWeight: 600,
                }}
              >
                {layer.blendingMode || 'source-over'} ▼
              </button>

              {/* Blend Mode Dropdown */}
              {expandedBlendId === layer.id && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    zIndex: 1000,
                    background: theme.surfaceSecondary || '#f0f0f0',
                    border: `1px solid ${theme.border || '#ddd'}`,
                    borderRadius: '4px',
                    minWidth: '150px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    marginTop: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}
                >
                  {BLENDING_MODES.map((mode) => (
                    <div
                      key={mode}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetBlendingMode(layer.id, mode);
                        setExpandedBlendId(null);
                      }}
                      style={{
                        padding: '6px 10px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        background: layer.blendingMode === mode ? (theme.accentPrimary || '#007bff') : 'transparent',
                        color: layer.blendingMode === mode ? '#fff' : (theme.textPrimary || '#000'),
                        borderBottom: `1px solid ${theme.border || '#e0e0e0'}`,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (layer.blendingMode !== mode) {
                          e.target.style.background = theme.surfaceTertiary || '#e8e8e8';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (layer.blendingMode !== mode) {
                          e.target.style.background = 'transparent';
                        }
                      }}
                    >
                      {mode}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteLayer(layer.id);
              }}
              title="Delete layer"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                padding: '2px 6px',
                fontSize: '12px',
                color: 'inherit',
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
