/**
 * Enhanced Gamification System - Complete Rewards & Achievements
 * Expands on gamificationService with full XP, coins, badges, and reward distribution
 */

import { db } from '../firebase/firebaseConfig';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  increment,
} from 'firebase/firestore';

/**
 * XP Configuration
 */
export const XP_CONFIG = {
  // Activity-based XP
  QUIZ_COMPLETION: { base: 50, maxBonus: 25 }, // Base + accuracy bonus
  PUZZLE_SOLVE: { base: 100, maxBonus: 50 },
  CHALLENGE_COMPLETE: { base: 75, maxBonus: 25 },
  SERIES_COMPLETION: { base: 500, maxBonus: 250 },
  LEADERBOARD_POSITION: { first: 300, second: 200, third: 100 },
  DAILY_LOGIN: 25,
  WEEKLY_CHALLENGE: 200,
  MONTHLY_CHALLENGE: 1000,
};

/**
 * Coin Configuration
 */
export const COIN_CONFIG = {
  // Activity-based coins
  QUIZ_COMPLETION: { base: 10, perfect: 20 },
  PUZZLE_SOLVE: { base: 25, perfect: 50 },
  CHALLENGE_COMPLETE: { base: 15, perfect: 30 },
  SERIES_COMPLETION: { base: 200, perfect: 500 },
  ACHIEVEMENT_UNLOCK: 50,
  BADGE_UNLOCK: 100,
  MILESTONE_LEVEL: { base: 100, perLevel: 50 }, // 100 at level 2, 150 at level 3, etc.
};

/**
 * Extended Achievement Definitions (builds on existing)
 */
export const EXTENDED_ACHIEVEMENTS = {
  // Speed challenges
  SPEEDSTER: {
    id: 'speedster',
    name: 'Speedster',
    description: 'Complete a puzzle in under 2 minutes',
    icon: '⚡',
    badge: '🏃',
    xpReward: 150,
    coinsReward: 75,
    rarity: 'rare',
    trigger: 'puzzle_time',
  },
  LIGHTNING_FAST: {
    id: 'lightning_fast',
    name: 'Lightning Fast',
    description: 'Complete 10 puzzles in under 2 minutes each',
    icon: '⚡',
    badge: '⚡',
    xpReward: 500,
    coinsReward: 300,
    rarity: 'epic',
    trigger: 'puzzle_time_batch',
  },
  // Accuracy achievements
  PERFECT_SCORE: {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Score 100% on a quiz',
    icon: '💯',
    badge: '💯',
    xpReward: 200,
    coinsReward: 150,
    rarity: 'rare',
    trigger: 'quiz_perfect',
  },
  FLAWLESS_SERIES: {
    id: 'flawless_series',
    name: 'Flawless Series',
    description: 'Complete a series with 90%+ accuracy throughout',
    icon: '🎯',
    badge: '🎯',
    xpReward: 1000,
    coinsReward: 500,
    rarity: 'epic',
    trigger: 'series_flawless',
  },
  // Consistency achievements
  CONSISTENT_PERFORMER: {
    id: 'consistent',
    name: 'Consistent Performer',
    description: 'Maintain 7-day login streak',
    icon: '📅',
    badge: '🔥',
    xpReward: 300,
    coinsReward: 200,
    rarity: 'uncommon',
    trigger: 'login_streak',
  },
  UNSTOPPABLE: {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Maintain 30-day login streak',
    icon: '🚀',
    badge: '🚀',
    xpReward: 2000,
    coinsReward: 1500,
    rarity: 'legendary',
    trigger: 'login_streak',
  },
  // Collection achievements
  SERIES_COLLECTOR: {
    id: 'series_collector',
    name: 'Series Collector',
    description: 'Complete 10 different series',
    icon: '📚',
    badge: '📚',
    xpReward: 1500,
    coinsReward: 750,
    rarity: 'uncommon',
    trigger: 'series_count',
  },
  ALL_PUZZLE_TYPES: {
    id: 'all_puzzle_types',
    name: 'Puzzle Master',
    description: 'Complete all puzzle types',
    icon: '🧩',
    badge: '🧩',
    xpReward: 2000,
    coinsReward: 1000,
    rarity: 'epic',
    trigger: 'puzzle_types',
  },
  // Social achievements (future)
  HELPFUL_USER: {
    id: 'helpful',
    name: 'Helpful User',
    description: 'Contribute to 5 discussions',
    icon: '🤝',
    badge: '🤝',
    xpReward: 250,
    coinsReward: 150,
    rarity: 'uncommon',
    trigger: 'contributions',
  },
};

