/**
 * Story Retry Policy Service
 * Manages retry policies for story chapters
 * Prevents hard-lock scenarios with practice mode support
 * 
 * @module services/storyRetryPolicyService
 */

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

/**
 * Retry Policy Definitions
 */
export const RETRY_POLICIES = {
  unlimited: {
    id: 'unlimited',
    name: 'Unlimited Retries',
    description: 'Try as many times as you need',
    maxRetries: Infinity,
    requiresPractice: false,
    cooldownMinutes: 0,
    icon: '♾️',
    recommendedFor: 'Beginner'
  },
  limited: {
    id: 'limited',
    name: 'Limited Retries',
    description: 'Limited attempts before practice required',
    maxRetries: 3,
    requiresPractice: true,
    cooldownMinutes: 5,
    icon: '⏰',
    recommendedFor: 'Intermediate'
  },
  once: {
    id: 'once',
    name: 'One Attempt',
    description: 'Single attempt; must practice to retry',
    maxRetries: 0,
    requiresPractice: true,
    cooldownMinutes: 60,
    icon: '⚡',
    recommendedFor: 'Advanced'
  },
  progressive: {
    id: 'progressive',
    name: 'Progressive Unlock',
    description: 'Unlock more retries by practicing',
    maxRetries: 2,
    requiresPractice: true,
    cooldownMinutes: 10,
    unlockHintsOnRetry: true,
    icon: '📈',
    recommendedFor: 'Intermediate'
  }
};

/**
 * Check if user can retry chapter
 * Implements safe fallback: always allows practice mode
 * @param {string} userId - User ID
 * @param {string} storyId - Story ID
 * @param {string} chapterId - Chapter ID
 * @returns {Promise<object>} Retry capability information
 */
export async function canRetryChapter(userId, storyId, chapterId) {
  try {
    const progressRef = doc(db, `users/${userId}/story_progress`, storyId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      return {
        canRetry: true,
        reason: 'First attempt',
        canPractice: true,
        requiresPractice: false
      };
    }

    const chapters = progressSnap.data().chapters || [];
    const chapterProgress = chapters.find(c => c.chapterId === chapterId);

    if (!chapterProgress) {
      return {
        canRetry: true,
        reason: 'Chapter not started',
        canPractice: true,
        requiresPractice: false
      };
    }

    // Get chapter policy
    const chapterRef = doc(db, `stories/${storyId}/chapters`, chapterId);
    const chapterSnap = await getDoc(chapterRef);
    const chapterData = chapterSnap.data() || {};
    const policyId = chapterData.retryPolicy || 'unlimited';
    const policy = RETRY_POLICIES[policyId] || RETRY_POLICIES.unlimited;

    // Check retry count
    const retries = chapterProgress.retries || 0;
    if (retries >= policy.maxRetries && policy.maxRetries !== Infinity) {
      return {
        canRetry: false,
        reason: 'Max retries exceeded',
        retriesUsed: retries,
        maxRetries: policy.maxRetries,
        canPractice: true, // Always allow practice
        requiresPractice: true,
        practiceUrl: `/story/${storyId}/chapter/${chapterId}/practice`,
        feedback: 'You\'ve used all your retries. Try the practice mode to improve!'
      };
    }

    // Check cooldown
    if (chapterProgress.lastAttemptTime) {
      const lastAttempt = new Date(chapterProgress.lastAttemptTime.seconds * 1000);
      const cooldownMs = policy.cooldownMinutes * 60 * 1000;
      const nextRetryTime = new Date(lastAttempt.getTime() + cooldownMs);

      if (new Date() < nextRetryTime) {
        return {
          canRetry: false,
          reason: 'Cooldown active',
          nextRetryTime,
          minutesRemaining: Math.ceil((nextRetryTime - new Date()) / 60000),
          canPractice: true,
          feedback: `Wait ${Math.ceil((nextRetryTime - new Date()) / 60000)} minutes before retrying.`
        };
      }
    }

    return {
      canRetry: true,
      reason: 'Ready to retry',
      retriesUsed: retries,
      retriesRemaining: Math.max(0, policy.maxRetries - retries),
      requiresPractice: policy.requiresPractice && retries > 0,
      canPractice: true
    };
  } catch (e) {
    console.error('[StoryRetryPolicy] Error checking retry eligibility:', e);
    // Safe fallback: allow practice if any error
    return {
      canRetry: false,
      canPractice: true,
      error: e.message
    };
  }
}

/**
 * Get chapter retry policy configuration
 * @param {string} storyId - Story ID
 * @param {string} chapterId - Chapter ID
 * @returns {Promise<object>} Retry policy
 */
