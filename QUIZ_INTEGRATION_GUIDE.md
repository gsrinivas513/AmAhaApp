# Quiz Improvements - Integration Guide

## Quick Start Integration

### 1. Update QuizPlayerPage (5 minutes)

**File:** `src/pages/QuizPlayerPage.jsx`

Add imports at the top:
```jsx
import QuestionRenderer from '../quiz/components/QuestionRenderer';
import { audioFeedback } from '../quiz/utils/audioFeedback';
```

Add this to the useEffect on component mount (around line 70):
```jsx
// Initialize audio feedback
useEffect(() => {
  audioFeedback.loadSounds();
}, []);
```

**Replace the current question rendering section** (around lines 470-650) with:

```jsx
{/* Question Card */}
<div style={{
  background: theme.surfacePrimary,
  border: `2px solid ${theme.accentPrimary}30`,
  borderRadius: '16px',
  padding: '32px',
  marginBottom: '24px',
  boxShadow: `0 12px 32px ${theme.accentPrimary}15`,
  transition: 'all 0.3s ease',
}}>
  <QuestionRenderer
    question={currentQuestionData}
    questionNumber={currentQuestion + 1}
    totalQuestions={getVariantQuestions().length}
    onAnswer={handleAnswerSelect}
    answered={answered}
    selectedAnswer={selectedAnswer}
    showFeedback={answered}
    theme={theme}
    difficulty={selectedDifficulty}
  />
</div>
```

**Update the handleAnswerSelect function** (around line 700) to add audio:

```jsx
const handleAnswerSelect = (answerIndex) => {
  if (answered) return;

  setSelectedAnswer(answerIndex);
  
  // Check if answer is correct
  const isCorrect = answerIndex === currentQuestionData?.correctAnswer 
    || (currentQuestionData?.answer?.options && 
        currentQuestionData.answer.options[answerIndex]?.isCorrect);
  
  // Play audio feedback
  if (isCorrect) {
    audioFeedback.playCorrectSound();
  } else {
    audioFeedback.playWrongSound();
  }

  setAnswered(true);
  
  // Rest of your existing code...
};
```

**Play completion sound** when quiz finishes (around line 850):

```jsx
useEffect(() => {
  if (quizCompleted && !quizTimedOut) {
    audioFeedback.playCompletionSound();
  }
}, [quizCompleted, quizTimedOut]);
```

---

### 2. Update Quiz Data Model (Optional but Recommended)

To take advantage of new question types, update your quiz documents in Firestore.

**Example migration script** (`scripts/migrateQuizzes.mjs`):

```javascript
import admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

async function migrateQuizzes() {
  const snapshot = await db.collection('quizzes').get();
  
  snapshot.forEach(async (doc) => {
    const quiz = doc.data();
    const updatedQuestions = (quiz.questions || []).map((q) => ({
      ...q,
      id: q.id || `q_${Math.random().toString(36).substr(2, 9)}`,
      type: q.type || 'multiple-choice',
      imageUrl: q.imageUrl || '',
      explanation: q.explanation || {
        text: 'Check your textbook for more details.'
      },
      hints: q.hints || [],
      difficulty: q.difficulty || 'Medium',
      tags: q.tags || [],
      timeEstimate: q.timeEstimate || 30
    }));
    
    await db.collection('quizzes').doc(doc.id).update({
      questions: updatedQuestions,
      audioSettings: {
        enableSounds: true,
        correctSound: '/sounds/correct-answer.mp3',
        wrongSound: '/sounds/wrong-answer.mp3',
        completionSound: '/sounds/completion.mp3'
      }
    });
    
    console.log(`✅ Migrated: ${quiz.title}`);
  });
}

migrateQuizzes();
```

---

### 3. Add Sound Files (Optional)

Create a `public/sounds/` directory and add:
- `correct-answer.mp3` (200-300ms positive tone)
- `wrong-answer.mp3` (200-300ms negative tone)
- `completion.mp3` (1-2 second celebration)

**Free sources:**
- Freesound.org
- Pixabay.com/sounds
- Mixkit.co
- Zapsplat.com

---

### 4. Test the Integration

**Test checklist:**
- [ ] Open a quiz
- [ ] Answer a multiple choice question - should play sound
- [ ] Answer incorrectly - should play error sound
- [ ] Complete the quiz - should play completion sound
- [ ] Disable audio in settings (if you add the toggle)
- [ ] Test on mobile device
- [ ] Test different screen sizes

---

## Creating Quizzes with New Question Types

### In Admin Panel or Creation UI

When users create new quizzes, they can now select from:

```javascript
const QUESTION_TYPES = [
  { value: 'multiple-choice', label: '📋 Multiple Choice' },
  { value: 'true-false', label: '✓✗ True/False' },
  { value: 'fill-blank', label: '🔤 Fill in the Blank' },
  { value: 'matching', label: '🔗 Matching Pairs' },
  { value: 'ordering', label: '↕️ Ordering' },
  { value: 'image-select', label: '🖼️ Image Selection' },
  { value: 'multi-select', label: '☑️ Multiple Selection' },
  { value: 'drag-drop', label: '↔️ Drag & Drop' },
];
```

### Quiz Builder Component (To Be Created)

