import { db } from '../firebase/firebaseConfig';
import { doc, setDoc, getDoc, updateDoc, increment, arrayUnion, getDocs, collection, query, where, orderBy, limit } from 'firebase/firestore';

// ============================================================================
// DAILY CHALLENGES CONFIGURATION
// ============================================================================

export const CHALLENGE_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  SPECIAL: 'special',
};

export const DAILY_CHALLENGE_CONFIG = {
  resetTime: '00:00', // UTC midnight
  bonusXPMultiplier: 1.5,
  streakBonusPerDay: 50,
  maxStreakDays: 365,
  difficultyProgression: {
    day1to3: 'easy',
    day4to7: 'medium',
    day8to14: 'hard',
    day15plus: 'expert',
  },
  rewardTiers: {
    easy: { xp: 150, coins: 30, bonus: 75 },
    medium: { xp: 250, coins: 50, bonus: 125 },
    hard: { xp: 350, coins: 75, bonus: 175 },
    expert: { xp: 500, coins: 100, bonus: 250 },
  },
};

// ============================================================================
// USER PROFILE CONFIGURATION
// ============================================================================

export const USER_PROFILE_FIELDS = {
  username: '',
  displayName: '',
  bio: '',
  avatar: '',
  theme: 'default',
  isPrivate: false,
  joinDate: null,
  lastActive: null,
  totalXP: 0,
  totalCoins: 0,
  currentLevel: 1,
  achievements: [],
  friends: [],
  blockedUsers: [],
  socialLinks: {
    twitter: '',
    instagram: '',
    website: '',
  },
};

export const AVATAR_OPTIONS = [
  { id: 1, emoji: '🧑', name: 'Person' },
  { id: 2, emoji: '🎮', name: 'Gamer' },
  { id: 3, emoji: '🧠', name: 'Brain' },
  { id: 4, emoji: '🚀', name: 'Rocket' },
  { id: 5, emoji: '⭐', name: 'Star' },
  { id: 6, emoji: '🔥', name: 'Fire' },
  { id: 7, emoji: '💎', name: 'Diamond' },
  { id: 8, emoji: '🏆', name: 'Trophy' },
];

export const THEME_OPTIONS = [
  { id: 'default', name: 'Default', color: '#667eea' },
  { id: 'dark', name: 'Dark', color: '#1a1a1a' },
  { id: 'ocean', name: 'Ocean', color: '#0066cc' },
  { id: 'forest', name: 'Forest', color: '#228B22' },
  { id: 'sunset', name: 'Sunset', color: '#ff6b35' },
  { id: 'candy', name: 'Candy', color: '#ff69b4' },
];

// ============================================================================
// STORY MODE CONFIGURATION
// ============================================================================

export const STORY_MODE_CONFIG = {
  chapters: 5,
  levelsPerChapter: 10,
  progressionCurve: 'exponential', // Difficulty increases exponentially
  unlockRequirements: {
    nextLevel: 80, // 80% accuracy required
    nextChapter: 85,
  },
  storyRewards: {
    chapterComplete: { xp: 500, coins: 100, badge: true },
    levelComplete: { xp: 100, coins: 20 },
  },
};

export const STORY_CHAPTERS = [
  {
    id: 1,
    title: 'The Beginning',
    description: 'Start your puzzle journey with basic challenges',
    icon: '🌱',
    startingDifficulty: 'easy',
    levels: 10,
  },
  {
    id: 2,
    title: 'Rising Challenge',
    description: 'Face increasingly complex puzzles',
    icon: '📈',
    startingDifficulty: 'easy',
    levels: 10,
  },
  {
    id: 3,
    title: 'The Peak',
    description: 'Master intermediate puzzle solving',
    icon: '⛰️',
    startingDifficulty: 'medium',
    levels: 10,
  },
  {
    id: 4,
    title: 'Expert Territory',
    description: 'Only the best can advance here',
    icon: '🔥',
    startingDifficulty: 'hard',
    levels: 10,
  },
  {
    id: 5,
    title: 'The Ultimate Challenge',
    description: 'The peak of puzzle mastery',
    icon: '👑',
    startingDifficulty: 'expert',
    levels: 10,
  },
];

// ============================================================================
// PRACTICE MODE CONFIGURATION
// ============================================================================

export const PRACTICE_MODE_CONFIG = {
  spaceRepetitionIntervals: [1, 3, 7, 14, 30], // Days between reviews
  difficultyAdjustment: {
    increaseAt: 0.9, // 90% success rate
    decreaseAt: 0.6, // 60% success rate
  },
  adaptiveAlgorithm: 'sm2', // Spaced Repetition - SM2 algorithm
  retentionTarget: 0.9, // Target 90% retention
  reviewLimit: 10, // Max reviews per session
};

