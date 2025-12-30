# Features Normalization Guide

## Problem Identified

Your Firestore **features** collection has inconsistent document structure:

### Current State Issues:

```
Document 1: stories
✅ CORRECT - id: "stories", name: "stories" (lowercase)

Document 2: games  
✅ CORRECT - id: "games", name: "games" (lowercase)

Document 3: Puzzles
❌ ISSUE: 
   - Document ID: "Puzzles" (should be auto-generated ID)
   - Missing `id` field
   - name: "Puzzles" (should be lowercase)
   - Missing `order` field
   - Has old field: `featureName`

Document 4: Quizzes
❌ ISSUE:
   - Missing `id` field
   - name: "Quizzes" (should be lowercase)
   - Missing `order` field
```

## Why This Matters

1. **Navigation queries fail**: When your app looks for `featureId: "puzzles"`, it can't find the document with `id: "Puzzles"`
2. **Categories don't load**: Puzzle and Quiz categories don't appear because the feature lookup fails
3. **Inconsistent data structure**: Different features have different fields

## Solution

A new admin page has been created: **Normalize Features**

### Steps to Fix:

1. **Navigate to**: `http://localhost:3000/admin/normalize-features`
   - Or click **"Normalize Features"** in the Admin Panel → Global menu

2. **Click "Start Normalization"** button

3. **What it does**:
   - ✅ Ensures all `id` fields are lowercase
   - ✅ Ensures all `name` fields are lowercase
   - ✅ Adds missing `order` fields (defaults to 999)
   - ✅ Adds all required fields consistently
   - ✅ Deletes old documents with wrong IDs
   - ✅ Creates new documents with correct IDs
   - ✅ Removes deprecated fields like `featureName`, `status`

4. **Expected Result**:
   ```
   Document ID: 3Ceba9KCVkNNXMRrxcs2
     id: "stories"
     name: "stories"
     order: 4
   
   Document ID: BmVCnUDsokz8dn2YZg2P
     id: "games"
     name: "games"
     order: 3
   
   Document ID: puzzles (auto-generated)
     id: "puzzles"
     name: "puzzles"
     order: 999
   
   Document ID: quizzes (auto-generated)
     id: "quizzes"
     name: "quizzes"
     order: 999
   ```

## After Normalization

Once normalized, you should see:
- ✅ Puzzle categories load when hovering over "Puzzles"
- ✅ Quiz categories load when hovering over "Quizzes"
- ✅ Story categories continue to work correctly
- ✅ All feature updates work without errors
- ✅ Navigation menu displays correctly

## Technical Details

### Normalization Rules Applied:

1. **Feature ID (stored as document ID)**:
   - Must be lowercase
   - Example: "puzzles", "quizzes", "stories", "games"

2. **Name Field**:
   - Must be lowercase
   - Example: "puzzles", "quizzes" (not "Puzzles", "Quizzes")

3. **Label/DisplayName**:
   - Can be mixed case for UI display
   - Example: "Puzzles", "Quizzes", "Stories"

4. **Required Fields**:
   - `id`: The feature identifier (lowercase)
   - `name`: The feature name (lowercase)
   - `label`: For display (can be mixed case)
   - `displayName`: For UI (can be mixed case)
   - `description`: Feature description
   - `icon`: Emoji icon
   - `featureType`: "puzzle", "quiz", "story", "game"
   - `type`: Same as featureType
   - `enabled`: Boolean (true/false)
   - `isPublished`: Boolean (true/false)
   - `order`: Number for sorting (0-999)
   - `createdAt`: Timestamp
   - `updatedAt`: Timestamp

## Code Changes Made

### 1. Created `/src/admin/NormalizeFeatures.jsx`
- Admin utility component
- Fetches all features
- Normalizes each feature
- Deletes old documents
- Creates new documents
- Shows results in table

### 2. Updated `/src/admin/Sidebar.jsx`
- Added "Normalize Features" menu item under Global section
- Links to `/admin/normalize-features`

### 3. Updated `/src/App.js`
- Imported NormalizeFeatures component
- Added route: `/admin/normalize-features`

## Important Notes

⚠️ **This operation will:**
- Modify Firestore database
- Delete old documents with incorrect IDs
- Create new documents with correct IDs
- **Cannot be undone** - ensure you have backups if needed

✅ **Safe operations:**
- All data is preserved
- Only structure and IDs are normalized
- All user data is unaffected

## Troubleshooting

**If categories still don't load after normalization:**

1. Clear browser cache: `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Refresh the page: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
3. Check browser console for errors: `F12`
4. Check that feature `id` field matches exactly what navigation service queries for

**Common query field names the app looks for:**
- `featureId` (primary)
- `featureType` (fallback for puzzles)
- `uiMode: "puzzle"` (for puzzle categories)

## Success Criteria

After normalization, verify:
- [ ] Hover over "Puzzles" in nav → shows puzzle categories
- [ ] Hover over "Quizzes" in nav → shows quiz categories
- [ ] Hover over "Stories" in nav → shows story categories
- [ ] Feature update/delete operations work without errors
- [ ] No console errors when loading features
- [ ] All features appear in admin Features page
