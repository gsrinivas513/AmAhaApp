// src/services/userProgressService.js
// Service for tracking user progress in series and puzzles

import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection, 
  query, 
  where, 
  getDocs,
  increment,
  serverTimestamp,
  arrayUnion,
  arrayRemove 
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// ==================== USER PROGRESS TRACKING ====================

/**
 * Create or update user progress for a specific puzzle
 * @param {string} userId - User ID
 * @param {string} puzzleId - Puzzle ID
 * @param {object} progressData - {score, timeTaken, completed, attempts, puzzleType}
 */
export const recordPuzzleProgress = async (userId, puzzleId, progressData) => {
  try {
    const progressRef = doc(db, 'userProgress', `${userId}_${puzzleId}`);
    
    const data = {
      userId,
      puzzleId,
      score: progressData.score || 0,
      timeTaken: progressData.timeTaken || 0, // in seconds
      completed: progressData.completed || false,
      attempts: progressData.attempts || 1,
      puzzleType: progressData.puzzleType || 'unknown',
      completedAt: progressData.completed ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    };

    await setDoc(progressRef, data, { merge: true });
    return { id: `${userId}_${puzzleId}`, ...data };
  } catch (error) {
    console.error('Error recording puzzle progress:', error);
    throw error;
  }
};

/**
 * Get user's progress for a specific puzzle
 * @param {string} userId - User ID
 * @param {string} puzzleId - Puzzle ID
 */
