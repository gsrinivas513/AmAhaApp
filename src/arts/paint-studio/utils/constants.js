/**
 * Paint Studio Constants
 * Tool configurations, presets, and default values
 */

export const TOOLS = {
  PENCIL: 'pencil',
  BRUSH: 'brush',
  ERASER: 'eraser',
  BUCKET: 'bucket',
  EYEDROPPER: 'eyedropper',
  LINE: 'line',
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  POLYGON: 'polygon',
  FREEFORM: 'freeform',
  TEXT: 'text',
  GRADIENT: 'gradient',
  BLUR: 'blur',
  SMUDGE: 'smudge',
};

export const TOOL_CATEGORIES = {
  DRAWING: ['pencil', 'brush', 'eraser'],
  SHAPES: ['line', 'rectangle', 'circle', 'polygon'],
  FILL: ['bucket', 'gradient'],
  SELECTION: ['freeform'],
  EFFECTS: ['blur', 'smudge'],
  SPECIAL: ['eyedropper', 'text'],
};

export const PRESET_CATEGORIES = {
  BASIC: 'Basic',
  NATURAL: 'Natural',
  DIGITAL: 'Digital',
  SPECIAL: 'Special',
};

export const BRUSH_PRESETS = {
  // Basic Drawing Tools
  PENCIL: {
    name: 'Pencil',
    category: 'Basic',
    size: 2,
    hardness: 1,
    opacity: 1,
    spacing: 5,
    description: 'Sharp, precise pencil for sketching',
    color: '#FF6B6B',
  },
  HB_PENCIL: {
    name: 'HB Pencil',
    category: 'Basic',
    size: 3,
    hardness: 0.9,
    opacity: 0.9,
    spacing: 3,
    description: 'Classic HB lead pencil feel',
    color: '#4ECDC4',
  },
  
  // Natural Media
  SOFT_BRUSH: {
    name: 'Soft Brush',
    category: 'Natural',
    size: 15,
    hardness: 0.3,
    opacity: 0.8,
    spacing: 8,
    description: 'Soft, blendable brush like watercolor',
    color: '#45B7D1',
  },
  NATURAL_BRUSH: {
    name: 'Natural Bristle',
    category: 'Natural',
    size: 18,
    hardness: 0.4,
    opacity: 0.85,
    spacing: 10,
    description: 'Like natural bristle paintbrush',
    color: '#96CEB4',
  },
  WATERCOLOR: {
    name: 'Watercolor',
    category: 'Natural',
    size: 25,
    hardness: 0.2,
    opacity: 0.6,
    spacing: 12,
    description: 'Transparent watercolor effect',
    color: '#FFEAA7',
  },

  // Hard Edges
  HARD_BRUSH: {
    name: 'Hard Brush',
    category: 'Digital',
    size: 10,
    hardness: 1,
    opacity: 1,
    spacing: 3,
    description: 'Sharp digital brush with hard edges',
    color: '#FF6B9D',
  },
  INK_PEN: {
    name: 'Ink Pen',
    category: 'Digital',
    size: 4,
    hardness: 1,
    opacity: 1,
    spacing: 2,
    description: 'Fine ink pen for inking',
    color: '#000000',
  },
  
  // Calligraphy
  CALLIGRAPHY: {
    name: 'Calligraphy',
    category: 'Digital',
    size: 20,
    hardness: 0.5,
    opacity: 0.9,
    spacing: 4,
    description: 'Brush pen with pressure sensitivity simulation',
    color: '#A29BFE',
  },
  THICK_CALLIGRAPHY: {
    name: 'Thick Calligraphy',
    category: 'Digital',
    size: 35,
    hardness: 0.4,
    opacity: 0.95,
    spacing: 8,
    description: 'Large calligraphy brush for headers',
    color: '#6C5CE7',
  },

  // Textured & Special
  CHALK: {
    name: 'Chalk',
    category: 'Special',
    size: 12,
    hardness: 0.6,
    opacity: 0.7,
    spacing: 6,
    description: 'Chalky, slightly transparent brush',
    color: '#DFE6E9',
  },
  PASTEL: {
    name: 'Pastel',
    category: 'Special',
    size: 16,
    hardness: 0.5,
    opacity: 0.75,
    spacing: 7,
    description: 'Soft pastel with blending',
    color: '#FD79A8',
  },
  MARKER: {
    name: 'Marker',
    category: 'Special',
    size: 8,
    hardness: 0.8,
    opacity: 0.9,
    spacing: 2,
    description: 'Thick marker pen feel',
    color: '#FF8C42',
  },
  THICK_MARKER: {
    name: 'Thick Marker',
    category: 'Special',
    size: 18,
    hardness: 0.85,
    opacity: 0.95,
    spacing: 3,
    description: 'Wide marker for bold strokes',
    color: '#FF5733',
  },

  // Airbrush
  AIRBRUSH: {
    name: 'Airbrush',
    category: 'Special',
    size: 30,
    hardness: 0,
    opacity: 0.3,
    spacing: 15,
    description: 'Soft airbrush for smooth blending',
    color: '#74B9FF',
  },
  SOFT_AIRBRUSH: {
    name: 'Soft Airbrush',
    category: 'Special',
    size: 50,
    hardness: 0.1,
    opacity: 0.2,
    spacing: 20,
    description: 'Very soft airbrush for subtle effects',
    color: '#A8E6CF',
  },

  // Splatter & Texture
  SPLATTER: {
    name: 'Splatter',
    category: 'Special',
    size: 25,
    hardness: 0.2,
    opacity: 0.6,
    spacing: 20,
    description: 'Splatter effect brush',
    color: '#D63031',
  },
  SPRAY: {
    name: 'Spray Paint',
    category: 'Special',
    size: 40,
    hardness: 0.15,
    opacity: 0.5,
    spacing: 18,
    description: 'Spray paint effect',
    color: '#636E72',
  },
  DOTS: {
    name: 'Dots Pattern',
    category: 'Special',
    size: 20,
    hardness: 1,
    opacity: 0.8,
    spacing: 25,
    description: 'Dots pattern brush',
    color: '#00B894',
  },

  // Digital Painting
  BLEND_BRUSH: {
    name: 'Blend Brush',
    category: 'Digital',
    size: 20,
    hardness: 0.2,
    opacity: 0.7,
    spacing: 10,
    description: 'For blending colors together',
    color: '#FF7675',
  },
  DETAIL_BRUSH: {
    name: 'Detail Brush',
    category: 'Digital',
    size: 6,
    hardness: 0.9,
    opacity: 0.95,
    spacing: 2,
    description: 'Fine details and line work',
    color: '#2D3436',
  },
  TEXTURE_BRUSH: {
    name: 'Texture Brush',
    category: 'Special',
    size: 30,
    hardness: 0.7,
    opacity: 0.65,
    spacing: 14,
    description: 'Adds texture to strokes',
    color: '#B2BEB5',
  },
};