// ============================================================================
// SHOP CONFIGURATION
// ============================================================================

export const COSMETIC_SHOP = {
  themes: [
    { id: 'theme-dark', name: 'Dark Theme Pack', cost: 500, category: 'theme', items: ['dark'] },
    { id: 'theme-ocean', name: 'Ocean Theme Pack', cost: 500, category: 'theme', items: ['ocean'] },
    { id: 'theme-forest', name: 'Forest Theme Pack', cost: 500, category: 'theme', items: ['forest'] },
    { id: 'theme-sunset', name: 'Sunset Theme Pack', cost: 500, category: 'theme', items: ['sunset'] },
    { id: 'theme-candy', name: 'Candy Theme Pack', cost: 500, category: 'theme', items: ['candy'] },
  ],
  avatars: AVATAR_OPTIONS.map((avatar, idx) => ({
    id: `avatar-${idx}`,
    name: `${avatar.name} Avatar`,
    cost: idx === 0 ? 0 : 250,
    category: 'avatar',
    emoji: avatar.emoji,
    locked: idx !== 0,
  })),
  badges: [
    { id: 'speedster', name: 'Speed Solver Badge', cost: 750, category: 'badge' },
    { id: 'perfect', name: 'Perfect Score Badge', cost: 1000, category: 'badge' },
    { id: 'streak', name: 'Streak Champion Badge', cost: 500, category: 'badge' },
  ],
  frames: [
    { id: 'frame-gold', name: 'Gold Frame', cost: 1000, category: 'frame' },
    { id: 'frame-platinum', name: 'Platinum Frame', cost: 2000, category: 'frame' },
    { id: 'frame-diamond', name: 'Diamond Frame', cost: 5000, category: 'frame' },
  ],
};

// ============================================================================
// MULTIPLAYER CONFIGURATION
// ============================================================================

export const MULTIPLAYER_CONFIG = {
  modes: ['classic', 'timed', 'survival'],
  maxPlayersPerMatch: 4,
  minPlayersToStart: 2,
  matchTimeout: 3600000, // 1 hour in milliseconds
  ratingSystem: 'elo',
  baseRating: 1000,
  kFactor: 32,
  eloFormula: (ratingDiff, kFactor) => {
    const expectedScore = 1 / (1 + Math.pow(10, -ratingDiff / 400));
    return Math.round(kFactor * (1 - expectedScore));
  },
};

// ============================================================================
// ANALYTICS CONFIGURATION
// ============================================================================

export const ANALYTICS_CONFIG = {
  trackingEnabled: true,
  dataRetention: 365, // Days
  metrics: [
    'puzzleCompletion',
    'averageTime',
    'accuracy',
    'streakData',
    'userProgression',
    'achievementUnlocks',
  ],
  reportFrequency: 'daily',
};

// ============================================================================
// DAILY CHALLENGE OPERATIONS
// ============================================================================

export async function getDailyChallenge(userId, date = new Date()) {
  try {
    const challengeRef = doc(db, `users/${userId}/dailyChallenges`, date.toISOString().split('T')[0]);
    const challengeDoc = await getDoc(challengeRef);

    if (challengeDoc.exists()) {
      return challengeDoc.data();
    }

    // Generate new daily challenge
    const difficulty = getChallengeDifficulty(userId);
    const puzzleType = ['crossword', 'sudoku', 'word-search'][Math.floor(Math.random() * 3)];
    
    const challenge = {
      date: date.toISOString().split('T')[0],
      puzzleType,
      difficulty,
      expiresAt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
      completed: false,
      score: 0,
      startedAt: null,
      completedAt: null,
      rewards: DAILY_CHALLENGE_CONFIG.rewardTiers[difficulty],
    };

    await setDoc(challengeRef, challenge);
    return challenge;
  } catch (error) {
    console.error('Error getting daily challenge:', error);
    return null;
  }
}

export async function completeDailyChallenge(userId, date, score, timeSpent) {
  try {
    const dateStr = date.toISOString().split('T')[0];
    const challengeRef = doc(db, `users/${userId}/dailyChallenges`, dateStr);
    
    await updateDoc(challengeRef, {
      completed: true,
      score,
      completedAt: new Date(),
    });

    // Update streak
    await updateUserStreak(userId);

    return { success: true };
  } catch (error) {
    console.error('Error completing daily challenge:', error);
    return { success: false, error: error.message };
  }
}

