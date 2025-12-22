// src/quiz/hooks/useQuizQuestions.js
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { getOrCreateQuestionOrder } from "../services/questionOrderService";
import { useAuth } from "../../components/AuthProvider";

export function useQuizQuestions(categoryOrSubtopic, difficulty) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    async function loadQuestions() {
      try {
        console.log("📦 Loading questions", { categoryOrSubtopic, difficulty });

        // Assume it's a subtopic name (from new URL structure)
        // Try to decode it first in case it's URL encoded
        let queryField = "subtopic";
        let queryValue = decodeURIComponent(categoryOrSubtopic);
        
        console.log("🎯 Querying by subtopic:", queryValue);

        const q = query(
          collection(db, "questions"),
          where(queryField, "==", queryValue),
          where("difficulty", "==", difficulty)
        );

        const snap = await getDocs(q);

        console.log("🔥 Firestore snapshot size:", snap.size);

        if (!active) return;

        const all = snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        }));

        // 🔑 GUEST USERS → NO ORDERING
        if (!user) {
          setQuestions(all);
          return;
        }

        // 🔐 LOGGED-IN USERS → ORDERED QUESTIONS
        const order = await getOrCreateQuestionOrder({
          user,
          category: categoryOrSubtopic,
          difficulty,
          questionIds: all.map(q => q.id),
        });

        const orderedQuestions = order
          .map(id => all.find(q => q.id === id))
          .filter(Boolean);

        setQuestions(orderedQuestions);
      } catch (err) {
        console.error("❌ Failed to load questions", err);
        setQuestions([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadQuestions();

    return () => {
      active = false;
    };
  }, [user, categoryOrSubtopic, difficulty]);

  return { questions, loading };
}