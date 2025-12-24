// src/quiz/services/puzzleService.js
import { db } from "../../firebase/firebaseConfig";
import { collection, doc, getDoc, getDocs, query, where, updateDoc, setDoc } from "firebase/firestore";

export async function getPuzzlesByCategory(category) {
  const q = query(collection(db, "puzzles"), where("category", "==", category), where("isPublished", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getPuzzleById(puzzleId) {
  const ref = doc(db, "puzzles", puzzleId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function markPuzzleCompleted(user, category, topic, subtopic, puzzleId) {
  if (!user) return;
  const ref = doc(db, "users", user.uid, "puzzleProgress", puzzleId);
  await setDoc(ref, {
    category,
    topic,
    subtopic,
    completedAt: new Date().toISOString()
  }, { merge: true });
}

export async function addPuzzle(puzzle) {
  const ref = doc(collection(db, "puzzles"));
  await setDoc(ref, { ...puzzle, isPublished: true });
  return ref.id;
}

export async function updatePuzzle(puzzleId, puzzle) {
  const ref = doc(db, "puzzles", puzzleId);
  await updateDoc(ref, { ...puzzle });
}

export async function getAllPuzzles() {
  const snap = await getDocs(collection(db, "puzzles"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deletePuzzle(puzzleId) {
  const ref = doc(db, "puzzles", puzzleId);
  await setDoc(ref, { isPublished: false }, { merge: true });
}
