import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

/**
 * Save highest completed level for a category + difficulty
 * Path:
 * users/{uid}/progress/{category}_{difficulty}
 */
export default async function saveLevelCompletion({
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

  const currentHighest = snap.exists()
    ? snap.data().highestLevelCompleted || 0
    : 0;

  // ✅ Only update if new level is higher
  if (level > currentHighest) {
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