export async function updateUserStreak(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return;

    const lastChallengeDate = userDoc.data().lastChallengeDate;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let newStreak = userDoc.data().challengeStreak || 0;

    if (lastChallengeDate === today) {
      // Already completed today
      return;
    } else if (lastChallengeDate === yesterday) {
      // Continue streak
      newStreak += 1;
    } else {
      // Streak broken, start new
      newStreak = 1;
    }

    await updateDoc(userRef, {
      challengeStreak: newStreak,
      lastChallengeDate: today,
      totalChallengesCompleted: increment(1),
    });
  } catch (error) {
    console.error('Error updating streak:', error);
  }
}

function getChallengeDifficulty(userId) {
  // Should fetch user streak and determine difficulty
  // For now, return medium as default
  return 'medium';
}

// ============================================================================
// USER PROFILE OPERATIONS
// ============================================================================

export async function getUserProfile(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export async function updateUserProfile(userId, updates) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
}

export async function addFriend(userId, friendId) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      friends: arrayUnion(friendId),
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding friend:', error);
    return { success: false, error: error.message };
  }
}

export async function getFriendsList(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return [];

    const friendIds = userDoc.data().friends || [];
    const friends = [];

    for (const friendId of friendIds) {
      const friendDoc = await getDoc(doc(db, 'users', friendId));
      if (friendDoc.exists()) {
        friends.push({
          id: friendId,
          ...friendDoc.data(),
        });
      }
    }

    return friends;
  } catch (error) {
    console.error('Error getting friends list:', error);
    return [];
  }
}

// ============================================================================
// ANALYTICS OPERATIONS
// ============================================================================

export async function trackPuzzleCompletion(userId, puzzleData) {
  try {
    const timestamp = new Date();
    const analyticsRef = doc(db, `users/${userId}/analytics`, timestamp.toISOString());

    await setDoc(analyticsRef, {
      type: 'puzzleCompletion',
      puzzleType: puzzleData.type,
      difficulty: puzzleData.difficulty,
      timeSpent: puzzleData.timeSpent,
      score: puzzleData.score,
      accuracy: puzzleData.accuracy,
      timestamp,
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking puzzle completion:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserAnalytics(userId) {
  try {
    const analyticsRef = collection(db, `users/${userId}/analytics`);
    const q = query(analyticsRef, orderBy('timestamp', 'desc'), limit(100));
    const snapshot = await getDocs(q);

    const analytics = [];
    snapshot.forEach((doc) => {
      analytics.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return analytics;
  } catch (error) {
    console.error('Error getting analytics:', error);
    return [];
  }
}

// ============================================================================
// SHOP OPERATIONS
// ============================================================================

export async function purchaseCosmetic(userId, cosmeticId, cost) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' };
    }

    const currentCoins = userDoc.data().totalCoins || 0;

    if (currentCoins < cost) {
      return { success: false, error: 'Insufficient coins' };
    }

    // Deduct coins and add cosmetic
    await updateDoc(userRef, {
      totalCoins: increment(-cost),
      ownedCosmetics: arrayUnion(cosmeticId),
    });

    return { success: true };
  } catch (error) {
    console.error('Error purchasing cosmetic:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// CONTENT MANAGEMENT
// ============================================================================

export async function createPuzzleForAdmin(adminId, puzzleData) {
  try {
    const puzzleId = `puzzle-${Date.now()}`;
    const puzzleRef = doc(db, 'puzzles', puzzleId);

    await setDoc(puzzleRef, {
      id: puzzleId,
      ...puzzleData,
      createdBy: adminId,
      createdAt: new Date(),
      published: false,
      statistics: {
        completions: 0,
        averageTime: 0,
        averageScore: 0,
      },
    });

    return { success: true, puzzleId };
  } catch (error) {
    console.error('Error creating puzzle:', error);
    return { success: false, error: error.message };
  }
}

export async function publishPuzzle(puzzleId) {
  try {
    const puzzleRef = doc(db, 'puzzles', puzzleId);
    await updateDoc(puzzleRef, {
      published: true,
      publishedAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error publishing puzzle:', error);
    return { success: false, error: error.message };
  }
}

export default {
  CHALLENGE_TYPES,
  DAILY_CHALLENGE_CONFIG,
  USER_PROFILE_FIELDS,
  STORY_MODE_CONFIG,
  PRACTICE_MODE_CONFIG,
  COSMETIC_SHOP,
  MULTIPLAYER_CONFIG,
  ANALYTICS_CONFIG,
  getDailyChallenge,
  completeDailyChallenge,
  updateUserStreak,
  getUserProfile,
  updateUserProfile,
  addFriend,
  getFriendsList,
  trackPuzzleCompletion,
  getUserAnalytics,
  purchaseCosmetic,
  createPuzzleForAdmin,
  publishPuzzle,
};
