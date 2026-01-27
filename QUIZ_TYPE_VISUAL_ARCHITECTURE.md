# Quiz Type System - Visual Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    QUIZ TYPE SYSTEM (14 Types)                   │
└─────────────────────────────────────────────────────────────────┘

                         CENTRAL REGISTRY
                      (quizTypeRegistry.js)
                              │
                 ┌────────────┼────────────┐
                 │            │            │
            METADATA       PLUGINS      TEMPLATES
         (Label, desc)    (Behavior)   (Defaults)
                 │            │            │
    ┌────────────┴────────────┼────────────┴──────────┐
    │                         │                       │
    ▼                         ▼                       ▼
[Type Definition]      [Component Router]      [Form Builder]
                             │                       │
        ┌────────────────────┼───────────────────┐   │
        │                    │                   │   │
        ▼                    ▼                   ▼   ▼
   Question            Admin                 Player
   Renderer          QuizBuilder           Components
(QuestionRenderer.jsx) (AdminQuizBuilder.jsx)
        │                    │                   │
        │              [Switch/Case]        [Switch/Case]
        │              Form Fields for:     UI & Interaction:
        │              • MCQ form           • MultiChoice.jsx
        │              • Fill-Blank form    • TrueFalse.jsx
        │              • Matching form      • FillBlank.jsx
        │              • Ordering form      • Matching.jsx
        │              • etc                • Ordering.jsx
        │                                   • ImageSelect.jsx
        │                                   • MultiSelect.jsx
        │                                   • DragDrop.jsx
        │                                   • Crossword.jsx
        │                                   • WordSearch.jsx
        │                                   • Sudoku.jsx
        │                    │                   │
        │                    │                   │
        └────────────────────┴───────────────────┘
                             │
                             ▼
                      [User Answers]
                             │
                             ▼
                    [Evaluation Service]
                   (puzzleEvaluator.js)
                    [In-component eval]
                             │
                             ▼
                     [Score & Feedback]
```

---

## Type Hierarchy

```
QUIZ TYPES (14 Total)
│
├─ BASIC (3) - Simple, single answer
│  ├─ MCQ
│  ├─ TRUE_FALSE
│  └─ AUDIO_BASED
│
├─ INTERMEDIATE (5) - Medium complexity
│  ├─ MULTI_SELECT
│  ├─ FILL_BLANK
│  ├─ MATCHING
│  ├─ ORDERING
│  └─ WORD_SEARCH
│
└─ ADVANCED (6) - High complexity
   ├─ DRAG_DROP
   ├─ IMAGE_BASED
   ├─ PUZZLE
   ├─ CODING
   ├─ CROSSWORD
   └─ SUDOKU
```

---

## Data Flow: Creating an MCQ Question

```
STEP 1: Admin Interface
┌──────────────────────┐
│  AdminDashboard      │
│  "Add New Quiz"      │
│  button clicked      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────┐
│  AdminQuizBuilder opens      │
│  Shows type dropdown         │
│  MCQ selected                │
└──────────┬───────────────────┘
           │
           ▼
STEP 2: Form Generation
┌─────────────────────────────────────────────┐
│ QuizTypeAnswerForm component renders:       │
│ ┌─────────────────────────────────────────┐ │
│ │ switch(question.quizType) {             │ │
│ │   case "MCQ":                           │ │
│ │     return (                            │ │
│ │       <input> Option A                  │ │
│ │       <input> Option B                  │ │
│ │       <input> Option C                  │ │
│ │       <input> Option D                  │ │
│ │       <select> Correct: [A/B/C/D]       │ │
│ │     )                                   │ │
│ │ }                                       │ │
│ └─────────────────────────────────────────┘ │
└──────────┬──────────────────────────────────┘
           │
STEP 3: Data Input
│        Admin fills:
│        Q: "What is 2+2?"
│        Opt A: "3"
│        Opt B: "4" ← Selected as correct
│        Opt C: "5"
│        Opt D: "6"
│
           ▼
