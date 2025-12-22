// src/admin/features/hooks/useSubtopicData.js
import { useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

export function useSubtopicData() {
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const loadSubtopics = async (categoryId, topicId = null) => {
    setLoading(true);
    try {
      let subtopicsQuery;
      
      // If no categoryId, load ALL subtopics (for initial count display)
      if (!categoryId) {
        subtopicsQuery = collection(db, "subtopics");
      } else {
        subtopicsQuery = query(
          collection(db, "subtopics"),
          where("categoryId", "==", categoryId)
        );
      }
      
      const subtopicsSnap = await getDocs(subtopicsQuery);
      let subtopicsData = subtopicsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      
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

  const createSubtopic = async (subtopicData) => {
    try {
      const newSubtopic = {
        ...subtopicData,
        quizCount: 0,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date(),
      };
      
      const docRef = await addDoc(collection(db, "subtopics"), newSubtopic);
      const created = { id: docRef.id, ...newSubtopic };
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
      await updateDoc(doc(db, "subtopics", subtopicId), {
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
      await deleteDoc(doc(db, "subtopics", subtopicId));
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
      await updateDoc(doc(db, "subtopics", subtopicId), {
        isPublished: !currentStatus,
        updatedAt: new Date(),
      });
      
      setSubtopics(prev => prev.map(s => 
        s.id === subtopicId ? { ...s, isPublished: !currentStatus } : s
      ));
    } catch (err) {
      console.error("Toggle subtopic publish error:", err);
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
