/**
 * ImageCropEditor.jsx
 * Admin page to crop, zoom, and position images
 * Allows fine-tuning how images appear in cards
 */

import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
  getAllCloudinaryImages,
} from '../services/cloudinaryAdminService';
import {
  getImageCropSettings,
  saveImageCropSettings,
  deleteImageCropSettings,
  DEFAULT_CROP_SETTINGS,
  validateCropSettings,
} from '../services/imageCropService';

const CARD_STYLE = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '16px',
};

const LABEL_STYLE = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '600',
  marginBottom: '6px',
  color: '#334155',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const INPUT_STYLE = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '13px',
  boxSizing: 'border-box',
  fontFamily: 'monospace',
};

const BUTTON_STYLE = {
  padding: '8px 16px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '13px',
  transition: 'all 0.2s ease',
};

const PRIMARY_BUTTON = {
  ...BUTTON_STYLE,
  background: '#6C63FF',
  color: '#ffffff',
};

const SECONDARY_BUTTON = {
  ...BUTTON_STYLE,
  background: '#f1f5f9',
  color: '#334155',
  border: '1px solid #cbd5e1',
};

const DANGER_BUTTON = {
  ...BUTTON_STYLE,
  background: '#fee2e2',
  color: '#991b1b',
  border: '1px solid #fca5a5',
};

