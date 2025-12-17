// src/quiz/hooks/useResumeQuiz.js
import { useEffect, useState } from "react";
import { loadResumeState, clearResumeState } from "../services/resumeService";

export function useResumeQuiz({ user, category, difficulty, setIndex }) {
  const [resumeData, setResumeData] = useState(null);
  const [applied, setApplied] = useState(false);

  // 1️⃣ Load resume data
  useEffect(() => {
    if (!user) {
      setResumeData(null);
      return;
    }

    loadResumeState(user).then((data) => {
      setResumeData(data);
      setApplied(false); // reset when data loads
    });
  }, [user]);

  // 2️⃣ Reset resume logic when quiz changes (FIX FOR YOUR BUG)
  useEffect(() => {
    setApplied(false);
  }, [category, difficulty]);

  // 3️⃣ Decide whether banner should show
  const shouldShowBanner =
    resumeData &&
    resumeData.category === category &&
    resumeData.difficulty === difficulty &&
    !applied;

  if (!shouldShowBanner) {
    return { banner: null };
  }

  return {
    banner: (
      <div
        style={{
          background: "#fff3cd",
          border: "1px solid #ffeeba",
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
          color: "#856404",
        }}
      >
        ⏸️ You have an unfinished quiz.
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              setIndex(resumeData.index);
              setApplied(true);
            }}
          >
            Resume
          </button>

          <button
            onClick={async () => {
              await clearResumeState(user);
              setResumeData(null);
              setApplied(true);
            }}
          >
            Start Over
          </button>
        </div>
      </div>
    ),
  };
}