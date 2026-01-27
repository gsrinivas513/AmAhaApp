# Quiz Type System - Quick Reference Guide

## TL;DR: How Quiz Types Are Handled

**Yes, there IS a separate structure for each type!** Here's how:

### **3-Layer Architecture**

```
1. CENTRAL REGISTRY (1 file)
   └─ quizTypeRegistry.js
      • Defines all 14 types
      • Plugin system
      • Helper functions

2. ADMIN LAYER (1 file)
   └─ AdminQuizBuilder.jsx
      • Switch/case: one case per type
      • Form fields for each type
      • Data structure per type

3. PLAYER LAYER (Multiple files)
   ├─ QuestionRenderer.jsx (router)
   ├─ question-types/ (8 components)
   │  ├─ MultipleChoiceQuestion.jsx (MCQ, AUDIO_BASED)
   │  ├─ TrueFalseQuestion.jsx (TRUE_FALSE)
   │  ├─ FillBlankQuestion.jsx (FILL_BLANK)
   │  ├─ MatchingQuestion.jsx (MATCHING)
   │  ├─ OrderingQuestion.jsx (ORDERING)
   │  ├─ ImageSelectQuestion.jsx (IMAGE_BASED)
   │  ├─ MultiSelectQuestion.jsx (MULTI_SELECT)
   │  └─ DragDropQuestion.jsx (DRAG_DROP)
   └─ puzzles/ (3 components)
      ├─ CrosswordRenderer.jsx (CROSSWORD)
      ├─ WordSearchRenderer.jsx (WORD_SEARCH)
      └─ SudokuRenderer.jsx (SUDOKU)
```

---

## Type Coverage

### ✅ FULLY IMPLEMENTED (11 types)
Each has:
- ✅ Player component (rendering)
- ✅ Admin form (creation)
- ✅ Evaluator (grading)

| # | Type | Player | Admin | Evaluator |
|---|------|--------|-------|-----------|
| 1 | MCQ | MultipleChoiceQuestion.jsx | ✅ | In-component |
| 2 | MULTI_SELECT | MultiSelectQuestion.jsx | ✅ | In-component |
| 3 | TRUE_FALSE | TrueFalseQuestion.jsx | ✅ | In-component |
| 4 | FILL_BLANK | FillBlankQuestion.jsx | ✅ | In-component |
| 5 | MATCHING | MatchingQuestion.jsx | ✅ | In-component |
| 6 | ORDERING | OrderingQuestion.jsx | ✅ | In-component |
| 7 | IMAGE_BASED | ImageSelectQuestion.jsx | ✅ | In-component |
| 8 | DRAG_DROP | DragDropQuestion.jsx | ✅ | In-component |
| 9 | AUDIO_BASED | MultipleChoiceQuestion.jsx (reused) | ✅ | In-component |
| 10 | PUZZLE | Puzzle system | ✅ | puzzleEvaluator.js |
| 11 | CODING | ❌ Not implemented | ⚠️ Schema only | ❌ None |

### 🚧 IN PROGRESS (3 types)
Partial implementation, need completion:

| # | Type | Player | Admin | Evaluator |
|---|------|--------|-------|-----------|
| 12 | CROSSWORD | CrosswordRenderer.jsx | ⚠️ Basic | puzzleEvaluator.js |
| 13 | WORD_SEARCH | WordSearchRenderer.jsx | ⚠️ Basic | puzzleEvaluator.js |
| 14 | SUDOKU | SudokuRenderer.jsx | ⚠️ Basic | puzzleEvaluator.js |

---

## File Locations Quick Lookup

### By Type
```
MCQ                    → MultipleChoiceQuestion.jsx
MULTI_SELECT           → MultiSelectQuestion.jsx
TRUE_FALSE             → TrueFalseQuestion.jsx
FILL_BLANK             → FillBlankQuestion.jsx
MATCHING               → MatchingQuestion.jsx
ORDERING               → OrderingQuestion.jsx
IMAGE_BASED            → ImageSelectQuestion.jsx
DRAG_DROP              → DragDropQuestion.jsx
AUDIO_BASED            → MultipleChoiceQuestion.jsx (reuses)
PUZZLE                 → Puzzle system
CROSSWORD              → CrosswordRenderer.jsx
WORD_SEARCH            → WordSearchRenderer.jsx
SUDOKU                 → SudokuRenderer.jsx
CODING                 → ❌ Not implemented
```

### By Directory
```
src/quizzes/registry/
  └─ quizTypeRegistry.js           (Central definition)

src/quizzes/admin/
  └─ AdminQuizBuilder.jsx          (Form builder)

src/quiz/components/
  ├─ QuestionRenderer.jsx          (Router)
  ├─ question-types/
  │  ├─ MultipleChoiceQuestion.jsx
  │  ├─ TrueFalseQuestion.jsx
  │  ├─ FillBlankQuestion.jsx
  │  ├─ MatchingQuestion.jsx
  │  ├─ OrderingQuestion.jsx
  │  ├─ ImageSelectQuestion.jsx
  │  ├─ MultiSelectQuestion.jsx
  │  └─ DragDropQuestion.jsx
  └─ puzzles/
     ├─ CrosswordRenderer.jsx
     ├─ WordSearchRenderer.jsx
     └─ SudokuRenderer.jsx

src/quiz/services/
  └─ puzzleEvaluator.js            (Evaluation logic)
```

