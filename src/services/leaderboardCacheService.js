/**
 * Leaderboard Cache Service
 * Implements client-side caching for leaderboard data
 * Provides instant display of leaderboard while syncing with Firestore
 * Handles offline scenarios with localStorage fallback
 * 
 * @module services/leaderboardCacheService
 */

/**
 * LeaderboardCache class
 * Manages in-memory and persistent caching of leaderboard data
 */
export class LeaderboardCache {
  constructor() {
    /**
     * In-memory cache: Map<category, leaderboardData>
     */
    this.cache = new Map();

    /**
     * Cache metadata: timestamp, source
     */
    this.cacheMetadata = new Map();

    /**
     * Cache validity duration (5 minutes)
     */
    this.cacheDurationMs = 5 * 60 * 1000;

    /**
     * Listener callbacks for cache updates
     */
    this.listeners = new Map();

    /**
     * Offline mode indicator
     */
    this.isOffline = false;

    this.initializeOfflineDetection();
  }

  /**
   * Initialize offline detection
   * @private
   */
  initializeOfflineDetection() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOffline = false;
        this.notifyListeners('online');
      });

      window.addEventListener('offline', () => {
        this.isOffline = true;
        this.notifyListeners('offline');
      });

      this.isOffline = !navigator.onLine;
    }
  }

  /**
   * Set leaderboard cache for category
   * @param {string} category - Leaderboard category
   * @param {object} data - Leaderboard data
   * @param {string} source - Data source ('firestore', 'buffer', etc.)
   */
  set(category, data, source = 'firestore') {
    if (!category || !data) return;

    this.cache.set(category, data);
    this.cacheMetadata.set(category, {
      timestamp: Date.now(),
      source,
      expiresAt: Date.now() + this.cacheDurationMs
    });

    // Persist to localStorage
    this.persistToStorage(category, data);

    // Notify listeners
    this.notifyListeners('update', { category, data, source });
  }

  /**
   * Get leaderboard from cache
   * @param {string} category - Leaderboard category
   * @returns {object|null} Leaderboard data or null if expired/missing
   */
  get(category) {
    const metadata = this.cacheMetadata.get(category);

    // Check if cache exists and is not expired
    if (metadata && Date.now() < metadata.expiresAt) {
      return this.cache.get(category);
    }

    // Try to restore from localStorage
    const stored = this.getFromStorage(category);
    if (stored) {
      this.cache.set(category, stored);
      this.cacheMetadata.set(category, {
        timestamp: Date.now(),
        source: 'localStorage',
        expiresAt: Date.now() + this.cacheDurationMs
      });
      return stored;
    }

    return null;
  }

  /**
   * Get specific user's rank in category
   * @param {string} category - Leaderboard category
   * @param {string} userId - User ID
   * @returns {number|null} User's rank or null if not found
   */
  getUserRank(category, userId) {
    const data = this.get(category);
    if (!data || !data.scores) return null;

    const sortedEntries = Object.entries(data.scores)
      .sort((a, b) => b[1] - a[1])
      .map(([uid], index) => ({ uid, rank: index + 1 }));

    const entry = sortedEntries.find(e => e.uid === userId);
    return entry ? entry.rank : null;
  }

  /**
   * Get user's score in category
   * @param {string} category - Leaderboard category
   * @param {string} userId - User ID
   * @returns {number|null} User's score or null
   */
  getUserScore(category, userId) {
    const data = this.get(category);
    if (!data || !data.scores) return null;
    return data.scores[userId] || null;
  }

  /**
   * Get top N users in category
   * @param {string} category - Leaderboard category
   * @param {number} limit - Number of top users (default: 10)
   * @returns {Array} Top users with scores
   */
  getTopUsers(category, limit = 10) {
    const data = this.get(category);
    if (!data || !data.scores) return [];

    return Object.entries(data.scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([userId, score], index) => ({
        rank: index + 1,
        userId,
        score
      }));
  }

  /**
   * Update user score in cache (for optimistic updates)
   * @param {string} category - Leaderboard category
   * @param {string} userId - User ID
   * @param {number} score - New score
   */
  updateUserScore(category, userId, score) {
    const data = this.get(category) || { scores: {} };

    if (!data.scores) data.scores = {};
    data.scores[userId] = score;

    this.set(category, data, 'local');
  }

  /**
   * Add points to user score in cache
   * @param {string} category - Leaderboard category
   * @param {string} userId - User ID
   * @param {number} points - Points to add
   */
  addPoints(category, userId, points) {
    const data = this.get(category) || { scores: {} };

    if (!data.scores) data.scores = {};
    const currentScore = data.scores[userId] || 0;
    const newScore = currentScore + points;

    this.set(category, { ...data, scores: { ...data.scores, [userId]: newScore } }, 'local');
  }

  /**
   * Check if cache is valid for category
   * @param {string} category - Leaderboard category
   * @returns {boolean} True if cache is fresh
   */
  isValid(category) {
    const metadata = this.cacheMetadata.get(category);
    if (!metadata) return false;
    return Date.now() < metadata.expiresAt;
  }

  /**
   * Get cache metadata
   * @param {string} category - Leaderboard category
   * @returns {object|null} Cache metadata
   */
  getMetadata(category) {
    return this.cacheMetadata.get(category) || null;
  }

  /**
   * Clear specific category cache
   * @param {string} category - Leaderboard category
   */
  clear(category) {
    this.cache.delete(category);
    this.cacheMetadata.delete(category);
    this.removeFromStorage(category);
  }

  /**
   * Clear all cache
   */
  clearAll() {
    this.cache.clear();
    this.cacheMetadata.clear();
    this.clearStorage();
  }

  /**
   * Subscribe to cache updates
   * @param {string} eventType - 'update', 'online', 'offline'
   * @param {Function} callback - Listener callback
   */
  subscribe(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType) || [];
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify listeners
   * @private
   */
  notifyListeners(eventType, data = null) {
    const listeners = this.listeners.get(eventType) || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (e) {
        console.error(`[LeaderboardCache] Listener error for ${eventType}:`, e);
      }
    });
  }

  /**
   * Persist cache to localStorage
   * @private
   */
  persistToStorage(category, data) {
    try {
      const key = `leaderboard_cache:${category}`;
      const value = JSON.stringify({
        data,
        timestamp: Date.now()
      });
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[LeaderboardCache] Error persisting to storage:`, e);
    }
  }

  /**
   * Restore cache from localStorage
   * @private
   */
  getFromStorage(category) {
    try {
      const key = `leaderboard_cache:${category}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if stored data is within 24 hours
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          return parsed.data;
        }
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[LeaderboardCache] Error reading from storage:`, e);
    }
    return null;
  }

  /**
   * Remove specific cache from storage
   * @private
   */
  removeFromStorage(category) {
    try {
      const key = `leaderboard_cache:${category}`;
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[LeaderboardCache] Error removing from storage:`, e);
    }
  }

  /**
   * Clear all storage
   * @private
   */
  clearStorage() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('leaderboard_cache:')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn(`[LeaderboardCache] Error clearing storage:`, e);
    }
  }

  /**
   * Get cache stats
   * @returns {object} Cache statistics
   */
  getStats() {
    const entries = Array.from(this.cache.keys());
    let validCount = 0;
    let expiredCount = 0;

    entries.forEach(category => {
      if (this.isValid(category)) {
        validCount++;
      } else {
        expiredCount++;
      }
    });

    return {
      totalEntries: entries.length,
      validEntries: validCount,
      expiredEntries: expiredCount,
      categories: entries,
      isOffline: this.isOffline,
      cacheDurationMs: this.cacheDurationMs
    };
  }

  /**
   * Set cache duration
   * @param {number} durationMs - Duration in milliseconds
   */
  setCacheDuration(durationMs) {
    this.cacheDurationMs = durationMs;
  }
}

