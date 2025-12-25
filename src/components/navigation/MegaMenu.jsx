/**
 * MegaMenu.jsx
 * Dropdown mega menu for desktop
 * Displays categories and optionally topics for a feature
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTopicsByCategory } from "../../services/navigationService";

function MegaMenu({ feature, categories, isOpen, onClose, config }) {
  const navigate = useNavigate();
  const [topicsByCategory, setTopicsByCategory] = useState({});
  const [loadingTopics, setLoadingTopics] = useState(false);

  // Load topics when mega menu opens
  useEffect(() => {
    if (!isOpen || !config?.showTopics || categories.length === 0) {
      return;
    }

    setLoadingTopics(true);
    const loadAllTopics = async () => {
      try {
        const topicsMap = {};
        for (const category of categories) {
          const topics = await fetchTopicsByCategory(category.id);
          topicsMap[category.id] = topics;
        }
        setTopicsByCategory(topicsMap);
      } catch (error) {
        console.error("Error loading topics:", error);
      } finally {
        setLoadingTopics(false);
      }
    };

    loadAllTopics();
  }, [isOpen, categories, config]);

  if (!isOpen || !feature) {
    return null;
  }

  const handleCategoryClick = (category) => {
    onClose();
    // Route to category page or quiz page
    navigate(`/category/${category.id}`, { state: { categoryName: category.name } });
  };

  const handleTopicClick = (category, topic) => {
    onClose();
    navigate(`/category/${category.id}/topic/${topic.id}`, {
      state: { categoryName: category.name, topicName: topic.name },
    });
  };

  // Calculate grid columns based on config and number of categories
  const numCategories = categories.length;
  const maxCols = config?.maxCategoriesPerRow || 4;
  const gridCols = Math.min(numCategories, maxCols);

  return (
    <div
      className="mega-menu"
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        background: "white",
        borderBottom: "3px solid #6C63FF",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 40,
        padding: "24px",
        animation: `slideDown ${config?.animationDuration || 250}ms ease-out`,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Feature heading */}
        <div
          style={{
            marginBottom: "16px",
            paddingBottom: "12px",
            borderBottom: "2px solid #f0f0f0",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: "700",
              color: "#6C63FF",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {feature.name || feature.label}
          </h3>
        </div>

        {/* Categories grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
            gap: "20px",
          }}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              style={{
                cursor: "pointer",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.opacity = "1";
              }}
            >
              {/* Category Card */}
              <div
                onClick={() => handleCategoryClick(category)}
                style={{
                  padding: "16px",
                  background: "rgba(108, 99, 255, 0.05)",
                  borderRadius: "12px",
                  border: "2px solid rgba(108, 99, 255, 0.2)",
                  cursor: "pointer",
                  transition: "all 200ms ease",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#6C63FF";
                  e.currentTarget.style.background = "rgba(108, 99, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(108, 99, 255, 0.2)";
                  e.currentTarget.style.background = "rgba(108, 99, 255, 0.05)";
                }}
              >
                {/* Category header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  {category.icon && (
                    <span
                      style={{
                        fontSize: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {category.icon}
                    </span>
                  )}
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0b1220",
                    }}
                  >
                    {category.name || category.label}
                  </h4>
                </div>

                {/* Topics list (if enabled) */}
                {config?.showTopics && topicsByCategory[category.id] && (
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      fontSize: "12px",
                      color: "#666",
                    }}
                  >
                    {topicsByCategory[category.id].slice(0, 4).map((topic) => (
                      <li
                        key={topic.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTopicClick(category, topic);
                        }}
                        style={{
                          padding: "6px 0",
                          cursor: "pointer",
                          transition: "all 150ms ease",
                          paddingLeft: "16px",
                          position: "relative",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#6C63FF";
                          e.currentTarget.style.paddingLeft = "20px";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#666";
                          e.currentTarget.style.paddingLeft = "16px";
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: "0",
                            color: "#6C63FF",
                          }}
                        >
                          ▸
                        </span>
                        {topic.name || topic.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        {loadingTopics && (
          <div
            style={{
              textAlign: "center",
              padding: "12px",
              fontSize: "12px",
              color: "#999",
            }}
          >
            Loading topics...
          </div>
        )}
      </div>
    </div>
  );
}

export default MegaMenu;
