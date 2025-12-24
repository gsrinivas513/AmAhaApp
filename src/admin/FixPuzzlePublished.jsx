// src/admin/FixPuzzlePublished.jsx
import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function FixPuzzlePublished() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const fixNow = async () => {
    setLoading(true);
    setStatus("Loading puzzles...");

    try {
      const puzzlesSnap = await getDocs(collection(db, "puzzles"));
      const puzzles = puzzlesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      console.log("Puzzles:", puzzles);

      setStatus(`Found ${puzzles.length} puzzles. Updating...`);

      let fixed = 0;

      for (const puzzle of puzzles) {
        if (!puzzle.isPublished) {
          console.log(`Setting isPublished=true for puzzle: ${puzzle.title}`);
          
          await updateDoc(doc(db, "puzzles", puzzle.id), {
            isPublished: true
          });
          
          fixed++;
          setStatus(`Updated ${fixed}/${puzzles.length} puzzles...`);
        }
      }

      setStatus(`✅ DONE! Set isPublished=true for ${fixed} puzzles.`);
    } catch (error) {
      console.error("Error:", error);
      setStatus(`❌ ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔧 Fix Puzzle Published Status</h1>
      <p className="mb-6 text-gray-600">
        This adds <code>isPublished: true</code> to all puzzles so they appear in queries.
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
