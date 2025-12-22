import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { Card, Button, Input, Modal } from "../components/ui";

// UI Mode configurations for categories
const UI_MODES = [
  { value: "playful", label: "🎨 Playful & Fun", description: "Colorful, animated, energetic" },
  { value: "calm", label: "🌿 Calm & Premium", description: "Clean, minimalist, sophisticated" },
  { value: "competitive", label: "⚡ Energetic & Competitive", description: "Bold, dynamic, intense" },
];

export default function FeatureCategoryManagement() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    label: "",
    icon: "📚",
    color: "#0284c7",
    description: "",
    featureId: "",
    defaultUiMode: "playful", // playful, calm, competitive
  });

  const [featureForm, setFeatureForm] = useState({
    name: "",
    label: "",
    description: "",
    icon: "✨",
    enabled: true,
    featureType: "quiz", // quiz, puzzle, or custom
  });

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingFeatureId, setEditingFeatureId] = useState(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);
  
  // Preview modal state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewCategory, setPreviewCategory] = useState(null);

  // Topic states (Step 3)
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [topicForm, setTopicForm] = useState({
    name: "",
    label: "",
    icon: "📚",
    description: "",
    sortOrder: 0,
    categoryId: "",
    isPublished: true,
  });

  // Subtopic states (Step 4 - now SubTopics)
  const [subtopics, setSubtopicies] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showSubtopicModal, setShowSubtopicModal] = useState(false);
  const [editingSubtopicId, setEditingSubtopicId] = useState(null);
  const [subtopicForm, setSubtopicForm] = useState({
    name: "",
    label: "",
    icon: "📖",
    description: "",
    categoryId: "",
    topicId: "",
  });

  // Helper function to get feature name
  const getFeatureName = (featureId) => {
    const feature = features.find(f => f.id === featureId);
    return feature?.label || feature?.name || "Items";
  };

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  // Auto-select first feature AFTER both features and categories are loaded
  useEffect(() => {
    if (features.length > 0 && categories.length > 0 && !selectedFeatureId) {
      const quizFeature = features.find(f => f.featureType === "quiz") || features[0];
      if (quizFeature) {
        setSelectedFeatureId(quizFeature.id);
        setCategoryForm(prev => ({ ...prev, featureId: quizFeature.id }));
      }
    }
  }, [features, categories]);

  // Load topics when a category is selected
  useEffect(() => {
    if (selectedCategoryId) {
      loadTopics(selectedCategoryId);
    } else {
      setTopics([]);
      setSelectedTopicId(null);
    }
  }, [selectedCategoryId]);

  // Load subtopics when a topic is selected (or category if no topic)
  useEffect(() => {
    if (selectedCategoryId) {
      loadSubtopics(selectedCategoryId, selectedTopicId);
    } else {
      setSubtopicies([]);
    }
  }, [selectedCategoryId, selectedTopicId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load features
      const featSnap = await getDocs(collection(db, "features"));
      const feats = featSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      console.log("📦 RAW FEATURES FROM FIREBASE:", feats);
      console.log("📦 Number of features:", feats.length);
      if (feats.length > 0) {
        console.log("📦 Features details:", feats.map(f => ({ id: f.id, name: f.name, featureType: f.featureType })));
      }
      
      // If no features exist, create default ones
      if (feats.length === 0) {
        setStatus("🔧 Creating default features...");
        const defaultFeatures = [
          { name: "quiz", label: "Quiz", icon: "🎯", enabled: true, featureType: "quiz", createdAt: new Date().toISOString() },
          { name: "puzzles", label: "Puzzles", icon: "🧩", enabled: true, featureType: "puzzle", createdAt: new Date().toISOString() },
        ];
        
        for (const feat of defaultFeatures) {
          const docRef = await addDoc(collection(db, "features"), feat);
          feats.push({ id: docRef.id, ...feat });
        }
        setStatus("✅ Default features created successfully!");
      }
      
      setFeatures(feats);

      // Load categories
      console.log("🔍 Loading categories from Firebase...");
      const catSnap = await getDocs(collection(db, "categories"));
      let cats = catSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      console.log("📦 RAW CATEGORIES FROM FIREBASE:", cats);
      console.log("📦 Number of categories loaded:", cats.length);
      console.log("📦 Firebase collection size:", catSnap.size);
      
      if (cats.length > 0) {
        console.log("📦 First category data:", cats[0]);
        console.log("📦 All featureIds:", cats.map(c => ({ name: c.name, featureId: c.featureId })));
      } else {
        console.warn("⚠️ NO CATEGORIES FOUND - This is unexpected");
      }
      
      // If no categories exist, create default student quiz categories
      if (cats.length === 0) {
        console.log("No categories found. Creating default student categories...");
        const quizFeature = feats.find(f => f.featureType === "quiz");
        if (quizFeature) {
          const defaultCategories = [
            { name: "geography", label: "Geography", icon: "🌍", color: "#0284c7", description: "Capitals, countries, and landmarks" },
            { name: "science", label: "Science", icon: "🧪", color: "#10b981", description: "Biology, chemistry, and physics" },
            { name: "math", label: "Math", icon: "🔢", color: "#f59e0b", description: "Arithmetic, geometry, and calculus" },
            { name: "literature", label: "Literature", icon: "📚", color: "#8b5cf6", description: "Authors, books, and classics" },
            { name: "history", label: "History", icon: "🏛️", color: "#ef4444", description: "Historical events and figures" },
          ];
          
          for (const cat of defaultCategories) {
            const docRef = await addDoc(collection(db, "categories"), {
              ...cat,
              featureId: quizFeature.id,
              quizCount: 0,
              isPublished: true,
              defaultUiMode: "playful",
              createdAt: new Date().toISOString(),
            });
            cats.push({ id: docRef.id, ...cat, featureId: quizFeature.id, quizCount: 0, isPublished: true, defaultUiMode: "playful" });
          }
          setStatus("✅ Default student categories created! Now import questions from CSV.");
        }
      }
      
      console.log("🔍 Categories before enrichment:", cats.length, "items");

      // Enrich categories with quiz counts - SIMPLIFIED VERSION
      console.log("🔄 Starting category enrichment process...");
      const enrichedCategories = [];
      
      for (let i = 0; i < cats.length; i++) {
        const cat = cats[i];
        const categoryName = cat.name || cat.label || "UNNAMED";
        console.log(`  [${i+1}/${cats.length}] Processing: ${categoryName} featureId: ${cat.featureId}`);
        
        // SKIP categories with missing names - they're corrupt
        if (!cat.name && !cat.label) {
          console.log(`    ⚠️  Skipping - missing name and label`);
          continue;
        }
        
        let categoryData = { ...cat };
        
        // If category doesn't have a featureId, assign it
        if (!categoryData.featureId && feats.length > 0) {
          console.log("    ⚠️  Missing featureId - assigning...");
          const quizFeature = feats.find(f => f.featureType === "quiz");
          const defaultFeature = quizFeature || feats[0];
          categoryData.featureId = defaultFeature?.id;
          
          // Update Firebase
          if (categoryData.id) {
            try {
              await updateDoc(doc(db, "categories", categoryData.id), { 
                featureId: categoryData.featureId 
              });
              console.log("    ✅ Updated in Firebase");
            } catch (err) {
              console.error("    ❌ Failed to update:", err);
            }
          }
        }
        
        // Get feature type
        const feature = feats.find(f => f.id === categoryData.featureId);
        const featureType = feature?.featureType || "quiz";
        
        // Get quiz count
        let contentCount = categoryData.quizCount || 0;
        if (contentCount === 0 && featureType === "quiz" && categoryData.name) {
          try {
            const questionsQuery = query(
              collection(db, "questions"),
              where("category", "==", categoryData.name)
            );
            const questionsSnap = await getDocs(questionsQuery);
            contentCount = questionsSnap.size;
            console.log("    📊 Found", contentCount, "questions");
          } catch (err) {
            console.error("    ❌ Error counting questions:", err.message);
          }
        }
        
        enrichedCategories.push({ ...categoryData, quizCount: contentCount });
      }

      console.log("✅ Enrichment complete. Final categories:", enrichedCategories);
      console.log("✅ About to call setCategories with", enrichedCategories.length, "items");
      setCategories(enrichedCategories);
      console.log("✅ setCategories called successfully");
      
    } catch (err) {
      console.error("❌ Load error:", err);
      setStatus("❌ Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sync existing quiz categories to Firebase
  // Function to refresh quiz counts for all categories
  const refreshQuizCounts = async () => {
    setLoading(true);
    setStatus("🔄 Refreshing quiz counts...");

    try {
      let updatedCount = 0;
      
      for (const cat of categories) {
        // Get the feature type
        const feature = features.find(f => f.id === cat.featureId);
        const featureType = feature?.featureType || "quiz";

        let contentCount = 0;

        // Count based on feature type
        if (featureType === "quiz") {
          const questionsQuery = query(
            collection(db, "questions"),
            where("category", "==", cat.name)
          );
          const questionsSnap = await getDocs(questionsQuery);
          contentCount = questionsSnap.size;
        } else if (featureType === "puzzle") {
          // For puzzles, count puzzle configurations or levels
          const puzzlesQuery = query(
            collection(db, "puzzles"),
            where("category", "==", cat.name)
          );
          const puzzlesSnap = await getDocs(puzzlesQuery);
          contentCount = puzzlesSnap.size;
        }
        // For custom features, keep count as 0 or implement custom logic

        // Update only if count changed
        if (cat.quizCount !== contentCount) {
          await updateDoc(doc(db, "categories", cat.id), { quizCount: contentCount });
          updatedCount++;
        }
      }

      // Reload data
      await loadData();
      
      if (updatedCount > 0) {
        setStatus(`✅ Updated content counts for ${updatedCount} categories!`);
      } else {
        setStatus("ℹ️ All content counts are already up to date");
      }
    } catch (err) {
      console.error("Refresh counts error:", err);
      setStatus("❌ Failed to refresh counts");
    } finally {
      setLoading(false);
    }
  };

  // Function to reload/refresh categories from Firebase
  const loadCategories = async () => {
    try {
      setLoading(true);
      const catSnap = await getDocs(collection(db, "categories"));
      const cats = catSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      setCategories(cats);
      setStatus(`✅ Loaded ${cats.length} categories from database`);
    } catch (err) {
      console.error("Load categories error:", err);
      setStatus("❌ Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Diagnostic function to check Firebase categories
  const checkFirebaseCategories = async () => {
    try {
      setStatus("🔍 Checking Firebase for categories...");
      const catSnap = await getDocs(collection(db, "categories"));
      console.log("🔍 FIREBASE DIAGNOSTIC CHECK:");
      console.log("   Total documents in 'categories' collection:", catSnap.size);
      console.log("   Raw snapshot:", catSnap);
      
      if (catSnap.size === 0) {
        setStatus("❌ FIREBASE HAS 0 CATEGORIES - The categories collection is empty!");
        console.error("❌ No categories in Firebase");
        return;
      }
      
      const cats = catSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      console.log("✅ Found categories:", cats);
      console.log("✅ Total:", cats.length);
      
      setStatus(`✅ Firebase has ${cats.length} categories (see console for details)`);
    } catch (err) {
      console.error("🚨 Firebase check error:", err);
      setStatus(`❌ Firebase error: ${err.message}`);
    }
  };

  // Function to migrate categories without featureIds
  const migrateCategoriesWithoutFeatureId = async () => {
    try {
      setLoading(true);
      setStatus("🔄 Migrating categories without featureIds...");
      
      // Get all features to find Quiz feature
      const featSnap = await getDocs(collection(db, "features"));
      const feats = featSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const quizFeature = feats.find(f => f.featureType === "quiz") || feats[0];
      
      if (!quizFeature) {
        setStatus("❌ No Quiz feature found. Create a feature first.");
        return;
      }

      // Get all categories
      const catSnap = await getDocs(collection(db, "categories"));
      const cats = catSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Filter categories without featureId
      const categoriesToMigrate = cats.filter(c => !c.featureId);
      
      if (categoriesToMigrate.length === 0) {
        setStatus("✅ All categories already have featureIds!");
        await loadData();
        return;
      }

      // Update each category with the Quiz feature ID
      let updatedCount = 0;
      for (const cat of categoriesToMigrate) {
        try {
          await updateDoc(doc(db, "categories", cat.id), {
            featureId: quizFeature.id,
            isPublished: cat.isPublished !== false ? true : cat.isPublished,
          });
          updatedCount++;
        } catch (err) {
          console.error(`Failed to update category ${cat.id}:`, err);
        }
      }

      setStatus(`✅ Migrated ${updatedCount} categories! Reloading...`);
      await loadData();
    } catch (err) {
      console.error("Migration error:", err);
      setStatus("❌ Migration failed");
    } finally {
      setLoading(false);
    }
  };

  // Function to clean up duplicate categories
  const cleanupDuplicateCategories = async () => {
    try {
      setLoading(true);
      setStatus("🔄 Cleaning up duplicate categories...");
      
      // Get all categories
      const catSnap = await getDocs(collection(db, "categories"));
      const cats = catSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Group categories by name (case-insensitive)
      const grouped = {};
      cats.forEach(cat => {
        const nameLower = (cat.name || cat.label || "").toLowerCase();
        if (!grouped[nameLower]) {
          grouped[nameLower] = [];
        }
        grouped[nameLower].push(cat);
      });

      // Find duplicates and keep the one with more quiz count
      let deletedCount = 0;
      for (const nameGroup of Object.values(grouped)) {
        if (nameGroup.length > 1) {
          // Sort by quizCount descending (keep the one with more quizzes)
          nameGroup.sort((a, b) => (b.quizCount || 0) - (a.quizCount || 0));
          
          // Delete all except the first one
          for (let i = 1; i < nameGroup.length; i++) {
            try {
              await deleteDoc(doc(db, "categories", nameGroup[i].id));
              deletedCount++;
              console.log(`Deleted duplicate: ${nameGroup[i].label || nameGroup[i].name}`);
            } catch (err) {
              console.error(`Failed to delete category ${nameGroup[i].id}:`, err);
            }
          }
        }
      }

      setStatus(`✅ Cleanup complete! Deleted ${deletedCount} duplicate categories. Reloading...`);
      await loadData();
    } catch (err) {
      console.error("Cleanup error:", err);
      setStatus("❌ Cleanup failed");
    } finally {
      setLoading(false);
    }
  };

  // ==================== CATEGORY OPERATIONS ====================

  const handleAddCategory = async () => {
    if (!categoryForm.name || !categoryForm.label) {
      setStatus("❌ Category name and label are required");
      return;
    }
    if (!categoryForm.featureId) {
      setStatus("❌ Please select a feature for this category");
      return;
    }

    try {
      // Get the feature to determine its type
      const selectedFeature = features.find(f => f.id === categoryForm.featureId);
      const featureType = selectedFeature?.featureType || "quiz";

      // Count content from Firebase for this category
      let quizCount = 0;

      if (featureType === "quiz") {
        const questionsQuery = query(
          collection(db, "questions"),
          where("category", "==", categoryForm.name)
        );
        const questionsSnap = await getDocs(questionsQuery);
        quizCount = questionsSnap.size;
      } else if (featureType === "puzzle") {
        const puzzlesQuery = query(
          collection(db, "puzzles"),
          where("category", "==", categoryForm.name)
        );
        const puzzlesSnap = await getDocs(puzzlesQuery);
        quizCount = puzzlesSnap.size;
      }

      const newCat = {
        name: categoryForm.name,
        label: categoryForm.label,
        icon: categoryForm.icon,
        color: categoryForm.color,
        description: categoryForm.description,
        featureId: categoryForm.featureId,
        createdAt: new Date().toISOString(),
        quizCount,
        isPublished: false, // New categories are draft by default
        defaultUiMode: categoryForm.defaultUiMode || "playful", // Add UI mode
      };

      if (editingCategoryId) {
        // Don't change isPublished status when editing
        const existingCat = categories.find(c => c.id === editingCategoryId);
        newCat.isPublished = existingCat?.isPublished || false;
        
        await updateDoc(doc(db, "categories", editingCategoryId), newCat);
        setCategories((c) =>
          c.map((x) => (x.id === editingCategoryId ? { ...x, ...newCat } : x))
        );
        setStatus("✅ Category updated successfully");
        setEditingCategoryId(null);
      } else {
        const docRef = await addDoc(collection(db, "categories"), newCat);
        setCategories((c) => [...c, { id: docRef.id, ...newCat }]);
        setStatus("✅ Category created (Draft). Review and publish to show on Home page");
        
        // Open preview modal for new category
        setTimeout(() => {
          setPreviewCategory({ id: docRef.id, ...newCat });
          setShowPreviewModal(true);
        }, 500);
      }

      setCategoryForm({
        name: "",
        label: "",
        icon: "📚",
        color: "#0284c7",
        description: "",
        featureId: categoryForm.featureId,
        defaultUiMode: "playful",
      });
      setShowCategoryModal(false);
    } catch (err) {
      console.error("Add category error:", err);
      setStatus("❌ Failed to save category");
    }
  };

  const handleEditCategory = (category) => {
    setCategoryForm({
      name: category.name,
      label: category.label,
      icon: category.icon || "📚",
      color: category.color || "#0284c7",
      description: category.description || "",
      featureId: category.featureId || "",
      defaultUiMode: category.defaultUiMode || "playful",
    });
    setEditingCategoryId(category.id);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteDoc(doc(db, "categories", categoryId));
        setCategories((c) => c.filter((x) => x.id !== categoryId));
        setStatus("✅ Category deleted successfully");
      } catch (err) {
        console.error("Delete category error:", err);
        setStatus("❌ Failed to delete category");
      }
    }
  };

  const handlePreviewCategory = (category) => {
    setPreviewCategory(category);
    setShowPreviewModal(true);
  };

  const handlePublishCategory = async (categoryId) => {
    try {
      await updateDoc(doc(db, "categories", categoryId), {
        isPublished: true,
      });
      setCategories((c) =>
        c.map((x) => (x.id === categoryId ? { ...x, isPublished: true } : x))
      );
      setStatus("✅ Category published to Home page");
      setShowPreviewModal(false);
    } catch (err) {
      console.error("Publish category error:", err);
      setStatus("❌ Failed to publish category");
    }
  };

  const handleUnpublishCategory = async (categoryId) => {
    if (window.confirm("Remove this category from Home page?")) {
      try {
        await updateDoc(doc(db, "categories", categoryId), {
          isPublished: false,
        });
        setCategories((c) =>
          c.map((x) => (x.id === categoryId ? { ...x, isPublished: false } : x))
        );
        setStatus("✅ Category removed from Home page");
      } catch (err) {
        console.error("Unpublish category error:", err);
        setStatus("❌ Failed to unpublish category");
      }
    }
  };

  // ==================== SUBCATEGORY OPERATIONS ====================

  // ============== TOPIC FUNCTIONS (Step 3) ==============
  
  const loadTopics = async (categoryId) => {
    if (!categoryId) return;
    try {
      const topicsQuery = query(
        collection(db, "topics"),
        where("categoryId", "==", categoryId)
      );
      const topicsSnap = await getDocs(topicsQuery);
      let topicsList = topicsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      
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
    }
  };

  const handleAddTopic = async () => {
    if (!topicForm.name || !topicForm.label) {
      setStatus("❌ Topic name and label are required");
      return;
    }
    if (!selectedCategoryId) {
      setStatus("❌ Please select a category first");
      return;
    }

    try {
      const topicData = {
        name: topicForm.name,
        label: topicForm.label,
        icon: topicForm.icon,
        description: topicForm.description,
        sortOrder: parseInt(topicForm.sortOrder) || 0,
        isPublished: topicForm.isPublished,
        categoryId: selectedCategoryId,
        subtopicCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (editingTopicId) {
        await updateDoc(doc(db, "topics", editingTopicId), {
          ...topicData,
          updatedAt: new Date(),
        });
        setStatus("✅ Topic updated successfully!");
      } else {
        await addDoc(collection(db, "topics"), topicData);
        setStatus("✅ Topic created successfully!");
      }

      // Reset form
      setTopicForm({
        name: "",
        label: "",
        icon: "📚",
        description: "",
        sortOrder: 0,
        categoryId: "",
        isPublished: true,
      });
      setEditingTopicId(null);
      setShowTopicModal(false);

      // Reload topics
      await loadTopics(selectedCategoryId);
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error("Add/Edit topic error:", err);
      setStatus("❌ Failed to save topic: " + err.message);
    }
  };

  const handleEditTopic = (topic) => {
    setTopicForm({
      name: topic.name,
      label: topic.label || topic.name,
      icon: topic.icon || "📚",
      description: topic.description || "",
      sortOrder: topic.sortOrder || 0,
      categoryId: topic.categoryId,
      isPublished: topic.isPublished !== false,
    });
    setEditingTopicId(topic.id);
    setShowTopicModal(true);
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm("Delete this topic? This may affect subtopics using it.")) return;
    try {
      await deleteDoc(doc(db, "topics", topicId));
      setStatus("✅ Topic deleted successfully!");
      await loadTopics(selectedCategoryId);
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error("Delete topic error:", err);
      setStatus("❌ Failed to delete topic");
    }
  };

  const handleToggleTopicPublish = async (topic) => {
    try {
      await updateDoc(doc(db, "topics", topic.id), {
        isPublished: !topic.isPublished,
        updatedAt: new Date(),
      });
      await loadTopics(selectedCategoryId);
    } catch (err) {
      console.error("Toggle topic publish error:", err);
    }
  };

  // ============== SUBCATEGORY FUNCTIONS (Step 4) ==============

  const loadSubtopics = async (categoryId, topicId = null) => {
    if (!categoryId) return;
    try {
      const subcatsQuery = query(
        collection(db, "subtopics"),
        where("categoryId", "==", categoryId)
      );
      const subcatsSnap = await getDocs(subcatsQuery);
      let subcats = subcatsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      // Filter by topicId if selected
      if (topicId) {
        subcats = subcats.filter(s => s.topicId === topicId);
      }
      
      setSubtopicies(subcats);
    } catch (err) {
      console.error("Load subtopics error:", err);
    }
  };

  const handleAddSubtopic = async () => {
    if (!subtopicForm.name || !subtopicForm.label) {
      setStatus("❌ Subtopic name and label are required");
      return;
    }
    if (!subtopicForm.categoryId) {
      setStatus("❌ Please select a category for this subtopic");
      return;
    }

    try {
      const newSubcat = {
        name: subtopicForm.name,
        label: subtopicForm.label,
        icon: subtopicForm.icon,
        description: subtopicForm.description,
        categoryId: subtopicForm.categoryId,
        topicId: subtopicForm.topicId || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date(),
        quizCount: 0,
        isPublished: true,
      };

      if (editingSubtopicId) {
        await updateDoc(doc(db, "subtopics", editingSubtopicId), newSubcat);
        setSubtopicies((s) =>
          s.map((x) => (x.id === editingSubtopicId ? { ...x, ...newSubcat } : x))
        );
        setStatus("✅ Subtopic updated successfully");
        setEditingSubtopicId(null);
      } else {
        const docRef = await addDoc(collection(db, "subtopics"), newSubcat);
        setSubtopicies((s) => [...s, { id: docRef.id, ...newSubcat }]);
        setStatus("✅ Subtopic created successfully");
      }

      setSubtopicForm({
        name: "",
        label: "",
        icon: "📖",
        description: "",
        categoryId: subtopicForm.categoryId,
        topicId: "",
      });
      setShowSubtopicModal(false);
    } catch (err) {
      console.error("Add subtopic error:", err);
      setStatus("❌ Failed to save subtopic");
    }
  };

  const handleEditSubtopic = (subtopic) => {
    setSubtopicForm({
      name: subtopic.name,
      label: subtopic.label,
      icon: subtopic.icon || "📖",
      description: subtopic.description || "",
      categoryId: subtopic.categoryId || "",
      topicId: subtopic.topicId || "",
    });
    setEditingSubtopicId(subtopic.id);
    setShowSubtopicModal(true);
  };

  const handleDeleteSubtopic = async (subtopicId) => {
    if (window.confirm("Are you sure you want to delete this subtopic?")) {
      try {
        await deleteDoc(doc(db, "subtopics", subtopicId));
        setSubtopicies((s) => s.filter((x) => x.id !== subtopicId));
        setStatus("✅ Subtopic deleted successfully");
      } catch (err) {
        console.error("Delete subtopic error:", err);
        setStatus("❌ Failed to delete subtopic");
      }
    }
  };

  const toggleSubtopicPublish = async (subtopicId, currentStatus) => {
    try {
      await updateDoc(doc(db, "subtopics", subtopicId), {
        isPublished: !currentStatus,
      });
      setSubtopicies((s) =>
        s.map((x) => (x.id === subtopicId ? { ...x, isPublished: !currentStatus } : x))
      );
      setStatus(`✅ Subtopic ${!currentStatus ? "published" : "unpublished"}`);
    } catch (err) {
      console.error("Toggle subtopic error:", err);
      setStatus("❌ Failed to update subtopic status");
    }
  };

  // ==================== FEATURE OPERATIONS ====================

  const handleAddFeature = async () => {
    if (!featureForm.name || !featureForm.label) {
      setStatus("❌ Feature name and label are required");
      return;
    }

    try {
      const newFeat = {
        name: featureForm.name,
        label: featureForm.label,
        description: featureForm.description,
        icon: featureForm.icon,
        enabled: featureForm.enabled,
        featureType: featureForm.featureType || "quiz",
        createdAt: new Date().toISOString(),
      };

      if (editingFeatureId) {
        await updateDoc(doc(db, "features", editingFeatureId), newFeat);
        setFeatures((f) =>
          f.map((x) => (x.id === editingFeatureId ? { ...x, ...newFeat } : x))
        );
        setStatus("✅ Feature updated successfully");
        setEditingFeatureId(null);
      } else {
        const docRef = await addDoc(collection(db, "features"), newFeat);
        setFeatures((f) => [...f, { id: docRef.id, ...newFeat }]);
        setStatus("✅ Feature created successfully");
        setSelectedFeatureId(docRef.id);
      }

      setFeatureForm({
        name: "",
        label: "",
        description: "",
        icon: "✨",
        enabled: true,
        featureType: "quiz",
      });
      setShowFeatureModal(false);
    } catch (err) {
      console.error("Add feature error:", err);
      setStatus("❌ Failed to save feature");
    }
  };

  const handleEditFeature = (feature) => {
    setFeatureForm({
      name: feature.name,
      label: feature.label,
      description: feature.description || "",
      icon: feature.icon || "✨",
      enabled: feature.enabled !== false,
      featureType: feature.featureType || "quiz",
    });
    setEditingFeatureId(feature.id);
    setShowFeatureModal(true);
  };

  const handleDeleteFeature = async (featureId) => {
    if (window.confirm("Are you sure you want to delete this feature?")) {
      try {
        await deleteDoc(doc(db, "features", featureId));
        setFeatures((f) => f.filter((x) => x.id !== featureId));
        setCategories((c) => c.filter((x) => x.featureId !== featureId));
        if (selectedFeatureId === featureId) setSelectedFeatureId(null);
        setStatus("✅ Feature and its categories deleted successfully");
      } catch (err) {
        console.error("Delete feature error:", err);
        setStatus("❌ Failed to delete feature");
      }
    }
  };

  const closeModals = () => {
    setShowCategoryModal(false);
    setShowFeatureModal(false);
    setShowSubtopicModal(false);
    setEditingCategoryId(null);
    setEditingFeatureId(null);
    setEditingSubtopicId(null);
    setCategoryForm({
      name: "",
      label: "",
      icon: "📚",
      color: "#0284c7",
      description: "",
      featureId: selectedFeatureId || "",
    });
    setFeatureForm({
      name: "",
      label: "",
      description: "",
      icon: "✨",
      enabled: true,
    });
    setSubtopicForm({
      name: "",
      label: "",
      icon: "📖",
      description: "",
      categoryId: selectedCategoryId || "",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: 40 }}>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Responsive styles */}
      <style>{`
        /* ========== MOBILE FIRST - VERTICAL STACK ========== */
        .fcm-main-grid {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 20px !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        
        .fcm-features-section {
          max-width: 100% !important;
          width: 100% !important;
          flex-shrink: 0;
        }
        
        .fcm-categories-section {
          max-width: 100% !important;
          width: 100% !important;
          flex-shrink: 0;
        }
        
        .fcm-topics-section {
          max-width: 100% !important;
          width: 100% !important;
          flex-shrink: 0;
        }
        
        .fcm-subtopics-section {
          max-width: 100% !important;
          width: 100% !important;
          flex-shrink: 0;
        }
        
        .fcm-features-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
          max-width: 100% !important;
        }
        
        /* Categories Grid - Vertical list across breakpoints */
        .fcm-categories-grid {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 12px !important;
          max-width: 100% !important;
          width: 100% !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          max-height: 60vh !important;
          padding-right: 12px !important;
        }
        
        .fcm-category-card {
          flex-shrink: 0 !important;
          min-width: auto !important;
        }
        
        /* Subtopicies Grid - Vertical list across breakpoints */
        .fcm-subtopics-grid {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 12px !important;
          max-width: 100% !important;
          width: 100% !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          max-height: 60vh !important;
          padding-right: 12px !important;
        }
        
        .fcm-subtopic-card {
          flex-shrink: 0 !important;
          min-width: 260px !important;
        }
        
        .fcm-header {
          flex-wrap: wrap !important;
          gap: 12px !important;
        }
        
        .fcm-title {
          font-size: clamp(13px, 4vw, 16px) !important;
        }
        
        /* ========== TABLET - 768px+ ========== */
        @media (min-width: 768px) {
          .fcm-main-grid {
            gap: 24px !important;
            grid-template-columns: 1fr !important;
          }
          
          .fcm-features-list {
            display: flex !important;
            flex-direction: column !important;
            max-width: 100% !important;
          }
          
          /* Tablet: Keep categories vertical */
          .fcm-categories-grid {
            display: grid !important;
            grid-template-columns: 1fr !important;
          }
          
          /* Tablet: Keep subtopics vertical */
          .fcm-subtopics-grid {
            display: grid !important;
            grid-template-columns: 1fr !important;
          }
        }
        
        /* ========== DESKTOP - 1024px+ (4-COLUMN LAYOUT) ========== */
        @media (min-width: 1024px) {
          .fcm-main-grid {
            display: grid !important;
            grid-template-columns: 160px minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr) !important;
            gap: 12px !important;
            align-items: start !important;
            width: 100% !important;
          }
          
          .fcm-features-section {
            max-width: 160px !important;
            width: 160px !important;
            flex-shrink: 0 !important;
            grid-column: 1 !important;
          }
          
          .fcm-categories-section {
            max-width: 100% !important;
            width: 100% !important;
            flex-shrink: 0 !important;
            grid-column: 2 !important;
          }
          
          .fcm-topics-section {
            max-width: 100% !important;
            width: 100% !important;
            flex-shrink: 0 !important;
            grid-column: 3 !important;
          }
          
          .fcm-subtopics-section {
            max-width: 100% !important;
            width: 100% !important;
            flex-shrink: 0 !important;
            grid-column: 4 !important;
          }
          
          .fcm-features-list {
            display: flex !important;
            flex-direction: column !important;
            gap: 6px !important;
          }
          
          /* Categories: Vertical list on desktop */
          .fcm-categories-grid {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
          
          .fcm-category-card {
            flex-shrink: 0 !important;
            min-width: auto !important;
            max-width: 100% !important;
          }
          
          /* Subtopicies: Vertical list on desktop */
          .fcm-subtopics-grid {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
          
          .fcm-subtopic-card {
            flex-shrink: 0 !important;
            min-width: auto !important;
            max-width: 100% !important;
          }
          
          /* Topics grid */
          .fcm-topics-grid {
            gap: 8px !important;
          }
        }
        
        /* ========== LARGE DESKTOP - 1440px+ ========== */
        @media (min-width: 1440px) {
          .fcm-main-grid {
            grid-template-columns: 200px 1fr 1fr !important;
            gap: 28px !important;
          }
          
          .fcm-category-card {
            min-width: auto !important;
            max-width: none !important;
          }
          
          .fcm-subtopic-card {
            min-width: 280px !important;
            max-width: 280px !important;
          }
        }
        
        /* ========== SCROLLBAR STYLING ========== */
        .fcm-categories-grid::-webkit-scrollbar,
        .fcm-subtopics-grid::-webkit-scrollbar {
          width: 6px !important;
        }
        
        .fcm-categories-grid::-webkit-scrollbar-track,
        .fcm-subtopics-grid::-webkit-scrollbar-track {
          background: #f1f5f9 !important;
          border-radius: 10px !important;
        }
        
        .fcm-categories-grid::-webkit-scrollbar-thumb,
        .fcm-subtopics-grid::-webkit-scrollbar-thumb {
          background: #cbd5e1 !important;
          border-radius: 10px !important;
        }
        
        .fcm-categories-grid::-webkit-scrollbar-thumb:hover,
        .fcm-subtopics-grid::-webkit-scrollbar-thumb:hover {
          background: #94a3b8 !important;
        }
      `}</style>

      <div style={{ 
        maxWidth: 1400, 
        margin: "0 auto",
        padding: "clamp(12px, 3vw, 24px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ margin: 0 }}>📋 Features & Categories Management</h1>
          <div style={{ display: "flex", gap: 10 }}>
            {/* Removed: checkFirebaseCategories, cleanupDuplicateCategories - not needed in production */}
          </div>

          {/* Subtopicies moved into the main grid below */}
          

        </div>
        
        <div style={{ marginBottom: 20, padding: 16, background: "#f0fdf4", borderRadius: 8, borderLeft: "4px solid #22c55e" }}>
          <div style={{ fontSize: 14, color: "#166534", fontWeight: 700, marginBottom: 12 }}>
            ⚙️ Complete Content Creation Workflow
          </div>
          <div style={{ fontSize: 13, color: "#166534", lineHeight: 1.6 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Step 1: Create Feature (Quiz, Puzzle, Study, etc.)</div>
            <div style={{ paddingLeft: 16, marginBottom: 12 }}>
              • Set Feature Type (quiz, puzzle, study, article)<br />
              • Add icon, label, and display name<br />
              • Publish when ready
            </div>
            
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Step 2: Create Categories (linked to Feature)</div>
            <div style={{ paddingLeft: 16, marginBottom: 12 }}>
              • Select parent feature first<br />
              • Create categories (e.g., Math Quiz, Science Quiz)<br />
              • Set display name, icon, and colors<br />
              • Publish/Draft status available<br />
              • Use "Add Content" button for quick content creation
            </div>
            
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Step 3: Create Subtopicies (via Subtopic Management page)</div>
            <div style={{ paddingLeft: 16, marginBottom: 12 }}>
              • Navigate to <strong>Subtopic Management</strong><br />
              • Select feature and category<br />
              • Create subtopics (e.g., Algebra, Geometry)<br />
              • Use "Add Content" button for quick content creation
            </div>
            
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Step 4: Add Content Items (via Add Content page)</div>
            <div style={{ paddingLeft: 16, marginBottom: 4 }}>
              • Navigate to <strong>Add Content</strong> page (or use quick buttons)<br />
              • Select Feature → Category → Subtopic<br />
              • Form adapts based on feature type:<br />
              <div style={{ paddingLeft: 16, marginTop: 6 }}>
                - <strong>Quiz</strong>: Question, 4 Options, Correct Answer, Difficulty<br />
                - <strong>Puzzle</strong>: Title/Question, Image URL, Solution, Difficulty<br />
                - <strong>Study/Article</strong>: Title, Description, Image URL, Difficulty
              </div>
            </div>
            
            <div style={{ marginTop: 12, padding: 10, background: "#dcfce7", borderRadius: 6, fontSize: 12 }}>
              💡 <strong>Tip:</strong> Use the "Add Content" buttons on category/subtopic cards for pre-filled forms!
            </div>
          </div>
        </div>

        {status && (
          <div
            style={{
              padding: 12,
              marginBottom: 20,
              borderRadius: 8,
              background: status.includes("✅") ? "#d1fae5" : "#fee2e2",
              color: status.includes("✅") ? "#065f46" : "#7f1d1d",
              fontWeight: 600,
            }}
          >
            {status}
          </div>
        )}

        {/* DEBUG PANEL */}
        <div
          style={{
            padding: 12,
            marginBottom: 20,
            borderRadius: 8,
            background: "#f0fdf4",
            fontSize: 12,
            color: "#166534",
            fontFamily: "monospace",
            border: "1px solid #86efac",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 8 }}>🔍 DEBUG INFO:</div>
          <div>Features: {features.length} loaded</div>
          {features.length > 0 && (
            <div style={{ marginTop: 4, paddingLeft: 12 }}>
              {features.map((f, i) => (
                <div key={i}>
                  • {f.label} (ID: {f.id.substring(0, 8)}..., Type: {f.featureType})
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: 8 }}>Categories: {categories.length} loaded</div>
          {categories.length > 0 && (
            <div style={{ marginTop: 4, paddingLeft: 12 }}>
              {categories.map((c, i) => (
                <div key={i}>
                  • {c.label || c.name || "Unnamed"} (FeatureID: {c.featureId ? c.featureId.substring(0, 8) + "..." : "MISSING"})
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: 8 }}>Selected Feature: {selectedFeatureId ? selectedFeatureId.substring(0, 8) + "..." : "NONE"}</div>
          {selectedFeatureId && (
            <div style={{ marginTop: 8 }}>
              Categories for this feature: {categories.filter((c) => c.featureId === selectedFeatureId).length}
            </div>
          )}
        </div>

        <Card style={{ padding: 16 }}>
          <div style={{ 
            display: "grid",
            gap: 20,
          }} className="fcm-main-grid">
          {/* ==================== FEATURES (LEFT SIDEBAR) ==================== */}
          <div className="fcm-features-section">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <h2 style={{ margin: 0, fontSize: "clamp(14px, 5vw, 18px)", fontWeight: 700 }} className="fcm-title">
                ✨ Step 1: Features ({features.length})
              </h2>
              <Button
                onClick={() => {
                  setFeatureForm({
                    name: "",
                    label: "",
                    description: "",
                    icon: "✨",
                    enabled: true,
                    featureType: "quiz",
                  });
                  setEditingFeatureId(null);
                  setShowFeatureModal(true);
                }}
                style={{ padding: "6px 10px", fontSize: 12 }}
              >
                + New
              </Button>
            </div>

            <div className="fcm-features-list">
              {features.map((feat) => (
                <Card
                  key={feat.id}
                  onClick={() => {
                    setSelectedFeatureId(feat.id);
                    setCategoryForm({
                      ...categoryForm,
                      featureId: feat.id,
                    });
                  }}
                  style={{
                    padding: 8,
                    cursor: "pointer",
                    background: selectedFeatureId === feat.id ? "#f0f9ff" : "#fff",
                    borderLeft: `4px solid ${feat.color || "#0284c7"}`,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {/* Card Content */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 14 }}>{feat.icon || "✨"}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: "#0b1220", fontSize: 12 }}>
                          {feat.label}
                        </div>
                        <div style={{ fontSize: 9, color: "#64748b" }}>
                          {categories.filter((c) => c.featureId === feat.id).length} categories
                        </div>
                      </div>
                    </div>

                    {/* Horizontal Action Buttons */}
                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        marginTop: 4,
                        paddingTop: 4,
                        borderTop: "1px solid #e2e8f0",
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        title="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditFeature(feat);
                        }}
                        style={{
                          padding: "6px",
                          fontSize: 14,
                          background: "#dbeafe",
                          color: "#0284c7",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ✏️
                      </Button>
                      <Button
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFeature(feat.id);
                        }}
                        style={{
                          padding: "6px",
                          fontSize: 14,
                          background: "#fee2e2",
                          color: "#dc2626",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {features.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: 20,
                    color: "#64748b",
                    fontSize: 13,
                  }}
                >
                  No features yet.<br />Create one to start!
                </div>
              )}
            </div>
          </div>

          {/* ==================== CATEGORIES (RIGHT MAIN) ==================== */}
          <div className="fcm-categories-section">
            {selectedFeatureId ? (
              <>
                {(() => {
                  const selectedFeature = features.find((f) => f.id === selectedFeatureId);
                  const featureCategories = categories.filter((c) => c.featureId === selectedFeatureId);
                  
                  // DEBUG LOGGING
                  console.log("🔍 DEBUG: selectedFeatureId:", selectedFeatureId);
                  console.log("🔍 DEBUG: selectedFeature:", selectedFeature);
                  console.log("🔍 DEBUG: All categories:", categories);
                  console.log("🔍 DEBUG: Filtered categories for feature:", featureCategories);
                  console.log("🔍 DEBUG: Match comparison - categories with this featureId:", categories.filter(c => {
                    console.log(`   - Category "${c.label || c.name}": featureId=${c.featureId}, matches=${c.featureId === selectedFeatureId}`);
                    return c.featureId === selectedFeatureId;
                  }));
                  
                  return (
                    <>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          marginBottom: 16,
                          paddingBottom: 12,
                          borderBottom: "2px solid #e2e8f0",
                          flexWrap: "wrap",
                          gap: 12,
                        }}
                        className="fcm-header"
                      >
                        <div style={{ flex: 1, minWidth: "200px" }}>
                          <h2 style={{ margin: "0 0 2px 0", fontSize: "clamp(12px, 5vw, 14px)", fontWeight: 700 }} className="fcm-title">
                            📚 Step 2: Categories for {selectedFeature?.label}
                          </h2>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 10,
                              color: "#64748b",
                            }}
                          >
                            {featureCategories.length} categories
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setCategoryForm({
                              name: "",
                              label: "",
                              icon: "📚",
                              color: "#0284c7",
                              description: "",
                              featureId: selectedFeatureId,
                              defaultUiMode: "playful",
                            });
                            setEditingCategoryId(null);
                            setShowCategoryModal(true);
                          }}
                          style={{ padding: "6px 10px", fontSize: 11, whiteSpace: "nowrap" }}
                        >
                          + Add
                        </Button>
                      </div>

                      <div className="fcm-categories-grid">
                        {featureCategories.map((cat) => (
                          <div key={cat.id} className="fcm-category-card">
                            <Card
                              onClick={() => setSelectedCategoryId(cat.id)}
                              style={{
                                padding: 8,
                                borderLeft: `4px solid ${cat.color || "#0284c7"}`,
                                cursor: "pointer",
                                background: selectedCategoryId === cat.id ? "#f0f9ff" : "white",
                              }}
                            >
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {/* Card Content */}
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 14 }}>{cat.icon || "📚"}</span>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: 700, color: "#0b1220", fontSize: 12 }}>
                                    {cat.label || cat.name || "Unnamed"}
                                  </div>
                                  <div style={{ fontSize: 9, color: "#64748b" }}>
                                    {cat.quizCount || 0} {getFeatureName(cat.featureId)}
                                  </div>
                                </div>
                              </div>

                              {cat.description && (
                                <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.3 }}>
                                  {cat.description}
                                </div>
                              )}

                              <div>
                                <span
                                  style={{
                                    fontSize: 8,
                                    fontWeight: 600,
                                    padding: "1px 5px",
                                    borderRadius: 3,
                                    background: cat.isPublished ? "#d1fae5" : "#fef3c7",
                                    color: cat.isPublished ? "#065f46" : "#92400e",
                                  }}
                                >
                                  {cat.isPublished ? "✓ Published" : "Draft"}
                                </span>
                              </div>

                              {/* Horizontal Action Buttons */}
                              <div
                                style={{
                                  display: "flex",
                                  gap: 4,
                                  marginTop: 4,
                                  paddingTop: 4,
                                  borderTop: "1px solid #e2e8f0",
                                  flexWrap: "wrap",
                                }}
                              >
                                <Button
                                  title="Edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCategory(cat);
                                  }}
                                  style={{
                                    padding: "6px",
                                    fontSize: 14,
                                    background: "#dbeafe",
                                    color: "#0284c7",
                                    width: 32,
                                    height: 32,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  ✏️
                                </Button>
                                <Button
                                  title="Preview"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePreviewCategory(cat);
                                  }}
                                  style={{
                                    padding: "6px",
                                    fontSize: 14,
                                    background: "#e0e7ff",
                                    color: "#4f46e5",
                                    width: 32,
                                    height: 32,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  👁️
                                </Button>
                                {cat.isPublished ? (
                                  <Button
                                    title="Hide from Home"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUnpublishCategory(cat.id);
                                    }}
                                    style={{
                                      padding: "6px",
                                      fontSize: 14,
                                      background: "#fed7aa",
                                      color: "#92400e",
                                      width: 32,
                                      height: 32,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    🔕
                                  </Button>
                                ) : (
                                  <Button
                                    title="Publish to Home"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePublishCategory(cat.id);
                                    }}
                                    style={{
                                      padding: "6px",
                                      fontSize: 14,
                                      background: "#d1fae5",
                                      color: "#065f46",
                                      width: 32,
                                      height: 32,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    📣
                                  </Button>
                                )}
                                <Button
                                  title="Delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCategory(cat.id);
                                  }}
                                  style={{
                                    padding: "6px",
                                    fontSize: 14,
                                    background: "#fee2e2",
                                    color: "#dc2626",
                                    width: 32,
                                    height: 32,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  🗑️
                                </Button>
                              </div>
                            </div>
                            </Card>
                          </div>
                        ))}
                        {featureCategories.length === 0 && (
                          <div
                            style={{
                              gridColumn: "1 / -1",
                              textAlign: "center",
                              padding: 40,
                              color: "#64748b",
                              background: "#f8fafc",
                              borderRadius: 12,
                            }}
                          >
                            No categories yet. Create one to get started!
                          </div>
                        )}
                      </div>

                      {/* Subtopicies are shown in the right column (separate section) */}
                    </>
                  );
                })()}
              </>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: 60,
                  color: "#64748b",
                  background: "#f8fafc",
                  borderRadius: 12,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>👈</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                  Select a Feature
                </div>
                <div style={{ fontSize: 13 }}>
                  Click on a feature from the left to view and manage its categories
                </div>
              </div>
            )}
          </div>

          {/* ==================== TOPICS (STEP 3) ==================== */}
          <div className="fcm-topics-section">
            {selectedCategoryId ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: 16,
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                  className="fcm-header"
                >
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <h3 style={{ margin: "0 0 2px 0", fontSize: "clamp(12px, 5vw, 14px)", fontWeight: 700 }} className="fcm-title">
                      📁 Step 3: Topics for {categories.find(c => c.id === selectedCategoryId)?.label}
                    </h3>
                    <p style={{ margin: 0, fontSize: 10, color: "#64748b" }}>
                      {topics.length} topics
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setTopicForm({
                        name: "",
                        label: "",
                        icon: "📚",
                        description: "",
                        sortOrder: 0,
                        categoryId: selectedCategoryId,
                        isPublished: true,
                      });
                      setEditingTopicId(null);
                      setShowTopicModal(true);
                    }}
                    style={{ padding: "6px 10px", fontSize: 11, whiteSpace: "nowrap" }}
                  >
                    + Add
                  </Button>
                </div>

                <div className="fcm-topics-grid" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {topics.map((topic) => (
                    <div
                      key={topic.id}
                      onClick={() => setSelectedTopicId(topic.id)}
                      style={{
                        padding: 8,
                        border: selectedTopicId === topic.id ? "2px solid #3b82f6" : "1px solid #e5e7eb",
                        borderRadius: 6,
                        cursor: "pointer",
                        backgroundColor: selectedTopicId === topic.id ? "#eff6ff" : "white",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 2 }}>
                            {topic.icon} {topic.label || topic.name}
                            <span style={{ fontSize: 9, color: "#666", fontWeight: 400, marginLeft: 4 }}>
                              (#{topic.sortOrder || 0})
                            </span>
                          </div>
                          {topic.description && (
                            <div style={{ fontSize: 10, color: "#666", marginBottom: 2 }}>
                              {topic.description}
                            </div>
                          )}
                          <div style={{ fontSize: 9, color: "#999" }}>
                            {topic.subtopicCount || 0} subtopics •{" "}
                            {topic.isPublished ? "✅ Pub" : "⏸️ Draft"}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditTopic(topic);
                            }}
                            style={{
                              padding: "3px 6px",
                              fontSize: 10,
                              background: "#f3f4f6",
                              border: "1px solid #e5e7eb",
                              borderRadius: 3,
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleTopicPublish(topic);
                            }}
                            style={{
                              padding: "3px 6px",
                              fontSize: 10,
                              background: topic.isPublished ? "#fef3c7" : "#d1fae5",
                              border: "1px solid",
                              borderColor: topic.isPublished ? "#fbbf24" : "#34d399",
                              borderRadius: 3,
                              cursor: "pointer",
                            }}
                          >
                            {topic.isPublished ? "Unpub" : "Pub"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTopic(topic.id);
                            }}
                            style={{
                              padding: "3px 6px",
                              fontSize: 10,
                              background: "#fee2e2",
                              border: "1px solid #fca5a5",
                              borderRadius: 3,
                              cursor: "pointer",
                              color: "#991b1b",
                            }}
                          >
                            Del
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {topics.length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: "#64748b",
                        background: "#f8fafc",
                        borderRadius: 12,
                      }}
                    >
                      No topics yet. Click "+ Add Topic" to create one!
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: 60,
                  color: "#64748b",
                  background: "#f8fafc",
                  borderRadius: 12,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>👈</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                  Select a Category
                </div>
                <div style={{ fontSize: 13 }}>
                  Click on a category to view and manage its topics
                </div>
              </div>
            )}
          </div>

          {/* ==================== SUBTOPICS (STEP 4 - formerly Subtopicies) ==================== */}
          <div className="fcm-subtopics-section">
            {selectedCategoryId ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: 16,
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                  className="fcm-header"
                >
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <h3 style={{ margin: "0 0 2px 0", fontSize: "clamp(12px, 5vw, 14px)", fontWeight: 700 }} className="fcm-title">
                      📑 Step 4: SubTopics
                      {selectedTopicId ? ` - ${topics.find(t => t.id === selectedTopicId)?.label}` : ""}
                    </h3>
                    <p style={{ margin: 0, fontSize: 10, color: "#64748b" }}>
                      {subtopics.length} subtopics
                    </p>
                  </div>
                  <Button
                    title="Add SubTopic"
                    aria-label="Add SubTopic"
                    onClick={() => {
                      setSubtopicForm({
                        name: "",
                        label: "",
                        icon: "📖",
                        description: "",
                        categoryId: selectedCategoryId,
                        topicId: selectedTopicId || "",
                      });
                      setEditingSubtopicId(null);
                      setShowSubtopicModal(true);
                    }}
                    style={{ padding: "6px 10px", fontSize: 11, whiteSpace: "nowrap" }}
                  >
                    + Add
                  </Button>
                </div>

                <div className="fcm-subtopics-grid">
                  {subtopics.map((subcat) => (
                    <div key={subcat.id} className="fcm-subtopic-card">
                      <Card
                        style={{
                          padding: 8,
                          borderLeft: `4px solid #8b5cf6`,
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {/* Card Content */}
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 14 }}>{subcat.icon || "📖"}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, color: "#0b1220", fontSize: 12 }}>
                                {subcat.label || subcat.name || "Unnamed"}
                              </div>
                              <div style={{ fontSize: 9, color: "#64748b" }}>
                                {subcat.quizCount || 0} quizzes
                              </div>
                            </div>
                          </div>

                          {subcat.description && (
                            <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.3 }}>
                              {subcat.description}
                            </div>
                          )}

                          <div>
                            <span
                              style={{
                                fontSize: 8,
                                fontWeight: 600,
                                padding: "1px 5px",
                                borderRadius: 3,
                                background: subcat.isPublished ? "#d1fae5" : "#fef3c7",
                                color: subcat.isPublished ? "#065f46" : "#92400e",
                              }}
                            >
                              {subcat.isPublished ? "✓ Published" : "Draft"}
                            </span>
                          </div>

                          {/* Horizontal Action Buttons */}
                          <div
                            style={{
                              display: "flex",
                              gap: 4,
                              marginTop: 4,
                              paddingTop: 4,
                              borderTop: "1px solid #e2e8f0",
                              flexWrap: "wrap",
                            }}
                          >
                            <Button
                              title="Edit"
                              onClick={() => handleEditSubtopic(subcat)}
                              style={{
                                padding: "4px",
                                fontSize: 12,
                                background: "#dbeafe",
                                color: "#0284c7",
                                width: 28,
                                height: 28,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              ✏️
                            </Button>
                            {subcat.isPublished ? (
                              <Button
                                title="Unpublish"
                                onClick={() => toggleSubtopicPublish(subcat.id, subcat.isPublished)}
                                style={{
                                  padding: "6px",
                                  fontSize: 14,
                                  background: "#fed7aa",
                                  color: "#92400e",
                                  width: 32,
                                  height: 32,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                🔕
                              </Button>
                            ) : (
                              <Button
                                title="Publish"
                                onClick={() => toggleSubtopicPublish(subcat.id, subcat.isPublished)}
                                style={{
                                  padding: "6px",
                                  fontSize: 14,
                                  background: "#d1fae5",
                                  color: "#065f46",
                                  width: 32,
                                  height: 32,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                📣
                              </Button>
                            )}
                            <Button
                              title="Delete"
                              onClick={() => handleDeleteSubtopic(subcat.id)}
                              style={{
                                padding: "6px",
                                fontSize: 14,
                                background: "#fee2e2",
                                color: "#dc2626",
                                width: 32,
                                height: 32,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              🗑️
                            </Button>
                            <Button
                              title="Add Content (Quiz/Puzzle/Study)"
                              onClick={() => {
                                const selectedCategory = categories.find(c => c.id === selectedCategoryId);
                                const selectedFeature = features.find(f => f.id === selectedCategory?.featureId);
                                
                                console.log("Add Content clicked:", {
                                  subtopic: subcat.label,
                                  category: selectedCategory?.label,
                                  feature: selectedFeature?.label,
                                  featureType: selectedFeature?.featureType
                                });
                                
                                // Navigate based on feature type
                                if (selectedFeature?.featureType === "quiz") {
                                  console.log("Navigating to add-content page");
                                  navigate("/admin/add-content", { 
                                    state: { 
                                      preselectedCategory: selectedCategoryId,
                                      preselectedSubtopic: subcat.id,
                                      featureName: selectedFeature?.label || selectedFeature?.name,
                                      categoryName: selectedCategory?.label || selectedCategory?.name,
                                      subtopicName: subcat.label || subcat.name
                                    } 
                                  });
                                } else if (selectedFeature?.featureType === "puzzle") {
                                  console.log("Navigating to puzzles page");
                                  navigate("/admin/puzzles", { 
                                    state: { 
                                      subtopicId: subcat.id,
                                      subtopicName: subcat.label || subcat.name
                                    } 
                                  });
                                } else {
                                  console.log("Feature type not recognized or not set:", selectedFeature);
                                  // Show helpful message with navigation option
                                  const confirmNav = window.confirm(
                                    `This subtopic (${subcat.label || subcat.name}) doesn't have a specific content type configured.\n\n` +
                                    `Feature: ${selectedFeature?.label || "Unknown"}\n` +
                                    `Feature Type: ${selectedFeature?.featureType || "Not Set"}\n\n` +
                                    `Would you like to go to Add Content page anyway?`
                                  );
                                  if (confirmNav) {
                                    navigate("/admin/add-content", { 
                                      state: { 
                                        preselectedCategory: selectedCategoryId,
                                        preselectedSubtopic: subcat.id,
                                        categoryName: selectedCategory?.label || selectedCategory?.name,
                                        subtopicName: subcat.label || subcat.name
                                      } 
                                    });
                                  }
                                }
                              }}
                              style={{
                                padding: "6px",
                                fontSize: 14,
                                background: "#e0e7ff",
                                color: "#4f46e5",
                                width: 32,
                                height: 32,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              ➕
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                  {subtopics.length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 20,
                        color: "#64748b",
                        background: "#faf5ff",
                        borderRadius: 12,
                      }}
                    >
                      No subtopics yet. Create one to organize content!
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: 40,
                  color: "#64748b",
                  background: "#f8fafc",
                  borderRadius: 12,
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>👉</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  Select a Category
                </div>
                <div style={{ fontSize: 12 }}>
                  Choose a category in the middle column to manage its subtopics
                </div>
              </div>
            )}
          </div>
        </div>
        </Card>
      </div>

      {/* ==================== CATEGORY MODAL ==================== */}
      {showCategoryModal && (
        <Modal
          title={editingCategoryId ? "Edit Category" : "Create New Category"}
          onClose={closeModals}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input
              label="Category Name (e.g., 'programming')"
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, name: e.target.value })
              }
              placeholder="e.g., programming"
            />
            <Input
              label="Display Label (e.g., 'Programming')"
              value={categoryForm.label}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, label: e.target.value })
              }
              placeholder="e.g., Programming"
            />
            <Input
              label="Icon"
              value={categoryForm.icon}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, icon: e.target.value })
              }
              placeholder="e.g., 💻"
            />
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
                Color
              </label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="color"
                  value={categoryForm.color}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, color: e.target.value })
                  }
                  style={{
                    width: 50,
                    height: 40,
                    border: "1px solid #e2e8f0",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                />
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  {categoryForm.color}
                </span>
              </div>
            </div>
            <Input
              label="Description (optional)"
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  description: e.target.value,
                })
              }
              placeholder="Category description"
            />
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
                UI Style/Mode
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {UI_MODES.map((mode) => (
                  <label
                    key={mode.value}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: 10,
                      border: categoryForm.defaultUiMode === mode.value ? "2px solid #0284c7" : "2px solid #e2e8f0",
                      borderRadius: 8,
                      cursor: "pointer",
                      background: categoryForm.defaultUiMode === mode.value ? "#dbeafe" : "#fff",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <input
                      type="radio"
                      name="uiMode"
                      value={mode.value}
                      checked={categoryForm.defaultUiMode === mode.value}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, defaultUiMode: e.target.value })
                      }
                      style={{ width: 16, height: 16, cursor: "pointer", marginTop: 2 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#0b1220" }}>
                        {mode.label}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                        {mode.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Button onClick={handleAddCategory} style={{ flex: 1 }}>
                {editingCategoryId ? "Update Category" : "Create Category"}
              </Button>
              <Button
                onClick={closeModals}
                style={{
                  flex: 1,
                  background: "#f3f4f6",
                  color: "#374151",
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ==================== TOPIC MODAL ==================== */}
      {showTopicModal && (
        <Modal
          title={editingTopicId ? "Edit Topic" : "Create New Topic"}
          onClose={() => {
            setShowTopicModal(false);
            setEditingTopicId(null);
            setTopicForm({
              name: "",
              label: "",
              icon: "📚",
              description: "",
              sortOrder: 0,
              categoryId: "",
              isPublished: true,
            });
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input
              label="Topic Name *"
              value={topicForm.name}
              onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
              placeholder="e.g., Animals, Math, Science"
            />
            <Input
              label="Display Label"
              value={topicForm.label}
              onChange={(e) => setTopicForm({ ...topicForm, label: e.target.value })}
              placeholder="Optional - defaults to name"
            />
            <Input
              label="Icon"
              value={topicForm.icon}
              onChange={(e) => setTopicForm({ ...topicForm, icon: e.target.value })}
              placeholder="e.g., 🐾 🧮 🔬"
            />
            <Input
              label="Description"
              value={topicForm.description}
              onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
              placeholder="Brief description of this topic"
            />
            <Input
              label="Sort Order"
              type="number"
              value={topicForm.sortOrder}
              onChange={(e) => setTopicForm({ ...topicForm, sortOrder: e.target.value })}
              placeholder="0"
            />
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={topicForm.isPublished}
                onChange={(e) => setTopicForm({ ...topicForm, isPublished: e.target.checked })}
                style={{ width: 16, height: 16 }}
              />
              <span style={{ fontSize: 14, color: "#374151" }}>Publish this topic</span>
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <Button onClick={handleAddTopic} style={{ flex: 1 }}>
                {editingTopicId ? "Update Topic" : "Create Topic"}
              </Button>
              <Button
                onClick={() => {
                  setShowTopicModal(false);
                  setEditingTopicId(null);
                }}
                style={{ flex: 1, background: "#f3f4f6", color: "#374151" }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ==================== SUBTOPIC MODAL (formerly Subtopic) ==================== */}
      {showSubtopicModal && (
        <Modal
          title={editingSubtopicId ? "Edit SubTopic" : "Create New SubTopic"}
          onClose={closeModals}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input
              label="Subtopic Name (e.g., 'math')"
              value={subtopicForm.name}
              onChange={(e) =>
                setSubtopicForm({ ...subtopicForm, name: e.target.value })
              }
              placeholder="e.g., math"
            />
            <Input
              label="Display Label (e.g., 'Math')"
              value={subtopicForm.label}
              onChange={(e) =>
                setSubtopicForm({ ...subtopicForm, label: e.target.value })
              }
              placeholder="e.g., Math"
            />
            <Input
              label="Icon"
              value={subtopicForm.icon}
              onChange={(e) =>
                setSubtopicForm({ ...subtopicForm, icon: e.target.value })
              }
              placeholder="e.g., 🔢"
            />
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
                Topic (Optional)
              </label>
              <select
                value={subtopicForm.topicId}
                onChange={(e) =>
                  setSubtopicForm({ ...subtopicForm, topicId: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  fontFamily: "inherit",
                  fontSize: 14,
                  backgroundColor: "white",
                }}
              >
                <option value="">-- No Topic --</option>
                {topics.filter(t => t.isPublished).map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.icon} {topic.label || topic.name}
                  </option>
                ))}
              </select>
              {topics.length === 0 && (
                <p style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                  No topics available. Create topics first.
                </p>
              )}
            </div>
            <Input
              label="Description (optional)"
              value={subtopicForm.description}
              onChange={(e) =>
                setSubtopicForm({
                  ...subtopicForm,
                  description: e.target.value,
                })
              }
              placeholder="SubTopic description"
            />
            <div style={{ display: "flex", gap: 10 }}>
              <Button onClick={handleAddSubtopic} style={{ flex: 1 }}>
                {editingSubtopicId ? "Update SubTopic" : "Create SubTopic"}
              </Button>
              <Button
                onClick={closeModals}
                style={{
                  flex: 1,
                  background: "#f3f4f6",
                  color: "#374151",
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ==================== FEATURE MODAL ==================== */}
      {showFeatureModal && (
        <Modal
          title={editingFeatureId ? "Edit Feature" : "Create New Feature"}
          onClose={closeModals}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input
              label="Feature Name (e.g., 'quiz')"
              value={featureForm.name}
              onChange={(e) =>
                setFeatureForm({ ...featureForm, name: e.target.value })
              }
              placeholder="e.g., quiz"
            />
            <Input
              label="Display Label (e.g., 'Quiz')"
              value={featureForm.label}
              onChange={(e) =>
                setFeatureForm({ ...featureForm, label: e.target.value })
              }
              placeholder="e.g., Quiz"
            />
            <Input
              label="Icon"
              value={featureForm.icon}
              onChange={(e) =>
                setFeatureForm({ ...featureForm, icon: e.target.value })
              }
              placeholder="e.g., 🎯"
            />
            <Input
              label="Description (optional)"
              value={featureForm.description}
              onChange={(e) =>
                setFeatureForm({
                  ...featureForm,
                  description: e.target.value,
                })
              }
              placeholder="Feature description"
            />
            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14 }}>
                Feature Type
              </label>
              <select
                value={featureForm.featureType}
                onChange={(e) =>
                  setFeatureForm({ ...featureForm, featureType: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "2px solid #e2e8f0",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                <option value="quiz">Quiz (Questions & Answers)</option>
                <option value="puzzle">Puzzle (Interactive Games)</option>
                <option value="custom">Custom (Other Content)</option>
              </select>
              <p style={{ margin: "6px 0 0 0", fontSize: 12, color: "#64748b" }}>
                {featureForm.featureType === "quiz" && "Admin creates questions via Admin → Add Question"}
                {featureForm.featureType === "puzzle" && "Admin creates puzzle configurations"}
                {featureForm.featureType === "custom" && "Custom content management"}
              </p>
            </div>
            <div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                <input
                  type="checkbox"
                  checked={featureForm.enabled}
                  onChange={(e) =>
                    setFeatureForm({ ...featureForm, enabled: e.target.checked })
                  }
                  style={{ width: 16, height: 16, cursor: "pointer" }}
                />
                Feature Enabled
              </label>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Button onClick={handleAddFeature} style={{ flex: 1 }}>
                {editingFeatureId ? "Update Feature" : "Create Feature"}
              </Button>
              <Button
                onClick={closeModals}
                style={{
                  flex: 1,
                  background: "#f3f4f6",
                  color: "#374151",
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ==================== PREVIEW MODAL ==================== */}
      {showPreviewModal && previewCategory && (
        <Modal
          title="Preview Category"
          onClose={() => setShowPreviewModal(false)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Preview Card */}
            <div
              style={{
                backgroundImage: `linear-gradient(135deg, ${previewCategory.color || '#e0e7ff'} 0%, ${previewCategory.borderColor || '#c7d2fe'} 100%)`,
                minHeight: 150,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                borderRadius: 8
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>
                {previewCategory.icon}
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
                {previewCategory.label}
              </div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>
                {previewCategory.quizCount || 0} {getFeatureName(previewCategory.featureId)}
              </div>
            </div>

            {/* Details */}
            <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8 }}>
              <div style={{ fontSize: 13, marginBottom: 12 }}>
                <div style={{ fontWeight: 600, color: "#0b1220", marginBottom: 4 }}>
                  Category Details:
                </div>
                <div style={{ color: "#64748b", lineHeight: 1.6 }}>
                  <div><strong>Name:</strong> {previewCategory.name}</div>
                  <div><strong>Label:</strong> {previewCategory.label}</div>
                  <div><strong>Icon:</strong> {previewCategory.icon}</div>
                  {previewCategory.description && (
                    <div><strong>Description:</strong> {previewCategory.description}</div>
                  )}
                  <div><strong>Status:</strong> {previewCategory.isPublished ? "Published" : "Draft"}</div>
                  <div>
                    <strong>UI Style:</strong> {UI_MODES.find(m => m.value === (previewCategory.defaultUiMode || "playful"))?.label || "🎨 Playful & Fun"}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Notification */}
            <div
              style={{
                padding: 12,
                background: previewCategory.isPublished ? "#d1fae5" : "#fef3c7",
                color: previewCategory.isPublished ? "#065f46" : "#92400e",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {previewCategory.isPublished
                ? "✓ This category is visible on the Home page"
                : "⚠️ This category is a draft and NOT visible on the Home page yet"}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              {!previewCategory.isPublished ? (
                <Button
                  onClick={() => handlePublishCategory(previewCategory.id)}
                  style={{
                    flex: 1,
                    background: "#10b981",
                    color: "white",
                  }}
                >
                  ✓ Publish to Home Page
                </Button>
              ) : (
                <Button
                  onClick={() => handleUnpublishCategory(previewCategory.id)}
                  style={{
                    flex: 1,
                    background: "#f59e0b",
                    color: "white",
                  }}
                >
                  Hide from Home Page
                </Button>
              )}
              <Button
                onClick={() => setShowPreviewModal(false)}
                style={{
                  flex: 1,
                  background: "#e5e7eb",
                  color: "#374151",
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
