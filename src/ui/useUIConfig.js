// src/ui/useUIConfig.js
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/* --------------------------------------------------
 * DEFAULT UI CONFIG (SAFE FALLBACK)
 * -------------------------------------------------- */
const DEFAULT_UI_CONFIG = {
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    baseFontSize: 16,
    headingWeight: 700,
  },

  cards: {
    borderRadius: 12,
    shadow: "soft", // soft | medium | strong
  },

  colorMode: "playful", // playful | neutral | minimal

  microAnimations: {
    enabled: true,
    optionHoverScale: 1.03,
    optionSelectScale: 1.05,
    correctPulse: true,
    wrongShake: true,
    buttonPressScale: 0.97,
    transitionMs: 200,
  },
};

export function useUIConfig() {
  const [config, setConfig] = useState(DEFAULT_UI_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadConfig() {
      try {
        const ref = doc(db, "ui_config", "quiz_ui");
        const snap = await getDoc(ref);

        if (!active) return;

        if (snap.exists()) {
          const data = snap.data();

          // 🛡️ Merge with defaults (never trust remote blindly)
          setConfig({
            ...DEFAULT_UI_CONFIG,
            ...data,
            microAnimations: {
              ...DEFAULT_UI_CONFIG.microAnimations,
              ...(data.microAnimations || {}),
            },
          });
        } else {
          // No config yet → defaults
          setConfig(DEFAULT_UI_CONFIG);
        }
      } catch (err) {
        console.error("UI config load failed, using defaults", err);
        setConfig(DEFAULT_UI_CONFIG);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadConfig();

    return () => {
      active = false;
    };
  }, []);

  return {
    uiConfig: config,
    microAnimations: config.microAnimations,
    loading,
  };
}