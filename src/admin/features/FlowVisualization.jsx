// src/admin/features/FlowVisualization.jsx
import React from "react";

export default function FlowVisualization({ features, categories, topics, subtopics }) {
  if (features.length === 0) {
    return (
      <div style={{
        marginTop: 40,
        padding: 40,
        background: "white",
        borderRadius: 12,
        border: "2px dashed #e2e8f0",
        textAlign: "center"
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
        <div style={{ fontSize: 16, color: "#64748b", marginBottom: 8 }}>
          No content structure yet
        </div>
        <div style={{ fontSize: 14, color: "#94a3b8" }}>
          Create features, categories, topics, and subtopics above to see the flow diagram
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalPublishedCategories = categories.filter(c => c.isPublished).length;
  const totalPublishedTopics = topics.filter(t => t.isPublished).length;

  return (
    <div style={{ marginTop: 40 }}>
      {/* Interactive Table View */}
      <div style={{
        background: "white",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}>
        <div style={{
          padding: 20,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white"
        }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "white" }}>
            📋 Content Structure Overview
          </h3>
          <p style={{ margin: "8px 0 0 0", fontSize: 13, opacity: 0.95, color: "white" }}>
            Click to expand and view complete hierarchy
          </p>
        </div>

        <div style={{ padding: 20 }}>
          {features.map((feature) => {
            const featureCategories = categories.filter(c => c.featureId === feature.id);

            return (
              <FeatureRow
                key={feature.id}
                feature={feature}
                categories={featureCategories}
                topics={topics}
                subtopics={subtopics}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FeatureRow({ feature, categories, topics, subtopics }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div style={{
      marginBottom: 16,
      border: "2px solid #e2e8f0",
      borderRadius: 10,
      overflow: "hidden"
    }}>
      {/* Feature Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: 16,
          background: expanded ? "#f8fafc" : "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 12,
          transition: "all 0.2s ease"
        }}
      >
        <div style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          color: "white",
          flexShrink: 0
        }}>
          {feature.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0b1220" }}>
            {feature.label}
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
            {categories.length} {categories.length === 1 ? 'category' : 'categories'} 
            {feature.featureType && ` • Type: ${feature.featureType}`}
          </div>
        </div>
        <div style={{
          padding: "6px 12px",
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 600,
          background: feature.enabled ? "#dcfce7" : "#fee2e2",
          color: feature.enabled ? "#15803d" : "#991b1b"
        }}>
          {feature.enabled ? "✓ Enabled" : "✗ Disabled"}
        </div>
        <div style={{
          fontSize: 20,
          color: "#64748b",
          transition: "transform 0.2s ease",
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)"
        }}>
          ▼
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div style={{ padding: "0 16px 16px 16px" }}>
          {categories.length === 0 ? (
            <div style={{
              padding: 24,
              textAlign: "center",
              color: "#94a3b8",
              fontSize: 13,
              fontStyle: "italic"
            }}>
              No categories created yet
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
              {categories.map((category) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  topics={topics.filter(t => t.categoryId === category.id)}
                  subtopics={subtopics.filter(s => s.categoryId === category.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CategoryRow({ category, topics, subtopics }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div style={{
      border: `2px solid ${category.color || "#e2e8f0"}`,
      borderRadius: 8,
      overflow: "hidden",
      background: "white"
    }}>
      {/* Category Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: 12,
          background: expanded ? `${category.color}10` : "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 10,
          transition: "all 0.2s ease"
        }}
      >
        <div style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: category.color || "#f59e0b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          color: "white",
          flexShrink: 0
        }}>
          {category.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0b1220" }}>
            {category.label}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
            {topics.length} topics • {subtopics.length} subtopics
          </div>
        </div>
        <div style={{
          padding: "4px 10px",
          borderRadius: 12,
          fontSize: 10,
          fontWeight: 600,
          background: category.isPublished ? "#dcfce7" : "#fef3c7",
          color: category.isPublished ? "#15803d" : "#92400e"
        }}>
          {category.isPublished ? "Published" : "Draft"}
        </div>
        <div style={{
          fontSize: 16,
          color: "#64748b",
          transition: "transform 0.2s ease",
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)"
        }}>
          ▼
        </div>
      </div>

      {/* Expanded Topics */}
      {expanded && (
        <div style={{ padding: 12, background: "#f8fafc" }}>
          {topics.length === 0 ? (
            <div style={{
              padding: 16,
              textAlign: "center",
              color: "#94a3b8",
              fontSize: 12,
              fontStyle: "italic"
            }}>
              No topics created yet
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 10 }}>
              {topics.map((topic) => {
                const topicSubs = subtopics.filter(s => s.topicId === topic.id);
                return (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    subtopics={topicSubs}
                  />
                );
              })}
            </div>
          )}

          {/* Orphan Subtopics */}
          {(() => {
            const orphans = subtopics.filter(s => !s.topicId);
            if (orphans.length > 0) {
              return (
                <div style={{
                  marginTop: 12,
                  padding: 12,
                  background: "#fef3c7",
                  borderRadius: 8,
                  border: "2px solid #fbbf24"
                }}>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#92400e",
                    marginBottom: 8
                  }}>
                    ⚠️ Subtopics without topic assignment:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {orphans.map(sub => (
                      <span
                        key={sub.id}
                        style={{
                          padding: "4px 10px",
                          background: "white",
                          borderRadius: 12,
                          fontSize: 11,
                          color: "#92400e",
                          border: "1px solid #fbbf24"
                        }}
                      >
                        {sub.icon} {sub.label}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}
    </div>
  );
}

function TopicCard({ topic, subtopics }) {
  const [showSubs, setShowSubs] = React.useState(false);

  return (
    <div style={{
      background: "white",
      borderRadius: 8,
      border: "2px solid #e2e8f0",
      overflow: "hidden",
      transition: "all 0.2s ease",
      cursor: subtopics.length > 0 ? "pointer" : "default"
    }}
    onClick={() => subtopics.length > 0 && setShowSubs(!showSubs)}
    >
      <div style={{ padding: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 18 }}>{topic.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0b1220" }}>
              {topic.label || topic.name}
            </div>
          </div>
          {topic.isPublished ? (
            <span style={{ fontSize: 12, color: "#15803d" }}>✓</span>
          ) : (
            <span style={{ fontSize: 12, color: "#94a3b8" }}>○</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: "#64748b" }}>
          Order: {topic.sortOrder || 0} • {subtopics.length} {subtopics.length === 1 ? 'subtopic' : 'subtopics'}
        </div>
        <div style={{ fontSize: 10, color: "#10b981", fontWeight: 600, marginTop: 2 }}>
          {topic.quizCount || 0} questions
        </div>
      </div>

      {/* Subtopics */}
      {showSubs && subtopics.length > 0 && (
        <div style={{
          padding: 10,
          paddingTop: 0,
          borderTop: "1px solid #e2e8f0"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {subtopics.map(sub => (
              <div
                key={sub.id}
                style={{
                  padding: "6px 10px",
                  background: "#f8fafc",
                  borderRadius: 6,
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <span style={{ fontSize: 14 }}>{sub.icon}</span>
                <span style={{ flex: 1, color: "#0b1220" }}>{sub.label}</span>
                <span style={{ fontSize: 10, color: "#10b981", fontWeight: 600 }}>
                  {sub.quizCount || 0} questions
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
