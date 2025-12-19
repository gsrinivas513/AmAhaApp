import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

/* ---------- DEFAULT FALLBACKS ---------- */
const DEFAULTS = {
  questionsPerLevel: 3,
  levelsPerDifficulty: 10,
  resumeEnabled: true,
  difficultyOrder: ["easy", "medium", "hard"],
};

export async function getQuizSettings() {
  try {
    const ref = doc(db, "settings", "features", "quiz");
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return DEFAULTS;
    }

    const data = snap.data();

    return {
      questionsPerLevel:
        data.global?.questionsPerLevel ?? DEFAULTS.questionsPerLevel,

      levelsPerDifficulty:
        data.global?.levelsPerDifficulty ?? DEFAULTS.levelsPerDifficulty,

      resumeEnabled:
        data.global?.resumeEnabled ?? DEFAULTS.resumeEnabled,

      difficultyOrder:
        data.difficultyOrder ?? DEFAULTS.difficultyOrder,

      categories: data.categories ?? {},
      difficulties: data.difficulties ?? {},
    };
  } catch (err) {
    console.error("⚠️ Quiz settings fallback used", err);
    return DEFAULTS;
  }
}