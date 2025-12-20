// src/quiz/hooks/useSoundFX.js
import { useRef } from "react";

export function useSoundFX(enabled = true) {
  const correctRef = useRef(null);
  const wrongRef = useRef(null);
  const successRef = useRef(null);

  function play(ref) {
    if (!enabled || !ref.current) return;
    ref.current.currentTime = 0;
    ref.current.play().catch(() => {});
  }

  return {
    bind: {
      correct: (el) => (correctRef.current = el),
      wrong: (el) => (wrongRef.current = el),
      success: (el) => (successRef.current = el),
    },
    playCorrect: () => play(correctRef),
    playWrong: () => play(wrongRef),
    playSuccess: () => play(successRef),
  };
}