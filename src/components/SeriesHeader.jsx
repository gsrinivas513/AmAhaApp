import React, { useState, useEffect } from 'react';
import { getSeriesBranding, generateBrandingStyles } from '../services/seriesBrandingService';
import '../styles/series-header.css';

const SeriesHeader = ({ series, showLogo = true, showBanner = true, showTitle = true }) => {
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

  if (loading) {
    return <div className="series-header loading">Loading...</div>;
  }

  const headerStyle = branding
    ? {
        backgroundColor: branding.primaryColor,
        color: branding.textColor,
        ...generateBrandingStyles(branding),
      }
    : {};

  const bannerStyle = branding && branding.bannerImage
    ? {
        backgroundImage: `url(${branding.bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};

  return (
    <div className={`series-header ${branding ? `branded-${series.id}` : 'default'}`} style={headerStyle}>
      {/* Banner Image */}
      {showBanner && branding?.bannerImage && (
        <div className="series-banner" style={bannerStyle}>
          <div className="banner-overlay" />
        </div>
      )}

      {/* Header Content */}
      <div className="series-header-content">
        {/* Logo */}
        {showLogo && branding?.logoImage && (
          <img src={branding.logoImage} alt={`${series.name} logo`} className="series-logo" />
        )}

        {/* Title & Description */}
        {showTitle && (
          <div className="series-info">
            <h1>{series.name}</h1>
            {series.description && <p>{series.description}</p>}
          </div>
        )}
      </div>

      {/* Custom CSS if present */}
      {branding?.customCSS && (
        <style>{`
          .series-header.branded-${series.id} {
            ${branding.customCSS}
          }
        `}</style>
      )}
    </div>
  );
};

export default SeriesHeader;
