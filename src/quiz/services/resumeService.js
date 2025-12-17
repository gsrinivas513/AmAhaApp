// src/quiz/services/resumeService.js
import { doc, setDoc, getDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export async function saveResumeState({
  user,
  category,
  difficulty,
  level,
  index,
}) {
  if (!user) return;

  const ref = doc(db, "users", user.uid, "resume", "active");

  await setDoc(ref, {
    category,
    difficulty,
    level,
    index,
    updatedAt: serverTimestamp(),
  });
}

export async function loadResumeState(user) {
  if (!user) return null;

  const ref = doc(db, "users", user.uid, "resume", "active");
  const snap = await getDoc(ref);

  return snap.exists() ? snap.data() : null;
}

export async function clearResumeState(user) {
  if (!user) return;

  const ref = doc(db, "users", user.uid, "resume", "active");
  await deleteDoc(ref);
}