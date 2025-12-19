// src/quiz/hooks/useResumeQuiz.js
import { useEffect, useState } from "react";
import { loadResumeState, clearResumeState } from "../services/resumeService";

export function useResumeQuiz({ user, category, difficulty, level }) {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadResumeState(user).then((data) => {
      setResumeData(data || null);
      setLoading(false);
      setDismissed(false);
    });
  }, [user]);

  const canResume =
    resumeData &&
    resumeData.category === category &&
    resumeData.difficulty === difficulty &&
    String(resumeData.level) === String(level);

  return {
    loading,
    canResume: canResume && !dismissed,
    resumeData: canResume ? resumeData : null,
    dismiss: () => setDismissed(true),
    clear: async () => {
      if (user) await clearResumeState(user);
      setResumeData(null);
      setDismissed(true);
    },
  };
}