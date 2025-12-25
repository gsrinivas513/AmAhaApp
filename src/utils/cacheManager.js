/**
 * Cache Manager - Centralized caching strategy
 * Handles localStorage, sessionStorage, and in-memory caching
 */

const CACHE_CONFIG = {
  // Cache duration in milliseconds
  DURATIONS: {
    SHORT: 5 * 60 * 1000,           // 5 minutes
    MEDIUM: 30 * 60 * 1000,         // 30 minutes
    LONG: 60 * 60 * 1000,           // 1 hour
    VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Cache keys
  KEYS: {
    // User data
    USER_PROFILE: 'cache:user:profile',
    USER_STATS: 'cache:user:stats',
    USER_ACHIEVEMENTS: 'cache:user:achievements',
    
    // Quiz/Puzzle data
    QUIZ_QUESTIONS: 'cache:quiz:questions',
    PUZZLE_DATA: 'cache:puzzle:data',
    
    // Analytics
    LEADERBOARD: 'cache:analytics:leaderboard',
    ANALYTICS_EVENTS: 'cache:analytics:events',
    
    // Platform
    CATEGORIES: 'cache:platform:categories',
    TOPICS: 'cache:platform:topics',
    DAILY_CHALLENGE: 'cache:platform:daily-challenge',
  },
};

class CacheManager {
  constructor() {
    this.memory = new Map();
    this.timers = new Map();
  }

  /**
   * Set cache with automatic expiration
   */
  set(key, value, duration = CACHE_CONFIG.DURATIONS.MEDIUM, storage = 'memory') {
    try {
      const cacheEntry = {
        value,
        timestamp: Date.now(),
        expiresAt: Date.now() + duration,
      };

      if (storage === 'localStorage') {
        try {
          localStorage.setItem(key, JSON.stringify(cacheEntry));
        } catch (e) {
          console.warn('localStorage full, using memory cache:', e);
          this.memory.set(key, cacheEntry);
        }
      } else if (storage === 'sessionStorage') {
        try {
          sessionStorage.setItem(key, JSON.stringify(cacheEntry));
        } catch (e) {
          console.warn('sessionStorage full, using memory cache:', e);
          this.memory.set(key, cacheEntry);
        }
      } else {
        this.memory.set(key, cacheEntry);
      }

      // Set expiration timer
      if (this.timers.has(key)) {
        clearTimeout(this.timers.get(key));
      }
      
      const timer = setTimeout(() => this.remove(key), duration);
      this.timers.set(key, timer);

    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  /**
   * Get cached value if not expired
   */
  get(key) {
    try {
      let entry = null;

      // Try localStorage first
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          entry = JSON.parse(stored);
        }
      } catch (e) {
        // localStorage not available
      }

      // Try sessionStorage if not found
      if (!entry) {
        try {
          const stored = sessionStorage.getItem(key);
          if (stored) {
            entry = JSON.parse(stored);
          }
        } catch (e) {
          // sessionStorage not available
        }
      }

      // Try memory if not found
      if (!entry) {
        entry = this.memory.get(key);
      }

      // Check if expired
      if (entry && entry.expiresAt > Date.now()) {
        return entry.value;
      } else if (entry) {
        this.remove(key);
      }

      return null;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  /**
   * Remove specific cache entry
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
      this.memory.delete(key);
      
      if (this.timers.has(key)) {
        clearTimeout(this.timers.get(key));
        this.timers.delete(key);
      }
    } catch (error) {
      console.error('Error removing cache:', error);
    }
  }

  /**
   * Clear all cache
   */
  clear() {
    try {
      this.memory.clear();
      this.timers.forEach(timer => clearTimeout(timer));
      this.timers.clear();
      
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.warn('Could not clear storage:', e);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      memorySize: this.memory.size,
      activeTimers: this.timers.size,
      storageAvailable: {
        localStorage: this.isStorageAvailable('localStorage'),
        sessionStorage: this.isStorageAvailable('sessionStorage'),
      },
    };
  }

  /**
   * Check if storage is available
   */
  isStorageAvailable(type) {
    try {
      const storage = type === 'localStorage' ? localStorage : sessionStorage;
      const test = '__test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

// Export config for use in app
export const CACHE_KEYS = CACHE_CONFIG.KEYS;
export const CACHE_DURATIONS = CACHE_CONFIG.DURATIONS;

export default cacheManager;
