/**
 * Integrated Analytics Tracking Service
 * Unified tracking for all user actions across the platform
 * Sends data to analytics_events collection in Firestore
 */

import * as analyticsService from '../services/analyticsService';

/**
 * Get current user ID (from auth or localStorage for guests)
 */
function getCurrentUserId() {
  try {
    // Try to get from Firebase Auth
    const { getAuth } = require('firebase/auth');
    const auth = getAuth();
    if (auth.currentUser) {
      return auth.currentUser.uid;
    }
  } catch (e) {
    // Fallback
  }

  // Fallback to localStorage for guests
  let guestId = localStorage.getItem('guestUserId');
  if (!guestId) {
    guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guestUserId', guestId);
  }
  return guestId;
}

/**
 * Track quiz completion with comprehensive data
 */
export async function trackQuizCompletion(quizData) {
  const userId = getCurrentUserId();
  
  try {
    await analyticsService.trackQuizCompletion(userId, {
      category: quizData.category || 'Unknown',
      difficulty: quizData.difficulty || 'Medium',
      score: quizData.score || 0,
      timeSpent: quizData.timeSpent || 0,
      questionsAnswered: quizData.questionsAnswered || 0,
      correctAnswers: quizData.correctAnswers || 0,
      xpEarned: quizData.xpEarned || 10,
      coinsEarned: quizData.coinsEarned || 5,
    });
    console.log('✅ Quiz completion tracked');
  } catch (error) {
    console.error('❌ Failed to track quiz completion:', error);
  }
}

/**
 * Track puzzle completion
 */
export async function trackPuzzleCompletion(puzzleData) {
  const userId = getCurrentUserId();
  
  try {
    await analyticsService.trackPuzzleCompletion(userId, {
      puzzleId: puzzleData.puzzleId || 'unknown',
      category: puzzleData.category || 'Unknown',
      difficulty: puzzleData.difficulty || 'Medium',
      timeSpent: puzzleData.timeSpent || 0,
      solvedCorrectly: puzzleData.solvedCorrectly || false,
      xpEarned: puzzleData.xpEarned || 15,
    });
    console.log('✅ Puzzle completion tracked');
  } catch (error) {
    console.error('❌ Failed to track puzzle completion:', error);
  }
}

/**
 * Track daily challenge submission
 */
export async function trackDailyChallengeSubmission(challengeData) {
  const userId = getCurrentUserId();
  
  try {
    await analyticsService.trackDailyChallengeSubmission(userId, {
      date: challengeData.date || new Date().toISOString().split('T')[0],
      type: challengeData.type || 'daily',
      difficulty: challengeData.difficulty || 'Medium',
      timeSpent: challengeData.timeSpent || 0,
      completed: challengeData.completed || false,
      xpEarned: challengeData.xpEarned || 20,
    });
    console.log('✅ Daily challenge tracked');
  } catch (error) {
    console.error('❌ Failed to track daily challenge:', error);
  }
}

/**
 * Track feature usage (page navigation, feature access, etc)
 */
export async function trackFeatureUsage(featureName, actionType = 'view') {
  const userId = getCurrentUserId();
  
  try {
    await analyticsService.trackFeatureUsage(userId, featureName, actionType);
    console.log(`✅ Feature usage tracked: ${featureName}`);
  } catch (error) {
    console.error('❌ Failed to track feature usage:', error);
  }
}

/**
 * Track generic event
 */
export async function trackEvent(eventType, eventData = {}) {
  const userId = getCurrentUserId();
  
  try {
    await analyticsService.trackEvent(userId, eventType, eventData);
    console.log('✅ Event tracked:', eventType);
  } catch (error) {
    console.error('❌ Failed to track event:', error);
  }
}

/**
 * Track page view
 */
export function trackPageView(pageName) {
  trackFeatureUsage(pageName, 'page_view');
}

/**
 * Track button click
 */
export function trackButtonClick(buttonName, featureName) {
  trackFeatureUsage(featureName, `click_${buttonName}`);
}

/**
 * Track form submission
 */
export function trackFormSubmission(formName, success = true) {
  trackEvent(`form_submitted_${formName}`, {
    formName,
    success,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track error occurrence
 */
export function trackError(errorType, errorMessage) {
  trackEvent('error_occurred', {
    errorType,
    errorMessage,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track user engagement (time spent on page, interactions, etc)
 */
export function trackEngagement(feature, engagementData) {
  trackEvent('user_engagement', {
    feature,
    ...engagementData,
    timestamp: new Date().toISOString(),
  });
}
