import React, { useEffect, useState, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, where } from 'firebase/firestore';
import FeatureModal from '../features/modals/FeatureModal';
import CategoryModal from '../features/modals/CategoryModal';
import TopicModal from '../features/modals/TopicModal';
import SubtopicModal from '../features/modals/SubtopicModal';
import { INITIAL_FEATURE_FORM, INITIAL_CATEGORY_FORM, INITIAL_TOPIC_FORM, INITIAL_SUBTOPIC_FORM } from '../features/constants';
import { FEATURES } from '../../constants/FEATURES';

/**
 * Modern Features Manager Component
 * Displays Features → Categories → Topics → Subtopics hierarchy
 * with modern card-based UI and inline editing
 */
export default function ModernFeaturesManager({ theme }) {
  // Data state
  const [features, setFeatures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selection state
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Modal states
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showSubtopicModal, setShowSubtopicModal] = useState(false);

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

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [featuresSnap, categoriesSnap, topicsSnap, subtopicsSnap] = await Promise.all([
        getDocs(collection(db, 'features')),
        getDocs(collection(db, 'categories')),
        getDocs(collection(db, 'topics')),
        getDocs(collection(db, 'subtopics')),
      ]);

      const featuresData = featuresSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const categoriesData = categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const topicsData = topicsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const subtopicsData = subtopicsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      setFeatures(featuresData);
      setCategories(categoriesData);
      setTopics(topicsData);
      setSubtopics(subtopicsData);

      if (featuresData.length > 0) {
        setSelectedFeature(featuresData[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Feature Operations
  const handleAddFeature = () => {
    setEditingFeatureId(null);
    setFeatureForm(INITIAL_FEATURE_FORM);
    setShowFeatureModal(true);
  };

  const handleEditFeature = (feature) => {
    setEditingFeatureId(feature.id);
    setFeatureForm(feature);
    setShowFeatureModal(true);
  };

  const handleSaveFeature = async () => {
    try {
      if (editingFeatureId) {
        await updateDoc(doc(db, 'features', editingFeatureId), featureForm);
        setFeatures(f => f.map(x => x.id === editingFeatureId ? { ...x, ...featureForm } : x));
      } else {
        const newDoc = await addDoc(collection(db, 'features'), {
          ...featureForm,
          createdAt: serverTimestamp(),
        });
        setFeatures([...features, { id: newDoc.id, ...featureForm }]);
      }
      setShowFeatureModal(false);
    } catch (error) {
      console.error('Error saving feature:', error);
    }
  };

  const handleDeleteFeature = async (id) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      try {
        await deleteDoc(doc(db, 'features', id));
        setFeatures(f => f.filter(x => x.id !== id));
        setCategories(c => c.filter(x => x.featureId !== id));
        setSelectedFeature(null);
      } catch (error) {
        console.error('Error deleting feature:', error);
      }
    }
  };

  // Category Operations
  const handleAddCategory = () => {
    if (!selectedFeature) {
      alert('Please select a feature first');
      return;
    }
    setEditingCategoryId(null);
    setCategoryForm({ ...INITIAL_CATEGORY_FORM, featureId: selectedFeature.id });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setCategoryForm(category);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async () => {
    try {
      if (editingCategoryId) {
        await updateDoc(doc(db, 'categories', editingCategoryId), categoryForm);
        setCategories(c => c.map(x => x.id === editingCategoryId ? { ...x, ...categoryForm } : x));
      } else {
        const newDoc = await addDoc(collection(db, 'categories'), {
          ...categoryForm,
          createdAt: serverTimestamp(),
        });
        setCategories([...categories, { id: newDoc.id, ...categoryForm }]);
      }
      setShowCategoryModal(false);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteDoc(doc(db, 'categories', id));
        setCategories(c => c.filter(x => x.id !== id));
        setTopics(t => t.filter(x => x.categoryId !== id));
        setSelectedCategory(null);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  // Topic Operations
  const handleAddTopic = () => {
    if (!selectedCategory) {
      alert('Please select a category first');
      return;
    }
    setEditingTopicId(null);
    setTopicForm({ ...INITIAL_TOPIC_FORM, categoryId: selectedCategory.id, featureId: selectedFeature.id });
    setShowTopicModal(true);
  };

  const handleEditTopic = (topic) => {
    setEditingTopicId(topic.id);
    setTopicForm(topic);
    setShowTopicModal(true);
  };

  const handleSaveTopic = async () => {
    try {
      if (editingTopicId) {
        await updateDoc(doc(db, 'topics', editingTopicId), topicForm);
        setTopics(t => t.map(x => x.id === editingTopicId ? { ...x, ...topicForm } : x));
      } else {
        const newDoc = await addDoc(collection(db, 'topics'), {
          ...topicForm,
          createdAt: serverTimestamp(),
        });
        setTopics([...topics, { id: newDoc.id, ...topicForm }]);
      }
      setShowTopicModal(false);
    } catch (error) {
      console.error('Error saving topic:', error);
    }
  };

  const handleDeleteTopic = async (id) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        await deleteDoc(doc(db, 'topics', id));
        setTopics(t => t.filter(x => x.id !== id));
        setSubtopics(s => s.filter(x => x.topicId !== id));
        setSelectedTopic(null);
      } catch (error) {
        console.error('Error deleting topic:', error);
      }
    }
  };

  // Subtopic Operations
  const handleAddSubtopic = () => {
    if (!selectedTopic) {
      alert('Please select a topic first');
      return;
    }
    setEditingSubtopicId(null);
    setSubtopicForm({
      ...INITIAL_SUBTOPIC_FORM,
      topicId: selectedTopic.id,
      categoryId: selectedCategory.id,
      featureId: selectedFeature.id,
    });
    setShowSubtopicModal(true);
  };

  const handleEditSubtopic = (subtopic) => {
    setEditingSubtopicId(subtopic.id);
    setSubtopicForm(subtopic);
    setShowSubtopicModal(true);
  };

  const handleSaveSubtopic = async () => {
    try {
      if (editingSubtopicId) {
        await updateDoc(doc(db, 'subtopics', editingSubtopicId), subtopicForm);
        setSubtopics(s => s.map(x => x.id === editingSubtopicId ? { ...x, ...subtopicForm } : x));
      } else {
        const newDoc = await addDoc(collection(db, 'subtopics'), {
          ...subtopicForm,
          createdAt: serverTimestamp(),
        });
        setSubtopics([...subtopics, { id: newDoc.id, ...subtopicForm }]);
      }
      setShowSubtopicModal(false);
    } catch (error) {
      console.error('Error saving subtopic:', error);
    }
  };

  const handleDeleteSubtopic = async (id) => {
    if (window.confirm('Are you sure you want to delete this subtopic?')) {
      try {
        await deleteDoc(doc(db, 'subtopics', id));
        setSubtopics(s => s.filter(x => x.id !== id));
      } catch (error) {
        console.error('Error deleting subtopic:', error);
      }
    }
  };

  // Filtered data helpers
  const featuresForDisplay = features;
  const categoriesForFeature = selectedFeature ? categories.filter(c => c.featureId === selectedFeature.id) : [];
  const topicsForCategory = selectedCategory ? topics.filter(t => t.categoryId === selectedCategory.id) : [];
  const subtopicsForTopic = selectedTopic ? subtopics.filter(s => s.topicId === selectedTopic.id) : [];

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: theme.textSecondary }}>Loading features...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '24px', height: '100%', flexWrap: 'wrap' }}>
      {/* Features Column */}
      <div style={{ flex: '0 0 22%', minWidth: '250px', borderRight: `1px solid ${theme.border}`, paddingRight: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: theme.textPrimary }}>
            ✨ Features ({featuresForDisplay.length})
          </h3>
          <button
            onClick={handleAddFeature}
            style={{
              padding: '6px 12px',
              background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.target.style.transform = 'translateY(0)'}
          >
            + Add
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
          {featuresForDisplay.map(feature => (
            <div
              key={feature.id}
              onClick={() => {
                setSelectedFeature(feature);
                setSelectedCategory(null);
                setSelectedTopic(null);
              }}
              style={{
                padding: '12px',
                background: selectedFeature?.id === feature.id ? `${theme.accentPrimary}20` : theme.cardBg,
                border: selectedFeature?.id === feature.id ? `2px solid ${theme.accentPrimary}` : `1px solid ${theme.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={e => {
                if (selectedFeature?.id !== feature.id) {
                  e.currentTarget.style.borderColor = theme.accentPrimary;
                  e.currentTarget.style.background = `${theme.accentPrimary}10`;
                }
              }}
              onMouseOut={e => {
                if (selectedFeature?.id !== feature.id) {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.background = theme.cardBg;
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <span style={{ fontSize: '18px' }}>{feature.icon || '✨'}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: theme.textPrimary }}>
                      {feature.label || feature.name}
                    </div>
                    <div style={{ fontSize: '11px', color: theme.textSecondary }}>
                      {categoriesForFeature.filter(c => c.featureId === feature.id).length} categories
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', borderTop: `1px solid ${theme.border}`, paddingTop: '8px' }}>
                <button
                  onClick={e => { e.stopPropagation(); handleEditFeature(feature); }}
                  style={{
                    flex: 1,
                    padding: '6px',
                    background: '#dbeafe',
                    color: '#0284c7',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={e => { e.stopPropagation(); handleDeleteFeature(feature.id); }}
                  style={{
                    flex: 1,
                    padding: '6px',
                    background: '#fee2e2',
                    color: '#991b1b',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Column */}
      <div style={{ flex: '0 0 22%', minWidth: '250px', borderRight: `1px solid ${theme.border}`, paddingRight: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: theme.textPrimary }}>
            📁 Categories ({categoriesForFeature.length})
          </h3>
          <button
            onClick={handleAddCategory}
            disabled={!selectedFeature}
            style={{
              padding: '6px 12px',
              background: selectedFeature ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})` : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: selectedFeature ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => selectedFeature && (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={e => selectedFeature && (e.target.style.transform = 'translateY(0)')}
          >
            + Add
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
          {categoriesForFeature.length === 0 ? (
            <div style={{ padding: '16px', textAlign: 'center', color: theme.textSecondary, fontSize: '12px' }}>
              Select a feature to view categories
            </div>
          ) : (
            categoriesForFeature.map(category => (
              <div
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedTopic(null);
                }}
                style={{
                  padding: '12px',
                  background: selectedCategory?.id === category.id ? `${theme.accentPrimary}20` : theme.cardBg,
                  border: selectedCategory?.id === category.id ? `2px solid ${theme.accentPrimary}` : `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={e => {
                  if (selectedCategory?.id !== category.id) {
                    e.currentTarget.style.borderColor = theme.accentPrimary;
                    e.currentTarget.style.background = `${theme.accentPrimary}10`;
                  }
                }}
                onMouseOut={e => {
                  if (selectedCategory?.id !== category.id) {
                    e.currentTarget.style.borderColor = theme.border;
                    e.currentTarget.style.background = theme.cardBg;
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <span style={{ fontSize: '16px' }}>📂</span>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: theme.textPrimary }}>
                      {category.name || category.label}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', borderTop: `1px solid ${theme.border}`, paddingTop: '8px' }}>
                  <button
                    onClick={e => { e.stopPropagation(); handleEditCategory(category); }}
                    style={{
                      flex: 1,
                      padding: '6px',
                      background: '#dbeafe',
                      color: '#0284c7',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); handleDeleteCategory(category.id); }}
                    style={{
                      flex: 1,
                      padding: '6px',
                      background: '#fee2e2',
                      color: '#991b1b',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Topics Column */}
      <div style={{ flex: '0 0 22%', minWidth: '250px', borderRight: `1px solid ${theme.border}`, paddingRight: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: theme.textPrimary }}>
            🎯 Topics ({topicsForCategory.length})
          </h3>
          <button
            onClick={handleAddTopic}
            disabled={!selectedCategory}
            style={{
              padding: '6px 12px',
              background: selectedCategory ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})` : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: selectedCategory ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => selectedCategory && (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={e => selectedCategory && (e.target.style.transform = 'translateY(0)')}
          >
            + Add
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
          {topicsForCategory.length === 0 ? (
            <div style={{ padding: '16px', textAlign: 'center', color: theme.textSecondary, fontSize: '12px' }}>
              Select a category to view topics
            </div>
          ) : (
            topicsForCategory.map(topic => (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                style={{
                  padding: '12px',
                  background: selectedTopic?.id === topic.id ? `${theme.accentPrimary}20` : theme.cardBg,
                  border: selectedTopic?.id === topic.id ? `2px solid ${theme.accentPrimary}` : `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={e => {
                  if (selectedTopic?.id !== topic.id) {
                    e.currentTarget.style.borderColor = theme.accentPrimary;
                    e.currentTarget.style.background = `${theme.accentPrimary}10`;
                  }
                }}
                onMouseOut={e => {
                  if (selectedTopic?.id !== topic.id) {
                    e.currentTarget.style.borderColor = theme.border;
                    e.currentTarget.style.background = theme.cardBg;
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <span style={{ fontSize: '16px' }}>📍</span>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: theme.textPrimary }}>
                      {topic.name || topic.label}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', borderTop: `1px solid ${theme.border}`, paddingTop: '8px' }}>
                  <button
                    onClick={e => { e.stopPropagation(); handleEditTopic(topic); }}
                    style={{
                      flex: 1,
                      padding: '6px',
                      background: '#dbeafe',
                      color: '#0284c7',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); handleDeleteTopic(topic.id); }}
                    style={{
                      flex: 1,
                      padding: '6px',
                      background: '#fee2e2',
                      color: '#991b1b',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Subtopics Column */}
      <div style={{ flex: '0 0 22%', minWidth: '250px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: theme.textPrimary }}>
            ✔️ Subtopics ({subtopicsForTopic.length})
          </h3>
          <button
            onClick={handleAddSubtopic}
            disabled={!selectedTopic}
            style={{
              padding: '6px 12px',
              background: selectedTopic ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})` : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: selectedTopic ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => selectedTopic && (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={e => selectedTopic && (e.target.style.transform = 'translateY(0)')}
          >
            + Add
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
          {subtopicsForTopic.length === 0 ? (
            <div style={{ padding: '16px', textAlign: 'center', color: theme.textSecondary, fontSize: '12px' }}>
              Select a topic to view subtopics
            </div>
          ) : (
            subtopicsForTopic.map(subtopic => (
              <div
                key={subtopic.id}
                style={{
                  padding: '12px',
                  background: theme.cardBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = theme.accentPrimary;
                  e.currentTarget.style.background = `${theme.accentPrimary}10`;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.background = theme.cardBg;
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <span style={{ fontSize: '16px' }}>📌</span>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: theme.textPrimary }}>
                      {subtopic.name || subtopic.label}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', borderTop: `1px solid ${theme.border}`, paddingTop: '8px' }}>
                  <button
                    onClick={() => handleEditSubtopic(subtopic)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      background: '#dbeafe',
                      color: '#0284c7',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteSubtopic(subtopic.id)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      background: '#fee2e2',
                      color: '#991b1b',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Feature Modal */}
      {showFeatureModal && (
        <FeatureModal
          show={showFeatureModal}
          editingId={editingFeatureId}
          form={featureForm}
          setForm={setFeatureForm}
          onSave={handleSaveFeature}
          onClose={() => setShowFeatureModal(false)}
        />
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          show={showCategoryModal}
          editingId={editingCategoryId}
          form={categoryForm}
          setForm={setCategoryForm}
          onSave={handleSaveCategory}
          onClose={() => setShowCategoryModal(false)}
        />
      )}

      {/* Topic Modal */}
      {showTopicModal && (
        <TopicModal
          show={showTopicModal}
          editingId={editingTopicId}
          form={topicForm}
          setForm={setTopicForm}
          onSave={handleSaveTopic}
          onClose={() => setShowTopicModal(false)}
        />
      )}

      {/* Subtopic Modal */}
      {showSubtopicModal && (
        <SubtopicModal
          show={showSubtopicModal}
          editingId={editingSubtopicId}
          form={subtopicForm}
          setForm={setSubtopicForm}
          onSave={handleSaveSubtopic}
          onClose={() => setShowSubtopicModal(false)}
        />
      )}
    </div>
  );
}
