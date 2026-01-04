import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { saveArtwork, generateId } from './services/ArtStorageService';

const PaintCanvas = () => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(20);
  const [history, setHistory] = useState([]);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [artTitle, setArtTitle] = useState('');

  const COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#FF69B4', '#000000', '#FFFFFF'];
  const BRUSH_SIZES = [10, 15, 20, 30, 40, 50];

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 40;
    canvas.height = window.innerHeight - 200;

    const context = canvas.getContext('2d');
    context.fillStyle = '#F0F0F0';
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
      canvas.height = window.innerHeight - 200;
      const newContext = canvas.getContext('2d');
      newContext.fillStyle = '#F0F0F0';
      newContext.fillRect(0, 0, canvas.width, canvas.height);
      newContext.drawImage(tempCanvas, 0, 0);
      contextRef.current = newContext;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();
    setHistory(prev => [...prev, imageData]);
  };

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = contextRef.current;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.8;

    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
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

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#F0F0F0';
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

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.background,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Toolbar */}
      <div style={{
        background: theme.surfacePrimary,
        border: `2px solid ${theme.border}`,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
      }}>
        {/* Color Picker */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: '40px',
                height: '40px',
                background: c,
                border: color === c ? `4px solid ${theme.textPrimary}` : `2px solid ${theme.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        {/* Brush Size */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ color: theme.textPrimary, fontSize: '14px', fontWeight: '600' }}>
            🖌️ Size:
          </label>
          <select
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            style={{
              padding: '8px 12px',
              background: theme.background,
              border: `2px solid ${theme.border}`,
              borderRadius: '6px',
              color: theme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {BRUSH_SIZES.map(size => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button
            onClick={handleUndo}
            style={{
              padding: '12px 16px',
              background: theme.background,
              border: `2px solid ${theme.border}`,
              borderRadius: '8px',
              color: theme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            ↩️ Undo
          </button>
          <button
            onClick={handleClear}
            style={{
              padding: '12px 16px',
              background: '#FF6B6B',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            🗑️ Clear
          </button>
          <button
            onClick={() => setShowSavePrompt(true)}
            style={{
              padding: '12px 16px',
              background: '#4ECDC4',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            💾 Save
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          flex: 1,
          background: '#F0F0F0',
          border: `2px solid ${theme.border}`,
          borderRadius: '12px',
          cursor: 'crosshair',
          touchAction: 'none',
        }}
      />

      {/* Save Prompt */}
      {showSavePrompt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: theme.surfacePrimary,
            border: `2px solid ${theme.border}`,
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
          }}>
            <h3 style={{
              color: theme.textPrimary,
              fontSize: '20px',
              fontWeight: '700',
              margin: '0 0 16px 0',
            }}>
              💾 Save Your Artwork
            </h3>
            <input
              type="text"
              value={artTitle}
              onChange={(e) => setArtTitle(e.target.value)}
              placeholder="Enter artwork title..."
              style={{
                width: '100%',
                padding: '12px',
                background: theme.background,
                border: `2px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.textPrimary,
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                marginBottom: '16px',
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#4ECDC4',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
              <button
                onClick={() => setShowSavePrompt(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: theme.background,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.textPrimary,
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaintCanvas;
