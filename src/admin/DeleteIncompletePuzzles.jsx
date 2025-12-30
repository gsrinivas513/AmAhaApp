// src/admin/DeleteIncompleteP uzzles.jsx
// Delete puzzles with missing required data based on their type

import React, { useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const PUZZLE_TYPE_REQUIREMENTS = {
  "find-pair": ["cards"],
  "picture-word": ["items"],
  "spot-difference": ["originalImage", "modifiedImage"],
  "picture-shadow": ["originalImage", "shadowImage"],
  "ordering": ["items", "correctOrder"]
};

export default function DeleteIncompletePuzzles() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const analyzePuzzles = async () => {
    setLoading(true);
    setStatus("🔍 Finding incomplete puzzles...");

    try {
      const puzzleSnap = await getDocs(collection(db, "puzzles"));
      const puzzles = puzzleSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const incomplete = [];

      for (const puzzle of puzzles) {
        const type = puzzle.type;
        if (!type || !PUZZLE_TYPE_REQUIREMENTS[type]) {
          continue;
        }

        const requirements = PUZZLE_TYPE_REQUIREMENTS[type];
        const missingFields = [];

        for (const field of requirements) {
          if (!puzzle.data || !puzzle.data[field] || (Array.isArray(puzzle.data[field]) && puzzle.data[field].length === 0)) {
            missingFields.push(field);
          }
        }

        if (missingFields.length > 0) {
          incomplete.push({
            id: puzzle.id,
            title: puzzle.title || puzzle.name || "Unknown",
            type: type,
            category: puzzle.category || puzzle.categoryName || "Unknown",
            missingFields: missingFields,
            fullData: puzzle
          });
        }
      }

      setAnalysis({
        total: puzzles.length,
        incomplete: incomplete.length,
        incompletePuzzles: incomplete
      });

      setStatus(`Found ${puzzles.length} total puzzles: ${incomplete.length} incomplete (missing data)`);

    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteIncompletePuzzles = async () => {
    if (!confirmed) {
      setStatus("⚠️ Check the confirmation checkbox first!");
      return;
    }

    setLoading(true);
    setStatus("🗑️ Deleting incomplete puzzles...");

    try {
      let deleted = 0;
      let failed = 0;

      for (const puzzle of analysis.incompletePuzzles) {
        try {
          await deleteDoc(doc(db, "puzzles", puzzle.id));
          console.log(`🗑️ Deleted: "${puzzle.title}" (type: ${puzzle.type})`);
          deleted++;
        } catch (error) {
          console.error(`❌ Failed to delete ${puzzle.title}:`, error);
          failed++;
        }
      }

      setStatus(`✅ Deleted ${deleted} incomplete puzzles${failed > 0 ? ` (${failed} failed)` : ""}`);
      setConfirmed(false);

      setTimeout(() => {
        analyzePuzzles();
      }, 2000);

    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
      }}>
        <h1>🗑️ Delete Incomplete Puzzles</h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          This tool identifies and deletes puzzles that are missing required data fields based on their type.
          <br />
          <strong>⚠️ This action is permanent and cannot be undone.</strong>
        </p>

        <div style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap"
        }}>
          <button
            onClick={analyzePuzzles}
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? "Analyzing..." : "🔍 Analyze Puzzles"}
          </button>

          {analysis && analysis.incomplete > 0 && (
            <button
              onClick={deleteIncompletePuzzles}
              disabled={loading || !confirmed}
              style={{
                padding: "10px 20px",
                backgroundColor: confirmed ? "#dc2626" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: loading || !confirmed ? "not-allowed" : "pointer",
                fontSize: "1rem",
                fontWeight: "bold"
              }}
            >
              {loading ? "Deleting..." : "🗑️ Delete All Incomplete"}
            </button>
          )}
        </div>

        {status && (
          <div style={{
            padding: "1rem",
            backgroundColor: "#f0f4ff",
            border: "2px solid #667eea",
            borderRadius: "8px",
            marginBottom: "2rem",
            fontSize: "1.1rem"
          }}>
            {status}
          </div>
        )}

        {analysis && (
          <div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
              marginBottom: "2rem"
            }}>
              <div style={{
                padding: "1rem",
                backgroundColor: "#e8f5e9",
                borderRadius: "8px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#4caf50" }}>
                  {analysis.total}
                </div>
                <div style={{ color: "#666" }}>Total Puzzles</div>
              </div>

              <div style={{
                padding: "1rem",
                backgroundColor: "#ffebee",
                borderRadius: "8px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#c62828" }}>
                  {analysis.incomplete}
                </div>
                <div style={{ color: "#666" }}>Incomplete (To Delete)</div>
              </div>
            </div>

            {analysis.incomplete > 0 && (
              <div>
                <h2>Puzzles to Delete ({analysis.incomplete})</h2>
                <div style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  marginBottom: "1.5rem"
                }}>
                  <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.95rem"
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f5f5f5" }}>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>
                          Title
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>
                          Category
                        </th>
                        <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #ddd" }}>
                          Type
                        </th>
                        <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #ddd" }}>
                          Missing Fields
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.incompletePuzzles.map((puzzle, idx) => (
                        <tr
                          key={puzzle.id}
                          style={{
                            backgroundColor: idx % 2 === 0 ? "#fafafa" : "white",
                            borderBottom: "1px solid #eee"
                          }}
                        >
                          <td style={{ padding: "12px" }}>
                            <strong>{puzzle.title}</strong>
                            <div style={{ fontSize: "0.85rem", color: "#999" }}>{puzzle.id}</div>
                          </td>
                          <td style={{ padding: "12px", color: "#666" }}>{puzzle.category}</td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <span style={{
                              backgroundColor: "#e3f2fd",
                              color: "#1976d2",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontFamily: "monospace",
                              fontWeight: "bold"
                            }}>
                              {puzzle.type}
                            </span>
                          </td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", justifyContent: "center" }}>
                              {puzzle.missingFields.map(field => (
                                <span key={field} style={{
                                  backgroundColor: "#ffebee",
                                  color: "#c62828",
                                  padding: "2px 6px",
                                  borderRadius: "3px",
                                  fontSize: "0.85rem",
                                  fontFamily: "monospace"
                                }}>
                                  {field}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {analysis.incomplete > 0 && (
                  <div style={{
                    padding: "1.5rem",
                    backgroundColor: "#ffebee",
                    border: "3px solid #dc2626",
                    borderRadius: "8px",
                    marginBottom: "1rem"
                  }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                        style={{ width: "20px", height: "20px", cursor: "pointer" }}
                      />
                      <span style={{ fontSize: "1rem", fontWeight: "bold", color: "#dc2626" }}>
                        ⚠️ I understand this will permanently delete {analysis.incomplete} puzzle(s)
                      </span>
                    </label>
                  </div>
                )}
              </div>
            )}

            {analysis.incomplete === 0 && (
              <div style={{
                padding: "1.5rem",
                backgroundColor: "#e8f5e9",
                border: "2px solid #4caf50",
                borderRadius: "8px",
                textAlign: "center",
                fontSize: "1.1rem",
                color: "#2e7d32",
                fontWeight: "bold"
              }}>
                ✅ All puzzles have complete data! Nothing to delete.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
