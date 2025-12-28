// src/admin/StandardizeFeaturesCollection.jsx
// Fix inconsistent feature document IDs and id fields

import React, { useState } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { DEFAULT_FEATURES } from "../constants/FEATURES";

export default function StandardizeFeaturesCollection() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const analyzeFeatures = async () => {
    setLoading(true);
    setStatus("🔍 Analyzing features collection...");

    try {
      const featSnap = await getDocs(collection(db, "features"));
      const firestoreFeatures = featSnap.docs.map(d => ({ docId: d.id, ...d.data() }));

      console.log("🔥 Current Firestore Features:", firestoreFeatures);
      console.log("📋 DEFAULT_FEATURES:", DEFAULT_FEATURES);

      // Check each DEFAULT_FEATURE
      const issues = [];
      const fixes = [];

      for (const defaultFeat of DEFAULT_FEATURES) {
        console.log(`\n🔍 Checking ${defaultFeat.label}...`);

        // Find matching feature in Firestore
        const existing = firestoreFeatures.find(f => 
          f.featureType === defaultFeat.type || 
          f.type === defaultFeat.type ||
          f.label === defaultFeat.label
        );

        if (existing) {
          console.log(`  Found: docId=${existing.docId}, id=${existing.id}`);

          // Check for issues
          if (existing.docId !== defaultFeat.id) {
            issues.push({
              feature: defaultFeat.label,
              issue: `Document ID is "${existing.docId}", should be "${defaultFeat.id}"`,
              severity: "high"
            });
          }

          if (!existing.id || existing.id !== defaultFeat.id) {
            issues.push({
              feature: defaultFeat.label,
              issue: `Missing or wrong id field (has: "${existing.id}", should be: "${defaultFeat.id}")`,
              severity: "high"
            });
          }

          // Plan the fix
          fixes.push({
            feature: defaultFeat.label,
            currentDocId: existing.docId,
            targetDocId: defaultFeat.id,
            missingIdField: !existing.id || existing.id !== defaultFeat.id,
            currentData: existing
          });
        } else {
          issues.push({
            feature: defaultFeat.label,
            issue: "Feature not found in Firestore",
            severity: "critical"
          });
        }
      }

      setAnalysis({
        firestoreFeatures,
        defaultFeatures: DEFAULT_FEATURES,
        issues,
        fixes,
        totalIssues: issues.length
      });

      setStatus(
        issues.length === 0
          ? "✅ Features collection is already standardized!"
          : `⚠️ Found ${issues.length} issues in features collection`
      );

    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const standardizeFeatures = async () => {
    if (!confirmed) {
      setStatus("⚠️ Check the confirmation checkbox first!");
      return;
    }

    setLoading(true);
    setStatus("🔧 Standardizing features collection...");

    try {
      let fixed = 0;
      let errors = [];

      // For each feature that needs fixing
      for (const fix of analysis.fixes) {
        try {
          const currentData = fix.currentData;
          const docId = fix.currentDocId;
          const targetDocId = fix.targetDocId;

          // Determine the correct ID based on featureType
          let correctId = targetDocId;
          if (currentData.featureType === "quiz") correctId = "quizzes";
          else if (currentData.featureType === "puzzle") correctId = "puzzles";
          else if (currentData.featureType === "game") correctId = "games";
          else if (currentData.featureType === "story") correctId = "stories";

          // Prepare standardized data
          const standardizedData = {
            ...currentData,
            id: correctId,
            featureId: correctId,
            name: currentData.name || correctId,
            label: currentData.label || correctId.charAt(0).toUpperCase() + correctId.slice(1),
            icon: currentData.icon,
            enabled: currentData.enabled !== false,
            isPublished: currentData.isPublished !== false,
            featureType: currentData.featureType || currentData.type,
            type: currentData.type || currentData.featureType,
            order: currentData.order || 0,
            description: currentData.description,
            createdAt: currentData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          console.log(`🔧 Standardizing ${currentData.label}...`);
          console.log(`   Current docId: ${docId}`);
          console.log(`   Target docId: ${correctId}`);
          console.log(`   Setting id field: ${correctId}`);

          // If document ID matches target, just update the fields
          if (docId === correctId) {
            console.log(`✏️ Updating ${currentData.label} (docId stays: ${docId})`);
            await updateDoc(doc(db, "features", docId), standardizedData);
            fixed++;
          } else {
            // Need to create new doc with correct ID and delete old one
            console.log(`📍 Migrating ${currentData.label}: ${docId} → ${correctId}`);

            // Create new document with standardized ID
            await setDoc(doc(db, "features", correctId), standardizedData);
            console.log(`✅ Created: features/${correctId}`);

            // Delete old document
            await deleteDoc(doc(db, "features", docId));
            console.log(`🗑️ Deleted: features/${docId}`);

            fixed++;
          }

          console.log(`✅ Fixed: ${currentData.label}`);
        } catch (error) {
          console.error(`❌ Error fixing ${fix.feature}:`, error);
          errors.push({ feature: fix.feature, error: error.message });
        }
      }

      setStatus(`🎉 Complete! Fixed ${fixed} features. Errors: ${errors.length}`);
      setConfirmed(false);

      setTimeout(() => {
        setAnalysis(null);
        setStatus("");
      }, 2000);

    } catch (error) {
      setStatus(`❌ Fatal error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "system-ui" }}>
      <h1>🔧 Standardize Features Collection</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        This tool fixes inconsistent document IDs and missing id fields in the features collection.
        All features should have consistent naming and id fields.
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

      {analysis && (
        <>
          {/* Current Features */}
          <div style={{ marginTop: "20px" }}>
            <h3>📋 Current Features in Firestore</h3>
            <div style={{ background: "#f9fafb", padding: "12px", borderRadius: "6px", maxHeight: "250px", overflow: "auto" }}>
              {analysis.firestoreFeatures.map((feat, idx) => (
                <div key={idx} style={{ padding: "10px", borderBottom: "1px solid #e5e7eb", fontSize: "13px" }}>
                  <div><strong>Document ID:</strong> <code style={{ background: "#e5e7eb", padding: "2px 6px", borderRadius: "3px" }}>{feat.docId}</code></div>
                  <div><strong>id field:</strong> {feat.id ? <code style={{ background: "#e5e7eb", padding: "2px 6px", borderRadius: "3px" }}>{feat.id}</code> : <span style={{ color: "#dc2626" }}>❌ MISSING</span>}</div>
                  <div><strong>label:</strong> {feat.label}</div>
                  <div><strong>type:</strong> {feat.type || feat.featureType}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Issues */}
          {analysis.issues.length > 0 && (
            <div style={{ marginTop: "20px", background: "#fee2e2", padding: "12px", borderRadius: "6px" }}>
              <h3>⚠️ Issues Found ({analysis.issues.length})</h3>
              <div style={{ maxHeight: "200px", overflow: "auto" }}>
                {analysis.issues.map((issue, idx) => (
                  <div key={idx} style={{ padding: "10px", background: "white", marginBottom: "8px", borderRadius: "4px", border: "1px solid #fecaca" }}>
                    <div style={{ fontWeight: "500", color: "#991b1b" }}>{issue.feature}</div>
                    <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
                      {issue.issue} <span style={{ color: "#991b1b" }}>({issue.severity})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fixes to Apply */}
          {analysis.fixes.length > 0 && (
            <div style={{ marginTop: "20px", background: "#dcfce7", padding: "12px", borderRadius: "6px" }}>
              <h3>✅ Fixes to Apply ({analysis.fixes.length})</h3>
              <div style={{ maxHeight: "250px", overflow: "auto" }}>
                {analysis.fixes.map((fix, idx) => (
                  <div key={idx} style={{ padding: "10px", background: "white", marginBottom: "8px", borderRadius: "4px", border: "1px solid #86efac" }}>
                    <div style={{ fontWeight: "500" }}>{fix.feature}</div>
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "4px", fontFamily: "monospace" }}>
                      {fix.currentDocId !== fix.targetDocId ? (
                        <>
                          <div>Document ID: {fix.currentDocId} → {fix.targetDocId}</div>
                        </>
                      ) : (
                        <>
                          <div>Document ID: {fix.currentDocId} (no change)</div>
                        </>
                      )}
                      {fix.missingIdField && (
                        <div style={{ color: "#059669" }}>Add id field: {fix.targetDocId}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  disabled={loading}
                />
                <span>I confirm to standardize {analysis.fixes.length} features</span>
              </label>

              <button
                onClick={standardizeFeatures}
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
            </div>
          )}

          {analysis.issues.length === 0 && (
            <div style={{ marginTop: "20px", padding: "12px", background: "#dcfce7", borderRadius: "6px", border: "1px solid #86efac" }}>
              ✅ Features collection is already standardized! No fixes needed.
            </div>
          )}
        </>
      )}
    </div>
  );
}
