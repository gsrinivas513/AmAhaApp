// src/quiz/levelProgressService.js
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/**
 * Save highest completed level per category + difficulty
 * Safe, idempotent, overwrite-proof
 */
export async function saveLevelCompletion({
  user,
  category,
  difficulty,
  levelNumber,
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

  if (levelNumber > currentHighest) {
    await setDoc(
      ref,
      {
        highestLevelCompleted: levelNumber,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
}