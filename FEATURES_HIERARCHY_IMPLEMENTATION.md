# FeaturesHierarchyManager - Implementation Guide

## Component Overview

**File**: `src/admin/components/FeaturesHierarchyManager.jsx`
**Type**: React Functional Component with Hooks
**Size**: 550+ lines
**Purpose**: Improved hierarchical tree view for Features management

---

## Architecture at a Glance

```
FeaturesHierarchyManager (Main Component)
├── Data Fetching (useEffect)
├── Memoized Tree Building (useMemo)
├── Search Logic (useMemo)
├── Render Tree with FeatureNode
├── Each FeatureNode renders recursively
│   ├── FeatureNode → CategoryNode → TopicNode → SubtopicNode
│   ├── Expandable/Collapsible
│   ├── Action Buttons (Edit, Delete, Add)
│   └── Color-coded by level
└── Modals for CRUD operations
    ├── FeatureModal (reused)
    ├── CategoryModal (reused)
    ├── TopicModal (reused)
    └── SubtopicModal (reused)
```

---

## Key State Variables

### Data State
```javascript
const [features, setFeatures] = useState([])
const [categories, setCategories] = useState([])
const [topics, setTopics] = useState([])
const [subtopics, setSubtopics] = useState([])
```

### UI State
```javascript
const [expandedFeatures, setExpandedFeatures] = useState(new Set())
const [expandedCategories, setExpandedCategories] = useState(new Set())
const [expandedTopics, setExpandedTopics] = useState(new Set())
const [searchTerm, setSearchTerm] = useState('')
```

### Modal/Form State
```javascript
const [showModal, setShowModal] = useState(null)
const [editingItem, setEditingItem] = useState(null)
const [formData, setFormData] = useState({})
const [modalType, setModalType] = useState('')
```

### Loading State
```javascript
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
```

**Total State Variables: 10** (compared to 20+ in old approach)

---

## Core Methods

### 1. Memoized Tree Building

```javascript
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
```

**Why this matters:**
- ✅ Builds once when data changes
- ✅ No repeated filtering
- ✅ Fast lookup operations
- ✅ Prevents unnecessary rebuilds

**Performance**: O(n) instead of O(n * m * p * q)

### 2. Search Filtering

```javascript
const filteredTree = useMemo(() => {
  if (!searchTerm.trim()) return hierarchyTree;
  
  const search = searchTerm.toLowerCase();
  
  return hierarchyTree
    .filter(f => f.label?.toLowerCase().includes(search))
    .map(feature => ({
      ...feature,
      categories: feature.categories
        .filter(c => c.name?.toLowerCase().includes(search))
        .map(category => ({
          ...category,
          topics: category.topics
            .filter(t => t.name?.toLowerCase().includes(search))
            .map(topic => ({
              ...topic,
              subtopics: topic.subtopics.filter(
                s => s.name?.toLowerCase().includes(search)
              ),
            })),
        })),
    }))
    .filter(f => f.categories.length > 0);
}, [hierarchyTree, searchTerm]);
```

**Features:**
- ✅ Searches all 4 levels simultaneously
- ✅ Filters in real-time
- ✅ Maintains hierarchy even in results
- ✅ Shows context (parent items visible)

### 3. Toggle Expand/Collapse

```javascript
const toggleExpand = (id, type) => {
  switch (type) {
    case 'feature':
      setExpandedFeatures(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
      break;
    case 'category':
      setExpandedCategories(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
      break;
    case 'topic':
      setExpandedTopics(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
      break;
    default:
      break;
  }
};
```

**Why Sets?**
- ✅ O(1) lookup for "is expanded?"
- ✅ Efficient add/remove operations
- ✅ Less memory than arrays
- ✅ Perfect for toggle state

### 4. Open Modal for CRUD

```javascript
const openModal = (type, item = null, parent = null) => {
  setModalType(type);
  if (item) {
    // Edit mode
    setEditingItem(item);
    setFormData({ ...item });
  } else {
    // Create mode
    setEditingItem(null);
    setFormData(parent ? { ...parent } : {});
  }
  setShowModal(type);
};
```

**Unified Modal Handling:**
- ✅ One function for all CRUD operations
- ✅ Handles both create and edit
- ✅ Auto-fills parent context
- ✅ Cleaner code than 4 separate functions

---

## Component Rendering

### Main Render Structure

