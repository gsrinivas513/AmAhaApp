import React, { useState, useEffect } from 'react';

/**
 * ResponsiveQuizContainer - Wraps quiz player for mobile responsiveness
 * Handles responsive layout, touch interactions, and screen size adaptations
 */
export default function ResponsiveQuizContainer({
  children,
  theme,
  isMobile = false,
}) {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const [orientation, setOrientation] = useState(
    typeof window !== 'undefined' && window.innerWidth < window.innerHeight
      ? 'portrait'
      : 'landscape'
  );

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      setScreenSize({ width: newWidth, height: newHeight });
      setOrientation(newWidth < newHeight ? 'portrait' : 'landscape');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive breakpoints
  const breakpoints = {
    isMobile: screenSize.width < 768,
    isTablet: screenSize.width >= 768 && screenSize.width < 1024,
    isDesktop: screenSize.width >= 1024,
  };

  // Calculate responsive dimensions
  const getResponsivePadding = () => {
    if (breakpoints.isMobile) return '12px';
    if (breakpoints.isTablet) return '16px';
    return '20px';
  };

  const getResponsiveFontSize = (baseSize) => {
    if (breakpoints.isMobile) return `${baseSize * 0.85}px`;
    if (breakpoints.isTablet) return `${baseSize * 0.95}px`;
    return `${baseSize}px`;
  };

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    maxWidth: breakpoints.isMobile ? '100%' : '1200px',
    margin: '0 auto',
    padding: getResponsivePadding(),
    backgroundColor: theme.background,
    color: theme.text,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    transition: 'all 0.3s ease',
    overflowX: 'hidden',
  };

  const contentStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    fontSize: getResponsiveFontSize(16),
  };

  return (
    <div style={containerStyles}>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=no"
      />
      <div style={contentStyles}>
        {React.cloneElement(children, {
          breakpoints,
          screenSize,
          orientation,
          getResponsivePadding,
          getResponsiveFontSize,
        })}
      </div>
    </div>
  );
}
