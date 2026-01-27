# Quiz & Puzzle Types - Current Implementation & Usage

## ACTUAL CURRENT USAGE IN THE APPLICATION

---

## 1. QUIZ TYPES - CURRENT IMPLEMENTATION

### **Where Quiz Types Are Defined**
- **Source**: `src/quizzes/registry/quizTypeRegistry.js`
- **Types**: 10 question types + 4 puzzle types = 14 total
- **Storage**: Hardcoded registry + Firestore collection (optional)

### **How Quiz Types Are Currently Used**

#### **1.1 Quiz Creation Flow**
```
User navigates to AdminQuizBuilder
  ↓
Selects "Quiz Type" from dropdown (Line 116-121 in AdminQuizBuilder.jsx)
  ↓
getAllQuizTypes() loads all 14 types from quizTypeRegistry
  ↓
Form adjusts based on selected quizType
  ↓
Admin adds 17 questions (5 Easy, 3 Medium, 4 Hard, 5 Expert)
  ↓
Each question inherits the quizType from parent quiz
```

#### **1.2 Quiz Data Structure (Saved to Firestore)**
```javascript
// File: src/admin/ModernAdminDashboard.jsx, Line 842
{
  title: "Quiz Title",
  category: "science",
  audience: "All Ages",
  level: "Beginner",
  quizType: "MCQ",  // ← This determines the question type
  description: "...",
  metadata: {
    timeLimit: 1800,
    passingScore: 60,
    attempts: 1,
    shuffle: true,
    partialScoring: true,
    showExplanation: true,
  },
  levelVariant: "standard",
  questions: [
    {
      id: "q_1234567",
      order: 1,
      quizType: "MCQ",  // ← Inherited from parent
      question: { text: "...", media: [] },
      options: [
        { key: "A", text: "Option 1", media: null },
        { key: "B", text: "Option 2", media: null },
        // ...
      ],
      answer: { correctOption: "A", evaluationType: "exact" },
      difficulty: "Easy",
      points: 10,
      // ...
    },
    // ... 16 more questions
  ],
  createdDate: "2026-01-21...",
  status: "Draft",
  plays: 0,
  published: false,
}
```

#### **1.3 When User Plays a Quiz**
```
User clicks on quiz
  ↓
UniversalQuizRenderer loads (src/quizzes/components/UniversalQuizRenderer.jsx)
  ↓
Plugin = getQuizPlugin(question.quizType)  // Line 507
  ↓
Switch statement routes to correct renderer based on type:
  - MCQ → <MCQRenderer />
  - TRUE_FALSE → <TrueFalseRenderer />
  - FILL_BLANK → <FillBlankRenderer />
  - MATCHING → <MatchingRenderer />
  - ORDERING → <OrderingRenderer />
  - AUDIO_BASED → <AudioRenderer />
  - IMAGE_BASED → <ImageBasedRenderer />
  - DRAG_DROP → <DragDropRenderer />
  - CODING → <CodingRenderer />
  - MULTI_SELECT → <MultiSelectRenderer />
  ↓
Correct UI component renders question
  ↓
User interacts and submits answer
  ↓
Answer evaluated based on evaluationType from plugin
```

---

## 2. PUZZLE TYPES - CURRENT IMPLEMENTATION

### **Where Puzzle Types Are Defined**
- **Source 1**: `src/services/puzzleTypesService.js` (9 types)
- **Source 2**: `src/admin/AdminPuzzleBuilder.jsx` (7 game types)
- **Storage**: Hardcoded + Firestore collection (optional)

### **Puzzle Types Breakdown**

#### **Quiz Registry Puzzle Types (4)**
```javascript
- PUZZLE: Generic puzzle assembly
- CROSSWORD: Crossword puzzle with clues
- WORD_SEARCH: Hidden words in grid
- SUDOKU: 9x9 number grid puzzle
```

#### **Game Puzzle Types (5)**
```javascript
- find-pair: Memory matching game
- ordering: Sequence ordering game
- picture-shadow: Match images with shadows
- picture-word: Match pictures with words
- spot-difference: Find differences between images
- jigsaw: Jigsaw assembly game
```

