// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function Navbar() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const [coins, setCoins] = useState(null);

  useEffect(() => {
    let unsub = null;
    if (!user || !user.uid) {
      setCoins(null);
      return;
    }

    const userRef = doc(db, "users", user.uid);

    // Real-time listener for user's stats nested under the user doc
    unsub = onSnapshot(
      userRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setCoins(0);
          return;
        }
        const data = snapshot.data() || {};
        const stats = data.stats || {};
        setCoins(typeof stats.coins === "number" ? stats.coins : 0);
      },
      (err) => {
        console.error("Navbar onSnapshot error:", err);
        // fallback: read once
        getDoc(userRef)
          .then((snap) => {
            if (!snap.exists()) return setCoins(0);
            const d = snap.data() || {};
            setCoins((d.stats && typeof d.stats.coins === "number") ? d.stats.coins : 0);
          })
          .catch(() => setCoins(0));
      }
    );

    return () => {
      if (unsub) unsub();
    };
  }, [user]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 18px",
        zIndex: 2000,
        background: "#fff",
        boxShadow: "0 2px 8px rgba(10,10,30,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Link to="/" style={{ fontWeight: 800, fontSize: 18, textDecoration: "none", color: "#333" }}>
          AmAhaApp
        </Link>
        <Link to="/" style={{ textDecoration: "none", color: "#444" }}>
          Home
        </Link>
        <Link to="/admin/dashboard" style={{ textDecoration: "none", color: "#444" }}>
          Admin
        </Link>
        <Link to="/settings">Settings</Link>

        <Link to="/profile" style={{ textDecoration: "none", color: "#444" }}>
  Profile
</Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* coins display */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 8, background: "#f6f7fb", border: "1px solid #eee" }}>
          <span style={{ fontSize: 18 }}>🪙</span>
          <div style={{ fontWeight: 700 }}>{coins === null ? "—" : coins}</div>
        </div>

        {user ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src={
                  user.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || "P")}&background=6C63FF&color=fff`
                }
                alt="avatar"
                style={{ width: 36, height: 36, borderRadius: "50%" }}
              />
              <div style={{ fontWeight: 700 }}>{user.displayName || user.email}</div>
            </div>
            <button onClick={() => signOut()} style={{ padding: "8px 10px", borderRadius: 8, cursor: "pointer" }}>
              Sign out
            </button>
          </>
        ) : (
          <button onClick={() => signInWithGoogle()} style={{ padding: "8px 10px", borderRadius: 8, cursor: "pointer" }}>
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;