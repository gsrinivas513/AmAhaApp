/**
 * Performance Optimization Module
 * Handles code splitting, lazy loading, caching, and optimization
 */

/**
 * Lazy load component
 */
export function createLazyComponent(importFunc) {
  const React = require('react');
  const LazyComponent = React.lazy(importFunc);

  return function LazyComponentWrapper(props) {
    return (
      <React.Suspense fallback={<div style={{ padding: '20px', color: '#999' }}>Loading...</div>}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };
}

/**
 * Image optimization utilities
 */
export const imageOptimization = {
  generateSrcSet: (baseUrl, sizes = [640, 1024, 1920]) => {
    return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
  },

  createOptimizedImage: (src, alt, sizes) => ({
    src: src,
    srcSet: imageOptimization.generateSrcSet(src, sizes),
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1024px',
    alt: alt,
    loading: 'lazy',
  }),

  compressImage: (imageUrl, quality = 0.8) => {
    // Returns optimized image URL for Cloudinary or similar service
    return `${imageUrl}?q=${Math.round(quality * 100)}&auto=format`;
  },

  webpFallback: (jpgUrl) => ({
    modern: `${jpgUrl}?f=webp`,
    fallback: jpgUrl,
  }),
};

/**
 * Code splitting strategies
 */
export const codeSplitting = {
  // Route-based splitting
  routes: {
    'dashboard': () => import('../pages/Dashboard'),
    'quiz-builder': () => import('../pages/QuizBuilder'),
    'leaderboard': () => import('../pages/Leaderboard'),
    'analytics': () => import('../pages/Analytics'),
  },

  // Component-based splitting
  components: {
    'QuizBuilder': () => import('../quiz/components/QuizBuilder'),
    'PuzzleGame': () => import('../puzzle/PuzzleGame'),
    'Analytics': () => import('../dashboard/AnalyticsDashboard'),
  },

  // Feature-based splitting
  features: {
    'socialSharing': () => import('../features/socialSharing'),
    'gamification': () => import('../features/gamification'),
    'multiplayer': () => import('../features/multiplayer'),
  },
};

/**
 * Caching strategy
 */
export class CacheManager {
  constructor(cacheName = 'amaha-cache-v1', ttl = 3600000) { // 1 hour default
    this.cacheName = cacheName;
    this.ttl = ttl;
    this.memory = new Map();
  }

  async set(key, value, customTtl = null) {
    const ttl = customTtl || this.ttl;
    this.memory.set(key, {
      value: value,
      expiresAt: Date.now() + ttl,
    });

    // Also store in IndexedDB for persistence
    if (typeof window !== 'undefined' && window.indexedDB) {
      try {
        const request = indexedDB.open('amaha-db', 1);
        request.onsuccess = (e) => {
          const db = e.target.result;
          const transaction = db.transaction(['cache'], 'readwrite');
          const store = transaction.objectStore('cache');
          store.put({ key, value, expiresAt: Date.now() + ttl });
        };
      } catch (e) {
        console.warn('IndexedDB unavailable:', e);
      }
    }
  }

  get(key) {
    const cached = this.memory.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      this.memory.delete(key);
      return null;
    }

    return cached.value;
  }

  clear() {
    this.memory.clear();
  }

  getStats() {
    return {
      size: this.memory.size,
      keys: Array.from(this.memory.keys()),
    };
  }
}

/**
 * Request debouncing and throttling
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function throttle(func, interval) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {};
  }

  startMeasure(label) {
    performance.mark(`${label}-start`);
    this.metrics[label] = { startTime: performance.now() };
  }

  endMeasure(label) {
    performance.mark(`${label}-end`);
    try {
      performance.measure(label, `${label}-start`, `${label}-end`);
      const measure = performance.getEntriesByName(label)[0];
      this.metrics[label].duration = measure.duration;
      return measure.duration;
    } catch (e) {
      console.warn('Performance measure failed:', e);
      return null;
    }
  }

  reportWebVitals() {
    const vitals = {
      FCP: null, // First Contentful Paint
      LCP: null, // Largest Contentful Paint
      CLS: null, // Cumulative Layout Shift
      FID: null, // First Input Delay
    };

    if ('PerformanceObserver' in window) {
      // Observe Core Web Vitals
      ['largest-contentful-paint', 'layout-shift', 'first-input'].forEach(type => {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (type === 'largest-contentful-paint') vitals.LCP = entry.startTime;
            if (type === 'layout-shift') vitals.CLS = (vitals.CLS || 0) + entry.value;
            if (type === 'first-input') vitals.FID = entry.processingDuration;
          }
        }).observe({ entryTypes: [type] });
      });
    }

    return vitals;
  }

  getReport() {
    return {
      metrics: this.metrics,
      webVitals: this.reportWebVitals(),
      timestamp: new Date(),
    };
  }
}

/**
 * Bundle size analyzer
 */
export function analyzeBundleSize(bundleMap) {
  const totalSize = Object.values(bundleMap).reduce((sum, size) => sum + size, 0);

  const analysis = Object.entries(bundleMap)
    .map(([name, size]) => ({
      name,
      size,
      percentage: ((size / totalSize) * 100).toFixed(2),
    }))
    .sort((a, b) => b.size - a.size);

  return {
    total: totalSize,
    modules: analysis,
    summary: {
      largestModule: analysis[0],
      smallestModule: analysis[analysis.length - 1],
      averageSize: Math.round(totalSize / analysis.length),
    },
  };
}

/**
 * Memory leak detection
 */
export class MemoryMonitor {
  constructor() {
    this.snapshots = [];
    this.threshold = 50 * 1024 * 1024; // 50MB
  }

  takeSnapshot() {
    if ('memory' in performance) {
      const memory = {
        timestamp: Date.now(),
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      };
      this.snapshots.push(memory);
      return memory;
    }
    return null;
  }

  detectLeaks() {
    if (this.snapshots.length < 2) return null;

    const latest = this.snapshots[this.snapshots.length - 1];
    const previous = this.snapshots[this.snapshots.length - 2];

    const increase = latest.usedJSHeapSize - previous.usedJSHeapSize;
    const leakDetected = increase > this.threshold;

    return {
      leakDetected,
      increase,
      memoryUsed: latest.usedJSHeapSize,
      warning: leakDetected ? `Memory usage increased by ${(increase / 1024 / 1024).toFixed(2)}MB` : null,
    };
  }
}

/**
 * Network request optimization
 */
export const networkOptimization = {
  // Request batching
  batchRequests: (requests, batchSize = 5) => {
    const batches = [];
    for (let i = 0; i < requests.length; i += batchSize) {
      batches.push(requests.slice(i, i + batchSize));
    }
    return batches;
  },

  // Request prioritization
  prioritizeRequests: (requests) => {
    return requests.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  },

  // Connection optimization
  preconnect: (origins) => {
    origins.forEach(origin => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      document.head.appendChild(link);
    });
  },

  // DNS prefetch
  dnsPrefetch: (domains) => {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });
  },
};
