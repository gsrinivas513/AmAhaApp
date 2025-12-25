/**
 * CategoriesPanel.jsx
 * Shows categories for a selected feature
 * Categories appear in a horizontal or grid layout with hover for topics
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryDropdown from "./CategoryDropdown";

function CategoriesPanel({ feature, categories, config }) {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  if (!feature || !categories || categories.length === 0) {
    return null;
  }

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.id}`, {
      state: { categoryName: category.name },
    });
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
              key={category.id}
              style={{
                position: "relative",
              }}
              onMouseEnter={() => setHoveredCategory(category.id)}
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
                  boxShadow: hoveredCategory === category.id ? "0 2px 8px rgba(108, 99, 255, 0.15)" : "none",
                  borderColor: hoveredCategory === category.id ? "#6C63FF" : "#e0e0e0",
                  background: hoveredCategory === category.id ? "#f8f7ff" : "white",
                }}
              >
                {category.icon && (
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>
                    {category.icon}
                  </span>
                )}
                <span style={{ flex: 1 }}>{category.name}</span>
              </button>

              {/* Topics Dropdown */}
              {config?.showTopics && (
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
