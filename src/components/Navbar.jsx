// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Button, Avatar } from "./ui";
import AchievementsBadge from "./AchievementsBadge";
import StreakDisplay from "./StreakDisplay/StreakDisplay";

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
    <nav className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Admin Link for Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/admin/dashboard" className="text-gray-700 hover:text-gray-900 font-medium transition text-sm">
            Admin Panel
          </Link>
        </div>

        {/* Right Side - Coins & Auth */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Streak Display (Compact) */}
          {user && (
            <div style={{ marginRight: 4 }}>
              <StreakDisplay compact={true} />
            </div>
          )}

          {/* Coins Display */}
          {coins !== null && (
            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 text-sm">
              <span>🪙</span>
              <span className="font-bold text-amber-900">{coins}</span>
            </div>
          )}

          {/* Achievements Badge */}
          {user && (
            <AchievementsBadge userId={user.uid} />
          )}

          {/* Auth Buttons */}
          {user ? (
            <div className="flex items-center gap-2">
              <Avatar 
                name={user.displayName || user.email} 
                src={user.photoURL}
                size="sm"
              />
              <div className="hidden md:block text-sm">
                <p className="font-semibold text-gray-900">
                  {user.displayName || user.email?.split("@")[0]}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => signOut()}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => signInWithGoogle()}
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;