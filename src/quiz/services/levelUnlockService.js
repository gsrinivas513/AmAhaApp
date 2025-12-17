// src/quiz/services/levelUnlockService.js

/**
 * Determines if a level is unlocked
 */
export function isLevelUnlocked({
  user,
  level,
  highestCompleted,
}) {
  // Guest rule
  if (!user) {
    return level === 1;
  }

  // Logged-in rule:
  // Can play completed levels + next level
  return level <= highestCompleted + 1;
}