### **How Puzzle Types Are Currently Used**

#### **2.1 Puzzle Creation Flow**
```
User navigates to AdminPuzzleBuilder
  ↓
Selects "Puzzle Type" from dropdown (Line 70 in AdminPuzzleBuilder.jsx)
  ↓
PUZZLE_TYPES array provides options:
  [
    { id: 'find-pair', label: 'Find Pairs', icon: '🔍' },
    { id: 'ordering', label: 'Ordering', icon: '🔢' },
    { id: 'picture-shadow', label: 'Picture Shadow', icon: '🌙' },
    { id: 'picture-word', label: 'Picture Word', icon: '🖼️' },
    { id: 'spot-difference', label: 'Spot Difference', icon: '🔎' },
    { id: 'word-search', label: 'Word Search', icon: '🔤' },
    { id: 'jigsaw', label: 'Jigsaw', icon: '🧩' },
  ]
  ↓
Configuration form changes based on selected type
  ↓
Type-specific validation rules applied
  ↓
Puzzle saved to Firestore with type field
```

#### **2.2 Puzzle Data Structure (Saved to Firestore)**
```javascript
// File: src/admin/AdminPuzzleBuilder.jsx, Line 337+
{
  title: "Puzzle Title",
  displayLabel: "Display Name",
  type: "find-pair",  // ← Determines configuration
  audience: "Kids 5-12",
  difficulty: "Easy",
  categoryId: "...",
  topicId: "...",
  subtopicId: "...",
  
  // Type-specific configuration
  // For find-pair:
  cards: [
    { id: 1, image: "...", pair: 2 },
    { id: 2, image: "...", pair: 1 },
    // ... 8+ images minimum
  ],
  
  // For picture-shadow:
  pairs: [
    { original: "image1.jpg", shadow: "shadow1.jpg" },
    // ...
  ],
  
  // For word-search:
  grid: ["...", "...", "..."],
  words: ["WORD1", "WORD2"],
  
  // For ordering:
  items: ["Step 1", "Step 2", "Step 3"],
  correctSequence: [1, 2, 3],
  
  // Generic fields
  createdAt: "2026-01-21...",
  status: "draft",
  published: false,
}
```

---

## 3. ACTUAL FIRESTORE COLLECTIONS STRUCTURE

### **Quizzes Collection**
```
/quizzes/
  ├── {quizId}/
  │   ├── title: "Quiz Title"
  │   ├── category: "science"
  │   ├── quizType: "MCQ"  ← Uses quiz type
  │   ├── questions: [...]
  │   ├── metadata: {...}
  │   └── createdDate: timestamp
  ├── {quizId2}/
  │   ├── title: "Another Quiz"
  │   ├── quizType: "MATCHING"  ← Different type
  │   └── ...
```

### **Puzzles Collection**
```
/puzzles/
  ├── {puzzleId}/
  │   ├── title: "Puzzle Title"
  │   ├── type: "find-pair"  ← Uses puzzle type
  │   ├── cards: [...]
  │   ├── difficulty: "Easy"
  │   └── createdAt: timestamp
  ├── {puzzleId2}/
  │   ├── title: "Another Puzzle"
  │   ├── type: "picture-shadow"  ← Different type
  │   └── ...
```

### **Quiz Types Collection** (New - Optional)
```
/quizTypes/
  ├── {docId}/
  │   ├── id: "MCQ"
  │   ├── label: "Multiple Choice"
  │   ├── description: "..."
  │   ├── category: "basic"
  │   └── isActive: true
  ├── {docId}/
  │   ├── id: "MATCHING"
  │   └── ...
```

### **Puzzle Types Collection** (New - Optional)
```
/puzzleTypes/
  ├── {docId}/
  │   ├── id: "find-pair"
  │   ├── label: "Find Pairs"
  │   ├── description: "..."
  │   ├── system: "puzzle-game"
  │   └── isActive: true
  ├── {docId}/
  │   ├── id: "picture-shadow"
  │   └── ...
```

