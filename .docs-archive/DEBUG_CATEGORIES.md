# Debug: Missing Puzzle & Stories Categories

## Issue
When hovering over "🧩 Puzzles" or "📖 Stories" in the top navigation, you see "No categories available yet. Please check back later."

## Quick Fix - Run in Browser Console

```javascript
// 1. Check what categories exist in Firestore
import { db } from './src/firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

async function debugCategories() {
  console.log("🔍 Checking categories...\n");

  // Check regular categories collection
  const catSnap = await getDocs(collection(db, "categories"));
  console.log("📁 Regular Categories Collection:");
  catSnap.docs.forEach(doc => {
    const data = doc.data();
    console.log(`  - ${doc.id}:`, {
      featureId: data.featureId,
      featureType: data.featureType,
      uiMode: data.uiMode,
      isPublished: data.isPublished,
      label: data.label
    });
  });

  // Check story categories collection
  const storyCatSnap = await getDocs(collection(db, "storyCategories"));
  console.log("\n📚 Story Categories Collection:");
  storyCatSnap.docs.forEach(doc => {
    const data = doc.data();
    console.log(`  - ${doc.id}:`, {
      isPublished: data.isPublished,
      label: data.label
    });
  });

  // Check features
  const featSnap = await getDocs(collection(db, "features"));
  console.log("\n🔧 Features Collection:");
  featSnap.docs.forEach(doc => {
    const data = doc.data();
    console.log(`  - ${doc.id}:`, {
      featureId: data.featureId,
      featureType: data.featureType,
      isPublished: data.isPublished,
      label: data.label
    });
  });
}

await debugCategories();
```

## Expected Output

### For Puzzles - Categories should have:
```javascript
{
  id: "visual-puzzles",
  featureId: "puzzles",  // OR uiMode: "puzzle"
  isPublished: true,
  label: "Visual Puzzles"
}
```

### For Stories - Categories should be in storyCategories with:
```javascript
{
  id: "kids",
  isPublished: true,
  label: "Kids"
}
```

## Solutions

### Solution 1: If Puzzles are not showing

**Problem:** Puzzle categories might not have `featureId: "puzzles"` set

**Fix:** Run this in Firebase Console:

```javascript
// Add featureId to puzzle categories
db.collection("categories")
  .where("uiMode", "==", "puzzle")
  .get()
  .then(snap => {
    snap.docs.forEach(doc => {
      doc.ref.update({ featureId: "puzzles", isPublished: true });
      console.log(`✅ Updated ${doc.id}`);
    });
  });
```

### Solution 2: If Stories are not showing

**Problem:** Story categories might not have `isPublished: true`

**Fix:** Run this in Firebase Console:

```javascript
// Mark all story categories as published
db.collection("storyCategories")
  .get()
  .then(snap => {
    snap.docs.forEach(doc => {
      doc.ref.update({ isPublished: true });
      console.log(`✅ Published ${doc.id}`);
    });
  });
```

### Solution 3: If collections are completely empty

**Option A:** Use the initialization scripts:
```bash
# In browser console, run:
import { debugStories } from './src/utils/debugStories';
await debugStories.addStoriesFeature();
```

**Option B:** Create sample data:
- Go to `/admin/features` page
- Manually create Puzzle and Story categories
- Set `isPublished: true`
- For Puzzles: set `featureId: "puzzles"` or `uiMode: "puzzle"`

## Verification

After fixing, reload the page and hover over "Puzzles" and "Stories" - you should see categories appear with a loading spinner.

## Files That May Need Updates

1. **navigationService.js** - Queries categories
2. **CategoriesPanel.jsx** - Displays categories with loading state
3. **TopNavBar.jsx** - Manages hover and loading state

All have been updated to handle multiple field naming conventions and separate collections.
