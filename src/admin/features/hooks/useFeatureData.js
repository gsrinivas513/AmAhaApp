// src/admin/features/hooks/useFeatureData.js
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

export function useFeatureData() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    setLoading(true);
    try {
      const featSnap = await getDocs(collection(db, "features"));
      let feats = featSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      // Create default features if none exist
      if (feats.length === 0) {
        const defaultFeatures = [
          { name: "quiz", label: "Quiz", icon: "🎯", enabled: true, featureType: "quiz", createdAt: new Date().toISOString() },
          { name: "puzzles", label: "Puzzles", icon: "🧩", enabled: true, featureType: "puzzle", createdAt: new Date().toISOString() },
        ];
        
        for (const feat of defaultFeatures) {
          const docRef = await addDoc(collection(db, "features"), feat);
          feats.push({ id: docRef.id, ...feat });
        }
      }
      
      setFeatures(feats);
    } catch (err) {
      console.error("Load features error:", err);
      setStatus("❌ Failed to load features");
    } finally {
      setLoading(false);
    }
  };

  const createFeature = async (featureData) => {
    try {
      const newFeat = {
        ...featureData,
        createdAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(collection(db, "features"), newFeat);
      const created = { id: docRef.id, ...newFeat };
      setFeatures(prev => [...prev, created]);
      setStatus("✅ Feature created successfully");
      return created;
    } catch (err) {
      console.error("Create feature error:", err);
      setStatus("❌ Failed to create feature");
      throw err;
    }
  };

  const updateFeature = async (featureId, featureData) => {
    try {
      await updateDoc(doc(db, "features", featureId), {
        ...featureData,
        updatedAt: new Date().toISOString(),
      });
      
      setFeatures(prev => prev.map(f => 
        f.id === featureId ? { ...f, ...featureData } : f
      ));
      setStatus("✅ Feature updated successfully");
    } catch (err) {
      console.error("Update feature error:", err);
      setStatus("❌ Failed to update feature");
      throw err;
    }
  };

  const deleteFeature = async (featureId) => {
    try {
      // Check if any categories use this feature
      const categoriesQuery = query(
        collection(db, "categories"),
        where("featureId", "==", featureId)
      );
      const categoriesSnap = await getDocs(categoriesQuery);
      
      if (categoriesSnap.size > 0) {
        throw new Error(`Cannot delete feature - ${categoriesSnap.size} categories are using it`);
      }
      
      await deleteDoc(doc(db, "features", featureId));
      setFeatures(prev => prev.filter(f => f.id !== featureId));
      setStatus("✅ Feature deleted successfully");
    } catch (err) {
      console.error("Delete feature error:", err);
      setStatus("❌ " + err.message);
      throw err;
    }
  };

  return {
    features,
    loading,
    status,
    setStatus,
    loadFeatures,
    createFeature,
    updateFeature,
    deleteFeature,
  };
}
