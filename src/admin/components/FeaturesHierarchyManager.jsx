import React, { useEffect, useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { db } from '../../firebase/firebaseConfig';
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp 
} from 'firebase/firestore';
import FeatureModal from '../features/modals/FeatureModal';
import CategoryModal from '../features/modals/CategoryModal';
import TopicModal from '../features/modals/TopicModal';
import SubtopicModal from '../features/modals/SubtopicModal';
import { 
  INITIAL_FEATURE_FORM, INITIAL_CATEGORY_FORM, INITIAL_TOPIC_FORM, INITIAL_SUBTOPIC_FORM 
} from '../features/constants';

/**
 * 🎯 IMPROVED Features Hierarchy Manager
 * 
 * Better implementation with:
 * - Tree view with expandable/collapsible nodes
 * - No cascading selection constraints
 * - Full hierarchy visible at once
 * - Better performance (memoized tree building)
 * - Inline action buttons
 * - Search/filter capability
 * - Responsive design
 */
export default function FeaturesHierarchyManager({ theme }) {
  const [features, setFeatures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Expanded state for tree nodes
  const [expandedFeatures, setExpandedFeatures] = useState(new Set());
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [expandedTopics, setExpandedTopics] = useState(new Set());

  // Search/filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modal & form states
  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(null); // 'feature', 'category', 'topic', 'subtopic'
  const [formData, setFormData] = useState({});

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

      setFeatures(featuresSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setCategories(categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTopics(topicsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setSubtopics(subtopicsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Auto-expand first feature
      if (featuresSnap.docs.length > 0) {
        setExpandedFeatures(new Set([featuresSnap.docs[0].id]));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Build hierarchical tree structure (memoized for performance)
  const hierarchyTree = useMemo(() => {
    return features.map(feature => ({
      ...feature,
      categories: categories
        .filter(c => c.featureId === feature.id)
        .map(category => ({
          ...category,
          topics: topics
            .filter(t => t.categoryId === category.id)
            .map(topic => ({
              ...topic,
              subtopics: subtopics.filter(s => s.topicId === topic.id),
            })),
        })),
    }));
  }, [features, categories, topics, subtopics]);

  // Filter tree by search term
  const filteredTree = useMemo(() => {
    if (!searchTerm.trim()) return hierarchyTree;

    const search = searchTerm.toLowerCase();
    return hierarchyTree
      .filter(f => f.label?.toLowerCase().includes(search) || f.name?.toLowerCase().includes(search))
      .map(feature => ({
        ...feature,
        categories: feature.categories
          .filter(c => c.name?.toLowerCase().includes(search) || c.label?.toLowerCase().includes(search))
          .map(category => ({
            ...category,
            topics: category.topics
              .filter(t => t.name?.toLowerCase().includes(search) || t.label?.toLowerCase().includes(search))
              .map(topic => ({
                ...topic,
                subtopics: topic.subtopics.filter(
                  s => s.name?.toLowerCase().includes(search) || s.label?.toLowerCase().includes(search)
                ),
              })),
          })),
      }))
      .filter(f => f.categories.length > 0 || f.label?.toLowerCase().includes(search));
  }, [hierarchyTree, searchTerm]);

  // Save operations
  const handleSave = async () => {
    try {
      const { type, parentData } = editingItem;

      if (!editingItem.id) {
        // Create new
        const newData = { ...formData, createdAt: serverTimestamp() };
        if (parentData) Object.assign(newData, parentData);

        const collectionName = type === 'feature' ? 'features' : 
                              type === 'category' ? 'categories' :
                              type === 'topic' ? 'topics' : 'subtopics';

        const docRef = await addDoc(collection(db, collectionName), newData);
        const newItem = { id: docRef.id, ...newData };

        // Update local state
        if (type === 'feature') setFeatures([...features, newItem]);
        else if (type === 'category') setCategories([...categories, newItem]);
        else if (type === 'topic') setTopics([...topics, newItem]);
        else if (type === 'subtopic') setSubtopics([...subtopics, newItem]);

        // Auto-expand parent if adding to feature
        if (type === 'category' && parentData?.featureId) {
          setExpandedFeatures(new Set([...expandedFeatures, parentData.featureId]));
        }
      } else {
        // Update existing
        const collectionName = type === 'feature' ? 'features' : 
                              type === 'category' ? 'categories' :
                              type === 'topic' ? 'topics' : 'subtopics';

        await updateDoc(doc(db, collectionName, editingItem.id), formData);

        // Update local state
        if (type === 'feature') 
          setFeatures(f => f.map(x => x.id === editingItem.id ? { ...x, ...formData } : x));
        else if (type === 'category')
          setCategories(c => c.map(x => x.id === editingItem.id ? { ...x, ...formData } : x));
        else if (type === 'topic')
          setTopics(t => t.map(x => x.id === editingItem.id ? { ...x, ...formData } : x));
        else if (type === 'subtopic')
          setSubtopics(s => s.map(x => x.id === editingItem.id ? { ...x, ...formData } : x));
      }

      setShowModal(null);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete ${item.label || item.name}? This will delete all child items.`)) return;

    try {
      const type = item.featureId ? (item.categoryId ? (item.topicId ? 'subtopic' : 'topic') : 'category') : 'feature';
      const collectionName = type === 'feature' ? 'features' : 
                            type === 'category' ? 'categories' :
                            type === 'topic' ? 'topics' : 'subtopics';

      await deleteDoc(doc(db, collectionName, item.id));

      // Update local state and cascade
      if (type === 'feature') {
        setCategories(c => c.filter(x => x.featureId !== item.id));
        setTopics(t => t.filter(x => !categories.some(c => c.featureId === item.id && c.id === t.categoryId)));
        setFeatures(f => f.filter(x => x.id !== item.id));
      } else if (type === 'category') {
        setTopics(t => t.filter(x => x.categoryId !== item.id));
        setSubtopics(s => s.filter(x => !topics.some(t => t.categoryId === item.id && t.id === s.topicId)));
        setCategories(c => c.filter(x => x.id !== item.id));
      } else if (type === 'topic') {
        setSubtopics(s => s.filter(x => x.topicId !== item.id));
        setTopics(t => t.filter(x => x.id !== item.id));
      } else {
        setSubtopics(s => s.filter(x => x.id !== item.id));
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const toggleExpand = (id, type) => {
    const setFunc = type === 'feature' ? setExpandedFeatures : 
                   type === 'category' ? setExpandedCategories : setExpandedTopics;
    const current = type === 'feature' ? expandedFeatures : 
                   type === 'category' ? expandedCategories : expandedTopics;

    const newSet = new Set(current);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setFunc(newSet);
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: theme.textSecondary }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
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
            background: theme.cardBg,
            color: theme.textPrimary,
          }}
        />
      </div>

      {/* Add Feature Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => {
            setEditingItem({ type: 'feature' });
            setFormData(INITIAL_FEATURE_FORM);
            setShowModal('feature');
          }}
          style={{
            padding: '10px 20px',
            background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          + Add Feature
        </button>
      </div>

      {/* Hierarchy Tree */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredTree.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: theme.textSecondary }}>
            No features found
          </div>
        ) : (
          filteredTree.map(feature => (
            <FeatureNode
              key={feature.id}
              feature={feature}
              expanded={expandedFeatures.has(feature.id)}
              onToggle={() => toggleExpand(feature.id, 'feature')}
              onEdit={() => {
                setEditingItem({ type: 'feature', id: feature.id });
                setFormData(feature);
                setShowModal('feature');
              }}
              onDelete={() => handleDelete(feature)}
              onAddCategory={() => {
                setEditingItem({ type: 'category', parentData: { featureId: feature.id } });
                setFormData({ ...INITIAL_CATEGORY_FORM, featureId: feature.id });
                setShowModal('category');
              }}
              expandedCategories={expandedCategories}
              expandedTopics={expandedTopics}
              toggleExpandCategory={(id) => toggleExpand(id, 'category')}
              toggleExpandTopic={(id) => toggleExpand(id, 'topic')}
              onEditCategory={(category) => {
                setEditingItem({ type: 'category', id: category.id });
                setFormData(category);
                setShowModal('category');
              }}
              onDeleteCategory={(category) => handleDelete(category)}
              onAddTopic={(category) => {
                setEditingItem({ type: 'topic', parentData: { categoryId: category.id, featureId: feature.id } });
                setFormData({ ...INITIAL_TOPIC_FORM, categoryId: category.id, featureId: feature.id });
                setShowModal('topic');
              }}
              onEditTopic={(topic) => {
                setEditingItem({ type: 'topic', id: topic.id });
                setFormData(topic);
                setShowModal('topic');
              }}
              onDeleteTopic={(topic) => handleDelete(topic)}
              onAddSubtopic={(topic, category) => {
                setEditingItem({ 
                  type: 'subtopic', 
                  parentData: { topicId: topic.id, categoryId: category.id, featureId: feature.id } 
                });
                setFormData({ 
                  ...INITIAL_SUBTOPIC_FORM, 
                  topicId: topic.id, 
                  categoryId: category.id, 
                  featureId: feature.id 
                });
                setShowModal('subtopic');
              }}
              onEditSubtopic={(subtopic) => {
                setEditingItem({ type: 'subtopic', id: subtopic.id });
                setFormData(subtopic);
                setShowModal('subtopic');
              }}
              onDeleteSubtopic={(subtopic) => handleDelete(subtopic)}
              theme={theme}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {showModal === 'feature' && (
        <FeatureModal
          show={true}
          editingId={editingItem?.id || null}
          form={formData}
          setForm={setFormData}
          onSave={handleSave}
          onClose={() => setShowModal(null)}
        />
      )}
      {showModal === 'category' && (
        <CategoryModal
          show={true}
          editingId={editingItem?.id || null}
          form={formData}
          setForm={setFormData}
          onSave={handleSave}
          onClose={() => setShowModal(null)}
        />
      )}
      {showModal === 'topic' && (
        <TopicModal
          show={true}
          editingId={editingItem?.id || null}
          form={formData}
          setForm={setFormData}
          onSave={handleSave}
          onClose={() => setShowModal(null)}
        />
      )}
      {showModal === 'subtopic' && (
        <SubtopicModal
          show={true}
          editingId={editingItem?.id || null}
          form={formData}
          setForm={setFormData}
          onSave={handleSave}
          onClose={() => setShowModal(null)}
        />
      )}
    </div>
  );
}

// Feature Node Component (Tree Node)
function FeatureNode({
  feature, expanded, onToggle, onEdit, onDelete, onAddCategory,
  expandedCategories, expandedTopics,
  toggleExpandCategory, toggleExpandTopic,
  onEditCategory, onDeleteCategory, onAddTopic,
  onEditTopic, onDeleteTopic, onAddSubtopic,
  onEditSubtopic, onDeleteSubtopic,
  theme,
}) {
  return (
    <div>
      {/* Feature Level */}
      <div
        style={{
          padding: '12px 16px',
          background: theme.cardBg,
          border: `2px solid ${theme.accentPrimary}`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <button
            onClick={onToggle}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '4px 8px',
            }}
          >
            {expanded ? '▼' : '▶'}
          </button>
          <span style={{ fontSize: '18px' }}>{feature.icon || '✨'}</span>
          <div>
            <div style={{ fontWeight: '700', color: theme.textPrimary, fontSize: '14px' }}>
              {feature.label || feature.name}
            </div>
            <div style={{ fontSize: '12px', color: theme.textSecondary }}>
              {feature.categories?.length || 0} categories
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <ActionButton onClick={onEdit} label="✏️" title="Edit" theme={theme} />
          <ActionButton onClick={onDelete} label="🗑️" title="Delete" theme={theme} />
        </div>
      </div>

      {/* Categories Level */}
      {expanded && (
        <div style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {feature.categories?.map(category => (
            <div key={category.id}>
              {/* Category Item */}
              <div
                style={{
                  padding: '10px 12px',
                  background: `${theme.accentPrimary}10`,
                  border: `1px solid ${theme.accentPrimary}`,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <button
                    onClick={() => toggleExpandCategory(category.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      padding: '2px 6px',
                    }}
                  >
                    {expandedCategories.has(category.id) ? '▼' : '▶'}
                  </button>
                  <span style={{ fontSize: '16px' }}>📁</span>
                  <div>
                    <div style={{ fontWeight: '600', color: theme.textPrimary, fontSize: '13px' }}>
                      {category.name || category.label}
                    </div>
                    <div style={{ fontSize: '11px', color: theme.textSecondary }}>
                      {category.topics?.length || 0} topics
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <ActionButton onClick={() => onEditCategory(category)} label="✏️" theme={theme} />
                  <ActionButton onClick={() => onDeleteCategory(category)} label="🗑️" theme={theme} />
                  <AddButton onClick={() => onAddTopic(category)} label="+" title="Add Topic" theme={theme} />
                </div>
              </div>

              {/* Topics Level */}
              {expandedCategories.has(category.id) && (
                <div style={{ paddingLeft: '24px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {category.topics?.map(topic => (
                    <div key={topic.id}>
                      {/* Topic Item */}
                      <div
                        style={{
                          padding: '8px 10px',
                          background: `${theme.accentSecondary}10`,
                          border: `1px solid ${theme.accentSecondary}`,
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                          <button
                            onClick={() => toggleExpandTopic(topic.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '12px',
                              padding: '0 4px',
                            }}
                          >
                            {expandedTopics.has(topic.id) ? '▼' : '▶'}
                          </button>
                          <span style={{ fontSize: '14px' }}>🎯</span>
                          <div>
                            <div style={{ fontWeight: '600', color: theme.textPrimary, fontSize: '12px' }}>
                              {topic.name || topic.label}
                            </div>
                            <div style={{ fontSize: '10px', color: theme.textSecondary }}>
                              {topic.subtopics?.length || 0} subtopics
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '3px' }}>
                          <ActionButton onClick={() => onEditTopic(topic)} label="✏️" theme={theme} small />
                          <ActionButton onClick={() => onDeleteTopic(topic)} label="🗑️" theme={theme} small />
                          <AddButton onClick={() => onAddSubtopic(topic, category)} label="+" title="Add Subtopic" theme={theme} small />
                        </div>
                      </div>

                      {/* Subtopics Level */}
                      {expandedTopics.has(topic.id) && (
                        <div style={{ paddingLeft: '20px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {topic.subtopics?.map(subtopic => (
                            <div
                              key={subtopic.id}
                              style={{
                                padding: '6px 8px',
                                background: theme.cardBg,
                                border: `1px dashed ${theme.border}`,
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px',
                                fontSize: '11px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                <span>📌</span>
                                <span style={{ color: theme.textPrimary, fontWeight: '500' }}>
                                  {subtopic.name || subtopic.label}
                                </span>
                              </div>
                              <div style={{ display: 'flex', gap: '2px' }}>
                                <ActionButton onClick={() => onEditSubtopic(subtopic)} label="✏️" theme={theme} tiny />
                                <ActionButton onClick={() => onDeleteSubtopic(subtopic)} label="🗑️" theme={theme} tiny />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Add Category Button */}
          <button
            onClick={onAddCategory}
            style={{
              padding: '8px 12px',
              border: `2px dashed ${theme.accentPrimary}`,
              background: 'transparent',
              color: theme.accentPrimary,
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.background = `${theme.accentPrimary}15`;
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            + Add Category to {feature.label || feature.name}
          </button>
        </div>
      )}
    </div>
  );
}

// Reusable Action Button
function ActionButton({ onClick, label, title, theme, small, tiny }) {
  const size = tiny ? '16px' : small ? '20px' : '28px';
  const padding = tiny ? '2px 3px' : small ? '4px' : '6px';

  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: size,
        height: size,
        padding,
        background: label === '🗑️' ? '#fee2e2' : '#dbeafe',
        color: label === '🗑️' ? '#991b1b' : '#0284c7',
        border: 'none',
        borderRadius: '4px',
        fontSize: label === '🗑️' ? '10px' : '9px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
      }}
      onMouseOver={(e) => {
        e.target.style.transform = 'scale(1.1)';
      }}
      onMouseOut={(e) => {
        e.target.style.transform = 'scale(1)';
      }}
    >
      {label}
    </button>
  );
}

// Reusable Add Button
function AddButton({ onClick, label, title, theme, small }) {
  const size = small ? '20px' : '28px';
  const padding = small ? '2px' : '4px';

  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: size,
        height: size,
        padding,
        background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: small ? '10px' : '12px',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
      }}
      onMouseOver={(e) => {
        e.target.style.transform = 'scale(1.15)';
      }}
      onMouseOut={(e) => {
        e.target.style.transform = 'scale(1)';
      }}
    >
      {label}
    </button>
  );
}
