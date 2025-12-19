// src/quiz/services/progressService.js
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

/**
 * Save level completion for a user
 */
export async function saveLevelCompletion({
  user,
  category,
  difficulty,
  level,
}) {
  if (!user) return;

  const ref = doc(
    db,
    "users",
    user.uid,
    "progress",
    `${category}_${difficulty}`
  );

  const snap = await getDoc(ref);

  const data = snap.exists()
    ? snap.data()
    : {
        easyCompletedLevels: 0,
        mediumCompletedLevels: 0,
        hardCompletedLevels: 0,
        trophyEarned: false,
      };

  const field = `${difficulty}CompletedLevels`;

  // ✅ Ensure monotonic progress (no double increment)
  data[field] = Math.max(data[field], Number(level));

  // 🏆 Trophy condition
  if (
    data.easyCompletedLevels >= 10 &&
    data.mediumCompletedLevels >= 10 &&
    data.hardCompletedLevels >= 10
  ) {
    data.trophyEarned = true;
  }

  await setDoc(
    ref,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  console.log("✅ Progress saved", data);
}

/**
 * Get highest completed level for a difficulty
 */
export async function getHighestCompletedLevel(user, category, difficulty) {
  if (!user) return 0;

  const ref = doc(
    db,
    "users",
    user.uid,
    "progress",
    `${category}_${difficulty}`
  );

  const snap = await getDoc(ref);
  if (!snap.exists()) return 0;

  const data = snap.data();
  const field = `${difficulty}CompletedLevels`;

  return Number(data[field] || 0);
}