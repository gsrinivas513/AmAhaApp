// src/admin/features/SubTopicsList.jsx
import React from "react";
import { Card, Button } from "../../components/ui";

function SubTopicsList({
  subtopics,
  selectedTopicId,
  selectedCategoryId,
  topics,
  onEditSubtopic,
  onDeleteSubtopic,
  onToggleSubtopicPublish,
  onAddSubtopic,
  onAddQuestion
}) {
  const getTopicName = (topicId) => {
    if (!topicId) return "No Topic";
    const topic = topics.find((t) => t.id === topicId);
    return topic ? topic.label : "Unknown Topic";
  };

  if (!selectedCategoryId) {
    return (
      <div className="fcm-subtopics-section">
        <div style={{ textAlign: "center", padding: 30, color: "#94a3b8" }}>
          <h3 style={{ fontSize: 14, margin: 0 }}>← Select a Category first</h3>
        </div>
      </div>
    );
  }

  // Filter by category first, then by topic if selected
  const filteredSubtopicies = selectedTopicId
    ? subtopics.filter((sub) => sub.categoryId === selectedCategoryId && sub.topicId === selectedTopicId)
    : subtopics.filter((sub) => sub.categoryId === selectedCategoryId);

  return (
    <div className="fcm-subtopics-section">
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
            📄 Step 4: SubTopics ({filteredSubtopicies.length})
          </h3>
          <div
            style={{
              fontSize: 9,
              color: "#64748b",
              marginTop: 2,
            }}
          >
            {selectedTopicId ? `Topic: ${getTopicName(selectedTopicId)}` : "All topics"}
          </div>
        </div>
        <Button
          onClick={onAddSubtopic}
          style={{
            padding: "6px 10px",
            fontSize: 11,
          }}
        >
          +
        </Button>
      </div>

      <div className="fcm-subtopics-list">
        {filteredSubtopicies.map((sub) => (
          <Card
            key={sub.id}
            style={{
              padding: 8,
              background: "#fff",
              borderLeft: `4px solid ${sub.color || "#10b981"}`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>{sub.icon || "📄"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "#0b1220", fontSize: 12 }}>
                    {sub.label}
                  </div>
                  <div style={{ fontSize: 9, color: "#10b981", fontWeight: 600 }}>
                    {sub.quizCount || 0} questions
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 9, color: "#64748b", marginTop: 2 }}>
                Topic: {getTopicName(sub.topicId)}
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
                  title="Add Content"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onAddQuestion) onAddQuestion(sub);
                  }}
                  style={{
                    padding: "4px",
                    fontSize: 12,
                    background: "#d1fae5",
                    color: "#065f46",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ➕
                </Button>
                <Button
                  title="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditSubtopic(sub);
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
                {onToggleSubtopicPublish && (
                  <Button
                    title={sub.isPublished ? "Unpublish" : "Publish"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSubtopicPublish(sub);
                    }}
                    style={{
                      padding: "4px",
                      fontSize: 12,
                      background: sub.isPublished ? "#dcfce7" : "#f3f4f6",
                      color: sub.isPublished ? "#15803d" : "#4b5563",
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {sub.isPublished ? "✓" : "○"}
                  </Button>
                )}
                <Button
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSubtopic(sub.id);
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
export default React.memo(SubTopicsList);
