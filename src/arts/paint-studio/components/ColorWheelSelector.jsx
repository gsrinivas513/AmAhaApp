import React, { useState, useRef, useEffect } from 'react';
import { rgbToHsl, hslToRgb, hexToRgb, rgbToHex } from '../utils/colorUtils';
import '../styles/ColorWheelSelector.css';

/**
 * Advanced Color Selector
 * Professional HSL color wheel with saturation/brightness controls
 * Inspired by Krita's color docker
 */
const ColorWheelSelector = ({ currentColor, onColorChange, theme = 'light' }) => {
  const wheelCanvasRef = useRef(null);
  const squareCanvasRef = useRef(null);
  const wheelMarkerRef = useRef(null);
  const squareMarkerRef = useRef(null);

  // Color state
  const [hsl, setHsl] = useState(() => {
    const rgb = hexToRgb(currentColor);
    return rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : { h: 0, s: 100, l: 50 };
  });

  const [colorHistory, setColorHistory] = useState([currentColor]);
  const [showHistory, setShowHistory] = useState(false);
  const [showMixer, setShowMixer] = useState(false);

  // Canvas dimensions
  const wheelSize = 180;
  const squareSize = 120;
  const historySize = 30;
  const maxHistory = 12;

  // Update HSL value
  const updateColor = (newHsl) => {
    setHsl(newHsl);
    const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    onColorChange(hex);

    // Add to history
    if (hex !== currentColor) {
      setColorHistory((prev) => {
        const newHistory = [hex, ...prev.filter((c) => c !== hex)];
        return newHistory.slice(0, maxHistory);
      });
    }
  };

  // Draw color wheel
  useEffect(() => {
    const canvas = wheelCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = wheelSize / 2;
    const centerY = wheelSize / 2;
    const radius = (wheelSize / 2) * 0.85;

    // Clear canvas
    ctx.clearRect(0, 0, wheelSize, wheelSize);

    // Draw hue wheel
    for (let angle = 0; angle < 360; angle += 1) {
      const hueRad = (angle * Math.PI) / 180;
      const x1 = centerX + radius * 0.5 * Math.cos(hueRad);
      const y1 = centerY + radius * 0.5 * Math.sin(hueRad);
      const x2 = centerX + radius * Math.cos(hueRad);
      const y2 = centerY + radius * Math.sin(hueRad);

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, `hsl(${angle}, 0%, 50%)`);
      gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw current hue position
    const hueRad = (hsl.h * Math.PI) / 180;
    const hueX = centerX + radius * 0.9 * Math.cos(hueRad);
    const hueY = centerY + radius * 0.9 * Math.sin(hueRad);

    if (wheelMarkerRef.current) {
      wheelMarkerRef.current.style.left = `${hueX - 5}px`;
      wheelMarkerRef.current.style.top = `${hueY - 5}px`;
    }
  }, [hsl.h]);

  // Draw saturation/lightness square
  useEffect(() => {
    const canvas = squareCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Draw saturation/lightness square
    const imageData = ctx.createImageData(squareSize, squareSize);
    const data = imageData.data;

    for (let y = 0; y < squareSize; y++) {
      for (let x = 0; x < squareSize; x++) {
        const saturation = (x / squareSize) * 100;
        const lightness = 100 - (y / squareSize) * 100;

        const rgb = hslToRgb(hsl.h, saturation, lightness);

        const index = (y * squareSize + x) * 4;
        data[index] = rgb.r;
        data[index + 1] = rgb.g;
        data[index + 2] = rgb.b;
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw current position marker
    const markerX = (hsl.s / 100) * squareSize;
    const markerY = squareSize - (hsl.l / 100) * squareSize;

    if (squareMarkerRef.current) {
      squareMarkerRef.current.style.left = `${markerX - 4}px`;
      squareMarkerRef.current.style.top = `${markerY - 4}px`;
    }
  }, [hsl.h, hsl.s, hsl.l]);

  // Handle wheel click
  const handleWheelClick = (e) => {
    const canvas = wheelCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = wheelSize / 2;
    const centerY = wheelSize / 2;

    const angle = Math.atan2(y - centerY, x - centerX);
    let hue = (angle * 180) / Math.PI + 90;
    if (hue < 0) hue += 360;

    updateColor({ h: Math.round(hue), s: hsl.s, l: hsl.l });
  };

  // Handle square click
  const handleSquareClick = (e) => {
    const canvas = squareCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const saturation = Math.round((x / squareSize) * 100);
    const lightness = Math.round(100 - (y / squareSize) * 100);

    updateColor({ h: hsl.h, s: Math.max(0, Math.min(100, saturation)), l: Math.max(0, Math.min(100, lightness)) });
  };

  // Convert current color to RGB for display
  const currentRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  const currentHex = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);

  // Get complementary color
  const complementaryHsl = { h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l };
  const complementaryRgb = hslToRgb(complementaryHsl.h, complementaryHsl.s, complementaryHsl.l);
  const complementaryHex = rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b);

  return (
    <div className={`color-wheel-selector ${theme}`}>
      {/* Header */}
      <div className="color-header">
        <h3 className="color-title">🎨 Color Selector</h3>
      </div>

      {/* Main Color Display */}
      <div className="color-display">
        <div className="color-preview" style={{ background: currentHex }} />
        <div className="color-info">
          <input
            type="text"
            value={currentHex}
            onChange={(e) => {
              const rgb = hexToRgb(e.target.value);
              if (rgb) {
                const newHsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                updateColor(newHsl);
              }
            }}
            className="color-hex-input"
            placeholder="#000000"
          />
          <div className="color-values">
            <span>H: {hsl.h}°</span>
            <span>S: {hsl.s}%</span>
            <span>L: {hsl.l}%</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="color-tabs">
        <button
          className={`tab-btn ${!showMixer ? 'active' : ''}`}
          onClick={() => setShowMixer(false)}
        >
          Wheel
        </button>
        <button
          className={`tab-btn ${showHistory ? 'active' : ''}`}
          onClick={() => setShowHistory(!showHistory)}
        >
          History ({colorHistory.length})
        </button>
      </div>

      {/* Color Wheel */}
      {!showHistory && (
        <div className="color-wheel-container">
          <div className="wheel-section">
            <h4>Hue</h4>
            <div className="wheel-wrapper">
              <canvas
                ref={wheelCanvasRef}
                width={wheelSize}
                height={wheelSize}
                onClick={handleWheelClick}
                className="color-wheel-canvas"
              />
              <div ref={wheelMarkerRef} className="wheel-marker" />
            </div>
          </div>

          <div className="square-section">
            <h4>Saturation & Lightness</h4>
            <div className="square-wrapper">
              <canvas
                ref={squareCanvasRef}
                width={squareSize}
                height={squareSize}
                onClick={handleSquareClick}
                className="color-square-canvas"
              />
              <div ref={squareMarkerRef} className="square-marker" />
            </div>
            <div className="square-labels">
              <div className="label-top">Light</div>
              <div className="label-bottom">Dark</div>
              <div className="label-left">Saturated</div>
              <div className="label-right">Desaturated</div>
            </div>
          </div>
        </div>
      )}

      {/* Color History */}
      {showHistory && (
        <div className="color-history">
          <div className="history-grid">
            {colorHistory.length > 0 ? (
              colorHistory.map((color, idx) => (
                <div
                  key={idx}
                  className="history-color"
                  style={{ background: color }}
                  onClick={() => onColorChange(color)}
                  title={color}
                />
              ))
            ) : (
              <div className="history-empty">No history yet</div>
            )}
          </div>
        </div>
      )}

      {/* Complementary Color */}
      <div className="complementary-color">
        <div className="complementary-label">Complementary:</div>
        <div className="complementary-preview" style={{ background: complementaryHex }} />
        <div className="complementary-hex">{complementaryHex}</div>
      </div>

      {/* Sliders */}
      <div className="color-sliders">
        <div className="slider-group">
          <label>Hue</label>
          <input
            type="range"
            min="0"
            max="360"
            value={hsl.h}
            onChange={(e) => updateColor({ ...hsl, h: parseInt(e.target.value) })}
            className="slider"
          />
          <span>{hsl.h}°</span>
        </div>

        <div className="slider-group">
          <label>Saturation</label>
          <input
            type="range"
            min="0"
            max="100"
            value={hsl.s}
            onChange={(e) => updateColor({ ...hsl, s: parseInt(e.target.value) })}
            className="slider"
          />
          <span>{hsl.s}%</span>
        </div>

        <div className="slider-group">
          <label>Lightness</label>
          <input
            type="range"
            min="0"
            max="100"
            value={hsl.l}
            onChange={(e) => updateColor({ ...hsl, l: parseInt(e.target.value) })}
            className="slider"
          />
          <span>{hsl.l}%</span>
        </div>
      </div>

      {/* RGB Display */}
      <div className="color-rgb">
        <div>R: {currentRgb.r}</div>
        <div>G: {currentRgb.g}</div>
        <div>B: {currentRgb.b}</div>
      </div>
    </div>
  );
};

export default ColorWheelSelector;
