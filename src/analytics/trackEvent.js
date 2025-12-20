import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function trackEvent(event, payload = {}) {
  try {
    await addDoc(collection(db, "analytics"), {
      event,
      ...payload,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Analytics error:", err);
  }
}