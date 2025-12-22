// src/admin/SystemToolsPage.jsx
import React from "react";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";

export default function SystemToolsPage() {
  const navigate = useNavigate();

  const tools = [
    {
      id: "initialize",
      title: "🚀 Initialize Firebase Structure",
      description: "Create the complete hierarchical structure: Features → Categories → Topics → SubTopics",
      route: "/admin/initialize",
      color: "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)",
      textColor: "#1e40af",
      icon: "🏗️",
      details: [
        "Creates Quiz Feature with proper featureType",
        "Creates Kids Category under Quiz",
        "Creates Animals Topic under Kids",
        "Creates 6 SubTopics (Animals & Their Sounds, Birds & Insects, etc.)",
        "Smart duplicate detection - won't recreate existing data"
      ]
    },
    {
      id: "fix-structure",
      title: "🔧 Fix Firebase Structure",
      description: "Fix inconsistencies in your Firebase collections",
      route: "/admin/fix-structure",
      color: "linear-gradient(135deg, #fed7aa 0%, #fecaca 100%)",
      textColor: "#991b1b",
      icon: "⚙️",
      details: [
        "Adds missing featureType field to Quiz feature",
        "Renames 'kids' category to 'Kids' with proper capitalization",
        "Updates all references to use correct IDs",
        "Creates missing SubTopics (currently 1 of 6)",
        "Updates existing SubTopics with correct references"
      ]
    },
    {
      id: "inspect",
      title: "🔍 Inspect Collections",
      description: "View the contents of Firebase collections",
      route: "/admin/initialize",
      color: "linear-gradient(135deg, #bfdbfe 0%, #ddd6fe 100%)",
      textColor: "#1e3a8a",
      icon: "📊",
      details: [
        "Inspect all collections at once or individually",
        "Shows total document count per collection",
        "Displays first 3 documents as examples",
        "Shows key fields based on collection type",
        "Useful for debugging and verification"
      ],
      note: "Available on Initialize page"
    }
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 32, maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)",
          borderRadius: 16,
          padding: 32,
          marginBottom: 32,
          color: "#1f2937",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
          border: "1px solid #e5e7eb"
        }}>
          <h1 style={{ 
            fontSize: 32, 
            fontWeight: 700, 
            margin: 0, 
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#1f2937"
          }}>
            🛠️ System Tools
          </h1>
          <p style={{ 
            margin: 0, 
            fontSize: 18,
            lineHeight: 1.6,
            color: "#4b5563"
          }}>
            Manage and maintain your Firebase infrastructure with powerful admin tools.
            Initialize new structures, fix inconsistencies, and inspect your data.
          </p>
        </div>

        {/* Tools Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: 24
        }}>
          {tools.map((tool) => (
            <div
              key={tool.id}
              style={{
                background: "white",
                borderRadius: 12,
                border: "2px solid #e5e7eb",
                overflow: "hidden",
                transition: "all 0.3s ease",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}
              onClick={() => navigate(tool.route)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                e.currentTarget.style.borderColor = "#9ca3af";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}
            >
              {/* Tool Header */}
              <div style={{
                background: tool.color,
                padding: 24,
                color: tool.textColor
              }}>
                <div style={{
                  fontSize: 48,
                  marginBottom: 12,
                  textAlign: "center"
                }}>
                  {tool.icon}
                </div>
                <h2 style={{
                  fontSize: 20,
                  fontWeight: 700,
                  margin: 0,
                  marginBottom: 8,
                  textAlign: "center",
                  color: tool.textColor
                }}>
                  {tool.title}
                </h2>
                <p style={{
                  margin: 0,
                  fontSize: 14,
                  textAlign: "center",
                  lineHeight: 1.5,
                  color: tool.textColor,
                  opacity: 0.8
                }}>
                  {tool.description}
                </p>
              </div>

              {/* Tool Details */}
              <div style={{ padding: 24 }}>
                <ul style={{
                  margin: 0,
                  paddingLeft: 20,
                  color: "#374151",
                  fontSize: 14,
                  lineHeight: 1.8
                }}>
                  {tool.details.map((detail, idx) => (
                    <li key={idx} style={{ marginBottom: 8 }}>
                      {detail}
                    </li>
                  ))}
                </ul>

                {tool.note && (
                  <div style={{
                    marginTop: 16,
                    padding: 12,
                    background: "#fef3c7",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "#92400e",
                    fontWeight: 500
                  }}>
                    💡 {tool.note}
                  </div>
                )}

                {/* Action Button */}
                <button
                  style={{
                    marginTop: 20,
                    width: "100%",
                    padding: "12px 24px",
                    background: tool.color,
                    color: tool.textColor,
                    border: `2px solid ${tool.textColor}`,
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = tool.textColor;
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = tool.color;
                    e.currentTarget.style.color = tool.textColor;
                  }}
                >
                  Open Tool →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Usage Tips */}
        <div style={{
          marginTop: 40,
          padding: 24,
          background: "#f9fafb",
          borderRadius: 12,
          border: "2px solid #e5e7eb"
        }}>
          <h3 style={{
            fontSize: 18,
            fontWeight: 600,
            margin: 0,
            marginBottom: 16,
            color: "#1f2937",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            💡 Usage Tips
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16
          }}>
            <div>
              <div style={{ fontWeight: 600, color: "#4b5563", marginBottom: 4 }}>
                ✅ When to Initialize
              </div>
              <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
                Use this when setting up a new feature category system or starting fresh. 
                Safe to run multiple times - won't duplicate data.
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: "#4b5563", marginBottom: 4 }}>
                🔧 When to Fix Structure
              </div>
              <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
                Use this when you notice inconsistencies, missing fields, or incorrect 
                references in your Firebase collections.
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: "#4b5563", marginBottom: 4 }}>
                🔍 When to Inspect
              </div>
              <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
                Use this to verify data structure, check field values, debug issues, 
                or confirm changes after running other tools.
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div style={{
          marginTop: 24,
          padding: 20,
          background: "#fef2f2",
          border: "2px solid #fecaca",
          borderRadius: 12
        }}>
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#991b1b",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            ⚠️ Important Note
          </div>
          <p style={{
            margin: 0,
            fontSize: 14,
            color: "#991b1b",
            lineHeight: 1.6
          }}>
            These tools modify your Firebase database. While they include safety checks 
            and duplicate detection, it's recommended to backup your data before running 
            them, especially in production environments. Always test in development first.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
