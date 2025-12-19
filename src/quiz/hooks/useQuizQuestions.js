// src/quiz/hooks/useQuizQuestions.js
// src/quiz/hooks/useQuizQuestions.js
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { getOrCreateQuestionOrder } from "../services/questionOrderService";
import { useAuth } from "../../components/AuthProvider";

export function useQuizQuestions(category, difficulty) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let active = true;
    setLoading(true);

    (async () => {
      const q = query(
        collection(db, "questions"),
        where("category", "==", category),
        where("difficulty", "==", difficulty)
      );

      const snap = await getDocs(q);
      if (!active) return;

      const all = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));

      const order = await getOrCreateQuestionOrder({
        user,
        category,
        difficulty,
        questionIds: all.map(q => q.id),
      });

      const orderedQuestions = order
        .map(id => all.find(q => q.id === id))
        .filter(Boolean);

      setQuestions(orderedQuestions);
      setLoading(false);
    })();

    return () => { active = false; };
  }, [user, category, difficulty]);

  return { questions, loading };
}