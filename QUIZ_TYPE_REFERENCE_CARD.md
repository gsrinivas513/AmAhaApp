# Quiz Type Quick Reference Card

## 🎯 All Quiz Types at a Glance

### 1️⃣ MCQ - Multiple Choice Question
```
Input:      Radio button selection
Render:     Single select from options
Evaluate:   Exact match
Points:     10 (default)
Example:    "What is 2+2?" → Select one option
Data:       { correctOption: "B", options: [...] }
Best for:   Quick assessments, general knowledge
```

### 2️⃣ MULTI_SELECT - Multiple Answer
```
Input:      Checkbox selection
Render:     Multiple select from options
Evaluate:   Partial scoring
Points:     15 (default)
Example:    "Select all prime numbers" → A, B, C
Data:       { correctOptions: ["A","C"], options: [...] }
Best for:   Multi-answer assessments, complex topics
```

### 3️⃣ TRUE_FALSE
```
Input:      Boolean button
Render:     Two buttons (True/False)
Evaluate:   Exact match
Points:     5 (default)
Example:    "Python is a language?" → True/False
Data:       { correctAnswer: true }
Best for:   Quick true/false tests
```

### 4️⃣ FILL_BLANK - Text Input
```
Input:      Text field
Render:     Single text input box
Evaluate:   Fuzzy match (typo tolerant!)
Points:     10 (default)
Example:    "Capital of France: ___" → "paris" ✓
Data:       { correctAnswers: ["Paris"], fuzzyMatch: true }
Best for:   Spelling, vocabulary, definitions
```

### 5️⃣ MATCHING - Pair Mapping
```
Input:      Click to pair items
Render:     Two columns with connectable items
Evaluate:   All pairs must match
Points:     20 (default)
Example:    Word ↔ Definition pairs
Data:       { pairs: [{left: "w_1", right: "s_1"}], leftItems, rightItems }
Best for:   Vocabulary, definitions, associations
```

### 6️⃣ ORDERING - Sequence Arrangement
```
Input:      Drag to reorder
Render:     Draggable list items
Evaluate:   Sequence must be exact
Points:     15 (default)
Example:    Steps of process in correct order
Data:       { correctSequence: ["1","2","3"], items: [...] }
Best for:   Process steps, story order, procedures
```

### 7️⃣ DRAG_DROP - Categorization
```
Input:      Drag items into categories
Render:     Multiple drop zones
Evaluate:   All items in correct category
Points:     25 (default)
Example:    Drag animals: fruits vs vegetables
Data:       { categories: [{id, label, items}], availableItems }
Best for:   Classification, grouping, sorting
```

### 8️⃣ CODING - Code Submission
```
Input:      Code editor
Render:     Full code editor with syntax highlighting
Evaluate:   Against test cases
Points:     50 (default)
Example:    "Write function to add two numbers"
Data:       { language: "javascript", testCases: [{input, expectedOutput}] }
Best for:   Programming, algorithm challenges
```

### 9️⃣ IMAGE_BASED - Click on Region
```
Input:      Click/mark on image
Render:     Interactive image canvas
Evaluate:   Coordinate matching within tolerance
Points:     10 (default)
Example:    "Click on the cat in the image"
Data:       { region: {x, y, width, height, tolerance: 10} }
Best for:   Visual identification, anatomy, maps
```

### 🔟 PUZZLE - Assemble Pieces
```
Input:      Drag puzzle pieces
Render:     Draggable puzzle pieces
Evaluate:   Correct sequence assembly
Points:     20 (default)
Example:    Arrange story sections in order
Data:       { pieces: [...], correctSequence: ["p_1","p_2"] }
Best for:   Story assembly, process flow, comprehension
```

### 1️⃣1️⃣ AUDIO_BASED - Listen & Answer
```
Input:      Radio selection after listening
Render:     Audio player + MCQ options
Evaluate:   Exact match to correct option
Points:     10 (default)
Example:    Listen to audio, select correct answer
Data:       { media: {type: "audio", url}, correctOption: "A" }
Best for:   Language learning, listening skills
```

---

## 📊 Evaluation Strategies

| Strategy | Used By | Logic | Example |
|----------|---------|-------|---------|
| **exact** | MCQ, TRUE_FALSE | `===` comparison | Answer must be identical |
| **fuzzy** | FILL_BLANK | Levenshtein distance | "Paris" matches "paris" or "Pari" |
| **partial** | MULTI_SELECT | Points per correct | 3 correct out of 5 = 60% |
| **sequence** | ORDERING, PUZZLE | Position matching | Items in exact order |
| **coordinate** | IMAGE_BASED | X/Y tolerance | Click ±10px from target |
| **pair** | MATCHING | All pairs exact | All word-definition pairs match |
| **category** | DRAG_DROP | Item placement | All items in correct buckets |

