// src/admin/features/TopicsList.jsx
import React from "react";
import { Card, Button } from "../../components/ui";

function TopicsList({
  topics,
  selectedTopicId,
  selectedCategoryId,
  categories,
  subtopics,
  onSelectTopic,
  onEditTopic,
  onDeleteTopic,
  onToggleTopicPublish,
  onAddTopic
}) {
  const getCategoryName = (catId) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.label : "Unknown Category";
  };

  const getSubtopicCount = (topicId) => {
    if (!subtopics) return 0;
    return subtopics.filter(s => s.topicId === topicId).length;
  };

  const getQuizCount = (topic) => topic.quizCount || 0;

  if (!selectedCategoryId) {
    return (
      <div className="fcm-topics-section">
        <div style={{ textAlign: "center", padding: 30, color: "#94a3b8" }}>
          <h3 style={{ fontSize: 14, margin: 0 }}>← Select a Category first</h3>
        </div>
      </div>
    );
  }

  // Filter topics by selected category
  const filteredTopics = topics.filter(t => t.categoryId === selectedCategoryId);

  return (
    <div className="fcm-topics-section">
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
            📑 Step 3: Topics ({filteredTopics.length})
          </h3>
          <div
            style={{
              fontSize: 9,
              color: "#64748b",
              marginTop: 2,
            }}
          >
            Category: {getCategoryName(selectedCategoryId)}
          </div>
        </div>
        <Button
          onClick={onAddTopic}
          style={{
            padding: "6px 10px",
            fontSize: 11,
          }}
        >
          +
        </Button>
      </div>

      <div className="fcm-topics-list">
        {filteredTopics.map((topic) => (
          <Card
            key={topic.id}
            onClick={() => onSelectTopic(topic.id)}
            style={{
              padding: 8,
              cursor: "pointer",
              background: selectedTopicId === topic.id ? "#f3e8ff" : "#fff",
              borderLeft: `4px solid ${topic.color || "#a855f7"}`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>{topic.icon || "📑"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "#0b1220", fontSize: 12 }}>
                    {topic.label}
                  </div>
                  <div style={{ fontSize: 9, color: "#64748b" }}>
                    {getSubtopicCount(topic.id)} subtopics | {getQuizCount(topic)} quizzes
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
                    onEditTopic(topic);
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
                  title={topic.isPublished ? "Unpublish" : "Publish"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTopicPublish(topic);
                  }}
                  style={{
                    padding: "4px",
                    fontSize: 12,
                    background: topic.isPublished ? "#dcfce7" : "#f3f4f6",
                    color: topic.isPublished ? "#15803d" : "#4b5563",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {topic.isPublished ? "✓" : "○"}
                </Button>
                <Button
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTopic(topic.id);
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
export default React.memo(TopicsList);
