// src/admin/FixOrphanedPuzzles.jsx
// Fix puzzles missing type or categoryId

import React, { useState } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const VALID_PUZZLE_TYPES = ["find-pair", "picture-word", "spot-difference", "picture-shadow", "ordering"];

export default function FixOrphanedPuzzles() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const analyzePuzzles = async () => {
    setLoading(true);
    setStatus("🔍 Analyzing puzzles...");

    try {
      const puzzleSnap = await getDocs(collection(db, "puzzles"));
      const puzzles = puzzleSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const orphaned = [];
      const valid = [];

      for (const puzzle of puzzles) {
        const problems = [];

        if (!puzzle.type || !VALID_PUZZLE_TYPES.includes(puzzle.type)) {
          problems.push("❌ Missing or invalid type");
        }
        if (!puzzle.categoryId && !puzzle.category) {
          problems.push("❌ Missing categoryId");
        }

        if (problems.length > 0) {
          orphaned.push({
            id: puzzle.id,
            title: puzzle.title || puzzle.name || "Unknown",
            type: puzzle.type || "MISSING",
            categoryId: puzzle.categoryId || "MISSING",
            problems,
            fullData: puzzle
          });
        } else {
          valid.push(puzzle);
        }
      }

      setAnalysis({
        total: puzzles.length,
        valid: valid.length,
        orphaned: orphaned.length,
        orphanedPuzzles: orphaned
      });

      setStatus(`Found ${puzzles.length} puzzles: ${valid.length} valid, ${orphaned.length} orphaned`);

    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBrokenPuzzles = async () => {
    if (!confirmed) {
      setStatus("⚠️ Check the confirmation checkbox first!");
      return;
    }

    setLoading(true);
    setStatus("🗑️ Deleting orphaned puzzles...");

    try {
      let deleted = 0;

      for (const puzzle of analysis.orphanedPuzzles) {
        try {
          await deleteDoc(doc(db, "puzzles", puzzle.id));
          console.log(`🗑️ Deleted: "${puzzle.title}" (${puzzle.id})`);
          deleted++;
        } catch (error) {
          console.error(`❌ Failed to delete ${puzzle.title}:`, error);
        }
      }

      setStatus(`✅ Deleted ${deleted} broken puzzles`);
      setConfirmed(false);

      setTimeout(() => {
        setAnalysis(null);
        setStatus("");
      }, 2000);

    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "system-ui" }}>
      <h1>🗑️ Fix Orphaned Puzzles</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Find and remove puzzles with missing type or categoryId. These puzzles are broken and can't be used.
      </p>

      <button
        onClick={analyzePuzzles}
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
          {/* Summary */}
          <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
            <div style={{ padding: "12px", background: "#f0f4f8", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "#0284c7" }}>{analysis.total}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>Total Puzzles</div>
            </div>
            <div style={{ padding: "12px", background: "#dcfce7", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "#059669" }}>{analysis.valid}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>Valid</div>
            </div>
            <div style={{ padding: "12px", background: "#fee2e2", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "#dc2626" }}>{analysis.orphaned}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>Broken</div>
            </div>
          </div>

          {/* Orphaned Puzzles */}
          {analysis.orphaned > 0 && (
            <div style={{ marginTop: "20px", background: "#fee2e2", padding: "12px", borderRadius: "6px" }}>
              <h3>🗑️ Broken Puzzles ({analysis.orphaned})</h3>
              <p style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>
                These puzzles are missing required fields and can't be displayed or played:
              </p>
              <div style={{ maxHeight: "300px", overflow: "auto", background: "white", borderRadius: "6px", border: "1px solid #fecaca" }}>
                {analysis.orphanedPuzzles.map((puzzle, idx) => (
                  <div key={idx} style={{ padding: "12px", borderBottom: "1px solid #fecaca" }}>
                    <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                      {puzzle.title}
                      <span style={{ fontSize: "12px", color: "#666", marginLeft: "8px" }}>
                        ({puzzle.id})
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      Type: <code style={{ background: "#f3f4f6", padding: "2px 6px" }}>{puzzle.type}</code>
                      {" "}| Category: <code style={{ background: "#f3f4f6", padding: "2px 6px" }}>{puzzle.categoryId}</code>
                    </div>
                    <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>
                      {puzzle.problems.join(" | ")}
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
                <span>I confirm to delete {analysis.orphaned} broken puzzles</span>
              </label>

              <button
                onClick={deleteBrokenPuzzles}
                disabled={loading || !confirmed}
                style={{
                  marginTop: "12px",
                  padding: "10px 20px",
                  fontSize: "14px",
                  background: confirmed ? "#dc2626" : "#fca5a5",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: confirmed && !loading ? "pointer" : "not-allowed",
                  opacity: confirmed && !loading ? 1 : 0.6
                }}
              >
                {loading ? "Deleting..." : "🗑️ Delete All"}
              </button>
            </div>
          )}

          {analysis.orphaned === 0 && (
            <div style={{ marginTop: "20px", padding: "12px", background: "#dcfce7", borderRadius: "6px", border: "1px solid #86efac" }}>
              ✅ All puzzles are valid! No broken puzzles to delete.
            </div>
          )}
        </>
      )}

      {/* Info */}
      <div style={{ marginTop: "20px", padding: "12px", background: "#eff6ff", borderRadius: "6px", border: "1px solid #bfdbfe", fontSize: "13px" }}>
        <strong>ℹ️ What are broken puzzles?</strong>
        <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
          <li>Missing <code>type</code> field (must be one of: find-pair, picture-word, spot-difference, picture-shadow, ordering)</li>
          <li>Missing <code>categoryId</code> field (can't be organized or displayed)</li>
          <li>These are test/sample puzzles that aren't fully set up</li>
          <li>Safe to delete - they can't be played anyway</li>
        </ul>
      </div>
    </div>
  );
}
