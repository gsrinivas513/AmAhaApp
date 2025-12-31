/**
 * CLEAN PROFESSIONAL NAVBAR
 * Minimal, dark theme, professional
 * No emoji icons, no feature tabs, no clutter
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useEffect } from "react";

function CleanNavBar() {
  const navigate = useNavigate();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [coins, setCoins] = useState(null);
  const [categoriesDropdown, setCategoriesDropdown] = useState(false);

  // Fetch user coins
  useEffect(() => {
    if (!user?.uid) {
      setCoins(null);
      return;
    }

    const unsub = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCoins(typeof data?.stats?.coins === "number" ? data.stats.coins : 0);
      } else {
        setCoins(0);
      }
    });

    return () => unsub();
  }, [user]);

  return (
    <nav
      style={{
        background: "#0f172a",
        borderBottom: "1px solid #2d2d44",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: "64px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        {/* Logo - Just Text */}
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#ffffff",
            fontSize: "1.25rem",
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}
        >
          AmAha
        </Link>

        {/* Center Navigation - HIDDEN for minimal PuzzleFree style */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            alignItems: "center",
            marginLeft: "60px",
          }}
          className="hidden"
        >
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              color: "#b0b0c8",
              fontSize: "0.95rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
            onMouseLeave={(e) => (e.target.style.color = "#b0b0c8")}
          >
            Browse
          </button>

          <div style={{ position: "relative" }}>
            <button
              onClick={() => setCategoriesDropdown(!categoriesDropdown)}
              style={{
                background: "none",
                border: "none",
                color: "#b0b0c8",
                fontSize: "0.95rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "color 150ms ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.target.style.color = "#b0b0c8")}
            >
              Categories
              <span style={{ fontSize: "0.75rem" }}>▼</span>
            </button>

            {categoriesDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "#252539",
                  border: "1px solid #2d2d44",
                  borderRadius: "8px",
                  marginTop: "8px",
                  minWidth: "200px",
                  padding: "8px 0",
                  zIndex: 100,
                }}
                onMouseLeave={() => setCategoriesDropdown(false)}
              >
                {[
                  { label: "Quizzes", href: "#" },
                  { label: "Puzzles", href: "#" },
                  { label: "Games", href: "#" },
                  { label: "Stories", href: "#" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigate(item.href);
                      setCategoriesDropdown(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "10px 16px",
                      background: "none",
                      border: "none",
                      color: "#b0b0c8",
                      textAlign: "left",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      transition: "all 150ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#2d2d44";
                      e.target.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "none";
                      e.target.style.color = "#b0b0c8";
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - User Info & Auth - MINIMAL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginLeft: "auto",
          }}
        >
          {/* Auth Buttons Only */}
          {user ? (
            <button
              onClick={() => signOut()}
              style={{
                padding: "8px 16px",
                background: "transparent",
                color: "#6366f1",
                border: "1px solid #6366f1",
                borderRadius: "4px",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#6366f1";
                e.target.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#6366f1";
              }}
            >
              Sign out
            </button>
          ) : (
            <>
              <button
                onClick={() => signInWithGoogle()}
                style={{
                  padding: "0",
                  background: "none",
                  color: "#b0b0c8",
                  border: "none",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.target.style.color = "#b0b0c8")}
              >
                Sign in
              </button>
              <button
                onClick={() => signInWithGoogle()}
                style={{
                  padding: "8px 16px",
                  background: "#6366f1",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 150ms ease",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#4f46e5")}
                onMouseLeave={(e) => (e.target.style.background = "#6366f1")}
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "#b0b0c8",
            fontSize: "1.5rem",
            cursor: "pointer",
            marginLeft: "16px",
          }}
          className="md:hidden"
        >
          ☰
        </button>
      </div>
    </nav>
  );
}

export default CleanNavBar;
