/**
 * Daily Challenge Service
 * 
 * Manages daily challenges:
 * - Fetch today's challenge
 * - Track completion & streaks
 * - Calculate rewards
 * - Support guest + user flows
 * 
 * Firestore Collections Used:
 * - /daily_challenges/{dateISO}
 * - /daily_progress/{userId}/challenges/{dateISO}
 */

import { 
  db, 
  auth
} from '../firebase/firebaseConfig';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  updateDoc,
  increment
} from 'firebase/firestore';

/**
 * Get today's challenge for all users
 * Returns null if no active challenge for today
 */
export async function getTodayChallenge() {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const docRef = doc(db, 'daily_challenges', today);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching today challenge:', error);
    return null;
  }
}

/**
 * Get challenge for a specific date
 */
export async function getChallengeByDate(dateISO) {
  try {
    const docRef = doc(db, 'daily_challenges', dateISO);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching challenge by date:', error);
    return null;
  }
}

/**
 * Check if user has completed today's challenge
 */
export async function hasCompletedToday(userId) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const docRef = doc(db, `daily_progress/${userId}/challenges`, today);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() && docSnap.data().completed === true;
  } catch (error) {
    console.error('Error checking completion status:', error);
    return false;
  }
}

/**
 * Mark challenge as completed and award rewards
 * Updates:
 * - daily_progress document
 * - streak counter
 * - user XP and coins
 */
export async function markChallengeComplete(userId, score, xpEarned = 50, coinsEarned = 10) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Update daily progress
    const progressRef = doc(db, `daily_progress/${userId}/challenges`, today);
    await setDoc(progressRef, {
      userId,
      dateISO: today,
      completed: true,
      completedAt: Timestamp.now(),
      score,
      xpEarned,
      coinsEarned,
      attempts: 1
    }, { merge: true });

    // Update streak
    await updateStreak(userId, today);

    // Award XP and coins to user
    await awardRewards(userId, xpEarned, coinsEarned);

    return {
      success: true,
      message: 'Challenge completed!',
      xpEarned,
      coinsEarned
    };
  } catch (error) {
    console.error('Error marking challenge complete:', error);
    throw error;
  }
}

/**
 * Update user streak
 * - Increment if consecutive day
 * - Reset if missed day
 */
async function updateStreak(userId, completionDate) {
  try {
    const streakRef = doc(db, 'streaks', userId);
    const streakSnap = await getDoc(streakRef);
    
    const today = new Date(completionDate);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISO = yesterday.toISOString().split('T')[0];

    let currentStreak = 1;
    let longestStreak = 1;

    if (streakSnap.exists()) {
      const data = streakSnap.data();
      const lastCompletedDate = data.lastCompletedDate;

      // Check if consecutive day
      if (lastCompletedDate === yesterdayISO) {
        currentStreak = (data.currentStreak || 0) + 1;
        longestStreak = Math.max(currentStreak, data.longestStreak || 1);
      } else if (lastCompletedDate === completionDate) {
        // Already completed today
        return;
      } else {
        // Streak broken, reset to 1
        currentStreak = 1;
        longestStreak = data.longestStreak || 1;
      }
    }

    await setDoc(streakRef, {
      userId,
      currentStreak,
      longestStreak,
      lastCompletedDate: completionDate,
      totalCompletions: increment(1),
      lastResetDate: streakSnap.exists() ? streakSnap.data().lastResetDate : completionDate,
      updatedAt: Timestamp.now()
    }, { merge: true });

  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
}

/**
 * Get user's current streak
 */
export async function getUserStreak(userId) {
  try {
    const streakRef = doc(db, 'streaks', userId);
    const streakSnap = await getDoc(streakRef);

    if (!streakSnap.exists()) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalCompletions: 0,
        lastCompletedDate: null
      };
    }

    const data = streakSnap.data();
    
    // Check if streak is still active (completed today or yesterday)
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISO = yesterday.toISOString().split('T')[0];

    let activeStreak = data.currentStreak || 0;
    if (data.lastCompletedDate !== today && data.lastCompletedDate !== yesterdayISO) {
      activeStreak = 0;
    }

    return {
      currentStreak: activeStreak,
      longestStreak: data.longestStreak || 0,
      totalCompletions: data.totalCompletions || 0,
      lastCompletedDate: data.lastCompletedDate || null
    };
  } catch (error) {
    console.error('Error fetching user streak:', error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      lastCompletedDate: null
    };
  }
}

/**
 * Get guest streak from localStorage
 */
export function getGuestStreak(guestId) {
  try {
    const streakKey = `daily_streak_${guestId}`;
    const data = localStorage.getItem(streakKey);
    
    if (!data) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: null
      };
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Error fetching guest streak:', error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null
    };
  }
}

/**
 * Save guest challenge completion to localStorage
 */
