/**
 * ImageCropControl.jsx
 * Provides image cropping and zoom controls for admin to adjust image display
 * Allows controlling how images are displayed on cards (crop, zoom, scale)
 */

import React, { useState, useRef } from "react";

export const CROP_PRESETS = {
  COVER: { label: "Cover (Fill)", description: "Image fills the card, some edges cropped", value: "cover" },
  CONTAIN: { label: "Contain (Fit)", description: "Full image visible, may have gaps", value: "contain" },
  CROP_CENTER: { label: "Crop Center", description: "Crop from center", value: "crop-center" },
  CROP_ZOOM_IN: { label: "Zoom In", description: "Zoom in and crop", value: "crop-zoom-in" },
  CROP_ZOOM_OUT: { label: "Zoom Out", description: "Zoom out to show more", value: "crop-zoom-out" },
};

function ImageCropControl({ imageUrl, currentSettings = {}, onChange }) {
  const [preview, setPreview] = useState(true);
  const containerRef = useRef(null);

  const settings = {
    crop: currentSettings.crop || "cover",
    zoom: currentSettings.zoom || 1,
    offsetX: currentSettings.offsetX || 0,
    offsetY: currentSettings.offsetY || 0,
  };

  const handleCropChange = (cropType) => {
    onChange({
      ...settings,
      crop: cropType,
      zoom: cropType === "crop-zoom-out" ? 0.8 : cropType === "crop-zoom-in" ? 1.2 : 1,
      offsetX: 0,
      offsetY: 0,
    });
  };

  const handleZoomChange = (e) => {
    const newZoom = parseFloat(e.target.value);
    onChange({
      ...settings,
      zoom: newZoom,
    });
  };

  const handleOffsetChange = (axis, value) => {
    onChange({
      ...settings,
      [axis]: parseFloat(value),
    });
  };

  // Calculate preview styles
  const previewStyle = {
    width: "100%",
    height: "160px",
    background: "#f0f0f0",
    borderRadius: "8px",
    overflow: "hidden",
    border: "2px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: settings.crop === "contain" ? "contain" : "cover",
    transform: `scale(${settings.zoom}) translate(${settings.offsetX}px, ${settings.offsetY}px)`,
    transition: "transform 0.2s ease",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Preview */}
      {preview && imageUrl && (
        <div>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
            📸 Preview (Card View)
          </label>
          <div ref={containerRef} style={previewStyle}>
            <img
              src={imageUrl}
              alt="Preview"
              style={imageStyle}
              onError={() => (
                <div style={{ color: "#999", fontSize: 12 }}>Image failed to load</div>
              )}
            />
          </div>
          <p style={{ fontSize: 11, color: "#888", marginTop: 4, textAlign: "center" }}>
            Current: {settings.crop} | Zoom: {settings.zoom.toFixed(2)}x
          </p>
        </div>
      )}

      {/* Crop Mode Selection */}
      <div>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
          🎯 Crop Mode
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {Object.entries(CROP_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handleCropChange(preset.value)}
              style={{
                padding: "10px 12px",
                border: settings.crop === preset.value ? "2px solid #6C63FF" : "1px solid #e2e8f0",
                borderRadius: "6px",
                background: settings.crop === preset.value ? "#f0f0ff" : "#fff",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (settings.crop !== preset.value) {
                  e.target.style.borderColor = "#d0d0d0";
                  e.target.style.background = "#fafafa";
                }
              }}
              onMouseLeave={(e) => {
                if (settings.crop !== preset.value) {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.background = "#fff";
                }
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0b1220" }}>
                {preset.label}
              </div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Zoom Control */}
      <div>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
          🔍 Zoom Level: {settings.zoom.toFixed(2)}x
        </label>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#666" }}>0.5x</span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.zoom}
            onChange={handleZoomChange}
            style={{
              flex: 1,
              height: "6px",
              borderRadius: "3px",
              background: "#e2e8f0",
              outline: "none",
              cursor: "pointer",
            }}
          />
          <span style={{ fontSize: 12, color: "#666" }}>2.0x</span>
        </div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
          Lower = show more area | Higher = zoom in on center
        </div>
      </div>

      {/* Offset Controls (for fine-tuning position) */}
      <div>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
          📍 Fine-tune Position (offset in pixels)
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 4 }}>
              Horizontal (X): {settings.offsetX}px
            </label>
            <input
              type="range"
              min="-50"
              max="50"
              step="5"
              value={settings.offsetX}
              onChange={(e) => handleOffsetChange("offsetX", e.target.value)}
              style={{
                width: "100%",
                height: "6px",
                borderRadius: "3px",
                background: "#e2e8f0",
                outline: "none",
                cursor: "pointer",
              }}
            />
            <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>
              ← Left | Right →
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 4 }}>
              Vertical (Y): {settings.offsetY}px
            </label>
            <input
              type="range"
              min="-50"
              max="50"
              step="5"
              value={settings.offsetY}
              onChange={(e) => handleOffsetChange("offsetY", e.target.value)}
              style={{
                width: "100%",
                height: "6px",
                borderRadius: "3px",
                background: "#e2e8f0",
                outline: "none",
                cursor: "pointer",
              }}
            />
            <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>
              ↑ Up | Down ↓
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div
        style={{
          padding: "10px 12px",
          background: "#f0f7ff",
          border: "1px solid #b3d9ff",
          borderRadius: "6px",
          fontSize: 12,
          color: "#0066cc",
          lineHeight: 1.4,
        }}
      >
        <strong>💡 Tip:</strong> Use "Cover" for best card appearance. Use "Zoom" options if image details are cut off. 
        Fine-tune position if important content is off-center.
      </div>
    </div>
  );
}

export default ImageCropControl;
