// src/admin/FeatureCategoryManagement-Refactored.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import AdminLayout from "./AdminLayout";

// Components
import FeaturesList from "./features/FeaturesList";
import CategoriesList from "./features/CategoriesList";
import TopicsList from "./features/TopicsList";
import SubTopicsList from "./features/SubTopicsList";
import FlowVisualization from "./features/FlowVisualization";

// Hooks
import { useFeatureData } from "./features/hooks/useFeatureData";
import { useCategoryData } from "./features/hooks/useCategoryData";
import { useTopicData } from "./features/hooks/useTopicData";
import { useSubtopicData } from "./features/hooks/useSubtopicData";

// Constants
import { 
  INITIAL_FEATURE_FORM, 
  INITIAL_CATEGORY_FORM, 
  INITIAL_TOPIC_FORM, 
  INITIAL_SUBTOPIC_FORM 
} from "./features/constants";

// Import modals (we'll create these next)
import FeatureModal from "./features/modals/FeatureModal";
import CategoryModal from "./features/modals/CategoryModal";
import TopicModal from "./features/modals/TopicModal";
import SubtopicModal from "./features/modals/SubtopicModal";
import AddPuzzleModal from "./modals/AddPuzzleModal";

export default function FeatureCategoryManagement() {
  // Custom hooks for data management
  const featureData = useFeatureData();
  const categoryData = useCategoryData();
  const topicData = useTopicData();
  const subtopicData = useSubtopicData();

  // Selection state
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  // Modal states
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showSubtopicModal, setShowSubtopicModal] = useState(false);
  const [showAddPuzzleModal, setShowAddPuzzleModal] = useState(false);
  const [addPuzzleData, setAddPuzzleData] = useState({ category: null, categoryName: '', topic: null, topicName: '' });

  // Form states
  const [featureForm, setFeatureForm] = useState(INITIAL_FEATURE_FORM);
  const [categoryForm, setCategoryForm] = useState(INITIAL_CATEGORY_FORM);
  const [topicForm, setTopicForm] = useState(INITIAL_TOPIC_FORM);
  const [subtopicForm, setSubtopicForm] = useState(INITIAL_SUBTOPIC_FORM);

  // Editing IDs
  const [editingFeatureId, setEditingFeatureId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [editingSubtopicId, setEditingSubtopicId] = useState(null);

  // Additional state for visualization - all topics and subtopics
  const [allTopics, setAllTopics] = useState([]);
  const [allSubtopics, setAllSubtopics] = useState([]);
  const [allPuzzles, setAllPuzzles] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Collapse/Expand state for sections
  const [expandedSections, setExpandedSections] = useState({
    features: true,
    categories: true,
    topics: true,
    subtopics: false,
    puzzleFeatures: true,
    puzzleCategories: true,
    puzzleTypes: true
  });

  // Refs to track what has been loaded to prevent redundant calls
  const loadedCategoriesRef = useRef(new Set());
  const visualizationLoadedRef = useRef(false);

  // Load categories when features are loaded
  useEffect(() => {
    if (featureData.features.length > 0 && categoryData.categories.length === 0) {
      categoryData.loadCategories(featureData.features);
    }
  }, [featureData.features.length]); // Only depend on length, not the entire array

  // Auto-select first feature after data loads
  useEffect(() => {
    if (featureData.features.length > 0 && categoryData.categories.length > 0 && !selectedFeatureId) {
      const puzzleFeature = featureData.features.find(f => f.featureType === "puzzle");
      const selectedFeature = puzzleFeature || featureData.features.find(f => f.featureType === "quiz") || featureData.features[0];
      if (selectedFeature) {
        setSelectedFeatureId(selectedFeature.id);
        setCategoryForm(prev => ({ ...prev, featureId: selectedFeature.id }));
      }
    }
  }, [featureData.features.length, categoryData.categories.length]);

  // Don't load topics on category selection - we use allTopics from visualization
  // This prevents the blinking/reloading issue
  useEffect(() => {
    if (!selectedCategoryId) {
      setSelectedTopicId(null);
    }
  }, [selectedCategoryId]);

  // Function to refresh visualization data
  const refreshVisualizationData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Import Firebase functions
      const { collection, getDocs } = await import("firebase/firestore");
      const { db } = await import("../firebase/firebaseConfig");
      
      // Load all topics
      const topicsSnap = await getDocs(collection(db, "topics"));
      const allTopicsData = topicsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAllTopics(allTopicsData);
      console.log("🔄 Refreshed topics:", allTopicsData.length);
      console.log("📊 Topics data:", allTopicsData.map(t => ({ 
        name: t.name, 
        quizCount: t.quizCount,
        categoryId: t.categoryId 
      })));
      
      // Load all subtopics
      const subcatsSnap = await getDocs(collection(db, "subtopics"));
      const allSubcatsData = subcatsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAllSubtopics(allSubcatsData);
      console.log("🔄 Refreshed subtopics:", allSubcatsData.length);
      console.log("📊 Subtopics data:", allSubcatsData.map(s => ({ 
        name: s.name, 
        quizCount: s.quizCount,
        topicId: s.topicId,
        categoryId: s.categoryId 
      })));

      // Load all puzzles (for puzzle categories)
      const puzzlesSnap = await getDocs(collection(db, "puzzles"));
      const allPuzzlesData = puzzlesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAllPuzzles(allPuzzlesData);
      console.log("🔄 Refreshed puzzles:", allPuzzlesData.length);
      
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []); // Empty dependency array since it doesn't depend on any props/state

  // Load all topics and subtopics for visualization (only once)
  useEffect(() => {
    if (categoryData.categories.length > 0 && !visualizationLoadedRef.current) {
      visualizationLoadedRef.current = true;
      refreshVisualizationData();
    }
  }, [categoryData.categories.length]);

  // Auto-refresh when window regains focus (after import on another tab/page)
  useEffect(() => {
    const handleFocus = () => {
      if (categoryData.categories.length > 0) {
        console.log("👁️ Window focused, refreshing data...");
        visualizationLoadedRef.current = false; // Allow reload
        refreshVisualizationData();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [categoryData.categories.length]);

  // Feature handlers
  const handleSelectFeature = useCallback((featureId) => {
    setSelectedFeatureId(featureId);
    setSelectedCategoryId(null);
    setSelectedTopicId(null);
    setCategoryForm(prev => ({ ...prev, featureId }));
  }, []);

  const handleAddFeature = () => {
    setFeatureForm(INITIAL_FEATURE_FORM);
    setEditingFeatureId(null);
    setShowFeatureModal(true);
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
    if (!window.confirm("Delete this feature? This will affect all its categories.")) return;
    try {
      await featureData.deleteFeature(featureId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleFeaturePublish = async (feature) => {
    try {
      await featureData.updateFeature(feature.id, { enabled: !feature.enabled });
    } catch (err) {
      alert("Failed to update feature");
    }
  };

  // Category handlers
  const handleSelectCategory = useCallback((categoryId) => {
    setSelectedCategoryId(categoryId);
    setSelectedTopicId(null);
    setSubtopicForm(prev => ({ ...prev, categoryId }));
  }, []);

  const handleAddCategory = () => {
    setCategoryForm({ ...INITIAL_CATEGORY_FORM, featureId: selectedFeatureId });
    setEditingCategoryId(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setCategoryForm({
      name: category.name,
      label: category.label,
      icon: category.icon || "📚",
      color: category.color || "#0284c7",
      description: category.description || "",
      featureId: category.featureId,
      defaultUiMode: category.defaultUiMode || "playful",
      imageUrl: category.imageUrl || "",
      imageCrop: category.imageCrop || "cover",
      imageZoom: category.imageZoom || 1,
      imageOffsetX: category.imageOffsetX || 0,
      imageOffsetY: category.imageOffsetY || 0,
    });
    setEditingCategoryId(category.id);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await categoryData.deleteCategory(categoryId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleCategoryPublish = async (category) => {
    try {
      await categoryData.toggleCategoryPublish(category.id, category.isPublished);
    } catch (err) {
      alert("Failed to update category");
    }
  };

  // Topic handlers
  const handleSelectTopic = useCallback((topicId) => {
    setSelectedTopicId(topicId);
  }, []);

  const handleAddTopic = () => {
    setTopicForm({ ...INITIAL_TOPIC_FORM, categoryId: selectedCategoryId });
    setEditingTopicId(null);
    setShowTopicModal(true);
  };

  const handleAddPuzzle = (topic) => {
    // Open modal instead of navigating
    const category = categoryData.categories.find(c => c.id === selectedCategoryId);
    setAddPuzzleData({
      category: selectedCategoryId,
      categoryName: category?.label || category?.name || '',
      topic: topic.id,
      topicName: topic.name || topic.label || '',
    });
    setShowAddPuzzleModal(true);
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
      imageUrl: topic.imageUrl || "",
      imageCrop: topic.imageCrop || "cover",
      imageZoom: topic.imageZoom || 1,
      imageOffsetX: topic.imageOffsetX || 0,
      imageOffsetY: topic.imageOffsetY || 0,
    });
    setEditingTopicId(topic.id);
    setShowTopicModal(true);
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm("Delete this topic?")) return;
    try {
      await topicData.deleteTopic(topicId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleTopicPublish = async (topic) => {
    try {
      await topicData.toggleTopicPublish(topic.id, topic.isPublished);
      // Refresh visualization data to update allTopics
      visualizationLoadedRef.current = false;
      await refreshVisualizationData();
    } catch (err) {
      alert("Failed to update topic");
    }
  };

  // Subtopic handlers
  const handleAddSubtopic = () => {
    setSubtopicForm({ 
      ...INITIAL_SUBTOPIC_FORM, 
      categoryId: selectedCategoryId,
      topicId: selectedTopicId || "",
    });
    setEditingSubtopicId(null);
    setShowSubtopicModal(true);
  };

  const handleEditSubtopic = (subtopic) => {
    setSubtopicForm({
      name: subtopic.name,
      label: subtopic.label,
      icon: subtopic.icon || "📖",
      description: subtopic.description || "",
      categoryId: subtopic.categoryId || "",
      topicId: subtopic.topicId || "",
      imageUrl: subtopic.imageUrl || "",
      imageCrop: subtopic.imageCrop || "cover",
      imageZoom: subtopic.imageZoom || 1,
      imageOffsetX: subtopic.imageOffsetX || 0,
      imageOffsetY: subtopic.imageOffsetY || 0,
    });
    setEditingSubtopicId(subtopic.id);
    setShowSubtopicModal(true);
  };

  const handleDeleteSubtopic = async (subtopicId) => {
    if (!window.confirm("Delete this subtopic?")) return;
    try {
      await subtopicData.deleteSubtopic(subtopicId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleSubtopicPublish = async (subtopic) => {
    try {
      await subtopicData.toggleSubtopicPublish(subtopic.id, subtopic.isPublished);
      // Refresh visualization data to update allSubtopics
      visualizationLoadedRef.current = false;
      await refreshVisualizationData();
    } catch (err) {
      alert("Failed to update subtopic");
    }
  };

  const handleAddQuestion = (subtopic) => {
    // Navigate to the Add Content page with subtopic pre-selected
    window.location.href = `/admin/add-content?subtopic=${subtopic.name}&category=${subtopic.categoryId}`;
  };

  const closeModals = () => {
    setShowFeatureModal(false);
    setShowCategoryModal(false);
    setShowTopicModal(false);
    setShowSubtopicModal(false);
    setEditingFeatureId(null);
    setEditingCategoryId(null);
    setEditingTopicId(null);
    setEditingSubtopicId(null);
  };

  // Combined status from all hooks
  const status = featureData.status || categoryData.status || topicData.status || subtopicData.status;
  const loading = featureData.loading || categoryData.loading || topicData.loading || subtopicData.loading;

  return (
    <AdminLayout>
      <style>{`
        .fcm-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          width: 100%;
        }
        
        @media (min-width: 1024px) {
          .fcm-main-grid {
            grid-template-columns: 160px minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr);
            gap: 12px;
            align-items: start;
          }
          
          .fcm-features-section { grid-column: 1; }
          .fcm-categories-section { grid-column: 2; }
          .fcm-topics-section { grid-column: 3; }
          .fcm-subtopics-section { grid-column: 4; }
        }
        
        .fcm-features-list, .fcm-categories-list, .fcm-topics-list, .fcm-subtopics-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 70vh;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 8px;
        }
        
        /* Enhanced card styling */
        .fcm-features-list > div,
        .fcm-categories-list > div,
        .fcm-topics-list > div,
        .fcm-subtopics-list > div {
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          will-change: transform, box-shadow;
        }
        
        .fcm-features-list > div:hover,
        .fcm-categories-list > div:hover,
        .fcm-topics-list > div:hover,
        .fcm-subtopics-list > div:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        
        /* Prevent layout shift on click */
        .fcm-features-section,
        .fcm-categories-section,
        .fcm-topics-section,
        .fcm-subtopics-section {
          min-height: 200px;
        }
        
        /* Scrollbar styling */
        .fcm-features-list::-webkit-scrollbar,
        .fcm-categories-list::-webkit-scrollbar,
        .fcm-topics-list::-webkit-scrollbar,
        .fcm-subtopics-list::-webkit-scrollbar {
          width: 6px;
        }
        
        .fcm-features-list::-webkit-scrollbar-track,
        .fcm-categories-list::-webkit-scrollbar-track,
        .fcm-topics-list::-webkit-scrollbar-track,
        .fcm-subtopics-list::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        .fcm-features-list::-webkit-scrollbar-thumb,
        .fcm-categories-list::-webkit-scrollbar-thumb,
        .fcm-topics-list::-webkit-scrollbar-thumb,
        .fcm-subtopics-list::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        .fcm-features-list::-webkit-scrollbar-thumb:hover,
        .fcm-categories-list::-webkit-scrollbar-thumb:hover,
        .fcm-topics-list::-webkit-scrollbar-thumb:hover,
        .fcm-subtopics-list::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <div style={{ padding: 24 }}>
        {status && (
          <div style={{
            padding: 12,
            marginBottom: 16,
            background: status.includes("❌") ? "#fee2e2" : "#d1fae5",
            color: status.includes("❌") ? "#991b1b" : "#065f46",
            borderRadius: 8,
            fontSize: 14,
          }}>
            {status}
          </div>
        )}

        {loading && <div style={{ textAlign: "center", padding: 20 }}>Loading...</div>}

        {/* Flow Steps Title */}
        <div style={{ 
          marginBottom: 24,
          padding: 20,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ 
            fontSize: 20, 
            fontWeight: 700, 
            color: "white",
            margin: 0
          }}>
            🎯 Quiz Content Management Flow
          </h2>
          <p style={{
            fontSize: 14,
            color: "white",
            margin: "8px 0 0 0",
            opacity: 0.95,
            fontWeight: 500
          }}>
            Feature → Category → Topic → SubTopic
          </p>
        </div>

        <div className="fcm-main-grid">
          {/* Features Section - QUIZ ONLY */}
          <div className="fcm-features-section">
            <div 
              onClick={() => setExpandedSections(prev => ({ ...prev, features: !prev.features }))}
              style={{
                padding: "12px 16px",
                background: expandedSections.features ? "#667eea" : "#f1f5f9",
                color: expandedSections.features ? "white" : "#1e293b",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: expandedSections.features ? 12 : 0,
                transition: "all 0.2s ease"
              }}
            >
              <span>✨ Quiz Features</span>
              <span style={{ fontSize: 12 }}>{expandedSections.features ? "▼" : "▶"}</span>
            </div>
            {expandedSections.features && (
              <FeaturesList
                features={featureData.features.filter(f => f.featureType !== "puzzle")}
                selectedFeatureId={selectedFeatureId}
                categories={categoryData.categories}
                onSelectFeature={handleSelectFeature}
                onEditFeature={handleEditFeature}
                onDeleteFeature={handleDeleteFeature}
                onToggleFeaturePublish={handleToggleFeaturePublish}
                onAddFeature={handleAddFeature}
              />
            )}
          </div>

          {/* Categories Section - QUIZ ONLY */}
          <div className="fcm-categories-section">
            <div 
              onClick={() => setExpandedSections(prev => ({ ...prev, categories: !prev.categories }))}
              style={{
                padding: "12px 16px",
                background: expandedSections.categories ? "#667eea" : "#f1f5f9",
                color: expandedSections.categories ? "white" : "#1e293b",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: expandedSections.categories ? 12 : 0,
                transition: "all 0.2s ease"
              }}
            >
              <span>📁 Quiz Categories</span>
              <span style={{ fontSize: 12 }}>{expandedSections.categories ? "▼" : "▶"}</span>
            </div>
            {expandedSections.categories && (
              <CategoriesList
                categories={categoryData.categories.filter(c => c.featureType !== "puzzle")}
                selectedCategoryId={selectedCategoryId}
                selectedFeatureId={selectedFeatureId}
                features={featureData.features.filter(f => f.featureType !== "puzzle")}
                topics={allTopics.filter(t => {
                  const cat = categoryData.categories.find(c => c.id === t.categoryId);
                  return cat && cat.featureType !== "puzzle";
                })}
                subtopics={allSubtopics.filter(s => {
                  const topic = allTopics.find(t => t.id === s.topicId);
                  return topic && categoryData.categories.find(c => c.id === topic.categoryId)?.featureType !== "puzzle";
                })}
                onSelectCategory={handleSelectCategory}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onToggleCategoryPublish={handleToggleCategoryPublish}
                onAddCategory={handleAddCategory}
              />
            )}
          </div>

          {/* Topics Section - QUIZ ONLY */}
          <div className="fcm-topics-section">
            <div 
              onClick={() => setExpandedSections(prev => ({ ...prev, topics: !prev.topics }))}
              style={{
                padding: "12px 16px",
                background: expandedSections.topics ? "#667eea" : "#f1f5f9",
                color: expandedSections.topics ? "white" : "#1e293b",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: expandedSections.topics ? 12 : 0,
                transition: "all 0.2s ease"
              }}
            >
              <span>📚 Quiz Topics</span>
              <span style={{ fontSize: 12 }}>{expandedSections.topics ? "▼" : "▶"}</span>
            </div>
            {expandedSections.topics && (
              <TopicsList
                topics={allTopics.filter(t => {
                  const cat = categoryData.categories.find(c => c.id === t.categoryId);
                  return cat && cat.featureType !== "puzzle";
                })}
                selectedTopicId={selectedTopicId}
                selectedCategoryId={selectedCategoryId}
                categories={categoryData.categories.filter(c => c.featureType !== "puzzle")}
                subtopics={allSubtopics.filter(s => {
                  const topic = allTopics.find(t => t.id === s.topicId);
                  return topic && categoryData.categories.find(c => c.id === topic.categoryId)?.featureType !== "puzzle";
                })}
                onSelectTopic={handleSelectTopic}
                onEditTopic={handleEditTopic}
                onDeleteTopic={handleDeleteTopic}
                onToggleTopicPublish={handleToggleTopicPublish}
                onAddTopic={handleAddTopic}
              />
            )}
          </div>

          {/* Subtopics Section - QUIZ ONLY */}
          <div className="fcm-subtopics-section">
            <div 
              onClick={() => setExpandedSections(prev => ({ ...prev, subtopics: !prev.subtopics }))}
              style={{
                padding: "12px 16px",
                background: expandedSections.subtopics ? "#667eea" : "#f1f5f9",
                color: expandedSections.subtopics ? "white" : "#1e293b",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: expandedSections.subtopics ? 12 : 0,
                transition: "all 0.2s ease"
              }}
            >
              <span>❓ Quiz SubTopics</span>
              <span style={{ fontSize: 12 }}>{expandedSections.subtopics ? "▼" : "▶"}</span>
            </div>
            {expandedSections.subtopics && (
              <SubTopicsList
                subtopics={allSubtopics.filter(s => {
                  const topic = allTopics.find(t => t.id === s.topicId);
                  return topic && categoryData.categories.find(c => c.id === topic.categoryId)?.featureType !== "puzzle";
                })}
                selectedTopicId={selectedTopicId}
                selectedCategoryId={selectedCategoryId}
                topics={allTopics.filter(t => {
                  const cat = categoryData.categories.find(c => c.id === t.categoryId);
                  return cat && cat.featureType !== "puzzle";
                })}
                onEditSubtopic={handleEditSubtopic}
                onDeleteSubtopic={handleDeleteSubtopic}
                onToggleSubtopicPublish={handleToggleSubtopicPublish}
                onAddSubtopic={handleAddSubtopic}
                onAddQuestion={handleAddQuestion}
              />
            )}
          </div>
        </div>

        {/* PUZZLE MANAGEMENT SECTION - SEPARATE */}
        <div style={{
          marginTop: 48,
          padding: 20,
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ 
            fontSize: 20, 
            fontWeight: 700, 
            color: "white",
            margin: 0
          }}>
            🧩 Puzzle Management
          </h2>
          <p style={{
            fontSize: 14,
            color: "white",
            margin: "8px 0 0 0",
            opacity: 0.95,
            fontWeight: 500
          }}>
            Simplified: Category → Puzzle Type → Puzzles (No Subtopics)
          </p>
        </div>

        <div className="fcm-main-grid" style={{ marginTop: 20 }}>
          {/* Puzzle Features Section */}
          <div className="fcm-features-section">
            <div 
              onClick={() => setExpandedSections(prev => ({ ...prev, puzzleFeatures: !prev.puzzleFeatures }))}
              style={{
                padding: "12px 16px",
                background: expandedSections.puzzleFeatures ? "#f5576c" : "#ffe5e5",
                color: expandedSections.puzzleFeatures ? "white" : "#1e293b",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: expandedSections.puzzleFeatures ? 12 : 0,
                transition: "all 0.2s ease"
              }}
            >
              <span>✨ Puzzle Features</span>
              <span style={{ fontSize: 12 }}>{expandedSections.puzzleFeatures ? "▼" : "▶"}</span>
            </div>
            {expandedSections.puzzleFeatures && (
              <FeaturesList
                features={featureData.features.filter(f => f.featureType === "puzzle")}
                selectedFeatureId={selectedFeatureId}
                categories={categoryData.categories}
                onSelectFeature={handleSelectFeature}
                onEditFeature={handleEditFeature}
                onDeleteFeature={handleDeleteFeature}
                onToggleFeaturePublish={handleToggleFeaturePublish}
                onAddFeature={handleAddFeature}
              />
            )}
          </div>

          {/* Puzzle Categories Section */}
          <div className="fcm-categories-section">
            <div 
              onClick={() => setExpandedSections(prev => ({ ...prev, puzzleCategories: !prev.puzzleCategories }))}
              style={{
                padding: "12px 16px",
                background: expandedSections.puzzleCategories ? "#f5576c" : "#ffe5e5",
                color: expandedSections.puzzleCategories ? "white" : "#1e293b",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: expandedSections.puzzleCategories ? 12 : 0,
                transition: "all 0.2s ease"
              }}
            >
              <span>📁 Puzzle Categories</span>
              <span style={{ fontSize: 12 }}>{expandedSections.puzzleCategories ? "▼" : "▶"}</span>
            </div>
            {expandedSections.puzzleCategories && (
              <CategoriesList
                categories={categoryData.categories.filter(c => c.featureType === "puzzle")}
                selectedCategoryId={selectedCategoryId}
                selectedFeatureId={selectedFeatureId}
                features={featureData.features.filter(f => f.featureType === "puzzle")}
                topics={allTopics.filter(t => {
                  const cat = categoryData.categories.find(c => c.id === t.categoryId);
                  return cat && cat.featureType === "puzzle";
                })}
                subtopics={[]}
                onSelectCategory={handleSelectCategory}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onToggleCategoryPublish={handleToggleCategoryPublish}
                onAddCategory={handleAddCategory}
              />
            )}
          </div>

          {/* Puzzle Types Section */}
          <div className="fcm-topics-section">
            <div 
              onClick={() => setExpandedSections(prev => ({ ...prev, puzzleTypes: !prev.puzzleTypes }))}
              style={{
                padding: "12px 16px",
                background: expandedSections.puzzleTypes ? "#f5576c" : "#ffe5e5",
                color: expandedSections.puzzleTypes ? "white" : "#1e293b",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: expandedSections.puzzleTypes ? 12 : 0,
                transition: "all 0.2s ease"
              }}
            >
              <span>🎮 Puzzle Types</span>
              <span style={{ fontSize: 12 }}>{expandedSections.puzzleTypes ? "▼" : "▶"}</span>
            </div>
            {expandedSections.puzzleTypes && (
              <TopicsList
                topics={allTopics.filter(t => {
                  const cat = categoryData.categories.find(c => c.id === t.categoryId);
                  return cat && cat.featureType === "puzzle";
                })}
                selectedTopicId={selectedTopicId}
                selectedCategoryId={selectedCategoryId}
                categories={categoryData.categories.filter(c => c.featureType === "puzzle")}
                subtopics={[]}
                onSelectTopic={handleSelectTopic}
                onEditTopic={handleEditTopic}
                onDeleteTopic={handleDeleteTopic}
                onToggleTopicPublish={handleToggleTopicPublish}
                onAddTopic={handleAddTopic}
                onAddPuzzle={handleAddPuzzle}
              />
            )}
          </div>
        </div>

        {/* Flow Visualization */}
        <div style={{ marginTop: 64 }}>
          <FlowVisualization
            key={refreshKey}
            features={featureData.features}
            categories={categoryData.categories}
            topics={allTopics}
            subtopics={allSubtopics}
            puzzles={allPuzzles}
          />
        </div>
      </div>

      {/* Modals */}
      {showFeatureModal && (
        <FeatureModal
          show={showFeatureModal}
          editingId={editingFeatureId}
          form={featureForm}
          setForm={setFeatureForm}
          onSave={async () => {
            if (editingFeatureId) {
              await featureData.updateFeature(editingFeatureId, featureForm);
            } else {
              await featureData.createFeature(featureForm);
            }
            closeModals();
          }}
          onClose={closeModals}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          show={showCategoryModal}
          editingId={editingCategoryId}
          form={categoryForm}
          setForm={setCategoryForm}
          onSave={async () => {
            if (editingCategoryId) {
              await categoryData.updateCategory(editingCategoryId, categoryForm);
            } else {
              await categoryData.createCategory(categoryForm);
            }
            closeModals();
            await categoryData.loadCategories(featureData.features);
          }}
          onClose={closeModals}
        />
      )}

      {showTopicModal && (
        <TopicModal
          show={showTopicModal}
          editingId={editingTopicId}
          form={topicForm}
          setForm={setTopicForm}
          onSave={async () => {
            if (editingTopicId) {
              await topicData.updateTopic(editingTopicId, topicForm);
            } else {
              await topicData.createTopic(topicForm, selectedCategoryId);
            }
            closeModals();
            // Refresh visualization data to update allTopics
            visualizationLoadedRef.current = false;
            await refreshVisualizationData();
          }}
          onClose={closeModals}
        />
      )}

      {showSubtopicModal && (
        <SubtopicModal
          show={showSubtopicModal}
          editingId={editingSubtopicId}
          form={subtopicForm}
          setForm={setSubtopicForm}
          topics={topicData.topics}
          onSave={async () => {
            if (editingSubtopicId) {
              await subtopicData.updateSubtopic(editingSubtopicId, subtopicForm);
            } else {
              await subtopicData.createSubtopic(subtopicForm);
            }
            closeModals();
            // Refresh visualization data to update allSubtopics
            visualizationLoadedRef.current = false;
            await refreshVisualizationData();
          }}
          onClose={closeModals}
        />
      )}

      {/* Add Puzzle Modal */}
      <AddPuzzleModal
        isOpen={showAddPuzzleModal}
        onClose={() => setShowAddPuzzleModal(false)}
        category={addPuzzleData.category}
        categoryName={addPuzzleData.categoryName}
        topic={addPuzzleData.topic}
        topicName={addPuzzleData.topicName}
        onSuccess={() => {
          // Refresh puzzle data after successful creation
          visualizationLoadedRef.current = false;
          refreshVisualizationData();
        }}
      />
    </AdminLayout>
  );
}
