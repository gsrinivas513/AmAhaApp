# Quiz Type System - Complete File Structure & Mapping

## Directory Tree: Where Everything Lives

```
src/
│
├── quizzes/
│   ├── registry/
│   │   └── quizTypeRegistry.js          ⭐ CENTRAL: All type definitions & plugins
│   │
│   └── admin/
│       ├── AdminQuizBuilder.jsx         📝 Admin form builder (switch/case per type)
│       ├── AdminPuzzleBuilder.jsx       🧩 Puzzle builder (uses new types)
│       └── tabs/
│           └── AdminQuizzesTab.jsx      📊 Quiz management UI
│
├── quiz/
│   ├── components/
│   │   ├── QuestionRenderer.jsx         🔀 ROUTER: Selects component by type
│   │   │
│   │   ├── question-types/              📦 Player components
│   │   │   ├── MultipleChoiceQuestion.jsx    (MCQ, AUDIO_BASED)
│   │   │   ├── TrueFalseQuestion.jsx         (TRUE_FALSE)
│   │   │   ├── FillBlankQuestion.jsx         (FILL_BLANK)
│   │   │   ├── MatchingQuestion.jsx          (MATCHING)
│   │   │   ├── OrderingQuestion.jsx          (ORDERING)
│   │   │   ├── ImageSelectQuestion.jsx       (IMAGE_BASED)
│   │   │   ├── MultiSelectQuestion.jsx       (MULTI_SELECT)
│   │   │   └── DragDropQuestion.jsx          (DRAG_DROP)
│   │   │
│   │   └── puzzles/                     🧩 Puzzle renderers
│   │       ├── CrosswordRenderer.jsx        (CROSSWORD)
│   │       ├── WordSearchRenderer.jsx       (WORD_SEARCH)
│   │       └── SudokuRenderer.jsx           (SUDOKU)
│   │
│   └── services/
│       └── puzzleEvaluator.js           ✅ Evaluation for puzzle types
│
└── admin/
    ├── components/
    │   ├── SearchFilterBar.jsx          🔍 Search & filter
    │   └── TableColumnHeader.jsx        📊 Sortable table headers
    │
    └── utils/
        └── tableUtils.js                🛠️ Table sorting utilities
```

---

## Type-to-Component Mapping Table

### BASIC TYPES (3)

| Type | Registry Constant | Label | Player Component | Admin Form | Evaluator | Points |
|------|------------------|-------|------------------|-----------|-----------|--------|
| MCQ | `QUIZ_TYPES.MCQ` | Multiple Choice | `MultipleChoiceQuestion.jsx` | ✅ QuizTypeAnswerForm (case "MCQ") | In-component | 10 |
| TRUE_FALSE | `QUIZ_TYPES.TRUE_FALSE` | True/False | `TrueFalseQuestion.jsx` | ✅ QuizTypeAnswerForm (case "TRUE_FALSE") | In-component | 5 |
| AUDIO_BASED | `QUIZ_TYPES.AUDIO_BASED` | Audio Listening | `MultipleChoiceQuestion.jsx` (reused) | ✅ QuizTypeAnswerForm (case "AUDIO_BASED") | In-component | 10 |

### INTERMEDIATE TYPES (5)

| Type | Registry Constant | Label | Player Component | Admin Form | Evaluator | Points |
|------|------------------|-------|------------------|-----------|-----------|--------|
| MULTI_SELECT | `QUIZ_TYPES.MULTI_SELECT` | Multiple Answer | `MultiSelectQuestion.jsx` | ✅ QuizTypeAnswerForm (case "MULTI_SELECT") | In-component | 15 |
| FILL_BLANK | `QUIZ_TYPES.FILL_BLANK` | Fill in Blank | `FillBlankQuestion.jsx` | ✅ QuizTypeAnswerForm (case "FILL_BLANK") | In-component (fuzzy) | 10 |
| MATCHING | `QUIZ_TYPES.MATCHING` | Matching Pairs | `MatchingQuestion.jsx` | ✅ QuizTypeAnswerForm (case "MATCHING") | In-component | 20 |
| ORDERING | `QUIZ_TYPES.ORDERING` | Sequence | `OrderingQuestion.jsx` | ✅ QuizTypeAnswerForm (case "ORDERING") | In-component | 15 |
| WORD_SEARCH | `QUIZ_TYPES.WORD_SEARCH` | Word Search | `WordSearchRenderer.jsx` | ⚠️ Basic schema | `puzzleEvaluator.js` | 15 |

