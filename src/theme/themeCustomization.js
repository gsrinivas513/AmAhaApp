/**
 * Advanced Theme Customization System
 * Allows users to create and manage custom themes
 */

/**
 * Base theme presets
 */
export const THEME_PRESETS = {
  light: {
    name: 'Light Mode',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    border: '#E0E0E0',
    text: '#212121',
    textSecondary: '#757575',
    primary: '#2196F3',
    primaryLight: '#BBDEFB',
    primaryDark: '#1565C0',
    secondary: '#FF9800',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    info: '#00BCD4',
  },

  dark: {
    name: 'Dark Mode',
    background: '#121212',
    surface: '#1E1E1E',
    border: '#424242',
    text: '#FFFFFF',
    textSecondary: '#B0BEC5',
    primary: '#64B5F6',
    primaryLight: '#BBDEFB',
    primaryDark: '#1565C0',
    secondary: '#FFB74D',
    success: '#81C784',
    error: '#EF5350',
    warning: '#FFD54F',
    info: '#4DD0E1',
  },

  vibrant: {
    name: 'Vibrant',
    background: '#F0E6FF',
    surface: '#FFFFFF',
    border: '#D0B5FF',
    text: '#2D1B69',
    textSecondary: '#6B5B95',
    primary: '#9C27B0',
    primaryLight: '#E1BEE7',
    primaryDark: '#7B1FA2',
    secondary: '#FF6B9D',
    success: '#26A69A',
    error: '#D32F2F',
    warning: '#FFA726',
    info: '#29B6F6',
  },

  solarized: {
    name: 'Solarized',
    background: '#FDF6E3',
    surface: '#EEE8D5',
    border: '#D6D0C8',
    text: '#657B83',
    textSecondary: '#93A1A1',
    primary: '#268BD2',
    primaryLight: '#B58900',
    primaryDark: '#1E63A8',
    secondary: '#2AA198',
    success: '#859900',
    error: '#DC322F',
    warning: '#B58900',
    info: '#268BD2',
  },

  ocean: {
    name: 'Ocean',
    background: '#E3F2FD',
    surface: '#FFFFFF',
    border: '#90CAF9',
    text: '#0D47A1',
    textSecondary: '#1976D2',
    primary: '#0288D1',
    primaryLight: '#B3E5FC',
    primaryDark: '#0277BD',
    secondary: '#00838F',
    success: '#00897B',
    error: '#C62828',
    warning: '#F57F17',
    info: '#0097A7',
  },

  forest: {
    name: 'Forest',
    background: '#E8F5E9',
    surface: '#F1F8E9',
    border: '#A5D6A7',
    text: '#1B5E20',
    textSecondary: '#2E7D32',
    primary: '#388E3C',
    primaryLight: '#C8E6C9',
    primaryDark: '#1B5E20',
    secondary: '#558B2F',
    success: '#689F38',
    error: '#D32F2F',
    warning: '#F57C00',
    info: '#00796B',
  },
};

/**
 * Theme builder - Create custom themes
 */
export class ThemeBuilder {
  constructor(baseTheme = THEME_PRESETS.light) {
    this.theme = { ...baseTheme };
  }

  setColor(colorKey, hexValue) {
    if (this.isValidHex(hexValue)) {
      this.theme[colorKey] = hexValue;
    }
    return this;
  }

  setColors(colorMap) {
    Object.entries(colorMap).forEach(([key, value]) => {
      if (this.isValidHex(value)) {
        this.theme[key] = value;
      }
    });
    return this;
  }

  isValidHex(hex) {
    return /^#[0-9A-F]{6}$/i.test(hex);
  }

  adjustBrightness(color, factor) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + factor));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + factor));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + factor));
    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
  }

  generateAccents(primaryColor) {
    return {
      primary: primaryColor,
      primaryLight: this.adjustBrightness(primaryColor, 100),
      primaryDark: this.adjustBrightness(primaryColor, -80),
    };
  }

  build() {
    return { ...this.theme };
  }

  export() {
    return JSON.stringify(this.theme, null, 2);
  }

  validate() {
    const required = [
      'background', 'surface', 'border', 'text', 'textSecondary',
      'primary', 'secondary', 'success', 'error'
    ];

    const missing = required.filter(key => !this.theme[key]);
    return {
      valid: missing.length === 0,
      missing: missing,
    };
  }
}

