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
import { doc, onSnapshot, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import AmAhaLogo from "../AmAhaLogo";
import CategoriesPanel from "./CategoriesPanel";
import MobileMenu from "./MobileMenu";
import { Button, Avatar } from "../ui";
import AchievementsBadge from "../AchievementsBadge";
import StreakDisplay from "../StreakDisplay/StreakDisplay";
import ThemeSwitcher from "../ThemeSwitcher";
import { FEATURES, getFeatureById } from "../../constants/FEATURES";
import { useTheme } from "../../context/ThemeContext";

function TopNavBar() {
  const navigate = useNavigate();
  const { features, categoriesByFeature, config, loading, error, loadFeatureCategories } =
    useNavigationData();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [coins, setCoins] = useState(null);

  // State management
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredFeatureCategories, setHoveredFeatureCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const menuTimeoutRef = useRef(null);
  const loadingTimeoutRef = useRef(null);

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

  // Handle feature hover to show categories
  const handleFeatureHover = async (feature) => {
    if (!feature) {
      setHoveredFeature(null);
      setHoveredFeatureCategories([]);
      setCategoriesLoading(false);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      return;
    }

    setHoveredFeature(feature);
    setCategoriesLoading(true);
    console.log(`[TopNavBar] Hovering over ${feature.label || feature.name}, loading categories...`);
    
    try {
      const cats = await loadFeatureCategories(feature.id, feature);
      console.log(`[TopNavBar] Loaded ${cats.length} categories for ${feature.label || feature.name}`);
      setHoveredFeatureCategories(cats);
    } catch (err) {
      console.error(`[TopNavBar] Error loading categories for ${feature.id}:`, err);
      setHoveredFeatureCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [profileMenuOpen]);

  if (loading) {
    return (
      <nav
        style={{
          background: "#1a1a2e",
          borderBottom: "1px solid #2d2d44",
          padding: "12px 16px",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
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
          <span style={{ color: "#b0b0c8", fontSize: "14px" }}>Loading menu...</span>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Desktop Navigation - PuzzleFree.game Style */}
      <nav
        style={{
          background: "#1a1a2e",
          borderBottom: "1px solid #2d2d44",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
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
              <span style={{ color: "#b0b0c8", fontSize: "14px" }}>Loading features...</span>
            ) : error ? (
              <span style={{ color: "#ff6b6b", fontSize: "14px" }}>Error loading features: {error}</span>
            ) : features.length === 0 ? (
              <span style={{ color: "#b0b0c8", fontSize: "14px" }}>No features available</span>
            ) : (
              features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => {
                    // Navigate directly to feature base route
                    const featureConfig = getFeatureById(feature.id);
                    if (featureConfig?.baseRoute) {
                      navigate(featureConfig.baseRoute);
                    }
                    handleFeatureHover(null);
                  }}
                  onMouseEnter={() => {
                    if (menuTimeoutRef.current) {
                      clearTimeout(menuTimeoutRef.current);
                    }
                    // Load categories for this feature
                    handleFeatureHover(feature);
                  }}
                  onMouseLeave={() => {
                    menuTimeoutRef.current = setTimeout(() => {
                      handleFeatureHover(null);
                    }, 200);
                  }}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    background:
                      hoveredFeature?.id === feature.id
                        ? "#6366f1"
                        : "transparent",
                    color:
                      hoveredFeature?.id === feature.id
                        ? "white"
                        : "#b0b0c8",
                    cursor: "pointer",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 150ms ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    whiteSpace: "nowrap",
                  }}
                  title={`${feature.icon} ${feature.displayName || feature.name || feature.label} - ${feature.description || ""}`}
                >
                  {feature.icon && <span style={{ fontSize: "16px" }}>{feature.icon}</span>}
                  {feature.displayName || feature.name || feature.label}
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
                color: "#b0b0c8",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 150ms ease",
                cursor: "pointer",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#2d2d44";
                e.target.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#b0b0c8";
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
                  background: "#2d2d44",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #3d3d54",
                  fontSize: "13px",
                  color: "#b0b0c8"
                }}
              >
                <span>🪙</span>
                <span style={{ fontWeight: "bold", color: "#ffffff" }}>{coins}</span>
              </div>
            )}

            {/* Achievements Badge */}
            {user && <AchievementsBadge userId={user.uid} />}

            {/* Dark/Light Mode Toggle */}
            <ThemeSwitcher />

            {/* Auth Section */}
            {user ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  position: "relative"
                }}
                ref={profileMenuRef}
              >
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 12px",
                    background: profileMenuOpen ? "#6366f1" : "transparent",
                    border: "1px solid #3d3d54",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 150ms ease",
                    color: "#b0b0c8"
                  }}
                  onMouseEnter={(e) => {
                    if (!profileMenuOpen) {
                      e.currentTarget.style.background = "#2d2d44";
                      e.currentTarget.style.color = "#ffffff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!profileMenuOpen) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#b0b0c8";
                    }
                  }}
                >
                  <Avatar 
                    name={user.displayName || user.email} 
                    src={user.photoURL}
                    size="sm"
                  />
                  <span style={{ fontSize: "13px", fontWeight: "600" }}>
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                  <span style={{ fontSize: "12px" }}>▼</span>
                </button>

                {/* Profile Dropdown Menu */}
                {profileMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      marginTop: "8px",
                      background: "#2d2d44",
                      border: "1px solid #3d3d54",
                      borderRadius: "8px",
                      minWidth: "200px",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
                      zIndex: 1000,
                      overflow: "hidden"
                    }}
                  >
                    {/* Profile Header */}
                    <div style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #3d3d54",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px"
                    }}>
                      <Avatar 
                        name={user.displayName || user.email} 
                        src={user.photoURL}
                        size="sm"
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: "0", fontWeight: "600", color: "#ffffff", fontSize: "13px" }}>
                          {user.displayName || "User"}
                        </p>
                        <p style={{ margin: "0", color: "#888", fontSize: "12px" }}>
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div style={{ padding: "8px 0" }}>
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setProfileMenuOpen(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "10px 16px",
                          background: "transparent",
                          border: "none",
                          textAlign: "left",
                          color: "#b0b0c8",
                          cursor: "pointer",
                          fontSize: "13px",
                          transition: "all 150ms ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#3d3d54";
                          e.currentTarget.style.color = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#b0b0c8";
                        }}
                      >
                        👤 Profile
                      </button>

                      <button
                        onClick={() => {
                          navigate("/settings");
                          setProfileMenuOpen(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "10px 16px",
                          background: "transparent",
                          border: "none",
                          textAlign: "left",
                          color: "#b0b0c8",
                          cursor: "pointer",
                          fontSize: "13px",
                          transition: "all 150ms ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#3d3d54";
                          e.currentTarget.style.color = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#b0b0c8";
                        }}
                      >
                        ⚙️ Settings
                      </button>

                      <div style={{ margin: "8px 0", borderBottom: "1px solid #3d3d54" }} />

                      <button
                        onClick={() => {
                          signOut();
                          setProfileMenuOpen(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "10px 16px",
                          background: "transparent",
                          border: "none",
                          textAlign: "left",
                          color: "#ff6b6b",
                          cursor: "pointer",
                          fontSize: "13px",
                          transition: "all 150ms ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#3d3d54";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => signInWithGoogle()}
                  style={{
                    padding: "8px 18px",
                    background: "#6366f1",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 150ms ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#4f46e5";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#6366f1";
                  }}
                >
                  👤 Sign in
                </button>
              </div>
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
                  background: "#b0b0c8",
                  borderRadius: "2px",
                  transition: "all 250ms ease",
                }}
              />
              <span
                style={{
                  width: "24px",
                  height: "3px",
                  background: "#b0b0c8",
                  borderRadius: "2px",
                  transition: "all 250ms ease",
                }}
              />
              <span
                style={{
                  width: "24px",
                  height: "3px",
                  background: "#b0b0c8",
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

      {/* Categories Panel - Shows on hover, positioned fixed over content */}
      {hoveredFeature && !mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            zIndex: 49,
            background: "transparent",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "0 16px",
              pointerEvents: "auto",
            }}
            onMouseLeave={() => {
              menuTimeoutRef.current = setTimeout(() => {
                handleFeatureHover(null);
              }, 100);
            }}
            onMouseEnter={() => {
              if (menuTimeoutRef.current) {
                clearTimeout(menuTimeoutRef.current);
              }
            }}
          >
            <CategoriesPanel
              feature={hoveredFeature}
              categories={hoveredFeatureCategories}
              config={config}
              isLoading={categoriesLoading}
              isAbsolute={false}
              onClose={() => {
                setHoveredFeature(null);
                setHoveredFeatureCategories([]);
              }}
            />
          </div>
        </div>
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