### ADVANCED TYPES (6)

| Type | Registry Constant | Label | Player Component | Admin Form | Evaluator | Points |
|------|------------------|-------|------------------|-----------|-----------|--------|
| DRAG_DROP | `QUIZ_TYPES.DRAG_DROP` | Drag & Drop | `DragDropQuestion.jsx` | ✅ QuizTypeAnswerForm (case "DRAG_DROP") | In-component | 25 |
| IMAGE_BASED | `QUIZ_TYPES.IMAGE_BASED` | Image Selection | `ImageSelectQuestion.jsx` | ✅ QuizTypeAnswerForm (case "IMAGE_BASED") | In-component | 10 |
| PUZZLE | `QUIZ_TYPES.PUZZLE` | Puzzle Assembly | N/A (puzzle system) | ✅ Puzzle builder | `puzzleEvaluator.js` | 20 |
| CROSSWORD | `QUIZ_TYPES.CROSSWORD` | Crossword | `CrosswordRenderer.jsx` | ⚠️ Basic schema | `puzzleEvaluator.js` | 25 |
| SUDOKU | `QUIZ_TYPES.SUDOKU` | Sudoku | `SudokuRenderer.jsx` | ⚠️ Basic schema | `puzzleEvaluator.js` | 30 |
| CODING | `QUIZ_TYPES.CODING` | Code Challenge | ❌ Not implemented | ⚠️ Schema only | ❌ Not implemented | 50 |

---

## Detailed File Locations & Responsibilities

### 1. `src/quizzes/registry/quizTypeRegistry.js`
**Role**: Central registry and plugin system

**Contains**:
```javascript
export const QUIZ_TYPES = {
  MCQ: "MCQ",
  MULTI_SELECT: "MULTI_SELECT",
  TRUE_FALSE: "TRUE_FALSE",
  FILL_BLANK: "FILL_BLANK",
  MATCHING: "MATCHING",
  ORDERING: "ORDERING",
  DRAG_DROP: "DRAG_DROP",
  CODING: "CODING",
  IMAGE_BASED: "IMAGE_BASED",
  PUZZLE: "PUZZLE",
  AUDIO_BASED: "AUDIO_BASED",
  CROSSWORD: "CROSSWORD",
  WORD_SEARCH: "WORD_SEARCH",
  SUDOKU: "SUDOKU",
};

export const QUIZ_TYPE_PLUGINS = {
  [QUIZ_TYPES.MCQ]: {
    id: "MCQ",
    label: "Multiple Choice",
    description: "...",
    category: "basic",
    complexity: "simple",
    inputType: "single_select",
    evaluationType: "exact",
    supportsMedia: true,
    defaultPoints: 10,
    template: { ... },
  },
  // ... 13 more types
};
```

**Exported Functions**:
- `getQuizPlugin(quizType)` - Get plugin for type
- `getAllQuizTypes()` - Get all type keys
- `getQuizTypesByCategory(category)` - Filter by category
- `isValidQuizType(quizType)` - Validate type
- `getInputComponentType(quizType)` - Get input type
- `getEvaluationStrategy(quizType)` - Get eval strategy
- `registerQuizType(typeKey, plugin)` - Register new type
- `getQuizTypeMetadata(quizType)` - Get metadata

---

### 2. `src/quiz/components/QuestionRenderer.jsx`
**Role**: Router component for quiz players

**Purpose**: Selects correct player component based on question type