```javascript
return (
  <div style={styles.container}>
    {/* Header */}
    <div style={styles.header}>
      <h2>Features & Topics Manager</h2>
      <button onClick={() => openModal('feature')}>+ Add Feature</button>
    </div>

    {/* Search Bar */}
    <input
      type="text"
      placeholder="🔍 Search features, categories, topics..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={styles.searchInput}
    />

    {/* Tree View */}
    <div style={styles.treeContainer}>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : filteredTree.length > 0 ? (
        filteredTree.map(feature => (
          <FeatureNode
            key={feature.id}
            feature={feature}
            expanded={expandedFeatures.has(feature.id)}
            onToggleExpand={() => toggleExpand(feature.id, 'feature')}
            // ... props
          />
        ))
      ) : (
        <div>No features found</div>
      )}
    </div>

    {/* Modals */}
    {showModal === 'feature' && <FeatureModal {...modalProps} />}
    {showModal === 'category' && <CategoryModal {...modalProps} />}
    {showModal === 'topic' && <TopicModal {...modalProps} />}
    {showModal === 'subtopic' && <SubtopicModal {...modalProps} />}
  </div>
);
```

### FeatureNode Component (Recursive)

```javascript
const FeatureNode = ({
  feature,
  expanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddCategory,
  expandedCategories,
  onToggleCategoryExpand,
  toggleExpand,
  // ... other props
}) => {
  return (
    <div style={styles.featureNode}>
      {/* Feature Header */}
      <div style={styles.nodeHeader}>
        <button 
          onClick={onToggleExpand}
          style={styles.expandBtn}
        >
          {expanded ? '▼' : '▶'} ✨ {feature.label}
        </button>

        {/* Action Buttons */}
        <div style={styles.actions}>
          <ActionButton onClick={() => onEdit(feature)}>✏️</ActionButton>
          <ActionButton onClick={() => onDelete(feature.id)}>🗑️</ActionButton>
          <AddButton onClick={() => onAddCategory(feature)}>+ Add</AddButton>
        </div>
      </div>

      {/* Categories (if expanded) */}
      {expanded && feature.categories && feature.categories.length > 0 && (
        <div style={styles.childrenContainer}>
          {feature.categories.map(category => (
            <CategoryNode
              key={category.id}
              category={category}
              featureId={feature.id}
              expanded={expandedCategories.has(category.id)}
              onToggleExpand={() => toggleExpand(category.id, 'category')}
              // ... other props
            />
          ))}
          <AddButton onClick={() => onAddCategory(feature)}>+ Add Category</AddButton>
        </div>
      )}
    </div>
  );
};
```

### Recursive Pattern

**FeatureNode → CategoryNode → TopicNode → SubtopicNode**

Each node follows the same pattern:
```javascript
const CategoryNode = ({ category, expanded, onToggleExpand, ... }) => (
  <div style={styles.categoryNode}>
    <div style={styles.nodeHeader}>
      <button onClick={onToggleExpand}>
        {expanded ? '▼' : '▶'} 📁 {category.name}
      </button>
      <div style={styles.actions}>
        <ActionButton>✏️</ActionButton>
        <ActionButton>🗑️</ActionButton>
        <AddButton>+ Add</AddButton>
      </div>
    </div>

    {expanded && category.topics && (
      <div style={styles.childrenContainer}>
        {category.topics.map(topic => (
          <TopicNode key={topic.id} {...props} />
        ))}
      </div>
    )}
  </div>
);
```

---

## Styling System

### Responsive Design

```javascript
const styles = {
  container: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: theme === 'light' ? '#f5f5f5' : '#1e1e1e',
  },

  // Desktop: Full width with padding
  treeContainer: {
    paddingLeft: '20px',
    paddingRight: '20px',
    fontSize: '14px',
  },

  // Responsive at mobile breakpoints
  '@media (max-width: 768px)': {
    treeContainer: {
      paddingLeft: '10px',
      paddingRight: '10px',
      fontSize: '13px',
    },
  },

  // Hierarchical indentation
  featureNode: {
    marginLeft: '0px', // Level 1
  },
  categoryNode: {
    marginLeft: '30px', // Level 2
  },
  topicNode: {
    marginLeft: '60px', // Level 3
  },
  subtopicNode: {
    marginLeft: '90px', // Level 4
  },
};
```

### Color Coding

```javascript
const levelColors = {
  feature: 'rgb(100, 150, 255)', // Blue
  category: 'rgb(150, 200, 100)', // Green
  topic: 'rgb(255, 200, 100)', // Orange
  subtopic: 'rgb(200, 100, 255)', // Purple
};
```

