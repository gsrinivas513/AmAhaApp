/**
 * Determines if rewards (XP, coins, streak) should be given
 */
export function shouldRewardLevel({
  highestCompleted,
  level,
}) {
  // Only reward if this is a NEW level
  return level > highestCompleted;
}