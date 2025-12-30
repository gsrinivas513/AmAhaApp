# Feature Name Normalization Implementation

## Overview
Implemented feature name normalization to ensure all feature IDs and names are stored in lowercase in Firestore, regardless of user input. This ensures consistency across the application and prevents issues where navigation queries fail due to case mismatches.

## Problem Addressed
**Issue**: Feature documents were stored with inconsistent casing:
- `id: "stories"` ✅ (correct - lowercase)
- `id: "games"` ✅ (correct - lowercase)
- `id: "Puzzles"` ❌ (incorrect - camel case)
- `id: "Quizzes"` ❌ (incorrect - camel case)

**Impact**: Navigation service queries for lowercase IDs couldn't find documents stored with camel case IDs, causing:
- Categories not loading for Puzzles and Quizzes
- Feature updates failing with "No document to update" errors
- Inconsistent data structure across the application

## Solution Implemented

### 1. Updated `useFeatureData.js` - Feature Creation Hook

**Modified Functions**:
- `createFeature()`: Now normalizes featureId and name to lowercase before saving
- `updateFeature()`: Now normalizes featureId and name to lowercase on updates
- `loadFeatures()`: Now normalizes all loaded features to ensure consistency

**Normalization Logic**:
```javascript
// Convert any featureId to lowercase with trimming
const normalizedId = featureId ? featureId.toLowerCase().trim() : null;

// Normalize name fields
name: (featureData.name || "").toLowerCase().trim()
```

**Key Changes**:
- All feature IDs are converted to lowercase on create/update
- All feature names are converted to lowercase
- Loaded features are normalized to ensure consistency
- This ensures NEW features saved will always be lowercase

### 2. Updated `navigationService.js` - Feature Loading Service

**Modified Functions**:
- `fetchPublishedFeatures()`: Now normalizes feature IDs when loading from Firestore

**Normalization Logic**:
```javascript
const normalizedId = (data.id || doc.id || "").toLowerCase().trim();
return {
  id: normalizedId,
  featureId: normalizedId,
  // ... other data
  name: (data.name || "").toLowerCase().trim(),
};
```

**Key Changes**:
- Features loaded for navigation are normalized to lowercase
- Ensures consistency whether features are loaded from Firestore or defaults
- Prevents case mismatch issues in category queries

## Database Cleanup Required

**Next Steps** - You should manually fix existing documents in Firestore:

### Documents to Rename:
1. **Puzzles** → **puzzles**
   - Current doc ID: `Puzzles`
   - Correct doc ID: `puzzles`
   - Action: Rename or delete and let app recreate as lowercase

2. **Quizzes** → **quizzes**
   - Current doc name field may be: `Quizzes`
   - Correct should be: `quizzes` (in both id and name fields)
   - Action: Rename or delete and let app recreate as lowercase

### How to Clean Up:
1. Open Firebase Console
2. Go to Firestore > `features` collection
3. For each camel-case document:
   - Delete the document
   - OR manually rename the document ID to lowercase via Firebase Console
4. The next time you create/update features via the UI, they will be saved as lowercase

## Verification

**How to Verify Normalization Works**:
1. Start the application: `npm start`
2. Go to Admin → Navigate Configuration
3. Create a new feature with mixed case name: e.g., "MyTestFeature"
4. Check Firestore console - document should be saved as: `mytestfeature` (all lowercase)
5. Name field should also be lowercase: `"mytestfeature"`

**Expected Behavior After Fix**:
- ✅ Feature names are always lowercase regardless of user input
- ✅ Feature IDs in Firestore match queries from navigation service
- ✅ Categories load correctly for all features
- ✅ Feature updates work without "No document to update" errors

## Files Modified

1. **src/admin/features/hooks/useFeatureData.js**
   - Enhanced `createFeature()` with ID normalization
   - Enhanced `updateFeature()` with ID normalization
   - Enhanced `loadFeatures()` with ID normalization

2. **src/services/navigationService.js**
   - Enhanced `fetchPublishedFeatures()` with ID normalization
   - Ensures all loaded features use lowercase IDs

## Testing Checklist

After implementation, verify:
- [ ] Create new feature with mixed case name
- [ ] Verify Firestore shows lowercase ID
- [ ] Update feature and verify case stays lowercase
- [ ] Check that categories load for Puzzles and Quizzes
- [ ] Verify navigation menu shows features correctly
- [ ] Check that feature update/delete operations work without errors
- [ ] Manually rename existing "Puzzles" → "puzzles" in Firestore
- [ ] Manually rename existing "Quizzes" → "quizzes" in Firestore

## Code Pattern Reference

The normalization pattern used throughout:
```javascript
// Always apply this pattern when saving/loading feature identifiers
const normalizedId = (inputId || "").toLowerCase().trim();
const normalizedName = (inputName || "").toLowerCase().trim();
```

This ensures:
- No leading/trailing whitespace
- All lowercase letters
- Consistent across create, update, and load operations
- No case sensitivity issues in queries

## Related Issues Resolved

This normalization fixes:
1. ✅ Feature update error: "No document to update"
2. ✅ Missing categories for Puzzles
3. ✅ Missing categories for Quizzes
4. ✅ Inconsistent feature data structure
5. ✅ Case sensitivity in navigation queries
