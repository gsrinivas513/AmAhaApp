// src/quiz/hooks/useResumeQuiz.js
import { useEffect, useState } from "react";
import { loadResumeState, clearResumeState } from "../services/resumeService";

export function useResumeQuiz({ user, category, difficulty, setIndex }) {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadResumeState(user).then((data) => {
      console.log("📦 Resume loaded:", data);
      setResumeData(data);
      setLoading(false);
    });
  }, [user]);

  if (loading) return { banner: null };

const canResume =
  resumeData &&
  resumeData.hasProgress === true &&
  resumeData.category === category &&
  resumeData.difficulty === difficulty;

if (!canResume) {
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
    setResumeData(null); // ✅ hide banner immediately
  }}
>
  Resume
</button>

<button
  onClick={async () => {
    await clearResumeState(user);
    setResumeData(null); // ✅ hide banner immediately
  }}
>
  Start Over
</button>

        </div>
      </div>
    ),
  };
}