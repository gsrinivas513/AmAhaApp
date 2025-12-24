// src/puzzles/PuzzlePlayHierarchicalPage.jsx
// Loads a puzzle using full hierarchy: feature/category/topic/subtopic/level/difficulty
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import MatchingPuzzle from "./MatchingPuzzle";
import OrderingPuzzle from "./OrderingPuzzle";
import DragPuzzle from "./DragPuzzle";
import PuzzleFinish from "./PuzzleFinish";

export default function PuzzlePlayHierarchicalPage() {
  const { category, topic, subtopic, difficulty } = useParams();
  const [puzzle, setPuzzle] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPuzzle() {
      setLoading(true);
      // Query for a puzzle matching category, topic, subtopic (difficulty optional)
      const q = query(
        collection(db, "puzzles"),
        where("category", "==", decodeURIComponent(category)),
        where("topic", "==", decodeURIComponent(topic)),
        where("subtopic", "==", decodeURIComponent(subtopic)),
        where("isPublished", "==", true)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        // If difficulty is specified, filter by it; otherwise take first match
        let doc = snap.docs[0];
        if (difficulty) {
          doc = snap.docs.find(d => d.data().difficulty === decodeURIComponent(difficulty)) || snap.docs[0];
        }
        setPuzzle({ id: doc.id, ...doc.data() });
      } else {
        setPuzzle(null);
      }
      setLoading(false);
    }
    loadPuzzle();
  }, [category, topic, subtopic, difficulty]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!puzzle) return <div className="p-8 text-center text-red-600">No puzzle found for this path.</div>;
  if (completed) return <PuzzleFinish puzzle={puzzle} />;

  switch (puzzle.type) {
    case "matching":
      return <MatchingPuzzle puzzle={puzzle} onComplete={() => setCompleted(true)} />;
    case "ordering":
      return <OrderingPuzzle puzzle={puzzle} onComplete={() => setCompleted(true)} />;
    case "drag":
      return <DragPuzzle puzzle={puzzle} onComplete={() => setCompleted(true)} />;
    default:
      return <div>Unknown puzzle type</div>;
  }
}
