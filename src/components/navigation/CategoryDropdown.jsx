/**
 * CategoryDropdown.jsx
 * Tooltip dropdown showing topics for a category on hover
 * Appears on the right side of the category item
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTopicsByCategory } from "../../services/navigationService";

function CategoryDropdown({ category, isOpen, onClose, config }) {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load topics when dropdown opens
  useEffect(() => {
    if (!isOpen || !category) {
      setTopics([]);
      return;
    }

    setLoading(true);
    const loadTopics = async () => {
      try {
        const fetchedTopics = await fetchTopicsByCategory(category.id);
        setTopics(fetchedTopics);
      } catch (error) {
        console.error("Error loading topics:", error);
        setTopics([]);
      } finally {
        setLoading(false);
      }
    };

    loadTopics();
  }, [isOpen, category?.id]);

  if (!isOpen || !category || topics.length === 0) {
    return null;
  }

  const handleTopicClick = (topic) => {
    navigate(`/category/${category.id}/topic/${topic.id}`, {
      state: { categoryName: category.name, topicName: topic.name },
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: "100%",
        marginLeft: "8px",
        background: "white",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        minWidth: "220px",
        maxWidth: "280px",
        zIndex: 50,
        animation: `slideDown ${config?.animationDuration || 250}ms ease-out`,
      }}
      onMouseLeave={onClose}
    >
      <div style={{ padding: "8px" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#666",
            padding: "8px 12px 4px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Topics
        </div>

        {loading ? (
          <div style={{ padding: "16px 12px", textAlign: "center" }}>
            <span style={{ fontSize: "12px", color: "#999" }}>Loading...</span>
          </div>
        ) : (
          topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicClick(topic)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px 12px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "14px",
                color: "#333",
                transition: "all 150ms ease",
                borderRadius: "4px",
                marginBottom: "2px",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f5f5f5";
                e.target.style.color = "#6C63FF";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#333";
              }}
            >
              {topic.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default CategoryDropdown;
