import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export async function getOrCreateQuestionOrder({
  user,
  category,
  difficulty,
  questionIds,
}) {
  const ref = doc(
    db,
    "users",
    user.uid,
    "questionOrder",
    `${category}_${difficulty}`
  );

  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data().order;
  }

  const shuffled = shuffle(questionIds);

  await setDoc(ref, {
    order: shuffled,
    createdAt: serverTimestamp(),
  });

  return shuffled;
}