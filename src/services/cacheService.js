/**
 * Unified Cache Service
 * Handles localStorage, sessionStorage, and memory caching
 * Implements multi-tier caching strategy for optimal performance
 * 
 * @module services/cacheService
 */

export class CacheService {
  /**
   * Cache duration constants
   */
  static CACHE_DURATION = {
    SHORT: 5 * 60 * 1000,      // 5 minutes
    MEDIUM: 30 * 60 * 1000,    // 30 minutes
    LONG: 24 * 60 * 60 * 1000, // 24 hours
    PERMANENT: Infinity
  };

  /**
   * Standard cache keys for different data types
   */
  static CACHE_KEYS = {
    QUIZZES: 'cache:quizzes',
    PUZZLES: 'cache:puzzles',
    STORIES: 'cache:stories',
    STUDIES: 'cache:studies',
    ARTS_PROJECTS: 'cache:arts_projects',
    MARKETPLACE_LISTINGS: 'cache:marketplace_listings',
    LEADERBOARDS: 'cache:leaderboards',
    USER_PROFILE: 'cache:user_profile',
    ACHIEVEMENTS: 'cache:achievements',
    CATEGORIES: 'cache:categories',
  };

  /**
   * Initialize memory cache (singleton pattern)
   */
  static memoryCache = null;

  /**
   * Initialize the cache system
   */
  static initialize() {
    if (!this.memoryCache) {
      this.memoryCache = new Map();
    }
  }

  /**
   * Get data from cache (check memory → localStorage → null)
   * @param {string} key - Cache key
   * @returns {*} Cached data or null if expired/missing
   */
  static get(key) {
    this.initialize();

    // Check memory cache first
    const memory = this.memoryCache.get(key);
    if (memory && !this.isExpired(memory)) {
      return memory.data;
    }

    // Check localStorage
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!this.isExpired(parsed)) {
          // Restore to memory cache
          this.memoryCache.set(key, parsed);
          return parsed.data;
        }
        // Remove expired cache
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[Cache] Error reading from localStorage for key ${key}:`, e);
    }

    return null;
  }

  /**
   * Set cache data (store in memory + localStorage)
   * @param {string} key - Cache key
   * @param {*} data - Data to cache
   * @param {number} duration - Cache duration in milliseconds
   */
  static set(key, data, duration = this.CACHE_DURATION.MEDIUM) {
    this.initialize();

    const expiresAt = duration === Infinity ? Infinity : Date.now() + duration;
    const cached = { data, expiresAt };

    // Store in memory cache
    this.memoryCache.set(key, cached);

    // Store in localStorage for persistence
    try {
      localStorage.setItem(key, JSON.stringify(cached));
    } catch (e) {
      // Storage full or quota exceeded, continue with memory-only cache
      console.warn(`[Cache] localStorage full for key ${key}, using memory only:`, e);
    }
  }

  /**
   * Check if cache entry is expired
   * @param {object} cached - Cached object with expiresAt property
   * @returns {boolean} True if expired
   */
  static isExpired(cached) {
    if (!cached || !cached.expiresAt) return true;
    return cached.expiresAt !== Infinity && Date.now() > cached.expiresAt;
  }

  /**
   * Clear specific cache entry
   * @param {string} key - Cache key to clear
   */
  static clear(key) {
    this.initialize();
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[Cache] Error clearing localStorage for key ${key}:`, e);
    }
  }

  /**
   * Clear all cache entries
   */
  static clearAll() {
    this.initialize();
    this.memoryCache.clear();
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache:')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('[Cache] Error clearing all localStorage:', e);
    }
  }

  /**
   * Get cache stats (for debugging)
   * @returns {object} Cache statistics
   */
  static getStats() {
    this.initialize();
    let memoryCount = 0;
    let localStorageCount = 0;

    memoryCount = this.memoryCache.size;

    try {
      const keys = Object.keys(localStorage);
      localStorageCount = keys.filter(k => k.startsWith('cache:')).length;
    } catch (e) {
      console.warn('[Cache] Error getting localStorage stats:', e);
    }

    return {
      memoryEntries: memoryCount,
      localStorageEntries: localStorageCount,
      totalEntries: memoryCount + localStorageCount
    };
  }

  /**
   * Cleanup expired entries from memory and localStorage
   */
  static cleanup() {
    this.initialize();

    // Clean memory cache
    for (const [key, value] of this.memoryCache.entries()) {
      if (this.isExpired(value)) {
        this.memoryCache.delete(key);
      }
    }

    // Clean localStorage
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache:')) {
          const stored = localStorage.getItem(key);
          try {
            const parsed = JSON.parse(stored);
            if (this.isExpired(parsed)) {
              localStorage.removeItem(key);
            }
          } catch {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (e) {
      console.warn('[Cache] Error during cleanup:', e);
    }
  }

  /**
   * Invalidate cache by pattern (e.g., invalidate all quiz caches)
   * @param {string} pattern - Pattern to match keys against
   */
  static invalidateByPattern(pattern) {
    this.initialize();

    // Clear from memory
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key);
      }
    }

    // Clear from localStorage
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache:') && key.includes(pattern)) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn(`[Cache] Error invalidating pattern ${pattern}:`, e);
    }
  }
}

/**
 * Initialize cache on service load
 */
CacheService.initialize();

/**
 * Periodic cleanup (every 5 minutes)
 */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    CacheService.cleanup();
  }, 5 * 60 * 1000);
}
