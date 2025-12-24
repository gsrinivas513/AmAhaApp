// src/admin/FixPuzzleType.jsx
import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function FixPuzzleType() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const fixNow = async () => {
    setLoading(true);
    setStatus("Loading puzzles...");

    try {
      const puzzlesSnap = await getDocs(collection(db, "puzzles"));
      const puzzles = puzzlesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      console.log("Puzzles:", puzzles);

      let fixed = 0;

      for (const puzzle of puzzles) {
        let detectedType = puzzle.type;

        // If type is empty or missing, detect it from puzzle data
        if (!detectedType || detectedType === "") {
          // Check which data fields exist to determine type
          if (puzzle.data?.pairs || puzzle.correctAnswer) {
            detectedType = "matching";
          } else if (puzzle.data?.items) {
            detectedType = "ordering";
          } else if (puzzle.data?.draggables || puzzle.data?.targets) {
            detectedType = "drag";
          }

          if (detectedType && detectedType !== puzzle.type) {
            console.log(`Fixing puzzle ${puzzle.id}: type "" -> "${detectedType}"`);
            
            await updateDoc(doc(db, "puzzles", puzzle.id), {
              type: detectedType
            });
            
            fixed++;
            setStatus(`Updated ${fixed}/${puzzles.length} puzzles...`);
          }
        }
      }

      setStatus(`✅ DONE! Fixed type for ${fixed} puzzles.`);
    } catch (error) {
      console.error("Error:", error);
      setStatus(`❌ ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔧 Fix Puzzle Type</h1>
      <p className="mb-6 text-gray-600">
        This detects and fixes empty puzzle type fields by analyzing puzzle data.
      </p>

      <button
        onClick={fixNow}
        disabled={loading}
        className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 font-bold"
      >
        {loading ? "Fixing..." : "FIX NOW"}
      </button>

      {status && (
        <div className="mt-6 p-4 bg-gray-100 rounded font-mono text-sm border border-gray-300">
          {status}
        </div>
      )}
    </div>
  );
}
