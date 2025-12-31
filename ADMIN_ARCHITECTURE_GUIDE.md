# Admin Puzzle Management Architecture

## System Overview

The modern AmAha application integrates admin puzzle creation with player-facing puzzle gameplay through a unified admin-player architecture.

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                          │
│                   /admin/puzzles                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Puzzle List (PuzzleListPage)                        │  │
│  │  ├─ View all puzzles in table                       │  │
│  │  ├─ Filter by type/category/status                 │  │
│  │  ├─ Search by name                                 │  │
│  │  ├─ Create new puzzle                              │  │
│  │  ├─ Edit existing puzzle                           │  │
│  │  └─ Delete puzzles                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│              Click "Create" or "Edit"                        │
│                          │                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Create/Edit Visual Puzzle (VisualPuzzleAdminPage)   │  │
│  │ /admin/create-visual-puzzle?type=ordering            │  │
│  │  ├─ Select puzzle type (5 types available)          │  │
│  │  ├─ Configure basic info                            │  │
│  │  ├─ Use type-specific editor                        │  │
│  │  │  └─ For ordering: OrderingEditor                 │  │
│  │  │     ├─ Quick templates selector                 │  │
│  │  │     ├─ Number range generator                   │  │
│  │  │     ├─ Custom items manager                     │  │
│  │  │     └─ Image upload (Cloudinary)                │  │
│  │  └─ Save to Firestore                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │
         │ Save to Firestore
         │ puzzles collection
         ↓
┌──────────────────────────────────────────────────────────────┐
│                  FIRESTORE DATABASE                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ puzzles/{docID}                                        │ │
│  │ {                                                      │ │
│  │   id, type, title, description, categoryId,           │ │
│  │   topicId, difficulty, ageGroup, xpReward,            │ │
│  │   isPublished, createdAt, updatedAt,                  │ │
│  │   data: {                                              │ │
│  │     items: [...],                                      │ │
│  │     levels: [...] or numberRanges: [...]              │ │
│  │   }                                                    │ │
│  │ }                                                      │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ puzzleScores/{docID} - Player performance tracking    │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ puzzleReviews/{docID} - Player reviews & ratings      │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
         │
         │ Query puzzle by ID
         │
         ↓
┌──────────────────────────────────────────────────────────────┐
│                    PLAYER EXPERIENCE                         │
│                   /play/puzzle/{ID}                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ PuzzlePlayerPage (Router)                             │ │
│  │ ├─ Query: /play/puzzle/fSRQuQfEtNWVddqHmVOR           │ │
│  │ ├─ Fetch puzzle from Firestore                        │ │
│  │ └─ Route to type-specific component                  │ │
│  │    └─ For "ordering" type: OrderingPuzzle             │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ OrderingPuzzle (Interactive Game)                     │ │
│  │ ├─ Parse puzzle data                                  │ │
│  │ ├─ Display level selector (if levels exist)           │ │
│  │ │  └─ Level 1: 1-10, Level 2: 11-20, ...             │ │
│  │ ├─ Display items for selected level                  │ │
│  │ ├─ Handle drag-drop interactions                      │ │
│  │ ├─ Track moves & time                                 │ │
│  │ ├─ Validate answers                                   │ │
│  │ ├─ Award stars (1-5 based on performance)             │ │
│  │ ├─ Show confetti celebration                          │ │
│  │ ├─ Display leaderboard                                │ │
│  │ └─ Show reviews                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Player Actions:                                             │
│  ├─ Select level (if available)                            │
│  ├─ Drag items to arrange                                  │
│  ├─ Click "Check Answer"                                   │
│  ├─ Get feedback & stars                                   │
│  └─ View leaderboard & reviews                             │
└──────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Admin Side

```
App.js
├─ Route: /admin/puzzles → PuzzleListPage.jsx
│  └─ Displays table of all puzzles
│     └─ Columns: Name, Category, Topic, Type, Status, Actions
│        └─ Actions: Create, Edit, Delete
│
├─ Route: /admin/create-visual-puzzle → VisualPuzzleAdminPage.jsx
│  └─ Handles all puzzle type creation
│     └─ Type selector
│     └─ Basic info form (title, category, difficulty, etc.)
│     └─ Type-specific editor wrapper
│        └─ For "ordering" → OrderingEditor.jsx
│           ├─ Quick template selector
│           ├─ Item type selector (Numbers, Custom, Days, etc.)
│           ├─ Number range generator
│           ├─ Custom item manager
│           └─ Image upload handler
│
└─ Firestore integration
   ├─ Save: createVisualPuzzle(puzzleData)
   ├─ Update: updateVisualPuzzle(puzzleId, puzzleData)
   └─ Query: collection('puzzles').doc(puzzleId)
```

