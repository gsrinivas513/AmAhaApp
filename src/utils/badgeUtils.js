import { BADGES } from "../config/badges";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/**
 * Evaluates badge conditions using latest Firestore stats.
 * Writes newly unlocked badges and RETURNS them for UI use.
 */
export async function evaluateAndAwardBadges(user) {
  if (!user) return [];

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return [];

  const stats = snap.data().stats || {};
  const existing = stats.badges || [];

  const newlyUnlocked = [];

  Object.values(BADGES).forEach((badge) => {
    if (!existing.includes(badge.id) && badge.condition(stats)) {
      newlyUnlocked.push(badge);
    }
  });

  if (newlyUnlocked.length > 0) {
    await updateDoc(userRef, {
      "stats.badges": arrayUnion(...newlyUnlocked.map(b => b.id)),
    });
  }

  return newlyUnlocked;
}