**Key Code**:
```javascript
const renderQuestionContent = () => {
  const commonProps = { question, onAnswer, answered, ... };
  
  switch (questionType) {
    case 'multiple-choice':
    case 'MCQ':
      return <MultipleChoiceQuestion {...commonProps} />;
    
    case 'true-false':
    case 'TRUE_FALSE':
      return <TrueFalseQuestion {...commonProps} />;
    
    case 'fill-blank':
    case 'FILL_BLANK':
      return <FillBlankQuestion {...commonProps} />;
    
    case 'matching':
    case 'MATCHING':
      return <MatchingQuestion {...commonProps} />;
    
    case 'ordering':
    case 'ORDERING':
      return <OrderingQuestion {...commonProps} />;
    
    case 'image-select':
    case 'IMAGE_BASED':
      return <ImageSelectQuestion {...commonProps} />;
    
    case 'multi-select':
    case 'MULTI_SELECT':
      return <MultiSelectQuestion {...commonProps} />;
    
    case 'drag-drop':
    case 'DRAG_DROP':
      return <DragDropQuestion {...commonProps} />;
    
    case 'crossword':
    case 'CROSSWORD':
      return <CrosswordRenderer {...commonProps} />;
    
    case 'word-search':
    case 'WORD_SEARCH':
      return <WordSearchRenderer {...commonProps} />;
    
    case 'sudoku':
    case 'SUDOKU':
      return <SudokuRenderer {...commonProps} />;
    
    default:
      return <MultipleChoiceQuestion {...commonProps} />;
  }
};
```

**Component Props**:
```javascript
{
  question,              // Question object
  questionNumber,        // Current question #
  totalQuestions,        // Total in quiz
  onAnswer,             // Callback when answered
  answered,             // Boolean: is answered?
  selectedAnswer,       // User's answer
  showFeedback,         // Show correct/wrong?
  theme,                // Theme object
  difficulty,           // Difficulty level
  contestMode,          // Hide explanations?
  disableHints,         // Disable hints?
  disableCheck,         // Disable check?
  disableReveal,        // Disable reveal?
}
```

---

### 3. `src/quiz/components/question-types/`
**Role**: Individual question type player components

**Files**:

#### `MultipleChoiceQuestion.jsx`
- **Handles**: MCQ, AUDIO_BASED
- **UI**: Radio buttons, 4 options
- **Evaluation**: Exact match on correctOption
- **Input**: User selects one option
- **Output**: `{ answer: "A" | "B" | "C" | "D" }`

#### `TrueFalseQuestion.jsx`
- **Handles**: TRUE_FALSE
- **UI**: Two buttons (True / False)
- **Evaluation**: Boolean comparison
- **Input**: User clicks True or False
- **Output**: `{ answer: true | false }`

#### `FillBlankQuestion.jsx`
- **Handles**: FILL_BLANK
- **UI**: Text input field
- **Evaluation**: Fuzzy string matching (0.85 threshold)
- **Input**: User types answer
- **Output**: `{ answer: "user typed text" }`

#### `MatchingQuestion.jsx`
- **Handles**: MATCHING
- **UI**: Drag items from left to right
- **Evaluation**: Pair matching verification
- **Input**: User matches pairs
- **Output**: `{ pairs: [{ left: "A", right: "1" }, ...] }`

#### `OrderingQuestion.jsx`
- **Handles**: ORDERING
- **UI**: Draggable list of items
- **Evaluation**: Sequence comparison
- **Input**: User reorders items
- **Output**: `{ sequence: ["item2", "item1", "item3"] }`

#### `ImageSelectQuestion.jsx`
- **Handles**: IMAGE_BASED
- **UI**: Image with clickable regions
- **Evaluation**: Coordinate matching with tolerance
- **Input**: User clicks region on image
- **Output**: `{ region: { x, y, width, height } }`

#### `MultiSelectQuestion.jsx`
- **Handles**: MULTI_SELECT
- **UI**: Checkboxes, multiple can be selected
- **Evaluation**: Multiple correct answers with partial scoring
- **Input**: User selects multiple options
- **Output**: `{ answers: ["A", "C", "D"] }`