---

## How Each Type Works

### 1️⃣ **TYPE REGISTERED** (Central)
```
File: quizTypeRegistry.js

export const QUIZ_TYPES = {
  MCQ: "MCQ",
  MULTI_SELECT: "MULTI_SELECT",
  // ... etc
};

export const QUIZ_TYPE_PLUGINS = {
  [QUIZ_TYPES.MCQ]: {
    label: "Multiple Choice",
    inputType: "single_select",
    evaluationType: "exact",
    template: { /* default structure */ },
    // ...more config
  },
  // ... 13 more
};
```

### 2️⃣ **ADMIN FORM** (Creation)
```
File: AdminQuizBuilder.jsx

const QuizTypeAnswerForm = ({ question, onUpdate, theme }) => {
  switch(question.quizType) {
    case "MCQ":
      return (
        <div>
          <input placeholder="Option A" />
          <input placeholder="Option B" />
          <input placeholder="Option C" />
          <input placeholder="Option D" />
          <select>
            <option value="A">Select correct</option>
            <option value="B">Option B</option>
            <option value="C">Option C</option>
            <option value="D">Option D</option>
          </select>
        </div>
      );
    
    case "FILL_BLANK":
      return (
        <div>
          <input placeholder="Correct answer(s), comma-separated" />
          <label>
            <input type="checkbox" /> Case sensitive?
          </label>
        </div>
      );
    
    // ... case for each type
  }
};
```

### 3️⃣ **QUESTION RENDERER** (Router)
```
File: QuestionRenderer.jsx

const renderQuestionContent = () => {
  switch(questionType) {
    case 'multiple-choice':
    case 'MCQ':
      return <MultipleChoiceQuestion {...props} />;
    
    case 'fill-blank':
    case 'FILL_BLANK':
      return <FillBlankQuestion {...props} />;
    
    case 'crossword':
    case 'CROSSWORD':
      return <CrosswordRenderer {...props} />;
    
    // ... case for each type
  }
};
```

### 4️⃣ **PLAYER COMPONENT** (Rendering)
```
File: MultipleChoiceQuestion.jsx (example)

export default function MultipleChoiceQuestion({
  question,
  onAnswer,
  answered,
  showFeedback,
  theme,
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleCheck = () => {
    const isCorrect = selectedAnswer === question.answer.correctOption;
    onAnswer({
      answer: selectedAnswer,
      isCorrect,
      score: isCorrect ? 10 : 0,
    });
  };

  return (
    <div>
      {question.answer.options.map(option => (
        <label key={option.key}>
          <input
            type="radio"
            value={option.key}
            onChange={(e) => setSelectedAnswer(e.target.value)}
          />
          {option.text}
        </label>
      ))}
      <button onClick={handleCheck}>Check Answer</button>
    </div>
  );
}
```

### 5️⃣ **EVALUATION** (Grading)
```
For simple types (MCQ, FILL_BLANK, etc):
  → Logic is IN the component
  → Component calculates isCorrect, score

For puzzle types (CROSSWORD, SUDOKU, etc):
  → Logic is in puzzleEvaluator.js
  → Component calls evaluation service

File: puzzleEvaluator.js (example)

export const evaluateCrossword = (userGrid, solution) => {
  // Validate word placement
  // Count correct words
  // Calculate score
  return {
    isCorrect: allCorrect,
    score: points,
    feedback: "message"
  };
};
```

---

## Data Structures by Type

### MCQ Example
```javascript
{
  type: "multiple-choice",
  quizType: "MCQ",
  text: "What is 2+2?",
  answer: {
    correctOption: "B",  // Single answer
    options: [
      { key: "A", text: "3", media: null },
      { key: "B", text: "4", media: null },
      { key: "C", text: "5", media: null },
      { key: "D", text: "6", media: null }
    ]
  }
}
```

### FILL_BLANK Example
```javascript
{
  type: "fill-blank",
  quizType: "FILL_BLANK",
  text: "The capital of France is ____",
  answer: {
    correctAnswers: ["Paris", "PARIS"],  // Variations
    caseSensitive: false,
    fuzzyMatch: true,
    fuzzyThreshold: 0.85
  }
}
```

### MATCHING Example
```javascript
{
  type: "matching",
  quizType: "MATCHING",
  text: "Match countries to capitals",
  answer: {
    pairs: [
      { left: "France", right: "Paris" },
      { left: "Germany", right: "Berlin" },
      { left: "Spain", right: "Madrid" }
    ],
    leftItems: ["France", "Germany", "Spain"],
    rightItems: ["Paris", "Berlin", "Madrid"]
  }
}
```

