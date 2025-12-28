import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { Card, Button } from "../components/ui";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function CleanupDuplicateFeatures() {
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState([]);
  const [cleaning, setCleaning] = useState(false);

  const addProgress = (message) => {
    setProgress(prev => [...prev, message]);
    console.log(message);
  };

  const cleanupDuplicates = async () => {
    if (!window.confirm("This will remove duplicate features. Continue?")) return;
    
    setCleaning(true);
    setProgress([]);
    
    try {
      setStatus("🔍 Scanning for duplicate features...");
      addProgress("🔍 Scanning for duplicate features...");

      const featSnap = await getDocs(collection(db, "features"));
      const features = featSnap.docs.map(d => ({ 
        docId: d.id, 
        ...d.data() 
      }));

      addProgress(`📊 Found ${features.length} total features`);
      
      // Group features by featureType or type
      const featureMap = {};
      const duplicates = [];

      for (const feat of features) {
        const key = feat.featureType || feat.type || feat.id;
        if (featureMap[key]) {
          duplicates.push({
            original: featureMap[key],
            duplicate: feat
          });
          addProgress(`⚠️ Found duplicate: ${key}`);
        } else {
          featureMap[key] = feat;
        }
      }

      if (duplicates.length === 0) {
        addProgress("✅ No duplicates found!");
        setStatus("✅ No duplicates found!");
        setCleaning(false);
        return;
      }

      addProgress(`\n🗑️ Removing ${duplicates.length} duplicates...`);
      setStatus(`🗑️ Removing ${duplicates.length} duplicates...`);

      for (const { duplicate } of duplicates) {
        await deleteDoc(doc(db, "features", duplicate.docId));
        addProgress(`✅ Deleted duplicate: ${duplicate.name || duplicate.label || duplicate.id}`);
      }

      addProgress(`\n✅ Cleanup complete! Removed ${duplicates.length} duplicate feature(s)`);
      setStatus(`✅ Cleanup complete! Removed ${duplicates.length} duplicate(s)`);
    } catch (err) {
      console.error("Error:", err);
      addProgress(`❌ Error: ${err.message}`);
      setStatus(`❌ Error: ${err.message}`);
    } finally {
      setCleaning(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: 20 }}>
        <h1>🧹 Cleanup Duplicate Features</h1>
        
        <Card style={{ padding: 20, marginBottom: 20 }}>
          <p>This utility will identify and remove duplicate features from the database.</p>
          <p style={{ color: "#dc2626" }}>
            ⚠️ <strong>Warning:</strong> This action will delete duplicate features. Make sure you have a backup!
          </p>
          
          <Button
            onClick={cleanupDuplicates}
            disabled={cleaning}
            style={{
              padding: "10px 20px",
              fontSize: 14,
              background: cleaning ? "#cbd5e1" : "#dc2626",
              color: "white",
              cursor: cleaning ? "not-allowed" : "pointer"
            }}
          >
            {cleaning ? "⏳ Running..." : "🗑️ Run Cleanup"}
          </Button>
        </Card>

        {status && (
          <Card style={{ padding: 15, marginBottom: 20, background: "#f1f5f9" }}>
            <h3 style={{ margin: 0, marginBottom: 10 }}>Status</h3>
            <p style={{ margin: 0, fontSize: 14, color: "#334155" }}>{status}</p>
          </Card>
        )}

        {progress.length > 0 && (
          <Card style={{ padding: 15, background: "#1e293b", color: "#e2e8f0" }}>
            <h3 style={{ margin: 0, marginBottom: 10, color: "#fbbf24" }}>Progress Log</h3>
            <div style={{ 
              fontFamily: "monospace", 
              fontSize: 12,
              maxHeight: 400,
              overflowY: "auto",
              padding: 10,
              background: "#0f172a",
              borderRadius: 4
            }}>
              {progress.map((msg, idx) => (
                <div key={idx} style={{ marginBottom: 4, whiteSpace: "pre-wrap" }}>
                  {msg}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
