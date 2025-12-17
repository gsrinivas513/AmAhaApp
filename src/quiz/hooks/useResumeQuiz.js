import { useEffect, useState } from "react";
import { loadResumeState, clearResumeState } from "../services/resumeService";

export function useResumeQuiz({ user, category, difficulty, setIndex }) {
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    if (!user) return;
    loadResumeState(user).then(setResumeData);
  }, [user]);

  if (!resumeData ||
      resumeData.category !== category ||
      resumeData.difficulty !== difficulty) {
    return { banner: null };
  }

  return {
    banner: (
      <div style={{
        background: "#fff3cd",
        border: "1px solid #ffeeba",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        color: "#856404"
      }}>
        ⏸️ You have an unfinished quiz.
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button onClick={() => {
            setIndex(resumeData.index);
            setResumeData(null);
          }}>Resume</button>

          <button onClick={async () => {
            await clearResumeState(user);
            setResumeData(null);
          }}>Start Over</button>
        </div>
      </div>
    )
  };
}