### CROSSWORD Example
```javascript
{
  type: "crossword",
  quizType: "CROSSWORD",
  text: "Daily Crossword",
  answer: {
    gridSize: { rows: 9, cols: 9 },
    clues: {
      across: [
        { number: 1, text: "First president", answer: "WASHINGTON" }
      ],
      down: [
        { number: 1, text: "Large dog", answer: "WOLFHOUND" }
      ]
    },
    grid: [], // 9x9 grid of letters
    solution: []  // Solution grid
  }
}
```

---

## Key Helper Functions

### From quizTypeRegistry.js
```javascript
// Get plugin for a type
getQuizPlugin("MCQ");  // Returns plugin object

// Get all types
getAllQuizTypes();  // ["MCQ", "MULTI_SELECT", ...]

// Filter by category
getQuizTypesByCategory("advanced");  // Advanced types only

// Validate type
isValidQuizType("MCQ");  // true/false

// Get metadata
getQuizTypeMetadata("MCQ");
// Returns:
// {
//   id, label, description, complexity,
//   supportedInputs, defaultPoints,
//   allowsMedia, minOptions
// }
```

---

## Adding a New Type: Quick Steps

### 1. Register in `quizTypeRegistry.js`
```javascript
export const QUIZ_TYPES = {
  // ... existing
  MY_TYPE: "MY_TYPE",  // Add this
};

export const QUIZ_TYPE_PLUGINS = {
  // ... existing
  [QUIZ_TYPES.MY_TYPE]: {
    id: "MY_TYPE",
    label: "My Type",
    category: "intermediate",
    complexity: "medium",
    inputType: "custom",
    evaluationType: "custom",
    defaultPoints: 15,
    template: { answer: { /* structure */ } },
  },  // Add this
};
```

### 2. Create component `question-types/MyTypeQuestion.jsx`
```javascript
export default function MyTypeQuestion({
  question, onAnswer, answered, theme
}) {
  // Render UI
  // Handle interaction
  // Call onAnswer() with result
}
```

### 3. Add route in `QuestionRenderer.jsx`
```javascript
case 'my-type':
case 'MY_TYPE':
  return <MyTypeQuestion {...commonProps} />;
```

### 4. Add form in `AdminQuizBuilder.jsx`
```javascript
case "MY_TYPE":
  return (
    <div>
      {/* Your form fields */}
    </div>
  );
```

### 5. Test!

---

## Common Questions

### Q: Where is MCQ defined?
**A**: In `quizTypeRegistry.js` under `QUIZ_TYPE_PLUGINS[QUIZ_TYPES.MCQ]`

### Q: How does the system know which component to use?
**A**: `QuestionRenderer.jsx` has a switch/case that maps type to component

### Q: Where is the MCQ form?
**A**: In `AdminQuizBuilder.jsx` under `QuizTypeAnswerForm` → `case "MCQ"`

### Q: Where is MCQ rendering?
**A**: In `MultipleChoiceQuestion.jsx` component

### Q: How are new types evaluated?
**A**: Either in-component logic OR via `puzzleEvaluator.js` service

### Q: Can I add a custom type?
**A**: Yes! Use `registerQuizType()` function in registry

### Q: Are types modular?
**A**: Yes! Each type is self-contained and independent

### Q: What's the relationship between types?
**A**: Central registry (single source of truth) → everything else derives from it

---

## File Summary

| File | Lines | Purpose | Types Involved |
|------|-------|---------|-----------------|
| quizTypeRegistry.js | ~400 | Central definition | All 14 |
| AdminQuizBuilder.jsx | ~2250 | Admin forms | All 14 |
| QuestionRenderer.jsx | ~235 | Route to component | All 14 |
| MultipleChoiceQuestion.jsx | ~150 | Render MCQ/AUDIO | MCQ, AUDIO_BASED |
| FillBlankQuestion.jsx | ~100 | Render fill-blank | FILL_BLANK |
| MatchingQuestion.jsx | ~120 | Render matching | MATCHING |
| OrderingQuestion.jsx | ~110 | Render ordering | ORDERING |
| ImageSelectQuestion.jsx | ~130 | Render image select | IMAGE_BASED |
| MultiSelectQuestion.jsx | ~140 | Render multi-select | MULTI_SELECT |
| TrueFalseQuestion.jsx | ~90 | Render T/F | TRUE_FALSE |
| DragDropQuestion.jsx | ~150 | Render drag-drop | DRAG_DROP |
| CrosswordRenderer.jsx | ~300+ | Render crossword | CROSSWORD |
| WordSearchRenderer.jsx | ~300+ | Render word search | WORD_SEARCH |
| SudokuRenderer.jsx | ~300+ | Render sudoku | SUDOKU |
| puzzleEvaluator.js | ~200+ | Evaluate puzzles | CROSSWORD, WORD_SEARCH, SUDOKU |

---

## Architecture Benefits

✅ **Centralized**: All types defined in one registry
✅ **Modular**: Each type is independent
✅ **Scalable**: Easy to add new types
✅ **Maintainable**: Changes are localized
✅ **Extensible**: Plugin system for custom types
✅ **Type-safe**: Registry is single source of truth
✅ **DRY**: No code duplication between types

---

**Total Implementation Status**: 11/14 types complete (78%), 3/14 in progress (22%)
