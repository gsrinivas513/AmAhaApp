// src/theme.js

// -------------------------------------------
// Utility functions for gradient generation
// -------------------------------------------

// Convert hex → RGB
function hexToRgb(hex) {
  const val = (hex || "").replace("#", "").trim();
  if (val.length === 3) {
    const r = parseInt(val[0] + val[0], 16);
    const g = parseInt(val[1] + val[1], 16);
    const b = parseInt(val[2] + val[2], 16);
    return { r, g, b };
  }
  const r = parseInt(val.substring(0, 2) || "6C", 16);
  const g = parseInt(val.substring(2, 4) || "63", 16);
  const b = parseInt(val.substring(4, 6) || "FF", 16);
  return { r, g, b };
}

function clamp(v, a = 0, b = 255) {
  return Math.max(a, Math.min(b, Math.round(v)));
}

function lightenHex(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const t = percent / 100;
  const nr = clamp(r + (255 - r) * t);
  const ng = clamp(g + (255 - g) * t);
  const nb = clamp(b + (255 - b) * t);
  return `rgb(${nr}, ${ng}, ${nb})`;
}

/**
 * gradientFromColor(hexBase)
 * Returns a tasteful multi-stop gradient string for a given base color.
 */
export function gradientFromColor(hexBase = "#6C63FF") {
  try {
    const base = hexBase;
    const lighter = lightenHex(base, 28);
    const darker = `rgba(0,0,0,0.06)`; // subtle depth
    return `linear-gradient(135deg, ${base} 10%, ${lighter} 70%), ${darker}`;
  } catch (e) {
    return `linear-gradient(135deg, #6C63FF 10%, ${lightenHex("#6C63FF", 28)} 70%)`;
  }
}

// -------------------------------------------
// Provide a small colors object for legacy admin UI
// -------------------------------------------
export const colors = {
  gradient: "linear-gradient(135deg, #6C63FF, #8A78FF)",
  primary: "#6C63FF",
  danger: "#e74c3c",
  muted: "#666",
};