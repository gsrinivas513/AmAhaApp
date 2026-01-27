/**
 * TransformMenu Component
 * Batch transformation operations (flip, rotate, scale, crop)
 */

import React, { useState } from 'react';

const TransformMenu = ({ selection, onTransformAction, theme = 'light' }) => {
  const [showRotateDialog, setShowRotateDialog] = useState(false);
  const [rotateAngle, setRotateAngle] = useState(0);
  const [showScaleDialog, setShowScaleDialog] = useState(false);
  const [scalePercent, setScalePercent] = useState(100);
  const [scaleMode, setScaleMode] = useState('layer'); // 'layer' | 'canvas'

  const handleFlip = (direction) => {
    onTransformAction({
      type: 'flip',
      direction, // 'horizontal' | 'vertical'
    });
  };

  const handleRotate = (angle) => {
    onTransformAction({
      type: 'rotate',
      angle,
    });
  };

  const handleCustomRotate = () => {
    handleRotate(rotateAngle);
    setShowRotateDialog(false);
    setRotateAngle(0);
  };

  const handleScale = () => {
    onTransformAction({
      type: 'scale',
      percent: scalePercent,
      mode: scaleMode,
    });
    setShowScaleDialog(false);
    setScalePercent(100);
  };

  const handleCrop = () => {
    onTransformAction({
      type: 'cropToSelection',
    });
  };

  return (
    <div
      style={{
        padding: '12px',
        background: theme === 'dark' ? '#1e1e1e' : '#f5f5f5',
        borderLeft: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`,
        color: theme === 'dark' ? '#e0e0e0' : '#333',
        fontSize: '12px',
        maxHeight: '500px',
        overflowY: 'auto',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>Transform</div>

      {/* Flip Section */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '6px', fontWeight: 500 }}>
          FLIP
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <button
            onClick={() => handleFlip('horizontal')}
            title="Flip Horizontal"
            style={{
              padding: '8px',
              fontSize: '11px',
              background: '#667eea',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            ↔️ Horizontal
          </button>
          <button
            onClick={() => handleFlip('vertical')}
            title="Flip Vertical"
            style={{
              padding: '8px',
              fontSize: '11px',
              background: '#667eea',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            ↕️ Vertical
          </button>
        </div>
      </div>

      {/* Rotate Section */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '6px', fontWeight: 500 }}>
          ROTATE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
          <button
            onClick={() => handleRotate(90)}
            title="Rotate 90° Clockwise"
            style={{
              padding: '8px',
              fontSize: '11px',
              background: '#764ba2',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            ↻ 90° CW
          </button>
          <button
            onClick={() => handleRotate(-90)}
            title="Rotate 90° Counter-Clockwise"
            style={{
              padding: '8px',
              fontSize: '11px',
              background: '#764ba2',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            ↺ 90° CCW
          </button>
          <button
            onClick={() => handleRotate(180)}
            title="Rotate 180°"
            style={{
              padding: '8px',
              fontSize: '11px',
              background: '#764ba2',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            180°
          </button>
          <button
            onClick={() => setShowRotateDialog(!showRotateDialog)}
            title="Custom Rotation"
            style={{
              padding: '8px',
              fontSize: '11px',
              background: '#764ba2',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            ⚙️ Custom
          </button>
        </div>

        {showRotateDialog && (
          <div
            style={{
              background: theme === 'dark' ? '#252525' : '#fff',
              padding: '8px',
              borderRadius: '3px',
              border: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`,
              marginBottom: '8px',
            }}
          >
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px' }}>
              Angle (0-360°):
            </label>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
              <input
                type="number"
                min="0"
                max="360"
                value={rotateAngle}
                onChange={(e) => setRotateAngle(parseInt(e.target.value))}
                style={{
                  flex: 1,
                  padding: '4px',
                  borderRadius: '3px',
                  border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
                  background: theme === 'dark' ? '#1e1e1e' : '#fff',
                  color: theme === 'dark' ? '#e0e0e0' : '#333',
                }}
              />
              <button
                onClick={handleCustomRotate}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  background: '#667eea',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                }}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scale Section */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '6px', fontWeight: 500 }}>
          SCALE
        </div>
        <button
          onClick={() => setShowScaleDialog(!showScaleDialog)}
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '11px',
            background: '#FF9800',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            marginBottom: '8px',
          }}
        >
          ⛶ Scale...
        </button>

        {showScaleDialog && (
          <div
            style={{
              background: theme === 'dark' ? '#252525' : '#fff',
              padding: '8px',
              borderRadius: '3px',
              border: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`,
            }}
          >
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px' }}>
              Percent:
            </label>
            <input
              type="number"
              min="10"
              max="400"
              value={scalePercent}
              onChange={(e) => setScalePercent(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '4px',
                marginBottom: '8px',
                borderRadius: '3px',
                border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
                background: theme === 'dark' ? '#1e1e1e' : '#fff',
                color: theme === 'dark' ? '#e0e0e0' : '#333',
              }}
            />

            <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px' }}>
              Mode:
            </label>
            <select
              value={scaleMode}
              onChange={(e) => setScaleMode(e.target.value)}
              style={{
                width: '100%',
                padding: '4px',
                marginBottom: '8px',
                borderRadius: '3px',
                border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
                background: theme === 'dark' ? '#1e1e1e' : '#fff',
                color: theme === 'dark' ? '#e0e0e0' : '#333',
                cursor: 'pointer',
              }}
            >
              <option value="layer">Layer</option>
              <option value="canvas">Canvas</option>
            </select>

            <button
              onClick={handleScale}
              style={{
                width: '100%',
                padding: '6px',
                fontSize: '11px',
                background: '#FF9800',
                color: '#fff',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Crop Section */}
      {selection && selection.isActive && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '6px', fontWeight: 500 }}>
            SELECTION
          </div>
          <button
            onClick={handleCrop}
            title="Crop image to selection"
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '11px',
              background: '#f44336',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            ✂️ Crop to Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default TransformMenu;