STEP 4: Save to Firestore
┌─────────────────────────────────────────┐
│ {                                       │
│   id: "q123",                           │
│   type: "multiple-choice",              │
│   quizType: "MCQ",                      │
│   text: "What is 2+2?",                 │
│   answer: {                             │
│     correctOption: "B",                 │
│     options: [                          │
│       {key: "A", text: "3"},            │
│       {key: "B", text: "4"},            │
│       {key: "C", text: "5"},            │
│       {key: "D", text: "6"}             │
│     ]                                   │
│   }                                     │
│ }                                       │
└──────────┬──────────────────────────────┘
           │
           ▼
STEP 5: Quiz Player Loads Question
┌────────────────────────────────┐
│ QuizPlayerPage fetches from DB │
│ Passes to QuestionRenderer      │
└──────────┬─────────────────────┘
           │
STEP 6: Type Detection & Routing
┌──────────────────────────────────────────┐
│ QuestionRenderer:                        │
│ switch(question.type || 'multiple-choice')│
│   case 'multiple-choice':                │
│     return <MultipleChoiceQuestion />    │
└──────────┬───────────────────────────────┘
           │
           ▼
STEP 7: Player Component Renders
┌──────────────────────────────┐
│ MultipleChoiceQuestion:      │
│ ┌──────────────────────────┐ │
│ │ What is 2+2?             │ │
│ │ ○ A) 3                   │ │
│ │ ○ B) 4                   │ │ User selects B
│ │ ○ C) 5                   │ │
│ │ ○ D) 6                   │ │
│ │ [Check Answer]           │ │
│ └──────────────────────────┘ │
└──────────┬──────────────────┘
           │
STEP 8: User Interaction
│        User clicks: "B) 4"
│        User clicks: "Check Answer"
│
           ▼
STEP 9: Component Evaluates
┌──────────────────────────────────────┐
│ In MultipleChoiceQuestion.jsx:       │
│                                      │
│ const checkAnswer = (userChoice) => {│
│   return userChoice ===              │
│     question.answer.correctOption;   │
│ };                                   │
│                                      │
│ Result: TRUE ✓                       │
│ Points: +10 XP                       │
└──────────┬─────────────────────────┘
           │
           ▼
STEP 10: Feedback Display
┌────────────────────────────────┐
│ ✓ Correct!                     │
│ You earned 10 XP               │
│ [Next Question] [See Explan.]  │
└────────────────────────────────┘
```

---

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    QUIZ PLAYER (Playing)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ question object
                           ▼
                    ┌──────────────────┐
                    │ QuestionRenderer │  ← Routes by type
                    └────────┬─────────┘
                             │
                switch(type)  │
              ┌──────────────┼──────────────┐
              │              │              │
         'mcq'│         'fill-blank'│    'crossword'│
              │              │              │
              ▼              ▼              ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │  Multiple    │  │ FillBlank    │  │ Crossword    │
    │  Choice Qn   │  │ Question     │  │ Renderer     │
    │              │  │              │  │              │
    │ • Radio btns │  │ • Text input │  │ • Grid       │
    │ • 4 options  │  │ • Fuzzy eval │  │ • Clues      │
    │ • Single sel │  │              │  │ • Fill cells │
    └──────────────┘  └──────────────┘  └──────────────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
                    onAnswer(userResponse)
                             │
                             ▼
                    ┌──────────────────┐
                    │  Evaluation      │
                    │  Logic           │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Result:         │
                    │  - Correct/Wrong │
                    │  - Points        │
                    │  - Feedback      │
                    └──────────────────┘
```

---

## File Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│              quizTypeRegistry.js (CORE)                       │
│  • Defines all 14 types                                      │
│  • Plugin definitions                                        │
│  • Default templates                                         │
│  • Helper functions                                          │
└────────┬──────────────────────────────────────┬──────────────┘
         │                                      │
         │ imports                              │ imports
         ▼                                      ▼
