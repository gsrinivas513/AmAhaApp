/**
 * CategoriesPanel.jsx
 * Shows categories for a selected feature
 * Displays quiz categories, puzzle categories, or navigation categories
 * Categories appear in a grid layout with hover for topics
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryDropdown from "./CategoryDropdown";

function CategoriesPanel({ feature, categories, config, isAbsolute = false }) {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  if (!feature || !categories || categories.length === 0) {
    return null;
  }

  // Determine feature-specific styling
  const featureStyles = {
    quizzes: {
      headerColor: "#6C63FF",
      cardBg: "linear-gradient(135deg, #f8f7ff 0%, #fafafa 100%)",
      cardBorder: "#d9d4ff",
      hoverBg: "#ffffff",
      buttonColor: "#6C63FF",
    },
    "UpNde0cmlHFDQXgTcQOJ": {
      headerColor: "#6C63FF",
      cardBg: "linear-gradient(135deg, #f8f7ff 0%, #fafafa 100%)",
      cardBorder: "#d9d4ff",
      hoverBg: "#ffffff",
      buttonColor: "#6C63FF",
    },
    puzzles: {
      headerColor: "#10b981",
      cardBg: "linear-gradient(135deg, #f0fdf4 0%, #fafafa 100%)",
      cardBorder: "#bbf7d0",
      hoverBg: "#ffffff",
      buttonColor: "#10b981",
    },
    Puzzles: {
      headerColor: "#10b981",
      cardBg: "linear-gradient(135deg, #f0fdf4 0%, #fafafa 100%)",
      cardBorder: "#bbf7d0",
      hoverBg: "#ffffff",
      buttonColor: "#10b981",
    },
  };

  const styles = featureStyles[feature.id] || featureStyles.quizzes;

  // Handle category click based on feature type
  const handleCategoryClick = (category) => {
    if (feature.id === "quizzes") {
      // Navigate to quiz category
      navigate(`/quiz/${category.key || category.id}`, {
        state: { categoryName: category.title || category.name },
      });
    } else if (feature.id === "puzzles") {
      // Navigate to puzzle category
      navigate(`/puzzles/${category.key || category.id}`, {
        state: { categoryName: category.title || category.name },
      });
    } else {
      // Default navigation category
      navigate(`/category/${category.id}`, {
        state: { categoryName: category.name },
      });
    }
  };

  return (
    <div
      style={{
        position: isAbsolute ? "absolute" : "relative",
        top: isAbsolute ? "100%" : "auto",
        left: 0,
        right: 0,
        width: "100%",
        borderBottom: "1px solid #f0f0f0",
        background: styles.cardBg,
        padding: "24px 16px",
        animation: `slideDown ${config?.animationDuration || 250}ms ease-out`,
        zIndex: 40,
        boxShadow: isAbsolute ? "0 8px 24px rgba(0, 0, 0, 0.12)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Feature Header */}
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              margin: "0 0 8px 0",
              fontSize: "18px",
              fontWeight: "700",
              color: styles.headerColor,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {feature.icon && <span style={{ fontSize: "24px" }}>{feature.icon}</span>}
            {feature.name?.toUpperCase()}
          </h2>
          {feature.description && (
            <p
              style={{
                margin: "0",
                fontSize: "14px",
                color: "#666",
                lineHeight: "1.5",
                fontWeight: "500",
              }}
            >
              {feature.description}
            </p>
          )}
        </div>

        {/* Categories Grid - Consistent Card Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`,
            gap: "16px",
            maxWidth: "1200px",
          }}
        >
          {categories.map((category) => (
            <div
              key={category.id || category.key}
              style={{
                position: "relative",
              }}
              onMouseEnter={() => setHoveredCategory(category.id || category.key)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Category Card */}
              <button
                onClick={() => handleCategoryClick(category)}
                style={{
                  width: "100%",
                  height: "220px",
                  padding: "16px",
                  border: `2px solid ${styles.cardBorder}`,
                  borderRadius: "10px",
                  background: hoveredCategory === (category.id || category.key) ? styles.hoverBg : "#ffffff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 200ms ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "14px",
                  color: "#0b1220",
                  boxShadow: hoveredCategory === (category.id || category.key) 
                    ? `0 8px 16px ${styles.headerColor}33`
                    : "0 2px 4px rgba(0, 0, 0, 0.05)",
                  borderColor: hoveredCategory === (category.id || category.key) ? styles.headerColor : styles.cardBorder,
                  transform: hoveredCategory === (category.id || category.key) ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                {/* Icon and Title */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {category.icon && (
                    <span style={{ fontSize: "24px", flexShrink: 0 }}>
                      {category.icon}
                    </span>
                  )}
                  <span style={{ fontWeight: "600", fontSize: "15px", flex: 1 }}>
                    {category.title || category.label || category.name}
                  </span>
                </div>

                {/* Description if available */}
                {category.description && (
                  <p
                    style={{
                      margin: "0",
                      fontSize: "12px",
                      color: "#999",
                      lineHeight: "1.4",
                    }}
                  >
                    {category.description}
                  </p>
                )}

                {/* Explore button/link */}
                <div
                  style={{
                    marginTop: "auto",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: styles.buttonColor,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  Explore <span>→</span>
                </div>
              </button>

              {/* Topics Dropdown - only for navigation categories */}
              {config?.showTopics && !["quizzes", "puzzles"].includes(feature.id) && (
                <CategoryDropdown
                  category={category}
                  isOpen={hoveredCategory === category.id}
                  onClose={() => setHoveredCategory(null)}
                  config={config}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPanel;
