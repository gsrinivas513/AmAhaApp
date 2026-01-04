import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { saveArtwork, generateId } from './services/ArtStorageService';

const DigitalArt = () => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const [stickers, setStickers] = useState([]);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [artTitle, setArtTitle] = useState('');
  const dragOffset = useRef({ x: 0, y: 0 });

  const STICKER_SET = [
    { id: 'star', icon: '⭐', label: 'Star' },
    { id: 'heart', icon: '❤️', label: 'Heart' },
    { id: 'flower', icon: '🌸', label: 'Flower' },
    { id: 'tree', icon: '🌳', label: 'Tree' },
    { id: 'sun', icon: '☀️', label: 'Sun' },
    { id: 'cloud', icon: '☁️', label: 'Cloud' },
    { id: 'moon', icon: '🌙', label: 'Moon' },
    { id: 'butterfly', icon: '🦋', label: 'Butterfly' },
    { id: 'smile', icon: '😊', label: 'Smile' },
    { id: 'rainbow', icon: '🌈', label: 'Rainbow' },
  ];

  const addSticker = (stickerId) => {
    const sticker = {
      id: Date.now(),
      type: stickerId,
      x: 100,
      y: 100,
      scale: 1,
      rotation: 0,
    };
    setStickers([...stickers, sticker]);
    setSelectedSticker(sticker.id);
  };

  const updateSticker = (stickerId, updates) => {
    setStickers(stickers.map(s => s.id === stickerId ? { ...s, ...updates } : s));
  };

  const deleteSticker = (stickerId) => {
    setStickers(stickers.filter(s => s.id !== stickerId));
    if (selectedSticker === stickerId) setSelectedSticker(null);
  };

  const handleCanvasDrag = (e) => {
    if (!selectedSticker) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const sticker = stickers.find(s => s.id === selectedSticker);
    if (sticker) {
      updateSticker(selectedSticker, { x, y });
    }
  };

  const handleStickerMouseDown = (e, stickerId) => {
    e.preventDefault();
    setSelectedSticker(stickerId);
  };

  const handleClear = () => {
    setStickers([]);
    setSelectedSticker(null);
  };

  const handleSave = async () => {
    if (!artTitle.trim()) {
      alert('Please enter a title for your artwork!');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#F0F0F0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stickers.forEach(sticker => {
      const stickerData = STICKER_SET.find(s => s.id === sticker.type);
      ctx.font = `${40 * sticker.scale}px Arial`;
      ctx.save();
      ctx.translate(sticker.x, sticker.y);
      ctx.rotate((sticker.rotation * Math.PI) / 180);
      ctx.fillText(stickerData.icon, 0, 0);
      ctx.restore();
    });

    const imageData = canvas.toDataURL('image/png');

    const artwork = {
      id: generateId(),
      title: artTitle,
      imageData,
      type: 'digital-art',
      createdAt: new Date().toISOString(),
    };

    saveArtwork(artwork);
    alert('🎨 Artwork saved!');
    setShowSavePrompt(false);
    setArtTitle('');
  };

  const getSelectedStickerData = () => stickers.find(s => s.id === selectedSticker);

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
      }}>
        {/* Sticker Buttons */}
        <p style={{
          color: theme.textPrimary,
          fontSize: '12px',
          fontWeight: '600',
          margin: '0 0 12px 0',
          textTransform: 'uppercase',
        }}>
          Add Stickers:
        </p>
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '16px',
        }}>
          {STICKER_SET.map(sticker => (
            <button
              key={sticker.id}
              onClick={() => addSticker(sticker.id)}
              title={sticker.label}
              style={{
                width: '50px',
                height: '50px',
                background: theme.background,
                border: `2px solid ${theme.border}`,
                borderRadius: '8px',
                fontSize: '28px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {sticker.icon}
            </button>
          ))}
        </div>

        {/* Selected Sticker Controls */}
        {selectedSticker && getSelectedStickerData() && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            paddingTop: '16px',
            borderTop: `1px solid ${theme.border}`,
          }}>
            <div>
              <label style={{
                color: theme.textPrimary,
                fontSize: '12px',
                fontWeight: '600',
                display: 'block',
                marginBottom: '6px',
              }}>
                Size:
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={getSelectedStickerData().scale}
                onChange={(e) => updateSticker(selectedSticker, { scale: parseFloat(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{
                color: theme.textPrimary,
                fontSize: '12px',
                fontWeight: '600',
                display: 'block',
                marginBottom: '6px',
              }}>
                Rotation:
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={getSelectedStickerData().rotation}
                onChange={(e) => updateSticker(selectedSticker, { rotation: parseFloat(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
            <button
              onClick={() => deleteSticker(selectedSticker)}
              style={{
                padding: '8px 16px',
                background: '#FF6B6B',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                height: 'fit-content',
                marginTop: 'auto',
              }}
            >
              🗑️ Delete
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: `1px solid ${theme.border}`,
        }}>
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
              marginLeft: 'auto',
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
        width={800}
        height={600}
        onMouseMove={handleCanvasDrag}
        onClick={(e) => {
          const rect = canvasRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          let clickedSticker = null;
          for (let i = stickers.length - 1; i >= 0; i--) {
            const s = stickers[i];
            if (Math.abs(x - s.x) < 30 && Math.abs(y - s.y) < 30) {
              clickedSticker = s.id;
              break;
            }
          }

          setSelectedSticker(clickedSticker);
        }}
        style={{
          flex: 1,
          background: '#F0F0F0',
          border: `2px solid ${theme.border}`,
          borderRadius: '12px',
          cursor: 'grab',
          maxWidth: '100%',
          display: 'block',
        }}
      />

      {/* Stickers Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      >
        {stickers.map(sticker => {
          const stickerData = STICKER_SET.find(s => s.id === sticker.type);
          const rect = canvasRef.current?.getBoundingClientRect();
          if (!rect) return null;

          return (
            <div
              key={sticker.id}
              onMouseDown={(e) => handleStickerMouseDown(e, sticker.id)}
              style={{
                position: 'fixed',
                left: `${rect.left + sticker.x}px`,
                top: `${rect.top + sticker.y}px`,
                fontSize: `${40 * sticker.scale}px`,
                transform: `rotate(${sticker.rotation}deg)`,
                cursor: selectedSticker === sticker.id ? 'grabbing' : 'grab',
                pointerEvents: 'auto',
                userSelect: 'none',
                border: selectedSticker === sticker.id ? '2px solid #4ECDC4' : 'none',
                borderRadius: '8px',
              }}
            >
              {stickerData?.icon}
            </div>
          );
        })}
      </div>

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

export default DigitalArt;
