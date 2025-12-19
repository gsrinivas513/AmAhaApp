export function canAccessDifficulty({
  difficulty,
  progress,
  levelsPerDifficulty,
}) {
  if (difficulty === "easy") return true;

  if (difficulty === "medium") {
    return progress.easyCompletedLevels >= levelsPerDifficulty;
  }

  if (difficulty === "hard") {
    return progress.mediumCompletedLevels >= levelsPerDifficulty;
  }

  return false;
}