/**
 * Leaderboard Buffer Service
 * Implements buffering and aggregation for leaderboard updates
 * Reduces Firestore write operations by batching and periodic flushing
 * 
 * @module services/leaderboardBufferService
 */

import {
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

/**
 * LeaderboardBuffer class
 * Buffers score updates in memory and flushes periodically
 */
export class LeaderboardBuffer {
  constructor(flushIntervalMs = 10000) {
    /**
     * Buffer storage: Map<key, points>
     * Key format: "${userId}:${category}"
     */
    this.buffer = new Map();

    /**
     * Timestamp tracking for each key
     * Map<key, timestamp>
     */
    this.timestamps = new Map();

    /**
     * Flush interval in milliseconds
     */
    this.flushIntervalMs = flushIntervalMs;

    /**
     * Active flush timer
     */
    this.flushTimer = null;

    /**
     * Lock for preventing concurrent flushes
     */
    this.isFlushingLocked = false;

    /**
     * Statistics tracking
     */
    this.stats = {
      bufferedUpdates: 0,
      flushedUpdates: 0,
      failedUpdates: 0,
      totalBufferSize: 0,
      lastFlushTime: null,
    };

    this.startFlushTimer();
  }

  /**
   * Add points to buffer (fast, non-blocking)
   * @param {string} userId - User ID
   * @param {number} points - Points to add
   * @param {string} category - Leaderboard category (default: 'global')
   */
  addPoints(userId, points, category = 'global') {
    if (!userId || typeof points !== 'number' || points === 0) {
      console.warn('[LeaderboardBuffer] Invalid input:', { userId, points, category });
      return;
    }

    const key = this.getBufferKey(userId, category);
    const currentPoints = this.buffer.get(key) || 0;
    const newPoints = currentPoints + points;

    this.buffer.set(key, newPoints);
    this.timestamps.set(key, Date.now());
    this.stats.bufferedUpdates++;
    this.stats.totalBufferSize = this.buffer.size;
  }

  /**
   * Get current buffered score for user/category
   * @param {string} userId - User ID
   * @param {string} category - Category (default: 'global')
   * @returns {number} Current buffered score
   */
  getBufferedScore(userId, category = 'global') {
    const key = this.getBufferKey(userId, category);
    return this.buffer.get(key) || 0;
  }

  /**
   * Check if key has unsaved changes
   * @param {string} userId - User ID
   * @param {string} category - Category
   * @returns {boolean} True if has unsaved changes
   */
  hasPendingChanges(userId, category = 'global') {
    const key = this.getBufferKey(userId, category);
    return this.buffer.has(key);
  }

  /**
   * Manually trigger flush (useful for critical moments)
   * @returns {Promise<object>} Flush result
   */
  async flush() {
    if (this.isFlushingLocked) {
      console.warn('[LeaderboardBuffer] Flush already in progress');
      return { flushed: 0, failed: 0, locked: true };
    }

    if (this.buffer.size === 0) {
      return { flushed: 0, failed: 0, empty: true };
    }

    this.isFlushingLocked = true;

    try {
      const batch = writeBatch(db);
      let flushedCount = 0;
      let failedCount = 0;

      // Group updates by category for batch efficiency
      const updatesByCategory = new Map();

      for (const [key, points] of this.buffer) {
        const [userId, category] = this.parseBufferKey(key);

        if (!updatesByCategory.has(category)) {
          updatesByCategory.set(category, []);
        }

        updatesByCategory.get(category).push({ userId, points, key });
      }

      // Batch write all updates
      for (const [category, updates] of updatesByCategory) {
        for (const { userId, points, key } of updates) {
          try {
            const leaderboardRef = doc(db, 'leaderboards', category);

            batch.update(leaderboardRef, {
              [`scores.${userId}`]: increment(points),
              lastUpdate: serverTimestamp(),
            });

            flushedCount++;
          } catch (e) {
            failedCount++;
            console.error(`[LeaderboardBuffer] Error preparing batch for ${key}:`, e);
          }
        }
      }

      // Commit batch
      if (flushedCount > 0) {
        try {
          await batch.commit();
          
          // Clear buffer after successful flush
          this.buffer.clear();
          this.timestamps.clear();

          this.stats.flushedUpdates += flushedCount;
          this.stats.lastFlushTime = new Date();

          console.log(`[LeaderboardBuffer] Flushed ${flushedCount} updates`);
        } catch (e) {
          failedCount += flushedCount;
          console.error('[LeaderboardBuffer] Batch commit failed:', e);
        }
      }

      this.stats.failedUpdates += failedCount;
      this.stats.totalBufferSize = this.buffer.size;

      return { flushed: flushedCount, failed: failedCount };
    } finally {
      this.isFlushingLocked = false;
    }
  }

  /**
   * Start automatic flush timer
   */
  startFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush().catch(e => {
        console.error('[LeaderboardBuffer] Automatic flush failed:', e);
      });
    }, this.flushIntervalMs);
  }

  /**
   * Stop automatic flush timer
   */
  stopFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Change flush interval
   * @param {number} intervalMs - New interval in milliseconds
   */
  setFlushInterval(intervalMs) {
    this.flushIntervalMs = intervalMs;
    this.startFlushTimer();
  }

  /**
   * Get buffer key from userId and category
   * @private
   */
  getBufferKey(userId, category) {
    return `${userId}:${category}`;
  }

  /**
   * Parse buffer key into userId and category
   * @private
   */
  parseBufferKey(key) {
    const [userId, category] = key.split(':');
    return [userId, category];
  }

  /**
   * Get buffer statistics
   * @returns {object} Current statistics
   */
  getStats() {
    return {
      ...this.stats,
      bufferSize: this.buffer.size,
      pendingPoints: Array.from(this.buffer.values()).reduce((a, b) => a + b, 0),
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      bufferedUpdates: 0,
      flushedUpdates: 0,
      failedUpdates: 0,
      totalBufferSize: 0,
      lastFlushTime: null,
    };
  }

  /**
   * Clear buffer without flushing
   * WARNING: Pending updates will be lost
   */
  clear() {
    this.buffer.clear();
    this.timestamps.clear();
  }

  /**
   * Shutdown buffer (stop timer and flush pending)
   * @returns {Promise<void>}
   */
  async shutdown() {
    this.stopFlushTimer();
    await this.flush();
  }
}

