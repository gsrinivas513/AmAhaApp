// src/admin/FixQuizzesMissingFeatureIds.jsx
// This component runs in the browser (no service account needed)
// Go to http://localhost:3000/admin/fix-quizzes to use it

import React, { useState } from "react";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function FixQuizzesMissingFeatureIds() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [results, setResults] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  const analyzeCategories = async () => {
    setLoading(true);
    setStatus("📚 Scanning categories...");
    setResults([]);

    try {
      // Load all categories
      const catSnap = await getDocs(collection(db, "categories"));
      const categories = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const withFeatureId = [];
      const withoutFeatureId = [];

      // Analyze each category
      for (const cat of categories) {
        if (cat.featureId) {
          withFeatureId.push({
            id: cat.id,
            name: cat.name,
            featureId: cat.featureId,
            status: "✅ Has featureId"
          });
        } else {
          // Check if it has questions
          try {
            const questionsQuery = query(
              collection(db, "questions"),
              where("category", "==", cat.name)
            );
            const questionsSnap = await getDocs(questionsQuery);
            
            withoutFeatureId.push({
              id: cat.id,
              name: cat.name,
              featureId: null,
              questionsCount: questionsSnap.size,
              suggestedFeature: questionsSnap.size > 0 ? "quizzes" : "unknown",
              status: questionsSnap.size > 0 ? "⚠️ Missing featureId (has questions)" : "❌ Missing featureId (no questions)"
            });
          } catch (err) {
            withoutFeatureId.push({
              id: cat.id,
              name: cat.name,
              featureId: null,
              status: `❌ Error analyzing: ${err.message}`
            });
          }
        }
      }

      setResults({
        withFeatureId,
        withoutFeatureId,
        summary: {
          total: categories.length,
          hasFeatureId: withFeatureId.length,
          missingFeatureId: withoutFeatureId.length
        }
      });

      setStatus(`📊 Found ${withoutFeatureId.length} categories missing featureId`);
    } catch (error) {
      setStatus(`❌ Error scanning: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fixCategories = async () => {
    if (!confirmed) {
      setStatus("⚠️ Check the confirmation checkbox first!");
      return;
    }

    setLoading(true);
    setStatus("🔧 Fixing missing featureIds...");

    try {
      let fixed = 0;
      let failed = [];

      // Fix each category without featureId
      for (const cat of results.withoutFeatureId) {
        try {
          const featureId = cat.suggestedFeature || "quizzes";
          await updateDoc(doc(db, "categories", cat.id), {
            featureId: featureId
          });
          console.log(`✅ Fixed "${cat.name}" → ${featureId}`);
          fixed++;
        } catch (error) {
          failed.push({ name: cat.name, error: error.message });
          console.error(`❌ Failed to fix "${cat.name}":`, error);
        }
      }

      setStatus(
        `🎉 Complete! Fixed ${fixed} categories. ${failed.length > 0 ? `Failed: ${failed.length}` : "No failures!"}`
      );
      
      // Clear results and reset
      setTimeout(() => {
        setConfirmed(false);
        setResults([]);
      }, 2000);

    } catch (error) {
      setStatus(`❌ Fatal error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", fontFamily: "system-ui" }}>
      <h1>🔧 Fix Quizzes Missing featureId</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={analyzeCategories}
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
          {loading ? "Scanning..." : "📊 Analyze Categories"}
        </button>
      </div>

      {status && (
        <div style={{
          padding: "12px",
          background: "#f0f4f8",
          borderRadius: "6px",
          marginBottom: "20px",
          fontWeight: "500"
        }}>
          {status}
        </div>
      )}

      {results.summary && (
        <div style={{ marginBottom: "20px", padding: "12px", background: "#f9fafb", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
          <h3>📋 Summary</h3>
          <p><strong>Total categories:</strong> {results.summary.total}</p>
          <p><strong>✅ With featureId:</strong> {results.summary.hasFeatureId}</p>
          <p><strong>❌ Missing featureId:</strong> {results.summary.missingFeatureId}</p>
        </div>
      )}

      {results.withFeatureId && results.withFeatureId.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h3>✅ Categories WITH featureId</h3>
          <div style={{ maxHeight: "200px", overflow: "auto" }}>
            {results.withFeatureId.map(cat => (
              <div key={cat.id} style={{ padding: "8px", borderBottom: "1px solid #e5e7eb" }}>
                {cat.name} → {cat.featureId}
              </div>
            ))}
          </div>
        </div>
      )}

      {results.withoutFeatureId && results.withoutFeatureId.length > 0 && (
        <div style={{ marginBottom: "20px", background: "#fee2e2", padding: "12px", borderRadius: "6px" }}>
          <h3>❌ Categories WITHOUT featureId (Need Fix)</h3>
          <div style={{ maxHeight: "300px", overflow: "auto" }}>
            {results.withoutFeatureId.map(cat => (
              <div key={cat.id} style={{ padding: "10px", borderBottom: "1px solid #fecaca", background: "white", marginBottom: "8px", borderRadius: "4px" }}>
                <div><strong>{cat.name}</strong></div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {cat.status}
                  {cat.questionsCount !== undefined && ` (${cat.questionsCount} questions)`}
                  {cat.suggestedFeature && ` → Will be set to: ${cat.suggestedFeature}`}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                disabled={loading}
              />
              <span>I confirm to fix these {results.withoutFeatureId.length} categories</span>
            </label>
          </div>

          <button
            onClick={fixCategories}
            disabled={loading || !confirmed || results.withoutFeatureId.length === 0}
            style={{
              marginTop: "12px",
              padding: "10px 20px",
              fontSize: "14px",
              background: confirmed ? "#ef4444" : "#fca5a5",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: confirmed && !loading ? "pointer" : "not-allowed",
              opacity: confirmed && !loading ? 1 : 0.6
            }}
          >
            {loading ? "Fixing..." : "🔧 Fix All Missing featureIds"}
          </button>
        </div>
      )}

      {results.summary && results.summary.missingFeatureId === 0 && (
        <div style={{ padding: "12px", background: "#dcfce7", borderRadius: "6px", border: "1px solid #86efac" }}>
          ✅ All categories already have featureId! No fix needed.
        </div>
      )}
    </div>
  );
}
