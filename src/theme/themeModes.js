// src/theme/themeModes.js

export const THEME_MODES = {
  playful: {
    name: "Playful & Fun",
    colors: {
      primary: "#6C63FF",
      secondary: "#FFB703",
      background: "#FAFAFF",
      card: "#FFFFFF",
      textPrimary: "#1F2937",
      textSecondary: "#6B7280",
      success: "#4CAF50",
      danger: "#EF4444",
    },
    radius: {
      card: 16,
      button: 12,
    },
    shadow: "0 8px 28px rgba(20,20,40,0.08)",
    animation: "playful",
  },

  calm: {
    name: "Calm & Premium",
    colors: {
      primary: "#111827",
      secondary: "#9CA3AF",
      background: "#F9FAFB",
      card: "#FFFFFF",
      textPrimary: "#111827",
      textSecondary: "#6B7280",
      success: "#16A34A",
      danger: "#DC2626",
    },
    radius: {
      card: 10,
      button: 8,
    },
    shadow: "0 6px 20px rgba(0,0,0,0.06)",
    animation: "none",
  },

  competitive: {
    name: "Energetic & Competitive",
    colors: {
      primary: "#EF4444",
      secondary: "#F97316",
      background: "#0F172A",
      card: "#020617",
      textPrimary: "#F9FAFB",
      textSecondary: "#CBD5E1",
      success: "#22C55E",
      danger: "#EF4444",
    },
    radius: {
      card: 8,
      button: 6,
    },
    shadow: "0 10px 36px rgba(239,68,68,0.25)",
    animation: "intense",
  },
};