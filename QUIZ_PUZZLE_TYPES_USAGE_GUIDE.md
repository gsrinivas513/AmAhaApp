# Quiz & Puzzle Types - Usage Throughout the Application

## Overview

The Quiz Types and Puzzle Types you created are integrated throughout the application in various ways:

---

## 1. QUIZ TYPES Usage (10 Types)

### 1.1 Quiz Type Registry
**Location**: `src/quizzes/registry/quizTypeRegistry.js`

**Types Defined**:
- MCQ (Multiple Choice)
- MULTI_SELECT (Multiple Answer)
- TRUE_FALSE
- FILL_BLANK (Fill in the Blank)
- MATCHING (Matching Pairs)
- ORDERING (Sequence Ordering)
- DRAG_DROP (Drag & Drop)
- CODING (Code Challenge)
- IMAGE_BASED (Image Selection)
- AUDIO_BASED (Audio Listening)

**Plus 4 Puzzle Types**:
- PUZZLE (Puzzle Assembly)
- CROSSWORD
- WORD_SEARCH
- SUDOKU

---

## 2. WHERE QUIZ TYPES ARE USED

### 2.1 Quiz Creation - AdminQuizBuilder
**File**: `src/quizzes/admin/AdminQuizBuilder.jsx`

**Usage**: 
```javascript
// Line 127: Type selector dropdown
{getAllQuizTypes().map((type) => {
  const plugin = getQuizPlugin(type);
  return (
    <option key={type} value={type}>
      {plugin.label}
    </option>
  );
})}
```

**What it does**:
- Users select a quiz type when creating a new quiz
- Shows all 10 quiz question types
- Each selection loads the appropriate template and form fields

---

### 2.2 Quiz Rendering - UniversalQuizRenderer
**File**: `src/quizzes/components/UniversalQuizRenderer.jsx`

**Usage**: Routes to specific renderer based on quiz type
```javascript
// Lines 531-557: Switch statement for each type
case QUIZ_TYPES.MCQ:
  return <MCQRenderer ... />;
case QUIZ_TYPES.AUDIO_BASED:
  return <AudioRenderer ... />;
case QUIZ_TYPES.TRUE_FALSE:
  return <TrueFalseRenderer ... />;
case QUIZ_TYPES.FILL_BLANK:
  return <FillBlankRenderer ... />;
case QUIZ_TYPES.MATCHING:
  return <MatchingRenderer ... />;
case QUIZ_TYPES.ORDERING:
  return <OrderingRenderer ... />;
// ... etc
```

**What it does**:
- When user plays a quiz, this component determines which type it is
- Renders the correct UI component for that type
- MCQ shows radio buttons, True/False shows 2 buttons, Fill Blank shows text input, etc.

---

### 2.3 Quiz Type Management - AdminQuizTypesTab
**File**: `src/admin/tabs/AdminQuizTypesTab.jsx`

**Usage**: Complete CRUD interface
```javascript
// Lines 56: Load all quiz types
const data = await getAllQuizTypes(!showInactive);

// Lines 117-128: Edit, delete, enable/disable types
await updateQuizType(editingType.docId, typeData, userId);
await createQuizType(typeData, userId);
await deleteQuizType(type.docId);
```

**What it does**:
- Admin can view all 10 quiz types
- Can edit metadata (label, description, complexity, etc.)
- Can create custom quiz types
- Can deactivate/activate types
- Shows statistics on usage

**Access URL**: `http://localhost:3000/admin/modern-dashboard#quiz-types`

---

## 3. PUZZLE TYPES Usage (9 Types)

### 3.1 Puzzle Types Service
**File**: `src/services/puzzleTypesService.js`

**Types Defined**:

**Quiz Registry Puzzle Types (4)**:
- PUZZLE (Puzzle Assembly)
- CROSSWORD (Crossword Puzzle)
- WORD_SEARCH (Word Search)
- SUDOKU (Sudoku Puzzle)

**Game Puzzle Types (5)**:
- find-pair (Memory matching game)
- ordering (Sequence ordering game)
- picture-shadow (Match images with shadows)
- picture-word (Match pictures with words)
- spot-difference (Find differences between images)
- jigsaw (Jigsaw puzzle assembly)

---

## 4. WHERE PUZZLE TYPES ARE USED

### 4.1 Puzzle Creation - AdminPuzzleBuilder
**File**: `src/admin/AdminPuzzleBuilder.jsx`