---

## 🔌 Plugin Registration

### MCQ Plugin
```javascript
{
  id: "MCQ",
  label: "Multiple Choice",
  description: "Single correct answer from options",
  category: "basic",
  complexity: "simple",
  inputType: "single_select",
  evaluationType: "exact",
  supportsMedia: true,
  defaultPoints: 10
}
```

### CODING Plugin
```javascript
{
  id: "CODING",
  label: "Code Challenge",
  description: "Write code against test cases",
  category: "advanced",
  complexity: "complex",
  inputType: "code_editor",
  evaluationType: "test_cases",
  supportsMedia: false,
  defaultPoints: 50
}
```

---

## 💾 Answer Configuration Examples

### MCQ Answer
```json
{
  "correctOption": "B",
  "options": [
    { "key": "A", "text": "Option 1" },
    { "key": "B", "text": "Option 2" },
    { "key": "C", "text": "Option 3" }
  ],
  "evaluationType": "exact"
}
```

### FILL_BLANK Answer
```json
{
  "correctAnswers": ["Paris", "paris", "PARIS"],
  "caseSensitive": false,
  "fuzzyMatch": true,
  "fuzzyThreshold": 0.85,
  "evaluationType": "fuzzy"
}
```

### MATCHING Answer
```json
{
  "pairs": [
    { "left": "word_1", "right": "def_1" },
    { "left": "word_2", "right": "def_2" }
  ],
  "leftItems": [
    { "id": "word_1", "text": "Happy" },
    { "id": "word_2", "text": "Sad" }
  ],
  "rightItems": [
    { "id": "def_1", "text": "Joyful" },
    { "id": "def_2", "text": "Unhappy" }
  ],
  "evaluationType": "exact"
}
```

### ORDERING Answer
```json
{
  "correctSequence": ["step_1", "step_2", "step_3"],
  "items": [
    { "id": "step_1", "text": "First step" },
    { "id": "step_2", "text": "Second step" },
    { "id": "step_3", "text": "Third step" }
  ],
  "evaluationType": "sequence"
}
```

### CODING Answer
```json
{
  "language": "javascript",
  "template": "function add(a, b) {\n  // Code here\n}",
  "testCases": [
    {
      "input": { "a": 2, "b": 3 },
      "expectedOutput": 5,
      "points": 50
    }
  ],
  "evaluationType": "test_cases"
}
```

---

## 🎨 Renderer Component Mapping

```javascript
// Automatically selects renderer based on quizType

MCQ              → MCQRenderer             (Radio buttons)
MULTI_SELECT     → MultiSelectRenderer     (Checkboxes)
TRUE_FALSE       → TrueFalseRenderer       (Boolean buttons)
FILL_BLANK       → FillBlankRenderer       (Text input)
MATCHING         → MatchingRenderer        (Two columns)
ORDERING         → OrderingRenderer        (Draggable list)
DRAG_DROP        → OrderingRenderer        (Categorization)
CODING           → CodingRenderer          (Code editor)
IMAGE_BASED      → ImageBasedRenderer      (Canvas)
PUZZLE           → OrderingRenderer        (Puzzle pieces)
AUDIO_BASED      → MCQRenderer             (Audio + options)
```

---

## 🚀 Usage Patterns

### Display Quiz (Simple)
```javascript
<UniversalQuizRenderer question={question} />
```

### Display Quiz (With Theme)
```javascript
<UniversalQuizRenderer 
  question={question} 
  theme={theme}
  onAnswerChange={handleAnswer}
  onSubmit={handleSubmit}
/>
```

### Create Quiz
```javascript
<AdminQuizBuilder 
  initialQuiz={quiz}
  onSave={saveQuiz}
  theme={theme}
/>
```

### Evaluate Answer
```javascript
const result = evaluateQuizAnswer(question, userAnswer);
// { isCorrect, score, feedback, earnedPoints }
```

### Evaluate Session
```javascript
const results = evaluateQuizSession(questions, userAnswers);
// { results: [], totalPoints, earnedPoints, finalScore }
```

---

## ⚙️ Configuration Parameters

