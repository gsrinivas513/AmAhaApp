// src/admin/DocumentDeletePage.jsx
import React, { useState } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import AdminLayout from "./AdminLayout";
import { Card, Button, Input } from "../components/ui";

export default function DocumentDeletePage() {
  const [deleteCollection, setDeleteCollection] = useState("puzzles");
  const [deleteField, setDeleteField] = useState("type");
  const [deleteValue, setDeleteValue] = useState("puzzle");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [foundDocuments, setFoundDocuments] = useState([]);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [searching, setSearching] = useState(false);

  const addProgress = (message) => {
    setProgress(prev => [...prev, message]);
  };

  const searchDocuments = async () => {
    if (!deleteField || !deleteValue) {
      setStatus("⚠️ Please fill in both field name and value");
      return;
    }

    try {
      setSearching(true);
      setStatus("🔍 Searching for documents...");
      setProgress([]);
      setFoundDocuments([]);

      const q = query(
        collection(db, deleteCollection),
        where(deleteField, "==", deleteValue)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        setStatus(`⚠️ No documents found with ${deleteField} = "${deleteValue}"`);
        addProgress(`\nSearch completed - no matches found in ${deleteCollection}`);
        return;
      }

      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setFoundDocuments(docs);

      addProgress(`\n✅ Found ${docs.length} document(s) in ${deleteCollection}:`);
      addProgress("─".repeat(70));
      
      docs.forEach((d, idx) => {
        addProgress(`\n${idx + 1}. Document ID: ${d.id}`);
        addProgress(`   Field: ${deleteField} = "${deleteValue}"`);
        Object.entries(d).forEach(([key, val]) => {
          if (key !== deleteField) {
            const displayVal = typeof val === 'object' ? JSON.stringify(val).substring(0, 100) : String(val).substring(0, 100);
            addProgress(`   - ${key}: ${displayVal}`);
          }
        });
      });

      setStatus(`✅ Found ${docs.length} matching document(s). Review below before deleting.`);
    } catch (err) {
      console.error("❌ Error:", err);
      setStatus(`❌ Search failed: ${err.message}`);
      addProgress(`\n❌ Error: ${err.message}`);
    } finally {
      setSearching(false);
    }
  };

  const deleteAllFound = async () => {
    if (deleteConfirm !== "DELETE ALL") {
      setStatus('⚠️ Type "DELETE ALL" exactly to confirm');
      return;
    }

    if (foundDocuments.length === 0) {
      setStatus("⚠️ No documents to delete");
      return;
    }

    try {
      setDeleting(true);
      setStatus("🗑️ Deleting documents...");
      setProgress([]);

      addProgress(`\n🗑️ Starting deletion of ${foundDocuments.length} document(s)...`);
      addProgress("─".repeat(70));

      let deleted = 0;
      for (const doc_ of foundDocuments) {
        try {
          await deleteDoc(doc(db, deleteCollection, doc_.id));
          deleted++;
          addProgress(`✅ [${deleted}/${foundDocuments.length}] Deleted: ${doc_.id}`);
        } catch (err) {
          addProgress(`❌ Failed to delete ${doc_.id}: ${err.message}`);
        }
      }

      addProgress(`\n🎉 Successfully deleted ${deleted} document(s)!`);
      setStatus(`✅ Success! Deleted ${deleted}/${foundDocuments.length} document(s)`);
      setDeleteConfirm("");
      setFoundDocuments([]);
    } catch (err) {
      console.error("❌ Error:", err);
      setStatus(`❌ Deletion failed: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const deleteSingleDocument = async (docId) => {
    if (!window.confirm(`⚠️ Delete document: ${docId}?`)) {
      return;
    }

    try {
      setDeleting(true);
      setStatus(`🗑️ Deleting ${docId}...`);
      
      await deleteDoc(doc(db, deleteCollection, docId));
      
      setFoundDocuments(prev => prev.filter(d => d.id !== docId));
      setStatus(`✅ Document deleted: ${docId}`);
    } catch (err) {
      console.error("❌ Error:", err);
      setStatus(`❌ Failed to delete: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          color: "white"
        }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, marginBottom: 8 }}>
            🗑️ Delete Documents
          </h1>
          <p style={{ margin: 0, opacity: 0.95, fontSize: 16 }}>
            Find and delete duplicate or unwanted documents from Firestore collections
          </p>
        </div>

        {/* Warning */}
        <div style={{
          background: "#fef2f2",
          border: "2px solid #ef4444",
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
          color: "#991b1b"
        }}>
          <strong>⚠️ Warning:</strong> Deletion is permanent and cannot be undone. Always review documents before deleting!
        </div>

        {/* Search Section */}
        <Card style={{ marginBottom: 24, padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 0 }}>🔍 Step 1: Find Documents</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "#374151" }}>
                Collection
              </label>
              <select
                value={deleteCollection}
                onChange={(e) => setDeleteCollection(e.target.value)}
                disabled={searching || deleting}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  fontSize: 14,
                  cursor: searching || deleting ? "not-allowed" : "pointer",
                }}
              >
                <option value="puzzles">🧩 Puzzles</option>
                <option value="categories">📁 Categories</option>
                <option value="topics">📋 Topics</option>
                <option value="subtopics">📖 SubTopics</option>
                <option value="features">✨ Features</option>
                <option value="questions">❓ Questions</option>
                <option value="users">👤 Users</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "#374151" }}>
                Field Name (e.g., type, name, id)
              </label>
              <input
                type="text"
                value={deleteField}
                onChange={(e) => setDeleteField(e.target.value)}
                disabled={searching || deleting}
                placeholder="e.g., type"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  fontSize: 14,
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "#374151" }}>
                Field Value (e.g., "puzzle", "animals")
              </label>
              <input
                type="text"
                value={deleteValue}
                onChange={(e) => setDeleteValue(e.target.value)}
                disabled={searching || deleting}
                placeholder='e.g., "puzzle"'
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  fontSize: 14,
                }}
              />
            </div>
          </div>

          <button
            onClick={searchDocuments}
            disabled={searching || deleting}
            style={{
              padding: "10px 24px",
              background: searching ? "#9ca3af" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: searching || deleting ? "not-allowed" : "pointer",
            }}
          >
            {searching ? "⏳ Searching..." : "🔍 Search Documents"}
          </button>
        </Card>

        {/* Status */}
        {status && (
          <div style={{
            padding: 16,
            background: status.includes("❌") ? "#fee2e2" : status.includes("✅") ? "#d1fae5" : status.includes("⚠️") ? "#fef3c7" : "#dbeafe",
            color: status.includes("❌") ? "#991b1b" : status.includes("✅") ? "#065f46" : status.includes("⚠️") ? "#92400e" : "#1e40af",
            borderRadius: 6,
            marginBottom: 16,
            fontWeight: 500,
          }}>
            {status}
          </div>
        )}

        {/* Found Documents */}
        {foundDocuments.length > 0 && (
          <Card style={{ marginBottom: 24, padding: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 0, color: "#dc2626" }}>
              📋 Step 2: Review Found Documents ({foundDocuments.length})
            </h2>

            <div style={{ maxHeight: 400, overflowY: "auto", marginBottom: 16 }}>
              {foundDocuments.map((doc_, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    padding: 12,
                    marginBottom: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: "#1f2937", marginBottom: 4 }}>
                      {idx + 1}. {doc_.id}
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      {Object.entries(doc_)
                        .filter(([k]) => k !== deleteField)
                        .slice(0, 3)
                        .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v).substring(0, 50) : String(v).substring(0, 50)}`)
                        .join(" • ")}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSingleDocument(doc_.id)}
                    disabled={deleting}
                    style={{
                      padding: "6px 12px",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: deleting ? "not-allowed" : "pointer",
                      whiteSpace: "nowrap",
                      marginLeft: 8,
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>

            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 6,
              padding: 16,
              marginBottom: 16
            }}>
              <p style={{ margin: "0 0 12px 0", fontWeight: 600, color: "#991b1b" }}>
                🗑️ Step 3: Delete All {foundDocuments.length} Documents
              </p>
              <p style={{ margin: "0 0 12px 0", fontSize: 14, color: "#7f1d1d" }}>
                Type <code style={{ background: "#fee2e2", padding: "2px 6px" }}>DELETE ALL</code> below to confirm deletion:
              </p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                disabled={deleting}
                placeholder='Type "DELETE ALL" to confirm'
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "2px solid #fecaca",
                  fontSize: 14,
                  marginBottom: 12,
                  fontWeight: 500,
                }}
              />
              <button
                onClick={deleteAllFound}
                disabled={deleting}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: deleting ? "#9ca3af" : "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: deleting ? "not-allowed" : "pointer",
                }}
              >
                {deleting ? "⏳ Deleting..." : `🗑️ Delete All ${foundDocuments.length} Documents`}
              </button>
            </div>
          </Card>
        )}

        {/* Progress Log */}
        {progress.length > 0 && (
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 0, color: "#6b7280" }}>
              📝 Progress Log
            </h3>
            <div style={{
              background: "#1f2937",
              borderRadius: 6,
              padding: 16,
              maxHeight: 300,
              overflowY: "auto"
            }}>
              {progress.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    color: msg.includes("✅") ? "#10b981" : msg.includes("❌") ? "#ef4444" : "#d1d5db",
                    fontSize: 13,
                    fontFamily: "monospace",
                    marginBottom: 4,
                    whiteSpace: "pre-wrap"
                  }}
                >
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
