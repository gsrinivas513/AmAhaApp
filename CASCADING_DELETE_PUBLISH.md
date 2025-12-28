# Cascading Delete & Publish/Unpublish Architecture

## Overview

Implemented comprehensive cascading behavior for the feature hierarchy:
```
Feature → Category → Topic → Subtopic
```

When a parent is deleted or unpublished, all children are automatically handled.

## Features Implemented

### 1. **Cascading Delete** ✅

When you delete a parent element, ALL children are automatically deleted:

#### Feature Delete
- ❌ Deletes the Feature
- ❌ Deletes ALL Categories under it
- ❌ Deletes ALL Topics under each Category
- ❌ Deletes ALL Subtopics under each Topic

**File**: [useFeatureData.js](src/admin/features/hooks/useFeatureData.js#L180)

#### Category Delete
- ❌ Deletes the Category
- ❌ Deletes ALL Topics under it
- ❌ Deletes ALL Subtopics under each Topic

**File**: [useCategoryData.js](src/admin/features/hooks/useCategoryData.js#L129)

#### Topic Delete
- ❌ Deletes the Topic
- ❌ Deletes ALL Subtopics under it

**File**: [useTopicData.js](src/admin/features/hooks/useTopicData.js#L126)

#### Subtopic Delete
- ❌ Deletes the Subtopic only (no children)

**File**: [useSubtopicData.js](src/admin/features/hooks/useSubtopicData.js)

### 2. **Cascading Unpublish** ✅

When you unpublish a parent element, ALL children are automatically unpublished:

#### Feature Unpublish
- 📛 Unpublishes the Feature (children cascade through Category/Topic)

#### Category Unpublish
- 📛 Unpublishes the Category
- 📛 Unpublishes ALL Topics under it
- 📛 Unpublishes ALL Subtopics under each Topic

**File**: [useCategoryData.js](src/admin/features/hooks/useCategoryData.js#L178)

#### Topic Unpublish
- 📛 Unpublishes the Topic
- 📛 Unpublishes ALL Subtopics under it

**File**: [useTopicData.js](src/admin/features/hooks/useTopicData.js#L157)

#### Category/Topic Publish
- ✅ Can be published ONLY if parent is published
- 🔒 Publishes the element independently (children NOT force-published)

### 3. **Prevent Child Publishing If Parent Unpublished** ✅

When trying to publish a Subtopic:
- **Check 1**: Parent Topic must be published
  - If unpublished → ❌ Error: "Cannot publish subtopic: Parent topic is unpublished"
- **Check 2**: Parent Category must be published
  - If unpublished → ❌ Error: "Cannot publish subtopic: Parent category is unpublished"

**File**: [useSubtopicData.js](src/admin/features/hooks/useSubtopicData.js#L131)

## Code Changes

### Files Modified

1. **useFeatureData.js** - Cascading delete for features
   - Lines 180-237: New `deleteFeature()` with cascading logic
   - Deletes all related categories, topics, subtopics in order

2. **useCategoryData.js** - Cascading delete + unpublish
   - Lines 129-168: New `deleteCategory()` with cascading logic
   - Lines 178-233: Enhanced `toggleCategoryPublish()` with cascade unpublish

3. **useTopicData.js** - Cascading delete + unpublish
   - Added `getDoc` import for parent checks
   - Lines 126-155: Enhanced `deleteTopic()` with cascading logic
   - Lines 157-196: Enhanced `toggleTopicPublish()` with cascade unpublish

4. **useSubtopicData.js** - Publish validation
   - Added `getDoc` import for parent checks
   - Lines 131-175: Enhanced `toggleSubtopicPublish()` with:
     - Parent topic published check
     - Parent category published check
     - Error throwing if parents unpublished

## User Experience

### Delete Flow
```
User clicks "Delete Category"
↓
Confirmation dialog
↓
System deletes:
  1. All Topics in Category
  2. All Subtopics in those Topics
  3. The Category itself
↓
Success message: "Category and all X topics deleted successfully"
↓
UI updates automatically
```

### Publish/Unpublish Flow
```
User clicks "Unpublish Category"
↓
System:
  1. Unpublishes Category
  2. Unpublishes all Topics in Category
  3. Unpublishes all Subtopics in those Topics
↓
Success message: "Category and children unpublished"

---

User tries to publish Subtopic when parent Topic is unpublished
↓
System:
  1. Checks if Topic is published
  2. If not → ❌ Shows error message
  3. If yes, checks if Category is published
  4. If not → ❌ Shows error message
  5. If both yes → ✅ Publishes Subtopic
```

## Benefits

✅ **Data Integrity**: No orphaned records when parent is deleted
✅ **Content Consistency**: Unpublished parents can't have published children
✅ **User-Friendly**: Automatic cascading means users don't have to delete each child manually
✅ **Error Prevention**: Prevents publishing content whose parents are unpublished
✅ **Audit Trail**: Console logs all cascading operations for debugging

## Example Scenarios

### Scenario 1: Delete "Games" Feature
```
Games Feature
├── Memory Games Category
│   ├── Matching Topic
│   │   ├── Colors Subtopic ❌
│   │   └── Shapes Subtopic ❌
│   └── Puzzle Topic
│       └── Animals Subtopic ❌
└── Card Games Category
    └── War Topic
        └── Classic War Subtopic ❌

Result: All 5 subtopics, 3 topics, 2 categories, and feature deleted
```

### Scenario 2: Unpublish "Puzzles" Category
```
Before: All are published ✅
After unpublish command:
- Category: unpublished 📛
- All Topics: unpublished 📛
- All Subtopics: unpublished 📛

Can still be re-published individually later
```

### Scenario 3: Try to Publish Subtopic (but parent unpublished)
```
User: Clicks "Publish Animals Subtopic"
System: Checks parent Topic "Find Pairs"
System: Topic is unpublished 📛
Result: ❌ "Cannot publish subtopic: Parent topic is unpublished"
```

## Testing

To test this functionality:

1. **Test Cascading Delete**:
   - Create Feature → Category → Topic → Subtopic hierarchy
   - Delete the Category
   - Verify all Topics and Subtopics are deleted from database

2. **Test Cascading Unpublish**:
   - Create and publish the hierarchy
   - Unpublish a Topic
   - Verify all its Subtopics are unpublished

3. **Test Publish Validation**:
   - Create the hierarchy
   - Unpublish the parent Topic
   - Try to publish a Subtopic
   - Verify error message appears

## Architecture Benefits

✅ Maintains **relational integrity** automatically
✅ Prevents **orphaned data** in database
✅ Enforces **publish hierarchy constraints** 
✅ Provides **better UX** with automatic operations
✅ **Scalable** approach that works at any level of hierarchy
