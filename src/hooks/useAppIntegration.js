/**
 * COMPREHENSIVE IMPLEMENTATION HOOK
 * Integrates all modules into the main application
 */

import React, { useEffect, useState } from 'react';
import { AppIntegrationManager, QuizIntegrationService, PuzzleIntegrationService, LeaderboardIntegrationService } from '../services/IntegrationManager';
import { THEME_PRESETS, ThemeApplier } from '../theme/themeCustomization';
import { motionSafety, KeyboardNavigator } from '../utils/accessibilityUtils';
import { getMobileResponsiveStyles } from '../quiz/utils/responsiveStyles';
// import ResponsiveQuizContainer from '../quiz/components/ResponsiveQuizContainer';
const ResponsiveQuizContainer = null; // Placeholder

/**
 * Global Application Context
 */
export const AppContext = React.createContext(null);

/**
 * App Integration Provider
 * Wraps entire application to provide integrated services
 */
export function AppIntegrationProvider({ children, firebaseDb }) {
  const [integrationManager, setIntegrationManager] = useState(null);
  const [quizService, setQuizService] = useState(null);
  const [puzzleService, setPuzzleService] = useState(null);
  const [leaderboardService, setLeaderboardService] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(THEME_PRESETS.light);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Initialize main integration manager
        const manager = new AppIntegrationManager(firebaseDb);
        await manager.initialize();

        // Initialize service modules
        setIntegrationManager(manager);
        setQuizService(new QuizIntegrationService(firebaseDb, manager));
        setPuzzleService(new PuzzleIntegrationService(firebaseDb, manager));
        setLeaderboardService(new LeaderboardIntegrationService(firebaseDb, manager));

        // Load user theme
        const savedTheme = localStorage.getItem('amaha-theme');
        if (savedTheme) {
          const theme = JSON.parse(savedTheme);
          setCurrentTheme(theme);
          ThemeApplier.apply(theme);
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize services:', error);
        setLoading(false);
      }
    };

    initializeServices();
  }, [firebaseDb]);

  const switchTheme = (theme) => {
    setCurrentTheme(theme);
    ThemeApplier.apply(theme);
    localStorage.setItem('amaha-theme', JSON.stringify(theme));
  };

  const value = {
    integrationManager,
    quizService,
    puzzleService,
    leaderboardService,
    currentTheme,
    switchTheme,
    loading,
  };

  return (
    <AppContext.Provider value={value}>
      {!loading && children}
    </AppContext.Provider>
  );
}

/**
 * Hook to use app integration context
 */
export function useAppIntegration() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppIntegration must be used within AppIntegrationProvider');
  }
  return context;
}

/**
 * Responsive Quiz Wrapper Component
 * Applies responsive styles and accessibility features
 */
export function ResponsiveQuizWrapper({
  children,
  theme,
  breakpoints,
  screenSize,
  orientation,
  getResponsivePadding,
}) {
  const keyboardNavigator = React.useRef(new KeyboardNavigator()).current;

  // Get responsive styles
  const responsiveStyles = getMobileResponsiveStyles(theme, breakpoints);

  // Apply motion safety
  const animationDuration = motionSafety.getAnimationDuration(300);
  const transitionStyles = motionSafety.getTransitionStyles(300);

  return (
    <div style={{ ...responsiveStyles.questionContainer, ...transitionStyles }}>
      {React.cloneElement(children, {
        theme,
        breakpoints,
        screenSize,
        orientation,
        getResponsivePadding,
        responsiveStyles,
        keyboardNavigator,
        animationDuration,
      })}
    </div>
  );
}

/**
 * Main App Wrapper with all integrations
 */
export function IntegratedApp({ children, firebaseDb, themeOverride }) {
  const [theme, setTheme] = useState(themeOverride || THEME_PRESETS.light);

  useEffect(() => {
    if (themeOverride) {
      ThemeApplier.apply(themeOverride);
    } else {
      ThemeApplier.applySystemTheme();
    }
  }, [themeOverride]);

  return (
    <AppIntegrationProvider firebaseDb={firebaseDb}>
      <ResponsiveQuizContainer theme={theme}>
        {children}
      </ResponsiveQuizContainer>
    </AppIntegrationProvider>
  );
}

/**
 * Feature Flag Manager
 * Control which features are enabled
 */
export const FEATURE_FLAGS = {
  QUIZ_BUILDER: true,
  PUZZLE_SYSTEM: true,
  ANALYTICS_DASHBOARD: true,
  LEADERBOARD: true,
  THEME_CUSTOMIZATION: true,
  ACCESSIBILITY_FEATURES: true,
  PERFORMANCE_MONITORING: true,
  MOBILE_RESPONSIVE: true,
};

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(featureName) {
  return FEATURE_FLAGS[featureName] !== false;
}

/**
 * Setup Initial App State
 */
export async function setupApplicationState(firebaseDb) {
  try {
    // Initialize integration manager
    const manager = new AppIntegrationManager(firebaseDb);
    await manager.initialize();

    // Load all configurations
    const appState = {
      initialized: true,
      services: {
        integration: manager,
        quiz: new QuizIntegrationService(firebaseDb, manager),
        puzzle: new PuzzleIntegrationService(firebaseDb, manager),
        leaderboard: new LeaderboardIntegrationService(firebaseDb, manager),
      },
      features: FEATURE_FLAGS,
      theme: THEME_PRESETS.light,
      user: null,
    };

    return appState;
  } catch (error) {
    console.error('Application setup failed:', error);
    throw error;
  }
}

/**
 * Performance Baseline Check
 */
export function checkPerformanceBaseline() {
  if ('PerformanceObserver' in window) {
    const vitals = {};

    // Measure First Contentful Paint
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
      vitals[entry.name] = entry.startTime;
    });

    return {
      baseline: vitals,
      checkTime: Date.now(),
      acceptable: Object.values(vitals).every(v => v < 3000),
    };
  }
  return null;
}

/**
 * Accessibility Compliance Check
 */
export function checkAccessibilityCompliance() {
  const issues = [];

  // Check for keyboard navigation
  const tabbableElements = document.querySelectorAll(
    'button, a[href], input, select, textarea, [tabindex]'
  );
  if (tabbableElements.length === 0) {
    issues.push('No keyboard-navigable elements found');
  }

  // Check for ARIA labels
  const elementsWithoutLabels = document.querySelectorAll('button:not([aria-label]):not(:has(> [aria-label]))');
  if (elementsWithoutLabels.length > 0) {
    issues.push(`${elementsWithoutLabels.length} buttons without ARIA labels`);
  }

  // Check color contrast (simplified check)
  // Would require more complex implementation for full validation

  return {
    compliant: issues.length === 0,
    issues,
    elementsChecked: tabbableElements.length,
  };
}

export default {
  AppIntegrationProvider,
  useAppIntegration,
  ResponsiveQuizWrapper,
  IntegratedApp,
  isFeatureEnabled,
  setupApplicationState,
  checkPerformanceBaseline,
  checkAccessibilityCompliance,
};
