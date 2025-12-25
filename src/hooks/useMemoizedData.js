/**
 * Memoized Data Hook
 * Prevents unnecessary refetches by memoizing fetch function results
 * Integrates with CacheService for persistent caching
 * 
 * @module hooks/useMemoizedData
 */

import { useMemo } from 'react';
import { CacheService } from '../services/cacheService';

/**
 * useMemoizedData Hook
 * Memoizes async data fetching with optional cache integration
 * 
 * @param {Function} fetchFn - Async function to fetch data
 * @param {Array} dependencies - Dependencies array for memo
 * @param {object} options - Configuration options
 * @param {string} options.cacheKey - Cache key (uses CacheService if provided)
 * @param {number} options.cacheDuration - Cache duration in ms
 * @returns {*} Memoized data
 * 
 * @example
 * const quizzes = useMemoizedData(
 *   () => quizService.getAllQuizzes(),
 *   [],
 *   { cacheKey: 'quizzes', cacheDuration: 30 * 60 * 1000 }
 * );
 */
export function useMemoizedData(fetchFn, dependencies = [], options = {}) {
  const { cacheKey = null, cacheDuration = CacheService.CACHE_DURATION.MEDIUM } = options;

  return useMemo(() => {
    // Check cache first if cacheKey provided
    if (cacheKey) {
      const cachedData = CacheService.get(cacheKey);
      if (cachedData !== null) {
        return cachedData;
      }
    }

    // Fetch data
    const data = fetchFn();

    // Cache the result
    if (cacheKey && data) {
      if (data instanceof Promise) {
        // Handle async functions
        data.then(result => {
          CacheService.set(cacheKey, result, cacheDuration);
        }).catch(err => {
          console.warn(`[useMemoizedData] Error caching result:`, err);
        });
      } else {
        // Sync results
        CacheService.set(cacheKey, data, cacheDuration);
      }
    }

    return data;
  }, dependencies);
}

export default useMemoizedData;
