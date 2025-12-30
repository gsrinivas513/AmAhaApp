// src/admin/features/hooks/useCategoryData.js
import { useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { FEATURES } from "../../../constants/FEATURES";

export function useCategoryData() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const loadCategories = async (features) => {
    setLoading(true);
    try {
      let cats = [];
      
      // Load regular categories (for Quiz, Puzzle, Games)
      const catSnap = await getDocs(collection(db, "categories"));
      const regularCategories = catSnap.docs.map((d) => ({ 
        id: d.id, 
        ...d.data(),
        _collectionName: "categories" // Track which collection it came from
      }));
      
      // Load story categories separately
      const storyCatSnap = await getDocs(collection(db, "storyCategories"));
      const storyCategories = storyCatSnap.docs.map((d) => ({ 
        id: d.id, 
        ...d.data(),
        featureId: FEATURES.STORIES.id, // Assign Stories feature ID
        _collectionName: "storyCategories"
      }));
      
      // Note: Puzzle categories are now in the unified "categories" collection with featureId: "puzzles"
      // No need to load separately from puzzleCategories
      
      cats = [...regularCategories, ...storyCategories];
      
      // Normalize category featureIds to match normalized feature IDs
      // This handles the case where categories have old feature document IDs
      // but features now use normalized IDs like "quizzes", "puzzles", etc.
      if (features && features.length > 0) {
        // Create a mapping of all feature document IDs to their normalized IDs
        const featureMapping = {};
        for (const feat of features) {
          // Map the Firestore document ID to the normalized feature ID
          if (feat.featureType || feat.type) {
            featureMapping[feat.featureType || feat.type] = feat.featureId || feat.id;
          }
          // Also map the old document ID if it exists
          if (feat.id && (feat.featureId || feat.id)) {
            featureMapping[feat.id] = feat.featureId || feat.id;
          }
        }
        
        // Update categories with normalized featureIds
        cats = cats.map(cat => {
          if (cat.featureId && featureMapping[cat.featureId] && featureMapping[cat.featureId] !== cat.featureId) {
            console.log(`📍 Normalizing category "${cat.name}": ${cat.featureId} → ${featureMapping[cat.featureId]}`);
            return {
              ...cat,
              featureId: featureMapping[cat.featureId]
            };
          }
          return cat;
        });
      }
      
      // IMPORTANT: DO NOT assign default featureId to categories without one
      // If a category is missing featureId, it won't display until fixed
      // This prevents silent errors where categories get assigned to wrong features
      
      // Get quiz count if not set
      for (let cat of cats) {
        if (!cat.quizCount && cat.name && cat._collectionName === "categories") {
          try {
            const questionsQuery = query(
              collection(db, "questions"),
              where("category", "==", cat.name)
            );
            const questionsSnap = await getDocs(questionsQuery);
            cat.quizCount = questionsSnap.size;
          } catch (err) {
            console.error("Error counting questions:", err);
          }
        }
      }
      
      setCategories(cats);
    } catch (err) {
      console.error("Load categories error:", err);
      setStatus("❌ Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const newCat = {
        ...categoryData,
        quizCount: 0,
        isPublished: categoryData.isPublished !== false,
        createdAt: new Date().toISOString(),
      };
      
      // Determine which collection to use based on featureId
      // Stories go to storyCategories, everything else (including puzzles) goes to categories
      const isStories = categoryData.featureId === FEATURES.STORIES.id;
      const collectionName = isStories ? "storyCategories" : "categories";
      
      const docRef = await addDoc(collection(db, collectionName), newCat);
      const created = { 
        id: docRef.id, 
        ...newCat,
        _collectionName: collectionName
      };
      setCategories(prev => [...prev, created]);
      setStatus("✅ Category created successfully");
      return created;
    } catch (err) {
      console.error("Create category error:", err);
      setStatus("❌ Failed to create category");
      throw err;
    }
  };

  const updateCategory = async (categoryId, categoryData) => {
    try {
      // Find the category to determine its collection
      const cat = categories.find(c => c.id === categoryId);
      const collectionName = cat?._collectionName || "categories";
      
      await updateDoc(doc(db, collectionName, categoryId), {
        ...categoryData,
        updatedAt: new Date().toISOString(),
      });
      
      setCategories(prev => prev.map(c => 
        c.id === categoryId ? { ...c, ...categoryData } : c
      ));
      setStatus("✅ Category updated successfully");
    } catch (err) {
      console.error("Update category error:", err);
      setStatus("❌ Failed to update category");
      throw err;
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      // Cascading delete: Delete all topics and subtopics for this category
      console.log(`🗑️  Starting cascading delete for category: ${categoryId}`);
      
      // 1. Find all topics for this category
      const topicsQuery = query(
        collection(db, "topics"),
        where("categoryId", "==", categoryId)
      );
      const topicsSnap = await getDocs(topicsQuery);
      
      // 2. For each topic, delete its subtopics
      for (const topicDoc of topicsSnap.docs) {
        const topicId = topicDoc.id;
        console.log(`  Deleting topic: ${topicId}`);
        
        // Find all subtopics for this topic
        const subtopicsQuery = query(
          collection(db, "subtopics"),
          where("topicId", "==", topicId)
        );
        const subtopicsSnap = await getDocs(subtopicsQuery);
        
        // Delete each subtopic
        for (const subDoc of subtopicsSnap.docs) {
          console.log(`    Deleting subtopic: ${subDoc.id}`);
          await deleteDoc(doc(db, "subtopics", subDoc.id));
        }
        
        // Delete the topic
        await deleteDoc(doc(db, "topics", topicId));
      }
      
      // 3. Finally, delete the category
      const cat = categories.find(c => c.id === categoryId);
      const collectionName = cat?._collectionName || "categories";
      
      await deleteDoc(doc(db, collectionName, categoryId));
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      setStatus(`✅ Category and all ${topicsSnap.size} topics deleted successfully`);
      console.log(`✅ Cascading delete complete`);
    } catch (err) {
      console.error("Delete category error:", err);
      setStatus("❌ Failed to delete category");
      throw err;
    }
  };

  const toggleCategoryPublish = async (categoryId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      
      // Find the category to determine its collection
      const cat = categories.find(c => c.id === categoryId);
      const collectionName = cat?._collectionName || "categories";
      
      // Update category
      await updateDoc(doc(db, collectionName, categoryId), {
        isPublished: newStatus,
        updatedAt: new Date().toISOString(),
      });
      
      // If unpublishing, cascade unpublish to all topics in this category
      if (!newStatus) {
        console.log(`📋 Cascading unpublish to topics for category: ${categoryId}`);
        const topicsQuery = query(
          collection(db, "topics"),
          where("categoryId", "==", categoryId)
        );
        const topicsSnap = await getDocs(topicsQuery);
        
        for (const topicDoc of topicsSnap.docs) {
          const topicId = topicDoc.id;
          console.log(`  Unpublishing topic: ${topicId}`);
          await updateDoc(doc(db, "topics", topicId), {
            isPublished: false,
            updatedAt: new Date().toISOString(),
          });
          
          // Also unpublish all subtopics in this topic
          const subtopicsQuery = query(
            collection(db, "subtopics"),
            where("topicId", "==", topicId)
          );
          const subtopicsSnap = await getDocs(subtopicsQuery);
          
          for (const subDoc of subtopicsSnap.docs) {
            console.log(`    Unpublishing subtopic: ${subDoc.id}`);
            await updateDoc(doc(db, "subtopics", subDoc.id), {
              isPublished: false,
              updatedAt: new Date().toISOString(),
            });
          }
        }
      }
      
      setCategories(prev => prev.map(c => 
        c.id === categoryId ? { ...c, isPublished: newStatus } : c
      ));
      
      setStatus(newStatus ? "✅ Category published" : "✅ Category and children unpublished");
    } catch (err) {
      console.error("Toggle category publish error:", err);
      throw err;
    }
  };

  return {
    categories,
    loading,
    status,
    setStatus,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryPublish,
  };
}
