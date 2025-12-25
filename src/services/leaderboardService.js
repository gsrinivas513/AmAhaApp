/**
 * Leaderboard Service
 * 
 * Manages leaderboards:
 * - Daily, weekly, category-wise rankings
 * - Guest + user scores
 * - Real-time updates
 * - Rank calculations
 * 
 * Firestore Collections Used:
 * - /leaderboards/{period}/{categoryId}/users/{userId}
 * - /leaderboards/{period}/global/guests/{guestId}
 */

import {
  db
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
  limit,
  Timestamp,
  updateDoc,
  increment,
  deleteDoc,
  collectionGroup
} from 'firebase/firestore';

/**
 * Update leaderboard score for a user
 * Called after quiz/puzzle completion
 */
export async function updateLeaderboardScore(userId, categoryId, score, metadata = {}) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const week = getWeekId(new Date());
    
    // Update daily leaderboard
    await updateLeaderboardEntry(userId, 'daily', categoryId, score, metadata);
    
    // Update weekly leaderboard
    await updateLeaderboardEntry(userId, 'weekly', categoryId, score, metadata);
    
    // Update category-specific leaderboard
    await updateLeaderboardEntry(userId, 'category', categoryId, score, metadata);
    
    // Update global leaderboard
    await updateLeaderboardEntry(userId, 'global', 'global', score, metadata);

    return { success: true };
  } catch (error) {
    console.error('Error updating leaderboard score:', error);
    throw error;
  }
}

/**
 * Update a single leaderboard entry
 */
async function updateLeaderboardEntry(userId, period, categoryId, score, metadata) {
  try {
    const docRef = doc(db, `leaderboards/${period}/${categoryId}/users`, userId);
    const docSnap = await getDoc(docRef);

    const updateData = {
      userId,
      score: increment(score),
      gamesPlayed: increment(1),
      lastPlayed: Timestamp.now(),
      accuracy: calculateAccuracy(
        docSnap.exists() ? docSnap.data().accuracy : 0,
        docSnap.exists() ? docSnap.data().gamesPlayed : 0,
        score
      ),
      timestamp: Timestamp.now()
    };

    // Add metadata if provided
    if (metadata.userName) updateData.displayName = metadata.userName;
    if (metadata.avatar) updateData.avatar = metadata.avatar;

    await setDoc(docRef, updateData, { merge: true });
  } catch (error) {
    console.error('Error updating leaderboard entry:', error);
    throw error;
  }
}

/**
 * Get leaderboard for a period and category
 */
