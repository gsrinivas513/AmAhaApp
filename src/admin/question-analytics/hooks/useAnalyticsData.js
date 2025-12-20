// src/admin/question-analytics/hooks/useAnalyticsData.js
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

export function useAnalyticsData() {
  const [attempts, setAttempts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const atSnap = await getDocs(collection(db, "attempts"));
        setAttempts(atSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const qSnap = await getDocs(collection(db, "questions"));
        setQuestions(qSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("Analytics load failed", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { attempts, questions, loading };
}