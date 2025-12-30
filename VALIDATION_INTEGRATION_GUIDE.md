# Generic Validation Integration Guide

## Overview

Created **reusable validation components** that work with ANY puzzle type:
- ✅ find-pair
- ✅ picture-word
- ✅ spot-difference
- ✅ picture-shadow
- ✅ ordering

## Components Available

### 1. ValidationErrorDisplay
Shows validation errors in a consistent format

```javascript
import { ValidationErrorDisplay } from "../components/admin/PuzzleValidationDisplay";

<ValidationErrorDisplay 
  validation={validation} 
  showValidation={true}
/>
```

### 2. usePuzzleValidation Hook
Handles all validation logic and save operations

```javascript
import { usePuzzleValidation } from "../components/admin/PuzzleValidationDisplay";

function MyPuzzleEditor() {
  const { validate, validation, handleSave, isSaving } = usePuzzleValidation(
    puzzleData,
    async (data) => {
      await savePuzzle(data);
      return true;
    }
  );

  return (
    <>
      <ValidationErrorDisplay validation={validation} />
      <button onClick={handleSave} disabled={isSaving}>
        Save
      </button>
    </>
  );
}
```

### 3. PuzzleValidationWrapper (Easiest)
Drop-in wrapper that handles everything

```javascript
import { PuzzleValidationWrapper } from "../components/admin/PuzzleValidationDisplay";

function MyPuzzleEditor() {
  return (
    <PuzzleValidationWrapper
      puzzleData={puzzleData}
      onSave={async (data) => {
        await savePuzzle(data);
        return true;
      }}
      isSaving={isSaving}
    >
      {/* Your form content here */}
    </PuzzleValidationWrapper>
  );
}
```

---

## How to Integrate into Existing Editors

### Option A: Using PuzzleValidationWrapper (Recommended)

**Before:**
```javascript
export default function FindPairEditor({ puzzle, onSave }) {
  return (
    <div>
      <h2>Edit Find Pair Puzzle</h2>
      {/* Form content */}
      <button onClick={() => savePuzzle(puzzleData)}>Save</button>
    </div>
  );
}
```

**After:**
```javascript
import { PuzzleValidationWrapper } from "../components/admin/PuzzleValidationDisplay";

export default function FindPairEditor({ puzzle, onSave }) {
  const [puzzleData, setPuzzleData] = useState(puzzle);
  const [isSaving, setIsSaving] = useState(false);

  return (
    <PuzzleValidationWrapper
      puzzleData={puzzleData}
      onSave={async (data) => {
        setIsSaving(true);
        try {
          await onSave(data);
          setIsSaving(true);
          return true;
        } catch (error) {
          setIsSaving(false);
          throw error;
        }
      }}
      isSaving={isSaving}
    >
      <h2>Edit Find Pair Puzzle</h2>
      {/* Form content */}
    </PuzzleValidationWrapper>
  );
}
```

### Option B: Using Hook (More Control)

```javascript
import { usePuzzleValidation, ValidationErrorDisplay } from "../components/admin/PuzzleValidationDisplay";

export default function FindPairEditor({ puzzle, onSave }) {
  const [puzzleData, setPuzzleData] = useState(puzzle);
  const { validate, validation, handleSave, isSaving } = usePuzzleValidation(
    puzzleData,
    onSave
  );

  return (
    <div>
      <ValidationErrorDisplay validation={validation} />
      
      <h2>Edit Find Pair Puzzle</h2>
      {/* Form content */}
      
      <button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
```

---

## What Gets Validated

Each puzzle type has automatic validation:

### find-pair
✅ Has `cards` array
✅ At least 8 cards
✅ Even number of cards (pairs)
✅ All cards have images

### picture-word
✅ Has `items` array
✅ At least 4 items
✅ All items have images
✅ All items have words

### spot-difference
✅ Has `originalImage`
✅ Has `modifiedImage`
✅ Images are different

### picture-shadow
✅ Has `originalImage`
✅ Has `shadowImage`
✅ Images are different

