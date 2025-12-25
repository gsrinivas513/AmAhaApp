// src/components/OptimizedImage.jsx
import React, { useState } from 'react';
import { getCloudinaryUrl, IMAGE_SIZES } from '../config/cloudinaryConfig';

/**
 * OptimizedImage Component
 * 
 * Automatically serves optimized images using Cloudinary CDN
 * Falls back to direct URL if not a Cloudinary image
 * Supports responsive sizes, lazy loading, and image cropping/zoom
 */
export default function OptimizedImage({ 
  src, 
  cloudinaryId, 
  alt, 
  size = 'CARD_DESKTOP',
  crop,
  imageZoom = 1,
  imageOffsetX = 0,
  imageOffsetY = 0,
  className = '',
  style = {},
  loading = 'lazy',
  fallbackIcon = '🖼️',
  ...props 
}) {
  const [imageError, setImageError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Get size configuration
  const sizeConfig = IMAGE_SIZES[size] || IMAGE_SIZES.CARD_DESKTOP;
  // Allow override crop
  const options = crop ? { ...sizeConfig, crop } : sizeConfig;
  // Generate optimized URL if cloudinaryId exists
  const imageUrl = cloudinaryId 
    ? getCloudinaryUrl(cloudinaryId, options)
    : src;

  // If image failed to load, show fallback
  if (imageError || !imageUrl) {
    return (
      <div 
        className={className}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: sizeConfig.width > 100 ? '3rem' : '1.5rem',
        }}
        {...props}
      >
        {fallbackIcon}
      </div>
    );
  }

  return (
    <div 
      className={className}
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden',
      }}
      {...props}
    >
      {/* Loading placeholder */}
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      )}
      
      <img
        src={imageUrl}
        alt={alt}
        loading={loading}
        onLoad={() => setLoaded(true)}
        onError={() => setImageError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: crop === 'contain' ? 'contain' : 'cover',
          transform: `scale(${imageZoom}) translate(${imageOffsetX}px, ${imageOffsetY}px)`,
          background: '#fff',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </div>
  );
}

/**
 * Responsive Image with srcset for different screen sizes
 */
export function ResponsiveImage({ 
  src, 
  cloudinaryId, 
  alt, 
  className = '',
  style = {},
  fallbackIcon = '🖼️',
  ...props 
}) {
  const [imageError, setImageError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Generate srcset for responsive images
  const getSrcSet = () => {
    if (!cloudinaryId) return undefined;
    
    return [
      `${getCloudinaryUrl(cloudinaryId, IMAGE_SIZES.CARD_MOBILE)} 200w`,
      `${getCloudinaryUrl(cloudinaryId, IMAGE_SIZES.CARD_TABLET)} 300w`,
      `${getCloudinaryUrl(cloudinaryId, IMAGE_SIZES.CARD_DESKTOP)} 400w`,
    ].join(', ');
  };

  const sizes = "(max-width: 640px) 200px, (max-width: 1024px) 300px, 400px";

  if (imageError || (!cloudinaryId && !src)) {
    return (
      <div 
        className={className}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '3rem',
        }}
        {...props}
      >
        {fallbackIcon}
      </div>
    );
  }

  return (
    <div 
      className={className}
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden',
      }}
      {...props}
    >
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      )}
      
      <img
        src={cloudinaryId ? getCloudinaryUrl(cloudinaryId, IMAGE_SIZES.CARD_DESKTOP) : src}
        srcSet={getSrcSet()}
        sizes={sizes}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setImageError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </div>
  );
}

// Add shimmer animation to global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
}