/**
 * Extended Level System (advanced progression)
 */
export const EXTENDED_LEVELS = [
  { level: 1, name: 'Novice', xpRequired: 0, icon: '🌱', title: 'Beginner' },
  { level: 2, name: 'Apprentice', xpRequired: 100, icon: '📚', title: 'Learning' },
  { level: 3, name: 'Skilled', xpRequired: 300, icon: '⭐', title: 'Proficient' },
  { level: 4, name: 'Expert', xpRequired: 600, icon: '🎖️', title: 'Advanced' },
  { level: 5, name: 'Master', xpRequired: 1000, icon: '👑', title: 'Expert' },
  { level: 6, name: 'Legend', xpRequired: 2000, icon: '🏆', title: 'Legendary' },
  { level: 7, name: 'Immortal', xpRequired: 5000, icon: '⚡', title: 'Ultimate' },
  { level: 8, name: 'Deity', xpRequired: 10000, icon: '🌟', title: 'Godlike' },
  { level: 9, name: 'Eternal', xpRequired: 20000, icon: '✨', title: 'Infinite' },
  { level: 10, name: 'Ascended', xpRequired: 50000, icon: '👁️', title: 'Transcendent' },
];

/**
 * Calculate XP reward for quiz completion
 */
export function calculateQuizXP(score, maxScore, difficulty = 1) {
  const accuracy = score / maxScore;
  const base = XP_CONFIG.QUIZ_COMPLETION.base * difficulty;
  const bonus = XP_CONFIG.QUIZ_COMPLETION.maxBonus * accuracy * difficulty;
  return Math.round(base + bonus);
}

/**
 * Calculate XP reward for puzzle solve
 */
export function calculatePuzzleXP(timeSeconds, maxTime, difficulty = 1) {
  const timeBonus = Math.max(0, 1 - timeSeconds / maxTime);
  const base = XP_CONFIG.PUZZLE_SOLVE.base * difficulty;
  const bonus = XP_CONFIG.PUZZLE_SOLVE.maxBonus * timeBonus * difficulty;
  return Math.round(base + bonus);
}

/**
 * Calculate XP reward for challenge completion
 */
export function calculateChallengeXP(position, totalParticipants) {
  if (position === 1) return XP_CONFIG.LEADERBOARD_POSITION.first;
  if (position === 2) return XP_CONFIG.LEADERBOARD_POSITION.second;
  if (position === 3) return XP_CONFIG.LEADERBOARD_POSITION.third;
  return XP_CONFIG.CHALLENGE_COMPLETE.base;
}

/**
 * Award XP to user
 */
export async function awardXP(userId, amount, reason = '') {
  try {
    const userDoc = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDoc);
    const currentXP = userSnapshot.data()?.totalXP || 0;
    const newXP = currentXP + amount;

    await updateDoc(userDoc, {
      totalXP: newXP,
    });

    // Check if user leveled up
    const oldLevel = getUserLevelFromXP(currentXP);
    const newLevel = getUserLevelFromXP(newXP);

    if (newLevel > oldLevel) {
      await awardCoins(
        userId,
        COIN_CONFIG.MILESTONE_LEVEL.base + (newLevel - 1) * COIN_CONFIG.MILESTONE_LEVEL.perLevel,
        `Level ${newLevel} reached!`
      );
    }

    // Log reward
    await logReward(userId, 'xp', amount, reason);

    return { success: true, newXP, leveledUp: newLevel > oldLevel, newLevel };
  } catch (error) {
    console.error('Error awarding XP:', error);
    return { success: false, error };
  }
}

/**
 * Award coins to user
 */