### Player Side

```
App.js
├─ Route: /play/puzzle/:id → PuzzlePlayerPage.jsx
│  └─ Query parameter: id = Firestore document ID
│     └─ Fetch puzzle from Firestore
│     └─ Determine puzzle type
│     └─ Route to type component
│        └─ For "ordering" → OrderingPuzzle.jsx
│           ├─ Parse puzzle.data
│           │  ├─ Extract items
│           │  ├─ Extract correctOrder
│           │  ├─ Extract levels/numberRanges
│           │  └─ Extract displayType (template used)
│           │
│           ├─ Render UI
│           │  ├─ Level selector (if levels exist)
│           │  ├─ Items for selected level
│           │  ├─ Drag-drop interface
│           │  ├─ Stats display
│           │  ├─ Action buttons
│           │  └─ Results section
│           │
│           └─ Handle interactions
│              ├─ Level selection → Filter items
│              ├─ Drag-drop → Reorder items
│              ├─ Check answer → Validate order
│              ├─ Reset → Clear state
│              └─ Complete → Save score
│
└─ Firestore integration
   ├─ Query: collection('puzzles').doc(id)
   ├─ Save score: collection('puzzleScores').add(scoreData)
   └─ Query leaderboard: collection('puzzleScores').where(...)
```

## Data Flow: Create → Play → Score

### 1. Admin Creates Puzzle
```
Admin fills form:
├─ Title: "Number Sequence 1-50"
├─ Category: "Math"
├─ Type: "ordering"
├─ ItemType: "Numbers"
├─ MaxRange: 50
└─ Clicks: "Generate Numbers"

OrderingEditor processes:
├─ Creates 50 items (1-50)
├─ Generates numberRanges:
│  ├─ { label: "1-10", min: 1, max: 10 }
│  ├─ { label: "11-20", min: 11, max: 20 }
│  └─ ... 5 ranges total
└─ Creates correctOrder: [1, 2, 3, ..., 50]

VisualPuzzleAdminPage saves to Firestore:
└─ puzzles/{auto-generated-ID}
   └─ Contains all data + levels
```

### 2. Player Opens Puzzle
```
Player navigates: /play/puzzle/fSRQuQfEtNWVddqHmVOR

PuzzlePlayerPage:
├─ Queries: puzzles/{ID}
├─ Gets data: {title, type, data: {items, correctOrder, levels}}
└─ Routes to: OrderingPuzzle component

OrderingPuzzle:
├─ Parses data.levels → [5 level objects]
├─ Renders level selector
├─ Filters items by selected level
├─ Shows: 10 numbers (Level 1: 1-10)
└─ Ready for interaction
```

### 3. Player Solves Level
```
Player:
├─ Selects Level 1
├─ Sees items: 1, 2, ..., 10 (shuffled)
├─ Drags to arrange: 1, 2, 3, ..., 10
├─ Clicks "Check Answer"

OrderingPuzzle validates:
├─ Compares: current order vs levelCorrectOrder
├─ Result: correct = true
├─ Awards stars: 3-5 based on moves/time
└─ Shows: Confetti animation + success message

Score saved to Firestore:
└─ puzzleScores/
   └─ {
   │   puzzleId: "fSRQuQfEtNWVddqHmVOR",
   │   userId: "user123",
   │   level: 1,
   │   score: 950,
   │   stars: 4,
   │   time: 45,
   │   moves: 12,
   │   createdAt: timestamp
   │ }

Leaderboard updated automatically
```

## Quick Templates System

### Template Definitions
Located in: `OrderingEditor.jsx`

```javascript
ORDERING_TEMPLATES = {
  custom: {
    label: "Custom Items",
    items: [],           // Admin adds items
    hasRanges: false
  },
  daysOfWeek: {
    label: "Days of Week",
    items: [...],        // Pre-defined
    hasRanges: false
  },
  monthsOfYear: {
    label: "Months of Year",
    items: [...],        // Pre-defined
    hasRanges: true,
    ranges: [...]        // Auto-generated
  },
  seasons: {
    label: "Seasons",
    items: [...],        // Pre-defined
    hasRanges: false
  },
  alphabet: {
    label: "Alphabet (A-Z)",
    items: [...],        // Pre-defined
    hasRanges: true,
    ranges: [...]        // Auto-generated
  }
};
```

