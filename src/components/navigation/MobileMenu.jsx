/**
 * MobileMenu.jsx
 * Accordion-style mobile menu
 * Feature -> Categories -> Topics (if enabled)
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTopicsByCategory } from "../../services/navigationService";

function MobileMenu({ features, categoriesByFeature, isOpen, onClose, config, loadFeatureCategories }) {
  const navigate = useNavigate();
  const [expandedFeature, setExpandedFeature] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [topicsByCategory, setTopicsByCategory] = useState({});
  const [loadingTopics, setLoadingTopics] = useState(null);

  const handleFeatureClick = async (feature) => {
    // Stories feature navigates directly to /stories
    if (feature.id === "stories") {
      navigate("/stories");
      onClose();
      return;
    }

    if (expandedFeature === feature.id) {
      setExpandedFeature(null);
    } else {
      setExpandedFeature(feature.id);
      // Load categories for this feature if not already loaded
      await loadFeatureCategories(feature.id);
    }
  };

  const handleCategoryClick = async (category) => {
    // Navigate to category page
    onClose();
    navigate(`/category/${category.id}`, {
      state: { categoryName: category.name },
    });
  };

  const handleTopicExpand = async (category) => {
    if (expandedCategory === category.id) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category.id);
      // Load topics if not already loaded
      if (!topicsByCategory[category.id]) {
        setLoadingTopics(category.id);
        try {
          const topics = await fetchTopicsByCategory(category.id);
          setTopicsByCategory((prev) => ({
            ...prev,
            [category.id]: topics,
          }));
        } catch (error) {
          console.error("Error loading topics:", error);
        } finally {
          setLoadingTopics(null);
        }
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="mobile-menu"
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 50,
        animation: `fadeIn 250ms ease-out`,
      }}
      onClick={onClose}
    >
      {/* Menu drawer */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          background: "white",
          maxHeight: "80vh",
          overflowY: "auto",
          zIndex: 51,
          animation: `slideDown 250ms ease-out`,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "700",
              color: "#0b1220",
            }}
          >
            Menu
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#666",
              padding: "4px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Features accordion */}
        <div>
          {features.map((feature) => (
            <div key={feature.id}>
              {/* Feature header */}
              <button
                onClick={() => handleFeatureClick(feature)}
                style={{
                  width: "100%",
                  padding: "16px",
                  background:
                    expandedFeature === feature.id
                      ? "rgba(108, 99, 255, 0.05)"
                      : "transparent",
                  border: "none",
                  borderBottom: "1px solid #f0f0f0",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 200ms ease",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#0b1220",
                }}
              >
                <span>
                  {feature.icon && <span style={{ marginRight: "8px" }}>{feature.icon}</span>}
                  {feature.name || feature.label}
                </span>
                <span
                  style={{
                    transform:
                      expandedFeature === feature.id ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 200ms ease",
                    fontSize: "14px",
                    color: "#6C63FF",
                  }}
                >
                  ▼
                </span>
              </button>

              {/* Categories accordion */}
              {expandedFeature === feature.id && (
                <div
                  style={{
                    background: "rgba(108, 99, 255, 0.02)",
                    animation: `slideDown 200ms ease-out`,
                  }}
                >
                  {(categoriesByFeature[feature.id] || []).map((category) => (
                    <div key={category.id}>
                      {/* Category button */}
                      <button
                        onClick={() =>
                          config?.showTopics
                            ? handleTopicExpand(category)
                            : handleCategoryClick(category)
                        }
                        style={{
                          width: "100%",
                          padding: "12px 16px 12px 32px",
                          background:
                            expandedCategory === category.id
                              ? "rgba(108, 99, 255, 0.1)"
                              : "transparent",
                          border: "none",
                          borderBottom: "1px solid rgba(108, 99, 255, 0.1)",
                          textAlign: "left",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          transition: "all 200ms ease",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#333",
                        }}
                      >
                        <span>
                          {category.icon && (
                            <span style={{ marginRight: "8px" }}>
                              {category.icon}
                            </span>
                          )}
                          {category.name || category.label}
                        </span>
                        {config?.showTopics && (
                          <span
                            style={{
                              transform:
                                expandedCategory === category.id
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                              transition: "transform 200ms ease",
                              fontSize: "12px",
                              color: "#6C63FF",
                            }}
                          >
                            ▼
                          </span>
                        )}
                      </button>

                      {/* Topics list (if enabled) */}
                      {config?.showTopics && expandedCategory === category.id && (
                        <div
                          style={{
                            background: "rgba(108, 99, 255, 0.05)",
                            animation: `slideDown 200ms ease-out`,
                          }}
                        >
                          {loadingTopics === category.id ? (
                            <div
                              style={{
                                padding: "12px 32px",
                                fontSize: "12px",
                                color: "#999",
                              }}
                            >
                              Loading...
                            </div>
                          ) : (
                            (topicsByCategory[category.id] || []).map((topic) => (
                              <button
                                key={topic.id}
                                onClick={() => {
                                  onClose();
                                  navigate(
                                    `/category/${category.id}/topic/${topic.id}`,
                                    {
                                      state: {
                                        categoryName: category.name,
                                        topicName: topic.name,
                                      },
                                    }
                                  );
                                }}
                                style={{
                                  width: "100%",
                                  padding: "10px 16px 10px 48px",
                                  background: "transparent",
                                  border: "none",
                                  borderBottom: "1px solid rgba(108, 99, 255, 0.08)",
                                  textAlign: "left",
                                  cursor: "pointer",
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  color: "#666",
                                  transition: "all 150ms ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background =
                                    "rgba(108, 99, 255, 0.1)";
                                  e.currentTarget.style.color = "#6C63FF";
                                  e.currentTarget.style.paddingLeft = "52px";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background =
                                    "transparent";
                                  e.currentTarget.style.color = "#666";
                                  e.currentTarget.style.paddingLeft = "48px";
                                }}
                              >
                                • {topic.name || topic.label}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
