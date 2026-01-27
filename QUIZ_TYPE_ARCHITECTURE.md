# Quiz Type Architecture & File Organization

## Current System Overview

The application has **14 quiz types** organized into a **modular, plugin-based architecture**. Here's how each type is handled:

---

## Quiz Type Categories

### 1. **Basic Types** (Simple, Single Answer)
- **MCQ** (Multiple Choice Question)
- **TRUE_FALSE** (True/False)
- **AUDIO_BASED** (Listen & Choose)

### 2. **Intermediate Types** (Medium Complexity)
- **MULTI_SELECT** (Multiple Answers)
- **FILL_BLANK** (Text Input)
- **MATCHING** (Pair Matching)
- **ORDERING** (Sequence Order)
- **WORD_SEARCH** (Find Words)

### 3. **Advanced Types** (Complex)
- **DRAG_DROP** (Categorize Items)
- **IMAGE_BASED** (Click Regions)
- **PUZZLE** (Arrange Pieces)
- **CODING** (Code Challenge)
- **CROSSWORD** (Fill Grid)
- **SUDOKU** (Number Grid)

---

## File Organization Structure

```
src/
├── quizzes/
│   ├── registry/
│   │   └── quizTypeRegistry.js          ← CENTRAL PLUGIN DEFINITION (all types defined here)
│   └── admin/
│       └── AdminQuizBuilder.jsx         ← Admin form builder (switch/case for each type)
│
├── quiz/
│   ├── components/
│   │   ├── QuestionRenderer.jsx         ← Main router (switch/case by type)
│   │   ├── question-types/
│   │   │   ├── MultipleChoiceQuestion.jsx
│   │   │   ├── TrueFalseQuestion.jsx
│   │   │   ├── FillBlankQuestion.jsx
│   │   │   ├── MatchingQuestion.jsx
│   │   │   ├── OrderingQuestion.jsx
│   │   │   ├── ImageSelectQuestion.jsx
│   │   │   ├── MultiSelectQuestion.jsx
│   │   │   └── DragDropQuestion.jsx
│   │   └── puzzles/
│   │       ├── CrosswordRenderer.jsx
│   │       ├── WordSearchRenderer.jsx
│   │       └── SudokuRenderer.jsx
│   └── services/
│       └── puzzleEvaluator.js           ← Evaluation logic for new types
```

---

## How Each Type is Handled

### **1. Central Registry** (`quizTypeRegistry.js`)
**Location**: `src/quizzes/registry/quizTypeRegistry.js`

