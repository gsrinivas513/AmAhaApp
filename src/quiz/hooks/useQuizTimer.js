// src/quiz/hooks/useQuizTimer.js
import { useEffect, useRef, useState } from "react";
import { QUESTION_TIME_SECONDS, TICK_MS } from "../constants";

export function useQuizTimer(active, resetKey) {
  const totalMs = QUESTION_TIME_SECONDS * 1000;
  const [timeMs, setTimeMs] = useState(totalMs);
  const timerRef = useRef(null);

  // 🔹 Start / stop timer based on `active`
  useEffect(() => {
    if (!active) {
      clearInterval(timerRef.current);
      return;
    }

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeMs((t) => Math.max(0, t - TICK_MS));
    }, TICK_MS);

    return () => clearInterval(timerRef.current);
  }, [active]);

  // 🔹 RESET TIMER when question changes
  useEffect(() => {
    setTimeMs(totalMs);
  }, [resetKey, totalMs]);

  return {
    timeMs,
    totalMs,
    warn: timeMs <= 5000,
  };
}