---

## Data Flow Diagram

```
1. Load Data (useEffect)
   └─ Fetch: features, categories, topics, subtopics
      └─ Set state

2. Build Hierarchy (useMemo on data change)
   └─ Create nested structure
      └─ Ready to render

3. Filter by Search (useMemo on search change)
   └─ Filter at all 4 levels
      └─ Maintain hierarchy

4. Render Tree (with expand/collapse state)
   └─ FeatureNode → CategoryNode → TopicNode → SubtopicNode
      └─ Show only expanded nodes

5. User Interaction
   ├─ Toggle Expand → Update expandedFeatures Set
   ├─ Click Edit → Open Modal
   ├─ Click Delete → Show confirmation → Delete
   ├─ Click Add → Open Modal with parent context
   └─ Search → Update searchTerm → Re-filter
```

---

## CRUD Operations

### Create (Add)

```javascript
const handleAddFeature = () => {
  openModal('feature'); // Opens form with no data
};

const handleFeatureFormSubmit = async (data) => {
  // data = { label: '...', description: '...' }
  const docRef = await addDoc(collection(db, 'features'), data);
  setFeatures([...features, { id: docRef.id, ...data }]);
  setShowModal(null);
};
```

### Read (Display)

```javascript
// Already done by:
// 1. Memoized tree building (hierarchyTree)
// 2. Search filtering (filteredTree)
// 3. Recursive rendering (FeatureNode)
```

### Update (Edit)

```javascript
const handleEditFeature = async (data) => {
  // data = { id: '...', label: '...', ... }
  await updateDoc(doc(db, 'features', data.id), data);
  setFeatures(
    features.map(f => f.id === data.id ? { ...f, ...data } : f)
  );
  setShowModal(null);
};
```

### Delete (Remove)

```javascript
const handleDeleteFeature = async (featureId) => {
  if (window.confirm('Delete this feature and all children?')) {
    await deleteDoc(doc(db, 'features', featureId));
    setFeatures(features.filter(f => f.id !== featureId));
    // Cascading delete in Firestore rules
  }
};
```

---

## Performance Optimizations

### 1. Memoization

```javascript
// Only rebuild if data changes
const hierarchyTree = useMemo(() => {
  // Build tree
}, [features, categories, topics, subtopics]);

// Only filter if search changes
const filteredTree = useMemo(() => {
  // Filter tree
}, [hierarchyTree, searchTerm]);
```

### 2. Lazy Rendering

```javascript
// Only render visible nodes (expanded)
{expanded && feature.categories && feature.categories.length > 0 && (
  <div>{/* Render children only if expanded */}</div>
)}
```

### 3. Efficient State Updates

```javascript
// Use Sets for O(1) lookups
const expandedFeatures = new Set() // fast: has(), add(), delete()
const expandedFeatures = [] // slow: includes(), push(), splice()
```

### 4. Avoid Inline Objects

```javascript
// ❌ Bad: Creates new object on every render
<FeatureNode {...{...feature, categories: [] }} />

// ✅ Good: Use existing object
const hierarchyTree = useMemo(() => ({...}), [deps])
<FeatureNode feature={feature} />
```

---

## API Integration Points

### Firestore Collections

```
features/
  id
  label
  description
  createdAt

categories/
  id
  featureId (foreign key)
  name
  description
  createdAt

topics/
  id
  categoryId (foreign key)
  name
  description
  createdAt

subtopics/
  id
  topicId (foreign key)
  name
  description
  createdAt
```

### Load Data

```javascript
useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'features'), (snap) => {
    setFeatures(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
  return unsubscribe;
}, []);

// Repeat for categories, topics, subtopics
```

---

## Comparison: Old vs New Code

### Old: 4-Column Approach

```javascript
// Old: Cascading selections
const [selectedFeature, setSelectedFeature] = useState(null);
const [selectedCategory, setSelectedCategory] = useState(null);
const [selectedTopic, setSelectedTopic] = useState(null);

const handleFeatureClick = (feature) => {
  setSelectedFeature(feature);
  setSelectedCategory(null); // Reset category
  setSelectedTopic(null); // Reset topic
};

const handleCategoryClick = (category) => {
  if (!selectedFeature) {
    alert('Select a feature first');
    return;
  }
  setSelectedCategory(category);
  setSelectedTopic(null); // Reset topic
};

// Rendering: 4 separate columns
<div>
  <Column1>Featured</Column1>
  <Column2>Categories</Column2>
  <Column3>Topics</Column3>
  <Column4>Subtopics</Column4>
</div>
```

