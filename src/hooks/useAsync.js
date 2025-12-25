/**
 * Async Hook
 * Provides loading, error, and data states for async operations
 * 
 * @module hooks/useAsync
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useAsync Hook
 * Manages async function execution with loading/error/data states
 * 
 * @param {Function} asyncFunction - Async function to execute
 * @param {boolean} immediate - Execute immediately on mount (default: true)
 * @param {Array} dependencies - Dependencies array for effect
 * @returns {object} { status, data, error, execute, reset }
 * 
 * @example
 * const { status, data, error } = useAsync(fetchQuizzes, true, []);
 */
export function useAsync(asyncFunction, immediate = true, dependencies = []) {
  const [status, setStatus] = useState('idle'); // idle, pending, success, error
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Keep track of whether component is mounted
  const isMountedRef = useRef(true);

  // Execute async function
  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const result = await asyncFunction();
      
      if (isMountedRef.current) {
        setData(result);
        setStatus('success');
      }
      return result;
    } catch (err) {
      if (isMountedRef.current) {
        setError(err);
        setStatus('error');
      }
      throw err;
    }
  }, [asyncFunction]);

  // Reset to initial state
  const reset = useCallback(() => {
    setStatus('idle');
    setData(null);
    setError(null);
  }, []);

  // Execute on mount or when dependencies change
  useEffect(() => {
    isMountedRef.current = true;

    if (immediate) {
      execute().catch(err => {
        console.error('[useAsync] Error executing function:', err);
      });
    }

    return () => {
      isMountedRef.current = false;
    };
  }, dependencies);

  return { status, data, error, execute, reset };
}

export default useAsync;
