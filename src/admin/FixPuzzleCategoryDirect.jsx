// src/admin/FixPuzzleCategoryDirect.jsx
import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function FixPuzzleCategoryDirect() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const fixNow = async () => {
    setLoading(true);
    setStatus("Loading all data...");

    try {
      // Step 1: Load all puzzles and categories
      const puzzlesSnap = await getDocs(collection(db, "puzzles"));
      const categoriesSnap = await getDocs(collection(db, "categories"));

      const puzzles = puzzlesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const categories = categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      console.log("Puzzles:", puzzles);
      console.log("Categories:", categories);

      setStatus(`Found ${puzzles.length} puzzles and ${categories.length} categories`);

      // Step 2: Create categoryId -> categoryName map
      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat.id] = cat.name || cat.label;
      });

      console.log("Category map:", categoryMap);

      // Step 3: Fix each puzzle
      let fixed = 0;
      for (const puzzle of puzzles) {
        const correctName = categoryMap[puzzle.categoryId];
        
        if (correctName && puzzle.category !== correctName) {
          console.log(`Fixing puzzle ${puzzle.id}: "${puzzle.category}" -> "${correctName}"`);
          
          await updateDoc(doc(db, "puzzles", puzzle.id), {
            category: correctName
          });
          
          fixed++;
          setStatus(`Fixed ${fixed}/${puzzles.length} puzzles...`);
        }
      }

      setStatus(`✅ DONE! Fixed ${fixed} puzzles. They now have correct category names.`);
    } catch (error) {
      console.error("Error:", error);
      setStatus(`❌ ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔧 Direct Puzzle Category Fix</h1>
      <p className="mb-6 text-gray-600">
        This will update all puzzle documents to have the correct category name (not the ID).
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
