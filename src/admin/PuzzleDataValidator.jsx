// src/admin/PuzzleDataValidator.jsx
// Validate puzzle data structure and prevent creation of invalid puzzles

import React, { useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const PUZZLE_REQUIREMENTS = {
  "find-pair": {
    required: ["cards"],
    validation: (puzzle) => {
      const cards = puzzle.data?.cards || [];
      if (cards.length === 0) return "Must have at least 1 card";
      if (cards.length % 2 !== 0) return "Cards must be in pairs (even number)";
      const minCards = 8; // 2x4 grid
      if (cards.length < minCards) return `Need at least ${minCards} cards`;
      return null;
    }
  },
  "picture-word": {
    required: ["items"],
    validation: (puzzle) => {
      const items = puzzle.data?.items || [];
      if (items.length === 0) return "Must have at least 1 item";
      if (items.length < 4) return "Need at least 4 items";
      return null;
    }
  },
  "spot-difference": {
    required: ["originalImage", "modifiedImage"],
    validation: (puzzle) => {
      const original = puzzle.data?.originalImage;
      const modified = puzzle.data?.modifiedImage;
      if (!original) return "Missing originalImage";
      if (!modified) return "Missing modifiedImage";
      return null;
    }
  },
  "picture-shadow": {
    required: ["originalImage", "shadowImage"],
    validation: (puzzle) => {
      const original = puzzle.data?.originalImage;
      const shadow = puzzle.data?.shadowImage;
      if (!original) return "Missing originalImage";
      if (!shadow) return "Missing shadowImage";
      return null;
    }
  },
  "ordering": {
    required: ["items", "correctOrder"],
    validation: (puzzle) => {
      const items = puzzle.data?.items || [];
      const order = puzzle.data?.correctOrder || [];
      if (items.length === 0) return "Must have at least 1 item";
      if (order.length === 0) return "Must define correct order";
      if (items.length !== order.length) return "Items and order must match in length";
      return null;
    }
  }
};

export default function PuzzleDataValidator() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const validatePuzzles = async () => {
    setLoading(true);
    setStatus("🔍 Validating puzzle data...");

    try {
      const puzzleSnap = await getDocs(collection(db, "puzzles"));
      const puzzles = puzzleSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const validation = {
        valid: [],
        invalid: [],
        warnings: []
      };

      for (const puzzle of puzzles) {
        const type = puzzle.type;
        
        // Skip if type is not recognized
        if (!PUZZLE_REQUIREMENTS[type]) {
          validation.warnings.push({
            id: puzzle.id,
            title: puzzle.title || "Unknown",
            message: `Unknown type: "${type}"`
          });
          continue;
        }

        // Get validation rules for this type
        const rules = PUZZLE_REQUIREMENTS[type];
        const error = rules.validation(puzzle);

        if (error) {
          validation.invalid.push({
            id: puzzle.id,
            title: puzzle.title || "Unknown",
            type: type,
            category: puzzle.category || "Unknown",
            error: error,
            required: rules.required
          });
        } else {
          validation.valid.push(puzzle);
        }
      }

      setAnalysis({
        total: puzzles.length,
        valid: validation.valid.length,
        invalid: validation.invalid.length,
        warnings: validation.warnings.length,
        invalidPuzzles: validation.invalid,
        warningPuzzles: validation.warnings
      });

      setStatus(`Validation complete: ${validation.valid.length} valid, ${validation.invalid.length} invalid, ${validation.warnings.length} warnings`);

    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      console.error(error);
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
        <h1>✅ Puzzle Data Validator</h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          This tool validates that all puzzles have the required data structure for their type.
          <br />
          <strong>Each puzzle type has specific requirements that must be met.</strong>
        </p>

        <button
          onClick={validatePuzzles}
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
          {loading ? "Validating..." : "✅ Validate All Puzzles"}
        </button>

        {status && (
          <div style={{
            padding: "1rem",
            backgroundColor: "#f0f4ff",
            border: "2px solid #667eea",
            borderRadius: "8px",
            marginTop: "2rem",
            marginBottom: "2rem",
            fontSize: "1.1rem"
          }}>
            {status}
          </div>
        )}

        {analysis && (
          <div style={{ marginTop: "2rem" }}>
            {/* Stats */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
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
                <div style={{ color: "#666", fontSize: "0.9rem" }}>Total</div>
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
                <div style={{ color: "#666", fontSize: "0.9rem" }}>Valid ✅</div>
              </div>

              <div style={{
                padding: "1rem",
                backgroundColor: "#ffebee",
                borderRadius: "8px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#c62828" }}>
                  {analysis.invalid}
                </div>
                <div style={{ color: "#666", fontSize: "0.9rem" }}>Invalid ❌</div>
              </div>

              <div style={{
                padding: "1rem",
                backgroundColor: "#fff3e0",
                borderRadius: "8px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff9500" }}>
                  {analysis.warnings}
                </div>
                <div style={{ color: "#666", fontSize: "0.9rem" }}>Warnings ⚠️</div>
              </div>
            </div>

            {/* Invalid Puzzles */}
            {analysis.invalid > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ color: "#c62828" }}>❌ Invalid Puzzles ({analysis.invalid})</h2>
                <p style={{ color: "#666" }}>These puzzles are missing required data and won't work properly:</p>
                <div style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  border: "2px solid #ffcdd2",
                  borderRadius: "8px"
                }}>
                  <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.9rem"
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: "#ffebee" }}>
                        <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ef5350" }}>
                          Title
                        </th>
                        <th style={{ padding: "10px", textAlign: "center", borderBottom: "2px solid #ef5350" }}>
                          Type
                        </th>
                        <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ef5350" }}>
                          Error
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.invalidPuzzles.map((puzzle, idx) => (
                        <tr key={puzzle.id} style={{
                          backgroundColor: idx % 2 === 0 ? "#fff5f5" : "white",
                          borderBottom: "1px solid #ffcdd2"
                        }}>
                          <td style={{ padding: "10px" }}>
                            <strong>{puzzle.title}</strong>
                            <div style={{ fontSize: "0.8rem", color: "#999" }}>{puzzle.id}</div>
                          </td>
                          <td style={{ padding: "10px", textAlign: "center" }}>
                            <span style={{
                              backgroundColor: "#e3f2fd",
                              color: "#1976d2",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontFamily: "monospace",
                              fontSize: "0.85rem"
                            }}>
                              {puzzle.type}
                            </span>
                          </td>
                          <td style={{ padding: "10px", color: "#c62828" }}>
                            <strong>{puzzle.error}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Valid Puzzles */}
            {analysis.valid > 0 && (
              <div style={{
                padding: "1.5rem",
                backgroundColor: "#e8f5e9",
                border: "2px solid #4caf50",
                borderRadius: "8px",
                textAlign: "center"
              }}>
                <h3 style={{ marginTop: 0, color: "#2e7d32" }}>✅ {analysis.valid} Puzzle(s) Valid</h3>
                <p style={{ color: "#2e7d32" }}>These puzzles have all required data and will work correctly.</p>
              </div>
            )}

            {/* Warnings */}
            {analysis.warnings > 0 && (
              <div style={{ marginTop: "2rem" }}>
                <h3 style={{ color: "#ff9500" }}>⚠️ Warnings ({analysis.warnings})</h3>
                <div style={{
                  backgroundColor: "#fff3e0",
                  border: "2px solid #ffb74d",
                  borderRadius: "8px",
                  padding: "1rem"
                }}>
                  {analysis.warningPuzzles.map(w => (
                    <div key={w.id} style={{ marginBottom: "0.5rem" }}>
                      <strong>{w.title}</strong>: {w.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements Reference */}
            <div style={{ marginTop: "2rem" }}>
              <h2>📋 Puzzle Type Requirements</h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1rem"
              }}>
                {Object.entries(PUZZLE_REQUIREMENTS).map(([type, req]) => (
                  <div key={type} style={{
                    padding: "1rem",
                    backgroundColor: "#f5f5f5",
                    borderLeft: "4px solid #667eea",
                    borderRadius: "4px"
                  }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", color: "#667eea" }}>
                      {type}
                    </h4>
                    <p style={{ margin: "0", fontSize: "0.9rem", color: "#666" }}>
                      Required: <code>{req.required.join(", ")}</code>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
