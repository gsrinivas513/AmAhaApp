# Quick Reference: Refactored Architecture

## How to Add a New Feature

### 1. Add Feature via UI
Navigate to `/admin/features` and click the "+" button in Step 1.

### 2. Programmatically Add Feature
```javascript
import { useFeatureData } from './admin/features/hooks/useFeatureData';

const { createFeature } = useFeatureData();

await createFeature({
  name: "flashcards",
  label: "Flashcards",
  icon: "🃏",
  description: "Study with flashcards",
  enabled: true,
  featureType: "custom"
});
```

## How to Modify a List Component

### Example: Adding a New Field to FeaturesList
1. **Update the database** to include the new field
2. **Modify FeaturesList.jsx** to display it:
```javascript
<div>{feat.newField}</div>
```
3. **Update useFeatureData.js** if CRUD operations need the field

## How to Add a New Modal Field

### Example: Adding "priority" to CategoryModal
1. **Update INITIAL_CATEGORY_FORM** in `constants.js`:
```javascript
export const INITIAL_CATEGORY_FORM = {
  // ...existing fields
  priority: 0, // NEW
};
```

2. **Add input in CategoryModal.jsx**:
```javascript
<Input
  label="Priority"
  type="number"
  value={form.priority}
  onChange={(e) => setForm({ ...form, priority: e.target.value })}
/>
```

3. **Update useCategoryData.js** to save the field:
```javascript
const newCat = {
  ...categoryData,
  priority: categoryData.priority || 0, // Include in save
};
```

## How to Use a Hook in Another Component

### Example: Using useTopicData in a Different Page
```javascript
import { useTopicData } from './admin/features/hooks/useTopicData';

function MyComponent() {
  const { topics, loadTopics, createTopic } = useTopicData();
  
  useEffect(() => {
    loadTopics(categoryId);
  }, [categoryId]);
  
  return (
    <div>
      {topics.map(topic => (
        <div key={topic.id}>{topic.label}</div>
      ))}
    </div>
  );
}
```

## Component Props Reference

### FeaturesList Props
```typescript
{
  features: Feature[],
  selectedFeatureId: string | null,
  categories: Category[],
  onSelectFeature: (id: string) => void,
  onEditFeature: (feature: Feature) => void,
  onDeleteFeature: (id: string) => void,
  onAddFeature: () => void
}
```

### CategoriesList Props
```typescript
{
  categories: Category[],
  selectedCategoryId: string | null,
  selectedFeatureId: string | null,
  features: Feature[],
  subcategories: Subcategory[],
  onSelectCategory: (id: string) => void,
  onEditCategory: (category: Category) => void,
  onDeleteCategory: (id: string) => void,
  onToggleCategoryPublish: (category: Category) => void,
  onAddCategory: () => void
}
```

### TopicsList Props
```typescript
{
  topics: Topic[],
  selectedTopicId: string | null,
  selectedCategoryId: string | null,
  categories: Category[],
  onSelectTopic: (id: string) => void,
  onEditTopic: (topic: Topic) => void,
  onDeleteTopic: (id: string) => void,
  onToggleTopicPublish: (topic: Topic) => void,
  onAddTopic: () => void
}
```

### SubTopicsList Props
```typescript
{
  subcategories: Subcategory[],
  selectedTopicId: string | null,
  selectedCategoryId: string | null,
  topics: Topic[],
  onEditSubcategory: (sub: Subcategory) => void,
  onDeleteSubcategory: (id: string) => void,
  onAddSubcategory: () => void
}
```

## Hook Return Values

### useFeatureData()
```javascript
{
  features: Feature[],
  loading: boolean,
  status: string,
  setStatus: (msg: string) => void,
  loadFeatures: () => Promise<void>,
  createFeature: (data) => Promise<Feature>,
  updateFeature: (id, data) => Promise<void>,
  deleteFeature: (id) => Promise<void>
}
```

### useCategoryData()
```javascript
{
  categories: Category[],
  loading: boolean,
  status: string,
  setStatus: (msg: string) => void,
  loadCategories: (features) => Promise<void>,
  createCategory: (data) => Promise<Category>,
  updateCategory: (id, data) => Promise<void>,
  deleteCategory: (id) => Promise<void>,
  toggleCategoryPublish: (id, current) => Promise<void>
}
```

