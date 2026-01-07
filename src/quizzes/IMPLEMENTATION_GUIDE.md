# Universal Quiz Template System - Implementation Guide

## Overview

This is a **production-ready quiz platform** that supports **11+ quiz types** using a single, flexible data schema. Only the `quizType` field changes - no new templates needed for new question types.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Quiz Platform                         │
├─────────────────────────────────────────────────────────┤
│  Admin Layer        │  Player Layer      │  Engine Layer │
├─────────────────────┼────────────────────┼───────────────┤
│ Quiz Builder        │ Quiz Renderer      │ Evaluation    │
│ Content Creation    │ User Interface     │ Engine        │
│ Question Editor     │ Real-time Feedback │ Scoring       │
├─────────────────────────────────────────────────────────┤
│            Plugin-based Quiz Type System                 │
├─────────────────────────────────────────────────────────┤
│             Unified Data Schema (JSON)                   │
└─────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. **Quiz Type Registry** (`quizTypeRegistry.js`)
Controls all quiz types as plugins. No hardcoding needed.

```javascript
// Get a quiz type plugin
const plugin = getQuizPlugin("MCQ");
// Returns: { id, label, description, inputType, evaluationType, template }

// Register new quiz type (for future extensibility)
registerQuizType("VOICE_RESPONSE", {
  id: "VOICE_RESPONSE",
  label: "Voice Response",
  // ... configuration
});
```

**Benefits:**
- ✅ Centralized quiz type management
- ✅ Easy to add new types
- ✅ No code changes needed for new types
- ✅ Metadata-driven approach

---

### 2. **Data Schema** (`quizDataSchema.md`)

**Single unified schema for all quiz types:**

```json
{
  "id": "quiz_001",
  "title": "Quiz Title",
  "quizType": "MCQ",  // ← Only this changes!
  "metadata": { /* time limit, points, rules */ },
  "questions": [
    {
      "id": "q_001",
      "quizType": "MCQ",
      "question": { "text": "...", "media": [] },
      "answer": { /* varies by quizType */ },
      "userAnswer": null
    }
  ]
}
```

**Key Features:**
- Single schema for all types
- Flexible media support (image, video, audio)
- Standardized evaluation
- Metadata-driven configuration

---

### 3. **Universal Quiz Renderer** (`UniversalQuizRenderer.jsx`)

Dynamically renders ANY quiz type with a single component.

```javascript
<UniversalQuizRenderer
  question={question}
  theme={theme}
  onAnswerChange={(answer) => setUserAnswer(answer)}
  onSubmit={(evaluation) => handleResult(evaluation)}
/>
```

**Renders for each type:**
- MCQ → Radio buttons
- MULTI_SELECT → Checkboxes
- TRUE_FALSE → Boolean buttons
- FILL_BLANK → Text input
- MATCHING → Two-column interface
- ORDERING → Draggable list
- DRAG_DROP → Categorization
- CODING → Code editor
- IMAGE_BASED → Canvas/Click detection
- PUZZLE → Drag-reorder
- AUDIO_BASED → Audio + MCQ

---

### 4. **Evaluation Engine** (`evaluationEngine.js`)

Universal evaluation logic for all quiz types.

```javascript
const result = evaluateQuizAnswer(question, userAnswer);
// Returns: { isCorrect, score, feedback, earnedPoints, maxPoints }
```

**Supported Evaluation Types:**
- Exact match (MCQ, TRUE_FALSE)
- Fuzzy match (FILL_BLANK)
- Partial credit (MULTI_SELECT)
- Sequence matching (ORDERING, PUZZLE)
- Coordinate matching (IMAGE_BASED)
- Pair matching (MATCHING)
- Category matching (DRAG_DROP)
- Test cases (CODING)

---

### 5. **Admin Quiz Builder** (`AdminQuizBuilder.jsx`)

Unified interface for creating quizzes of ANY type.

```javascript
<AdminQuizBuilder
  onSave={(quiz) => saveToDatabase(quiz)}
  theme={theme}
/>
```

**Features:**
- Step 1: Quiz metadata (title, category, type, rules)
- Step 2: Question editor (dynamic based on quizType)
- Step 3: Answer configuration (auto-adjusts to quizType)
- Real-time preview
- Drag-and-drop question reordering

---

## Usage Examples

### Example 1: Creating an MCQ Quiz

