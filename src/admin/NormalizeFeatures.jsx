/**
 * NormalizeFeatures.jsx
 * Admin utility to normalize all features in Firestore
 * Ensures consistent structure and lowercase IDs across all features
 */

import React, { useState } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import AdminLayout from "./AdminLayout";

function NormalizeFeatures() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const normalizeFeatures = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      console.log("\n🔧 NORMALIZING ALL FEATURES\n");

      const featuresSnap = await getDocs(collection(db, "features"));
      console.log(`Found ${featuresSnap.size} features to normalize\n`);

      const normalized = [];
      let updates = 0;
      let deletes = 0;

      for (const docSnap of featuresSnap.docs) {
        const data = docSnap.data();
        const oldId = docSnap.id;

        console.log(`Processing: ${oldId}`);

        // Determine the correct feature ID
        let correctId = data.id || data.featureName || data.name || oldId;
        correctId = (correctId || "").toLowerCase().trim();

        // Build normalized feature object with all required fields
        const normalizedFeature = {
          id: correctId,
          name: (data.name || "").toLowerCase().trim(),
          label: data.label || "",
          displayName: data.displayName || "",
          description: data.description || "",
          icon: data.icon || "",
          featureType: data.featureType || data.type || "",
          type: data.type || data.featureType || "",
          enabled: data.enabled !== false,
          isPublished: data.isPublished !== false,
          order: typeof data.order === "number" ? data.order : 999,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        console.log(`  Old ID: ${oldId}`);
        console.log(`  New ID: ${correctId}`);
        console.log(`  Name: ${normalizedFeature.name}`);
        console.log(`  Order: ${normalizedFeature.order}`);

        // If document ID needs to change, delete old and create new
        if (oldId !== correctId) {
          console.log(`  ⚠️  Document ID mismatch - will delete and recreate\n`);

          // Create new document with correct ID
          await setDoc(doc(db, "features", correctId), normalizedFeature);
          console.log(`  ✅ Created new document: ${correctId}`);

          // Delete old document
          await deleteDoc(doc(db, "features", oldId));
          console.log(`  ✅ Deleted old document: ${oldId}`);
          deletes++;
        } else {
          // Just update the document to normalize fields
          await setDoc(doc(db, "features", correctId), normalizedFeature, { merge: true });
          console.log(`  ✅ Updated document: ${correctId}\n`);
        }

        updates++;
        normalized.push({
          id: correctId,
          name: normalizedFeature.name,
          label: normalizedFeature.label,
          order: normalizedFeature.order,
          isPublished: normalizedFeature.isPublished,
        });
      }

      // Verify final state
      console.log("\n📋 FINAL STATE:\n");
      const finalSnap = await getDocs(collection(db, "features"));
      const finalList = [];
      finalSnap.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}`);
        console.log(`  id: ${data.id}`);
        console.log(`  name: ${data.name}`);
        console.log(`  label: ${data.label}`);
        console.log(`  order: ${data.order}`);
        console.log(`  isPublished: ${data.isPublished}\n`);
        finalList.push({
          docId: doc.id,
          id: data.id,
          name: data.name,
          label: data.label,
        });
      });

      setResult({
        success: true,
        updated: updates,
        deleted: deletes,
        features: finalList,
      });
    } catch (err) {
      console.error("❌ Normalization error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: "20px", fontFamily: "monospace" }}>
        <h2>🔧 Normalize All Features</h2>
        <p>
          This utility will normalize all features in Firestore to ensure:
        </p>
        <ul>
          <li>✅ All document IDs are lowercase</li>
          <li>✅ All name fields are lowercase</li>
          <li>✅ All features have required fields (id, name, label, order, etc.)</li>
          <li>✅ Consistent structure across all features</li>
        </ul>

        <button
          onClick={normalizeFeatures}
          disabled={loading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: loading ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Normalizing..." : "Start Normalization"}
        </button>

        {error && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#ffcccc",
              border: "1px solid #ff0000",
              borderRadius: "4px",
              color: "#cc0000",
            }}
          >
            <strong>❌ Error:</strong> {error}
          </div>
        )}

        {result && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#ccffcc",
              border: "1px solid #00cc00",
              borderRadius: "4px",
              color: "#006600",
            }}
          >
            <h3>✅ Normalization Complete!</h3>
            <p>Updated: {result.updated} documents</p>
            <p>Deleted: {result.deleted} documents</p>
            <h4>Final Features:</h4>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid #006600" }}>
                  <th style={{ padding: "8px", textAlign: "left" }}>Doc ID</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>id Field</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>Label</th>
                </tr>
              </thead>
              <tbody>
                {result.features.map((feature, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: "1px solid #ccffcc",
                      backgroundColor: idx % 2 === 0 ? "#f0fff0" : "white",
                    }}
                  >
                    <td style={{ padding: "8px" }}>
                      <code>{feature.docId}</code>
                    </td>
                    <td style={{ padding: "8px" }}>
                      <code>{feature.id}</code>
                    </td>
                    <td style={{ padding: "8px" }}>{feature.name}</td>
                    <td style={{ padding: "8px" }}>{feature.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default NormalizeFeatures;
