// src/admin/FixPuzzleCategories.jsx
import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function FixPuzzleCategories() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ fixed: 0, errors: 0, total: 0 });

  const fixPuzzleCategories = async () => {
    setLoading(true);
    setStatus("Loading puzzles and categories...");
    setResults({ fixed: 0, errors: 0, total: 0 });

    try {
      // Load all puzzles and categories
      const [puzzlesSnap, categoriesSnap] = await Promise.all([
        getDocs(collection(db, "puzzles")),
        getDocs(collection(db, "categories")),
      ]);

      const puzzles = puzzlesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const categories = categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Create a map of categoryId -> categoryName
      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat.id] = cat.name || cat.label || cat.id;
      });

      console.log("Category map:", categoryMap);
      console.log("Puzzles:", puzzles);

      let fixed = 0;
      let errors = 0;

      // Fix each puzzle
      for (const puzzle of puzzles) {
        try {
          const correctCategoryName = categoryMap[puzzle.categoryId];
          
          if (!correctCategoryName) {
            console.warn(`No category found for categoryId: ${puzzle.categoryId}`);
            errors++;
            continue;
          }

          // Check if category field is incorrect
          if (puzzle.category !== correctCategoryName) {
            console.log(`Fixing puzzle ${puzzle.id}: category "${puzzle.category}" -> "${correctCategoryName}"`);
            
            await updateDoc(doc(db, "puzzles", puzzle.id), {
              category: correctCategoryName,
            });
            
            fixed++;
            setStatus(`Fixed ${fixed} puzzles...`);
          }
        } catch (err) {
          console.error(`Error fixing puzzle ${puzzle.id}:`, err);
          errors++;
        }
      }

      setStatus(`✅ Done! Fixed ${fixed} puzzles, ${errors} errors.`);
      setResults({ fixed, errors, total: puzzles.length });
    } catch (err) {
      console.error("Error:", err);
      setStatus(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🔧 Fix Puzzle Categories</h1>
      
      <div className="bg-yellow-50 border border-yellow-300 p-4 rounded mb-6">
        <p className="text-sm text-yellow-800">
          This tool will update all puzzles to ensure their <code>category</code> field contains the correct category name (not the ID).
        </p>
      </div>

      <button
        onClick={fixPuzzleCategories}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Fixing..." : "Run Fix"}
      </button>

      {status && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <p className="font-mono text-sm">{status}</p>
        </div>
      )}

      {results.total > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded">
          <p><b>Results:</b></p>
          <p>Fixed: {results.fixed}</p>
          <p>Errors: {results.errors}</p>
          <p>Total puzzles: {results.total}</p>
        </div>
      )}
    </div>
  );
}
