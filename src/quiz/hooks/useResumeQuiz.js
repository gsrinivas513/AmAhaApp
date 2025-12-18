// src/quiz/hooks/useResumeQuiz.js
import { useEffect, useState } from "react";
import { loadResumeState, clearResumeState } from "../services/resumeService";
import ResumeBanner from "../components/ResumeBanner";

export function useResumeQuiz({ user, category, difficulty, setIndex }) {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user) {
      setResumeData(null);
      return;
    }

    loadResumeState(user).then((data) => {
      console.log("📦 Resume loaded RAW:", data);
      setResumeData(data || null);
    });
  }, [user]);

  const canResume =
    resumeData &&
    typeof resumeData.index === "number" &&
    resumeData.category === category &&
    resumeData.difficulty === difficulty;

if (!canResume || dismissed) {
  return { banner: null };
}

  return {
    banner: (
        <ResumeBanner
          index={resumeData.index}
          onResume={() => {
            setIndex(resumeData.index);
            setDismissed(true); // ✅ HIDE BANNER AFTER RESUME
          }}
          onRestart={async () => {
            await clearResumeState(user);
            setResumeData(null);
            setDismissed(true); // ✅ HIDE BANNER AFTER RESTART
          }}
        />
    ),
  };
}