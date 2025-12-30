// src/admin/FixQuizzesFeatureIdMismatch.jsx
// This fixes the mismatch between old feature document IDs and normalized feature IDs
// Categories have old document IDs like "UpNde0cmlHFDQXgTcQOJ"
// But features now use normalized IDs like "quizzes", "puzzles", etc.

import React, { useState } from "react";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { DEFAULT_FEATURES } from "../constants/FEATURES";

export default function FixQuizzesFeatureIdMismatch() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [results, setResults] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const analyzeFeatures = async () => {
    setLoading(true);
    setStatus("🔍 Analyzing features and categories...");
    setResults(null);

    try {
      // 1. Load all features from Firestore
      const featSnap = await getDocs(collection(db, "features"));
      const firestoreFeatures = featSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      console.log("🔥 Firestore Features:", firestoreFeatures);

      // Create a mapping of old document IDs to new normalized IDs
      const idMapping = {};
      
      // Map each Firestore feature to DEFAULT_FEATURES
      for (const ffeat of firestoreFeatures) {
        const featureType = ffeat.featureType || ffeat.type;
        const defaultFeat = DEFAULT_FEATURES.find(df => df.type === featureType);
        
        if (defaultFeat) {
          // Map old document ID to new normalized ID
          idMapping[ffeat.id] = defaultFeat.id;
          console.log(`📍 Mapping: ${ffeat.id} (${ffeat.label}) → ${defaultFeat.id}`);
        }
      }

      console.log("🗺️ ID Mapping:", idMapping);

      // 2. Load all categories
      const catSnap = await getDocs(collection(db, "categories"));
      const categories = catSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // 3. Find categories with mismatched featureIds
      const mismatchedCategories = [];
      
      for (const cat of categories) {
        const oldFeatureId = cat.featureId;
        const newFeatureId = idMapping[oldFeatureId];
        
        if (newFeatureId && newFeatureId !== oldFeatureId) {
          mismatchedCategories.push({
            id: cat.id,
            name: cat.name,
            oldFeatureId,
            newFeatureId,
            status: `Will update: ${oldFeatureId} → ${newFeatureId}`
          });
        } else if (!idMapping[oldFeatureId]) {
          mismatchedCategories.push({
            id: cat.id,
            name: cat.name,
            oldFeatureId,
            newFeatureId: null,
            status: `⚠️ Unknown feature ID (no mapping found)`
          });
        }
      }

      setResults({
        firestoreFeatures,
        idMapping,
        categories,
        mismatchedCategories,
        summary: {
          totalCategories: categories.length,
          mismatchedCount: mismatchedCategories.length,
          fixableCount: mismatchedCategories.filter(c => c.newFeatureId).length
        }
      });

      setStatus(
        mismatchedCategories.length === 0
          ? "✅ All categories have correct featureIds!"
          : `⚠️ Found ${mismatchedCategories.length} categories with mismatched featureIds`
      );

    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fixMismatchedIds = async () => {
    if (!confirmed) {
      setStatus("⚠️ Check the confirmation checkbox first!");
      return;
    }

    setLoading(true);
    setStatus("🔧 Fixing mismatched featureIds...");

    try {
      let fixed = 0;
      let failed = 0;

      for (const cat of results.mismatchedCategories) {
        if (!cat.newFeatureId) continue; // Skip unmappable ones

        try {
          await updateDoc(doc(db, "categories", cat.id), {
            featureId: cat.newFeatureId
          });
          console.log(`✅ Fixed: "${cat.name}" (${cat.oldFeatureId} → ${cat.newFeatureId})`);
          fixed++;
        } catch (error) {
          console.error(`❌ Failed to fix "${cat.name}":`, error);
          failed++;
        }
      }

      setStatus(`🎉 Complete! Fixed ${fixed} categories. Failed: ${failed}`);
      setConfirmed(false);
      
      // Reload after 2 seconds
      setTimeout(() => {
        setResults(null);
        setStatus("");
      }, 2000);

    } catch (error) {
      setStatus(`❌ Fatal error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "system-ui" }}>
      <h1>🔧 Fix Feature ID Mismatch</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Categories have old document IDs (e.g., "UpNde0cmlHFDQXgTcQOJ"), but features use normalized IDs (e.g., "quizzes").
        This tool fixes the mismatch.
      </p>

      <button
        onClick={analyzeFeatures}
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
        {loading ? "Analyzing..." : "🔍 Analyze"}
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

      {results && (
        <>
          {/* Summary */}
          <div style={{ marginTop: "20px", padding: "12px", background: "#f9fafb", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
            <h3>📋 Summary</h3>
            <p><strong>Total categories:</strong> {results.summary.totalCategories}</p>
            <p><strong>Mismatched:</strong> {results.summary.mismatchedCount}</p>
            <p><strong>Fixable:</strong> {results.summary.fixableCount}</p>
          </div>

          {/* ID Mapping */}
          <div style={{ marginTop: "20px" }}>
            <h3>🗺️ Feature ID Mapping</h3>
            <div style={{ background: "#f9fafb", padding: "12px", borderRadius: "6px", maxHeight: "200px", overflow: "auto" }}>
              {Object.entries(results.idMapping).map(([oldId, newId]) => (
                <div key={oldId} style={{ padding: "8px", borderBottom: "1px solid #e5e7eb", fontSize: "13px", fontFamily: "monospace" }}>
                  <span style={{ color: "#666" }}>{oldId}</span> → <span style={{ color: "#059669", fontWeight: "500" }}>{newId}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mismatched Categories */}
          {results.mismatchedCategories.length > 0 && (
            <div style={{ marginTop: "20px", background: "#fee2e2", padding: "12px", borderRadius: "6px" }}>
              <h3>⚠️ Mismatched Categories ({results.mismatchedCategories.length})</h3>
              <div style={{ maxHeight: "300px", overflow: "auto" }}>
                {results.mismatchedCategories.map(cat => (
                  <div key={cat.id} style={{ padding: "10px", background: "white", marginBottom: "8px", borderRadius: "4px", border: "1px solid #fecaca" }}>
                    <div style={{ fontWeight: "500" }}>{cat.name}</div>
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "4px", fontFamily: "monospace" }}>
                      {cat.oldFeatureId} → {cat.newFeatureId || "❌ Unknown"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#059669", marginTop: "2px" }}>
                      {cat.status}
                    </div>
                  </div>
                ))}
              </div>

              {results.summary.fixableCount > 0 && (
                <>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      disabled={loading}
                    />
                    <span>I confirm to fix {results.summary.fixableCount} categories</span>
                  </label>

                  <button
                    onClick={fixMismatchedIds}
                    disabled={loading || !confirmed}
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
                    {loading ? "Fixing..." : "🔧 Fix All"}
                  </button>
                </>
              )}
            </div>
          )}

          {results.mismatchedCategories.length === 0 && (
            <div style={{ marginTop: "20px", padding: "12px", background: "#dcfce7", borderRadius: "6px", border: "1px solid #86efac" }}>
              ✅ All categories have correct featureIds! No fix needed.
            </div>
          )}
        </>
      )}
    </div>
  );
}
