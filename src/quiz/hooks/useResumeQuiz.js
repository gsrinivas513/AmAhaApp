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
      setLoading(false);
      return;
    }

    loadResumeState(user).then((data) => {
      console.log("📦 Resume loaded RAW:", data);
      setResumeData(data || null);
      setLoading(false);
      setDismissed(false); // reset on reload
    });
  }, [user]);

  // ⛔ While loading → not paused
  if (loading) {
    return {
      banner: null,
      isPaused: false,
    };
  }

  const canResume =
    resumeData &&
    typeof resumeData.index === "number" &&
    resumeData.category === category &&
    resumeData.difficulty === difficulty;

  // ⛔ No resume OR dismissed → not paused
  if (!canResume || dismissed) {
    return {
      banner: null,
      isPaused: false,
    };
  }

  // ✅ Resume exists → quiz is paused
  return {
    isPaused: true,
    banner: (
      <ResumeBanner
        index={resumeData.index}
        onResume={() => {
          setIndex(resumeData.index);
          setDismissed(true); // hide banner after resume
        }}
        onRestart={async () => {
          await clearResumeState(user);
          setResumeData(null);
          setDismissed(true); // hide banner after restart
        }}
      />
    ),
  };
}