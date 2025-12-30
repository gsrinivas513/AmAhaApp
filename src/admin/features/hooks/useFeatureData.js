// src/admin/features/hooks/useFeatureData.js
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { DEFAULT_FEATURES } from "../../../constants/FEATURES";

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
      
      console.log(`📊 Loaded ${feats.length} features from Firestore`);
      feats.forEach(f => console.log(`   - ${f.label || f.name} (type: ${f.type || f.featureType})`));
      
      // Remove duplicates - keep only the first occurrence of each featureType
      const seen = new Set();
      feats = feats.filter(f => {
        const key = f.featureType || f.type || f.id;
        if (seen.has(key)) {
          console.log(`⚠️ Removing duplicate feature: ${key}`);
          return false; // Remove duplicate
        }
        seen.add(key);
        return true;
      });
      
      // Ensure all default features exist (create missing ones)
      for (const feat of DEFAULT_FEATURES) {
        // Check if this feature already exists by type or id
        const featureExists = feats.some(f => 
          (f.featureType && f.featureType === feat.type) || 
          (f.type && f.type === feat.type) || 
          (f.label && f.label === feat.label)
        );
        
        console.log(`🔍 Checking ${feat.label}... exists: ${featureExists}`);
        
        // If feature doesn't exist, create it
        if (!featureExists) {
          console.log(`✏️ Creating missing feature: ${feat.label}`);
          const docRef = await addDoc(collection(db, "features"), {
            featureId: feat.id,  // Use featureId as a stable reference
            name: feat.name.toLowerCase(),
            label: feat.label || feat.name,
            icon: feat.icon,
            enabled: true,
            isPublished: true,
            featureType: feat.type,
            type: feat.type,
            order: feat.order,
            description: feat.description,
            createdAt: new Date().toISOString()
          });
          const newFeature = { 
            id: docRef.id, 
            featureId: feat.id,
            name: feat.name.toLowerCase(),
            label: feat.label || feat.name,
            icon: feat.icon,
            featureType: feat.type,
            type: feat.type,
            order: feat.order,
            description: feat.description,
            enabled: true,
            isPublished: true
          };
          feats.push(newFeature);
          console.log(`✅ Created missing feature: ${feat.label} (docId: ${docRef.id})`);
        }
      }
      
      // Sort by order field
      feats.sort((a, b) => (a.order || 999) - (b.order || 999));
      
      // Normalize feature IDs - use featureId as the primary ID for consistency
      // Map featureType to the correct ID from DEFAULT_FEATURES if featureId is missing
      feats = feats.map(f => {
        let normalizedId = (f.featureId || f.id || "").toLowerCase().trim();
        
        // If no featureId, try to find it from DEFAULT_FEATURES by matching type
        if (!f.featureId) {
          const defaultFeat = DEFAULT_FEATURES.find(df => df.type === (f.featureType || f.type));
          if (defaultFeat) {
            normalizedId = defaultFeat.id;  // Use the correct ID from constants
          }
        }
        
        return {
          ...f,
          id: normalizedId,
          featureId: normalizedId,  // Ensure featureId is always set
          // Normalize name to lowercase
          name: (f.name || "").toLowerCase().trim(),
        };
      });
      
      console.log(`📊 Final features count: ${feats.length}`);
      feats.forEach(f => console.log(`   - ${f.label} (id: ${f.id})`));;
      setFeatures(feats);
    } catch (err) {
      console.error("Load features error:", err);
      setStatus("❌ Failed to load features");
    } finally {
      setLoading(false);
    }
  };

  const createFeature = async (featureData, featureId = null) => {
    try {
      // Normalize featureId to lowercase for consistency
      let normalizedId = featureId ? featureId.toLowerCase().trim() : null;
      
      const newFeat = {
        ...featureData,
        // Normalize all name-related fields to lowercase
        id: normalizedId,
        name: (featureData.name || "").toLowerCase().trim(),
        featureId: normalizedId,
        createdAt: new Date().toISOString(),
      };
      
      // If a specific featureId is provided, use setDoc with that ID
      let docRef;
      if (normalizedId) {
        await setDoc(doc(db, "features", normalizedId), newFeat);
        docRef = { id: normalizedId };
      } else {
        docRef = await addDoc(collection(db, "features"), newFeat);
      }
      
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
      // Normalize featureId to lowercase for consistency
      const normalizedId = featureId.toLowerCase().trim();
      
      const updateData = {
        ...featureData,
        // Normalize name fields to lowercase
        id: normalizedId,
        name: (featureData.name || "").toLowerCase().trim(),
        featureId: normalizedId,
        updatedAt: new Date().toISOString(),
      };
      
      // Use setDoc with merge: true to create if doesn't exist, or update if exists
      await setDoc(doc(db, "features", normalizedId), updateData, { merge: true });
      
      setFeatures(prev => prev.map(f => 
        f.id === normalizedId ? { ...f, ...updateData } : f
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
      // Cascading delete: Delete all categories, topics, and subtopics for this feature
      console.log(`🗑️  Starting cascading delete for feature: ${featureId}`);
      
      // 1. Find all categories for this feature
      const categoriesQuery = query(
        collection(db, "categories"),
        where("featureId", "==", featureId)
      );
      const categoriesSnap = await getDocs(categoriesQuery);
      
      // 2. For each category, delete its topics and subtopics
      for (const catDoc of categoriesSnap.docs) {
        const categoryId = catDoc.id;
        console.log(`  Deleting category: ${categoryId}`);
        
        // Find all topics for this category
        const topicsQuery = query(
          collection(db, "topics"),
          where("categoryId", "==", categoryId)
        );
        const topicsSnap = await getDocs(topicsQuery);
        
        // Delete all subtopics for each topic
        for (const topicDoc of topicsSnap.docs) {
          const topicId = topicDoc.id;
          console.log(`    Deleting topic: ${topicId}`);
          
          // Find all subtopics for this topic
          const subtopicsQuery = query(
            collection(db, "subtopics"),
            where("topicId", "==", topicId)
          );
          const subtopicsSnap = await getDocs(subtopicsQuery);
          
          // Delete each subtopic
          for (const subDoc of subtopicsSnap.docs) {
            console.log(`      Deleting subtopic: ${subDoc.id}`);
            await deleteDoc(doc(db, "subtopics", subDoc.id));
          }
          
          // Delete the topic
          await deleteDoc(doc(db, "topics", topicId));
        }
        
        // Delete the category
        await deleteDoc(doc(db, "categories", categoryId));
      }
      
      // 3. Finally, delete the feature
      await deleteDoc(doc(db, "features", featureId));
      setFeatures(prev => prev.filter(f => f.id !== featureId));
      setStatus(`✅ Feature and all ${categoriesSnap.size} categories deleted successfully`);
      console.log(`✅ Cascading delete complete`);
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