export async function awardCoins(userId, amount, reason = '') {
  try {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, {
      totalCoins: increment(amount),
    });

    // Log reward
    await logReward(userId, 'coins', amount, reason);

    return { success: true, amount };
  } catch (error) {
    console.error('Error awarding coins:', error);
    return { success: false, error };
  }
}

/**
 * Unlock badge for user
 */
export async function unlockBadge(userId, badgeId, name = '') {
  try {
    const badgeDoc = doc(db, 'userBadges', userId);
    await setDoc(
      badgeDoc,
      {
        badges: arrayUnion({
          id: badgeId,
          name,
          unlockedAt: new Date(),
        }),
        updatedAt: new Date(),
      },
      { merge: true }
    );

    // Award coins for badge unlock
    await awardCoins(userId, COIN_CONFIG.BADGE_UNLOCK, `Badge unlocked: ${name}`);

    return { success: true, badgeId };
  } catch (error) {
    console.error('Error unlocking badge:', error);
    return { success: false, error };
  }
}

/**
 * Unlock achievement for user
 */
export async function unlockAchievement(userId, achievementId, achievement = {}) {
  try {
    const achievementDoc = doc(db, 'achievements', userId);
    const xp = achievement.xpReward || 100;
    const coins = achievement.coinsReward || 50;

    await setDoc(
      achievementDoc,
      {
        unlocked: arrayUnion({
          id: achievementId,
          name: achievement.name || '',
          unlockedAt: new Date(),
        }),
        updatedAt: new Date(),
      },
      { merge: true }
    );

    // Award XP and coins for achievement
    await awardXP(userId, xp, `Achievement unlocked: ${achievement.name}`);
    await awardCoins(userId, coins, `Achievement unlocked: ${achievement.name}`);

    return { success: true, achievementId, xpRewarded: xp, coinsRewarded: coins };
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return { success: false, error };
  }
}

/**
 * Get user's current level from XP
 */
export function getUserLevelFromXP(xp) {
  let level = 1;
  for (const levelData of EXTENDED_LEVELS) {
    if (xp >= levelData.xpRequired) {
      level = levelData.level;
    } else {
      break;
    }
  }
  return level;
}

/**
 * Get XP required for next level
 */
export function getXPForNextLevel(currentXP) {
  const currentLevel = getUserLevelFromXP(currentXP);
  const nextLevel = EXTENDED_LEVELS.find((l) => l.level === currentLevel + 1);
  if (!nextLevel) return null;

  return {
    nextLevel: currentLevel + 1,
    xpRequired: nextLevel.xpRequired,
    xpNeeded: Math.max(0, nextLevel.xpRequired - currentXP),
    progress: currentXP - EXTENDED_LEVELS[currentLevel - 1].xpRequired,
    totalForLevel: nextLevel.xpRequired - EXTENDED_LEVELS[currentLevel - 1].xpRequired,
  };
}

/**
 * Get user's complete profile (rewards, achievements, badges, level)
 */
export async function getUserRewardsProfile(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data() || {};

    const achievementsDoc = await getDoc(doc(db, 'achievements', userId));
    const achievements = achievementsDoc.exists() ? achievementsDoc.data() : {};

    const badgesDoc = await getDoc(doc(db, 'userBadges', userId));
    const badges = badgesDoc.exists() ? badgesDoc.data() : {};

    const currentXP = userData.totalXP || 0;
    const currentCoins = userData.totalCoins || 0;
    const currentLevel = getUserLevelFromXP(currentXP);
    const levelInfo = EXTENDED_LEVELS.find((l) => l.level === currentLevel);
    const nextLevelInfo = getXPForNextLevel(currentXP);

    return {
      userId,
      xp: currentXP,
      coins: currentCoins,
      level: currentLevel,
      levelInfo,
      nextLevel: nextLevelInfo,
      achievements: achievements.unlocked || [],
      badges: badges.badges || [],
      totalAchievements: (achievements.unlocked || []).length,
      totalBadges: (badges.badges || []).length,
    };
  } catch (error) {
    console.error('Error getting user rewards profile:', error);
    return null;
  }
}

/**
 * Get leaderboard (top users by XP)
 */
