/**
 * Mobile Responsive Utilities for Quiz Questions
 * Handles responsive styles for all question types
 */

export const getMobileResponsiveStyles = (theme, breakpoints, baseStyles = {}) => {
  const isMobile = breakpoints?.isMobile ?? false;
  const isTablet = breakpoints?.isTablet ?? false;

  return {
    // Container
    questionContainer: {
      ...baseStyles,
      padding: isMobile ? '12px' : isTablet ? '14px' : '16px',
      width: '100%',
      boxSizing: 'border-box',
    },

    // Text
    questionText: {
      fontSize: isMobile ? '14px' : isTablet ? '15px' : '16px',
      lineHeight: isMobile ? '1.4' : '1.5',
      marginBottom: isMobile ? '12px' : '16px',
      color: theme.text,
      wordBreak: 'break-word',
    },

    // Options Container
    optionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '8px' : '10px',
      width: '100%',
    },

    // Single Option
    option: {
      padding: isMobile ? '10px 12px' : '12px 14px',
      fontSize: isMobile ? '13px' : '14px',
      borderRadius: isMobile ? '4px' : '6px',
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.surface,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'left',
      wordBreak: 'break-word',
      minHeight: isMobile ? '44px' : '40px', // Touch-friendly on mobile
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },

    // Button
    button: {
      padding: isMobile ? '10px 14px' : '10px 16px',
      fontSize: isMobile ? '13px' : '14px',
      minHeight: isMobile ? '44px' : '40px',
      borderRadius: isMobile ? '4px' : '6px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },

    // Input
    input: {
      padding: isMobile ? '10px 12px' : '10px 14px',
      fontSize: isMobile ? '13px' : '14px',
      borderRadius: isMobile ? '4px' : '6px',
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.surface,
      color: theme.text,
      minHeight: isMobile ? '44px' : '40px',
      width: '100%',
      boxSizing: 'border-box',
    },

    // Checkbox
    checkbox: {
      width: isMobile ? '20px' : '18px',
      height: isMobile ? '20px' : '18px',
      cursor: 'pointer',
      flexShrink: 0,
    },

    // Grid for image options
    imageGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
      gap: isMobile ? '8px' : '10px',
      width: '100%',
    },

    // Image option
    imageOption: {
      width: '100%',
      aspectRatio: '1/1',
      borderRadius: isMobile ? '4px' : '6px',
      border: `2px solid transparent`,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      overflow: 'hidden',
    },

    // Drag item
    dragItem: {
      padding: isMobile ? '10px 12px' : '12px 14px',
      fontSize: isMobile ? '13px' : '14px',
      borderRadius: isMobile ? '4px' : '6px',
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.surface,
      cursor: 'grab',
      transition: 'all 0.2s ease',
      userSelect: 'none',
    },

    // Feedback message
    feedback: {
      padding: isMobile ? '8px 10px' : '10px 12px',
      fontSize: isMobile ? '12px' : '13px',
      borderRadius: isMobile ? '4px' : '6px',
      marginTop: isMobile ? '8px' : '10px',
    },

    // Explanation
    explanation: {
      padding: isMobile ? '10px 12px' : '12px 14px',
      fontSize: isMobile ? '12px' : '13px',
      lineHeight: isMobile ? '1.4' : '1.5',
      borderRadius: isMobile ? '4px' : '6px',
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.surface,
      marginTop: isMobile ? '8px' : '10px',
    },

    // Toggle button
    toggleButton: {
      padding: isMobile ? '8px 12px' : '8px 14px',
      fontSize: isMobile ? '12px' : '13px',
      backgroundColor: theme.secondary + '20',
      color: theme.secondary,
      border: `1px solid ${theme.secondary}`,
      borderRadius: isMobile ? '4px' : '6px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minHeight: isMobile ? '40px' : '36px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      justifyContent: 'center',
    },
  };
};

/**
 * Get responsive grid layout
 */
export const getResponsiveGridLayout = (breakpoints) => {
  const isMobile = breakpoints?.isMobile ?? false;
  const isTablet = breakpoints?.isTablet ?? false;

  if (isMobile) return { columns: 1, gap: '8px' };
  if (isTablet) return { columns: 2, gap: '10px' };
  return { columns: 3, gap: '12px' };
};

/**
 * Get touch-friendly dimensions
 */
export const getTouchFriendlyDimensions = (breakpoints) => {
  const isMobile = breakpoints?.isMobile ?? false;

  return {
    minHeight: isMobile ? '48px' : '40px', // Touch target size
    minWidth: isMobile ? '48px' : '40px',
    padding: isMobile ? '12px' : '8px',
    gap: isMobile ? '10px' : '8px',
  };
};

/**
 * Get font sizes based on screen size
 */
export const getResponsiveFontSizes = (breakpoints) => {
  const isMobile = breakpoints?.isMobile ?? false;
  const isTablet = breakpoints?.isTablet ?? false;

  return {
    heading: isMobile ? '18px' : isTablet ? '20px' : '24px',
    subheading: isMobile ? '14px' : isTablet ? '15px' : '16px',
    body: isMobile ? '13px' : isTablet ? '14px' : '15px',
    caption: isMobile ? '11px' : isTablet ? '12px' : '13px',
  };
};
