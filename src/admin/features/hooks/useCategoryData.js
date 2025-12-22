// src/admin/features/hooks/useCategoryData.js
import { useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

export function useCategoryData() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const loadCategories = async (features) => {
    setLoading(true);
    try {
      const catSnap = await getDocs(collection(db, "categories"));
      let cats = catSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      // Assign featureId if missing
      for (let cat of cats) {
        if (!cat.featureId && features.length > 0) {
          const quizFeature = features.find(f => f.featureType === "quiz");
          const defaultFeature = quizFeature || features[0];
          cat.featureId = defaultFeature?.id;
          
          if (cat.id) {
            await updateDoc(doc(db, "categories", cat.id), { 
              featureId: cat.featureId 
            });
          }
        }
        
        // Get quiz count if not set
        if (!cat.quizCount && cat.name) {
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
      
      const docRef = await addDoc(collection(db, "categories"), newCat);
      const created = { id: docRef.id, ...newCat };
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
      await updateDoc(doc(db, "categories", categoryId), {
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
      await deleteDoc(doc(db, "categories", categoryId));
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
      await updateDoc(doc(db, "categories", categoryId), {
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
