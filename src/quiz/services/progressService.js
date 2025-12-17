import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

/**
 * Get highest completed level for category + difficulty
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
  return snap.exists() ? snap.data().highestLevelCompleted || 0 : 0;
}

/**
 * Save level completion safely (only forward progress)
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
  const highest = snap.exists()
    ? snap.data().highestLevelCompleted || 0
    : 0;

  if (level > highest) {
    await setDoc(
      ref,
      {
        highestLevelCompleted: level,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
}