---

## 4. QUERY EXAMPLES - HOW TYPES ARE QUERIED

### **Loading Quizzes of Specific Type**
```javascript
// In quiz player or admin dashboard
const quizzesRef = collection(db, 'quizzes');
const q = query(quizzesRef, where('quizType', '==', 'MCQ'));
const snapshot = await getDocs(q);
// Returns all MCQ quizzes
```

### **Loading Puzzles of Specific Type**
```javascript
// In puzzle player or admin dashboard
const puzzlesRef = collection(db, 'puzzles');
const q = query(puzzlesRef, where('type', '==', 'find-pair'));
const snapshot = await getDocs(q);
// Returns all Find Pair puzzles
```

### **Loading All Available Quiz Types**
```javascript
// In AdminQuizBuilder type selector dropdown
const allTypes = getAllQuizTypes();
// Returns: ['MCQ', 'TRUE_FALSE', 'FILL_BLANK', ..., 'SUDOKU']
// Used to populate dropdown options
```

### **Loading All Available Puzzle Types**
```javascript
// In AdminPuzzleBuilder type selector dropdown
const allTypes = getAllPuzzleTypes();
// Returns all 9 puzzle types from puzzleTypesService
// Used to populate dropdown options
```

---

## 5. KEY FUNCTIONS & THEIR PURPOSE

### **Quiz Type Functions**
| Function | File | Purpose |
|----------|------|---------|
| `getAllQuizTypes()` | quizTypeRegistry.js | Get all 14 quiz types for dropdowns |
| `getQuizPlugin(type)` | quizTypeRegistry.js | Get plugin config for specific type |
| `getQuizTypeMetadata(type)` | quizTypeRegistry.js | Get metadata (points, complexity, etc.) |
| `registerQuizType()` | quizTypeRegistry.js | Register new custom quiz type |

### **Puzzle Type Functions**
| Function | File | Purpose |
|----------|------|---------|
| `getAllPuzzleTypes()` | puzzleTypesService.js | Get all 9 puzzle types for dropdowns |
| `getPuzzleTypesBySystem()` | puzzleTypesService.js | Filter by system (quiz vs game) |
| `createPuzzleType()` | puzzleTypesService.js | Create custom puzzle type in Firestore |
| `updatePuzzleType()` | puzzleTypesService.js | Update existing puzzle type |
| `deletePuzzleType()` | puzzleTypesService.js | Delete puzzle type |
| `getPuzzleTypeStatistics()` | puzzleTypesService.js | Get usage stats |

---

## 6. END-TO-END WORKFLOW EXAMPLES

### **Example 1: Create an MCQ Quiz**
```
1. Admin clicks "Create Quiz" in AdminQuizBuilder
2. Selects quizType = "MCQ" from dropdown
3. Form renders with MCQ-specific options
4. Admin fills: title, category, level, audience
5. Admin adds 17 MCQ questions with:
   - Question text
   - 4 options (A, B, C, D)
   - Correct answer
   - Points and difficulty
6. Saves to Firestore:
   {
     title: "Biology Quiz",
     quizType: "MCQ",  ← Type determines UI when played
     questions: [...questions with options...]
   }
7. When user plays:
   - UniversalQuizRenderer loads
   - Sees quizType = "MCQ"
   - Renders MCQRenderer with radio buttons
   - User selects answer
   - Evaluates with "exact" matching
```

### **Example 2: Create a Find Pairs Puzzle**
```
1. Admin clicks "Create Puzzle" in AdminPuzzleBuilder
2. Selects type = "find-pair" from dropdown
3. Form shows:
   - Upload images (must be pairs, 4+ pairs minimum)
   - Arrange as cards
   - Set difficulty
4. Admin uploads 10 images (5 pairs)
5. Saves to Firestore:
   {
     title: "Animal Pairs",
     type: "find-pair",  ← Type determines card layout
     cards: [
       { id: 1, image: "dog.jpg", pair: 2 },
       { id: 2, image: "dog2.jpg", pair: 1 },
       ...
     ]
   }
6. When user plays:
   - Find Pairs player loads
   - Shows 10 cards in grid
   - User flips cards to find matching pairs
   - Puzzle tracks matches and time
```

