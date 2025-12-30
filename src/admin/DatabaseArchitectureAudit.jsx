// src/admin/DatabaseArchitectureAudit.jsx
// Comprehensive audit of database structure to find mismatches and inconsistencies

import React, { useState } from "react";
import { collection, getDocs, collectionGroup } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function DatabaseArchitectureAudit() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [auditResults, setAuditResults] = useState(null);

  const runAudit = async () => {
    setLoading(true);
    setStatus("🔍 Running comprehensive database audit...");
    setAuditResults(null);

    try {
      const issues = [];
      const stats = {
        collectionsChecked: 0,
        documentsChecked: 0,
        issuesFound: 0,
        warnings: 0
      };

      // 1. Audit Features Collection
      console.log("\n=== AUDITING FEATURES ===");
      const featSnap = await getDocs(collection(db, "features"));
      const features = featSnap.docs.map(d => ({ docId: d.id, ...d.data() }));
      stats.collectionsChecked++;
      stats.documentsChecked += features.length;

      for (const feat of features) {
        const problems = [];

        // Check: Document ID consistency
        if (!feat.id) {
          problems.push("❌ Missing id field (critical for filtering)");
        } else if (feat.docId !== feat.id && feat.docId !== feat.label?.toLowerCase()) {
          problems.push(`⚠️ docId (${feat.docId}) doesn't match id field (${feat.id})`);
        }

        // Check: Required fields
        if (!feat.featureType && !feat.type) {
          problems.push("❌ Missing featureType or type field");
        }
        if (!feat.label && !feat.name) {
          problems.push("❌ Missing label or name field");
        }

        // Check: Consistent naming
        const expectedId = (feat.featureType || feat.type)?.toLowerCase();
        if (feat.id && expectedId && feat.id !== expectedId) {
          problems.push(`⚠️ id field (${feat.id}) should match type (${expectedId})`);
        }

        if (problems.length > 0) {
          issues.push({
            collection: "features",
            docId: feat.docId,
            name: feat.label || feat.name,
            problems,
            severity: problems.some(p => p.includes("❌")) ? "critical" : "warning"
          });
          stats.issuesFound += problems.length;
        }
      }

      // 2. Audit Categories Collection
      console.log("\n=== AUDITING CATEGORIES ===");
      const catSnap = await getDocs(collection(db, "categories"));
      const categories = catSnap.docs.map(d => ({ docId: d.id, ...d.data() }));
      stats.collectionsChecked++;
      stats.documentsChecked += categories.length;

      // Build feature ID reference map
      const featureIdMap = {};
      for (const feat of features) {
        featureIdMap[feat.id] = feat;
        featureIdMap[feat.docId] = feat;
      }

      for (const cat of categories) {
        const problems = [];

        // Check: featureId field exists and valid
        if (!cat.featureId) {
          problems.push("❌ Missing featureId field (critical for filtering)");
        } else {
          // Check if featureId matches a known feature
          const matchingFeature = featureIdMap[cat.featureId];
          if (!matchingFeature) {
            problems.push(`❌ featureId "${cat.featureId}" doesn't match any feature`);
          }
        }

        // Check: Required fields
        if (!cat.name) {
          problems.push("❌ Missing name field");
        }

        if (problems.length > 0) {
          issues.push({
            collection: "categories",
            docId: cat.docId,
            name: cat.name,
            featureId: cat.featureId,
            problems,
            severity: problems.some(p => p.includes("❌")) ? "critical" : "warning"
          });
          stats.issuesFound += problems.length;
        }
      }

      // 3. Audit Topics Collection
      console.log("\n=== AUDITING TOPICS ===");
      const topicSnap = await getDocs(collection(db, "topics"));
      const topics = topicSnap.docs.map(d => ({ docId: d.id, ...d.data() }));
      stats.collectionsChecked++;
      stats.documentsChecked += topics.length;

      for (const topic of topics) {
        const problems = [];

        // Check: Required fields
        if (!topic.categoryId && !topic.category) {
          problems.push("⚠️ Missing categoryId or category reference");
        }
        if (!topic.name) {
          problems.push("❌ Missing name field");
        }

        if (problems.length > 0) {
          issues.push({
            collection: "topics",
            docId: topic.docId,
            name: topic.name,
            categoryId: topic.categoryId || topic.category,
            problems,
            severity: problems.some(p => p.includes("❌")) ? "critical" : "warning"
          });
          stats.issuesFound += problems.length;
        }
      }

      // 4. Audit Subtopics Collection
      console.log("\n=== AUDITING SUBTOPICS ===");
      const subtopicSnap = await getDocs(collection(db, "subtopics"));
      const subtopics = subtopicSnap.docs.map(d => ({ docId: d.id, ...d.data() }));
      stats.collectionsChecked++;
      stats.documentsChecked += subtopics.length;

      for (const subtopic of subtopics) {
        const problems = [];

        if (!subtopic.topicId) {
          problems.push("⚠️ Missing topicId reference");
        }
        if (!subtopic.name) {
          problems.push("❌ Missing name field");
        }

        if (problems.length > 0) {
          issues.push({
            collection: "subtopics",
            docId: subtopic.docId,
            name: subtopic.name,
            topicId: subtopic.topicId,
            problems,
            severity: problems.some(p => p.includes("❌")) ? "critical" : "warning"
          });
          stats.issuesFound += problems.length;
        }
      }

      // 5. Audit Puzzles Collection
      console.log("\n=== AUDITING PUZZLES ===");
      const puzzleSnap = await getDocs(collection(db, "puzzles"));
      const puzzles = puzzleSnap.docs.map(d => ({ docId: d.id, ...d.data() }));
      stats.collectionsChecked++;
      stats.documentsChecked += puzzles.length;

      for (const puzzle of puzzles) {
        const problems = [];

        // Check: Puzzle type consistency
        const validTypes = ["find-pair", "picture-word", "spot-difference", "picture-shadow", "ordering"];
        if (!puzzle.type || !validTypes.includes(puzzle.type)) {
          problems.push(`❌ Invalid or missing type. Must be: ${validTypes.join(", ")}`);
        }

        if (!puzzle.categoryId && !puzzle.category) {
          problems.push("⚠️ Missing category reference");
        }

        if (problems.length > 0) {
          issues.push({
            collection: "puzzles",
            docId: puzzle.docId,
            name: puzzle.title || puzzle.name,
            type: puzzle.type,
            problems,
            severity: problems.some(p => p.includes("❌")) ? "critical" : "warning"
          });
          stats.issuesFound += problems.length;
        }
      }

      // 6. Audit Questions Collection (sample - don't load all)
      console.log("\n=== AUDITING QUESTIONS (Sample) ===");
      const questionSnap = await getDocs(collection(db, "questions"));
      const questionCount = questionSnap.size;
      stats.documentsChecked += questionCount;

      let questionIssues = 0;
      for (const doc of questionSnap.docs) {
        const q = doc.data();
        const problems = [];

        if (!q.category) {
          problems.push("⚠️ Missing category");
        }
        if (!q.difficulty) {
          problems.push("⚠️ Missing difficulty");
        }

        if (problems.length > 0) {
          questionIssues++;
        }
      }
      if (questionIssues > 0) {
        stats.issuesFound += questionIssues;
      }

      setAuditResults({
        stats,
        issues,
        questionIssues,
        summary: {
          critical: issues.filter(i => i.severity === "critical").length,
          warning: issues.filter(i => i.severity === "warning").length
        }
      });

      setStatus(`✅ Audit complete! Found ${stats.issuesFound} total issues.`);

    } catch (error) {
      setStatus(`❌ Audit failed: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "system-ui" }}>
      <h1>🔍 Database Architecture Audit</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Scan your entire database to find mismatches, missing fields, and inconsistent references.
        This helps identify issues before they become problems.
      </p>

      <button
        onClick={runAudit}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: "14px",
          background: "#0284c7",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? "Auditing..." : "🔍 Run Audit"}
      </button>

      {status && (
        <div style={{
          marginTop: "16px",
          padding: "12px",
          background: "#f0f4f8",
          borderRadius: "6px",
          fontWeight: "500"
        }}>
          {status}
        </div>
      )}

      {auditResults && (
        <>
          {/* Summary Stats */}
          <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            <div style={{ padding: "12px", background: "#f0f4f8", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#0284c7" }}>
                {auditResults.stats.collectionsChecked}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>Collections Checked</div>
            </div>
            <div style={{ padding: "12px", background: "#f0f4f8", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#0284c7" }}>
                {auditResults.stats.documentsChecked}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>Documents Scanned</div>
            </div>
            <div style={{ padding: "12px", background: "#fef2f2", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#dc2626" }}>
                {auditResults.summary.critical}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>Critical Issues</div>
            </div>
            <div style={{ padding: "12px", background: "#fef3c7", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#d97706" }}>
                {auditResults.summary.warning}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>Warnings</div>
            </div>
          </div>

          {/* Issues List */}
          {auditResults.issues.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3>⚠️ Issues Found ({auditResults.issues.length})</h3>
              <div style={{ maxHeight: "500px", overflow: "auto", border: "1px solid #e5e7eb", borderRadius: "6px" }}>
                {auditResults.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #e5e7eb",
                      background: issue.severity === "critical" ? "#fef2f2" : "#fef3c7"
                    }}
                  >
                    <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                      <span style={{ color: "#666", fontSize: "12px" }}>[{issue.collection}]</span>
                      {" "}
                      {issue.name || issue.docId}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>
                      ID: <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: "3px" }}>{issue.docId}</code>
                      {issue.featureId && (
                        <>
                          {" "}| Feature: <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: "3px" }}>{issue.featureId}</code>
                        </>
                      )}
                    </div>
                    <div>
                      {issue.problems.map((problem, pidx) => (
                        <div key={pidx} style={{ fontSize: "12px", color: "#666", marginBottom: "2px" }}>
                          {problem}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {auditResults.issues.length === 0 && (
            <div style={{ marginTop: "20px", padding: "16px", background: "#dcfce7", borderRadius: "6px", border: "1px solid #86efac", textAlign: "center" }}>
              ✅ <strong>Perfect!</strong> No structural issues found. Your database is well-organized!
            </div>
          )}

          {/* Recommendations */}
          <div style={{ marginTop: "20px", padding: "16px", background: "#eff6ff", borderRadius: "6px", border: "1px solid #bfdbfe" }}>
            <h3>💡 Recommendations</h3>
            <ul style={{ margin: "8px 0", paddingLeft: "20px", fontSize: "13px" }}>
              <li>Use consistent ID naming: all feature IDs should be lowercase (e.g., "quizzes", not "UpNde0cmlHFDQXgTcQOJ")</li>
              <li>Ensure all documents have required reference fields (featureId, categoryId, topicId, etc.)</li>
              <li>Use Firestore rules to validate document structure on write</li>
              <li>Document your schema clearly so new collections follow the same pattern</li>
              <li>Run this audit monthly to catch issues early</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
