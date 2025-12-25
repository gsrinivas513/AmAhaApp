import React from 'react';
import AmAhaLogoSVG from '../amaha-logo.svg';

/**
 * AmAha Logo Component
 * 
 * The new logo is horizontal with brain mascot + text (420×120 aspect ratio)
 * 
 * Usage:
 * <AmAhaLogo size="header" />      // 210px - for navbar/header
 * <AmAhaLogo size="large" />       // 336px - for hero sections
 * <AmAhaLogo size="medium" />      // 280px - for cards
 * <AmAhaLogo size="small" />       // 140px - for smaller areas
 * <AmAhaLogo className="custom" /> // custom sizing
 * 
 * @param {string} size - Logo size: 'small', 'medium', 'header', 'large'
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
    small: 'h-16 w-auto',          // 64px height, auto width (3.5x width:height ratio)
    medium: 'h-24 w-auto',         // 96px height
    header: 'h-14 w-auto md:h-16 md:w-auto',  // 56px -> 64px responsive
    large: 'h-32 w-auto md:h-40 md:w-auto',   // 128px -> 160px responsive
  };

  const sizeInlineStyles = {
    small: { height: '64px', width: 'auto' },
    medium: { height: '96px', width: 'auto' },
    header: responsive ? {} : { height: '56px', width: 'auto' },
    large: responsive ? {} : { height: '128px', width: 'auto' },
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
