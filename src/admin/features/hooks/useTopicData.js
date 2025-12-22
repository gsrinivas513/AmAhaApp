// src/admin/features/hooks/useTopicData.js
import { useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

export function useTopicData() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const loadTopics = async (categoryId) => {
    if (!categoryId) {
      setTopics([]);
      return;
    }
    
    setLoading(true);
    try {
      const topicsQuery = query(
        collection(db, "topics"),
        where("categoryId", "==", categoryId)
      );
      const topicsSnap = await getDocs(topicsQuery);
      let topicsList = topicsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      // Load all subtopics for this category to count them per topic
      const subtopicsQuery = query(
        collection(db, "subtopics"),
        where("categoryId", "==", categoryId)
      );
      const subtopicsSnap = await getDocs(subtopicsQuery);
      const subtopicsList = subtopicsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      // Add subtopic count to each topic
      topicsList = topicsList.map(topic => {
        const subtopicCount = subtopicsList.filter(sub => sub.topicId === topic.id).length;
        return { ...topic, subtopicCount };
      });
      
      // Sort: published first, then by sortOrder, then by date
      topicsList.sort((a, b) => {
        if (a.isPublished !== b.isPublished) {
          return (b.isPublished ? 1 : 0) - (a.isPublished ? 1 : 0);
        }
        if (a.sortOrder !== b.sortOrder) {
          return (a.sortOrder || 0) - (b.sortOrder || 0);
        }
        const dateA = a.updatedAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.updatedAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });
      
      setTopics(topicsList);
    } catch (err) {
      console.error("Load topics error:", err);
      setStatus("❌ Failed to load topics");
    } finally {
      setLoading(false);
    }
  };

  const createTopic = async (topicData, categoryId) => {
    try {
      const newTopic = {
        ...topicData,
        categoryId,
        subtopicCount: 0,
        isPublished: topicData.isPublished !== false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const docRef = await addDoc(collection(db, "topics"), newTopic);
      const created = { id: docRef.id, ...newTopic };
      setTopics(prev => [...prev, created]);
      setStatus("✅ Topic created successfully");
      return created;
    } catch (err) {
      console.error("Create topic error:", err);
      setStatus("❌ Failed to create topic");
      throw err;
    }
  };

  const updateTopic = async (topicId, topicData) => {
    try {
      await updateDoc(doc(db, "topics", topicId), {
        ...topicData,
        updatedAt: new Date(),
      });
      
      setTopics(prev => prev.map(t => 
        t.id === topicId ? { ...t, ...topicData } : t
      ));
      setStatus("✅ Topic updated successfully");
    } catch (err) {
      console.error("Update topic error:", err);
      setStatus("❌ Failed to update topic");
      throw err;
    }
  };

  const deleteTopic = async (topicId) => {
    try {
      await deleteDoc(doc(db, "topics", topicId));
      setTopics(prev => prev.filter(t => t.id !== topicId));
      setStatus("✅ Topic deleted successfully");
    } catch (err) {
      console.error("Delete topic error:", err);
      setStatus("❌ Failed to delete topic");
      throw err;
    }
  };

  const toggleTopicPublish = async (topicId, currentStatus) => {
    try {
      await updateDoc(doc(db, "topics", topicId), {
        isPublished: !currentStatus,
        updatedAt: new Date(),
      });
      
      setTopics(prev => prev.map(t => 
        t.id === topicId ? { ...t, isPublished: !currentStatus } : t
      ));
    } catch (err) {
      console.error("Toggle topic publish error:", err);
      throw err;
    }
  };

  return {
    topics,
    loading,
    status,
    setStatus,
    loadTopics,
    createTopic,
    updateTopic,
    deleteTopic,
    toggleTopicPublish,
  };
}