```javascript
const mcqQuiz = {
  id: "quiz_001",
  title: "Math Basics",
  quizType: "MCQ",
  questions: [
    {
      id: "q_001",
      quizType: "MCQ",
      question: { text: "What is 2+2?" },
      answer: {
        correctOption: "B",
        options: [
          { key: "A", text: "3" },
          { key: "B", text: "4" },
          { key: "C", text: "5" },
        ],
        evaluationType: "exact"
      }
    }
  ]
};
```

### Example 2: Creating a Coding Quiz

```javascript
const codingQuiz = {
  id: "quiz_002",
  title: "JavaScript Challenge",
  quizType: "CODING",
  questions: [
    {
      id: "q_001",
      quizType: "CODING",
      question: { text: "Write a function to add two numbers" },
      answer: {
        language: "javascript",
        template: "function add(a, b) { return a + b; }",
        testCases: [
          { input: { a: 2, b: 3 }, expectedOutput: 5, points: 50 }
        ],
        evaluationType: "test_cases"
      }
    }
  ]
};
```

### Example 3: Using the Renderer

```javascript
import UniversalQuizRenderer from './quizzes/components/UniversalQuizRenderer';

function QuizPlayer({ quiz }) {
  const [userAnswers, setUserAnswers] = useState([]);

  return (
    <div>
      {quiz.questions.map((question, idx) => (
        <UniversalQuizRenderer
          key={question.id}
          question={question}
          onAnswerChange={(answer) => {
            const newAnswers = [...userAnswers];
            newAnswers[idx] = answer;
            setUserAnswers(newAnswers);
          }}
          onSubmit={(evaluation) => {
            console.log(`Q${idx+1}: ${evaluation.isCorrect ? 'Correct' : 'Wrong'}`);
          }}
        />
      ))}
    </div>
  );
}
```

---

## Adding a New Quiz Type

To add a new quiz type (e.g., "VOICE_RESPONSE"), follow these steps:

### Step 1: Register in Quiz Type Registry

```javascript
// quizTypeRegistry.js
registerQuizType("VOICE_RESPONSE", {
  id: "VOICE_RESPONSE",
  label: "Voice Response",
  description: "Users record voice and submit",
  category: "advanced",
  complexity: "complex",
  inputType: "voice_recorder",
  evaluationType: "speech_recognition",
  supportsMedia: true,
  defaultPoints: 20,
  template: {
    answer: {
      acceptableText: [],
      languageCode: "en-US",
      evaluationType: "speech_recognition"
    }
  }
});
```

### Step 2: Create Renderer Component

```javascript
// In UniversalQuizRenderer.jsx, add:
case QUIZ_TYPES.VOICE_RESPONSE:
  return <VoiceResponseRenderer question={question} onAnswer={handleAnswer} />;
```

### Step 3: Implement Evaluator

```javascript
// In evaluationEngine.js, add:
case "speech_recognition":
  result = evaluateSpeechRecognition(userAnswer.text, question.answer.acceptableText);
  break;
```

**That's it!** No other changes needed. The system will automatically:
- ✅ Show it in the quiz type selector
- ✅ Support it in the renderer
- ✅ Evaluate it correctly
- ✅ Display it in the admin builder

---

## Database Schema (Firestore Example)

```
/quizzes/{quizId}
  ├── metadata
  │   ├── title: string
  │   ├── category: string
  │   ├── quizType: string
  │   ├── level: string
  │   └── ...
  ├── questions[]
  │   ├── id: string
  │   ├── quizType: string
  │   ├── question: object
  │   ├── answer: object
  │   └── ...
  └── stats
      ├── totalAttempts: number
      ├── avgScore: number
      └── ...

/userAttempts/{attemptId}
  ├── userId: string
  ├── quizId: string
  ├── answers[]: array
  ├── score: number
  ├── timestamp: date
  └── ...
```

---

## Integration with Modern Dashboard

### Step 1: Add Quiz Manager Page

```javascript
// src/pages/admin/ModernDashboard/pages/QuizManager.jsx
import AdminQuizBuilder from '../../../quizzes/admin/AdminQuizBuilder';
import QuizList from '../../../quizzes/admin/QuizList';

export const QuizManager = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  return (
    <div>
      <QuizList onSelect={setSelectedQuiz} />
      {selectedQuiz && (
        <AdminQuizBuilder initialQuiz={selectedQuiz} />
      )}
    </div>
  );
};
```