/**
 * Global leaderboard cache instance
 */
export const leaderboardCache = new LeaderboardCache();

/**
 * Convenience functions using global cache
 */

/**
 * Get leaderboard from cache
 * @param {string} category - Category
 * @returns {object|null}
 */
export function getLeaderboard(category) {
  return leaderboardCache.get(category);
}

/**
 * Set leaderboard cache
 * @param {string} category - Category
 * @param {object} data - Leaderboard data
 * @param {string} source - Data source
 */
export function setLeaderboard(category, data, source = 'firestore') {
  leaderboardCache.set(category, data, source);
}

/**
 * Get user rank
 * @param {string} category - Category
 * @param {string} userId - User ID
 * @returns {number|null}
 */
export function getUserRank(category, userId) {
  return leaderboardCache.getUserRank(category, userId);
}

/**
 * Get top users
 * @param {string} category - Category
 * @param {number} limit - Limit
 * @returns {Array}
 */
export function getTopUsers(category, limit = 10) {
  return leaderboardCache.getTopUsers(category, limit);
}

/**
 * Update user score optimistically
 * @param {string} category - Category
 * @param {string} userId - User ID
 * @param {number} score - Score
 */
export function updateUserScoreOptimistic(category, userId, score) {
  leaderboardCache.updateUserScore(category, userId, score);
}

/**
 * Subscribe to cache updates
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export function subscribeToLeaderboardUpdates(callback) {
  return leaderboardCache.subscribe('update', callback);
}

export default {
  LeaderboardCache,
  leaderboardCache,
  getLeaderboard,
  setLeaderboard,
  getUserRank,
  getTopUsers,
  updateUserScoreOptimistic,
  subscribeToLeaderboardUpdates
};
