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
      
      // Assign featureId if missing (for regular categories)
      for (let cat of cats) {
        if (!cat.featureId && cat._collectionName === "categories" && features.length > 0) {
          const quizFeature = features.find(f => f.featureType === "quiz");
          const defaultFeature = quizFeature || features[0];
          cat.featureId = defaultFeature?.featureId || defaultFeature?.id;
          
          if (cat.id) {
            await updateDoc(doc(db, "categories", cat.id), { 
              featureId: cat.featureId 
            });
          }
        }
        
        // Get quiz count if not set
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
      // Find the category to determine its collection
      const cat = categories.find(c => c.id === categoryId);
      const collectionName = cat?._collectionName || "categories";
      
      await deleteDoc(doc(db, collectionName, categoryId));
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      setStatus("✅ Category deleted successfully");
    } catch (err) {
      console.error("Delete category error:", err);
      setStatus("❌ Failed to delete category");
      throw err;
    }
  };

  const toggleCategoryPublish = async (categoryId, currentStatus) => {
    try {
      // Find the category to determine its collection
      const cat = categories.find(c => c.id === categoryId);
      const collectionName = cat?._collectionName || "categories";
      
      await updateDoc(doc(db, collectionName, categoryId), {
        isPublished: !currentStatus,
        updatedAt: new Date().toISOString(),
      });
      
      setCategories(prev => prev.map(c => 
        c.id === categoryId ? { ...c, isPublished: !currentStatus } : c
      ));
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
