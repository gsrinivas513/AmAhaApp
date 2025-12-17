// src/config/badges.js

export const BADGES = {
  STREAK_3: {
    id: "streak_3",
    label: "Streak Starter",
    icon: "🔥",
    condition: (stats) => (stats.currentStreak || 0) >= 3,
  },

  STREAK_7: {
    id: "streak_7",
    label: "Consistent Learner",
    icon: "⚡",
    condition: (stats) => (stats.currentStreak || 0) >= 7,
  },

  XP_500: {
    id: "xp_500",
    label: "XP Explorer",
    icon: "🚀",
    condition: (stats) => (stats.xp || 0) >= 500,
  },

  CORRECT_50: {
    id: "correct_50",
    label: "Quiz Master",
    icon: "🧠",
    condition: (stats) => (stats.totalCorrectAnswers || 0) >= 50,
  },
};