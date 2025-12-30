import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { THEME_MODES } from "./themeModes";
import THEME_COLORS from "../config/themeColors";
import { useParams } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

const ThemeContext = createContext({
  mode: "playful",
  theme: THEME_MODES.playful,
  themeColor: "green",
  isDarkMode: false,
  currentTheme: THEME_COLORS.green.light,
  setMode: () => {},
  setThemeColor: () => {},
  toggleDarkMode: () => {},
});

export function ThemeProvider({ children }) {
  const { category } = useParams() || {};
  const { user } = useAuth();
  const [mode, setMode] = useState("playful");
  const [themeColor, setThemeColor] = useState("green");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preferences from localStorage
  useEffect(() => {
    const savedThemeColor = localStorage.getItem("appThemeColor") || "green";
    const savedDarkMode = localStorage.getItem("appDarkMode") === "true";
    setThemeColor(savedThemeColor);
    setIsDarkMode(savedDarkMode);
  }, []);

  // Save theme color to localStorage
  useEffect(() => {
    localStorage.setItem("appThemeColor", themeColor);
  }, [themeColor]);

  // Save dark mode to localStorage
  useEffect(() => {
    localStorage.setItem("appDarkMode", isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  useEffect(() => {
    let mounted = true;

    async function resolveTheme() {
      try {
        // 1️⃣ User preference
        if (user?.uid) {
          const userSnap = await getDoc(doc(db, "users", user.uid));
          if (userSnap.exists()) {
            const pref = userSnap.data()?.preferences?.uiMode;
            if (pref && pref !== "auto" && THEME_MODES[pref]) {
              if (mounted) return setMode(pref);
            }
          }
        }

        // 2️⃣ Category default
        if (category) {
          const catSnap = await getDoc(doc(db, "categories", category));
          if (catSnap.exists()) {
            const catMode = catSnap.data().defaultUiMode;
            if (catMode && THEME_MODES[catMode]) {
              if (mounted) return setMode(catMode);
            }
          }
        }

        // 3️⃣ Global default
        const globalSnap = await getDoc(doc(db, "settings", "ui"));
        if (globalSnap.exists()) {
          const globalMode = globalSnap.data().defaultMode;
          if (globalMode && THEME_MODES[globalMode]) {
            if (mounted) return setMode(globalMode);
          }
        }

        // 4️⃣ Fallback
        if (mounted) setMode("playful");
      } catch (e) {
        console.warn("Theme resolve failed:", e);
        if (mounted) setMode("playful");
      }
    }

    resolveTheme();
    return () => (mounted = false);
  }, [user, category]);

  const theme = THEME_MODES[mode] || THEME_MODES.playful;
  const currentTheme = THEME_COLORS[themeColor][isDarkMode ? "dark" : "light"];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSetThemeColor = (color) => {
    if (THEME_COLORS[color]) {
      setThemeColor(color);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        theme,
        themeColor,
        isDarkMode,
        currentTheme,
        setMode,
        setThemeColor: handleSetThemeColor,
        toggleDarkMode,
        availableColors: Object.keys(THEME_COLORS),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}