/**
 * Theme persistence
 */
export class ThemePersistence {
  static STORAGE_KEY = 'amaha_custom_theme';

  static save(theme, name) {
    const themes = this.loadAll();
    themes[name] = theme;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(themes));
    return true;
  }

  static load(name) {
    const themes = this.loadAll();
    return themes[name] || null;
  }

  static loadAll() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Error loading themes:', e);
      return {};
    }
  }

  static delete(name) {
    const themes = this.loadAll();
    delete themes[name];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(themes));
    return true;
  }

  static getList() {
    return Object.keys(this.loadAll());
  }
}

/**
 * Dynamic theme application
 */
export class ThemeApplier {
  static apply(theme, rootElement = document.documentElement) {
    Object.entries(theme).forEach(([key, value]) => {
      const cssVar = `--color-${key}`;
      rootElement.style.setProperty(cssVar, value);
    });

    // Apply to body for backwards compatibility
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.text;
  }

  static applySystemTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = prefersDark ? THEME_PRESETS.dark : THEME_PRESETS.light;
    this.apply(theme);
  }

  static setContrast(level = 'normal') {
    // level: 'normal', 'high', 'low'
    const root = document.documentElement;
    root.dataset.contrast = level;
  }

  static getCSS(theme) {
    return `
      :root {
        --color-background: ${theme.background};
        --color-surface: ${theme.surface};
        --color-border: ${theme.border};
        --color-text: ${theme.text};
        --color-text-secondary: ${theme.textSecondary};
        --color-primary: ${theme.primary};
        --color-primary-light: ${theme.primaryLight};
        --color-primary-dark: ${theme.primaryDark};
        --color-secondary: ${theme.secondary};
        --color-success: ${theme.success};
        --color-error: ${theme.error};
        --color-warning: ${theme.warning};
        --color-info: ${theme.info};
      }
    `;
  }
}

/**
 * Brand customization
 */
export class BrandCustomizer {
  constructor(baseTheme = THEME_PRESETS.light) {
    this.theme = { ...baseTheme };
    this.branding = {
      logoUrl: null,
      accentColor: null,
      borderRadius: 'medium', // small, medium, large
      fontFamily: 'system', // system, serif, mono
    };
  }

  setBrandColor(color) {
    this.branding.accentColor = color;
    const builder = new ThemeBuilder(this.theme);
    Object.assign(this.theme, builder.generateAccents(color));
    return this;
  }

  setLogoUrl(url) {
    this.branding.logoUrl = url;
    return this;
  }

  setBorderRadius(size) {
    this.branding.borderRadius = size;
    return this;
  }

  setFontFamily(family) {
    this.branding.fontFamily = family;
    return this;
  }

  getTheme() {
    return {
      colors: this.theme,
      branding: this.branding,
    };
  }

  getCSS() {
    const radiusMap = {
      small: '2px',
      medium: '6px',
      large: '12px',
    };

    const fontMap = {
      system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      serif: 'Georgia, "Times New Roman", serif',
      mono: '"Courier New", monospace',
    };

    return `
      :root {
        --border-radius: ${radiusMap[this.branding.borderRadius]};
        --font-family: ${fontMap[this.branding.fontFamily]};
        ${Object.entries(this.theme).map(
          ([key, value]) => `--color-${key}: ${value};`
        ).join('\n')}
      }
    `;
  }
}

/**
 * Theme comparison utility
 */
export function compareThemes(theme1, theme2) {
  const differences = {};

  Object.keys(theme1).forEach(key => {
    if (theme1[key] !== theme2[key]) {
      differences[key] = {
        old: theme1[key],
        new: theme2[key],
      };
    }
  });

  return differences;
}

/**
 * Color palette generator
 */
export function generateColorPalette(primaryColor) {
  const builder = new ThemeBuilder();

  const shades = {};
  for (let i = 0; i <= 10; i++) {
    const factor = (i - 5) * 20;
    shades[`shade-${i}`] = builder.adjustBrightness(primaryColor, factor);
  }

  return shades;
}
