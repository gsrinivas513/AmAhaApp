// src/admin/InspectCollectionsPage.jsx
import React, { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import AdminLayout from "./AdminLayout";

export default function InspectCollectionsPage() {
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState([]);
  const [inspecting, setInspecting] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState("all");

  const collections = [
    "features",
    "categories",
    "topics",
    "subtopics",
    "questions",
    "puzzles",
    "scores",
    "storyCategories"
  ];

  const addProgress = (message) => {
    setProgress(prev => [...prev, message]);
  };

  const inspectCollections = async () => {
    try {
      setInspecting(true);
      setStatus("Inspecting Firebase collections...");
      setProgress([]);

      const collectionsToInspect = selectedCollection === "all" 
        ? collections
        : [selectedCollection];

      for (const collectionName of collectionsToInspect) {
        addProgress(`\n📋 Collection: ${collectionName}`);
        addProgress("─".repeat(80));
        
        try {
          const snap = await getDocs(collection(db, collectionName));
          
          if (snap.empty) {
            addProgress(`   ⚠️  Empty collection (0 documents)\n`);
            continue;
          }

          addProgress(`   📊 Total documents: ${snap.size}\n`);
          addProgress(`   📄 Documents:\n`);
          
          snap.docs.forEach((doc, idx) => {
            const data = doc.data();
            addProgress(`   ${idx + 1}. ID: ${doc.id}`);
            
            // Show all fields
            Object.entries(data).forEach(([key, value]) => {
              let displayValue = value;
              if (typeof value === "object" && value !== null) {
                displayValue = JSON.stringify(value).substring(0, 100);
              } else if (typeof value === "string" && value.length > 100) {
                displayValue = value.substring(0, 100) + "...";
              }
              addProgress(`      • ${key}: ${displayValue}`);
            });
            addProgress("");
          });
        } catch (err) {
          addProgress(`   ❌ Error: ${err.message}\n`);
        }
      }

      setStatus("✅ Inspection complete");
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`);
      addProgress(`Error: ${err.message}`);
    } finally {
      setInspecting(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)",
          borderRadius: 16,
          padding: 32,
          marginBottom: 32,
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
            🔍 Inspect Collections
          </h1>
          <p style={{ 
            margin: 0, 
            fontSize: 16,
            lineHeight: 1.6,
            color: "#4b5563"
          }}>
            View all documents in your Firebase collections. Inspect individual collections or view everything at once.
          </p>
        </div>

        {/* Controls */}
        <div style={{
          background: "white",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          padding: 24,
          marginBottom: 24
        }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div>
              <label style={{ 
                display: "block", 
                fontSize: 14, 
                fontWeight: 600, 
                marginBottom: 8,
                color: "#374151"
              }}>
                Select Collection
              </label>
              <select 
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  fontSize: 14,
                  fontFamily: "system-ui",
                  minWidth: 200,
                  cursor: "pointer"
                }}
              >
                <option value="all">🔄 All Collections</option>
                <option value="">─────────────────</option>
                {collections.map(col => (
                  <option key={col} value={col}>
                    📋 {col} ({col === "features" ? "✨" : col === "categories" ? "📂" : col === "topics" ? "📚" : col === "puzzles" ? "🧩" : col === "questions" ? "❓" : col === "scores" ? "📊" : col === "storyCategories" ? "📖" : "📋"})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={inspectCollections}
              disabled={inspecting}
              style={{
                padding: "10px 24px",
                background: inspecting ? "#d1d5db" : "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: inspecting ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: inspecting ? "none" : "0 4px 12px rgba(2, 132, 199, 0.3)"
              }}
              onMouseEnter={(e) => !inspecting && (e.target.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => !inspecting && (e.target.style.transform = "translateY(0)")}
            >
              {inspecting ? "🔄 Inspecting..." : "🔍 Inspect Now"}
            </button>
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <div style={{
            padding: 16,
            marginBottom: 24,
            borderRadius: 8,
            background: status.includes("❌") ? "#fee2e2" : "#dcfce7",
            border: `1px solid ${status.includes("❌") ? "#fecaca" : "#86efac"}`,
            color: status.includes("❌") ? "#991b1b" : "#166534",
            fontSize: 14,
            fontWeight: 500
          }}>
            {status}
          </div>
        )}

        {/* Results */}
        {progress.length > 0 && (
          <div style={{
            background: "#f3f4f6",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            padding: 24,
            overflow: "auto",
            maxHeight: "600px"
          }}>
            <pre style={{
              margin: 0,
              fontSize: 13,
              fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
              lineHeight: 1.6,
              color: "#1f2937",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word"
            }}>
              {progress.join("\n")}
            </pre>
          </div>
        )}

        {/* Empty State */}
        {progress.length === 0 && !inspecting && (
          <div style={{
            background: "white",
            borderRadius: 12,
            border: "2px dashed #d1d5db",
            padding: 48,
            textAlign: "center",
            color: "#9ca3af"
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>
              Select a collection and click "Inspect Now" to view its contents
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
