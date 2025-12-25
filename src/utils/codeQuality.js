/**
 * Code Quality Utilities
 * Common utility functions extracted from multiple services
 * Implements DRY principle and consistency
 * 
 * @module utils/codeQuality
 */

/**
 * Validation utilities
 */
export const ValidationUtils = {
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean}
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate required fields
   * @param {object} obj - Object to validate
   * @param {Array<string>} requiredFields - Required field names
   * @returns {object} { valid: boolean, missing: Array<string> }
   */
  validateRequiredFields(obj, requiredFields) {
    const missing = requiredFields.filter(field => !obj[field]);
    return {
      valid: missing.length === 0,
      missing
    };
  },

  /**
   * Validate number range
   * @param {number} value - Value to validate
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {boolean}
   */
  isInRange(value, min, max) {
    return typeof value === 'number' && value >= min && value <= max;
  },

  /**
   * Validate array not empty
   * @param {Array} arr - Array to validate
   * @returns {boolean}
   */
  isNonEmptyArray(arr) {
    return Array.isArray(arr) && arr.length > 0;
  }
};

/**
 * Formatting utilities
 */
export const FormatUtils = {
  /**
   * Format date to readable string
   * @param {Date|number} date - Date to format
   * @returns {string}
   */
  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  /**
   * Format time duration to readable string
   * @param {number} ms - Duration in milliseconds
   * @returns {string}
   */
  formatDuration(ms) {
    if (!ms || ms < 0) return '0s';

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  },

  /**
   * Format number with thousand separators
   * @param {number} num - Number to format
   * @returns {string}
   */
  formatNumber(num) {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  /**
   * Format percentage
   * @param {number} value - Value between 0-100
   * @param {number} decimals - Decimal places (default: 1)
   * @returns {string}
   */
  formatPercentage(value, decimals = 1) {
    if (!value && value !== 0) return '0%';
    return `${value.toFixed(decimals)}%`;
  }
};

/**
 * Array utilities
 */
export const ArrayUtils = {
  /**
   * Remove duplicates from array
   * @param {Array} arr - Array to deduplicate
   * @param {Function} keyFn - Optional function to extract key
   * @returns {Array} Deduplicated array
   */
  removeDuplicates(arr, keyFn = null) {
    if (!Array.isArray(arr)) return [];

    if (keyFn) {
      const seen = new Set();
      return arr.filter(item => {
        const key = keyFn(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    return [...new Set(arr)];
  },

  /**
   * Group array by key
   * @param {Array} arr - Array to group
   * @param {Function} keyFn - Function to extract grouping key
   * @returns {object} Grouped object
   */
  groupBy(arr, keyFn) {
    if (!Array.isArray(arr)) return {};

    return arr.reduce((result, item) => {
      const key = keyFn(item);
      if (!result[key]) result[key] = [];
      result[key].push(item);
      return result;
    }, {});
  },

  /**
   * Flatten nested array
   * @param {Array} arr - Nested array
   * @param {number} depth - Flattening depth (default: 1)
   * @returns {Array} Flattened array
   */
  flatten(arr, depth = 1) {
    if (!Array.isArray(arr)) return [];
    if (depth === 0) return arr;

    return arr.reduce((result, item) => {
      if (Array.isArray(item)) {
        result.push(...this.flatten(item, depth - 1));
      } else {
        result.push(item);
      }
      return result;
    }, []);
  },

  /**
   * Chunk array into smaller arrays
   * @param {Array} arr - Array to chunk
   * @param {number} size - Chunk size
   * @returns {Array<Array>} Chunked array
   */
  chunk(arr, size) {
    if (!Array.isArray(arr) || size < 1) return [];

    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }
};

/**
 * Object utilities
 */
export const ObjectUtils = {
  /**
   * Deep merge objects
   * @param {object} target - Target object
   * @param {object} source - Source object
   * @returns {object} Merged object
   */
  deepMerge(target, source) {
    if (!source) return target;

    const result = { ...target };

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          typeof source[key] === 'object' &&
          source[key] !== null &&
          !Array.isArray(source[key])
        ) {
          result[key] = this.deepMerge(result[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }

    return result;
  },

  /**
   * Pick specific properties from object
   * @param {object} obj - Source object
   * @param {Array<string>} keys - Keys to pick
   * @returns {object} New object with picked properties
   */
  pick(obj, keys) {
    if (!obj) return {};

    const result = {};
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  /**
   * Omit specific properties from object
   * @param {object} obj - Source object
   * @param {Array<string>} keys - Keys to omit
   * @returns {object} New object without omitted properties
   */
  omit(obj, keys) {
    if (!obj) return {};

    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  }
};

/**
 * Error handling utilities
 */
export const ErrorUtils = {
  /**
   * Get user-friendly error message
   * @param {Error|string} error - Error object or message
   * @returns {string} User-friendly message
   */
  getFriendlyMessage(error) {
    if (!error) return 'An unknown error occurred';

    const message = error.message || String(error);

    // Map common error codes
    const errorMap = {
      'permission-denied': 'You don\'t have permission to perform this action',
      'not-found': 'The requested item was not found',
      'already-exists': 'This item already exists',
      'invalid-argument': 'Invalid input provided',
      'unavailable': 'The service is temporarily unavailable',
      'unauthenticated': 'Please sign in to continue'
    };

    for (const [code, msg] of Object.entries(errorMap)) {
      if (message.includes(code)) {
        return msg;
      }
    }

    return message;
  },

  /**
   * Log error with context
   * @param {string} context - Error context/location
   * @param {Error} error - Error object
   */
  logError(context, error) {
    const errorInfo = {
      context,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };

    console.error(`[${context}]`, errorInfo);

    // Could be sent to error tracking service
    // trackError(errorInfo);
  }
};

/**
 * Performance utilities
 */
export const PerformanceUtils = {
  /**
   * Debounce function
   * @param {Function} fn - Function to debounce
   * @param {number} ms - Debounce delay in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(fn, ms = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  },

  /**
   * Throttle function
   * @param {Function} fn - Function to throttle
   * @param {number} ms - Throttle interval in milliseconds
   * @returns {Function} Throttled function
   */
  throttle(fn, ms = 300) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= ms) {
        lastCall = now;
        return fn.apply(this, args);
      }
    };
  },

  /**
   * Measure function execution time
   * @param {Function} fn - Function to measure
   * @param {string} label - Optional label for logging
   * @returns {Promise<*>} Function result
   */
  async measureTime(fn, label = 'Operation') {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
      return result;
    } catch (e) {
      const duration = performance.now() - start;
      console.error(`[Performance] ${label}: Failed after ${duration.toFixed(2)}ms`);
      throw e;
    }
  }
};

export default {
  ValidationUtils,
  FormatUtils,
  ArrayUtils,
  ObjectUtils,
  ErrorUtils,
  PerformanceUtils
};
