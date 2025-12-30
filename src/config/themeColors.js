// Modern Theme Color System - 5 Colors × 2 Modes = 10 Complete Themes
// Inspired by PuzzleFree.game aesthetic

export const THEME_COLORS = {
  green: {
    light: {
      primary: '#10b981',           // Main brand green
      primaryDark: '#059669',        // Darker green for borders/buttons
      primaryLight: '#6ee7b7',       // Lighter green for hover states
      secondary: '#34d399',          // Secondary green accent
      background: '#ffffff',         // Page background
      surface: '#f3f4f6',           // Card/component background
      surfaceAlt: '#e5e7eb',        // Input/field backgrounds
      text: '#1f2937',              // Primary text (dark gray)
      textSecondary: '#6b7280',     // Secondary text (medium gray)
      border: '#d1d5db',            // Border color
      accent: '#10b981',            // Accent color
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    dark: {
      primary: '#10b981',           // Keep bright green in dark mode
      primaryDark: '#6ee7b7',        // Use lighter for dark mode visibility
      primaryLight: '#34d399',       // Adjusted lighter
      secondary: '#34d399',          // Secondary
      background: '#0f172a',        // Dark background (almost black-blue)
      surface: '#1e293b',           // Dark card background (darker blue-gray)
      surfaceAlt: '#334155',        // Even darker for inputs
      text: '#f1f5f9',              // Light text
      textSecondary: '#cbd5e1',     // Secondary light text
      border: '#475569',            // Dark border
      accent: '#10b981',            // Keep accent green
      gradient: 'linear-gradient(135deg, #10b981 0%, #6ee7b7 100%)',
    },
  },

  blue: {
    light: {
      primary: '#3b82f6',           // Main brand blue
      primaryDark: '#1d4ed8',        // Darker blue
      primaryLight: '#93c5fd',       // Lighter blue
      secondary: '#60a5fa',          // Secondary blue
      background: '#ffffff',
      surface: '#f3f4f6',
      surfaceAlt: '#e5e7eb',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#d1d5db',
      accent: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    },
    dark: {
      primary: '#3b82f6',
      primaryDark: '#93c5fd',
      primaryLight: '#60a5fa',
      secondary: '#60a5fa',
      background: '#0f172a',
      surface: '#1e293b',
      surfaceAlt: '#334155',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      border: '#475569',
      accent: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #93c5fd 100%)',
    },
  },

  purple: {
    light: {
      primary: '#a855f7',           // Main brand purple
      primaryDark: '#7e22ce',        // Darker purple
      primaryLight: '#d8b4fe',       // Lighter purple
      secondary: '#c084fc',          // Secondary purple
      background: '#ffffff',
      surface: '#f3f4f6',
      surfaceAlt: '#e5e7eb',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#d1d5db',
      accent: '#a855f7',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
    },
    dark: {
      primary: '#a855f7',
      primaryDark: '#d8b4fe',
      primaryLight: '#c084fc',
      secondary: '#c084fc',
      background: '#0f172a',
      surface: '#1e293b',
      surfaceAlt: '#334155',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      border: '#475569',
      accent: '#a855f7',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #d8b4fe 100%)',
    },
  },

  red: {
    light: {
      primary: '#ef4444',           // Main brand red
      primaryDark: '#dc2626',        // Darker red
      primaryLight: '#fca5a5',       // Lighter red
      secondary: '#f87171',          // Secondary red
      background: '#ffffff',
      surface: '#f3f4f6',
      surfaceAlt: '#e5e7eb',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#d1d5db',
      accent: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    },
    dark: {
      primary: '#ef4444',
      primaryDark: '#fca5a5',
      primaryLight: '#f87171',
      secondary: '#f87171',
      background: '#0f172a',
      surface: '#1e293b',
      surfaceAlt: '#334155',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      border: '#475569',
      accent: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #fca5a5 100%)',
    },
  },

  orange: {
    light: {
      primary: '#f97316',           // Main brand orange
      primaryDark: '#dc2626',        // Darker orange (blend toward red)
      primaryLight: '#fed7aa',       // Lighter orange
      secondary: '#fb923c',          // Secondary orange
      background: '#ffffff',
      surface: '#f3f4f6',
      surfaceAlt: '#e5e7eb',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#d1d5db',
      accent: '#f97316',
      gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
    },
    dark: {
      primary: '#f97316',
      primaryDark: '#fed7aa',
      primaryLight: '#fb923c',
      secondary: '#fb923c',
      background: '#0f172a',
      surface: '#1e293b',
      surfaceAlt: '#334155',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      border: '#475569',
      accent: '#f97316',
      gradient: 'linear-gradient(135deg, #f97316 0%, #fed7aa 100%)',
    },
  },
};

// Helper function to get theme by color and mode
export const getTheme = (color = 'green', isDarkMode = false) => {
  const mode = isDarkMode ? 'dark' : 'light';
  return THEME_COLORS[color]?.[mode] || THEME_COLORS.green.light;
};

// Export all available colors
export const AVAILABLE_COLORS = Object.keys(THEME_COLORS);

// Export color metadata
export const COLOR_METADATA = {
  green: {
    name: 'Green',
    icon: '🟢',
    description: 'Fresh, energetic, friendly',
    bestFor: 'General audiences, casual content',
  },
  blue: {
    name: 'Blue',
    icon: '🔵',
    description: 'Professional, calm, trustworthy',
    bestFor: 'Business, education, serious content',
  },
  purple: {
    name: 'Purple',
    icon: '🟣',
    description: 'Creative, mystical, unique',
    bestFor: 'Creative content, premium features',
  },
  red: {
    name: 'Red',
    icon: '🔴',
    description: 'Energetic, bold, passionate',
    bestFor: 'Action games, time-limited challenges',
  },
  orange: {
    name: 'Orange',
    icon: '🟠',
    description: 'Warm, welcoming, optimistic',
    bestFor: 'Community, fun, casual gaming',
  },
};

export default THEME_COLORS;