### ordering
✅ Has `items` array
✅ Has `correctOrder` array
✅ At least 2 items
✅ Items count matches order count

---

## Error Messages Users See

When validation fails, users see **clear, actionable error messages**:

❌ "Missing 'cards' array"
❌ "Need at least 8 cards (you have 4)"
❌ "Cards must be in even pairs (you have 5)"
❌ "Card 1 is missing an image"
❌ "Original and modified images must be different"

Each error tells users exactly what to fix.

---

## Implementation Steps (Pick One)

### Quick Setup (5 minutes) - Use Wrapper
1. Add `<PuzzleValidationWrapper>` around your form
2. Replace save button code
3. Done!

### Standard Setup (10 minutes) - Use Hook
1. Import `usePuzzleValidation` hook
2. Call it in your component
3. Add `<ValidationErrorDisplay>` component
4. Replace save button with `handleSave`

### Advanced (Custom) - Use Just Components
1. Import validation components
2. Build your own validation flow
3. Use components where needed

---

## Testing

### Test 1: Invalid puzzle should show errors
1. Edit find-pair puzzle
2. Remove all cards
3. Click Save
4. ✅ Should show: "Cards array is empty"

### Test 2: Valid puzzle should save
1. Edit puzzle with all required data
2. Click Save
3. ✅ Should show success and save

### Test 3: Partial data should list all errors
1. Create picture-word with 2 items
2. Remove images from first item
3. Click Save
4. ✅ Should show both errors

---

## Files to Update

The validation wrapper works generically, but to fully integrate:

1. **FindPairEditor.jsx** - find-pair puzzles
2. **PictureWordEditor.jsx** - picture-word puzzles
3. **SpotDifferenceEditor.jsx** - spot-difference puzzles
4. **PictureShadowEditor.jsx** - picture-shadow puzzles
5. **OrderingEditor.jsx** - ordering puzzles
6. **AddPuzzlePage.jsx** - new puzzle creation

Each just needs to:
- Import validation component
- Wrap form in `PuzzleValidationWrapper` or use hook
- Replace save button

---

## Example: Complete Integration

```javascript
// src/admin/puzzle-editors/FindPairEditor.jsx

import React, { useState } from "react";
import { PuzzleValidationWrapper } from "../../components/admin/PuzzleValidationDisplay";
import { savePuzzleToDatabase } from "../../services/puzzleService";

export default function FindPairEditor({ puzzle, onComplete }) {
  const [puzzleData, setPuzzleData] = useState(puzzle);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      await savePuzzleToDatabase(data);
      onComplete(true); // Success
      return true;
    } catch (error) {
      console.error("Save failed:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PuzzleValidationWrapper
      puzzleData={puzzleData}
      onSave={handleSave}
      isSaving={isSaving}
    >
      <h2>Edit Find Pair Puzzle</h2>
      
      {/* Title Input */}
      <div>
        <label>Title:</label>
        <input
          value={puzzleData.title}
          onChange={(e) => setPuzzleData({
            ...puzzleData,
            title: e.target.value
          })}
        />
      </div>

      {/* Cards Management */}
      <div>
        <label>Cards ({puzzleData.data?.cards?.length || 0}):</label>
        {/* Card management UI */}
      </div>

      {/* ValidationWrapper provides:
          - Validation error display
          - Success message
          - Save/Cancel buttons
          - Auto-validation before save
      */}
    </PuzzleValidationWrapper>
  );
}
```

---

## Benefits

✅ **Generic**: Works for all puzzle types
✅ **Reusable**: Drop into any editor
✅ **Automatic**: No need to write validation logic
✅ **User-Friendly**: Clear error messages
✅ **Consistent**: Same format everywhere
✅ **Maintainable**: Update validation in one place

---

## Next Steps

1. Pick one puzzle editor to integrate first
2. Use `PuzzleValidationWrapper` component
3. Test that validation works
4. Apply to remaining editors
5. When done, all puzzle creation will be validated!