export const getUserPuzzleProgress = async (userId, puzzleId) => {
  try {
    const progressRef = doc(db, 'userProgress', `${userId}_${puzzleId}`);
    const progressSnap = await getDoc(progressRef);
    
    if (progressSnap.exists()) {
      return { id: progressSnap.id, ...progressSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting puzzle progress:', error);
    throw error;
  }
};

/**
 * Get all puzzle progress for a user
 * @param {string} userId - User ID
 */
export const getUserAllProgress = async (userId) => {
  try {
    const q = query(
      collection(db, 'userProgress'),
      where('userId', '==', userId)
    );
    const progressSnap = await getDocs(q);
    
    const progress = [];
    progressSnap.forEach((doc) => {
      progress.push({ id: doc.id, ...doc.data() });
    });
    
    return progress.sort((a, b) => 
      (b.updatedAt?.toDate?.() || 0) - (a.updatedAt?.toDate?.() || 0)
    );
  } catch (error) {
    console.error('Error getting all progress:', error);
    throw error;
  }
};

// ==================== SERIES PROGRESS ====================

/**
 * Record user progress in a series
 * @param {string} userId - User ID
 * @param {string} seriesId - Series ID
 * @param {object} seriesProgressData - Progress metrics
 */
export const recordSeriesProgress = async (userId, seriesId, seriesProgressData) => {
  try {
    const seriesProgressRef = doc(db, 'seriesProgress', `${userId}_${seriesId}`);
    
    const data = {
      userId,
      seriesId,
      puzzlesCompleted: seriesProgressData.puzzlesCompleted || 0,
      totalPuzzles: seriesProgressData.totalPuzzles || 0,
      totalScore: seriesProgressData.totalScore || 0,
      totalTimeTaken: seriesProgressData.totalTimeTaken || 0,
      completedPuzzles: seriesProgressData.completedPuzzles || [],
      completionRate: seriesProgressData.completionRate || 0,
      avgScore: seriesProgressData.avgScore || 0,
      seriesCompleted: seriesProgressData.seriesCompleted || false,
      completedAt: seriesProgressData.seriesCompleted ? serverTimestamp() : null,
      startedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(seriesProgressRef, data, { merge: true });
    return { id: `${userId}_${seriesId}`, ...data };
  } catch (error) {
    console.error('Error recording series progress:', error);
    throw error;
  }
};

/**
 * Update series progress when a puzzle is completed
 * @param {string} userId - User ID
 * @param {string} seriesId - Series ID
 * @param {string} puzzleId - Puzzle ID
 * @param {number} score - Score achieved
 * @param {number} timeTaken - Time taken in seconds
 */
export const updateSeriesProgressWithPuzzle = async (userId, seriesId, puzzleId, score, timeTaken) => {
  try {
    const seriesProgressRef = doc(db, 'seriesProgress', `${userId}_${seriesId}`);
    const seriesProgressSnap = await getDoc(seriesProgressRef);
    
    const currentData = seriesProgressSnap.data() || {};
    const completedPuzzles = currentData.completedPuzzles || [];
    const isNewCompletion = !completedPuzzles.includes(puzzleId);
    
    const updateData = {
      totalScore: (currentData.totalScore || 0) + score,
      totalTimeTaken: (currentData.totalTimeTaken || 0) + timeTaken,
      updatedAt: serverTimestamp()
    };

    if (isNewCompletion) {
      updateData.puzzlesCompleted = (currentData.puzzlesCompleted || 0) + 1;
      updateData.completedPuzzles = arrayUnion(puzzleId);
    }

    // Calculate completion rate
    if (updateData.puzzlesCompleted !== undefined && currentData.totalPuzzles) {
      updateData.completionRate = (updateData.puzzlesCompleted / currentData.totalPuzzles) * 100;
      updateData.avgScore = updateData.totalScore / updateData.puzzlesCompleted;
    }

    await updateDoc(seriesProgressRef, updateData);
    return updateData;
  } catch (error) {
    console.error('Error updating series progress:', error);
    throw error;
  }
};

/**
 * Get user's progress in a specific series
 * @param {string} userId - User ID
 * @param {string} seriesId - Series ID
 */
export const getUserSeriesProgress = async (userId, seriesId) => {
  try {
    const progressRef = doc(db, 'seriesProgress', `${userId}_${seriesId}`);
    const progressSnap = await getDoc(progressRef);
    
    if (progressSnap.exists()) {
      return { id: progressSnap.id, ...progressSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting series progress:', error);
    throw error;
  }
};

/**
 * Get all series progress for a user
 * @param {string} userId - User ID
 */
export const getUserAllSeriesProgress = async (userId) => {
  try {
    const q = query(
      collection(db, 'seriesProgress'),
      where('userId', '==', userId)
    );
    const progressSnap = await getDocs(q);
    
    const progress = [];
    progressSnap.forEach((doc) => {
      progress.push({ id: doc.id, ...doc.data() });
    });
    
    return progress.sort((a, b) => 
      (b.updatedAt?.toDate?.() || 0) - (a.updatedAt?.toDate?.() || 0)
    );
  } catch (error) {
    console.error('Error getting all series progress:', error);
    throw error;
  }
};

// ==================== LEADERBOARD DATA ====================

/**
 * Get leaderboard for a specific series
 * @param {string} seriesId - Series ID
 * @param {number} limit - Number of top users (default 100)
 */
export const getSeriesLeaderboard = async (seriesId, limit = 100) => {
  try {
    const q = query(
      collection(db, 'seriesProgress'),
      where('seriesId', '==', seriesId)
    );
    const leaderboardSnap = await getDocs(q);
    
    const leaderboard = [];
    leaderboardSnap.forEach((doc) => {
      const data = doc.data();
      leaderboard.push({
        id: data.userId,
        ...data
      });
    });
    
    // Sort by total score (descending)
    return leaderboard
      .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
      .slice(0, limit)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
  } catch (error) {
    console.error('Error getting series leaderboard:', error);
    throw error;
  }
};

/**
 * Get user's rank in a series leaderboard
 * @param {string} userId - User ID
 * @param {string} seriesId - Series ID
 */
export const getUserRankInSeries = async (userId, seriesId) => {
  try {
    const leaderboard = await getSeriesLeaderboard(seriesId, 1000);
    const userEntry = leaderboard.find(entry => entry.id === userId);
    
    if (userEntry) {
      return {
        rank: userEntry.rank,
        totalScore: userEntry.totalScore,
        completionRate: userEntry.completionRate,
        totalUsers: leaderboard.length
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user rank:', error);
    throw error;
  }
};

/**
 * Get global leaderboard (all series combined)
 * @param {number} limit - Number of top users (default 100)
 */
export const getGlobalLeaderboard = async (limit = 100) => {
  try {
    const q = query(collection(db, 'userProgress'));
    const leaderboardSnap = await getDocs(q);
    
    const userScores = {};
    
    leaderboardSnap.forEach((doc) => {
      const data = doc.data();
      const userId = data.userId;
      
      if (!userScores[userId]) {
        userScores[userId] = {
          id: userId,
          totalScore: 0,
          totalTimeTaken: 0,
          totalPuzzles: 0,
          completedPuzzles: 0
        };
      }
      
      if (data.completed) {
        userScores[userId].totalScore += data.score || 0;
        userScores[userId].totalTimeTaken += data.timeTaken || 0;
        userScores[userId].completedPuzzles += 1;
      }
      userScores[userId].totalPuzzles += 1;
    });
    
    return Object.values(userScores)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
        completionRate: (entry.completedPuzzles / entry.totalPuzzles) * 100,
        avgScore: entry.completedPuzzles > 0 ? entry.totalScore / entry.completedPuzzles : 0
      }));
  } catch (error) {
    console.error('Error getting global leaderboard:', error);
    throw error;
  }
};

// ==================== ANALYTICS ====================

/**
 * Get series statistics
 * @param {string} seriesId - Series ID
 */
export const getSeriesStatistics = async (seriesId) => {
  try {
    const q = query(
      collection(db, 'seriesProgress'),
      where('seriesId', '==', seriesId)
    );
    const statsSnap = await getDocs(q);
    
    let totalUsers = 0;
    let totalScore = 0;
    let completedCount = 0;
    let avgCompletionRate = 0;
    let avgTimeTaken = 0;
    
    const userStats = [];
    
    statsSnap.forEach((doc) => {
      const data = doc.data();
      totalUsers++;
      totalScore += data.totalScore || 0;
      if (data.seriesCompleted) completedCount++;
      avgCompletionRate += data.completionRate || 0;
      avgTimeTaken += data.totalTimeTaken || 0;
      
      userStats.push(data);
    });
    
    const stats = {
      totalUsers,
      completedCount,
      completionRate: totalUsers > 0 ? (completedCount / totalUsers) * 100 : 0,
      avgScore: totalUsers > 0 ? totalScore / totalUsers : 0,
      avgCompletionRate: totalUsers > 0 ? avgCompletionRate / totalUsers : 0,
      avgTimeTaken: totalUsers > 0 ? avgTimeTaken / totalUsers : 0,
      totalScore
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting series statistics:', error);
    throw error;
  }
};

/**
 * Get user's achievements and badges
 * @param {string} userId - User ID
 */
export const getUserAchievements = async (userId) => {
  try {
    const allProgress = await getUserAllProgress(userId);
    const allSeriesProgress = await getUserAllSeriesProgress(userId);
    
    const achievements = [];
    
    // First puzzle completion
    if (allProgress.length > 0) {
      achievements.push({
        id: 'first_puzzle',
        name: 'First Steps',
        description: 'Complete your first puzzle',
        icon: '🎯',
        unlockedAt: allProgress[0]?.completedAt
      });
    }
    
    // 10 puzzles completed
    const completedCount = allProgress.filter(p => p.completed).length;
    if (completedCount >= 10) {
      achievements.push({
        id: 'ten_puzzles',
        name: 'Puzzle Master',
        description: 'Complete 10 puzzles',
        icon: '🌟',
        progress: completedCount
      });
    }
    
    // Series completed
    const completedSeries = allSeriesProgress.filter(p => p.seriesCompleted).length;
    if (completedSeries > 0) {
      achievements.push({
        id: 'series_champion',
        name: 'Series Champion',
        description: `Complete ${completedSeries} series`,
        icon: '🏆',
        progress: completedSeries
      });
    }
    
    // High score
    const maxScore = Math.max(...allProgress.map(p => p.score || 0), 0);
    if (maxScore >= 900) {
      achievements.push({
        id: 'high_scorer',
        name: 'Perfect Score',
        description: 'Achieve 90%+ on a puzzle',
        icon: '💯',
        progress: maxScore
      });
    }
    
    // Speed demon
    const fastCompletion = allProgress.find(p => p.completed && (p.timeTaken || 0) < 60);
    if (fastCompletion) {
      achievements.push({
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete a puzzle in under 1 minute',
        icon: '⚡',
        progress: fastCompletion.timeTaken
      });
    }
    
    return achievements.sort((a, b) => {
      // Unlocked achievements first
      if (a.unlockedAt && !b.unlockedAt) return -1;
      if (!a.unlockedAt && b.unlockedAt) return 1;
      return 0;
    });
  } catch (error) {
    console.error('Error getting achievements:', error);
    throw error;
  }
};

/**
 * Get detailed user analytics
 * @param {string} userId - User ID
 */
export const getUserAnalytics = async (userId) => {
  try {
    const allProgress = await getUserAllProgress(userId);
    const allSeriesProgress = await getUserAllSeriesProgress(userId);
    
    const completedPuzzles = allProgress.filter(p => p.completed);
    const totalScore = completedPuzzles.reduce((sum, p) => sum + (p.score || 0), 0);
    const totalTime = completedPuzzles.reduce((sum, p) => sum + (p.timeTaken || 0), 0);
    
    return {
      totalPuzzles: allProgress.length,
      completedPuzzles: completedPuzzles.length,
      completionRate: allProgress.length > 0 ? (completedPuzzles.length / allProgress.length) * 100 : 0,
      totalScore,
      avgScore: completedPuzzles.length > 0 ? totalScore / completedPuzzles.length : 0,
      totalTimeTaken: totalTime,
      avgTimeTaken: completedPuzzles.length > 0 ? totalTime / completedPuzzles.length : 0,
      seriesEnrolled: allSeriesProgress.length,
      seriesCompleted: allSeriesProgress.filter(s => s.seriesCompleted).length,
      lastActivity: allProgress[0]?.updatedAt,
      puzzleTypes: [...new Set(allProgress.map(p => p.puzzleType))],
      achievements: await getUserAchievements(userId)
    };
  } catch (error) {
    console.error('Error getting user analytics:', error);
    throw error;
  }
};

// ==================== LEADERBOARD VIEWS ====================

/**
 * Get different leaderboard views for a series
 * @param {string} seriesId - Series ID
 */
export const getSeriesLeaderboardViews = async (seriesId) => {
  try {
    const leaderboard = await getSeriesLeaderboard(seriesId, 1000);
    
    return {
      // Sorted by total score
      byScore: leaderboard
        .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
        .slice(0, 100)
        .map((entry, index) => ({ ...entry, rank: index + 1 })),
      
      // Sorted by completion rate
      byCompletion: leaderboard
        .sort((a, b) => (b.completionRate || 0) - (a.completionRate || 0))
        .slice(0, 100)
        .map((entry, index) => ({ ...entry, rank: index + 1 })),
      
      // Sorted by speed (lowest time)
      bySpeed: leaderboard
        .sort((a, b) => (a.totalTimeTaken || Infinity) - (b.totalTimeTaken || Infinity))
        .slice(0, 100)
        .map((entry, index) => ({ ...entry, rank: index + 1 })),
      
      // Sorted by average score per puzzle
      byAverage: leaderboard
        .map(entry => ({
          ...entry,
          avgScore: entry.puzzlesCompleted > 0 
            ? entry.totalScore / entry.puzzlesCompleted 
            : 0
        }))
        .sort((a, b) => b.avgScore - a.avgScore)
        .slice(0, 100)
        .map((entry, index) => ({ ...entry, rank: index + 1 }))
    };
  } catch (error) {
    console.error('Error getting leaderboard views:', error);
    throw error;
  }
};

/**
 * Get leaderboard statistics
 * @param {string} seriesId - Series ID
 */
export const getLeaderboardStats = async (seriesId) => {
  try {
    const leaderboard = await getSeriesLeaderboard(seriesId, 1000);
    
    if (leaderboard.length === 0) {
      return {
        totalParticipants: 0,
        averageScore: 0,
        medianScore: 0,
        highestScore: 0,
        averageCompletionRate: 0,
        completionDistribution: {
          completed: 0,
          partial: 0,
          notStarted: 0
        }
      };
    }
    
    const scores = leaderboard.map(e => e.totalScore || 0);
    const completionRates = leaderboard.map(e => e.completionRate || 0);
    
    const sortedScores = scores.sort((a, b) => a - b);
    const medianScore = sortedScores.length % 2 === 0
      ? (sortedScores[sortedScores.length / 2 - 1] + sortedScores[sortedScores.length / 2]) / 2
      : sortedScores[Math.floor(sortedScores.length / 2)];
    
    return {
      totalParticipants: leaderboard.length,
      averageScore: scores.reduce((a, b) => a + b, 0) / leaderboard.length,
      medianScore,
      highestScore: Math.max(...scores),
      averageCompletionRate: completionRates.reduce((a, b) => a + b, 0) / leaderboard.length,
      completionDistribution: {
        completed: leaderboard.filter(e => e.seriesCompleted).length,
        partial: leaderboard.filter(e => !e.seriesCompleted && e.puzzlesCompleted > 0).length,
        notStarted: leaderboard.filter(e => e.puzzlesCompleted === 0).length
      }
    };
  } catch (error) {
    console.error('Error getting leaderboard stats:', error);
    throw error;
  }
};

/**
 * Compare user against peers
 * @param {string} userId - User ID
 * @param {string} seriesId - Series ID
 */
export const compareUserToPeers = async (userId, seriesId) => {
  try {
    const userRank = await getUserRankInSeries(userId, seriesId);
    const leaderboard = await getSeriesLeaderboard(seriesId, 1000);
    const stats = await getLeaderboardStats(seriesId);
    
    if (!userRank) {
      return null;
    }
    
    const userEntry = leaderboard.find(e => e.id === userId);
    const userScore = userEntry?.totalScore || 0;
    const userCompletion = userEntry?.completionRate || 0;
    
    return {
      userRank: userRank.rank,
      totalParticipants: stats.totalParticipants,
      percentileRank: ((stats.totalParticipants - userRank.rank) / stats.totalParticipants) * 100,
      scoreVsAverage: userScore - stats.averageScore,
      completionVsAverage: userCompletion - stats.averageCompletionRate,
      scoreVsMedian: userScore - stats.medianScore,
      betterThanPercentage: ((stats.totalParticipants - userRank.rank) / stats.totalParticipants) * 100
    };
  } catch (error) {
    console.error('Error comparing user to peers:', error);
    throw error;
  }
};
