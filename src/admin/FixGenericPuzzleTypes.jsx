// src/admin/FixGenericPuzzleTypes.jsx
// Fix puzzles with generic type: "puzzle" -> assign proper types

import React, { useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const VALID_PUZZLE_TYPES = ["find-pair", "picture-word", "spot-difference", "picture-shadow", "ordering"];

// Map category/title patterns to puzzle types
const TYPE_MAPPING = {
  "find-pair": ["find pair", "find pairs", "match pairs", "pair matching"],
  "picture-word": ["picture-word", "picture word", "word match", "image word"],
  "spot-difference": ["spot difference", "spot the difference", "find difference", "differences"],
  "picture-shadow": ["shadow", "shadow match", "picture shadow", "find shadow"],
  "ordering": ["order", "sequence", "numbers", "arrangement", "arrange"]
};

export default function FixGenericPuzzleTypes() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  // Guess puzzle type based on category or title
  const guessPuzzleType = (puzzle) => {
    const category = (puzzle.category || puzzle.categoryName || "").toLowerCase();
    const title = (puzzle.title || puzzle.name || "").toLowerCase();
    const subtopic = (puzzle.subtopic || puzzle.subtopicName || "").toLowerCase();
    const searchText = `${category} ${title} ${subtopic}`;

    for (const [type, keywords] of Object.entries(TYPE_MAPPING)) {
      for (const keyword of keywords) {
        if (searchText.includes(keyword)) {
          return type;
        }
      }
    }

    // Default fallback
    return "find-pair"; // Most common type
  };

  const analyzePuzzles = async () => {
    setLoading(true);
    setStatus("🔍 Analyzing puzzles with generic type...");

    try {
      const puzzleSnap = await getDocs(collection(db, "puzzles"));
      const puzzles = puzzleSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const generic = [];
      const valid = [];

      for (const puzzle of puzzles) {
        if (puzzle.type === "puzzle" || puzzle.type === "" || !puzzle.type) {
          const suggestedType = guessPuzzleType(puzzle);
          generic.push({
            id: puzzle.id,
            title: puzzle.title || puzzle.name || "Unknown",
            category: puzzle.category || puzzle.categoryName || "Unknown",
            currentType: puzzle.type || "MISSING",
            suggestedType: suggestedType,
            fullData: puzzle
          });
        } else if (VALID_PUZZLE_TYPES.includes(puzzle.type)) {
          valid.push(puzzle);
        }
      }

      setAnalysis({
        total: puzzles.length,
        valid: valid.length,
        generic: generic.length,
        genericPuzzles: generic
      });

      setStatus(`Found ${puzzles.length} puzzles: ${valid.length} valid, ${generic.length} with generic type`);

    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fixGenericTypes = async () => {
    if (!confirmed) {
      setStatus("⚠️ Check the confirmation checkbox first!");
      return;
    }

    setLoading(true);
    setStatus("🔄 Fixing puzzle types...");

    try {
      let fixed = 0;
      let failed = 0;

      for (const puzzle of analysis.genericPuzzles) {
        try {
          await updateDoc(doc(db, "puzzles", puzzle.id), {
            type: puzzle.suggestedType
          });
          console.log(`✅ Fixed: "${puzzle.title}" → type: "${puzzle.suggestedType}"`);
          fixed++;
        } catch (error) {
          console.error(`❌ Failed to fix ${puzzle.title}:`, error);
          failed++;
        }
      }

      setStatus(`✅ Fixed ${fixed} puzzles${failed > 0 ? ` (${failed} failed)` : ""}`);
      setConfirmed(false);

      // Re-analyze after fix
      setTimeout(() => {
        analyzePuzzles();
      }, 1500);

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
        <h1>🔧 Fix Puzzles with Generic Type</h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          This tool finds puzzles with type: "puzzle" and assigns the correct type based on their name and category.
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
            {loading ? "Analyzing..." : "📊 Analyze Puzzles"}
          </button>

          {analysis && analysis.generic > 0 && (
            <button
              onClick={fixGenericTypes}
              disabled={loading || !confirmed}
              style={{
                padding: "10px 20px",
                backgroundColor: confirmed ? "#ff9500" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: loading || !confirmed ? "not-allowed" : "pointer",
                fontSize: "1rem",
                fontWeight: "bold"
              }}
            >
              {loading ? "Fixing..." : "✅ Fix All Puzzles"}
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
                  {analysis.valid}
                </div>
                <div style={{ color: "#666" }}>Valid Type</div>
              </div>

              <div style={{
                padding: "1rem",
                backgroundColor: "#fff3e0",
                borderRadius: "8px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff9500" }}>
                  {analysis.generic}
                </div>
                <div style={{ color: "#666" }}>Generic Type</div>
              </div>
            </div>

            {analysis.generic > 0 && (
              <div>
                <h2>Puzzles to Fix ({analysis.generic})</h2>
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
                          Current Type
                        </th>
                        <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #ddd" }}>
                          Suggested Type
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.genericPuzzles.map((puzzle, idx) => (
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
                              backgroundColor: "#ffebee",
                              color: "#c62828",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontFamily: "monospace"
                            }}>
                              {puzzle.currentType}
                            </span>
                          </td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <span style={{
                              backgroundColor: "#e8f5e9",
                              color: "#2e7d32",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontFamily: "monospace",
                              fontWeight: "bold"
                            }}>
                              {puzzle.suggestedType}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {analysis.generic > 0 && (
                  <div style={{
                    padding: "1rem",
                    backgroundColor: "#fff3cd",
                    border: "2px solid #ff9500",
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
                      <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
                        ✅ I confirm to update {analysis.generic} puzzle type(s)
                      </span>
                    </label>
                  </div>
                )}
              </div>
            )}

            {analysis.generic === 0 && (
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
                ✅ All puzzles have valid types! No fixes needed.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
