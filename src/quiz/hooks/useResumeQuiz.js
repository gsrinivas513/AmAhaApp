// src/quiz/hooks/useResumeQuiz.js
import { useEffect, useState } from "react";
import { loadResumeState, clearResumeState } from "../services/resumeService";
import ResumeBanner from "../components/ResumeBanner";

export function useResumeQuiz({ user, category, difficulty, setIndex }) {
  const [resumeData, setResumeData] = useState(null);

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

  if (!canResume) {
    return { banner: null };
  }

  return {
    banner: (
      <ResumeBanner
        index={resumeData.index}
onResume={() => {
  // wait for questions to exist
  setIndex((prev) => resumeData.index);
}}        onRestart={async () => {
          await clearResumeState(user);
          setResumeData(null);
        }}
      />
    ),
  };
}