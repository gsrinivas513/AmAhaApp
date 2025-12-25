/**
 * CategoriesPanel.jsx
 * Shows categories for a selected feature
 * Displays quiz categories, puzzle categories, or navigation categories
 * Categories appear in a grid layout with hover for topics
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryDropdown from "./CategoryDropdown";

function CategoriesPanel({ feature, categories, config }) {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  console.log("[CategoriesPanel] Rendering with:");
  console.log("  feature:", feature);
  console.log("  categories:", categories);
  console.log("  categories.length:", categories?.length);

  if (!feature || !categories || categories.length === 0) {
    console.log("[CategoriesPanel] Returning null - not showing panel");
    console.log("  feature exists:", !!feature);
    console.log("  categories exists:", !!categories);
    console.log("  categories.length > 0:", categories?.length > 0);
    return null;
  }

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
        borderBottom: "1px solid #f0f0f0",
        background: "#fafafa",
        padding: "16px",
        animation: `slideDown ${config?.animationDuration || 250}ms ease-out`,
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Feature Title */}
        <div style={{ marginBottom: "12px" }}>
          <h3
            style={{
              margin: "0 0 8px 0",
              fontSize: "16px",
              fontWeight: "600",
              color: "#0b1220",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {feature.icon && <span style={{ fontSize: "20px" }}>{feature.icon}</span>}
            {feature.name}
          </h3>
          {feature.description && (
            <p
              style={{
                margin: "0",
                fontSize: "13px",
                color: "#666",
                lineHeight: "1.4",
              }}
            >
              {feature.description}
            </p>
          )}
        </div>

        {/* Categories Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fill, minmax(180px, 1fr))`,
            gap: "12px",
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
                  padding: "12px 14px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  background: "white",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 150ms ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#0b1220",
                  boxShadow: hoveredCategory === (category.id || category.key) ? "0 2px 8px rgba(108, 99, 255, 0.15)" : "none",
                  borderColor: hoveredCategory === (category.id || category.key) ? "#6C63FF" : "#e0e0e0",
                  background: hoveredCategory === (category.id || category.key) ? "#f8f7ff" : "white",
                }}
              >
                {/* Icon - for quizzes/puzzles with color backgrounds */}
                {category.icon && (
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>
                    {category.icon}
                  </span>
                )}
                {/* Title - prioritize 'title' field (quiz categories) over 'name' */}
                <span style={{ flex: 1 }}>
                  {category.title || category.name}
                </span>
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
