/**
 * SelectionPanel Component
 * Shows and modifies selection properties
 */

import React, { useState } from 'react';

const SelectionPanel = ({
  selection,
  onPropertyChange,
  onAction,
  onClearSelection,
  theme = 'light',
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!selection.isActive) {
    return (
      <div
        style={{
          padding: '16px',
          background: theme === 'dark' ? '#1e1e1e' : '#f5f5f5',
          borderLeft: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`,
          color: theme === 'dark' ? '#e0e0e0' : '#333',
          fontSize: '12px',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Selection</div>
        <div style={{ opacity: 0.6 }}>No active selection</div>
      </div>
    );
  }

  const { bounds, feather, antiAlias, type } = selection;

  return (
    <div
      style={{
        padding: '16px',
        background: theme === 'dark' ? '#1e1e1e' : '#f5f5f5',
        borderLeft: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`,
        color: theme === 'dark' ? '#e0e0e0' : '#333',
        fontSize: '12px',
        maxHeight: '400px',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ fontWeight: 'bold' }}>Selection</div>
        <span style={{ fontSize: '11px', opacity: 0.7, textTransform: 'capitalize' }}>
          {type}
        </span>
      </div>

      {/* Selection Info */}
      {bounds && (
        <div
          style={{
            background: theme === 'dark' ? '#252525' : '#fff',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '12px',
            border: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
            <div>
              <label style={{ opacity: 0.7, display: 'block', marginBottom: '2px' }}>X</label>
              <input
                type="number"
                value={Math.round(bounds.x)}
                onChange={(e) =>
                  onPropertyChange('bounds', {
                    ...bounds,
                    x: parseInt(e.target.value),
                  })
                }
                style={{
                  width: '100%',
                  padding: '4px',
                  borderRadius: '3px',
                  border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
                  background: theme === 'dark' ? '#1e1e1e' : '#fff',
                  color: theme === 'dark' ? '#e0e0e0' : '#333',
                }}
              />
            </div>
            <div>
              <label style={{ opacity: 0.7, display: 'block', marginBottom: '2px' }}>Y</label>
              <input
                type="number"
                value={Math.round(bounds.y)}
                onChange={(e) =>
                  onPropertyChange('bounds', {
                    ...bounds,
                    y: parseInt(e.target.value),
                  })
                }
                style={{
                  width: '100%',
                  padding: '4px',
                  borderRadius: '3px',
                  border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
                  background: theme === 'dark' ? '#1e1e1e' : '#fff',
                  color: theme === 'dark' ? '#e0e0e0' : '#333',
                }}
              />
            </div>
            <div>
              <label style={{ opacity: 0.7, display: 'block', marginBottom: '2px' }}>Width</label>
              <input
                type="number"
                value={Math.round(bounds.width)}
                onChange={(e) =>
                  onPropertyChange('bounds', {
                    ...bounds,
                    width: parseInt(e.target.value),
                  })
                }
                style={{
                  width: '100%',
                  padding: '4px',
                  borderRadius: '3px',
                  border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
                  background: theme === 'dark' ? '#1e1e1e' : '#fff',
                  color: theme === 'dark' ? '#e0e0e0' : '#333',
                }}
              />
            </div>
            <div>
              <label style={{ opacity: 0.7, display: 'block', marginBottom: '2px' }}>Height</label>
              <input
                type="number"
                value={Math.round(bounds.height)}
                onChange={(e) =>
                  onPropertyChange('bounds', {
                    ...bounds,
                    height: parseInt(e.target.value),
                  })
                }
                style={{
                  width: '100%',
                  padding: '4px',
                  borderRadius: '3px',
                  border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
                  background: theme === 'dark' ? '#1e1e1e' : '#fff',
                  color: theme === 'dark' ? '#e0e0e0' : '#333',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Feather */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', opacity: 0.8 }}>
          Feather: {feather}px
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={feather}
          onChange={(e) => onPropertyChange('feather', parseInt(e.target.value))}
          style={{
            width: '100%',
            height: '4px',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            outline: 'none',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Anti-Alias */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={antiAlias}
            onChange={(e) => onPropertyChange('antiAlias', e.target.checked)}
            style={{ marginRight: '6px', cursor: 'pointer' }}
          />
          <span>Anti-alias edges</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          marginBottom: '12px',
        }}
      >
        <button
          onClick={() => onAction('invert')}
          title="Invert selection (Ctrl+I)"
          style={{
            padding: '6px',
            fontSize: '11px',
            background: '#4A90E2',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          ↔️ Invert
        </button>
        <button
          onClick={() => onAction('grow')}
          title="Grow selection"
          style={{
            padding: '6px',
            fontSize: '11px',
            background: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          ⬅️➡️ Grow
        </button>
        <button
          onClick={() => onAction('shrink')}
          title="Shrink selection"
          style={{
            padding: '6px',
            fontSize: '11px',
            background: '#FF9800',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          ➡️⬅️ Shrink
        </button>
        <button
          onClick={() => onClearSelection()}
          title="Clear selection (Ctrl+Shift+A)"
          style={{
            padding: '6px',
            fontSize: '11px',
            background: '#f44336',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          ✕ Clear
        </button>
      </div>

      {/* Advanced Options */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        style={{
          width: '100%',
          padding: '6px',
          fontSize: '11px',
          background: theme === 'dark' ? '#252525' : '#e0e0e0',
          color: theme === 'dark' ? '#e0e0e0' : '#333',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer',
          marginBottom: '8px',
        }}
      >
        {showAdvanced ? '▼' : '▶'} Advanced
      </button>

      {showAdvanced && (
        <div
          style={{
            background: theme === 'dark' ? '#252525' : '#fff',
            padding: '10px',
            borderRadius: '4px',
            border: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`,
            fontSize: '11px',
          }}
        >
          <button
            onClick={() => onAction('saveSelection')}
            style={{
              width: '100%',
              padding: '6px',
              marginBottom: '6px',
              background: '#667eea',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            💾 Save
          </button>
          <button
            onClick={() => onAction('loadSelection')}
            style={{
              width: '100%',
              padding: '6px',
              background: '#667eea',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            📂 Load
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectionPanel;
