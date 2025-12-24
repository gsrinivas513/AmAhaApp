// src/admin/FixPuzzleHierarchy.jsx
import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function FixPuzzleHierarchy() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState("");

  const fixNow = async () => {
    setLoading(true);
    setStatus("Loading all data...");
    setDetails("");

    try {
      // Load all collections
      const [puzzlesSnap, topicsSnap, subtopicsSnap] = await Promise.all([
        getDocs(collection(db, "puzzles")),
        getDocs(collection(db, "topics")),
        getDocs(collection(db, "subtopics")),
      ]);

      const puzzles = puzzlesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const topics = topicsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const subtopics = subtopicsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      console.log("Puzzles:", puzzles);
      console.log("Topics:", topics);
      console.log("Subtopics:", subtopics);

      // Create maps: ID -> name
      const topicMap = {};
      const subtopicMap = {};
      
      topics.forEach(t => {
        topicMap[t.id] = t.name || t.label;
      });
      
      subtopics.forEach(s => {
        subtopicMap[s.id] = s.name || s.label;
      });

      console.log("Topic map:", topicMap);
      console.log("Subtopic map:", subtopicMap);

      setStatus(`Found ${puzzles.length} puzzles, ${topics.length} topics, ${subtopics.length} subtopics`);

      // Fix each puzzle
      let fixed = 0;
      let details_text = "";

      for (const puzzle of puzzles) {
        const correctTopicName = topicMap[puzzle.topicId];
        const correctSubtopicName = subtopicMap[puzzle.subtopicId];

        const needsTopicFix = correctTopicName && puzzle.topic !== correctTopicName;
        const needsSubtopicFix = correctSubtopicName && puzzle.subtopic !== correctSubtopicName;

        if (needsTopicFix || needsSubtopicFix) {
          const updates = {};
          
          if (needsTopicFix) {
            updates.topic = correctTopicName;
            details_text += `\n❌ Puzzle "${puzzle.title}": topic "${puzzle.topic}" -> "${correctTopicName}"`;
          }
          
          if (needsSubtopicFix) {
            updates.subtopic = correctSubtopicName;
            details_text += `\n❌ Puzzle "${puzzle.title}": subtopic "${puzzle.subtopic}" -> "${correctSubtopicName}"`;
          }

          console.log(`Fixing puzzle ${puzzle.id}:`, updates);
          
          await updateDoc(doc(db, "puzzles", puzzle.id), updates);
          fixed++;
          setStatus(`Fixed ${fixed}/${puzzles.length} puzzles...`);
        }
      }

      setStatus(`✅ DONE! Fixed ${fixed} puzzles with correct topic and subtopic names.`);
      setDetails(details_text || "All puzzles already had correct names.");
    } catch (error) {
      console.error("Error:", error);
      setStatus(`❌ ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔧 Fix Puzzle Hierarchy (Names vs IDs)</h1>
      <p className="mb-6 text-gray-600">
        This fixes puzzles to have correct topic and subtopic NAMES (not IDs) in their fields.
      </p>

      <button
        onClick={fixNow}
        disabled={loading}
        className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 font-bold"
      >
        {loading ? "Fixing..." : "FIX NOW"}
      </button>

      {status && (
        <div className="mt-6 p-4 bg-gray-100 rounded font-mono text-sm border border-gray-300 whitespace-pre-wrap">
          {status}
        </div>
      )}

      {details && (
        <div className="mt-6 p-4 bg-blue-50 rounded font-mono text-sm border border-blue-300 whitespace-pre-wrap">
          <b>Details:</b>
          {details}
        </div>
      )}
    </div>
  );
}