export async function getXPLeaderboard(limit_count = 50) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('totalXP', 'desc'), limit(limit_count));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc, index) => ({
      rank: index + 1,
      userId: doc.id,
      username: doc.data().displayName || 'Anonymous',
      xp: doc.data().totalXP || 0,
      level: getUserLevelFromXP(doc.data().totalXP || 0),
      coins: doc.data().totalCoins || 0,
    }));
  } catch (error) {
    console.error('Error getting XP leaderboard:', error);
    return [];
  }
}

/**
 * Log reward activity
 */
async function logReward(userId, type, amount, reason = '') {
  try {
    const rewardLog = doc(db, 'rewardLogs', `${userId}_${Date.now()}`);
    await setDoc(rewardLog, {
      userId,
      type, // 'xp' | 'coins' | 'badge' | 'achievement'
      amount,
      reason,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error logging reward:', error);
  }
}

/**
 * Batch award rewards (for multiple users or achievements)
 */
export async function batchAwardRewards(rewards) {
  try {
    const results = [];
    for (const reward of rewards) {
      const result = await awardXP(reward.userId, reward.xp, reward.reason);
      if (reward.coins) {
        await awardCoins(reward.userId, reward.coins, reward.reason);
      }
      results.push(result);
    }
    return results;
  } catch (error) {
    console.error('Error batch awarding rewards:', error);
    return [];
  }
}

/**
 * Get user's recent rewards
 */
export async function getUserRecentRewards(userId, limit_count = 10) {
  try {
    const rewardLogsRef = collection(db, 'rewardLogs');
    const q = query(
      rewardLogsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limit_count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error('Error getting user recent rewards:', error);
    return [];
  }
}

/**
 * Check and award achievement based on trigger
 */
export async function checkAchievementTrigger(userId, trigger, data) {
  try {
    const matchingAchievements = Object.values(EXTENDED_ACHIEVEMENTS).filter(
      (a) => a.trigger === trigger
    );

    const results = [];
    for (const achievement of matchingAchievements) {
      // Custom logic per achievement
      let shouldUnlock = false;

      switch (trigger) {
        case 'puzzle_time':
          shouldUnlock = data.timeSeconds < 120; // Under 2 minutes
          break;
        case 'quiz_perfect':
          shouldUnlock = data.score === data.maxScore;
          break;
        case 'series_flawless':
          shouldUnlock = data.accuracy >= 0.9; // 90%+ accuracy
          break;
        case 'login_streak':
          shouldUnlock = data.streak >= (achievement.id === 'unstoppable' ? 30 : 7);
          break;
        case 'series_count':
          shouldUnlock = data.count >= 10;
          break;
        case 'puzzle_types':
          shouldUnlock = data.typesCompleted >= 4; // All puzzle types
          break;
        default:
          break;
      }

      if (shouldUnlock) {
        const result = await unlockAchievement(userId, achievement.id, achievement);
        results.push(result);
      }
    }

    return results;
  } catch (error) {
    console.error('Error checking achievement trigger:', error);
    return [];
  }
}

/**
 * Reset user's rewards (admin function)
 */
export async function resetUserRewards(userId) {
  try {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, {
      totalXP: 0,
      totalCoins: 0,
      currentLevel: 1,
    });

    await setDoc(doc(db, 'achievements', userId), {
      unlocked: [],
      updatedAt: new Date(),
    });

    await setDoc(doc(db, 'userBadges', userId), {
      badges: [],
      updatedAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error resetting user rewards:', error);
    return { success: false, error };
  }
}

export default {
  XP_CONFIG,
  COIN_CONFIG,
  EXTENDED_ACHIEVEMENTS,
  EXTENDED_LEVELS,
  calculateQuizXP,
  calculatePuzzleXP,
  calculateChallengeXP,
  awardXP,
  awardCoins,
  unlockBadge,
  unlockAchievement,
  getUserLevelFromXP,
  getXPForNextLevel,
  getUserRewardsProfile,
  getXPLeaderboard,
  batchAwardRewards,
  getUserRecentRewards,
  checkAchievementTrigger,
  resetUserRewards,
};
