// src/quiz/hooks/useSubcategoryQuestions.js
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { getOrCreateQuestionOrder } from "../services/questionOrderService";
import { useAuth } from "../../components/AuthProvider";

/**
 * Hook to load questions for a category or subcategory
 * Supports both:
 * - category: "kids" (all Kids quizzes)
 * - subcategory: "math" (only Math quizzes in Kids)
 */
export function useSubcategoryQuestions(categoryOrSubcategoryId, difficulty) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadQuestions() {
      try {
        console.log("📦 Loading questions", {
          categoryOrSubcategoryId,
          difficulty,
        });

        // First, try to find if this is a subcategory
        let queryConstraints = [];

        // Try subcategory first
        const subcatSnap = await getDocs(
          query(
            collection(db, "subtopics"),
            where("name", "==", categoryOrSubcategoryId)
          )
        );

        if (!subcatSnap.empty) {
          // It's a subcategory - query by subcategory field
          console.log("🎯 Found as subcategory, querying by subcategory field");
          queryConstraints = [
            where("subcategory", "==", categoryOrSubcategoryId),
            where("difficulty", "==", difficulty),
          ];
        } else {
          // Fall back to category field (backward compatibility)
          console.log("🎯 Treating as category, querying by category field");
          queryConstraints = [
            where("category", "==", categoryOrSubcategoryId),
            where("difficulty", "==", difficulty),
          ];
        }

        const q = query(collection(db, "questions"), ...queryConstraints);
        const snap = await getDocs(q);

        console.log("🔥 Firestore snapshot size:", snap.size);

        if (!active) return;

        const all = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // 🔑 GUEST USERS → NO ORDERING
        if (!user) {
          setQuestions(all);
          setLoading(false);
          return;
        }

        // 🔐 LOGGED-IN USERS → ORDERED QUESTIONS
        const order = await getOrCreateQuestionOrder({
          user,
          category: categoryOrSubcategoryId,
          difficulty,
          questionIds: all.map((q) => q.id),
        });

        const orderedQuestions = order
          .map((id) => all.find((q) => q.id === id))
          .filter(Boolean);

        if (active) {
          setQuestions(orderedQuestions);
        }
      } catch (e) {
        console.error("❌ Error loading questions:", e);
        if (active) {
          setQuestions([]);
        }
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
  }, [categoryOrSubcategoryId, difficulty, user]);

  return { questions, loading };
}