export const DEFAULT_COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#FF69B4',
  '#8B4513', '#808080', '#C0C0C0', '#8A2BE2', '#00FF7F',
];

export const CANVAS_DEFAULTS = {
  WIDTH: 1200,
  HEIGHT: 700,
  BG_COLOR: '#FFFFFF',
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 500,
  INITIAL_ZOOM: 100,
};

export const BRUSH_SETTINGS = {
  MIN_SIZE: 1,
  MAX_SIZE: 200,
  MIN_OPACITY: 0,
  MAX_OPACITY: 1,
  MIN_HARDNESS: 0,
  MAX_HARDNESS: 1,
};

export const BLENDING_MODES = [
  'source-over',
  'multiply',
  'screen',
  'overlay',
  'color-dodge',
  'color-burn',
  'darken',
  'lighten',
  'hard-light',
  'soft-light',
];

export const HOTKEYS = {
  PENCIL: 'p',
  BRUSH: 'b',
  ERASER: 'e',
  UNDO: 'ctrl+z',
  REDO: 'ctrl+shift+z',
  SAVE: 'ctrl+s',
  NEW: 'ctrl+n',
  ZOOM_IN: 'ctrl+=',
  ZOOM_OUT: 'ctrl+-',
  FIT_SCREEN: 'ctrl+0',
};

export const LAYER_DEFAULTS = {
  OPACITY: 1,
  BLENDING_MODE: 'source-over',
  VISIBLE: true,
};

export const UNDO_STACK_LIMIT = 50;

export const UI_COLORS = {
  TOOLBAR_BG: '#2a2a2a',
  PANEL_BG: '#1e1e1e',
  BORDER: '#3a3a3a',
  HOVER: '#404040',
  ACTIVE: '#0078d4',
};
