import React, { useState, useEffect } from 'react';
import { getSeriesBranding, generateBrandingStyles } from '../services/seriesBrandingService';
import '../styles/series-branded-card.css';

const SeriesBrandedCard = ({ series, onSelect, isSelected = false }) => {
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (series && series.id) {
      loadBranding(series.id);
    }
  }, [series]);

  const loadBranding = async (seriesId) => {
    try {
      const brandingData = await getSeriesBranding(seriesId);
      setBranding(brandingData);
    } catch (error) {
      console.error('Error loading branding:', error);
      setBranding(null);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = branding
    ? {
        backgroundColor: branding.backgroundColor,
        color: branding.textColor,
        borderColor: branding.primaryColor,
        borderWidth: '2px',
        ...generateBrandingStyles(branding),
      }
    : {};

  const headerStyle = branding
    ? {
        backgroundColor: branding.primaryColor,
        backgroundImage: branding.bannerImage ? `url(${branding.bannerImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};

  const buttonStyle = branding
    ? {
        backgroundColor: branding.accentColor,
        color: branding.backgroundColor,
      }
    : {};

  const puzzleCount = series.puzzleIds ? series.puzzleIds.length : 0;

  return (
    <div
      className={`series-card ${branding ? `branded-${series.id}` : 'default'} ${isSelected ? 'selected' : ''} ${
        loading ? 'loading' : ''
      }`}
      style={cardStyle}
      onClick={() => onSelect && onSelect(series)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect && onSelect(series);
        }
      }}
    >
      {/* Card Header with Banner/Logo */}
      <div className="card-header" style={headerStyle}>
        {branding?.logoImage && <img src={branding.logoImage} alt={`${series.name} logo`} className="card-logo" />}
        {branding?.bannerImage && <div className="banner-overlay" />}
      </div>

      {/* Card Content */}
      <div className="card-content">
        <h3>{series.name}</h3>
        {series.description && (
          <p className="description">
            {series.description.length > 80
              ? `${series.description.substring(0, 80)}...`
              : series.description}
          </p>
        )}

        {/* Stats */}
        <div className="card-stats">
          <div className="stat">
            <span className="stat-label">Puzzles</span>
            <span className="stat-value">{puzzleCount}</span>
          </div>
        </div>

        {/* Action Button */}
        <button className="card-action" style={buttonStyle}>
          {isSelected ? '✓ Selected' : 'Select Series'}
        </button>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="selection-badge">
          <span>✓</span>
        </div>
      )}

      {/* Custom CSS */}
      {branding?.customCSS && (
        <style>{`
          .series-card.branded-${series.id} {
            ${branding.customCSS}
          }
        `}</style>
      )}
    </div>
  );
};

export default SeriesBrandedCard;