#### `DragDropQuestion.jsx`
- **Handles**: DRAG_DROP
- **UI**: Drag items into categories
- **Evaluation**: Category placement verification
- **Input**: User drags items to categories
- **Output**: `{ items: [{ item, category }, ...] }`

**Common Props** (all components):
```javascript
{
  question,          // Question data
  onAnswer,          // Callback function
  answered,          // Is answered
  selectedAnswer,    // Current user answer
  showFeedback,      // Show correct/wrong
  theme,             // Theme object
  disableHints,      // Disable hints
  contestMode,       // Contest mode flag
}
```

---

### 4. `src/quiz/components/puzzles/`
**Role**: Puzzle type player components

#### `CrosswordRenderer.jsx`
- **Type**: CROSSWORD
- **UI**: 9×9 grid + clues panel
- **Data**: Grid state, clue definitions, solution
- **Evaluation**: Calls `puzzleEvaluator.js`
- **User Input**: Cell filling via keyboard

#### `WordSearchRenderer.jsx`
- **Type**: WORD_SEARCH
- **UI**: Letter grid + word list
- **Data**: Grid, word list, directions
- **Evaluation**: Calls `puzzleEvaluator.js`
- **User Input**: Select letters/words

#### `SudokuRenderer.jsx`
- **Type**: SUDOKU
- **UI**: 9×9 grid (3×3 boxes highlighted)
- **Data**: Puzzle grid, solution, given cells
- **Evaluation**: Calls `puzzleEvaluator.js`
- **User Input**: Number entry, validation

---

### 5. `src/quizzes/admin/AdminQuizBuilder.jsx`
**Role**: Admin form builder for quiz creation

**Key Component**: `QuizTypeAnswerForm`

**Contains**:
```javascript
const QuizTypeAnswerForm = ({ question, onUpdate, theme }) => {
  const renderAnswerFields = () => {
    switch (question.quizType) {
      case "MCQ":
      case "AUDIO_BASED":
        // Options A, B, C, D
        // Select correct option
        break;
      
      case "MULTI_SELECT":
        // Options A, B, C, D
        // Select multiple correct
        // Set min/max correct
        break;
      
      case "TRUE_FALSE":
        // Select: True or False
        break;
      
      case "FILL_BLANK":
        // Comma-separated correct answers
        // Case sensitive toggle
        // Fuzzy threshold
        break;
      
      case "MATCHING":
        // Left items list
        // Right items list
        // Define pairs
        break;
      
      case "ORDERING":
        // List of items
        // Define correct sequence
        break;
      
      case "IMAGE_BASED":
        // Image upload
        // Draw region/coordinates
        // Tolerance setting
        break;
      
      case "DRAG_DROP":
        // Define categories
        // List items
        // Assign items to categories
        break;
      
      case "CROSSWORD":
      case "WORD_SEARCH":
      case "SUDOKU":
        // Uses AdminPuzzleBuilder
        // Or basic schema entry
        break;
      
      default:
        return <div>Unknown quiz type</div>;
    }
  };
};
```

---

### 6. `src/quiz/services/puzzleEvaluator.js`
**Role**: Evaluation logic for puzzle types

**Functions**:
```javascript
export const evaluateCrossword = (userGrid, solution) => {
  // Check word placement
  // Returns: { isCorrect, score, feedback }
};

export const evaluateWordSearch = (foundWords, wordList) => {
  // Check found words against list
  // Returns: { isCorrect, foundCount, totalCount, score }
};

export const evaluateSudoku = (userGrid, rules) => {
  // Validate Sudoku rules
  // Check row/column/box uniqueness
  // Returns: { isCorrect, errors, score }
};
```

---

## How Types Flow Through System

### Creation Flow
```
Admin Dashboard
    ↓
AdminQuizBuilder (select type)
    ↓
AdminQuizBuilder (load plugin data)
    ↓
QuizTypeAnswerForm (render form for type)
    ↓
Admin fills form (type-specific fields)
    ↓
Save to Firestore
    {
      type: "multiple-choice",
      quizType: "MCQ",
      answer: { correctOption: "B", options: [...] }
    }
```

