// src/admin/features/CategoriesList.jsx
import React from "react";
import { Card, Button } from "../../components/ui";

function CategoriesList({
  categories,
  selectedCategoryId,
  selectedFeatureId,
  features,
  subtopics,
  onSelectCategory,
  onEditCategory,
  onDeleteCategory,
  onToggleCategoryPublish,
  onAddCategory
}) {
  const getFeatureName = (fId) => {
    const feat = features.find((f) => f.id === fId);
    return feat ? feat.label : "Unknown Feature";
  };

  if (!selectedFeatureId) {
    return (
      <div className="fcm-categories-section">
        <div style={{ textAlign: "center", padding: 30, color: "#94a3b8" }}>
          <h3 style={{ fontSize: 14, margin: 0 }}>← Select a Feature first</h3>
        </div>
      </div>
    );
  }

  const filteredCategories = categories.filter(
    (cat) => cat.featureId === selectedFeatureId
  );

  return (
    <div className="fcm-categories-section">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            📁 Step 2: Categories ({filteredCategories.length})
          </h3>
          <div
            style={{
              fontSize: 9,
              color: "#64748b",
              marginTop: 2,
            }}
          >
            Feature: {getFeatureName(selectedFeatureId)}
          </div>
        </div>
        <Button
          onClick={onAddCategory}
          style={{
            padding: "6px 10px",
            fontSize: 11,
          }}
        >
          +
        </Button>
      </div>

      <div className="fcm-categories-list">
        {filteredCategories.map((cat) => (
          <Card
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            style={{
              padding: 8,
              cursor: "pointer",
              background: selectedCategoryId === cat.id ? "#fef3c7" : "#fff",
              borderLeft: `4px solid ${cat.color || "#f59e0b"}`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>{cat.icon || "📁"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "#0b1220", fontSize: 12 }}>
                    {cat.label}
                  </div>
                  <div style={{ fontSize: 9, color: "#64748b" }}>
                    {subtopics.filter((s) => s.categoryId === cat.id).length} topics
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontSize: 9,
                  color: "#64748b",
                  marginTop: 2,
                }}
              >
                Mode: {cat.uiMode || "quiz"}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 4,
                  marginTop: 4,
                  paddingTop: 4,
                  borderTop: "1px solid #e2e8f0",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  title="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCategory(cat);
                  }}
                  style={{
                    padding: "4px",
                    fontSize: 12,
                    background: "#dbeafe",
                    color: "#0284c7",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✏️
                </Button>
                <Button
                  title={cat.isPublished ? "Unpublish" : "Publish"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCategoryPublish(cat);
                  }}
                  style={{
                    padding: "4px",
                    fontSize: 12,
                    background: cat.isPublished ? "#dcfce7" : "#f3f4f6",
                    color: cat.isPublished ? "#15803d" : "#4b5563",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cat.isPublished ? "✓" : "○"}
                </Button>
                <Button
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCategory(cat.id);
                  }}
                  style={{
                    padding: "4px",
                    fontSize: 12,
                    background: "#fee2e2",
                    color: "#991b1b",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  🗑️
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default React.memo(CategoriesList);