### Number Generation
When admin selects "Numbers" itemType:

```javascript
handleGenerateNumbers() {
  const max = maxRange;  // User input: 50
  
  // Create items
  const items = [];
  for (let i = 1; i <= max; i++) {
    items.push({
      id: `item-${i}`,
      label: String(i),
      order: i,
      number: i
    });
  }
  
  // Generate ranges (10 items each)
  const ranges = [];
  for (let i = 1; i <= max; i += 10) {
    const start = i;
    const end = Math.min(i + 9, max);
    ranges.push({
      label: `${start}-${end}`,
      min: start,
      max: end
    });
  }
  
  // Save data
  onChange({
    items,
    numberRanges: ranges,
    itemType: "numbers",
    maxRange: max
  });
}
```

## Level Filtering Logic

### In OrderingPuzzle (Player Side)
```javascript
const getItemsForLevel = (items, level) => {
  if (!levels || levels.length === 0) return items;
  if (level >= levels.length) return items;
  
  const levelConfig = levels[level];
  if (!levelConfig) return items;
  
  // Filter by range
  const start = levelConfig.start || levelConfig.min;
  const end = levelConfig.end || levelConfig.max;
  
  return items.filter(item => {
    const itemNum = parseInt(item);
    return itemNum >= start && itemNum <= end;
  });
};

// For each level, only items in range are displayed
// Player arranges those items
// Validation compares against filtered correctOrder
```

## File Structure

```
/src
├─ /admin
│  ├─ PuzzleListPage.jsx          (Admin puzzle list view)
│  ├─ VisualPuzzleAdminPage.jsx    (Create/edit handler)
│  ├─ /puzzle-editors
│  │  ├─ OrderingEditor.jsx        (Ordering puzzle editor)
│  │  ├─ PictureWordEditor.jsx
│  │  ├─ FindPairEditor.jsx
│  │  ├─ SpotDifferenceEditor.jsx
│  │  └─ PictureShadowEditor.jsx
│  └─ /styles
│     └─ puzzle-admin.css          (Admin UI styles)
│
├─ /puzzles
│  ├─ OrderingPuzzle.jsx           (Player puzzle component)
│  ├─ PictureWordPuzzle.jsx
│  ├─ FindPairPuzzle.jsx
│  ├─ SpotDifferencePuzzle.jsx
│  └─ PictureShadowPuzzle.jsx
│
├─ /pages
│  ├─ PuzzlePlayerPage.jsx         (Router for puzzles)
│  └─ PuzzlesPage.jsx              (Public puzzle browser)
│
└─ /quiz/services
   └─ visualPuzzleService.js       (Firestore operations)
```

## API Integration

### Save Puzzle
```javascript
// Admin saves new puzzle
await createVisualPuzzle({
  type: "ordering",
  title: "Number Sequence 1-50",
  description: "...",
  categoryId: "cat123",
  topicId: "topic456",
  difficulty: "medium",
  ageGroup: "8-10",
  xpReward: 50,
  isPublished: true,
  data: {
    itemType: "numbers",
    maxRange: 50,
    items: [...50 items...],
    numberRanges: [...5 ranges...]
  }
});

// Returns: { id: "fSRQuQfEtNWVddqHmVOR" }
```

### Fetch Puzzle
```javascript
// Player loads puzzle
const puzzle = await getDoc(doc(db, 'puzzles', puzzleId));
// Returns: { id, type, title, data: { items, levels } }
```

### Save Score
```javascript
// Player completes level
await addDoc(collection(db, 'puzzleScores'), {
  puzzleId: "fSRQuQfEtNWVddqHmVOR",
  userId: "user123",
  level: 1,
  score: 950,
  stars: 4,
  time: 45,
  moves: 12,
  createdAt: timestamp
});
```

## Security Considerations

- Admin access controlled via authentication
- Firestore security rules validate permissions
- Puzzle data structure versioning for updates
- Score validation on backend (recommended)
- User input sanitization for custom items

## Performance Optimization

- Lazy load puzzle components
- Memoize level filtering
- Debounce drag operations
- Paginate puzzle lists
- Cache category/topic hierarchies
- Index Firestore queries by type, category, status

## Future Enhancements

- [ ] Bulk puzzle operations (import/export)
- [ ] Puzzle analytics dashboard
- [ ] A/B testing support
- [ ] Adaptive difficulty
- [ ] Puzzle variants system
- [ ] Achievement badges
- [ ] Social sharing
- [ ] Advanced search/filters
- [ ] Puzzle preview before publish
- [ ] Version history/rollback
