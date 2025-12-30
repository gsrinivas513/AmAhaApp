/**
 * FeatureMenuItem.jsx
 * Individual feature menu item with hover handling
 */

import React, { useState } from "react";

function FeatureMenuItem({
  feature,
  categories,
  isActive,
  onHover,
  onHoverEnd,
  onLoadCategories,
  onClick,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = async () => {
    setIsHovered(true);
    // Load categories on hover for better UX
    await onLoadCategories(feature.id);
    onHover(feature.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverEnd();
  };

  return (
    <button
      onClick={() => onClick(feature)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: "8px 16px",
        background: isActive ? "rgba(108, 99, 255, 0.1)" : "transparent",
        border: "none",
        borderBottom: isActive ? "3px solid #6C63FF" : "3px solid transparent",
        color: isActive ? "#6C63FF" : "#0b1220",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: isActive ? "700" : "600",
        transition: "all 200ms ease",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = "#6C63FF";
          e.currentTarget.style.background = "rgba(108, 99, 255, 0.05)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = "#0b1220";
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      {feature.icon && <span style={{ fontSize: "18px" }}>{feature.icon}</span>}
      <span>{feature.name || feature.label}</span>
    </button>
  );
}

export default FeatureMenuItem;
