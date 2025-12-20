// src/puzzles/hooks/usePuzzleConfig.js
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

/**
 * usePuzzleConfig (read-only v1)
 *
 * Reads global puzzle configuration from:
 *   puzzleConfig / global
 *
 * No writes
 * No side effects
 */
export function usePuzzleConfig() {
  const [config, setConfig] = useState({
    enabled: false,
    dailyPuzzleEnabled: false,
    maxAttemptsPerDay: 0,
    showHints: false,
    rewardXp: 0,
    rewardCoins: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadConfig() {
      try {
        const ref = doc(db, "puzzleConfig", "global");
        const snap = await getDoc(ref);

        if (!active) return;

        if (snap.exists()) {
          setConfig({
            ...config,
            ...snap.data(), // Firestore overrides defaults
          });
        }
      } catch (err) {
        console.error("Failed to load puzzleConfig:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadConfig();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    config,
    loading,
  };
}