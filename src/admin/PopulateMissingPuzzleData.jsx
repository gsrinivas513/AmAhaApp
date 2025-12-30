// src/admin/PopulateMissingPuzzleData.jsx
// Populate missing data for puzzles based on their type

import React, { useState } from "react";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const PUZZLE_TYPE_REQUIREMENTS = {
  "find-pair": ["cards"],
  "picture-word": ["items"],
  "spot-difference": ["originalImage", "modifiedImage"],
  "picture-shadow": ["originalImage", "shadowImage"],
  "ordering": ["items", "correctOrder"]
};

export default function PopulateMissingPuzzleData() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [selectedPuzzles, setSelectedPuzzles] = useState(new Set());

  const analyzePuzzles = async () => {
    setLoading(true);
    setStatus("🔍 Analyzing puzzle data...");

    try {
      const puzzleSnap = await getDocs(collection(db, "puzzles"));
      const puzzles = puzzleSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const incomplete = [];
      const complete = [];

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
        } else {
          complete.push(puzzle);
        }
      }

      setAnalysis({
        total: puzzles.length,
        complete: complete.length,
        incomplete: incomplete.length,
        incompletePuzzles: incomplete
      });

      setStatus(`Found ${puzzles.length} puzzles: ${complete.length} complete, ${incomplete.length} incomplete`);

    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const togglePuzzleSelection = (puzzleId) => {
    const newSelected = new Set(selectedPuzzles);
    if (newSelected.has(puzzleId)) {
      newSelected.delete(puzzleId);
    } else {
      newSelected.add(puzzleId);
    }
    setSelectedPuzzles(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedPuzzles.size === analysis.incompletePuzzles.length) {
      setSelectedPuzzles(new Set());
    } else {
      const newSelected = new Set(analysis.incompletePuzzles.map(p => p.id));
      setSelectedPuzzles(newSelected);
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
        <h1>📊 Analyze Puzzle Data Completeness</h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          This tool identifies puzzles that are missing required data fields based on their type.
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
              gridTemplateColumns: "repeat(3, 1fr)",
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
                backgroundColor: "#e3f2fd",
                borderRadius: "8px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#2196f3" }}>
                  {analysis.complete}
                </div>
                <div style={{ color: "#666" }}>Complete</div>
              </div>

              <div style={{
                padding: "1rem",
                backgroundColor: "#fff3e0",
                borderRadius: "8px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff9500" }}>
                  {analysis.incomplete}
                </div>
                <div style={{ color: "#666" }}>Incomplete</div>
              </div>
            </div>

            {analysis.incomplete > 0 && (
              <div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px"
                }}>
                  <input
                    type="checkbox"
                    checked={selectedPuzzles.size === analysis.incompletePuzzles.length && analysis.incompletePuzzles.length > 0}
                    onChange={toggleAllSelection}
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  />
                  <label style={{ cursor: "pointer", fontWeight: "bold" }}>
                    Select All ({selectedPuzzles.size}/{analysis.incompletePuzzles.length})
                  </label>
                </div>

                <h2>Puzzles with Missing Data ({analysis.incomplete})</h2>
                <div style={{
                  maxHeight: "500px",
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
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd", width: "30px" }}>
                          Select
                        </th>
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
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={selectedPuzzles.has(puzzle.id)}
                              onChange={() => togglePuzzleSelection(puzzle.id)}
                              style={{ width: "18px", height: "18px", cursor: "pointer" }}
                            />
                          </td>
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

                <div style={{
                  padding: "1.5rem",
                  backgroundColor: "#fff3cd",
                  border: "2px solid #ff9500",
                  borderRadius: "8px",
                  marginBottom: "1rem"
                }}>
                  <h3 style={{ marginTop: 0 }}>⚠️ About Missing Data</h3>
                  <p style={{ marginBottom: "1rem" }}>
                    Puzzles with missing required fields won't display correctly. To fix them:
                  </p>
                  <ul style={{ marginBottom: 0, paddingLeft: "1.5rem" }}>
                    <li><strong>Find Pairs (find-pair):</strong> Need to have a <code>cards</code> array with image pairs</li>
                    <li><strong>Picture-Word:</strong> Need <code>items</code> array with images and words</li>
                    <li><strong>Spot Difference:</strong> Need <code>originalImage</code> and <code>modifiedImage</code></li>
                    <li><strong>Picture Shadow:</strong> Need <code>originalImage</code> and <code>shadowImage</code></li>
                    <li><strong>Ordering:</strong> Need <code>items</code> array and <code>correctOrder</code> array</li>
                  </ul>
                </div>

                <div style={{
                  padding: "1rem",
                  backgroundColor: "#e3f2fd",
                  borderRadius: "8px",
                  textAlign: "center"
                }}>
                  <p style={{ margin: 0, fontWeight: "bold", color: "#1976d2" }}>
                    ℹ️ You can edit these puzzles individually via the admin panel to add the required data.
                  </p>
                </div>
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
                ✅ All puzzles have complete data! No issues found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