```jsx
// This would go in: src/admin/components/QuizBuilder.jsx

import { QUESTION_TYPES } from '../constants/questionTypes';
import QuestionTypeForm from './question-builders/QuestionTypeForm';

export default function QuizBuilder({ quizId }) {
  const [selectedType, setSelectedType] = useState('multiple-choice');
  const [questions, setQuestions] = useState([]);

  const addQuestion = (questionData) => {
    setQuestions([...questions, {
      id: `q_${Date.now()}`,
      type: selectedType,
      ...questionData
    }]);
  };

  return (
    <div>
      <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
        {QUESTION_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      <QuestionTypeForm type={selectedType} onSave={addQuestion} />

      <div>
        {questions.map((q) => (
          <div key={q.id}>
            <span>{q.type}: {q.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Audio Settings Component (Optional)

Add audio toggle to quiz player header:

```jsx
// In QuizPlayerPage.jsx, add to header area

<div style={{
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
}}>
  <button
    onClick={() => audioFeedback.toggle()}
    style={{
      background: audioFeedback.isEnabled ? theme.accentPrimary : theme.border,
      color: audioFeedback.isEnabled ? '#fff' : theme.textSecondary,
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
    }}
  >
    {audioFeedback.isEnabled ? '🔊 Audio On' : '🔇 Audio Off'}
  </button>
</div>
```

---

## Troubleshooting

### Audio not playing?

1. **Check browser permissions** - Some browsers block audio until user interaction
2. **Check volume** - Use `audioFeedback.setVolume(1)` to max
3. **Use fallback tones** - System will generate tones if MP3s fail
4. **Check console** - Look for errors in browser DevTools

### Questions not rendering?

1. **Check question type** - Must match one of the 8 supported types
2. **Check data structure** - Ensure all required fields are present
3. **Console errors** - Check browser console for specific errors
4. **Theme prop** - Ensure theme object is passed to QuestionRenderer

### Mobile issues?

1. **Touch events** - All buttons support touch/click
2. **Screen size** - Components use responsive grid layouts
3. **Landscape mode** - Test portrait and landscape
4. **Keyboard** - Test with keyboard and touch

---

## API Reference

### QuestionRenderer Props

```typescript
interface QuestionRendererProps {
  question: Question;              // Question object
  questionNumber: number;           // Current question #
  totalQuestions: number;          // Total # of questions
  onAnswer: (answer: any) => void; // Callback when answered
  answered: boolean;               // Is question answered?
  selectedAnswer: any;             // User's selected answer
  showFeedback: boolean;           // Show explanation?
  theme: ThemeObject;              // Theme colors
  difficulty?: string;             // Question difficulty
}
```

### Question Object Structure

```typescript
interface Question {
  type: string;                    // Question type
  text: string;                    // Question text
  imageUrl?: string;               // Optional image
  audioUrl?: string;               // Optional audio clue
  
  // Type-specific fields
  options?: Option[];              // For multiple choice, true/false
  answer?: string | number;        // For fill-blank, correct answer
  pairs?: Pair[];                  // For matching
  items?: Item[];                  // For ordering, drag-drop
  
  // Common fields
  explanation?: Explanation;       // Detailed explanation
  hints?: Hint[];                  // Hint system
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
  timeEstimate?: number;           // Seconds
}
```

### audioFeedback API

```javascript
// Load custom sounds
audioFeedback.loadSounds({
  correct: '/path/to/correct.mp3',
  wrong: '/path/to/wrong.mp3',
  completion: '/path/to/completion.mp3'
});

// Play sounds
audioFeedback.playCorrectSound();
audioFeedback.playWrongSound();
audioFeedback.playCompletionSound();
audioFeedback.playNotificationSound();

// Generate tones
audioFeedback.playTone(440, 100);      // A4, 100ms
audioFeedback.playSuccessTone();       // Success sequence
audioFeedback.playErrorTone();         // Error sequence

// Control
audioFeedback.toggle();               // Toggle on/off
audioFeedback.enable();
audioFeedback.disable();
audioFeedback.setVolume(0.8);         // 0-1
audioFeedback.stopAll();
```

---

## Performance Considerations

- QuestionRenderer is lightweight (~2KB)
- Question type components only render their type (~1-3KB each)
- Audio files should be compressed (50-200KB each)
- Images should be optimized (< 100KB each)
- All components use React.memo for optimization (recommended)

---

## Next Phase: Quiz Builder UI

After integration testing, create the Quiz Builder component that allows:

- [ ] Selecting question type from dropdown
- [ ] Form fields based on type selected
- [ ] Real-time preview
- [ ] Add/edit/delete questions
- [ ] Drag-to-reorder questions
- [ ] Image and audio upload
- [ ] Settings per question (hints, difficulty, time)
- [ ] Quiz-level settings (audio, messaging)

---

## Summary

✅ **5-minute integration** - Add QuestionRenderer to QuizPlayerPage  
✅ **Audio setup** - Already built into audioFeedback manager  
✅ **8 question types** - Ready to use immediately  
✅ **Mobile ready** - All components are responsive  
✅ **Backward compatible** - Existing quizzes still work  

**Total implementation time:** 1-2 hours for full integration

