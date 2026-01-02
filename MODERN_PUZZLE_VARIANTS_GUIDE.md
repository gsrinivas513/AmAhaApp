# Modern Puzzle System - Variant-Driven Architecture

## Overview

The new puzzle creation system follows modern puzzle application patterns (like puzzlefree.game) where:
- **One puzzle** has **multiple difficulty variants**
- All variants use the **same core template/image**
- Users **select a variant** → **game launches** with that variant's configuration
- Admin defines variants during creation

## Puzzle Creation Flow

### Step 1: Select Visual Type
```
Choose puzzle type: Jigsaw, Find Pairs, Ordering, etc.
```

### Step 2: Select Template
```
Choose a pre-built template for that type
(Template contains the core logic/schema)
```

### Step 3: Provide Inputs (Template Input Form)
```
Based on template schema, admin provides:
- Image Upload (for Jigsaw)
- Define Difficulty Variants:
  • Easy: 3×4 = 12 pieces
  • Medium: 4×6 = 24 pieces
  • Hard: 6×8 = 48 pieces
```

### Step 4: Execute Template
```
Template runs with admin inputs
Generates preview for each variant
Shows piece samples for preview
```

### Step 5: Review Execution Results
```
Admin sees all variants with preview pieces
Confirms before proceeding
```

### Step 6: Continue to Editor
```
Opens inline editor with first variant
Admin can further customize if needed
Can adjust variant configs if needed
```

### Step 7: Save Puzzle
```
Puzzle saved with:
- Title, Description, Difficulty
- Image URL
- All variants array
- Content configuration
```

## Data Structure

### Saved Puzzle (Jigsaw Example)
```javascript
{
  id: "puzzle_123",
  title: "Panda Patrol",
  description: "...",
  type: "jigsaw",
  difficulty: "medium",
  imageUrl: "https://...",
  variants: [
    {
      label: "Easy",
      rows: 3,
      cols: 4,
      // total pieces = 12
    },
    {
      label: "Medium",
      rows: 4,
      cols: 6,
      // total pieces = 24
    },
    {
      label: "Hard",
      rows: 6,
      cols: 8,
      // total pieces = 48
    }
  ],
  content: {
    imageUrl: "https://...",
    rows: 3,
    cols: 4,
    variants: [...]
  },
  categoryId: "...",
  topicId: "...",
  isPublished: true,
  xpReward: 10,
  createdAt: "2026-01-02T..."
}
```

## Game Session Logic

When user selects a variant:

```javascript
// 1. Load puzzle by ID
const puzzle = await getPuzzle(puzzleId);

// 2. Show variant selector (if multiple variants exist)
// Variants: Easy (12) | Medium (24) | Hard (48)

// 3. User clicks variant → Create game session
const gameSession = {
  puzzleId: puzzle.id,
  variantLabel: "Medium",
  rows: 4,
  cols: 6,
  totalPieces: 24,
  imageUrl: puzzle.imageUrl,
  startedAt: now(),
  status: "in-progress"
};

// 4. Game loads with this variant config
// - Slice image into 4×6 grid = 24 pieces
// - User plays puzzle
// - Save completion stats
```

## Template Schema (Jigsaw)

```javascript
{
  name: "Jigsaw Puzzles (Generic)",
  typeKey: "jigsaw",
  description: "Jigsaw with adjustable piece count.",
  schema: {
    imageUrl: "https://...",     // Required
    pieces: 16,                  // Optional default
    rows: 3,                      // Optional default
    cols: 4,                      // Optional default
  }
}
```

## TemplateInputForm Component

Located at: `src/admin/components/TemplateInputForm.jsx`

**Responsibilities:**
- Render input fields based on template schema
- For Jigsaw: image upload + variant definition
- Validate inputs
- Pass validated inputs to parent for execution

**Props:**
```javascript
{
  template: {
    name: string,
    schema: object,
    ...
  },
  typeKey: string,           // 'jigsaw', 'find-pair', etc.
  onInputsReady: (inputs) => void,  // Called when admin executes
  onLoading: (bool) => void
}
```

**Returns on Execute:**
```javascript
{
  imageUrl: "https://...",
  variants: [
    { label: "Easy", rows: 3, cols: 4 },
    { label: "Medium", rows: 4, cols: 6 },
    { label: "Hard", rows: 6, cols: 8 }
  ]
}
```

## Template Executor

Located at: `src/admin/utils/templateExecutor.js`

**Function:** `runTemplate(typeKey, schema, params)`

**For Jigsaw with variants:**
- Takes image URL + variants array
- Executes template for each variant
- Slices image into grid for each variant
- Returns preview pieces for each
- Returns results in format:
```javascript
{
  ok: true,
  result: {
    imageUrl: "...",
    variants: [
      {
        label: "Easy",
        rows: 3,
        cols: 4,
        pieces: [...canvas URLs...],
      },
      // ... more variants
    ]
  }
}
```

## Extending to Other Puzzle Types

To add variants to Find Pairs, Picture Word, etc.:

1. **Update TemplateInputForm.jsx**
   - Add a new `if (typeKey === 'picture-word')` section
   - Render appropriate inputs for that type
   - Define how variants work for that type

2. **Update templateExecutor.js**
   - Add logic to execute for each variant
   - For text-based puzzles: variants might be difficulty levels, shuffle patterns, etc.

3. **Update save logic** in ModernAdminDashboard.jsx
   - Store variants array with puzzle

## Benefits of This Architecture

✅ **Scalability**: One puzzle = multiple playable variants  
✅ **Flexibility**: Variants can be difficulty, language, theme, etc.  
✅ **Reusability**: Templates define core logic once  
✅ **User Choice**: Players pick their preferred difficulty  
✅ **Admin Control**: Define variants during creation  
✅ **Modern UX**: Matches industry-standard puzzle apps  
