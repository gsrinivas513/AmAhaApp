/**
 * DebugCategories.jsx
 * Quick debug page to see what categories actually exist
 */

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import AdminLayout from "./AdminLayout";

function DebugCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log("[DebugCategories] Fetching all categories...");
        const snap = await getDocs(collection(db, "categories"));
        console.log(`[DebugCategories] Found ${snap.size} documents`);
        
        const cats = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setCategories(cats);
        
        // Log each category
        cats.forEach(cat => {
          console.log("Category:", {
            id: cat.id,
            name: cat.name,
            label: cat.label,
            featureId: cat.featureId,
            uiMode: cat.uiMode,
            isPublished: cat.isPublished,
          });
        });
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  return (
    <AdminLayout>
      <div>
        <h1>🔍 Debug: All Categories</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p><strong>Total Categories: {categories.length}</strong></p>
            
            <h2>Puzzle Categories (uiMode === "puzzle"):</h2>
            <pre style={{ background: "#f0f0f0", padding: "10px", overflow: "auto" }}>
              {JSON.stringify(
                categories.filter(c => c.uiMode === "puzzle"),
                null,
                2
              )}
            </pre>

            <h2>By featureId:</h2>
            <pre style={{ background: "#f0f0f0", padding: "10px", overflow: "auto" }}>
              {JSON.stringify(
                categories.reduce((acc, cat) => {
                  const key = cat.featureId || "no-featureId";
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(cat);
                  return acc;
                }, {}),
                null,
                2
              )}
            </pre>

            <h2>All Categories:</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #333" }}>
                  <th style={{ padding: "8px", textAlign: "left" }}>ID</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>featureId</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>uiMode</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>isPublished</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "8px" }}>{cat.id}</td>
                    <td style={{ padding: "8px" }}>{cat.name}</td>
                    <td style={{ padding: "8px" }}>{cat.featureId || "(empty)"}</td>
                    <td style={{ padding: "8px" }}>{cat.uiMode || "(empty)"}</td>
                    <td style={{ padding: "8px" }}>{String(cat.isPublished)}</td>
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

export default DebugCategories;