┌──────────────────────────┐        ┌──────────────────────────┐
│ AdminQuizBuilder.jsx     │        │ QuestionRenderer.jsx     │
│ (Admin side)             │        │ (Player side)            │
│                          │        │                          │
│ • Reads plugin data      │        │ • Reads type info        │
│ • Generates forms        │        │ • Routes to components   │
│ • Validates input        │        │ • Passes props           │
│ • Switch/case by type    │        │ • Switch/case by type    │
└──────────┬───────────────┘        └───────────┬──────────────┘
           │                                    │
           │ imports                           │ imports
           │                                   │
    ┌──────▼─────────────────────────┬────────▼──────────────┐
    │                                │                       │
    │         Question               │                    Puzzle
    │         Components             │                    Renderers
    │                                │
    ▼                                ▼                       ▼
┌──────────────────┐    ┌──────────────────────┐  ┌──────────────────┐
│ MultiChoice.jsx  │    │ FillBlank.jsx        │  │ Crossword.jsx    │
│ TrueFalse.jsx    │    │ Matching.jsx         │  │ WordSearch.jsx   │
│ MultiSelect.jsx  │    │ Ordering.jsx         │  │ Sudoku.jsx       │
│ ImageSelect.jsx  │    │ DragDrop.jsx         │  └──────────────────┘
│ etc              │    │ etc                  │          │
└────────┬─────────┘    └──────────┬───────────┘          │
         │                         │                      │
         │ evaluation logic        │                      │ evaluation
         │ (in component)          │                      │ (calls service)
         │                         │                      │
         └─────────────┬───────────┴──────────────────────┘
                       │
                       ▼
            ┌──────────────────────────┐
            │ puzzleEvaluator.js       │
            │ (Evaluation Service)     │
            │                          │
            │ • evaluateGrid()         │
            │ • evaluateWords()        │
            │ • evaluateSudoku()       │
            │ • etc                    │
            └──────────────────────────┘
```

---

## Type vs Component Mapping

```
REGISTRY TYPE      →  COMPONENT FILE           →  COMPONENT NAME
────────────────────────────────────────────────────────────────
MCQ                →  MultipleChoiceQuestion   →  MultipleChoice
MULTI_SELECT       →  MultiSelectQuestion      →  MultiSelect
TRUE_FALSE         →  TrueFalseQuestion        →  TrueFalse
FILL_BLANK         →  FillBlankQuestion        →  FillBlank
MATCHING           →  MatchingQuestion         →  Matching
ORDERING           →  OrderingQuestion         →  Ordering
IMAGE_BASED        →  ImageSelectQuestion      →  ImageSelect
DRAG_DROP          →  DragDropQuestion         →  DragDrop
AUDIO_BASED        →  MultipleChoiceQuestion   →  MultipleChoice (reused)
PUZZLE             →  N/A (puzzle system)      →  Various
CROSSWORD          →  CrosswordRenderer        →  Crossword
WORD_SEARCH        →  WordSearchRenderer       →  WordSearch
SUDOKU             →  SudokuRenderer           →  Sudoku
CODING             →  (Not visible)            →  (Placeholder)
```

---

## Form Generation Flow

```
Admin clicks "Add New Quiz"
         │
         ▼
AdminQuizBuilder opens
         │
         ▼
Type dropdown shows all types:
[MCQ, Multi-Select, True/False, Fill-Blank, ...]
         │
User selects type (e.g., MCQ)
         │
         ▼
getQuizPlugin("MCQ") called
Returns plugin object with:
├─ label: "Multiple Choice"
├─ inputType: "single_select"
├─ template: { answer: { correctOption, options: [...] } }
└─ defaultPoints: 10
         │
         ▼
QuizTypeAnswerForm renders
         │
         ├─ switch(question.quizType)
         │  case "MCQ":
         │    return MCQ form fields
         │  case "MULTI_SELECT":
         │    return Multi-Select form fields
         │  case "FILL_BLANK":
         │    return Fill-Blank form fields
         │  ... etc
         │
         ▼
Admin fills out form
(Options, correct answer, etc)
         │
         ▼
