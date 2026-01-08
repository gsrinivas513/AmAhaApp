import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
  getSeriesBranding,
  updateSeriesBranding,
  setThemeColors,
  setBannerImage,
  setLogoImage,
  clearSeriesBranding,
  validateBranding,
} from '../services/seriesBrandingService';
import { getAllSeries } from '../services/seriesService';
import './styles/branding-editor.css';

const SeriesBrandingEditor = () => {
  // State management
  const [series, setSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [theme, setTheme] = useState('light');

  // Form state
  const [formData, setFormData] = useState({
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    accentColor: '#ff6b6b',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    bannerImage: '',
    logoImage: '',
    customCSS: '',
  });

  const [previewBannerImage, setPreviewBannerImage] = useState(null);
  const [previewLogoImage, setPreviewLogoImage] = useState(null);

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  // Load all series on mount
  useEffect(() => {
    loadSeries();
  }, []);

  // Load selected series branding
  useEffect(() => {
    if (selectedSeries) {
      loadSeriesBranding(selectedSeries.id);
    }
  }, [selectedSeries]);

  // Load series list
  const loadSeries = async () => {
    try {
      setLoading(true);
      const seriesList = await getAllSeries();
      setSeries(seriesList);
      if (seriesList.length > 0) {
        setSelectedSeries(seriesList[0]);
      }
    } catch (err) {
      console.error('Error loading series:', err);
      setError('Failed to load series');
    } finally {
      setLoading(false);
    }
  };

  // Load branding for selected series
  const loadSeriesBranding = async (seriesId) => {
    try {
      setLoading(true);
      const brandingData = await getSeriesBranding(seriesId);
      setBranding(brandingData);
      setFormData({
        primaryColor: brandingData.primaryColor || '#000000',
        secondaryColor: brandingData.secondaryColor || '#ffffff',
        accentColor: brandingData.accentColor || '#ff6b6b',
        backgroundColor: brandingData.backgroundColor || '#ffffff',
        textColor: brandingData.textColor || '#333333',
        bannerImage: brandingData.bannerImage || '',
        logoImage: brandingData.logoImage || '',
        customCSS: brandingData.customCSS || '',
      });
      setPreviewBannerImage(brandingData.bannerImage);
      setPreviewLogoImage(brandingData.logoImage);
    } catch (err) {
      console.error('Error loading branding:', err);
      setError('Failed to load branding');
    } finally {
      setLoading(false);
    }
  };

  // Handle color changes
  const handleColorChange = (colorType, value) => {
    setFormData((prev) => ({
      ...prev,
      [colorType]: value,
    }));
  };

  // Handle image input changes
  const handleImageInputChange = (imageType, value) => {
    setFormData((prev) => ({
      ...prev,
      [imageType]: value,
    }));
    if (imageType === 'bannerImage') {
      setPreviewBannerImage(value);
    } else if (imageType === 'logoImage') {
      setPreviewLogoImage(value);
    }
  };

  // Handle CSS changes
  const handleCustomCSSChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      customCSS: value,
    }));
  };

  // Save branding
  const handleSaveBranding = async () => {
    if (!selectedSeries) {
      setError('No series selected');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Validate branding
      const validation = validateBranding(formData);
      if (!validation.isValid) {
        setError(`Validation errors: ${validation.errors.join(', ')}`);
        return;
      }

      // Update branding
      await updateSeriesBranding(selectedSeries.id, {
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        accentColor: formData.accentColor,
        backgroundColor: formData.backgroundColor,
        textColor: formData.textColor,
        bannerImage: formData.bannerImage,
        logoImage: formData.logoImage,
        customCSS: formData.customCSS,
      });

      setSuccess('Branding saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving branding:', err);
      setError('Failed to save branding');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default
  const handleResetBranding = async () => {
    if (!selectedSeries) return;

    if (!window.confirm('Are you sure? This will reset branding to default.')) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await clearSeriesBranding(selectedSeries.id);
      await loadSeriesBranding(selectedSeries.id);
      setSuccess('Branding reset to default');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error resetting branding:', err);
      setError('Failed to reset branding');
    } finally {
      setSaving(false);
    }
  };

  // Cancel changes
  const handleCancel = () => {
    if (selectedSeries) {
      loadSeriesBranding(selectedSeries.id);
    }
  };

  if (!selectedSeries && loading) {
    return (
      <AdminLayout>
        <div className="branding-editor loading">
          <div className="spinner">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={`branding-editor ${theme}`}>
        {/* Header */}
        <div className="branding-header">
          <h1>🎨 Series Branding Editor</h1>
          <p>Customize colors, images, and styling for each series</p>
        </div>

        {/* Content */}
        <div className="branding-content">
          {/* Series Selector - Left Panel */}
          <div className="series-selector-panel">
            <h2>Series</h2>
            <div className="series-list">
              {series.map((s) => (
                <div
                  key={s.id}
                  className={`series-item ${selectedSeries?.id === s.id ? 'active' : ''}`}
                  onClick={() => setSelectedSeries(s)}
                >
                  <div className="series-info">
                    <h3>{s.name}</h3>
                    <p>{s.description}</p>
                  </div>
                  {selectedSeries?.id === s.id && <div className="active-indicator">✓</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Editor Panel - Right */}
          {selectedSeries && (
            <div className="editor-panel">
              {/* Messages */}
              {error && <div className="message error">{error}</div>}
              {success && <div className="message success">{success}</div>}

              {/* Color Customization Section */}
              <div className="section">
                <h2>🎨 Colors</h2>
                <div className="color-grid">
                  {/* Primary Color */}
                  <div className="color-picker-group">
                    <label>Primary Color</label>
                    <div className="color-input-container">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div className="color-picker-group">
                    <label>Secondary Color</label>
                    <div className="color-input-container">
                      <input
                        type="color"
                        value={formData.secondaryColor}
                        onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor}
                        onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div className="color-picker-group">
                    <label>Accent Color</label>
                    <div className="color-input-container">
                      <input
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      />
                      <input
                        type="text"
                        value={formData.accentColor}
                        onChange={(e) => handleColorChange('accentColor', e.target.value)}
                        placeholder="#ff6b6b"
                      />
                    </div>
                  </div>

                  {/* Background Color */}
                  <div className="color-picker-group">
                    <label>Background Color</label>
                    <div className="color-input-container">
                      <input
                        type="color"
                        value={formData.backgroundColor}
                        onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                      />
                      <input
                        type="text"
                        value={formData.backgroundColor}
                        onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="color-picker-group">
                    <label>Text Color</label>
                    <div className="color-input-container">
                      <input
                        type="color"
                        value={formData.textColor}
                        onChange={(e) => handleColorChange('textColor', e.target.value)}
                      />
                      <input
                        type="text"
                        value={formData.textColor}
                        onChange={(e) => handleColorChange('textColor', e.target.value)}
                        placeholder="#333333"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="section">
                <h2>🖼️ Images</h2>

                {/* Banner Image */}
                <div className="image-upload-group">
                  <label>Banner Image URL</label>
                  <input
                    type="text"
                    value={formData.bannerImage}
                    onChange={(e) => handleImageInputChange('bannerImage', e.target.value)}
                    placeholder="https://cloudinary.com/..."
                  />
                  {previewBannerImage && (
                    <div className="image-preview">
                      <img src={previewBannerImage} alt="Banner preview" />
                    </div>
                  )}
                </div>

                {/* Logo Image */}
                <div className="image-upload-group">
                  <label>Logo Image URL</label>
                  <input
                    type="text"
                    value={formData.logoImage}
                    onChange={(e) => handleImageInputChange('logoImage', e.target.value)}
                    placeholder="https://cloudinary.com/..."
                  />
                  {previewLogoImage && (
                    <div className="image-preview logo-preview">
                      <img src={previewLogoImage} alt="Logo preview" />
                    </div>
                  )}
                </div>
              </div>

              {/* Custom CSS Section */}
              <div className="section">
                <h2>💻 Custom CSS (Advanced)</h2>
                <textarea
                  value={formData.customCSS}
                  onChange={(e) => handleCustomCSSChange(e.target.value)}
                  placeholder="/* Optional custom CSS for this series */"
                  rows="6"
                />
              </div>

              {/* Preview Section */}
              <div className="section preview-section">
                <h2>👁️ Preview</h2>
                <div className="preview-container">
                  <div
                    className="preview-box"
                    style={{
                      backgroundColor: formData.backgroundColor,
                      color: formData.textColor,
                      borderColor: formData.primaryColor,
                    }}
                  >
                    <div className="preview-header" style={{ backgroundColor: formData.primaryColor }}>
                      {previewLogoImage && <img src={previewLogoImage} alt="Logo" className="preview-logo" />}
                      <h3>Series: {selectedSeries.name}</h3>
                    </div>

                    {previewBannerImage && (
                      <img src={previewBannerImage} alt="Banner" className="preview-banner" />
                    )}

                    <div className="preview-content">
                      <button style={{ backgroundColor: formData.accentColor, color: '#fff' }}>
                        Sample Button
                      </button>
                      <p style={{ color: formData.textColor }}>Sample text with your text color</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="section actions">
                <button className="btn btn-primary" onClick={handleSaveBranding} disabled={saving}>
                  {saving ? '💾 Saving...' : '💾 Save Branding'}
                </button>
                <button className="btn btn-secondary" onClick={handleCancel}>
                  ↺ Cancel
                </button>
                <button className="btn btn-danger" onClick={handleResetBranding} disabled={saving}>
                  🔄 Reset to Default
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SeriesBrandingEditor;
