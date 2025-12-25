// src/quiz/services/progressService.js
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

/* =========================================================
   CONSTANTS
========================================================= */

const GUEST_PROGRESS_KEY = "quiz_guest_progress";

/* =========================================================
   GUEST HELPERS
========================================================= */

function getGuestProgress() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_PROGRESS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveGuestProgress(progress) {
  localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(progress));
}

function clearGuestProgress() {
  localStorage.removeItem(GUEST_PROGRESS_KEY);
}

/* =========================================================
   PUBLIC API
========================================================= */

/**
 * Get highest completed level (guest or user)
 */
export async function getHighestCompletedLevel(
  user,
  category,
  difficulty
) {
  // 🧑 USER
  if (user) {
    const ref = doc(
      db,
      "user_progress",
      user.uid,
      category,
      difficulty
    );
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data().highestCompleted || 0 : 0;
  }

  // 👤 GUEST
  const guest = getGuestProgress();
  return (
    guest?.[category]?.[difficulty]?.highestCompleted || 0
  );
}

/**
 * Mark a level as completed (guest or user)
 */
export async function markLevelCompleted(
  user,
  category,
  difficulty,
  level
) {
  // 🧑 USER
  if (user) {
    const ref = doc(
      db,
      "user_progress",
      user.uid,
      category,
      difficulty
    );

    const snap = await getDoc(ref);
    const prev = snap.exists()
      ? snap.data().highestCompleted || 0
      : 0;

    if (level > prev) {
      await setDoc(
        ref,
        { highestCompleted: level },
        { merge: true }
      );
    }
    return;
  }

  // 👤 GUEST
  const guest = getGuestProgress();

  if (!guest[category]) guest[category] = {};
  if (!guest[category][difficulty]) {
    guest[category][difficulty] = { highestCompleted: 0 };
  }

  if (level > guest[category][difficulty].highestCompleted) {
    guest[category][difficulty].highestCompleted = level;
    saveGuestProgress(guest);
  }
}

/**
 * Merge guest progress into user account after login
 */
export async function mergeGuestProgressToUser(user) {
  const guest = getGuestProgress();
  if (!guest || Object.keys(guest).length === 0) return;

  for (const category of Object.keys(guest)) {
    for (const difficulty of Object.keys(guest[category])) {
      const guestLevel =
        guest[category][difficulty].highestCompleted || 0;

      if (guestLevel === 0) continue;

      const ref = doc(
        db,
        "user_progress",
        user.uid,
        category,
        difficulty
      );

      const snap = await getDoc(ref);
      const userLevel = snap.exists()
        ? snap.data().highestCompleted || 0
        : 0;

      if (guestLevel > userLevel) {
        await setDoc(
          ref,
          { highestCompleted: guestLevel },
          { merge: true }
        );
      }
    }
  }

  // 🧹 cleanup
  clearGuestProgress();
}

/**
 * Save daily challenge completion (user)
 * Extended for daily challenge feature
 */
export async function saveDailyChallengeCompletion(
  user,
  score,
  xpEarned = 50,
  coinsEarned = 10
) {
  if (!user) return;

  const today = new Date().toISOString().split('T')[0];
  const ref = doc(
    db,
    "user_daily_challenges",
    user.uid,
    "completions",
    today
  );

  await setDoc(
    ref,
    {
      dateISO: today,
      completed: true,
      completedAt: new Date().toISOString(),
      score,
      xpEarned,
      coinsEarned
    },
    { merge: true }
  );
}

/**
 * Get daily challenge history (user)
 */
export async function getDailyChallengeHistory(user, days = 30) {
  if (!user) return [];

  const ref = doc(db, "user_daily_challenges", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return [];

  const data = snap.data();
  return Object.entries(data)
    .slice(0, days)
    .map(([date, info]) => ({
      date,
      ...info
    }));
}

/**
 * Save story progress (user)
 * Extended for story-based learning feature
 */
export async function saveStoryProgress(
  user,
  storyId,
  chapterId,
  xpEarned = 0
) {
  if (!user) return;

  const ref = doc(
    db,
    "user_story_progress",
    user.uid,
    "stories",
    storyId
  );

  const snap = await getDoc(ref);
  const prev = snap.exists() ? snap.data() : { completedChapters: [] };

  const completedChapters = [
    ...new Set([...(prev.completedChapters || []), chapterId])
  ];

  await setDoc(
    ref,
    {
      storyId,
      completedChapters,
      currentChapter: chapterId,
      totalXpEarned: (prev.totalXpEarned || 0) + xpEarned,
      lastPlayed: new Date().toISOString()
    },
    { merge: true }
  );
}

/**
 * Get story progress (user)
 */
export async function getStoryProgress(user, storyId) {
  if (!user) return null;

  const ref = doc(
    db,
    "user_story_progress",
    user.uid,
    "stories",
    storyId
  );

  const snap = await getDoc(ref);
  return snap.exists()
    ? snap.data()
    : {
        storyId,
        completedChapters: [],
        currentChapter: 1,
        totalXpEarned: 0,
        lastPlayed: null
      };
}