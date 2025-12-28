# Fix: "Unknown Topic" Issue in Puzzle Subtopics

## Problem
Puzzle subtopics (Colors, Objects, Animals) were showing "Topic: Unknown Topic" instead of their actual topic name.

## Root Cause
The feature hierarchy in AmAha is:
```
Feature
  ├─ Category
      ├─ Topic
          └─ Subtopic
```

When a subtopic is displayed, it looks up its parent topic using the `topicId` field. However, puzzle subtopics created through `VisualPuzzleAdminPage` (the puzzle editor) did not have proper `topicId`, `categoryId`, or complete relationships established.

## Solution

### 1. **Code Changes** ✅ DONE
- Added `featureId` field to `INITIAL_SUBTOPIC_FORM` in [constants.js](src/admin/features/constants.js)
- Updated `handleAddSubtopic` to auto-assign `featureId` from the selected feature context
- Updated `handleEditSubtopic` to preserve `featureId` when editing
- Improved `getTopicName()` error messages in [SubTopicsList.jsx](src/admin/features/SubTopicsList.jsx) for better debugging

### 2. **Data Cleanup Scripts** (Run as needed)

#### Option A: Fix existing puzzle subtopics (RECOMMENDED)
```bash
node fixPuzzleSubtopicRelationships.js
```

This script will:
- Find all subtopics with `featureId: 'puzzles'`
- Ensure they have a valid `categoryId` (creates default "Puzzles" category if needed)
- Ensure they have a valid `topicId` (creates default "Memory Games" topic if needed)
- Update any subtopics missing these relationships

#### Option B: Inspect subtopics (for debugging)
```bash
node inspectSubtopics.js
```

Shows current state of all subtopics and their relationships.

#### Option C: Add featureId to all subtopics
```bash
node addFeatureIdToSubtopics.js
```

Automatically assigns `featureId` based on parent category's feature.

## Architecture Requirement
✅ **Subtopics should ALWAYS auto-inherit feature context from their parent**

This is now implemented: When creating a new subtopic in the admin hierarchy:
1. Select Feature (e.g., "Puzzles")
2. Select Category (e.g., "Memory Games Category")
3. Select Topic (e.g., "Find Pairs")
4. Add Subtopic (e.g., "Animals") → **Automatically gets `featureId: "puzzles"`**

## After Fix
- Animals subtopic will show "Topic: [actual topic name]" instead of "Unknown Topic"
- Will display "1 puzzles" instead of "0 questions" (correct puzzle count)
- Feature hierarchy is properly maintained in the database

## Verification
After running the fix script, reload the admin page and verify:
1. Colors subtopic shows correct topic
2. Objects subtopic shows correct topic
3. Animals subtopic shows correct topic
4. All show puzzle count instead of question count