export async function getLeaderboard(period = 'daily', categoryId = 'global', limitCount = 50) {
  try {
    const collectionRef = collection(db, `leaderboards/${period}/${categoryId}/users`);
    const q = query(
      collectionRef,
      orderBy('score', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const leaderboard = [];

    querySnapshot.forEach((doc, index) => {
      leaderboard.push({
        rank: index + 1,
        ...doc.data()
      });
    });

    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    
    // Fallback: return empty leaderboard if index doesn't exist
    return [];
  }
}

/**
 * Get leaderboard with pagination
 */
export async function getLeaderboardPaginated(period = 'daily', categoryId = 'global', pageSize = 20, pageNumber = 1) {
  try {
    const collectionRef = collection(db, `leaderboards/${period}/${categoryId}/users`);
    const q = query(
      collectionRef,
      orderBy('score', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const allUsers = [];

    querySnapshot.forEach((doc) => {
      allUsers.push({
        ...doc.data()
      });
    });

    // Paginate in memory
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = allUsers.slice(startIndex, endIndex);

    // Add ranks
    const leaderboard = paginatedUsers.map((user, index) => ({
      rank: startIndex + index + 1,
      ...user
    }));

    return {
      leaderboard,
      totalUsers: allUsers.length,
      pageNumber,
      pageSize,
      totalPages: Math.ceil(allUsers.length / pageSize),
      hasMore: endIndex < allUsers.length
    };
  } catch (error) {
    console.error('Error fetching paginated leaderboard:', error);
    return {
      leaderboard: [],
      totalUsers: 0,
      pageNumber,
      pageSize,
      totalPages: 0,
      hasMore: false
    };
  }
}

/**
 * Get user's rank in a leaderboard
 */
export async function getUserRank(userId, period = 'daily', categoryId = 'global') {
  try {
    const userRef = doc(db, `leaderboards/${period}/${categoryId}/users`, userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    const userData = userSnap.data();

    // Get all users above this user
    const collectionRef = collection(db, `leaderboards/${period}/${categoryId}/users`);
    const q = query(
      collectionRef,
      where('score', '>', userData.score),
      orderBy('score', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const rank = querySnapshot.size + 1;

    return {
      userId,
      rank,
      score: userData.score,
      displayName: userData.displayName || 'Anonymous',
      gamesPlayed: userData.gamesPlayed || 0,
      accuracy: userData.accuracy || 0,
      avatar: userData.avatar || null
    };
  } catch (error) {
    console.error('Error fetching user rank:', error);
    return null;
  }
}

/**
 * Get top players by category
 */
export async function getTopPlayers(categoryId = 'global', limit = 10) {
  try {
    const leaderboard = await getLeaderboard('daily', categoryId, limit);
    return leaderboard;
  } catch (error) {
    console.error('Error fetching top players:', error);
    return [];
  }
}

/**
 * Get leaderboard for multiple categories
 */
export async function getMultipleCategoryLeaderboards(categoryIds, period = 'daily', limitPerCategory = 5) {
  try {
    const leaderboards = {};

    for (const categoryId of categoryIds) {
      leaderboards[categoryId] = await getLeaderboard(period, categoryId, limitPerCategory);
    }

    return leaderboards;
  } catch (error) {
    console.error('Error fetching multiple leaderboards:', error);
    return {};
  }
}

/**
 * Save guest leaderboard entry
 * Guests are stored temporarily in a separate collection
 */
export function saveGuestLeaderboardScore(guestId, categoryId, score, nickname = 'Guest') {
  try {
    const today = new Date().toISOString().split('T')[0];
    const guestLeaderboardKey = `leaderboard_guest_${today}_${categoryId}`;

    // Get existing entries
    const existingData = localStorage.getItem(guestLeaderboardKey);
    const entries = existingData ? JSON.parse(existingData) : [];

    // Find existing guest entry
    const existingIndex = entries.findIndex(e => e.guestId === guestId);

    if (existingIndex >= 0) {
      // Update existing
      entries[existingIndex] = {
        guestId,
        categoryId,
        score: Math.max(entries[existingIndex].score, score),
        nickname,
        timestamp: new Date().toISOString(),
        gamesPlayed: entries[existingIndex].gamesPlayed + 1
      };
    } else {
      // Add new
      entries.push({
        guestId,
        categoryId,
        score,
        nickname,
        timestamp: new Date().toISOString(),
        gamesPlayed: 1
      });
    }

    // Sort by score
    entries.sort((a, b) => b.score - a.score);

    // Keep only top 100
    const topEntries = entries.slice(0, 100);
    localStorage.setItem(guestLeaderboardKey, JSON.stringify(topEntries));

    // Find guest rank
    const rank = topEntries.findIndex(e => e.guestId === guestId) + 1;

    return { success: true, rank };
  } catch (error) {
    console.error('Error saving guest leaderboard score:', error);
    return { success: false };
  }
}

/**
 * Get guest leaderboard
 */
export function getGuestLeaderboard(categoryId = 'global', limit = 50) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const guestLeaderboardKey = `leaderboard_guest_${today}_${categoryId}`;

    const data = localStorage.getItem(guestLeaderboardKey);
    if (!data) return [];

    const entries = JSON.parse(data);
    return entries.slice(0, limit).map((entry, index) => ({
      rank: index + 1,
      ...entry
    }));
  } catch (error) {
    console.error('Error fetching guest leaderboard:', error);
    return [];
  }
}

/**
 * Get combined leaderboard (guests + users)
 * Guests shown separately or tagged
 */
export async function getCombinedLeaderboard(period = 'daily', categoryId = 'global', limitPerGroup = 25) {
  try {
    const userLeaderboard = await getLeaderboard(period, categoryId, limitPerGroup);
    const guestLeaderboard = getGuestLeaderboard(categoryId, limitPerGroup);

    // Tag and combine
    const combinedUsers = userLeaderboard.map(u => ({
      ...u,
      userType: 'registered'
    }));

    const combinedGuests = guestLeaderboard.map(g => ({
      ...g,
      userType: 'guest'
    }));

    // Merge and sort by score
    const combined = [...combinedUsers, ...combinedGuests]
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({
        ...entry,
        globalRank: index + 1
      }))
      .slice(0, limitPerGroup * 2);

    return combined;
  } catch (error) {
    console.error('Error fetching combined leaderboard:', error);
    return [];
  }
}

/**
 * Reset leaderboard for a period (admin only)
 * Typically called at week/month boundaries
 */
export async function resetLeaderboard(period, categoryId) {
  try {
    const collectionRef = collection(db, `leaderboards/${period}/${categoryId}/users`);
    const querySnapshot = await getDocs(collectionRef);

    // Delete all documents in batch
    const batch = [];
    querySnapshot.forEach((doc) => {
      batch.push(deleteDoc(doc.ref));
    });

    await Promise.all(batch);

    return { success: true, deletedCount: querySnapshot.size };
  } catch (error) {
    console.error('Error resetting leaderboard:', error);
    throw error;
  }
}

/**
 * Get leaderboard statistics
 */
export async function getLeaderboardStats(period = 'daily', categoryId = 'global') {
  try {
    const leaderboard = await getLeaderboard(period, categoryId, 1000);

    if (leaderboard.length === 0) {
      return {
        totalPlayers: 0,
        averageScore: 0,
        topScore: 0,
        averageAccuracy: 0
      };
    }

    const totalScore = leaderboard.reduce((sum, p) => sum + (p.score || 0), 0);
    const totalAccuracy = leaderboard.reduce((sum, p) => sum + (p.accuracy || 0), 0);
    const topScore = leaderboard[0]?.score || 0;

    return {
      totalPlayers: leaderboard.length,
      averageScore: Math.round(totalScore / leaderboard.length),
      topScore,
      averageAccuracy: Math.round(totalAccuracy / leaderboard.length),
      topPlayer: {
        userId: leaderboard[0]?.userId,
        displayName: leaderboard[0]?.displayName,
        score: leaderboard[0]?.score
      }
    };
  } catch (error) {
    console.error('Error fetching leaderboard stats:', error);
    return {
      totalPlayers: 0,
      averageScore: 0,
      topScore: 0,
      averageAccuracy: 0
    };
  }
}

/**
 * Helper: Calculate accuracy percentage
 * Simplified: use score as proxy for accuracy
 */
function calculateAccuracy(previousAccuracy, previousGames, newScore) {
  if (previousGames === 0) return newScore; // First game
  
  // Weight previous accuracy and new score
  const totalGames = previousGames + 1;
  return Math.round(
    (previousAccuracy * previousGames + newScore) / totalGames
  );
}

/**
 * Helper: Get week ID (ISO week)
 */
function getWeekId(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  const year = d.getUTCFullYear();
  return `${year}-W${String(weekNum).padStart(2, '0')}`;
}

/**
 * Merge guest leaderboard score to user on login
 */
export async function mergeGuestLeaderboardToUser(userId, guestId, categoryIds = []) {
  try {
    const today = new Date().toISOString().split('T')[0];
    let totalMerged = 0;

    // Get all guest leaderboard entries from localStorage
    for (const categoryId of categoryIds) {
      const guestLeaderboardKey = `leaderboard_guest_${today}_${categoryId}`;
      const data = localStorage.getItem(guestLeaderboardKey);

      if (data) {
        const entries = JSON.parse(data);
        const guestEntry = entries.find(e => e.guestId === guestId);

        if (guestEntry) {
          // Merge to user leaderboard
          await updateLeaderboardScore(userId, categoryId, guestEntry.score, {
            userName: guestEntry.nickname
          });
          totalMerged++;
        }
      }
    }

    // Clear guest data
    for (const categoryId of categoryIds) {
      localStorage.removeItem(`leaderboard_guest_${today}_${categoryId}`);
    }

    return { success: true, mergedCount: totalMerged };
  } catch (error) {
    console.error('Error merging guest leaderboard:', error);
    throw error;
  }
}

/**
 * Get leaderboard context for a user
 * Shows user's rank plus top players
 */
export async function getLeaderboardContext(userId, period = 'daily', categoryId = 'global') {
  try {
    const userRank = await getUserRank(userId, period, categoryId);
    const topPlayers = await getTopPlayers(categoryId, 10);

    return {
      userRank,
      topPlayers,
      userIsInTop: userRank && userRank.rank <= 10
    };
  } catch (error) {
    console.error('Error fetching leaderboard context:', error);
    return {
      userRank: null,
      topPlayers: [],
      userIsInTop: false
    };
  }
}