This is the **source of truth** for all quiz type definitions:

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
```

Each type has a **plugin definition** with:
- ✅ **id** - Type identifier
- ✅ **label** - Display name
- ✅ **description** - What it does
- ✅ **category** - basic, intermediate, advanced
- ✅ **complexity** - simple, medium, complex
- ✅ **inputType** - single_select, text_input, pair_matching, etc.
- ✅ **evaluationType** - exact, fuzzy, sequence, grid_match, sudoku_rules, etc.
- ✅ **supportsMedia** - true/false
- ✅ **defaultPoints** - XP reward
- ✅ **template** - Default schema/structure

**Example Plugin (MCQ)**:
```javascript
[QUIZ_TYPES.MCQ]: {
  id: "MCQ",
  label: "Multiple Choice",
  description: "Single correct answer from multiple options",
  category: "basic",
  complexity: "simple",
  inputType: "single_select",
  evaluationType: "exact",
  supportsMedia: true,
  defaultPoints: 10,
  template: {
    answer: {
      correctOption: "",
      options: [
        { key: "A", text: "", media: null },
        { key: "B", text: "", media: null },
        { key: "C", text: "", media: null },
        { key: "D", text: "", media: null },
      ],
      evaluationType: "exact",
    },
  },
},
```

---

### **2. Player Components** (Rendering)

#### Where They Are:
`src/quiz/components/question-types/` and `src/quiz/components/puzzles/`

#### How They Work:
Each quiz type has a **React component** that handles:
- ✅ Rendering the question UI
- ✅ User input/interaction
- ✅ Feedback display
- ✅ Validation

**Examples**:
- `MultipleChoiceQuestion.jsx` - Radio buttons, options
- `FillBlankQuestion.jsx` - Text input field
- `MatchingQuestion.jsx` - Drag-and-drop pairs
- `OrderingQuestion.jsx` - Reorder items
- `CrosswordRenderer.jsx` - Grid with clues
- `WordSearchRenderer.jsx` - Letter grid with word highlighting
- `SudokuRenderer.jsx` - 9×9 number grid

---

### **3. Router Component** (`QuestionRenderer.jsx`)

**Location**: `src/quiz/components/QuestionRenderer.jsx`

This component **routes** to the correct player component based on type:

```javascript
const renderQuestionContent = () => {
  switch (questionType) {
    case 'multiple-choice':
      return <MultipleChoiceQuestion {...commonProps} />;
    case 'true-false':
      return <TrueFalseQuestion {...commonProps} />;
    case 'fill-blank':
      return <FillBlankQuestion {...commonProps} />;
    case 'matching':
      return <MatchingQuestion {...commonProps} />;
    case 'ordering':
      return <OrderingQuestion {...commonProps} />;
    case 'image-select':
      return <ImageSelectQuestion {...commonProps} />;
    case 'multi-select':
      return <MultiSelectQuestion {...commonProps} />;
    case 'drag-drop':
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

---

### **4. Admin Form Builder** (`AdminQuizBuilder.jsx`)

**Location**: `src/quizzes/admin/AdminQuizBuilder.jsx`

This component has **switch/case statements** for each type:
- ✅ Different form fields per type
- ✅ Validation specific to type
- ✅ Options definition (MCQ/MULTI_SELECT)
- ✅ Pair definition (MATCHING)
- ✅ Sequence definition (ORDERING)
- ✅ Code template (CODING)
- ✅ Grid/clues (CROSSWORD)
- etc.

**Example for MCQ**:
```javascript
case "MCQ":
  return (
    <div>
      {/* Define 4 Options */}
      {["A", "B", "C", "D"].map((key) => (
        <input 
          placeholder={`Enter option ${key}`}
          // ... form fields
        />
      ))}
      
      {/* Select Correct Option */}
      <select>
        <option value="A">Option A</option>
        <option value="B">Option B</option>
        <option value="C">Option C</option>
        <option value="D">Option D</option>
      </select>
    </div>
  );
```

---

### **5. Evaluation Logic** (`puzzleEvaluator.js`)

**Location**: `src/quiz/services/puzzleEvaluator.js`

This handles **grading/scoring** for the new puzzle types:
- ✅ CROSSWORD evaluation (word placement)
- ✅ WORD_SEARCH evaluation (word finding)
- ✅ SUDOKU evaluation (number rules)

**For Standard Types**: Evaluation is handled in individual question components

---

## Current Implementation Status

### ✅ Fully Implemented (11 types)
| Type | Player Component | Admin Form | Evaluator | Status |
|------|-----------------|-----------|-----------|--------|
| MCQ | MultipleChoiceQuestion.jsx | ✅ Full form | In component | ✅ Complete |
| MULTI_SELECT | MultiSelectQuestion.jsx | ✅ Full form | In component | ✅ Complete |
| TRUE_FALSE | TrueFalseQuestion.jsx | ✅ Full form | In component | ✅ Complete |
| FILL_BLANK | FillBlankQuestion.jsx | ✅ Full form | In component | ✅ Complete |
| MATCHING | MatchingQuestion.jsx | ✅ Full form | In component | ✅ Complete |
| ORDERING | OrderingQuestion.jsx | ✅ Full form | In component | ✅ Complete |
| DRAG_DROP | DragDropQuestion.jsx | ✅ Full form | In component | ✅ Complete |
| IMAGE_BASED | ImageSelectQuestion.jsx | ✅ Full form | In component | ✅ Complete |
| AUDIO_BASED | MultipleChoiceQuestion.jsx (reused) | ✅ Full form | In component | ✅ Complete |
| PUZZLE | N/A (puzzle system) | ✅ Via puzzle builder | In puzzleEvaluator | ✅ Complete |
| CODING | (Not visible) | ⚠️ Registered, no UI | ⚠️ Placeholder | ⏳ TODO |

### 🚧 Partially Implemented (3 types)
| Type | Player Component | Admin Form | Evaluator | Status |
|------|-----------------|-----------|-----------|--------|
| CROSSWORD | CrosswordRenderer.jsx | ⚠️ Basic schema | puzzleEvaluator.js | 🚧 In Progress |
| WORD_SEARCH | WordSearchRenderer.jsx | ⚠️ Basic schema | puzzleEvaluator.js | 🚧 In Progress |
| SUDOKU | SudokuRenderer.jsx | ⚠️ Basic schema | puzzleEvaluator.js | 🚧 In Progress |

---

## How to Add a New Quiz Type

### Step 1: Add to Registry
```javascript
// In quizTypeRegistry.js
export const QUIZ_TYPES = {
  // ... existing types
  MY_NEW_TYPE: "MY_NEW_TYPE",
};

export const QUIZ_TYPE_PLUGINS = {
  // ... existing plugins
  [QUIZ_TYPES.MY_NEW_TYPE]: {
    id: "MY_NEW_TYPE",
    label: "My New Type",
    description: "What it does",
    category: "intermediate",
    complexity: "medium",
    inputType: "custom_input",
    evaluationType: "custom_eval",
    supportsMedia: false,
    defaultPoints: 15,
    template: {
      answer: {
        // Your data structure
      },
    },
  },
};
```

### Step 2: Create Player Component
```javascript
// src/quiz/components/question-types/MyNewTypeQuestion.jsx
export default function MyNewTypeQuestion({ 
  question, 
  onAnswer, 
  answered, 
  showFeedback, 
  theme 
}) {
  // Render your UI
  // Handle user interaction
  // Return user answer via onAnswer()
}
```

### Step 3: Add to QuestionRenderer
```javascript
// In QuestionRenderer.jsx
import MyNewTypeQuestion from './question-types/MyNewTypeQuestion';

switch (questionType) {
  case 'my-new-type':
  case 'MY_NEW_TYPE':
    return <MyNewTypeQuestion {...commonProps} />;
}
```

### Step 4: Add Admin Form
```javascript
// In AdminQuizBuilder.jsx - QuizTypeAnswerForm
case "MY_NEW_TYPE":
  return (
    <div>
      {/* Your form fields */}
      <input placeholder="Your input" />
      {/* etc */}
    </div>
  );
```

### Step 5: Add Evaluation (if needed)
```javascript
// In puzzleEvaluator.js
export const evaluateMyNewType = (answer, userResponse) => {
  // Your evaluation logic
  return { 
    isCorrect: true/false,
    score: points,
    feedback: "message"
  };
};
```

---

## Plugin System Features

### Available Helper Functions
```javascript
// Get plugin for a type
const plugin = getQuizPlugin('MCQ');

// Get all types
const allTypes = getAllQuizTypes();

// Get types by category
const advanced = getQuizTypesByCategory('advanced');

// Validate type exists
if (isValidQuizType(typeString)) { ... }

// Get input component type
const inputType = getInputComponentType('MCQ'); // 'single_select'

// Get evaluation strategy
const evalType = getEvaluationStrategy('MCQ'); // 'exact'

// Get metadata
const meta = getQuizTypeMetadata('MCQ');
```

---

## Data Flow Example: MCQ

```
1. User selects MCQ type in admin
   ↓
2. AdminQuizBuilder loads plugin & shows MCQ form
   ↓
3. Admin enters: question text, 4 options, correct option
   ↓
4. Data saved to Firestore with type="MCQ"
   ↓
5. QuizPlayerPage fetches question
   ↓
6. QuestionRenderer detects type='multiple-choice' or 'MCQ'
   ↓
7. Renders MultipleChoiceQuestion component
   ↓
8. User selects answer → onAnswer callback
   ↓
9. Component evaluates: selected === correctOption
   ↓
10. Display feedback & points
```

---

## Key Design Principles

### ✅ Plugin Architecture
- **Central registry** (quizTypeRegistry.js)
- **Type-agnostic routing** (QuestionRenderer, AdminQuizBuilder)
- **Easy to extend** - add new type without modifying core

### ✅ Separation of Concerns
- **Registry**: Type definitions & metadata
- **Components**: UI rendering & interaction
- **Services**: Evaluation & scoring
- **Admin**: Form building for data entry

### ✅ Consistency
- All types follow the same data structure
- Same evaluation callback pattern
- Same component prop interface

### ✅ Extensibility
- `registerQuizType()` function for runtime registration
- Plugins can have custom evaluation strategies
- Support for media varies per type

---

## Common Tasks

### View All Quiz Types
```javascript
import { getAllQuizTypes, getQuizTypeMetadata } from './quizTypeRegistry';

const types = getAllQuizTypes();
types.forEach(type => {
  const meta = getQuizTypeMetadata(type);
  console.log(`${meta.label}: ${meta.description}`);
});
```

### Render Type-Specific Form
```javascript
import { getQuizPlugin } from './quizTypeRegistry';

const plugin = getQuizPlugin(question.quizType);
console.log(plugin.label); // "Multiple Choice"
console.log(plugin.inputType); // "single_select"
console.log(plugin.template); // Default structure
```

### Find Types by Complexity
```javascript
import { getQuizTypesByCategory } from './quizTypeRegistry';

const advancedTypes = getQuizTypesByCategory('advanced');
// Returns: DRAG_DROP, CODING, IMAGE_BASED, PUZZLE, CROSSWORD, SUDOKU, etc.
```

### Check Media Support
```javascript
import { getQuizPlugin } from './quizTypeRegistry';

const plugin = getQuizPlugin('CODING');
console.log(plugin.supportsMedia); // false
```

---

## Performance Considerations

### ✅ Code Splitting Opportunity
Currently all question components are imported statically. Could lazy-load:
```javascript
const MultipleChoiceQuestion = React.lazy(() => 
  import('./question-types/MultipleChoiceQuestion')
);
```

### ✅ Plugin Caching
Registry is in-memory - fast lookups

### ✅ Component Reuse
- AUDIO_BASED reuses MultipleChoiceQuestion
- Reduces bundle size

---

## Files to Review

**To understand the system**:
1. ✅ `src/quizzes/registry/quizTypeRegistry.js` - Start here
2. ✅ `src/quiz/components/QuestionRenderer.jsx` - See routing
3. ✅ `src/quizzes/admin/AdminQuizBuilder.jsx` - See form building
4. ✅ `src/quiz/components/question-types/*` - See implementations
5. ✅ `src/quiz/services/puzzleEvaluator.js` - See evaluation

---

## Summary

| Aspect | Implementation |
|--------|-----------------|
| **Type Registration** | Central registry (quizTypeRegistry.js) |
| **Player Rendering** | Component per type in question-types/ |
| **Admin Form Building** | Switch/case in AdminQuizBuilder.jsx |
| **Routing** | Switch/case in QuestionRenderer.jsx |
| **Evaluation** | In-component + puzzleEvaluator.js |
| **Extensibility** | Plugin system + registerQuizType() |
| **Total Types** | 14 types (11 complete, 3 in progress) |

**Status**: ✅ Modular, maintainable, and ready to extend!
