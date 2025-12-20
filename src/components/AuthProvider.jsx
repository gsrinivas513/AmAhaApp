// src/components/AuthProvider.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

// ✅ Guest → User progress merge
import { mergeGuestProgressToUser } from "../quiz/services/progressService";
import { useToast } from "./Toast"; // ✅ existing toast system

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();
  const mergeOnceRef = useRef(false); // ✅ prevents duplicate merge

  useEffect(() => {
    let isMounted = true;

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;

      setUser(firebaseUser || null);
      setLoading(false);

      // ✅ Merge guest progress ONLY ONCE after login
      if (firebaseUser && !mergeOnceRef.current) {
        mergeOnceRef.current = true;

        try {
          const merged = await mergeGuestProgressToUser(firebaseUser);

          if (merged) {
            showToast(
              "🎉 Your progress has been saved to your account!",
              "success"
            );
          }
        } catch (err) {
          console.error("Guest progress merge failed:", err);
        }
      }
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, [showToast]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ✅ SINGLE useAuth HOOK */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}