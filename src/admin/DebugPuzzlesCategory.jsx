// src/admin/DebugPuzzlesCategory.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function DebugPuzzlesCategory() {
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPuzzles = async () => {
      try {
        const snap = await getDocs(collection(db, "puzzles"));
        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPuzzles(data);
        console.log("All puzzles:", data);
      } catch (error) {
        console.error("Error loading puzzles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPuzzles();
  }, []);

  if (loading) return <div className="p-8">Loading puzzles...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🔍 Debug: Puzzle Details</h1>
      <p className="text-gray-600 mb-6">Total puzzles: <b>{puzzles.length}</b></p>

      <div className="space-y-6">
        {puzzles.map(puzzle => (
          <div key={puzzle.id} className="p-4 border rounded bg-gray-50">
            <h2 className="text-lg font-bold mb-3">{puzzle.title}</h2>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="font-bold py-2">ID:</td>
                  <td><code className="bg-yellow-100 px-2 py-1">{puzzle.id}</code></td>
                </tr>
                <tr className="border-b">
                  <td className="font-bold py-2">category (name):</td>
                  <td><code className="bg-yellow-100 px-2 py-1">{puzzle.category || "(empty)"}</code></td>
                </tr>
                <tr className="border-b">
                  <td className="font-bold py-2">categoryId:</td>
                  <td><code className="bg-yellow-100 px-2 py-1">{puzzle.categoryId || "(empty)"}</code></td>
                </tr>
                <tr className="border-b">
                  <td className="font-bold py-2">topic (name):</td>
                  <td><code className="bg-yellow-100 px-2 py-1">{puzzle.topic || "(empty)"}</code></td>
                </tr>
                <tr className="border-b">
                  <td className="font-bold py-2">topicId:</td>
                  <td><code className="bg-yellow-100 px-2 py-1">{puzzle.topicId || "(empty)"}</code></td>
                </tr>
                <tr className="border-b">
                  <td className="font-bold py-2">subtopic (name):</td>
                  <td><code className="bg-yellow-100 px-2 py-1">{puzzle.subtopic || "(empty)"}</code></td>
                </tr>
                <tr>
                  <td className="font-bold py-2">subtopicId:</td>
                  <td><code className="bg-yellow-100 px-2 py-1">{puzzle.subtopicId || "(empty)"}</code></td>
                </tr>
                <tr>
                  <td className="font-bold py-2">isPublished:</td>
                  <td><code className="bg-yellow-100 px-2 py-1">{puzzle.isPublished === undefined ? "(missing)" : String(puzzle.isPublished)}</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
