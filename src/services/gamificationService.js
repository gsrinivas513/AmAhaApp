/**
 * Gamification System - Achievements & Badges
 * Tracks user progress and unlocks achievements
 */

import { db } from '../firebase/firebaseConfig';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, collection, getDocs, query, where } from 'firebase/firestore';

/**
 * Achievement definitions
 */
const ACHIEVEMENTS = {
  // Quiz achievements
  FIRST_QUIZ: {
    id: 'first_quiz',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🎯',
    badge: '🥇',
    xpReward: 50,
    coinsReward: 10,
    trigger: 'quiz_completed',
    condition: (stats) => stats.quizzesCompleted >= 1,
  },
  TEN_QUIZZES: {
    id: 'ten_quizzes',
    name: 'Quiz Warrior',
    description: 'Complete 10 quizzes',
    icon: '⚔️',
    badge: '🥈',
    xpReward: 200,
    coinsReward: 50,
    trigger: 'quiz_completed',
    condition: (stats) => stats.quizzesCompleted >= 10,
  },
  FIFTY_QUIZZES: {
    id: 'fifty_quizzes',
    name: 'Quiz Master',
    description: 'Complete 50 quizzes',
    icon: '🧠',
    badge: '🏆',
    xpReward: 500,
    coinsReward: 200,
    trigger: 'quiz_completed',
    condition: (stats) => stats.quizzesCompleted >= 50,
  },
  // Puzzle achievements
  FIRST_PUZZLE: {
    id: 'first_puzzle',
    name: 'Puzzle Starter',
    description: 'Solve your first puzzle',
    icon: '🧩',
    badge: '🥇',
    xpReward: 60,
    coinsReward: 15,
    trigger: 'puzzle_completed',
    condition: (stats) => stats.puzzlesSolved >= 1,
  },
  TEN_PUZZLES: {
    id: 'ten_puzzles',
    name: 'Puzzle Solver',
    description: 'Solve 10 puzzles',
    icon: '🧩',
    badge: '🥈',
    xpReward: 250,
    coinsReward: 75,
    trigger: 'puzzle_completed',
    condition: (stats) => stats.puzzlesSolved >= 10,
  },
  // Daily challenge achievements
  FIRST_CHALLENGE: {
    id: 'first_challenge',
    name: 'Daily Challenger',
    description: 'Complete a daily challenge',
    icon: '📅',
    badge: '⭐',
    xpReward: 40,
    coinsReward: 20,
    trigger: 'challenge_completed',
    condition: (stats) => stats.challengesCompleted >= 1,
  },
  WEEK_STREAK: {
    id: 'week_streak',
    name: 'Week Warrior',
    description: 'Complete challenges for 7 consecutive days',
    icon: '🔥',
    badge: '🔥',
    xpReward: 500,
    coinsReward: 300,
    trigger: 'streak_check',
    condition: (stats) => stats.currentStreak >= 7,
  },
  MONTH_STREAK: {
    id: 'month_streak',
    name: 'Month Master',
    description: 'Complete challenges for 30 consecutive days',
    icon: '🚀',
    badge: '🚀',
    xpReward: 2000,
    coinsReward: 1000,
    trigger: 'streak_check',
    condition: (stats) => stats.currentStreak >= 30,
  },
  // XP achievements
  HUNDRED_XP: {
    id: 'hundred_xp',
    name: 'Leveling Up',
    description: 'Earn 100 XP',
    icon: '⚡',
    badge: '⚡',
    xpReward: 100,
    coinsReward: 50,
    trigger: 'xp_check',
    condition: (stats) => stats.totalXP >= 100,
  },
  THOUSAND_XP: {
    id: 'thousand_xp',
    name: 'XP Legend',
    description: 'Earn 1000 XP',
    icon: '💎',
    badge: '💎',
    xpReward: 500,
    coinsReward: 250,
    trigger: 'xp_check',
    condition: (stats) => stats.totalXP >= 1000,
  },
};

/**
 * Level definitions (progression system)
 */