**Usage**: Type selector when creating puzzles
```javascript
// Line 11-18: Puzzle type definitions
const PUZZLE_TYPES = [
  { id: 'find-pair', label: 'Find Pairs', icon: '🔍' },
  { id: 'ordering', label: 'Ordering', icon: '🔢' },
  { id: 'picture-shadow', label: 'Picture Shadow', icon: '🌙' },
  { id: 'picture-word', label: 'Picture Word', icon: '🖼️' },
  { id: 'spot-difference', label: 'Spot Difference', icon: '🔎' },
  { id: 'word-search', label: 'Word Search', icon: '🔤' },
  { id: 'jigsaw', label: 'Jigsaw', icon: '🧩' },
];

// Line 70: Type selector
{PUZZLE_TYPES.map(t => (
  <option key={t.id} value={t.id}>{t.label}</option>
))}
```

**What it does**:
- Users select a puzzle type when creating a new puzzle
- Different types have different configuration options
- Each type has specific validation rules

---

### 4.2 Puzzle Type Management - AdminPuzzleTypesTab
**File**: `src/admin/tabs/AdminPuzzleTypesTab.jsx`

**Usage**: Complete CRUD interface for all 9 puzzle types
```javascript
// Line 55: Load all puzzle types
const data = await getAllPuzzleTypes(!showInactive);

// Lines 112-125: CRUD operations
await updatePuzzleType(editingType.docId, typeData, userId);
await createPuzzleType(typeData, userId);
await deletePuzzleType(type.docId);
await deactivatePuzzleType(type.docId, userId);
```

**What it does**:
- Admin can view all 9 puzzle types
- Shows types organized by system (quiz registry vs game puzzle)
- Statistics on total, active, custom types
- CRUD operations for type management
- Can deactivate/activate puzzle types

**Access URL**: `http://localhost:3000/admin/modern-dashboard#puzzle-types`

---

### 4.3 Puzzle Customization - PuzzleCustomizer
**File**: `src/components/PuzzleCustomizer.jsx`

**Usage**: Dynamic form generation based on type
```javascript
// Line 2: Import puzzle type configs
import { PUZZLE_TYPES, DIFFICULTY_LEVELS, PUZZLE_CONFIGS } from '../services/puzzleAdvancedService';

// Line 69: Dynamic form rendering
{Object.values(PUZZLE_TYPES).map((type) => (
  <option key={type} value={type}>{type}</option>
))}
```

**What it does**:
- Shows different customization options based on puzzle type
- Crossword: grid size, clues configuration
- Sudoku: difficulty level, number of clues
- Word Search: grid size, word list
- etc.

---

## 5. TYPE SELECTION MODAL

### 5.1 TypeSelectorModal
**File**: `src/admin/modals/TypeSelectorModal.jsx`

**Usage**: Improved type picker with rich UI
```javascript
// Line 29: Load and organize types by category
const data = await getAllQuizTypes(true);
```

**What it does**:
- Organized type selection with category tabs
- Shows descriptions and complexity levels
- Visual icons and colors
- Better UX than simple dropdown

---

## 6. Data Flow Diagram

```
┌─────────────────────────────────────────┐
│     Quiz/Puzzle Creation Flow           │
└─────────────────────────────────────────┘

Step 1: Admin Creates New Quiz/Puzzle
   └─> Selects Type from TypeSelectorModal or dropdown
   
Step 2: Type Registry Loaded
   └─> Quiz Registry: getAllQuizTypes()
   └─> Puzzle Registry: getAllPuzzleTypes()
   
Step 3: Plugin/Configuration Loaded
   └─> getQuizPlugin(type)
   └─> Load PUZZLE_CONFIGS for puzzle type
   
Step 4: Form Fields Generated
   └─> AdminQuizBuilder renders quiz-specific form
   └─> AdminPuzzleBuilder renders puzzle-specific form
   
Step 5: Quiz/Puzzle Saved to Firestore
   └─> Includes type field (quizType, puzzleType)
   
Step 6: User Plays Quiz/Puzzle
   └─> UniversalQuizRenderer loads by type
   └─> Correct component rendered for that type
   └─> User interaction handled by type-specific logic
   
Step 7: Admin Manages Types
   └─> AdminQuizTypesTab for quiz types
   └─> AdminPuzzleTypesTab for puzzle types
   └─> CRUD operations via services
```

---

## 7. Current Integrations

### Quiz Types Integrated:
✅ MCQ - Multiple Choice Questions  
✅ TRUE_FALSE - True/False Questions  
✅ FILL_BLANK - Text Input Questions  
✅ MULTI_SELECT - Multiple Correct Answers  
✅ MATCHING - Pair Matching  
✅ ORDERING - Sequence Arrangement  
✅ AUDIO_BASED - Audio Listening  
✅ IMAGE_BASED - Image Selection  
✅ DRAG_DROP - Drag & Drop Categorization  
✅ CODING - Code Challenges  