### Quiz Metadata
```javascript
{
  timeLimit: 1800,           // Seconds
  totalPoints: 100,          // Max points
  passingScore: 60,          // % to pass
  shuffle: true,             // Randomize questions
  attempts: 3,               // Max attempts
  partialScoring: true,      // Allow partial credit
  showExplanation: true      // Show after answer
}
```

### Question Properties
```javascript
{
  id: "q_001",              // Unique ID
  sequence: 1,              // Order in quiz
  points: 10,               // Points for this Q
  quizType: "MCQ",          // Question type
  contentType: "text",      // text|image|video|audio|mixed
  hint: "...",              // Help for user
  explanation: "..."        // Why answer is correct
}
```

---

## 📈 Evaluation Results

### Result Object
```javascript
{
  // Always present
  isCorrect: true,          // Boolean
  score: 85,                // 0-100%
  feedback: "Good try!",    // User message
  earnedPoints: 8.5,        // Points earned
  maxPoints: 10,            // Total possible
  timestamp: "2024-01-05...",
  
  // For MULTI_SELECT
  correctCount: 3,
  incorrectCount: 1,
  missedCount: 0,
  
  // For MATCHING / ORDERING
  correctMatches: 4,
  totalMatches: 5,
  
  // For CODING
  passedTests: 3,
  totalTests: 5
}
```

---

## 🔄 Quiz Type Conversions

You can convert between similar types:

```
MCQ ↔ MULTI_SELECT (just add more correct options)
ORDERING ↔ PUZZLE (same interface, different purpose)
DRAG_DROP ↔ CATEGORIZATION (category items)
IMAGE_BASED ↔ CLICK_REGION (point-based selection)
```

**No schema change needed - just update quizType!**

---

## 📋 Checklist for New Quiz Type

To add a new type:

- [ ] Add to QUIZ_TYPES enum
- [ ] Register in quiz type registry
- [ ] Create renderer component (or reuse)
- [ ] Add evaluator function
- [ ] Update sample quizzes
- [ ] Test rendering
- [ ] Test evaluation
- [ ] Update documentation

**Total time: ~2 hours**
**Schema changes: 0**
**Breaking changes: 0**

---

## 🎓 Example: Create MCQ Quiz

```javascript
const mcqQuiz = {
  id: "quiz_001",
  title: "Math Basics",
  quizType: "MCQ",  // ← Important!
  
  questions: [{
    id: "q_001",
    quizType: "MCQ",
    question: { text: "What is 2+2?" },
    
    answer: {
      correctOption: "B",
      options: [
        { key: "A", text: "3" },
        { key: "B", text: "4" },
        { key: "C", text: "5" }
      ],
      evaluationType: "exact"
    },
    
    hint: "Count: 1, 2, 3, 4",
    explanation: "2 + 2 = 4"
  }]
};

// Display
<UniversalQuizRenderer question={mcqQuiz.questions[0]} />

// Evaluate
const answer = { selectedOption: "B" };
const result = evaluateQuizAnswer(mcqQuiz.questions[0], answer);
// { isCorrect: true, score: 100, feedback: "Correct!" }
```

---

## 🎓 Example: Create Coding Quiz

```javascript
const codingQuiz = {
  id: "code_001",
  title: "JavaScript Challenge",
  quizType: "CODING",  // ← Important!
  
  questions: [{
    id: "q_001",
    quizType: "CODING",
    question: { text: "Write a function to add two numbers" },
    
    answer: {
      language: "javascript",
      template: "function add(a, b) { return a + b; }",
      testCases: [
        { input: {a: 2, b: 3}, expectedOutput: 5, points: 50 }
      ],
      evaluationType: "test_cases"
    }
  }]
};

// Display
<UniversalQuizRenderer question={codingQuiz.questions[0]} />

// Evaluate
const answer = { code: "function add(a,b) {return a+b;}" };
const result = evaluateQuizAnswer(codingQuiz.questions[0], answer);
// { isCorrect: true, score: 100, passedTests: 1 }
```

---

## ✨ Pro Tips

✅ Always set `evaluationType` explicitly
✅ Include `explanation` for learning
✅ Use `fuzzyMatch` for text questions (typo tolerance)
✅ Set `passingScore` to challenge but not impossible
✅ Use `hints` to guide without giving away
✅ Enable `partialScoring` for complex multi-select
✅ Test all evaluation paths
✅ Validate user input before evaluation

---

**Print this card and keep it handy while building!**
**No schema memorization needed - just `quizType`!**
