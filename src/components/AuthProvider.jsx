// src/components/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext({ user: null, signInWithGoogle: async ()=>{}, signOut: async ()=>{} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser({
          uid: u.uid,
          displayName: u.displayName,
          email: u.email,
          photoURL: u.photoURL,
        });
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will update user state
      return res;
    } catch (err) {
      console.error("Google sign-in failed:", err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // user state cleared by onAuthStateChanged
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}