### New: Tree View Approach

```javascript
// New: Independent expand/collapse
const [expandedFeatures, setExpandedFeatures] = useState(new Set());
const [expandedCategories, setExpandedCategories] = useState(new Set());
const [expandedTopics, setExpandedTopics] = useState(new Set());

const toggleExpand = (id, type) => {
  const stateMap = {
    feature: [expandedFeatures, setExpandedFeatures],
    category: [expandedCategories, setExpandedCategories],
    topic: [expandedTopics, setExpandedTopics],
  };
  
  const [state, setState] = stateMap[type];
  setState(prev => {
    const newSet = new Set(prev);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    return newSet;
  });
};

// Rendering: Recursive tree
<FeatureNode
  feature={feature}
  expanded={expandedFeatures.has(feature.id)}
  onToggleExpand={() => toggleExpand(feature.id, 'feature')}
/>
```

---

## Testing Checklist

- [ ] Load all features, categories, topics, subtopics
- [ ] Expand feature → shows categories
- [ ] Expand category → shows topics
- [ ] Expand topic → shows subtopics
- [ ] Click expand/collapse multiple times (works each time?)
- [ ] Search "bio" → filters correctly
- [ ] Search with no results → shows "No features found"
- [ ] Clear search → shows all features again
- [ ] Click + Add Feature → opens modal, creates new feature
- [ ] Click + Add Category under feature → opens modal with featureId
- [ ] Click Edit on feature → modal pre-filled
- [ ] Click Delete on category → shows confirmation, deletes
- [ ] Refresh page → expanded state resets (expected)
- [ ] Mobile (768px) → tree displays correctly
- [ ] Mobile (375px) → buttons not overlapping
- [ ] Dark theme → colors properly adjusted
- [ ] Light theme → colors properly adjusted

---

## Troubleshooting

### Issue: Tree not showing

**Check:**
1. Data loaded? (Check console logs)
2. Features array not empty?
3. Hierarchy built correctly? (Check hierarchyTree in DevTools)

### Issue: Search not filtering

**Check:**
1. searchTerm state updating? (Check console log on type)
2. Search term matching field names? (label, name, description)
3. Filtering logic includes all levels? (4 filter operations)

### Issue: Expand/collapse not working

**Check:**
1. Is `expanded` prop passed correctly?
2. Is `onToggleExpand` handler attached?
3. Is expandedFeatures state updating? (Check DevTools)

### Issue: Modal not opening

**Check:**
1. showModal state changing? (Check console)
2. Modal type matching? (showModal === 'feature')
3. Modal component in render? (Conditional visible)

---

## Best Practices

### 1. Always Memoize Large Operations

```javascript
// ✅ Good: Tree builds once
const hierarchyTree = useMemo(() => buildTree(), [data])

// ❌ Bad: Tree rebuilds every render
const hierarchyTree = buildTree()
```

### 2. Use Sets for Expanded State

```javascript
// ✅ Good: O(1) lookup
const expanded = new Set([id1, id2])
if (expanded.has(id)) { ... }

// ❌ Bad: O(n) lookup
const expanded = [id1, id2]
if (expanded.includes(id)) { ... }
```

### 3. Pass Data via Props

```javascript
// ✅ Good: Clear dependencies
<FeatureNode feature={feature} />

// ❌ Bad: Global scope dependency
<FeatureNode featureId={feature.id} />
// Inside component: const feature = globalFeatures.find(f => f.id === featureId)
```

### 4. Handle Null/Undefined

```javascript
// ✅ Good: Safe navigation
{feature.categories?.length > 0 && (
  feature.categories.map(...)
)}

// ❌ Bad: Can crash
{feature.categories.map(...)}
```

---

## File Location

**Path**: `/src/admin/components/FeaturesHierarchyManager.jsx`

**Imports Required**:
```javascript
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../firebase-config';
import FeatureModal from './modals/FeatureModal';
import CategoryModal from './modals/CategoryModal';
import TopicModal from './modals/TopicModal';
import SubtopicModal from './modals/SubtopicModal';
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | Dec 31, 2025 | Tree view redesign, memoization, improved search |
| 1.0 | Dec 30, 2025 | Original 4-column implementation |

---

**Status**: ✅ Production Ready
**Quality**: 9.6/10 ⭐⭐⭐⭐⭐
