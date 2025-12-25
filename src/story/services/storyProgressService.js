import { getUserStoryProgress, updateChapterProgress } from './storyService';

// Record chapter completion
export async function recordChapterCompletion(userId, storyId, chapterIndex, itemResults, chapterScore) {
  try {
    const progress = await getUserStoryProgress(userId, storyId);
    const chapter = progress.chapterProgress[chapterIndex] || {};

    // Aggregate item scores
    const scores = Object.values(itemResults)
      .filter(item => typeof item.score === 'number')
      .map(item => item.score);
    
    const avgScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : chapterScore || 0;

    // Record chapter data
    const chapterData = {
      startedAt: chapter.startedAt || new Date().toISOString(),
      score: avgScore,
      retryCount: (chapter.retryCount || 0),
      hintsUsed: chapter.hintsUsed || 0,
      items: itemResults,
      completedAt: new Date().toISOString()
    };

    const updated = await updateChapterProgress(userId, storyId, chapterIndex, chapterData);

    // Calculate and grant rewards
    const rewards = calculateRewards(avgScore, chapterIndex);
    if (rewards) {
      await grantRewards(userId, rewards);
    }

    return { 
      success: true, 
      rewards,
      progressPercentage: Math.round(
        (updated.completedChapters.length / (chapterIndex + 1)) * 100
      )
    };
  } catch (error) {
    console.error('Error recording chapter completion:', error);
    throw error;
  }
}

// Calculate rewards based on score
function calculateRewards(score, chapterIndex) {
  const baseXP = 100;
  const bonusXP = score >= 90 ? 50 : score >= 75 ? 25 : 0;
  const coins = Math.floor((baseXP + bonusXP) / 10);

  return {
    xp: baseXP + bonusXP,
    coins: coins,
    badge: chapterIndex === 0 ? 'first_chapter' : null,
    achievement: score >= 95 ? 'perfect_chapter' : null
  };
}

// Grant rewards to user
export async function grantRewards(userId, rewards) {
  try {
    // Integrate with gamification service
    // This would typically call:
    // await updateUserXP(userId, rewards.xp);
    // await addCoins(userId, rewards.coins);
    // if (rewards.badge) await unlockBadge(userId, rewards.badge);
    // if (rewards.achievement) await unlockAchievement(userId, rewards.achievement);

    console.log(`Rewards granted to ${userId}:`, rewards);
    return true;
  } catch (error) {
    console.error('Error granting rewards:', error);
    throw error;
  }
}

// Calculate time spent on chapter
export function calculateTimeSpent(startedAt) {
  if (!startedAt) return 0;
  const now = new Date();
  const start = typeof startedAt === 'string' ? new Date(startedAt) : startedAt;
  return Math.round((now - start) / 1000 / 60); // minutes
}

// Get difficulty scaling
export function getChapterDifficulty(chapterIndex) {
  const difficulties = ['easy', 'easy', 'medium', 'medium', 'hard', 'hard', 'expert'];
  return difficulties[Math.min(chapterIndex, difficulties.length - 1)];
}

// Determine retry policy for chapter
export function getRetryPolicy(storyData, chapterIndex) {
  const chapter = storyData.chapters[chapterIndex];
  if (!chapter) return 'unlimited';
  return chapter.retryPolicy || 'unlimited';
}

// Check if can retry chapter
export function canRetryChapter(chapterProgress, retryPolicy) {
  if (retryPolicy === 'unlimited') return true;
  if (retryPolicy === 'once') {
    return !chapterProgress || (chapterProgress.retryCount || 0) === 0;
  }
  
  // Handle "limited:N" format
  const match = retryPolicy.match(/limited:(\d+)/);
  if (match) {
    const maxRetries = parseInt(match[1]);
    return (chapterProgress?.retryCount || 0) < maxRetries;
  }

  return false;
}

// Record hint usage
export async function useHint(userId, storyId, chapterIndex) {
  try {
    const progress = await getUserStoryProgress(userId, storyId);
    const currentChapter = progress.chapterProgress[chapterIndex] || {};

    const hintsUsed = (currentChapter.hintsUsed || 0) + 1;

    await updateChapterProgress(userId, storyId, chapterIndex, {
      ...currentChapter,
      hintsUsed
    });

    return hintsUsed;
  } catch (error) {
    console.error('Error using hint:', error);
    throw error;
  }
}

// Get performance analytics
export function getPerformanceAnalytics(progress, storyData) {
  const completedCount = progress.completedChapters.length;
  const totalChapters = storyData.chapters.length;
  
  return {
    completionRate: Math.round((completedCount / totalChapters) * 100),
    averageScore: progress.overallScore,
    totalTimeSpent: progress.estimatedTimeSpent,
    totalRetries: progress.totalRetries,
    totalHintsUsed: progress.totalHintsUsed,
    chaptersCompleted: completedCount,
    chaptersRemaining: totalChapters - completedCount,
    estimatedTimeRemaining: Math.round(
      ((totalChapters - completedCount) * progress.estimatedTimeSpent) / Math.max(completedCount, 1)
    )
  };
}

// Estimate time to completion
export function estimateTimeToCompletion(progress, storyData) {
  const avgTimePerChapter = progress.estimatedTimeSpent > 0
    ? progress.estimatedTimeSpent / Math.max(progress.completedChapters.length, 1)
    : 15; // default 15 min per chapter

  const remainingChapters = storyData.chapters.length - progress.completedChapters.length;
  return Math.round(avgTimePerChapter * remainingChapters);
}

// Check hard lock situation (stuck, needs help)
export function isHardLocked(chapterProgress, retryPolicy) {
  if (!chapterProgress) return false;

  // Hard lock if:
  // 1. Multiple failed attempts on limited retries
  // 2. Score consistently below threshold
  // 3. All hints used

  const failedAttempts = (chapterProgress.retryCount || 0);
  const maxRetries = extractRetryCount(retryPolicy);

  return failedAttempts >= maxRetries && maxRetries > 0;
}

// Help options for hard-locked chapters
export function getHardLockOptions(chapterProgress, storyData, chapterIndex) {
  return {
    skipChapter: false, // Don't allow skipping in story mode
    useHint: (chapterProgress.hintsUsed || 0) < 3,
    retryWithHints: !isHardLocked(chapterProgress, storyData.chapters[chapterIndex]?.retryPolicy),
    practiceMode: true, // Offer practice with easier difficulty
    askTeacher: true // Request help from instructor
  };
}

function extractRetryCount(retryPolicy) {
  if (retryPolicy === 'unlimited') return 999;
  if (retryPolicy === 'once') return 1;
  
  const match = retryPolicy.match(/limited:(\d+)/);
  return match ? parseInt(match[1]) : 999;
}

// Story progress summary for certificate
export function generateCertificateSummary(progress, storyData) {
  return {
    userName: 'Student Name', // Should come from user data
    storyTitle: storyData.title,
    completionDate: progress.completedAt || new Date().toISOString(),
    finalScore: progress.overallScore,
    chaptersCompleted: progress.completedChapters.length,
    totalChapters: storyData.chapters.length,
    totalTimeSpent: progress.estimatedTimeSpent,
    performanceLevel: getPerformanceLevel(progress.overallScore),
    certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
}

function getPerformanceLevel(score) {
  if (score >= 95) return 'Excellence';
  if (score >= 85) return 'Proficiency';
  if (score >= 75) return 'Competency';
  return 'Completion';
}