export default function ImageCropEditor() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cropSettings, setCropSettings] = useState(DEFAULT_CROP_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const allImages = await getAllCloudinaryImages();
      setImages(allImages);
    } catch (err) {
      console.error('Error loading images:', err);
      setMessage({ type: 'error', text: 'Failed to load images' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = async (image) => {
    setSelectedImage(image);
    const settings = await getImageCropSettings(image.imageUrl);
    setCropSettings(settings);
    setMessage({ type: '', text: '' });
  };

  const handleSaveSettings = async () => {
    if (!selectedImage) return;

    const validation = validateCropSettings(cropSettings);
    if (!validation.valid) {
      setMessage({ type: 'error', text: validation.errors.join(', ') });
      return;
    }

    setSaving(true);
    try {
      await saveImageCropSettings(selectedImage.imageUrl, cropSettings);
      setMessage({ type: 'success', text: '✅ Settings saved successfully!' });
    } catch (err) {
      console.error('Error saving settings:', err);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSettings = async () => {
    if (!selectedImage) return;

    setSaving(true);
    try {
      await deleteImageCropSettings(selectedImage.imageUrl);
      setCropSettings(DEFAULT_CROP_SETTINGS);
      setMessage({ type: 'success', text: '✅ Settings reset to default' });
    } catch (err) {
      console.error('Error deleting settings:', err);
      setMessage({ type: 'error', text: 'Failed to reset settings' });
    } finally {
      setSaving(false);
    }
  };

  const filteredImages = images.filter(img =>
    img.originalName.toLowerCase().includes(filterText.toLowerCase()) ||
    img.imageUrl.toLowerCase().includes(filterText.toLowerCase())
  );

  const getPreviewStyle = () => {
    if (!cropSettings.enabled) {
      return {
        objectFit: 'cover',
        objectPosition: 'center',
      };
    }

    const posX = 50 + cropSettings.offsetX;
    const posY = 50 + cropSettings.offsetY;

    return {
      objectFit: cropSettings.cropMode === 'contain' ? 'contain' : 'cover',
      objectPosition: `${Math.max(0, Math.min(100, posX))}% ${Math.max(0, Math.min(100, posY))}%`,
      transform: `scale(${cropSettings.zoomLevel})`,
      transformOrigin: 'center',
    };
  };

  return (
    <AdminLayout title="🖼️ Image Crop Editor">
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#0b1220' }}>
            🖼️ Image Crop Editor
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Crop, zoom, and position images to optimize how they appear in cards. All settings are saved per image.
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '13px',
              fontWeight: '600',
              background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: message.type === 'success' ? '#15803d' : '#991b1b',
              border: `1px solid ${message.type === 'success' ? '#86efac' : '#fca5a5'}`,
            }}
          >
            {message.text}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Left: Image List */}
          <div>
            <div style={CARD_STYLE}>
              <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700' }}>
                📸 Select Image
              </h2>

              <input
                type="text"
                placeholder="Search images..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                style={{
                  ...INPUT_STYLE,
                  marginBottom: '12px',
                }}
              />

              <div style={{
                maxHeight: '500px',
                overflowY: 'auto',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
              }}>
                {filteredImages.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                    {loading ? 'Loading images...' : 'No images found'}
                  </div>
                ) : (
                  filteredImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleImageSelect(img)}
                      style={{
                        padding: '12px',
                        borderBottom: '1px solid #e2e8f0',
                        cursor: 'pointer',
                        background: selectedImage?.imageUrl === img.imageUrl ? '#ede9fe' : '#ffffff',
                        borderLeft: selectedImage?.imageUrl === img.imageUrl ? '3px solid #6C63FF' : '3px solid transparent',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f8fafc';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = selectedImage?.imageUrl === img.imageUrl ? '#ede9fe' : '#ffffff';
                      }}
                    >
                      {/* Image Thumbnail */}
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ddd',
                      }}>
                        <img
                          src={img.imageUrl}
                          alt={img.originalName}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>

                      {/* Image Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px', wordBreak: 'break-word' }}>
                          {img.originalName}
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>
                          📍 Used {img.usageCount}x in {img.usage?.length || 0} document{(img.usage?.length || 0) !== 1 ? 's' : ''}
                        </div>
                        <div style={{ fontSize: '9px', color: '#94a3b8', marginBottom: '4px' }}>
                          <span style={{ display: 'inline-block', backgroundColor: '#ecf0f1', padding: '2px 6px', borderRadius: '3px', marginRight: '4px' }}>
                            {img.source}
                          </span>
                        </div>
                        {img.usage && img.usage.length > 0 && (
                          <div style={{ fontSize: '9px', color: '#94a3b8', lineHeight: '1.3' }}>
                            {img.usage.slice(0, 1).map((u, i) => (
                              <div key={i}>• {u.type}: {u.itemName.substring(0, 25)}...</div>
                            ))}
                            {img.usage.length > 1 && <div>• +{img.usage.length - 1} more</div>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Editor */}
          {selectedImage ? (
            <div>
              {/* Image Context Summary */}
              <div style={CARD_STYLE}>
                <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700' }}>
                  📍 Image Usage Context
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  marginBottom: '16px',
                }}>
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '6px',
                    borderLeft: '3px solid #22c55e',
                  }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Used In</div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#16a34a' }}>
                      {selectedImage.usage?.length || selectedImage.usageCount || 0}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>Place{(selectedImage.usage?.length || selectedImage.usageCount || 0) !== 1 ? 's' : ''}</div>
                  </div>

                  <div style={{
                    padding: '12px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '6px',
                    borderLeft: '3px solid #f59e0b',
                  }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Source</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#92400e' }}>
                      {selectedImage.source}
                    </div>
                  </div>

                  <div style={{
                    padding: '12px',
                    backgroundColor: '#ede9fe',
                    borderRadius: '6px',
                    borderLeft: '3px solid #7c3aed',
                  }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>File Name</div>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#5b21b6', wordBreak: 'break-word' }}>
                      {selectedImage.originalName.substring(0, 20)}
                    </div>
                  </div>
                </div>

                {selectedImage.usage && selectedImage.usage.length > 0 && (
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                      COMPLETE USAGE LIST
                    </div>
                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                      {selectedImage.usage.map((usage, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '8px',
                            marginBottom: '6px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '4px',
                            borderLeft: '2px solid #3b82f6',
                            fontSize: '12px',
                          }}
                        >
                          <div style={{ fontWeight: '600', color: '#0b1220', marginBottom: '2px' }}>
                            {usage.itemName}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            <span style={{ marginRight: '8px' }}>📂 {usage.type}</span>
                            {usage.puzzleType && <span>🎮 {usage.puzzleType}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div style={CARD_STYLE}>
                <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700' }}>
                  👁️ Preview
                </h2>

                {/* Card Previews */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                    CARD PREVIEWS (Used in {selectedImage.usage?.length || 0} place{(selectedImage.usage?.length || 0) !== 1 ? 's' : ''})
                  </div>

                  {selectedImage.usage && selectedImage.usage.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                      {selectedImage.usage.map((usage, idx) => (
                        <div
                          key={idx}
                          style={{
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            background: '#f8fafc',
                          }}
                        >
                          {/* Image Preview */}
                          <div style={{
                            width: '100%',
                            height: '120px',
                            overflow: 'hidden',
                            borderBottom: '1px solid #e2e8f0',
                          }}>
                            <img
                              src={selectedImage.imageUrl}
                              alt={`usage ${idx}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                ...getPreviewStyle(),
                              }}
                            />
                          </div>

                          {/* Context Information */}
                          <div style={{ padding: '10px', fontSize: '12px' }}>
                            <div style={{ fontWeight: '600', color: '#0b1220', marginBottom: '4px', wordBreak: 'break-word' }}>
                              {usage.itemName}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>
                              <span style={{ display: 'block', marginBottom: '2px' }}>
                                <strong>Collection:</strong> {usage.type}
                              </span>
                              {usage.puzzleType && (
                                <span style={{ display: 'block', marginBottom: '2px' }}>
                                  <strong>Type:</strong> {usage.puzzleType}
                                </span>
                              )}
                              <span style={{ display: 'block' }}>
                                <strong>ID:</strong> {usage.itemId.substring(0, 12)}...
                              </span>
                            </div>
                            <a
                              href={`/admin?view=${usage.type}&id=${usage.itemId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-block',
                                marginTop: '6px',
                                padding: '4px 8px',
                                backgroundColor: '#6C63FF',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: '600',
                              }}
                            >
                              View Source →
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '6px' }}>
                      No usage information available
                    </div>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div style={CARD_STYLE}>
                <h2 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700' }}>
                  ⚙️ Controls
                </h2>

                {/* Enable/Disable */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={cropSettings.enabled}
                      onChange={(e) => setCropSettings({ ...cropSettings, enabled: e.target.checked })}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                      Enable Custom Crop Settings
                    </span>
                  </label>
                </div>

                {cropSettings.enabled && (
                  <>
                    {/* Crop Mode */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={LABEL_STYLE}>Crop Mode</label>
                      <select
                        value={cropSettings.cropMode}
                        onChange={(e) => setCropSettings({ ...cropSettings, cropMode: e.target.value })}
                        style={INPUT_STYLE}
                      >
                        <option value="cover">Cover (Fill) - Crops image to fit</option>
                        <option value="contain">Contain (Fit) - Shows full image</option>
                        <option value="custom">Custom - Use zoom & position</option>
                      </select>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                        {cropSettings.cropMode === 'cover' && '✓ Image fills card, edges may be cropped'}
                        {cropSettings.cropMode === 'contain' && '✓ Full image visible, may have gaps'}
                        {cropSettings.cropMode === 'custom' && '✓ Use zoom & position controls below'}
                      </div>
                    </div>

                    {/* Zoom Level */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={LABEL_STYLE}>
                        🔍 Zoom Level: {cropSettings.zoomLevel.toFixed(2)}x
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={cropSettings.zoomLevel}
                        onChange={(e) => setCropSettings({ ...cropSettings, zoomLevel: parseFloat(e.target.value) })}
                        style={{
                          width: '100%',
                          marginBottom: '8px',
                        }}
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                        {[0.5, 1.0, 1.3, 1.6, 2.0].map(val => (
                          <button
                            key={val}
                            onClick={() => setCropSettings({ ...cropSettings, zoomLevel: val })}
                            style={{
                              ...SECONDARY_BUTTON,
                              background: cropSettings.zoomLevel === val ? '#6C63FF' : '#f1f5f9',
                              color: cropSettings.zoomLevel === val ? '#ffffff' : '#334155',
                              padding: '6px 8px',
                              fontSize: '12px',
                            }}
                          >
                            {val}x
                          </button>
                        ))}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
                        Lower = show more area | Higher = zoom in on center
                      </div>
                    </div>

                    {/* Horizontal Offset */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={LABEL_STYLE}>
                        📍 Horizontal Position (X): {cropSettings.offsetX}px
                      </label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        step="5"
                        value={cropSettings.offsetX}
                        onChange={(e) => setCropSettings({ ...cropSettings, offsetX: parseInt(e.target.value) })}
                        style={{ width: '100%', marginBottom: '8px' }}
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        <button
                          onClick={() => setCropSettings({ ...cropSettings, offsetX: Math.max(-50, cropSettings.offsetX - 10) })}
                          style={{ ...SECONDARY_BUTTON, padding: '6px 8px' }}
                        >
                          ← Left
                        </button>
                        <button
                          onClick={() => setCropSettings({ ...cropSettings, offsetX: 0 })}
                          style={{ ...SECONDARY_BUTTON, padding: '6px 8px' }}
                        >
                          ↔ Center
                        </button>
                        <button
                          onClick={() => setCropSettings({ ...cropSettings, offsetX: Math.min(50, cropSettings.offsetX + 10) })}
                          style={{ ...SECONDARY_BUTTON, padding: '6px 8px' }}
                        >
                          Right →
                        </button>
                      </div>
                    </div>

                    {/* Vertical Offset */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={LABEL_STYLE}>
                        📍 Vertical Position (Y): {cropSettings.offsetY}px
                      </label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        step="5"
                        value={cropSettings.offsetY}
                        onChange={(e) => setCropSettings({ ...cropSettings, offsetY: parseInt(e.target.value) })}
                        style={{ width: '100%', marginBottom: '8px' }}
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        <button
                          onClick={() => setCropSettings({ ...cropSettings, offsetY: Math.max(-50, cropSettings.offsetY - 10) })}
                          style={{ ...SECONDARY_BUTTON, padding: '6px 8px' }}
                        >
                          ↑ Up
                        </button>
                        <button
                          onClick={() => setCropSettings({ ...cropSettings, offsetY: 0 })}
                          style={{ ...SECONDARY_BUTTON, padding: '6px 8px' }}
                        >
                          ↕ Center
                        </button>
                        <button
                          onClick={() => setCropSettings({ ...cropSettings, offsetY: Math.min(50, cropSettings.offsetY + 10) })}
                          style={{ ...SECONDARY_BUTTON, padding: '6px 8px' }}
                        >
                          Down ↓
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    style={{
                      ...PRIMARY_BUTTON,
                      opacity: saving ? 0.7 : 1,
                      cursor: saving ? 'not-allowed' : 'pointer',
                      flex: 1,
                    }}
                  >
                    {saving ? '⏳ Saving...' : '✅ Save Settings'}
                  </button>
                  <button
                    onClick={handleDeleteSettings}
                    disabled={saving}
                    style={{
                      ...DANGER_BUTTON,
                      opacity: saving ? 0.7 : 1,
                      cursor: saving ? 'not-allowed' : 'pointer',
                    }}
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={CARD_STYLE}>
              <div style={{ textAlign: 'center', color: '#64748b', padding: '40px 20px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  👈 Select an image to begin
                </p>
                <p style={{ fontSize: '12px' }}>
                  Choose an image from the list to adjust its crop, zoom, and position settings
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
