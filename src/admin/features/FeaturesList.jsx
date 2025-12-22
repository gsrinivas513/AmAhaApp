// src/admin/features/FeaturesList.jsx
import React from "react";
import { Card, Button } from "../../components/ui";

function FeaturesList({ 
  features, 
  selectedFeatureId, 
  categories,
  onSelectFeature,
  onEditFeature,
  onDeleteFeature,
  onToggleFeaturePublish,
  onAddFeature
}) {
  return (
    <div className="fcm-features-section">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          ✨ Step 1: Features ({features.length})
        </h2>
        <Button
          onClick={onAddFeature}
          style={{
            padding: "6px 10px",
            fontSize: 11,
          }}
        >
          +
        </Button>
      </div>

      <div className="fcm-features-list">
        {features.map((feat) => (
          <Card
            key={feat.id}
            onClick={() => onSelectFeature(feat.id)}
            style={{
              padding: 8,
              cursor: "pointer",
              background: selectedFeatureId === feat.id ? "#f0f9ff" : "#fff",
              borderLeft: `4px solid ${feat.color || "#0284c7"}`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>{feat.icon || "✨"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "#0b1220", fontSize: 12 }}>
                    {feat.label}
                  </div>
                  <div style={{ fontSize: 9, color: "#64748b" }}>
                    {categories.filter((c) => c.featureId === feat.id).length} categories
                  </div>
                </div>
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
                    onEditFeature(feat);
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
                {onToggleFeaturePublish && (
                  <Button
                    title={feat.enabled ? "Unpublish" : "Publish"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFeaturePublish(feat);
                    }}
                    style={{
                      padding: "4px",
                      fontSize: 12,
                      background: feat.enabled ? "#dcfce7" : "#f3f4f6",
                      color: feat.enabled ? "#15803d" : "#4b5563",
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {feat.enabled ? "✓" : "○"}
                  </Button>
                )}
                <Button
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFeature(feat.id);
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
export default React.memo(FeaturesList);