### useTopicData()
```javascript
{
  topics: Topic[],
  loading: boolean,
  status: string,
  setStatus: (msg: string) => void,
  loadTopics: (categoryId) => Promise<void>,
  createTopic: (data, categoryId) => Promise<Topic>,
  updateTopic: (id, data) => Promise<void>,
  deleteTopic: (id) => Promise<void>,
  toggleTopicPublish: (id, current) => Promise<void>
}
```

### useSubcategoryData()
```javascript
{
  subcategories: Subcategory[],
  loading: boolean,
  status: string,
  setStatus: (msg: string) => void,
  loadSubcategories: (categoryId, topicId?) => Promise<void>,
  createSubcategory: (data) => Promise<Subcategory>,
  updateSubcategory: (id, data) => Promise<void>,
  deleteSubcategory: (id) => Promise<void>,
  toggleSubcategoryPublish: (id, current) => Promise<void>
}
```

## Common Tasks

### Task: Change the Sort Order Logic
**File**: Hook file (e.g., `useTopicData.js`)
**Location**: In the `loadTopics` function
```javascript
// Change from sortOrder to date-based
topicsList.sort((a, b) => {
  const dateA = a.createdAt?.toDate?.() || new Date(0);
  const dateB = b.createdAt?.toDate?.() || new Date(0);
  return dateB - dateA; // Newest first
});
```

### Task: Add Validation to a Form
**File**: Modal component (e.g., `CategoryModal.jsx`)
**Location**: Before onSave handler
```javascript
<Button 
  onClick={() => {
    if (!form.name || !form.label) {
      alert("Name and label are required");
      return;
    }
    onSave();
  }}
>
  Save
</Button>
```

### Task: Style a Specific List
**File**: List component (e.g., `TopicsList.jsx`)
**Location**: In the Card style prop
```javascript
<Card
  style={{
    padding: 8,
    background: "#custom-color", // Change this
    borderRadius: 12, // Or add new styles
  }}
>
```

### Task: Add a Loading Spinner
**File**: Main component (`FeatureCategoryManagement.jsx`)
**Location**: Where loading is checked
```javascript
{loading && (
  <div style={{ textAlign: "center", padding: 20 }}>
    <div className="spinner"></div>
    Loading...
  </div>
)}
```

## Troubleshooting

### Issue: "Cannot read property 'id' of undefined"
**Cause**: Data not loaded before rendering
**Solution**: Add null checks in component
```javascript
{topics?.map(topic => ...)} // Use optional chaining
```

### Issue: Changes not saving to Firebase
**Cause**: Hook not called correctly
**Solution**: Check async/await
```javascript
await createCategory(categoryForm); // Don't forget await
```

### Issue: Selection state not updating
**Cause**: Parent state not passed correctly
**Solution**: Verify props in component
```javascript
// In parent
<TopicsList 
  selectedTopicId={selectedTopicId} // Make sure this is passed
  onSelectTopic={handleSelectTopic}
/>
```

## File Dependencies

```
FeatureCategoryManagement.jsx
├── FeaturesList.jsx → Card, Button (ui)
├── CategoriesList.jsx → Card, Button (ui)
├── TopicsList.jsx → Card, Button (ui)
├── SubTopicsList.jsx → Card, Button (ui)
├── useFeatureData.js → Firebase, db
├── useCategoryData.js → Firebase, db
├── useTopicData.js → Firebase, db
├── useSubcategoryData.js → Firebase, db
├── FeatureModal.jsx → Modal, Button, Input (ui)
├── CategoryModal.jsx → Modal, Button, Input, constants (ui)
├── TopicModal.jsx → Modal, Button, Input (ui)
├── SubcategoryModal.jsx → Modal, Button, Input (ui)
└── constants.js
```

## Testing Checklist

After making changes, test:
- [ ] All 4 lists render correctly
- [ ] Selecting items updates dependent lists
- [ ] Create modal opens and saves correctly
- [ ] Edit modal loads existing data
- [ ] Delete confirms and removes item
- [ ] Publish toggle updates status
- [ ] No console errors
- [ ] Responsive layout works on mobile
- [ ] Firebase data syncs correctly
- [ ] Status messages appear and dismiss