### Step 2: Add Quiz Player Page

```javascript
// src/pages/student/QuizPlayer.jsx
import UniversalQuizRenderer from '../quizzes/components/UniversalQuizRenderer';
import { evaluateQuizSession } from '../quizzes/engine/evaluationEngine';

export const QuizPlayer = ({ quizId }) => {
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  const handleSubmitQuiz = async () => {
    const evaluation = evaluateQuizSession(quiz.questions, userAnswers);
    await saveAttempt({ quizId, evaluation });
  };

  return (
    <div className="quiz-player">
      {quiz?.questions.map((q, idx) => (
        <UniversalQuizRenderer key={q.id} question={q} />
      ))}
      <button onClick={handleSubmitQuiz}>Submit Quiz</button>
    </div>
  );
};
```

---

## File Structure

```
src/quizzes/
├── schema/
│   └── quizDataSchema.md          # Complete data model documentation
├── registry/
│   └── quizTypeRegistry.js        # Quiz type plugin system
├── engine/
│   └── evaluationEngine.js        # Evaluation & scoring logic
├── components/
│   ├── UniversalQuizRenderer.jsx  # Main quiz renderer
│   └── UniversalQuizRenderer.css
├── admin/
│   ├── AdminQuizBuilder.jsx       # Quiz creation interface
│   ├── AdminQuizBuilder.css
│   └── QuizList.jsx              # Quiz management list
└── data/
    └── sampleQuizzes.js          # Example quizzes for all types
```

---

## Performance Optimization

### Lazy Loading
```javascript
const QuizRenderer = lazy(() => import('./UniversalQuizRenderer'));
```

### Memoization
```javascript
const QuestionCard = memo(({ question }) => <UniversalQuizRenderer question={question} />);
```

### Code Splitting
```javascript
// Load quiz engine only when needed
const { evaluateQuizAnswer } = await import('./evaluationEngine');
```

---

## Testing

### Unit Tests (Example)

```javascript
describe('Evaluation Engine', () => {
  it('evaluates MCQ correctly', () => {
    const question = { quizType: 'MCQ', answer: { correctOption: 'A' } };
    const userAnswer = { selectedOption: 'A' };
    const result = evaluateQuizAnswer(question, userAnswer);
    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(100);
  });

  it('evaluates FILL_BLANK with fuzzy matching', () => {
    const question = {
      quizType: 'FILL_BLANK',
      answer: { correctAnswers: ['Paris'], fuzzyThreshold: 0.85 }
    };
    const userAnswer = { text: 'paris' };
    const result = evaluateQuizAnswer(question, userAnswer);
    expect(result.isCorrect).toBe(true);
  });
});
```

---

## Best Practices

✅ **DO:**
- Use the unified schema for all quiz types
- Store quizType with each question
- Use the evaluation engine for all scoring
- Add metadata for each quiz
- Version your quiz data

❌ **DON'T:**
- Hardcode quiz-specific logic in components
- Create separate templates for each quiz type
- Store different schemas for different types
- Skip the evaluation engine

---

## Extensibility Checklist

When adding a new quiz type:

- [ ] Register in quizTypeRegistry.js
- [ ] Add to QUIZ_TYPES enum
- [ ] Create renderer component
- [ ] Add evaluator logic
- [ ] Update sample quizzes
- [ ] Test all evaluation cases
- [ ] Document usage examples
- [ ] Update admin builder if needed

---

## Support & Maintenance

### Common Tasks

**Create Quiz:** Use AdminQuizBuilder component
**Delete Quiz:** Remove from database
**Update Quiz:** Edit via AdminQuizBuilder
**Preview Quiz:** Use QuizPlayer component
**Analyze Results:** Use evaluation results API

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Quiz not rendering | Check quizType is valid |
| Wrong evaluation | Verify answer.evaluationType |
| Missing fields | Refer to quizDataSchema.md |
| Plugin not working | Check registry registration |

---

## Conclusion

This system provides:
- ✅ Single schema for 11+ quiz types
- ✅ Plugin-based extensibility
- ✅ Production-ready components
- ✅ Flexible evaluation engine
- ✅ Professional admin interface
- ✅ Scalable architecture

**No quiz type requires a new template. Only configuration changes!**
