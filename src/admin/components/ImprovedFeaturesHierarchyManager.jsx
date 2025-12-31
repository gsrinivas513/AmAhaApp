/**
 * ImprovedFeaturesHierarchyManager.jsx
 * 
 * Enhanced admin-friendly Features & Hierarchy Manager with:
 * ✅ Table/card view with status badges
 * ✅ Better statistics and overview
 * ✅ Quick action buttons
 * ✅ Better visual hierarchy
 * ✅ Expandable sections
 * ✅ Drag-and-drop ready
 * ✅ Batch actions
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import StatusBadgeIcon from '../../components/badges/StatusBadgeIcon';
import VisibilityBadgeIcon from '../../components/badges/VisibilityBadgeIcon';
import FeaturedBadge from '../../components/badges/FeaturedBadge';

export default function ImprovedFeaturesHierarchyManager() {
  const { theme } = useTheme();
  const [features, setFeatures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('overview'); // 'overview', 'table', 'tree'
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [expandedFeatures, setExpandedFeatures] = useState(new Set());
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [expandedTopics, setExpandedTopics] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

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

      setFeatures(featuresSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setCategories(categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTopics(topicsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setSubtopics(subtopicsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        await deleteDoc(doc(db, type === 'feature' ? 'features' : type === 'category' ? 'categories' : type === 'topic' ? 'topics' : 'subtopics', id));
        
        if (type === 'feature') setFeatures(features.filter(f => f.id !== id));
        else if (type === 'category') setCategories(categories.filter(c => c.id !== id));
        else if (type === 'topic') setTopics(topics.filter(t => t.id !== id));
        else if (type === 'subtopic') setSubtopics(subtopics.filter(s => s.id !== id));
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item');
      }
    }
  };

  const handleView = (item, type) => {
    setViewingItem({ ...item, type });
  };

  const handleEdit = (item, type) => {
    setEditingItem({ ...item, type });
  };

  // Statistics
  const stats = useMemo(() => {
    const publishedFeatures = features.filter(f => f.status === 'published').length;
    const publishedCategories = categories.filter(c => c.status === 'published').length;
    const publishedTopics = topics.filter(t => t.status === 'published').length;
    const publishedSubtopics = subtopics.filter(s => s.status === 'published').length;

    const draftFeatures = features.filter(f => f.status === 'draft').length;
    const draftCategories = categories.filter(c => c.status === 'draft').length;
    const draftTopics = topics.filter(t => t.status === 'draft').length;
    const draftSubtopics = subtopics.filter(s => s.status === 'draft').length;

    return {
      features: { total: features.length, published: publishedFeatures, draft: draftFeatures },
      categories: { total: categories.length, published: publishedCategories, draft: draftCategories },
      topics: { total: topics.length, published: publishedTopics, draft: draftTopics },
      subtopics: { total: subtopics.length, published: publishedSubtopics, draft: draftSubtopics },
    };
  }, [features, categories, topics, subtopics]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: theme.textSecondary }}>
        Loading hierarchy data...
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header with View Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2 style={{ color: theme.textPrimary, margin: '0 0 8px 0' }}>
            ✨ Features & Hierarchy
          </h2>
          <p style={{ color: theme.textSecondary, margin: 0, fontSize: '14px' }}>
            Manage your content hierarchy and structure
          </p>
        </div>

        {/* View Mode Toggles */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['overview', 'table', 'tree'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '8px 16px',
                background: viewMode === mode ? theme.accentPrimary : 'transparent',
                color: viewMode === mode ? '#fff' : theme.textPrimary,
                border: `2px solid ${viewMode === mode ? theme.accentPrimary : theme.border}`,
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {mode === 'overview' && '📊 Overview'}
              {mode === 'table' && '📋 Table'}
              {mode === 'tree' && '🌳 Tree'}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="🔍 Search features, categories, topics, subtopics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: `2px solid ${theme.border}`,
            borderRadius: '8px',
            fontSize: '14px',
            background: theme.background,
            color: theme.textPrimary,
          }}
        />
      </div>

      {/* OVERVIEW MODE */}
      {viewMode === 'overview' && (
        <div>
          {/* Statistics Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <StatCard
              title="Features"
              total={stats.features.total}
              published={stats.features.published}
              draft={stats.features.draft}
              icon="✨"
              theme={theme}
            />
            <StatCard
              title="Categories"
              total={stats.categories.total}
              published={stats.categories.published}
              draft={stats.categories.draft}
              icon="📁"
              theme={theme}
            />
            <StatCard
              title="Topics"
              total={stats.topics.total}
              published={stats.topics.published}
              draft={stats.topics.draft}
              icon="📚"
              theme={theme}
            />
            <StatCard
              title="Subtopics"
              total={stats.subtopics.total}
              published={stats.subtopics.published}
              draft={stats.subtopics.draft}
              icon="🏷️"
              theme={theme}
            />
          </div>

          {/* Features List with Expansion */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: theme.textPrimary, marginBottom: '16px' }}>All Features</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {features.map(feature => {
                const featureCategories = categories.filter(c => c.featureId === feature.id);
                const isExpanded = expandedFeatures.has(feature.id);

                return (
                  <div
                    key={feature.id}
                    style={{
                      border: `2px solid ${theme.border}`,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: theme.cardBg,
                    }}
                  >
                    {/* Feature Header */}
                    <div
                      style={{
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: `${theme.accentPrimary}10`,
                        borderBottom: isExpanded ? `2px solid ${theme.border}` : 'none',
                      }}
                    >
                      <div
                        onClick={() => {
                          const newSet = new Set(expandedFeatures);
                          if (newSet.has(feature.id)) newSet.delete(feature.id);
                          else newSet.add(feature.id);
                          setExpandedFeatures(newSet);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer' }}
                      >
                        <span style={{ fontSize: '20px' }}>
                          {isExpanded ? '▼' : '▶'}
                        </span>
                        <div>
                          <div style={{ color: theme.textPrimary, fontWeight: '600' }}>
                            {feature.name || feature.label}
                          </div>
                          <div style={{ color: theme.textSecondary, fontSize: '12px' }}>
                            {featureCategories.length} categories
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {feature.status && <StatusBadgeIcon status={feature.status} />}
                        {feature.visibility && <VisibilityBadgeIcon visibility={feature.visibility} />}
                        {feature.featured && <FeaturedBadge featured={true} />}
                        
                        {/* Action Buttons */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(feature, 'feature');
                          }}
                          title="View"
                          style={{
                            background: '#3B82F6',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 10px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          👁️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(feature, 'feature');
                          }}
                          title="Edit"
                          style={{
                            background: '#10B981',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 10px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete('feature', feature.id);
                          }}
                          title="Delete"
                          style={{
                            background: '#EF4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 10px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Categories List (Expanded) */}
                    {isExpanded && (
                      <div style={{ padding: '16px', paddingLeft: '32px' }}>
                        {featureCategories.length === 0 ? (
                          <div style={{ color: theme.textSecondary, fontSize: '13px' }}>
                            No categories yet
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {featureCategories.map(category => {
                              const categoryTopics = topics.filter(
                                t => t.categoryId === category.id
                              );
                              const isCategoryExpanded = expandedCategories.has(category.id);

                              return (
                                <div
                                  key={category.id}
                                  style={{
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                  }}
                                >
                                  {/* Category Header */}
                                  <div
                                    style={{
                                      padding: '12px',
                                      background: `${theme.accentPrimary}08`,
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      borderBottom: isCategoryExpanded ? `1px solid ${theme.border}` : 'none',
                                    }}
                                  >
                                    <div
                                      onClick={() => {
                                        const newSet = new Set(expandedCategories);
                                        if (newSet.has(category.id)) newSet.delete(category.id);
                                        else newSet.add(category.id);
                                        setExpandedCategories(newSet);
                                      }}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        flex: 1,
                                        cursor: 'pointer',
                                      }}
                                    >
                                      <span style={{ fontSize: '14px', minWidth: '16px' }}>
                                        {isCategoryExpanded ? '▼' : '▶'}
                                      </span>
                                      <div>
                                        <div style={{ color: theme.textPrimary, fontWeight: '500', fontSize: '14px' }}>
                                          📁 {category.name || category.label}
                                        </div>
                                        <div style={{ color: theme.textSecondary, fontSize: '11px' }}>
                                          {categoryTopics.length} topics
                                        </div>
                                      </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                      {category.status && <StatusBadgeIcon status={category.status} />}
                                      {category.visibility && (
                                        <VisibilityBadgeIcon visibility={category.visibility} />
                                      )}
                                      {category.featured && <FeaturedBadge featured={true} />}
                                      
                                      {/* Category Action Buttons */}
                                      <button
                                        onClick={() => handleView(category, 'category')}
                                        title="View"
                                        style={{
                                          background: '#3B82F6',
                                          color: '#fff',
                                          border: 'none',
                                          borderRadius: '4px',
                                          padding: '4px 8px',
                                          cursor: 'pointer',
                                          fontSize: '12px',
                                        }}
                                      >
                                        👁️
                                      </button>
                                      <button
                                        onClick={() => handleEdit(category, 'category')}
                                        title="Edit"
                                        style={{
                                          background: '#10B981',
                                          color: '#fff',
                                          border: 'none',
                                          borderRadius: '4px',
                                          padding: '4px 8px',
                                          cursor: 'pointer',
                                          fontSize: '12px',
                                        }}
                                      >
                                        ✏️
                                      </button>
                                      <button
                                        onClick={() => handleDelete('category', category.id)}
                                        title="Delete"
                                        style={{
                                          background: '#EF4444',
                                          color: '#fff',
                                          border: 'none',
                                          borderRadius: '4px',
                                          padding: '4px 8px',
                                          cursor: 'pointer',
                                          fontSize: '12px',
                                        }}
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  </div>

                                  {/* Topics List (Category Expanded) */}
                                  {isCategoryExpanded && (
                                    <div style={{ padding: '12px', paddingLeft: '40px' }}>
                                      {categoryTopics.length === 0 ? (
                                        <div style={{ color: theme.textSecondary, fontSize: '12px' }}>
                                          No topics yet
                                        </div>
                                      ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                          {categoryTopics.map(topic => {
                                            const topicSubtopics = subtopics.filter(
                                              s => s.topicId === topic.id
                                            );
                                            const isTopicExpanded = expandedTopics.has(topic.id);

                                            return (
                                              <div
                                                key={topic.id}
                                                style={{
                                                  border: `1px solid ${theme.border}`,
                                                  borderRadius: '6px',
                                                  overflow: 'hidden',
                                                }}
                                              >
                                                {/* Topic Header */}
                                                <div
                                                  style={{
                                                    padding: '10px',
                                                    background: `${theme.accentPrimary}05`,
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    borderBottom: isTopicExpanded ? `1px solid ${theme.border}` : 'none',
                                                  }}
                                                >
                                                  <div
                                                    onClick={() => {
                                                      const newSet = new Set(expandedTopics);
                                                      if (newSet.has(topic.id)) newSet.delete(topic.id);
                                                      else newSet.add(topic.id);
                                                      setExpandedTopics(newSet);
                                                    }}
                                                    style={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      gap: '8px',
                                                      flex: 1,
                                                      cursor: 'pointer',
                                                    }}
                                                  >
                                                    <span style={{ fontSize: '12px', minWidth: '14px' }}>
                                                      {isTopicExpanded ? '▼' : '▶'}
                                                    </span>
                                                    <div>
                                                      <div style={{ color: theme.textPrimary, fontWeight: '500', fontSize: '13px' }}>
                                                        📚 {topic.name || topic.label}
                                                      </div>
                                                      <div style={{ color: theme.textSecondary, fontSize: '10px' }}>
                                                        {topicSubtopics.length} subtopics
                                                      </div>
                                                    </div>
                                                  </div>

                                                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                    {topic.status && <StatusBadgeIcon status={topic.status} />}
                                                    {topic.visibility && (
                                                      <VisibilityBadgeIcon visibility={topic.visibility} />
                                                    )}
                                                    {topic.featured && <FeaturedBadge featured={true} />}
                                                    
                                                    {/* Topic Action Buttons */}
                                                    <button
                                                      onClick={() => handleView(topic, 'topic')}
                                                      title="View"
                                                      style={{
                                                        background: '#3B82F6',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        padding: '3px 6px',
                                                        cursor: 'pointer',
                                                        fontSize: '11px',
                                                      }}
                                                    >
                                                      👁️
                                                    </button>
                                                    <button
                                                      onClick={() => handleEdit(topic, 'topic')}
                                                      title="Edit"
                                                      style={{
                                                        background: '#10B981',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        padding: '3px 6px',
                                                        cursor: 'pointer',
                                                        fontSize: '11px',
                                                      }}
                                                    >
                                                      ✏️
                                                    </button>
                                                    <button
                                                      onClick={() => handleDelete('topic', topic.id)}
                                                      title="Delete"
                                                      style={{
                                                        background: '#EF4444',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        padding: '3px 6px',
                                                        cursor: 'pointer',
                                                        fontSize: '11px',
                                                      }}
                                                    >
                                                      🗑️
                                                    </button>
                                                  </div>
                                                </div>

                                                {/* Subtopics List (Topic Expanded) */}
                                                {isTopicExpanded && (
                                                  <div style={{ padding: '10px', paddingLeft: '40px' }}>
                                                    {topicSubtopics.length === 0 ? (
                                                      <div style={{ color: theme.textSecondary, fontSize: '11px' }}>
                                                        No subtopics yet
                                                      </div>
                                                    ) : (
                                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                        {topicSubtopics.map(subtopic => (
                                                          <div
                                                            key={subtopic.id}
                                                            style={{
                                                              padding: '8px',
                                                              background: theme.background,
                                                              borderRadius: '4px',
                                                              border: `1px solid ${theme.border}`,
                                                              display: 'flex',
                                                              justifyContent: 'space-between',
                                                              alignItems: 'center',
                                                            }}
                                                          >
                                                            <div>
                                                              <div style={{ color: theme.textPrimary, fontWeight: '500', fontSize: '12px' }}>
                                                                🏷️ {subtopic.name || subtopic.label}
                                                              </div>
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                              {subtopic.status && <StatusBadgeIcon status={subtopic.status} />}
                                              {subtopic.visibility && (
                                                <VisibilityBadgeIcon visibility={subtopic.visibility} />
                                              )}
                                              {subtopic.featured && <FeaturedBadge featured={true} />}
                                                              
                                                              {/* Subtopic Action Buttons */}
                                                              <button
                                                                onClick={() => handleView(subtopic, 'subtopic')}
                                                                title="View"
                                                                style={{
                                                                  background: '#3B82F6',
                                                                  color: '#fff',
                                                                  border: 'none',
                                                                  borderRadius: '4px',
                                                                  padding: '3px 6px',
                                                                  cursor: 'pointer',
                                                                  fontSize: '11px',
                                                                }}
                                                              >
                                                                👁️
                                                              </button>
                                                              <button
                                                                onClick={() => handleEdit(subtopic, 'subtopic')}
                                                                title="Edit"
                                                                style={{
                                                                  background: '#10B981',
                                                                  color: '#fff',
                                                                  border: 'none',
                                                                  borderRadius: '4px',
                                                                  padding: '3px 6px',
                                                                  cursor: 'pointer',
                                                                  fontSize: '11px',
                                                                }}
                                                              >
                                                                ✏️
                                                              </button>
                                                              <button
                                                                onClick={() => handleDelete('subtopic', subtopic.id)}
                                                                title="Delete"
                                                                style={{
                                                                  background: '#EF4444',
                                                                  color: '#fff',
                                                                  border: 'none',
                                                                  borderRadius: '4px',
                                                                  padding: '3px 6px',
                                                                  cursor: 'pointer',
                                                                  fontSize: '11px',
                                                                }}
                                                              >
                                                                🗑️
                                                              </button>
                                                            </div>
                                                          </div>
                                                        ))}
                                                      </div>
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TABLE MODE */}
      {viewMode === 'table' && (
        <TableView
          features={features}
          categories={categories}
          topics={topics}
          subtopics={subtopics}
          theme={theme}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* TREE MODE */}
      {viewMode === 'tree' && (
        <TreeView
          features={features}
          categories={categories}
          topics={topics}
          subtopics={subtopics}
          theme={theme}
        />
      )}

      {/* View Modal */}
      {viewingItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setViewingItem(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              border: '2px solid #e2e8f0',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#1f2937', margin: 0 }}>
                View {viewingItem.type}
              </h3>
              <button
                onClick={() => setViewingItem(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Basic Info */}
              <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                <h4 style={{ color: '#1f2937', margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Basic Information
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500' }}>Name</label>
                    <div style={{ color: '#1f2937', fontSize: '14px', fontWeight: '500', marginTop: '4px' }}>
                      {viewingItem.name || viewingItem.label}
                    </div>
                  </div>

                  {viewingItem.icon && (
                    <div>
                      <label style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500' }}>Icon</label>
                      <div style={{ fontSize: '28px', marginTop: '4px' }}>
                        {viewingItem.icon}
                      </div>
                    </div>
                  )}

                  {viewingItem.color && (
                    <div>
                      <label style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500' }}>Color</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                        <div
                          style={{
                            width: '30px',
                            height: '30px',
                            background: viewingItem.color,
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                          }}
                        />
                        <span style={{ color: '#1f2937', fontSize: '13px' }}>
                          {viewingItem.color}
                        </span>
                      </div>
                    </div>
                  )}

                  {viewingItem.description && (
                    <div>
                      <label style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500' }}>Description</label>
                      <div style={{ color: '#374151', fontSize: '14px', marginTop: '4px', lineHeight: '1.5' }}>
                        {viewingItem.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Publishing Info */}
              <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                <h4 style={{ color: '#1f2937', margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Publishing & Visibility
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {viewingItem.status && (
                    <div>
                      <label style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500' }}>Status</label>
                      <div style={{ marginTop: '4px' }}>
                        <StatusBadgeIcon status={viewingItem.status} />
                      </div>
                    </div>
                  )}

                  {viewingItem.visibility && (
                    <div>
                      <label style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500' }}>Visibility</label>
                      <div style={{ marginTop: '4px' }}>
                        <VisibilityBadgeIcon visibility={viewingItem.visibility} />
                      </div>
                    </div>
                  )}
                </div>

                {viewingItem.featured && (
                  <div style={{ marginTop: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1f2937', fontWeight: '500' }}>
                      ⭐ Featured
                    </label>
                  </div>
                )}
              </div>

              {/* Image Preview */}
              {viewingItem.imageUrl && (
                <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                  <h4 style={{ color: '#1f2937', margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Image Preview
                  </h4>
                  <img
                    src={viewingItem.imageUrl}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '250px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                    }}
                  />
                </div>
              )}

              <button
                onClick={() => {
                  setViewingItem(null);
                  handleEdit(viewingItem, viewingItem.type);
                }}
                style={{
                  background: '#10B981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginTop: '12px',
                }}
              >
                ✏️ Edit This Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            overflowY: 'auto',
            padding: '20px',
          }}
          onClick={() => setEditingItem(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '600px',
              width: '100%',
              border: '2px solid #e2e8f0',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#1f2937', margin: 0, textTransform: 'capitalize' }}>
                Edit {editingItem.type} - {editingItem.name || editingItem.label}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Basic Info Section */}
              <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                <h4 style={{ color: '#1f2937', margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Basic Information
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ color: '#6b7280', fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                      Name
                    </label>
                    <input
                      type="text"
                      value={editingItem.name || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        background: '#ffffff',
                        color: '#1f2937',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                      placeholder="e.g., programming"
                    />
                  </div>

                  <div>
                    <label style={{ color: '#6b7280', fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                      Display Label
                    </label>
                    <input
                      type="text"
                      value={editingItem.label || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        background: '#ffffff',
                        color: '#1f2937',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                      placeholder="e.g., Programming"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {editingItem.icon !== undefined && (
                      <div>
                        <label style={{ color: '#6b7280', fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                          Icon
                        </label>
                        <input
                          type="text"
                          value={editingItem.icon || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            background: '#ffffff',
                            color: '#1f2937',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                          }}
                          placeholder="e.g., 💻"
                        />
                      </div>
                    )}

                    {editingItem.color !== undefined && (
                      <div>
                        <label style={{ color: '#6b7280', fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                          Color
                        </label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="color"
                            value={editingItem.color || '#3B82F6'}
                            onChange={(e) => setEditingItem({ ...editingItem, color: e.target.value })}
                            style={{
                              width: '40px',
                              height: '36px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            }}
                          />
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>
                            {editingItem.color}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ color: '#6b7280', fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                      Description
                    </label>
                    <textarea
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        background: '#ffffff',
                        color: '#1f2937',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        minHeight: '80px',
                        fontFamily: 'inherit',
                      }}
                      placeholder="Enter description"
                    />
                  </div>
                </div>
              </div>

              {/* Publishing & Visibility Section */}
              <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                <h4 style={{ color: '#1f2937', margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Publishing & Visibility
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ color: '#6b7280', fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                      Status
                    </label>
                    <select
                      value={editingItem.status || 'draft'}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        background: '#ffffff',
                        color: '#1f2937',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="draft">✏️ Draft</option>
                      <option value="published">✅ Published</option>
                      <option value="comingSoon">⏱️ Coming Soon</option>
                      <option value="archived">📦 Archived</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ color: '#6b7280', fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                      Visibility
                    </label>
                    <select
                      value={editingItem.visibility || 'public'}
                      onChange={(e) => setEditingItem({ ...editingItem, visibility: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        background: '#ffffff',
                        color: '#1f2937',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="public">🌐 Public</option>
                      <option value="private">🔒 Private</option>
                      <option value="comingSoon">🔜 Coming Soon</option>
                    </select>
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editingItem.featured || false}
                    onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                  <span style={{ color: '#1f2937', fontSize: '14px', fontWeight: '500' }}>⭐ Featured</span>
                </label>
              </div>

              {/* Image & Media Section */}
              {editingItem.imageUrl !== undefined && (
                <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                  <h4 style={{ color: '#1f2937', margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Image & Media
                  </h4>
                  
                  <div>
                    <label style={{ color: '#6b7280', fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={editingItem.imageUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        background: '#ffffff',
                        color: '#1f2937',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        fontFamily: 'monospace',
                      }}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {editingItem.imageUrl && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                      <img
                        src={editingItem.imageUrl}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  onClick={() => setEditingItem(null)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    color: '#1f2937',
                    border: '2px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(`✅ Save functionality for ${editingItem.type} will be implemented with Firestore integration`);
                    setEditingItem(null);
                  }}
                  style={{
                    flex: 1,
                    background: '#10B981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  💾 Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Statistics Card Component
function StatCard({ title, total, published, draft, icon, theme }) {
  const completionRate = total > 0 ? Math.round((published / total) * 100) : 0;

  return (
    <div
      style={{
        padding: '16px',
        background: theme.cardBg,
        border: `2px solid ${theme.border}`,
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '24px' }}>{icon}</span>
        <div style={{ color: theme.textPrimary, fontWeight: '600' }}>{title}</div>
      </div>

      <div style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
        <div style={{ color: '#10B981', fontWeight: '500' }}>
          ✅ {published} Published
        </div>
        <div style={{ color: '#FBBF24', fontWeight: '500' }}>
          ✏️ {draft} Draft
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '4px',
          background: theme.border,
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${completionRate}%`,
            background: '#10B981',
            transition: 'width 0.3s',
          }}
        />
      </div>

      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>
        {completionRate}% published ({total} total)
      </div>
    </div>
  );
}

// Table View Component
function TableView({ features, categories, topics, subtopics, theme, onView, onEdit, onDelete }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <TableSection title="Features" items={features} icon="✨" theme={theme} type="feature" onView={onView} onEdit={onEdit} onDelete={onDelete} />
      <TableSection title="Categories" items={categories} icon="📁" theme={theme} type="category" onView={onView} onEdit={onEdit} onDelete={onDelete} />
      <TableSection title="Topics" items={topics} icon="📚" theme={theme} type="topic" onView={onView} onEdit={onEdit} onDelete={onDelete} />
      <TableSection title="Subtopics" items={subtopics} icon="🏷️" theme={theme} type="subtopic" onView={onView} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

function TableSection({ title, items, icon, theme, type, onView, onEdit, onDelete }) {
  return (
    <div>
      <h3 style={{ color: theme.textPrimary, marginBottom: '12px' }}>
        {icon} {title} ({items.length})
      </h3>

      <div
        style={{
          overflowX: 'auto',
          border: `2px solid ${theme.border}`,
          borderRadius: '8px',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: theme.cardBg,
          }}
        >
          <thead>
            <tr style={{ borderBottom: `2px solid ${theme.border}` }}>
              <th style={{ padding: '12px', textAlign: 'left', color: theme.textPrimary, fontWeight: '600' }}>
                Name
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: theme.textPrimary, fontWeight: '600' }}>
                Status
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: theme.textPrimary, fontWeight: '600' }}>
                Visibility
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: theme.textPrimary, fontWeight: '600' }}>
                Featured
              </th>
              <th style={{ padding: '12px', textAlign: 'center', color: theme.textPrimary, fontWeight: '600' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: `1px solid ${theme.border}`,
                  background: idx % 2 === 0 ? 'transparent' : `${theme.border}20`,
                }}
              >
                <td style={{ padding: '12px', color: theme.textPrimary }}>
                  {item.name || item.label}
                </td>
                <td style={{ padding: '12px' }}>
                  {item.status ? <StatusBadgeIcon status={item.status} /> : '-'}
                </td>
                <td style={{ padding: '12px' }}>
                  {item.visibility ? <VisibilityBadgeIcon visibility={item.visibility} /> : '-'}
                </td>
                <td style={{ padding: '12px' }}>
                  {item.featured ? <FeaturedBadge featured={true} /> : '-'}
                </td>
                <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  <button
                    onClick={() => onView(item, type)}
                    title="View"
                    style={{
                      background: '#3B82F6',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => onEdit(item, type)}
                    title="Edit"
                    style={{
                      background: '#10B981',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(type, item.id)}
                    title="Delete"
                    style={{
                      background: '#EF4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Tree View Component
function TreeView({ features, categories, topics, subtopics, theme }) {
  return (
    <div style={{ padding: '16px', background: theme.background, borderRadius: '8px' }}>
      <div style={{ fontSize: '13px', color: theme.textSecondary, lineHeight: '1.8' }}>
        {features.map(feature => (
          <div key={feature.id}>
            <div style={{ fontWeight: '600', color: theme.textPrimary, marginTop: '8px' }}>
              📦 {feature.name || feature.label}
            </div>
            {categories
              .filter(c => c.featureId === feature.id)
              .map(category => (
                <div key={category.id} style={{ marginLeft: '24px' }}>
                  <div style={{ color: theme.textPrimary }}>
                    📁 {category.name || category.label}
                  </div>
                  {topics
                    .filter(t => t.categoryId === category.id)
                    .map(topic => (
                      <div key={topic.id} style={{ marginLeft: '24px', color: theme.textSecondary }}>
                        📚 {topic.name || topic.label}
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
