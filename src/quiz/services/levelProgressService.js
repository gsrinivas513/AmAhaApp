import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export async function saveLevelCompletion({
  user,
  category,
  difficulty,
  level,
}) {
  console.log("🔥 saveLevelCompletion CALLED", {
    uid: user?.uid,
    category,
    difficulty,
    level,
  });

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
        highestCompleted: 0,
        easyCompletedLevels: 0,
        mediumCompletedLevels: 0,
        hardCompletedLevels: 0,
        trophyEarned: false,
      };

  if (level > data.highestCompleted) {
    data.highestCompleted = level;
  }

  const field = `${difficulty}CompletedLevels`;
  data[field] = Math.max(data[field], level);

  await setDoc(ref, data, { merge: true });

  console.log("✅ Progress saved", data);
}