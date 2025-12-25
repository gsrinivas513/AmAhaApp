/**
 * TopNavBar.jsx
 * Main navigation bar with feature tabs (all visible) and category panel below
 * Features shown as tabs - click to show categories
 * Hover category to show topics in dropdown
 * Frozen/sticky on scroll
 */

import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNavigationData } from "../../hooks/useNavigationData";
import AmAhaLogo from "../AmAhaLogo";
import CategoriesPanel from "./CategoriesPanel";
import MobileMenu from "./MobileMenu";

function TopNavBar() {
  const navigate = useNavigate();
  const { features, categoriesByFeature, config, loading, loadFeatureCategories } =
    useNavigationData();

  // State management
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuTimeoutRef = useRef(null);

  // Handle feature click to show categories
  const handleFeatureClick = async (feature) => {
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
          sticky: "top",
          zIndex: 30,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
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
          </div>

          {/* Mobile Hamburger Menu - Visible on mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              "@media (min-width: 768px)": {
                display: "none",
              },
              flexDirection: "column",
              gap: "5px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
            }}
            className="md:hidden"
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
