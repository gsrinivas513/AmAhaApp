/**
 * Performance Monitoring Service
 * Tracks app performance metrics, memory usage, render times, etc.
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.marks = {};
  }

  /**
   * Start timing a metric
   */
  startMeasure(name) {
    this.marks[name] = performance.now();
  }

  /**
   * End timing and return elapsed time
   */
  endMeasure(name) {
    if (!this.marks[name]) {
      console.warn(`Measure '${name}' was not started`);
      return null;
    }

    const elapsed = performance.now() - this.marks[name];
    delete this.marks[name];

    if (!this.metrics[name]) {
      this.metrics[name] = [];
    }

    this.metrics[name].push(elapsed);
    return elapsed;
  }

  /**
   * Get average time for a metric
   */
  getAverageTime(name) {
    if (!this.metrics[name] || this.metrics[name].length === 0) {
      return 0;
    }
    const sum = this.metrics[name].reduce((a, b) => a + b, 0);
    return sum / this.metrics[name].length;
  }

  /**
   * Get all metrics
   */
  getAllMetrics() {
    const summary = {};
    for (const [name, times] of Object.entries(this.metrics)) {
      summary[name] = {
        count: times.length,
        average: this.getAverageTime(name),
        min: Math.min(...times),
        max: Math.max(...times),
        total: times.reduce((a, b) => a + b, 0),
      };
    }
    return summary;
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = {};
    this.marks = {};
  }

  /**
   * Get Core Web Vitals
   */
  getCoreWebVitals() {
    const vitals = {};

    // Largest Contentful Paint (LCP)
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        vitals.lcp = entries[entries.length - 1].renderTime || entries[entries.length - 1].loadTime;
      });
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      console.warn("LCP not available:", e);
    }

    // First Input Delay (FID)
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        vitals.fid = entries[0].processingDuration;
      });
      observer.observe({ entryTypes: ["first-input"] });
    } catch (e) {
      console.warn("FID not available:", e);
    }

    // Cumulative Layout Shift (CLS)
    try {
      let cls = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        }
      });
      observer.observe({ entryTypes: ["layout-shift"] });
      vitals.cls = cls;
    } catch (e) {
      console.warn("CLS not available:", e);
    }

    // Time to First Byte (TTFB)
    try {
      const navigation = performance.getEntriesByType("navigation")[0];
      if (navigation) {
        vitals.ttfb = navigation.responseStart - navigation.fetchStart;
      }
    } catch (e) {
      console.warn("TTFB not available:", e);
    }

    return vitals;
  }

  /**
   * Get memory usage (if available)
   */
  getMemoryUsage() {
    if (!performance.memory) {
      return null;
    }

    return {
      usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
      totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
      jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1048576), // MB
      percentUsed: ((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100).toFixed(2),
    };
  }

  /**
   * Get navigation timing
   */
  getNavigationTiming() {
    const navigation = performance.getEntriesByType("navigation")[0];
    if (!navigation) {
      return null;
    }

    return {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      ttfb: navigation.responseStart - navigation.fetchStart,
      download: navigation.responseEnd - navigation.responseStart,
      domInteractive: navigation.domInteractive - navigation.fetchStart,
      domComplete: navigation.domComplete - navigation.fetchStart,
      loadComplete: navigation.loadEventEnd - navigation.fetchStart,
    };
  }

  /**
   * Log all performance data
   */
  logPerformanceReport() {
    console.log("=== Performance Report ===");
    console.log("Metrics:", this.getAllMetrics());
    console.log("Core Web Vitals:", this.getCoreWebVitals());
    console.log("Memory:", this.getMemoryUsage());
    console.log("Navigation Timing:", this.getNavigationTiming());
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Optional: Auto-log to console on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    // Uncomment to enable:
    // performanceMonitor.logPerformanceReport();
  });
}