export async function getChapterRetryPolicy(storyId, chapterId) {
  try {
    const chapterRef = doc(db, `stories/${storyId}/chapters`, chapterId);
    const chapterSnap = await getDoc(chapterRef);

    if (!chapterSnap.exists()) {
      return RETRY_POLICIES.unlimited;
    }

    const policyId = chapterSnap.data().retryPolicy || 'unlimited';
    return RETRY_POLICIES[policyId] || RETRY_POLICIES.unlimited;
  } catch (e) {
    console.error('[StoryRetryPolicy] Error getting policy:', e);
    return RETRY_POLICIES.unlimited;
  }
}

/**
 * Start chapter in practice mode (never hard-locks)
 * Users can practice unlimited times before retry
 * @param {string} userId - User ID
 * @param {string} storyId - Story ID
 * @param {string} chapterId - Chapter ID
 * @returns {Promise<object>} Practice session info
 */
export async function startChapterInPracticeMode(userId, storyId, chapterId) {
  try {
    const practiceSession = {
      userId,
      storyId,
      chapterId,
      mode: 'practice',
      startTime: serverTimestamp(),
      scoreDoesntCount: true,
      hintLimit: null, // Unlimited hints in practice
      timeLimit: null, // No time limit
      createdAt: new Date().toISOString()
    };

    // Store in subcollection for tracking
    const sessionRef = doc(
      collection(db, `users/${userId}/practice_sessions`)
    );
    await updateDoc(sessionRef, practiceSession);

    return {
      sessionId: sessionRef.id,
      ...practiceSession,
      message: 'Practice mode enabled - your score won\'t be recorded'
    };
  } catch (e) {
    console.error('[StoryRetryPolicy] Error starting practice mode:', e);
    throw e;
  }
}

/**
 * Record chapter attempt
 * Tracks retries and manages hard-lock prevention
 * @param {string} userId - User ID
 * @param {string} storyId - Story ID
 * @param {string} chapterId - Chapter ID
 * @param {object} attemptData - Attempt data (score, mode, etc.)
 * @returns {Promise<object>} Recording result
 */
export async function recordChapterAttempt(userId, storyId, chapterId, attemptData) {
  try {
    const progressRef = doc(db, `users/${userId}/story_progress`, storyId);
    const progressSnap = await getDoc(progressRef);

    const progressData = progressSnap.exists() ? progressSnap.data() : { chapters: [] };
    const chapters = progressData.chapters || [];

    const chapterIndex = chapters.findIndex(c => c.chapterId === chapterId);
    const baseProgress = chapterIndex >= 0 ? chapters[chapterIndex] : {};

    // Practice mode doesn't count as retry
    if (attemptData.mode === 'practice') {
      const updated = {
        ...baseProgress,
        chapterId,
        practiceAttempts: (baseProgress.practiceAttempts || 0) + 1,
        lastPracticeTime: serverTimestamp()
      };

      const newChapters = chapterIndex >= 0 
        ? chapters.map((c, i) => i === chapterIndex ? updated : c)
        : [...chapters, updated];

      await updateDoc(progressRef, { chapters: newChapters });

      return {
        recorded: true,
        mode: 'practice',
        message: 'Practice attempt recorded',
        practiceAttempts: updated.practiceAttempts
      };
    }

    // Normal mode: count as official attempt
    const retries = (baseProgress.retries || 0) + 1;
    const completionData = {
      ...baseProgress,
      chapterId,
      ...attemptData,
      retries,
      lastAttemptTime: serverTimestamp()
    };

    // Check if passed
    if (attemptData.score >= 75) {
      completionData.passed = true;
      completionData.passedAt = serverTimestamp();
    } else {
      completionData.passed = false;
    }

    const newChapters = chapterIndex >= 0
      ? chapters.map((c, i) => i === chapterIndex ? completionData : c)
      : [...chapters, completionData];

    await updateDoc(progressRef, { chapters: newChapters });

    return {
      recorded: true,
      mode: 'normal',
      passed: completionData.passed,
      retries,
      score: attemptData.score
    };
  } catch (e) {
    console.error('[StoryRetryPolicy] Error recording attempt:', e);
    throw e;
  }
}

/**
 * Get chapter practice recommendations
 * Analyzes performance and suggests practice areas
 * @param {string} userId - User ID
 * @param {string} storyId - Story ID
 * @param {string} chapterId - Chapter ID
 * @returns {Promise<object|null>} Practice recommendations or null if chapter passed
 */