const LEVELS = [
  { level: 1, name: 'Novice', xpRequired: 0, icon: '🌱' },
  { level: 2, name: 'Apprentice', xpRequired: 100, icon: '📚' },
  { level: 3, name: 'Skilled', xpRequired: 300, icon: '⭐' },
  { level: 4, name: 'Expert', xpRequired: 600, icon: '🎖️' },
  { level: 5, name: 'Master', xpRequired: 1000, icon: '👑' },
  { level: 6, name: 'Legend', xpRequired: 2000, icon: '🏆' },
  { level: 7, name: 'Immortal', xpRequired: 5000, icon: '⚡' },
];

/**
 * Get user profile/stats for achievement checking
 */
async function getUserStats(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return {
        quizzesCompleted: 0,
        puzzlesSolved: 0,
        challengesCompleted: 0,
        totalXP: 0,
        totalCoins: 0,
        currentLevel: 1,
        currentStreak: 0,
        unlockedAchievements: [],
      };
    }
    return userDoc.data();
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
}

/**
 * Check and unlock achievements for a user
 */
export async function checkAndUnlockAchievements(userId) {
  try {
    const stats = await getUserStats(userId);
    if (!stats) return;

    const achievementsRef = doc(db, 'achievements', userId);
    const achievementsDoc = await getDoc(achievementsRef);
    const unlockedAchievements = achievementsDoc.exists() 
      ? (achievementsDoc.data().unlocked || [])
      : [];

    const newlyUnlocked = [];

    // Check each achievement
    for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
      // Skip if already unlocked
      if (unlockedAchievements.includes(achievement.id)) continue;

      // Check if condition is met
      if (achievement.condition(stats)) {
        newlyUnlocked.push(achievement);

        // Update XP and coins
        await updateUserRewards(userId, achievement.xpReward, achievement.coinsReward);
      }
    }

    // Save unlocked achievements
    if (newlyUnlocked.length > 0) {
      const newIds = newlyUnlocked.map((a) => a.id);
      await setDoc(
        achievementsRef,
        {
          unlocked: arrayUnion(...newIds),
          updatedAt: new Date(),
        },
        { merge: true }
      );
    }

    return newlyUnlocked;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
}

/**
 * Update user level based on XP
 */
export async function updateUserLevel(userId, totalXP) {
  try {
    let currentLevel = 1;
    for (const levelData of LEVELS) {
      if (totalXP >= levelData.xpRequired) {
        currentLevel = levelData.level;
      } else {
        break;
      }
    }

    // Update user document
    await updateDoc(doc(db, 'users', userId), {
      currentLevel,
      totalXP,
    });

    return currentLevel;
  } catch (error) {
    console.error('Error updating user level:', error);
  }
}

/**
 * Add XP and coins to user
 */
async function updateUserRewards(userId, xp, coins) {
  try {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, {
      totalXP: (await getDoc(userDoc)).data()?.totalXP + xp || xp,
      totalCoins: (await getDoc(userDoc)).data()?.totalCoins + coins || coins,
    });
  } catch (error) {
    console.error('Error updating rewards:', error);
  }
}

/**
 * Get all achievements
 */
export function getAllAchievements() {
  return Object.values(ACHIEVEMENTS);
}

/**
 * Get user achievements
 */
export async function getUserAchievements(userId) {
  try {
    const achievementsDoc = await getDoc(doc(db, 'achievements', userId));
    if (!achievementsDoc.exists()) return [];

    const unlockedIds = achievementsDoc.data().unlocked || [];
    return unlockedIds
      .map((id) => Object.values(ACHIEVEMENTS).find((a) => a.id === id))
      .filter(Boolean);
  } catch (error) {
    console.error('Error getting user achievements:', error);
    return [];
  }
}

/**
 * Get user level info
 */
export function getUserLevelInfo(level) {
  return LEVELS.find((l) => l.level === level) || LEVELS[0];
}

/**
 * Get all levels
 */
export function getAllLevels() {
  return LEVELS;
}

export default {
  ACHIEVEMENTS,
  LEVELS,
  checkAndUnlockAchievements,
  updateUserLevel,
  getUserAchievements,
  getUserLevelInfo,
  getAllAchievements,
  getAllLevels,
};
