// src/admin/DebugPuzzleFields.jsx
// Utility page to list all unique values for category, topic, subtopic, difficulty in puzzles collection
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function DebugPuzzleFields() {
  const [values, setValues] = useState({ categories: [], topics: [], subtopics: [], difficulties: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const snap = await getDocs(collection(db, "puzzles"));
      const puzzles = snap.docs.map(d => d.data());
      const categories = Array.from(new Set(puzzles.map(p => p.category)));
      const topics = Array.from(new Set(puzzles.map(p => p.topic)));
      const subtopics = Array.from(new Set(puzzles.map(p => p.subtopic)));
      const difficulties = Array.from(new Set(puzzles.map(p => p.difficulty)));
      setValues({ categories, topics, subtopics, difficulties });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 12 }}>
      <h2>Unique Puzzle Field Values</h2>
      <div><b>Categories:</b> <pre>{JSON.stringify(values.categories, null, 2)}</pre></div>
      <div><b>Topics:</b> <pre>{JSON.stringify(values.topics, null, 2)}</pre></div>
      <div><b>Subtopics:</b> <pre>{JSON.stringify(values.subtopics, null, 2)}</pre></div>
      <div><b>Difficulties:</b> <pre>{JSON.stringify(values.difficulties, null, 2)}</pre></div>
    </div>
  );
}