### Puzzle Types Integrated:
✅ find-pair - Memory Game  
✅ ordering - Number Ordering  
✅ picture-shadow - Shadow Matching  
✅ picture-word - Picture-Word Matching  
✅ spot-difference - Find Differences  
✅ jigsaw - Jigsaw Assembly  
✅ PUZZLE - Generic Puzzle  
✅ CROSSWORD - Crossword Grid  
✅ WORD_SEARCH - Word Search Grid  
✅ SUDOKU - Sudoku Grid  

---

## 8. How to Add a New Type

### To Add a New Quiz Type:

1. **Define in Registry** (`src/quizzes/registry/quizTypeRegistry.js`):
```javascript
[QUIZ_TYPES.NEW_TYPE]: {
  id: "NEW_TYPE",
  label: "New Type Label",
  description: "Description",
  category: "advanced",
  complexity: "complex",
  inputType: "some_input_type",
  evaluationType: "some_evaluation",
  supportsMedia: true,
  defaultPoints: 20,
  template: { /* template structure */ }
}
```

2. **Create Renderer Component**:
```javascript
// src/quizzes/components/NewTypeRenderer.jsx
const NewTypeRenderer = ({ question, onAnswer, theme }) => {
  // Component logic
};
```

3. **Add to UniversalQuizRenderer**:
```javascript
case QUIZ_TYPES.NEW_TYPE:
  return <NewTypeRenderer ... />;
```

4. **Add to AdminQuizBuilder** if special form needed

---

### To Add a New Puzzle Type:

1. **Add to puzzleTypesService.js** `ALL_PUZZLE_TYPES`:
```javascript
{
  id: 'new-puzzle',
  label: 'New Puzzle Type',
  description: '...',
  category: 'game-puzzle',
  system: 'puzzle-game',
  isActive: true,
  isSystem: true,
}
```

2. **Add Configuration** (if needed):
```javascript
// src/services/puzzleAdvancedService.js
'new-puzzle': {
  // configuration
}
```

3. **Create Player Component**:
```javascript
// src/puzzles/players/NewPuzzlePlayer.jsx
const NewPuzzlePlayer = ({ puzzle, onComplete }) => {
  // Component logic
};
```

4. **Update AdminPuzzleBuilder** to handle new type

---

## 9. Key Services & Imports

### Quiz Types:
```javascript
import { 
  getAllQuizTypes,
  getQuizPlugin,
  getQuizTypeMetadata,
  registerQuizType,
  QUIZ_TYPES,
  QUIZ_TYPE_PLUGINS
} from '../../quizzes/registry/quizTypeRegistry';
```

### Puzzle Types:
```javascript
import {
  getAllPuzzleTypes,
  getPuzzleTypesBySystem,
  getPuzzleTypeStatistics,
  createPuzzleType,
  updatePuzzleType,
  deletePuzzleType,
  initializeDefaultPuzzleTypes
} from '../../services/puzzleTypesService';
```

---

## 10. Firestore Collections

### Quiz Types Collection:
- **Path**: `quizTypes`
- **Documents**: One per quiz type
- **Fields**: id, label, description, category, complexity, metadata, etc.

### Puzzle Types Collection:
- **Path**: `puzzleTypes`
- **Documents**: One per puzzle type
- **Fields**: id, label, description, system, category, isActive, etc.

### Quizzes Collection:
- **Path**: `quizzes`
- **Field**: `quizType` - references a quiz type ID
- **Used by**: UniversalQuizRenderer to route to correct component

### Puzzles Collection:
- **Path**: `puzzles`
- **Field**: `type` - references a puzzle type ID
- **Used by**: Puzzle player to load correct component and configuration

---

## Summary

The types system works as follows:

1. **Management**: Admins create/edit/delete types via AdminQuizTypesTab and AdminPuzzleTypesTab
2. **Registry**: Types are stored in quizTypeRegistry.js (built-in) and Firestore (custom)
3. **Selection**: Users select types when creating quizzes/puzzles
4. **Creation**: Form fields and validations change based on selected type
5. **Storage**: Selected type is stored with the quiz/puzzle in Firestore
6. **Playback**: When user plays quiz/puzzle, the correct renderer is loaded based on type
7. **Customization**: Different types have different customization options, validation rules, and scoring logic

The system is modular and extensible - new types can be added without modifying core code.