export function saveGuestChallengeCompletion(guestId, score) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const completionKey = `daily_challenge_${today}`;
    const streakKey = `daily_streak_${guestId}`;

    // Save completion
    localStorage.setItem(completionKey, JSON.stringify({
      guestId,
      completed: true,
      completedAt: new Date().toISOString(),
      score
    }));

    // Update streak
    const streakData = getGuestStreak(guestId);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISO = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    if (streakData.lastCompletedDate === yesterdayISO) {
      newStreak = (streakData.currentStreak || 0) + 1;
    }

    const updatedStreak = {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, streakData.longestStreak || 0),
      lastCompletedDate: today
    };

    localStorage.setItem(streakKey, JSON.stringify(updatedStreak));

    return {
      success: true,
      currentStreak: newStreak
    };
  } catch (error) {
    console.error('Error saving guest challenge:', error);
    return { success: false };
  }
}

/**
 * Get guest challenge completion status
 */
export function getGuestChallengeCompletion(guestId) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const completionKey = `daily_challenge_${today}`;
    const data = localStorage.getItem(completionKey);

    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Error fetching guest challenge completion:', error);
    return null;
  }
}

/**
 * Check if user can complete today's challenge
 * Prevents multiple completions per day
 */
export async function canCompleteTodaysChallenge(userId) {
  try {
    return !(await hasCompletedToday(userId));
  } catch (error) {
    console.error('Error checking if can complete:', error);
    return true; // Allow if error
  }
}

/**
 * Reset user's streak (admin only)
 */
export async function resetUserStreak(userId) {
  try {
    const streakRef = doc(db, 'streaks', userId);
    await setDoc(streakRef, {
      userId,
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      totalCompletions: 0,
      lastResetDate: new Date().toISOString().split('T')[0],
      resetAt: Timestamp.now()
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Error resetting streak:', error);
    throw error;
  }
}

/**
 * Get user's challenge history
 */
export async function getUserChallengeHistory(userId, limit = 30) {
  try {
    const collectionRef = collection(db, `daily_progress/${userId}/challenges`);
    const q = query(collectionRef, orderBy('dateISO', 'desc'));
    const querySnapshot = await getDocs(q);

    const challenges = [];
    querySnapshot.forEach((doc) => {
      if (challenges.length < limit) {
        challenges.push({
          id: doc.id,
          ...doc.data()
        });
      }
    });

    return challenges;
  } catch (error) {
    console.error('Error fetching challenge history:', error);
    return [];
  }
}

/**
 * Award XP and coins to user
 * NOTE: This is a simplified version. In production, validate against rewardGuard
 */
async function awardRewards(userId, xp, coins) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      totalXp: increment(xp),
      totalCoins: increment(coins),
      lastRewardDate: Timestamp.now()
    });
  } catch (error) {
    console.error('Error awarding rewards:', error);
    // Don't throw - rewards failure shouldn't block completion
  }
}

/**
 * Create/update daily challenge (admin only)
 */
export async function createDailyChallenge(dateISO, challengeData) {
  try {
    const docRef = doc(db, 'daily_challenges', dateISO);
    await setDoc(docRef, {
      dateISO,
      ...challengeData,
      active: true,
      createdAt: Timestamp.now(),
      completionCount: 0
    }, { merge: true });

    return { success: true, id: dateISO };
  } catch (error) {
    console.error('Error creating daily challenge:', error);
    throw error;
  }
}

/**
 * Get upcoming challenges
 */
export async function getUpcomingChallenges(days = 7) {
  try {
    const today = new Date();
    const challenges = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateISO = date.toISOString().split('T')[0];
      
      const challenge = await getChallengeByDate(dateISO);
      if (challenge) {
        challenges.push(challenge);
      }
    }

    return challenges;
  } catch (error) {
    console.error('Error fetching upcoming challenges:', error);
    return [];
  }
}

/**
 * Merge guest progress to user on login
 */
export async function mergeGuestProgressToUser(userId, guestId) {
  try {
    const guestCompletion = getGuestChallengeCompletion(guestId);
    const guestStreak = getGuestStreak(guestId);

    if (guestCompletion) {
      // Migrate guest completion to user
      const today = new Date().toISOString().split('T')[0];
      const progressRef = doc(db, `daily_progress/${userId}/challenges`, today);
      
      await setDoc(progressRef, {
        userId,
        dateISO: today,
        completed: true,
        completedAt: Timestamp.now(),
        score: guestCompletion.score,
        migratedFromGuest: true,
        originalGuestId: guestId
      }, { merge: true });
    }

    if (guestStreak.currentStreak > 0) {
      // Migrate streak (take max of both)
      const userStreak = await getUserStreak(userId);
      const streakRef = doc(db, 'streaks', userId);

      await setDoc(streakRef, {
        userId,
        currentStreak: Math.max(guestStreak.currentStreak, userStreak.currentStreak),
        longestStreak: Math.max(guestStreak.longestStreak, userStreak.longestStreak),
        lastCompletedDate: guestStreak.lastCompletedDate,
        totalCompletions: increment(guestStreak.currentStreak || 0),
        migratedFromGuest: true
      }, { merge: true });
    }

    // Clear guest data
    localStorage.removeItem(`daily_streak_${guestId}`);

    return { success: true, message: 'Guest progress merged!' };
  } catch (error) {
    console.error('Error merging guest progress:', error);
    throw error;
  }
}