### **Example 3: Manage Quiz Types**
```
1. Admin navigates to: #quiz-types
2. AdminQuizTypesTab loads
3. Shows all 14 types:
   - MCQ (system type)
   - TRUE_FALSE (system type)
   - ... etc
4. Can edit type metadata:
   - Label, description
   - Complexity, default points
   - Input/evaluation type
5. Can create custom quiz type
6. Changes saved to Firestore
7. Next quiz creation shows updated types
```

### **Example 4: Manage Puzzle Types**
```
1. Admin navigates to: #puzzle-types
2. AdminPuzzleTypesTab loads
3. Shows all 9 types organized by system:
   - Quiz Registry: PUZZLE, CROSSWORD, WORD_SEARCH, SUDOKU
   - Game Puzzles: find-pair, ordering, picture-shadow, etc.
4. Can edit/create/delete puzzle types
5. Statistics show:
   - Total: 9 types
   - Active: 9 types
   - By system breakdown
6. Changes sync with AdminPuzzleBuilder dropdown
```

---

## 7. STATISTICS & METRICS

### **Current Quiz Type Usage**
- **Total Types**: 14
- **System Types**: 10 (MCQ, TRUE_FALSE, FILL_BLANK, etc.)
- **Puzzle Types**: 4 (PUZZLE, CROSSWORD, WORD_SEARCH, SUDOKU)
- **In Dropdown**: All 14 available for selection
- **In Firestore**: Optional collection (puzzleTypes)

### **Current Puzzle Type Usage**
- **Total Types**: 9 (6 game + 3 grid-based)
- **Game Types**: find-pair, ordering, picture-shadow, picture-word, spot-difference, jigsaw
- **Quiz Registry Types**: PUZZLE, CROSSWORD, WORD_SEARCH, SUDOKU
- **In Dropdown**: All 9 available for selection
- **In Firestore**: Optional collection (quizTypes)

---

## 8. ACTUAL DATABASE IMPACT

### **When Quiz is Created**
- ✅ Quiz document saved with `quizType` field
- ✅ Each question inherits `quizType`
- ✅ Stored in `quizzes` collection
- ❌ Not stored in `quizTypes` collection (unless manually created)

### **When Puzzle is Created**
- ✅ Puzzle document saved with `type` field
- ✅ Type determines configuration validation
- ✅ Stored in `puzzles` collection
- ❌ Not stored in `puzzleTypes` collection (unless manually created)

### **When Type Management Tab is Used**
- ✅ Type metadata can be created/updated/deleted
- ✅ Stored in `quizTypes` or `puzzleTypes` collection
- ✅ Falls back to hardcoded registry if collection empty
- ⚠️ Changes don't retroactively affect existing quizzes/puzzles

---

## 9. KEY TAKEAWAYS

1. **Quiz Types are USED when**:
   - Creating a quiz (selecting the type)
   - Displaying quiz questions (rendering correct component)
   - Managing quiz metadata (admin dashboard)

2. **Puzzle Types are USED when**:
   - Creating a puzzle (selecting the type)
   - Configuring puzzle specifics (grids, pairs, etc.)
   - Managing puzzle metadata (admin dashboard)

3. **Types are STORED**:
   - In the quiz/puzzle document itself (`quizType` or `type` field)
   - Optionally in separate collections for metadata

4. **Types DETERMINE**:
   - Quiz form fields during creation
   - How quiz questions are rendered when played
   - Puzzle configuration options
   - Validation rules for puzzles

5. **Types are REFERENCED by**:
   - AdminQuizBuilder (dropdown selection)
   - UniversalQuizRenderer (routing to correct component)
   - AdminPuzzleBuilder (dropdown selection)
   - PuzzleCustomizer (configuration form)
