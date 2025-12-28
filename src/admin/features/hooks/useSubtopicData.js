// src/admin/features/hooks/useSubtopicData.js
import { useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { FEATURES } from "../../../constants/FEATURES";

export function useSubtopicData() {
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const loadSubtopics = async (categoryId, topicId = null, isStory = false, isPuzzle = false) => {
    setLoading(true);
    try {
      let subtopicsData = [];
      
      // Determine which collection to use
      const subtopicsCollectionName = isStory ? "storySubtopics" : isPuzzle ? "puzzleSubtopics" : "subtopics";
      
      let subtopicsQuery;
      
      // If no categoryId, load ALL subtopics (for initial count display)
      if (!categoryId) {
        subtopicsQuery = collection(db, subtopicsCollectionName);
      } else {
        subtopicsQuery = query(
          collection(db, subtopicsCollectionName),
          where("categoryId", "==", categoryId)
        );
      }
      
      const subtopicsSnap = await getDocs(subtopicsQuery);
      subtopicsData = subtopicsSnap.docs.map((d) => ({ 
        id: d.id, 
        ...d.data(),
        _collectionName: subtopicsCollectionName
      }));
      
      // Also load regular subtopics if not loading stories or puzzles (for combined view)
      if (!isStory && !isPuzzle && !categoryId) {
        let regularQuery = collection(db, "subtopics");
        const regularSnap = await getDocs(regularQuery);
        const regularData = regularSnap.docs.map((d) => ({ 
          id: d.id, 
          ...d.data(),
          _collectionName: "subtopics"
        }));
        subtopicsData = [...subtopicsData, ...regularData];
      }
      
      // Filter by topicId if selected
      if (topicId) {
        subtopicsData = subtopicsData.filter(s => s.topicId === topicId);
      }
      
      setSubtopics(subtopicsData);
    } catch (err) {
      console.error("Load subtopics error:", err);
      setStatus("❌ Failed to load subtopics");
    } finally {
      setLoading(false);
    }
  };

  const createSubtopic = async (subtopicData, isStory = false, isPuzzle = false) => {
    try {
      const subtopicsCollectionName = isStory ? "storySubtopics" : isPuzzle ? "puzzleSubtopics" : "subtopics";
      
      const newSubtopic = {
        ...subtopicData,
        quizCount: 0,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date(),
      };
      
      const docRef = await addDoc(collection(db, subtopicsCollectionName), newSubtopic);
      const created = { 
        id: docRef.id, 
        ...newSubtopic,
        _collectionName: subtopicsCollectionName
      };
      setSubtopics(prev => [...prev, created]);
      setStatus("✅ Subtopic created successfully");
      return created;
    } catch (err) {
      console.error("Create subtopic error:", err);
      setStatus("❌ Failed to create subtopic");
      throw err;
    }
  };

  const updateSubtopic = async (subtopicId, subtopicData) => {
    try {
      // Find the subtopic to determine its collection
      const subtopic = subtopics.find(s => s.id === subtopicId);
      const collectionName = subtopic?._collectionName || "subtopics";
      
      await updateDoc(doc(db, collectionName, subtopicId), {
        ...subtopicData,
        updatedAt: new Date(),
      });
      
      setSubtopics(prev => prev.map(s => 
        s.id === subtopicId ? { ...s, ...subtopicData } : s
      ));
      setStatus("✅ Subtopic updated successfully");
    } catch (err) {
      console.error("Update subtopic error:", err);
      setStatus("❌ Failed to update subtopic");
      throw err;
    }
  };

  const deleteSubtopic = async (subtopicId) => {
    try {
      // Find the subtopic to determine its collection
      const subtopic = subtopics.find(s => s.id === subtopicId);
      const collectionName = subtopic?._collectionName || "subtopics";
      
      await deleteDoc(doc(db, collectionName, subtopicId));
      setSubtopics(prev => prev.filter(s => s.id !== subtopicId));
      setStatus("✅ Subtopic deleted successfully");
    } catch (err) {
      console.error("Delete subtopic error:", err);
      setStatus("❌ Failed to delete subtopic");
      throw err;
    }
  };

  const toggleSubtopicPublish = async (subtopicId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      
      // Find the subtopic to determine its collection
      const subtopic = subtopics.find(s => s.id === subtopicId);
      const collectionName = subtopic?._collectionName || "subtopics";
      
      // If trying to publish, check if parent topic and category are published
      if (newStatus) {
        // Check if parent topic is published
        if (subtopic?.topicId) {
          const topicDoc = await getDoc(doc(db, "topics", subtopic.topicId));
          if (topicDoc.exists()) {
            const topicData = topicDoc.data();
            if (topicData.isPublished === false) {
              throw new Error("Cannot publish subtopic: Parent topic is unpublished");
            }
            
            // Also check if parent category is published
            if (topicData.categoryId) {
              const categoryDoc = await getDoc(doc(db, "categories", topicData.categoryId));
              if (categoryDoc.exists()) {
                const categoryData = categoryDoc.data();
                if (categoryData.isPublished === false) {
                  throw new Error("Cannot publish subtopic: Parent category is unpublished");
                }
              }
            }
          }
        }
      }
      
      await updateDoc(doc(db, collectionName, subtopicId), {
        isPublished: newStatus,
        updatedAt: new Date(),
      });
      
      setSubtopics(prev => prev.map(s => 
        s.id === subtopicId ? { ...s, isPublished: newStatus } : s
      ));
      
      setStatus(newStatus ? "✅ Subtopic published" : "✅ Subtopic unpublished");
    } catch (err) {
      console.error("Toggle subtopic publish error:", err);
      setStatus("❌ " + err.message);
      throw err;
    }
  };

  return {
    subtopics,
    loading,
    status,
    setStatus,
    loadSubtopics,
    createSubtopic,
    updateSubtopic,
    deleteSubtopic,
    toggleSubtopicPublish,
  };
}
