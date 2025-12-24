// src/puzzles/PuzzleCategoryPage.jsx
// Shows all puzzles for a category and subtopic using Candy Crush-style level path
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import PuzzleLevelPath from "./PuzzleLevelPath";

export default function PuzzleCategoryPage() {
  const { categoryName, topicName, subtopicName } = useParams();
  const navigate = useNavigate();
  const [subtopic, setSubtopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [categoryName, topicName, subtopicName]);

  const loadData = async () => {
    try {
      setLoading(true);

      const decodedCategoryName = decodeURIComponent(categoryName);
      const decodedTopicName = decodeURIComponent(topicName);
      const decodedSubtopicName = decodeURIComponent(subtopicName);

      // Load category
      const categoriesSnap = await getDocs(collection(db, "categories"));
      const categoryDoc = categoriesSnap.docs.find(doc => {
        const data = doc.data();
        return (data.name === decodedCategoryName || data.label === decodedCategoryName);
      });

      if (!categoryDoc) {
        navigate("/");
        return;
      }

      const catData = { id: categoryDoc.id, ...categoryDoc.data() };

      // Load topic
      const topicsSnap = await getDocs(
        query(collection(db, "topics"), where("categoryId", "==", catData.id))
      );

      const topicDoc = topicsSnap.docs.find(doc => {
        const data = doc.data();
        return (data.name === decodedTopicName || data.label === decodedTopicName);
      });

      if (!topicDoc) {
        navigate(-1);
        return;
      }

      const topicData = { id: topicDoc.id, ...topicDoc.data() };

      // Load subtopic
      const subtopicsSnap = await getDocs(
        query(collection(db, "subtopics"), where("topicId", "==", topicData.id))
      );

      const subtopicDoc = subtopicsSnap.docs.find(doc => {
        const data = doc.data();
        return (data.name === decodedSubtopicName || data.label === decodedSubtopicName);
      });

      if (!subtopicDoc) {
        navigate(-1);
        return;
      }

      const subtopicData = { id: subtopicDoc.id, ...subtopicDoc.data() };
      setSubtopic(subtopicData);
    } catch (error) {
      console.error("Error loading puzzle data:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontSize: "1.5rem"
      }}>
        Loading puzzles...
      </div>
    );
  }

  if (!subtopic) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontSize: "1.5rem"
      }}>
        Could not load puzzles
      </div>
    );
  }

  return (
    <PuzzleLevelPath
      categoryName={categoryName}
      topicName={topicName}
      subtopicName={subtopicName}
      subtopicId={subtopic.id}
    />
  );
}
