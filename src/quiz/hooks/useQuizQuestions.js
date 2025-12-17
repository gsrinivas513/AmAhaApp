import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { QUESTIONS_PER_LEVEL } from "../constants";

const shuffle = (arr) =>
  arr
    .map((v) => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map((v) => v.v);

export function useQuizQuestions(category, difficulty) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    (async () => {
      const q = query(
        collection(db, "questions"),
        where("category", "==", category),
        where("level", "==", difficulty),
        orderBy("__name__"),
        limit(QUESTIONS_PER_LEVEL)
      );

      const snap = await getDocs(q);
      if (!active) return;

      setQuestions(shuffle(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
      setLoading(false);
    })();

    return () => { active = false; };
  }, [category, difficulty]);

  return { questions, loading };
}