/**
 * Global leaderboard buffer instance
 * Initialized with 10-second flush interval
 */
export const leaderboardBuffer = new LeaderboardBuffer(10000);

/**
 * Convenience functions using global buffer instance
 */

/**
 * Add points to leaderboard buffer
 * @param {string} userId - User ID
 * @param {number} points - Points to add
 * @param {string} category - Category (default: 'global')
 */
export function addLeaderboardPoints(userId, points, category = 'global') {
  leaderboardBuffer.addPoints(userId, points, category);
}

/**
 * Get buffered score
 * @param {string} userId - User ID
 * @param {string} category - Category
 * @returns {number} Buffered score
 */
export function getBufferedScore(userId, category = 'global') {
  return leaderboardBuffer.getBufferedScore(userId, category);
}

/**
 * Check if has pending changes
 * @param {string} userId - User ID
 * @param {string} category - Category
 * @returns {boolean}
 */
export function hasLeaderboardPendingChanges(userId, category = 'global') {
  return leaderboardBuffer.hasPendingChanges(userId, category);
}

/**
 * Flush buffer manually
 * @returns {Promise<object>}
 */
export function flushLeaderboardBuffer() {
  return leaderboardBuffer.flush();
}

/**
 * Get buffer statistics
 * @returns {object}
 */
export function getLeaderboardBufferStats() {
  return leaderboardBuffer.getStats();
}

export default {
  LeaderboardBuffer,
  leaderboardBuffer,
  addLeaderboardPoints,
  getBufferedScore,
  hasLeaderboardPendingChanges,
  flushLeaderboardBuffer,
  getLeaderboardBufferStats,
};