### Playing Flow
```
QuizPlayerPage (fetch question)
    ↓
Question data passed to QuestionRenderer
    ↓
QuestionRenderer (detect type)
    ↓
Switch/case selects component
    ↓
Component renders (e.g., MultipleChoiceQuestion)
    ↓
User interacts & submits answer
    ↓
onAnswer callback invoked
    ↓
Component evaluates (or calls service)
    ↓
Feedback displayed
```

---

## Adding a New Type: Complete Checklist

To add a new quiz type (e.g., "MATCHING_WITH_IMAGES"):

- [ ] **1. Add to Registry**
  - File: `src/quizzes/registry/quizTypeRegistry.js`
  - Add to `QUIZ_TYPES` object
  - Add plugin to `QUIZ_TYPE_PLUGINS`
  - Define template schema

- [ ] **2. Create Player Component**
  - File: `src/quiz/components/question-types/MatchingWithImagesQuestion.jsx`
  - Render UI for type
  - Handle user interaction
  - Call `onAnswer()` with result

- [ ] **3. Add to QuestionRenderer**
  - File: `src/quiz/components/QuestionRenderer.jsx`
  - Import component
  - Add case in switch statement
  - Map type names to component

- [ ] **4. Add Admin Form**
  - File: `src/quizzes/admin/AdminQuizBuilder.jsx`
  - Add case in `QuizTypeAnswerForm`
  - Create form fields
  - Handle data structure

- [ ] **5. Add Evaluation (if needed)**
  - File: `src/quiz/services/puzzleEvaluator.js`
  - Add evaluation function
  - Return `{ isCorrect, score, feedback }`

- [ ] **6. Test**
  - Create question in admin
  - Play question
  - Verify evaluation

---

## Key Functions & Utilities

### From `quizTypeRegistry.js`
```javascript
// Get everything about a type
const plugin = getQuizPlugin("MCQ");
// Returns: {
//   id, label, description, category, complexity,
//   inputType, evaluationType, supportsMedia,
//   defaultPoints, template
// }

// Get all type keys
const allTypes = getAllQuizTypes();
// Returns: ["MCQ", "MULTI_SELECT", "TRUE_FALSE", ...]

// Get advanced types only
const advTypes = getQuizTypesByCategory("advanced");

// Check if type is valid
if (isValidQuizType("MCQ")) { ... }

// Get input component name
const inputType = getInputComponentType("MCQ");
// Returns: "single_select"

// Get evaluation strategy
const evalType = getEvaluationStrategy("MCQ");
// Returns: "exact"

// Register custom type at runtime
registerQuizType("CUSTOM_TYPE", {
  id: "CUSTOM_TYPE",
  label: "Custom Type",
  // ... more config
});

// Get full metadata
const meta = getQuizTypeMetadata("MCQ");
// Returns: {
//   id, label, description, complexity,
//   supportedInputs, defaultPoints, allowsMedia, minOptions
// }
```

---

## File Dependencies Summary

| File | Depends On | Used By |
|------|-----------|---------|
| quizTypeRegistry.js | - | AdminQuizBuilder, QuestionRenderer, various services |
| QuestionRenderer.jsx | quizTypeRegistry (indirectly), all question components | QuizPlayerPage |
| question-types/*.jsx | Theme context | QuestionRenderer |
| puzzles/*.jsx | puzzleEvaluator.js, Theme context | QuestionRenderer |
| AdminQuizBuilder.jsx | quizTypeRegistry.js | Admin dashboard |
| puzzleEvaluator.js | - | Puzzle renderers, services |

---

## Summary

**Total Quiz Types**: 14
- **Fully Implemented**: 11
  - Player component ✅
  - Admin form ✅
  - Evaluation ✅
  
- **In Progress**: 3
  - Player component 🚧
  - Admin form ⚠️
  - Evaluation ⚠️

**All types centrally defined** in `quizTypeRegistry.js`
**All types routed** through `QuestionRenderer.jsx`
**All types have admin forms** in `AdminQuizBuilder.jsx`
**Types are modular and extensible** via plugin system
