/**
 * TopNavBar.jsx
 * Main navigation bar with feature tabs (all visible) and category panel below
 * Features shown as tabs - click to show categories
 * Hover category to show topics in dropdown
 * Frozen/sticky on scroll
 * Integrated auth, coins, and achievements
 */

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNavigationData } from "../../hooks/useNavigationData";
import { useAuth } from "../AuthProvider";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import AmAhaLogo from "../AmAhaLogo";
import CategoriesPanel from "./CategoriesPanel";
import MobileMenu from "./MobileMenu";
import { Button, Avatar } from "../ui";
import AchievementsBadge from "../AchievementsBadge";
import StreakDisplay from "../StreakDisplay/StreakDisplay";

function TopNavBar() {
  const navigate = useNavigate();
  const { features, categoriesByFeature, config, loading, error, loadFeatureCategories } =
    useNavigationData();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [coins, setCoins] = useState(null);

  // State management
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuTimeoutRef = useRef(null);

  // Fetch user coins
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
        console.error("TopNavBar onSnapshot error:", err);
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

  // Handle feature click to show categories or navigate to feature page
  const handleFeatureClick = async (feature) => {
    // If feature has a direct route (like /quiz or /puzzles), navigate there
    if (feature.route) {
      navigate(feature.route);
      return;
    }

    // Otherwise, show categories panel (for features with categories)
    // If clicking same feature, toggle it
    if (selectedFeature?.id === feature.id) {
      setSelectedFeature(null);
    } else {
      setSelectedFeature(feature);
      // Load categories if not already loaded
      await loadFeatureCategories(feature.id);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <nav
        style={{
          background: "white",
          borderBottom: "1px solid #e0e0e0",
          padding: "12px 16px",
          position: "sticky",
          top: 0,
          zIndex: 30,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "56px",
          }}
        >
          <span style={{ color: "#999", fontSize: "14px" }}>Loading menu...</span>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        style={{
          background: "white",
          borderBottom: "2px solid #f0f0f0",
          position: "sticky",
          top: 0,
          zIndex: 30,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              marginRight: "32px",
            }}
          >
            <AmAhaLogo size="header" />
          </Link>

          {/* Desktop Feature Tabs - Hidden on mobile */}
          <div
            style={{
              display: "none",
              "@media (min-width: 768px)": {
                display: "flex",
              },
              gap: "4px",
              alignItems: "center",
              flex: 1,
              position: "relative",
              flexWrap: "wrap",
            }}
            className="hidden md:flex"
          >
            {loading ? (
              <span style={{ color: "#999", fontSize: "14px" }}>Loading features...</span>
            ) : error ? (
              <span style={{ color: "#d32f2f", fontSize: "14px" }}>Error loading features: {error}</span>
            ) : features.length === 0 ? (
              <span style={{ color: "#999", fontSize: "14px" }}>No features available</span>
            ) : (
              features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureClick(feature)}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    background:
                      selectedFeature?.id === feature.id
                        ? "#6C63FF"
                        : "transparent",
                    color:
                      selectedFeature?.id === feature.id
                        ? "white"
                        : "#0b1220",
                    cursor: "pointer",
                    borderRadius: "4px 4px 0 0",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 150ms ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedFeature?.id !== feature.id) {
                      e.target.style.background = "#f0f0f0";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedFeature?.id !== feature.id) {
                      e.target.style.background = "transparent";
                    }
                  }}
                >
                  {feature.icon && <span style={{ fontSize: "16px" }}>{feature.icon}</span>}
                  {feature.name}
                </button>
              ))
            )}

            {/* Admin Link */}
            <Link
              to="/admin/dashboard"
              style={{
                marginLeft: "auto",
                padding: "8px 16px",
                textDecoration: "none",
                color: "#0b1220",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 150ms ease",
                cursor: "pointer",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f0f0f0";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
              }}
            >
              ⚙️ Admin
            </Link>
          </div>

          {/* Right Side - User Info & Auth (Desktop) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginLeft: "auto",
            }}
            className="hidden md:flex"
          >
            {/* Streak Display */}
            {user && (
              <div style={{ marginRight: "4px" }}>
                <StreakDisplay compact={true} />
              </div>
            )}

            {/* Coins Display */}
            {coins !== null && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#fef3c7",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #fcd34d",
                  fontSize: "13px",
                }}
              >
                <span>🪙</span>
                <span style={{ fontWeight: "bold", color: "#92400e" }}>{coins}</span>
              </div>
            )}

            {/* Achievements Badge */}
            {user && <AchievementsBadge userId={user.uid} />}

            {/* Auth Section */}
            {user ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Avatar 
                  name={user.displayName || user.email} 
                  src={user.photoURL}
                  size="sm"
                />
                <div style={{ fontSize: "13px" }}>
                  <p style={{ margin: "0", fontWeight: "600", color: "#0b1220" }}>
                    {user.displayName || user.email?.split("@")[0]}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => signOut()}
                  style={{ fontSize: "12px" }}
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => signInWithGoogle()}
                style={{ fontSize: "12px" }}
              >
                👤 Sign in
              </Button>
            )}
          </div>

          {/* Mobile Hamburger Menu - Visible on mobile */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginLeft: "auto",
            }}
            className="md:hidden"
          >
            {/* Mobile User Avatar */}
            {user && (
              <Avatar 
                name={user.displayName || user.email} 
                src={user.photoURL}
                size="sm"
              />
            )}

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
              }}
            >
              <span
                style={{
                  width: "24px",
                  height: "3px",
                  background: "#0b1220",
                  borderRadius: "2px",
                  transition: "all 250ms ease",
                }}
              />
              <span
                style={{
                  width: "24px",
                  height: "3px",
                  background: "#0b1220",
                  borderRadius: "2px",
                  transition: "all 250ms ease",
                }}
              />
              <span
                style={{
                  width: "24px",
                  height: "3px",
                  background: "#0b1220",
                  borderRadius: "2px",
                  transition: "all 250ms ease",
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu display fix via CSS */}
        <style>{`
          @media (min-width: 768px) {
            .md\\:flex {
              display: flex !important;
            }
            .md\\:hidden {
              display: none !important;
            }
          }
        `}</style>
      </nav>

      {/* Categories Panel - Shows below feature tabs */}
      {selectedFeature && !mobileMenuOpen && (
        <CategoriesPanel
          feature={selectedFeature}
          categories={categoriesByFeature[selectedFeature.id] || []}
          config={config}
        />
      )}

      {/* Mobile Menu Drawer */}
      <MobileMenu
        features={features}
        categoriesByFeature={categoriesByFeature}
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        config={config}
        loadFeatureCategories={loadFeatureCategories}
      />
    </>
  );
}

export default TopNavBar;
