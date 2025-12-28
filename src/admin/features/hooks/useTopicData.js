// src/admin/features/hooks/useTopicData.js
import { useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { FEATURES } from "../../../constants/FEATURES";

export function useTopicData() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const loadTopics = async (categoryId, categoryData = null) => {
    if (!categoryId) {
      setTopics([]);
      return;
    }
    
    setLoading(true);
    try {
      // Determine if this category belongs to Stories or Puzzles by checking its collection type
      const category = categoryData?.categories?.find(c => c.id === categoryId);
      const isStoryCategory = category?._collectionName === "storyCategories";
      const isPuzzleCategory = category?._collectionName === "puzzleCategories";
      
      const topicsCollectionName = isStoryCategory ? "storyTopics" : isPuzzleCategory ? "puzzleTopics" : "topics";
      const subtopicsCollectionName = isStoryCategory ? "storySubtopics" : isPuzzleCategory ? "puzzleSubtopics" : "subtopics";
      
      const topicsQuery = query(
        collection(db, topicsCollectionName),
        where("categoryId", "==", categoryId)
      );
      const topicsSnap = await getDocs(topicsQuery);
      let topicsList = topicsSnap.docs.map((d) => ({ 
        id: d.id, 
        ...d.data(),
        _collectionName: topicsCollectionName
      }));
      
      // Load all subtopics for this category to count them per topic
      const subtopicsQuery = query(
        collection(db, subtopicsCollectionName),
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

  const createTopic = async (topicData, categoryId, isStory = false) => {
    try {
      const topicsCollectionName = isStory ? "storyTopics" : "topics";
      
      const newTopic = {
        ...topicData,
        categoryId,
        subtopicCount: 0,
        isPublished: topicData.isPublished !== false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const docRef = await addDoc(collection(db, topicsCollectionName), newTopic);
      const created = { 
        id: docRef.id, 
        ...newTopic,
        _collectionName: topicsCollectionName
      };
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
      // Find the topic to determine its collection
      const topic = topics.find(t => t.id === topicId);
      const collectionName = topic?._collectionName || "topics";
      
      await updateDoc(doc(db, collectionName, topicId), {
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
      // Find the topic to determine its collection
      const topic = topics.find(t => t.id === topicId);
      const collectionName = topic?._collectionName || "topics";
      
      await deleteDoc(doc(db, collectionName, topicId));
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
      // Find the topic to determine its collection
      const topic = topics.find(t => t.id === topicId);
      const collectionName = topic?._collectionName || "topics";
      
      await updateDoc(doc(db, collectionName, topicId), {
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
