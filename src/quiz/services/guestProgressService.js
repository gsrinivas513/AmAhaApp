// src/quiz/services/guestProgressService.js

const KEY = "guest_progress_v1";

/*
Structure (EXTENDED but backward compatible):
{
  [category]: {
    [difficulty]: {
      highestLevel: number,
      xp: number,
      coins: number
    }
  }
}
*/

export function getGuestProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/* ---------------- SAVE LEVEL COMPLETE ---------------- */
export function saveGuestLevel({
  category,
  difficulty,
  level,
  xpEarned = 0,
  coinsEarned = 0,
}) {
  const data = getGuestProgress();

  const prev =
    data?.[category]?.[difficulty];

  // 🛡️ Backward compatibility
  let prevHighest = 0;
  let prevXp = 0;
  let prevCoins = 0;

  if (typeof prev === "number") {
    prevHighest = prev;
  } else if (prev) {
    prevHighest = prev.highestLevel || 0;
    prevXp = prev.xp || 0;
    prevCoins = prev.coins || 0;
  }

  const nextHighest = Math.max(prevHighest, level);

  data[category] = {
    ...(data[category] || {}),
    [difficulty]: {
      highestLevel: nextHighest,
      xp: prevXp + xpEarned,
      coins: prevCoins + coinsEarned,
    },
  };

  localStorage.setItem(KEY, JSON.stringify(data));
}

/* ---------------- GET HIGHEST LEVEL ---------------- */
export function getGuestHighestLevel(category, difficulty) {
  const data = getGuestProgress();
  const entry = data?.[category]?.[difficulty];

  if (typeof entry === "number") return entry;
  if (entry?.highestLevel) return entry.highestLevel;

  return 0;
}

/* ---------------- CLEAR ---------------- */
export function clearGuestProgress() {
  localStorage.removeItem(KEY);
}

/* ============== DAILY CHALLENGE (GUEST) ============== */

/**
 * Get guest daily challenge history
 */
export function getGuestDailyChallenges() {
  try {
    const key = "guest_daily_challenges_v1";
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save guest daily challenge completion
 */
export function saveGuestDailyChallengeCompletion(score) {
  const today = new Date().toISOString().split('T')[0];
  const data = getGuestDailyChallenges();

  data[today] = {
    dateISO: today,
    completed: true,
    completedAt: new Date().toISOString(),
    score
  };

  localStorage.setItem("guest_daily_challenges_v1", JSON.stringify(data));
}

/**
 * Check if guest completed today's challenge
 */
export function hasCompletedTodayChallenge() {
  const today = new Date().toISOString().split('T')[0];
  const data = getGuestDailyChallenges();
  return data[today]?.completed === true;
}

/**
 * Get guest daily streak
 */
export function getGuestDailyStreak() {
  try {
    const key = "guest_daily_streak_v1";
    const raw = localStorage.getItem(key);

    if (!raw) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: null
      };
    }

    return JSON.parse(raw);
  } catch {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null
    };
  }
}

/**
 * Update guest daily streak
 * Call after marking challenge complete
 */
export function updateGuestDailyStreak() {
  const today = new Date().toISOString().split('T')[0];
  const streak = getGuestDailyStreak();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString().split('T')[0];

  let newStreak = 1;
  let longestStreak = streak.longestStreak || 0;

  // Check if consecutive
  if (streak.lastCompletedDate === yesterdayISO) {
    newStreak = (streak.currentStreak || 0) + 1;
    longestStreak = Math.max(newStreak, longestStreak);
  }

  const updated = {
    currentStreak: newStreak,
    longestStreak,
    lastCompletedDate: today
  };

  localStorage.setItem("guest_daily_streak_v1", JSON.stringify(updated));
  return updated;
}

/* =============== STORY PROGRESS (GUEST) =============== */

/**
 * Get guest story progress
 */
export function getGuestStoryProgress(storyId) {
  try {
    const key = `guest_story_progress_${storyId}_v1`;
    const raw = localStorage.getItem(key);

    if (!raw) {
      return {
        storyId,
        completedChapters: [],
        currentChapter: 1,
        completed: false
      };
    }

    return JSON.parse(raw);
  } catch {
    return {
      storyId,
      completedChapters: [],
      currentChapter: 1,
      completed: false
    };
  }
}

/**
 * Save guest story progress
 */
export function saveGuestStoryProgress(storyId, chapterId, isComplete = false) {
  const progress = getGuestStoryProgress(storyId);

  // Add chapter if not already there
  if (!progress.completedChapters.includes(chapterId)) {
    progress.completedChapters.push(chapterId);
  }

  progress.currentChapter = chapterId;
  progress.completed = isComplete;

  const key = `guest_story_progress_${storyId}_v1`;
  localStorage.setItem(key, JSON.stringify(progress));

  return progress;
}

/**
 * Get all guest stories
 */
export function getGuestAllStories() {
  try {
    const keys = Object.keys(localStorage);
    const storyKeys = keys.filter(k => k.startsWith("guest_story_progress_") && k.endsWith("_v1"));

    const stories = storyKeys.map(key => {
      const storyId = key.replace("guest_story_progress_", "").replace("_v1", "");
      return getGuestStoryProgress(storyId);
    });

    return stories;
  } catch {
    return [];
  }
}