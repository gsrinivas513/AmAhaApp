# Fix: Feature Update Error - "No document to update"

## Problem
When trying to update a feature (like "puzzles"), you get the error:
```
ERROR: No document to update: projects/amahaapp/databases/(default)/documents/features/puzzles
```

## Solution

### What Changed
✅ Updated the feature management system to use `setDoc` with `merge: true` instead of `updateDoc`

This change allows the system to:
- **Create** the feature document if it doesn't exist
- **Update** the feature document if it already exists

### Files Fixed
1. `src/admin/features/hooks/useFeatureData.js` - Updated `updateFeature()` function
2. `src/admin/NavigationConfigPage.jsx` - Updated feature order saving
3. `src/admin/FixFirebaseStructure.jsx` - Updated quiz feature initialization

### How to Create Missing Features

#### Option 1: Manual Creation via Firebase Console
1. Go to https://console.firebase.google.com
2. Select your project
3. Go to Firestore Database
4. Create a new document in the "features" collection:
   - Document ID: `puzzles`
   - Fields:
     ```
     id: "puzzles"
     name: "Puzzles"
     label: "Puzzles"
     featureType: "puzzle"
     featureId: "puzzles"
     isPublished: true
     icon: "🧩"
     description: "Solve fun and challenging puzzles"
     ```

5. Create another document for Stories:
   - Document ID: `stories`
   - Fields:
     ```
     id: "stories"
     name: "Stories"
     label: "Stories"
     featureType: "story"
     featureId: "stories"
     isPublished: true
     icon: "📖"
     description: "Learn through interactive stories"
     ```

#### Option 2: Via Browser Console
```javascript
import { db } from './src/firebase/firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';

// Create Puzzles feature
await setDoc(doc(db, "features", "puzzles"), {
  id: "puzzles",
  name: "Puzzles",
  label: "Puzzles",
  featureType: "puzzle",
  featureId: "puzzles",
  isPublished: true,
  icon: "🧩",
  description: "Solve fun and challenging puzzles",
  createdAt: new Date(),
  updatedAt: new Date()
});

// Create Stories feature
await setDoc(doc(db, "features", "stories"), {
  id: "stories",
  name: "Stories",
  label: "Stories",
  featureType: "story",
  featureId: "stories",
  isPublished: true,
  icon: "📖",
  description: "Learn through interactive stories",
  createdAt: new Date(),
  updatedAt: new Date()
});

console.log("✅ Features created successfully!");
```

#### Option 3: Via Admin Panel (If you add this page)
1. Go to `/admin/features`
2. Click "Add Feature"
3. Fill in the form with the above data
4. Click Save

### After Creating Features
Now you should be able to:
✅ Update features without errors
✅ See Puzzles and Stories in the navigation
✅ Manage feature settings from the admin panel

### Technical Details
**Before:** Used `updateDoc()` which requires the document to exist
```javascript
await updateDoc(doc(db, "features", "puzzles"), data);
// ❌ Error if document doesn't exist
```

**After:** Uses `setDoc()` with merge option
```javascript
await setDoc(doc(db, "features", "puzzles"), data, { merge: true });
// ✅ Creates if doesn't exist, updates if it does
```

This is a safer approach for admin operations where documents might not be pre-initialized.
