import React from 'react';
import AmAhaLogoSVG from '../amaha-logo.svg';

/**
 * AmAha Logo Component
 * 
 * Usage:
 * <AmAhaLogo size="header" />      // 120px - for navbar/header
 * <AmAhaLogo size="large" />       // 240px - for hero sections
 * <AmAhaLogo size="medium" />      // 160px - for cards
 * <AmAhaLogo size="small" />       // 80px - for icons
 * <AmAhaLogo size="icon" />        // 48px - for favicon/app icon
 * <AmAhaLogo className="custom" /> // custom sizing
 * 
 * @param {string} size - Logo size: 'icon', 'small', 'medium', 'header', 'large'
 * @param {string} className - Additional CSS classes
 * @param {boolean} responsive - Use responsive sizing (default: true)
 */
export default function AmAhaLogo({ 
  size = 'header', 
  className = '', 
  responsive = true,
  alt = 'AmAha Logo'
}) {
  const sizeClasses = {
    icon: 'h-12 w-12',           // 48px
    small: 'h-20 w-20',          // 80px
    medium: 'h-40 w-40',         // 160px
    header: 'h-16 w-16 md:h-20 md:w-20',  // 64px -> 80px responsive
    large: 'h-60 w-60 md:h-80 md:w-80',   // 240px -> 320px responsive
  };

  const sizeInlineStyles = {
    icon: { height: '48px', width: '48px' },
    small: { height: '80px', width: '80px' },
    medium: { height: '160px', width: '160px' },
    header: responsive ? {} : { height: '120px', width: '120px' },
    large: responsive ? {} : { height: '240px', width: '240px' },
  };

  const finalClasses = responsive ? sizeClasses[size] : '';
  const finalStyles = responsive ? {} : sizeInlineStyles[size];

  return (
    <img
      src={AmAhaLogoSVG}
      alt={alt}
      className={`${finalClasses} ${className}`.trim()}
      style={{
        objectFit: 'contain',
        objectPosition: 'center',
        ...finalStyles,
      }}
    />
  );
}