Save to Firestore with:
{ type: "multiple-choice", quizType: "MCQ", answer: {...} }
```

---

## Evaluation Dispatch

```
Question answered by user
         │
         ▼
QuestionRenderer receives answer
         │
         ▼
Calls onAnswer(userResponse)
         │
    switch(type)
    │
    ├─ MCQ/MULTI_SELECT/TRUE_FALSE/etc
    │  │
    │  └─ Evaluation in component
    │     (local logic)
    │     ✓ Correct / ✗ Wrong
    │
    └─ CROSSWORD/WORD_SEARCH/SUDOKU
       │
       └─ Calls puzzleEvaluator service
          ├─ evaluateCrossword(answer, solution)
          ├─ evaluateWordSearch(foundWords, wordList)
          └─ evaluateSudoku(grid, rules)
          Returns:
          ✓ Valid/Invalid
          Points: 25/0
```

---

## Plugin System Benefits

```
WITHOUT Plugin System:
─────────────────────
• Add new type = modify multiple files
• Type logic scattered across codebase
• Hard to test in isolation
• Tight coupling between types

WITH Plugin System:
──────────────────
✓ Central registry (single source of truth)
✓ Add new type = add plugin entry + component
✓ Type logic self-contained
✓ Easy to test each plugin
✓ Loose coupling
✓ Easy to disable/enable types
✓ Dynamic registration: registerQuizType()
✓ Metadata-driven UI generation
```

---

## Extension Points

```
If you want to...                  You modify...
────────────────────────────────────────────────────
Add new quiz type                  1. quizTypeRegistry.js
                                   2. New component
                                   3. QuestionRenderer.jsx
                                   4. AdminQuizBuilder.jsx

Change how type is evaluated       Component OR
                                   puzzleEvaluator.js

Add new form field to type         AdminQuizBuilder.jsx
                                   switch/case

Change type label/description      quizTypeRegistry.js
                                   (plugin definition)

Support new media type             Plugin supportsMedia
                                   Component rendering

Disable a type                     Remove from
                                   QUIZ_TYPES

Make type "deprecated"             Mark in registry
                                   Show warning in UI
```

---

## Performance Characteristics

```
Operation                    Time        Location
─────────────────────────────────────────────────────
Get all types              O(1)         In-memory registry
Get plugin for type        O(1)         Registry lookup
Render player component    O(n)         Component render
Validate answer            O(n)         Component eval
Load form for type         O(1)         Registry + switch
Evaluate grid/sudoku       O(n²)        puzzleEvaluator.js

Legend: O(1) = constant, O(n) = linear, O(n²) = quadratic
```

---

## Current Implementation Coverage

```
Type              Player   Admin   Evaluator   Notes
──────────────────────────────────────────────────────
MCQ               ✅       ✅      ✅          Complete
MULTI_SELECT      ✅       ✅      ✅          Complete
TRUE_FALSE        ✅       ✅      ✅          Complete
FILL_BLANK        ✅       ✅      ✅          Fuzzy matching
MATCHING          ✅       ✅      ✅          Pair matching
ORDERING          ✅       ✅      ✅          Sequence validation
IMAGE_BASED       ✅       ✅      ✅          Coordinate matching
DRAG_DROP         ✅       ✅      ✅          Category matching
AUDIO_BASED       ✅       ✅      ✅          Uses MCQ UI
PUZZLE            ⚠️       ✅      ✅          Via puzzle system
CROSSWORD         🚧       ⚠️      ⚠️          In progress
WORD_SEARCH       🚧       ⚠️      ⚠️          In progress
SUDOKU            🚧       ⚠️      ⚠️          In progress
CODING            ❌       ⚠️      ❌          Not implemented

Legend: ✅ Complete, 🚧 In progress, ⚠️ Partial, ❌ Todo
```

---

This architecture ensures:
- **Modularity**: Each type is independent
- **Scalability**: Easy to add new types
- **Maintainability**: Changes are localized
- **Testability**: Components can be tested in isolation
- **Extensibility**: Plugin system for third-party types
