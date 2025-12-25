// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Button, Avatar } from "./ui";
import AchievementsBadge from "./AchievementsBadge";

function Navbar() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();
  const [coins, setCoins] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo - Premium Distinctive Style */}
        <Link 
          to="/" 
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 12,
            transition: "transform 200ms ease",
          }}
          className="hover:scale-105"
        >
          {/* Premium Icon Badge */}
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "linear-gradient(135deg, #6C63FF 0%, #0284c7 50%, #06b6d4 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 900,
            fontSize: 24,
            boxShadow: "0 12px 32px rgba(108,99,255,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.3)",
            position: "relative",
          }}>
            ✨
          </div>
          
          {/* Logo Text - Premium Style */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{
              fontSize: 24,
              fontWeight: 900,
              background: "linear-gradient(135deg, #6C63FF 0%, #0284c7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: 0.5,
              lineHeight: 1,
            }}>
              AMAHA.com
            </div>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#6C63FF",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              lineHeight: 1,
            }}>
              Play. Learn. Master
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/admin/dashboard" className="text-gray-700 hover:text-gray-900 font-medium transition">
            Admin
          </Link>
        </div>

        {/* Right Side - Coins & Auth */}
        <div className="flex items-center gap-4">
          {/* Coins Display */}
          {coins !== null && (
            <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
              <span className="text-xl">🪙</span>
              <span className="font-bold text-amber-900">{coins}</span>
            </div>
          )}

          {/* Achievements Badge */}
          {user && (
            <AchievementsBadge userId={user.uid} />
          )}

          {/* Auth Buttons */}
          {user ? (
            <div className="flex items-center gap-3">
              <Avatar 
                name={user.displayName || user.email} 
                src={user.photoURL}
                size="md"
              />
              <div className="hidden md:block">
                <p className="font-semibold text-gray-900 text-sm">
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

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white p-4 space-y-3">
          <Link to="/admin/dashboard" className="block text-gray-700 hover:text-gray-900 font-medium">
            Admin
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;