export async function getChapterPracticeRecommendations(userId, storyId, chapterId) {
  try {
    const progressRef = doc(db, `users/${userId}/story_progress`, storyId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      return null;
    }

    const chapters = progressSnap.data().chapters || [];
    const chapterProgress = chapters.find(c => c.chapterId === chapterId);

    if (!chapterProgress) {
      return {
        isRecommended: true,
        reason: 'First attempt',
        message: 'Try the practice mode to prepare'
      };
    }

    // If already passed, no recommendations needed
    if (chapterProgress.passed) {
      return null;
    }

    // If failed multiple times, recommend practice
    const retries = chapterProgress.retries || 0;
    if (retries > 0) {
      return {
        isRecommended: true,
        reason: `Failed after ${retries} attempt(s)`,
        score: chapterProgress.score,
        weakness: chapterProgress.weakness || 'Overall difficulty',
        message: `You scored ${chapterProgress.score}%. Practice focusing on ${chapterProgress.weakness || 'the main concepts'}.`,
        practiceExercises: generatePracticeExercises(chapterProgress.weakness),
        estimatedTime: '10-15 minutes',
        willImprove: ['Accuracy', 'Confidence', 'Comprehension']
      };
    }

    return null;
  } catch (e) {
    console.error('[StoryRetryPolicy] Error getting recommendations:', e);
    return null;
  }
}

/**
 * Get hard-lock prevention status
 * Shows if user is in danger of being hard-locked
 * @param {string} userId - User ID
 * @param {string} storyId - Story ID
 * @param {string} chapterId - Chapter ID
 * @returns {Promise<object>} Hard-lock status
 */
export async function getHardLockPreventionStatus(userId, storyId, chapterId) {
  try {
    const policy = await getChapterRetryPolicy(storyId, chapterId);
    const retryStatus = await canRetryChapter(userId, storyId, chapterId);

    return {
      isHardLocked: !retryStatus.canRetry && !retryStatus.canPractice,
      isDangerZone: retryStatus.canRetry === false,
      canPractice: retryStatus.canPractice,
      policy,
      suggestion: generateHardLockPrevention(policy, retryStatus)
    };
  } catch (e) {
    console.error('[StoryRetryPolicy] Error checking hard-lock status:', e);
    return {
      isHardLocked: false,
      canPractice: true,
      suggestion: 'Use practice mode to improve'
    };
  }
}

/**
 * Generate practice exercises based on weakness
 * @private
 */
function generatePracticeExercises(weakness) {
  const exercisesMap = {
    'Comprehension': ['Read chapter content again', 'Answer review questions'],
    'Vocabulary': ['Review key terms', 'Match definitions'],
    'Calculation': ['Try practice problems', 'Review formulas'],
    'Overall difficulty': ['Start with easier questions', 'Use hint system']
  };

  return exercisesMap[weakness] || exercisesMap['Overall difficulty'];
}

/**
 * Generate hard-lock prevention suggestion
 * @private
 */
function generateHardLockPrevention(policy, retryStatus) {
  if (retryStatus.canRetry) {
    return `You have ${retryStatus.retriesRemaining || 'unlimited'} retries remaining`;
  }

  if (retryStatus.canPractice) {
    return '📚 Practice mode is available - use it to improve before retrying!';
  }

  return '❌ Hard-locked. Please contact support for assistance.';
}

/**
 * Get all chapters in story with retry information
 * @param {string} storyId - Story ID
 * @returns {Promise<Array>} Chapters with retry policies
 */
export async function getStoryChaptersWithPolicies(storyId) {
  try {
    const chaptersRef = collection(db, `stories/${storyId}/chapters`);
    const snapshot = await getDocs(chaptersRef);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      policy: RETRY_POLICIES[doc.data().retryPolicy || 'unlimited']
    }));
  } catch (e) {
    console.error('[StoryRetryPolicy] Error getting chapters:', e);
    return [];
  }
}

/**
 * Reset chapter progress (admin only)
 * @param {string} userId - User ID
 * @param {string} storyId - Story ID
 * @param {string} chapterId - Chapter ID
 * @returns {Promise<void>}
 */
export async function resetChapterProgress(userId, storyId, chapterId) {
  try {
    const progressRef = doc(db, `users/${userId}/story_progress`, storyId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) return;

    const chapters = progressSnap.data().chapters || [];
    const filtered = chapters.filter(c => c.chapterId !== chapterId);

    await updateDoc(progressRef, { chapters: filtered });
  } catch (e) {
    console.error('[StoryRetryPolicy] Error resetting chapter:', e);
    throw e;
  }
}

export default {
  RETRY_POLICIES,
  canRetryChapter,
  getChapterRetryPolicy,
  startChapterInPracticeMode,
  recordChapterAttempt,
  getChapterPracticeRecommendations,
  getHardLockPreventionStatus,
  getStoryChaptersWithPolicies,
  resetChapterProgress
};
