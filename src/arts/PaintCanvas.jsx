import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { saveArtwork, generateId } from './services/ArtStorageService';

const PaintCanvas = () => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pencil'); // pencil, brush, eraser, bucket, line, rectangle, circle, text
  const [color, setColor] = useState(theme.accentPrimary || '#FF0000');
  const [brushSize, setBrushSize] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [history, setHistory] = useState([]);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [artTitle, setArtTitle] = useState('');
  const [startPos, setStartPos] = useState(null);
  const [textMode, setTextMode] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [zoomLevel, setZoomLevel] = useState(1);

  const PRESET_COLORS = [
    theme.accentPrimary,
    theme.accentSecondary,
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', 
    '#00FFFF', '#FFA500', '#FF69B4', '#000000', '#FFFFFF',
    theme.success, theme.warning, theme.error
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 40;
    canvas.height = window.innerHeight - 250;

    const context = canvas.getContext('2d');
    context.fillStyle = theme.surfacePrimary;
    context.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current = context;
    saveCanvasState();

    const handleResize = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(canvas, 0, 0);

      canvas.width = window.innerWidth - 40;
      canvas.height = window.innerHeight - 250;
      const newContext = canvas.getContext('2d');
      newContext.fillStyle = theme.surfacePrimary;
      newContext.fillRect(0, 0, canvas.width, canvas.height);
      newContext.drawImage(tempCanvas, 0, 0);
      contextRef.current = newContext;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();
    setHistory(prev => [...prev, imageData]);
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoomLevel;
    const y = (e.clientY - rect.top) / zoomLevel;

    if (tool === 'text') {
      setTextMode(true);
      setStartPos({ x, y });
      return;
    }

    setStartPos({ x, y });
    const ctx = contextRef.current;
    ctx.globalAlpha = opacity;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
    }

    if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoomLevel;
    const y = (e.clientY - rect.top) / zoomLevel;

    const ctx = contextRef.current;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (!isDrawing && !startPos) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const endX = (e.clientX - rect.left) / zoomLevel;
    const endY = (e.clientY - rect.top) / zoomLevel;

    const ctx = contextRef.current;

    if (tool === 'line' && startPos) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(canvas, 0, 0);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(tempCanvas, 0, 0);
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    } else if (tool === 'rectangle' && startPos) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(canvas, 0, 0);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(tempCanvas, 0, 0);
      ctx.strokeRect(startPos.x, startPos.y, endX - startPos.x, endY - startPos.y);
    } else if (tool === 'circle' && startPos) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(canvas, 0, 0);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(tempCanvas, 0, 0);
      const radius = Math.sqrt(Math.pow(endX - startPos.x, 2) + Math.pow(endY - startPos.y, 2));
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') {
      ctx.closePath();
    }

    if (tool !== 'text') {
      ctx.globalAlpha = 1;
      setIsDrawing(false);
      setStartPos(null);
      saveCanvasState();
    }
  };

  const handleBucketFill = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / zoomLevel);
    const y = Math.floor((e.clientY - rect.top) / zoomLevel);

    const ctx = contextRef.current;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const pixelPos = (y * canvas.width + x) * 4;
    const targetColor = [data[pixelPos], data[pixelPos + 1], data[pixelPos + 2], data[pixelPos + 3]];

    const fillColor = hexToRgb(color);

    const stack = [[x, y]];
    const visited = new Set();

    while (stack.length > 0) {
      const [cx, cy] = stack.pop();
      const key = `${cx},${cy}`;

      if (visited.has(key) || cx < 0 || cx >= canvas.width || cy < 0 || cy >= canvas.height) continue;
      visited.add(key);

      const pos = (cy * canvas.width + cx) * 4;
      const pixelColor = [data[pos], data[pos + 1], data[pos + 2], data[pos + 3]];

      if (pixelColor[0] === targetColor[0] && pixelColor[1] === targetColor[1] &&
          pixelColor[2] === targetColor[2] && pixelColor[3] === targetColor[3]) {
        data[pos] = Math.round(fillColor.r * opacity);
        data[pos + 1] = Math.round(fillColor.g * opacity);
        data[pos + 2] = Math.round(fillColor.b * opacity);
        data[pos + 3] = 255;

        stack.push([cx + 1, cy]);
        stack.push([cx - 1, cy]);
        stack.push([cx, cy + 1]);
        stack.push([cx, cy - 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);
    saveCanvasState();
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const handleAddText = () => {
    if (!textInput.trim() || !startPos) return;

    const ctx = contextRef.current;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.fillText(textInput, startPos.x, startPos.y);

    setTextMode(false);
    setTextInput('');
    setStartPos(null);
    saveCanvasState();
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = newHistory[newHistory.length - 1];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        contextRef.current = ctx;
      };
    }
  };

  const handleDownloadImage = (format = 'png') => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL(`image/${format}`);
    link.download = `artwork_${Date.now()}.${format}`;
    link.click();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = theme.surfacePrimary;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current = ctx;
    setHistory([]);
    saveCanvasState();
  };

  const handleSave = async () => {
    if (!artTitle.trim()) {
      alert('Please enter a title for your artwork!');
      return;
    }

    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');

    const artwork = {
      id: generateId(),
      title: artTitle,
      imageData,
      type: 'paint',
      createdAt: new Date().toISOString(),
    };

    saveArtwork(artwork);
    alert('🎨 Artwork saved!');
    setShowSavePrompt(false);
    setArtTitle('');
  };

  const toolButtons = [
    { id: 'pencil', label: '✏️ Pencil', tooltip: 'Precise drawing' },
    { id: 'brush', label: '🖌️ Brush', tooltip: 'Soft brush strokes' },
    { id: 'eraser', label: '🧹 Eraser', tooltip: 'Erase content' },
    { id: 'bucket', label: '🪣 Fill', tooltip: 'Bucket fill tool' },
    { id: 'line', label: '📏 Line', tooltip: 'Draw straight lines' },
    { id: 'rectangle', label: '▭ Shape', tooltip: 'Draw rectangles' },
    { id: 'circle', label: '● Circle', tooltip: 'Draw circles' },
    { id: 'text', label: '𝐓 Text', tooltip: 'Add text' },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: theme.background,
      overflow: 'hidden',
    }}>
      {/* Top Toolbar */}
      <div style={{
        background: theme.surfacePrimary,
        borderBottom: `2px solid ${theme.border}`,
        padding: '12px 20px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
        boxShadow: `0 2px 8px ${theme.shadow}`,
      }}>
        {/* Logo/Title */}
        <h1 style={{
          color: theme.textPrimary,
          fontSize: '18px',
          fontWeight: '800',
          margin: '0 20px 0 0',
          borderRight: `2px solid ${theme.border}`,
          paddingRight: '20px',
        }}>
          🎨 Digital Paint Studio
        </h1>

        {/* Tool Selection */}
        <div style={{
          display: 'flex',
          gap: '6px',
          padding: '8px',
          background: theme.background,
          borderRadius: '8px',
          border: `1px solid ${theme.border}`,
        }}>
          {toolButtons.map(btn => (
            <button
              key={btn.id}
              onClick={() => {
                setTool(btn.id);
                if (btn.id === 'bucket') {
                  setIsDrawing(true);
                }
              }}
              title={btn.tooltip}
              style={{
                padding: '8px 12px',
                background: tool === btn.id ? theme.accentPrimary : 'transparent',
                color: tool === btn.id ? '#fff' : theme.textPrimary,
                border: `2px solid ${tool === btn.id ? theme.accentPrimary : theme.border}`,
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Right Side Controls */}
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          paddingLeft: '20px',
          borderLeft: `2px solid ${theme.border}`,
        }}>
          {/* Color Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ color: theme.textPrimary, fontSize: '12px', fontWeight: '600' }}>
              🎨 Color:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{
                  width: '40px',
                  height: '40px',
                  border: `3px solid ${theme.border}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  padding: '0',
                }}
              />
            </div>
            {/* Preset Colors */}
            <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
              {PRESET_COLORS.slice(0, 5).map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: '28px',
                    height: '28px',
                    background: c,
                    border: color === c ? `3px solid ${theme.textPrimary}` : `1px solid ${theme.border}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Brush Size */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ color: theme.textPrimary, fontSize: '12px', fontWeight: '600' }}>
              Size:
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              style={{
                width: '100px',
                cursor: 'pointer',
              }}
            />
            <span style={{ color: theme.textSecondary, fontSize: '12px', minWidth: '30px' }}>
              {brushSize}px
            </span>
          </div>

          {/* Opacity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ color: theme.textPrimary, fontSize: '12px', fontWeight: '600' }}>
              ◐ Opacity:
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              style={{
                width: '80px',
                cursor: 'pointer',
              }}
            />
            <span style={{ color: theme.textSecondary, fontSize: '12px', minWidth: '30px' }}>
              {Math.round(opacity * 100)}%
            </span>
          </div>

          {/* Zoom */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ color: theme.textPrimary, fontSize: '12px', fontWeight: '600' }}>
              🔍 Zoom:
            </label>
            <button
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
              style={{
                padding: '6px 10px',
                background: theme.background,
                border: `1px solid ${theme.border}`,
                borderRadius: '4px',
                color: theme.textPrimary,
                cursor: 'pointer',
              }}
            >
              −
            </button>
            <span style={{ color: theme.textSecondary, fontSize: '12px', minWidth: '40px', textAlign: 'center' }}>
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.1))}
              style={{
                padding: '6px 10px',
                background: theme.background,
                border: `1px solid ${theme.border}`,
                borderRadius: '4px',
                color: theme.textPrimary,
                cursor: 'pointer',
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Toolbar */}
      <div style={{
        background: theme.surfacePrimary,
        borderBottom: `1px solid ${theme.border}`,
        padding: '8px 20px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
      }}>
        {/* Action Buttons */}
        <button
          onClick={handleUndo}
          style={{
            padding: '8px 14px',
            background: theme.background,
            border: `1px solid ${theme.border}`,
            borderRadius: '6px',
            color: theme.textPrimary,
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = theme.accentPrimary + '20'}
          onMouseLeave={(e) => e.currentTarget.style.background = theme.background}
        >
          ↩️ Undo
        </button>

        <button
          onClick={handleClear}
          style={{
            padding: '8px 14px',
            background: theme.error + '20',
            border: `1px solid ${theme.error}`,
            borderRadius: '6px',
            color: theme.error,
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = theme.error + '30'}
          onMouseLeave={(e) => e.currentTarget.style.background = theme.error + '20'}
        >
          🗑️ Clear Canvas
        </button>

        <button
          onClick={() => handleDownloadImage('png')}
          style={{
            padding: '8px 14px',
            background: theme.warning + '20',
            border: `1px solid ${theme.warning}`,
            borderRadius: '6px',
            color: theme.warning,
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = theme.warning + '30'}
          onMouseLeave={(e) => e.currentTarget.style.background = theme.warning + '20'}
        >
          ⬇️ Download PNG
        </button>

        <button
          onClick={() => handleDownloadImage('jpeg')}
          style={{
            padding: '8px 14px',
            background: theme.success + '20',
            border: `1px solid ${theme.success}`,
            borderRadius: '6px',
            color: theme.success,
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = theme.success + '30'}
          onMouseLeave={(e) => e.currentTarget.style.background = theme.success + '20'}
        >
          ⬇️ Download JPEG
        </button>

        <div style={{ flex: 1 }} />

        <button
          onClick={() => setShowSavePrompt(true)}
          style={{
            padding: '10px 18px',
            background: theme.accentPrimary,
            border: `2px solid ${theme.accentPrimary}`,
            borderRadius: '6px',
            color: '#fff',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 4px 12px ${theme.accentPrimary}40`;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          💾 Save to Gallery
        </button>
      </div>

      {/* Canvas Area */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        background: theme.background,
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          position: 'relative',
          boxShadow: `0 10px 40px ${theme.shadow}`,
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <canvas
            ref={canvasRef}
            onMouseDown={tool === 'bucket' ? handleBucketFill : startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{
              display: 'block',
              background: theme.surfacePrimary,
              border: `3px solid ${theme.border}`,
              borderRadius: '10px',
              cursor: tool === 'bucket' ? 'copy' : tool === 'text' ? 'text' : 'crosshair',
              touchAction: 'none',
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left',
              transition: 'transform 0.2s ease',
            }}
          />
        </div>
      </div>

      {/* Text Input Modal */}
      {textMode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: theme.surfacePrimary,
            border: `2px solid ${theme.accentPrimary}`,
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: `0 20px 60px rgba(0,0,0,0.3)`,
          }}>
            <h3 style={{
              color: theme.textPrimary,
              fontSize: '20px',
              fontWeight: '700',
              margin: '0 0 20px 0',
            }}>
              ✏️ Add Text to Canvas
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: theme.textPrimary,
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '8px',
              }}>
                Text Content:
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter your text here..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '12px',
                  background: theme.background,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.textPrimary,
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: theme.textPrimary,
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '8px',
              }}>
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                style={{
                  width: '100%',
                  cursor: 'pointer',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAddText}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: theme.accentPrimary,
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                ✓ Add Text
              </button>
              <button
                onClick={() => {
                  setTextMode(false);
                  setTextInput('');
                  setStartPos(null);
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: theme.background,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.textPrimary,
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
              transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = theme.border}
                onMouseLeave={(e) => e.currentTarget.style.background = theme.background}
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Artwork Modal */}
      {showSavePrompt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
        }}>
          <div style={{
            background: theme.surfacePrimary,
            border: `2px solid ${theme.accentPrimary}`,
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: `0 20px 60px rgba(0,0,0,0.3)`,
          }}>
            <h3 style={{
              color: theme.textPrimary,
              fontSize: '20px',
              fontWeight: '700',
              margin: '0 0 10px 0',
            }}>
              💾 Save Your Artwork
            </h3>
            <p style={{
              color: theme.textSecondary,
              fontSize: '13px',
              margin: '0 0 20px 0',
            }}>
              Save your masterpiece to your personal gallery
            </p>
            <input
              type="text"
              value={artTitle}
              onChange={(e) => setArtTitle(e.target.value)}
              placeholder="Give your artwork a title..."
              style={{
                width: '100%',
                padding: '12px',
                background: theme.background,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.textPrimary,
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                marginBottom: '20px',
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: theme.accentPrimary,
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                ✓ Save Artwork
              </button>
              <button
                onClick={() => setShowSavePrompt(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: theme.background,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.textPrimary,
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = theme.border}
                onMouseLeave={(e) => e.currentTarget.style.background = theme.background}
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaintCanvas;
