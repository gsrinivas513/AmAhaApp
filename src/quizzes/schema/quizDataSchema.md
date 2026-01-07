# Universal Quiz Template System - Data Schema

## Overview
A single, flexible JSON schema that supports all quiz types. Only the `quizType` field changes the behavior.

---

## Core Data Model

### Quiz Object
```json
{
  "id": "quiz_001",
  "title": "Basic Mathematics",
  "description": "Learn fundamental math concepts",
  "category": "Mathematics",
  "level": "Beginner",
  "quizType": "MCQ",
  "metadata": {
    "timeLimit": 3600,
    "totalPoints": 100,
    "totalQuestions": 10,
    "passingScore": 60,
    "shuffle": true,
    "attempts": 3,
    "partialScoring": true,
    "showExplanation": true,
    "difficulty": "easy"
  },
  "questions": [ /* Question[] */ ],
  "rules": {
    "allowSkip": true,
    "allowReview": false,
    "randomizeOptions": true,
    "randomizeQuestions": true
  }
}
```

---

## Question Object (Universal)

### Base Question Structure
All question types inherit this structure:

```json
{
  "id": "q_001",
  "sequence": 1,
  "points": 10,
  "quizType": "MCQ",
  "contentType": "text|image|video|audio|mixed",
  
  "question": {
    "text": "What is 2 + 2?",
    "media": [
      {
        "type": "image|video|audio",
        "url": "https://example.com/image.jpg",
        "alt": "Math problem diagram",
        "duration": 120
      }
    ]
  },
  
  "hint": "Think of the counting method",
  "explanation": "2 + 2 = 4 because...",
  
  "answer": { /* Varies by quizType */ },
  "userAnswer": null,
  "score": 0,
  "isCorrect": false
}
```

---

## Quiz Type Definitions & Answer Structures

### 1. MCQ (Multiple Choice Question)
```json
{
  "quizType": "MCQ",
  "answer": {
    "correctOption": "B",
    "options": [
      { "key": "A", "text": "3", "media": null },
      { "key": "B", "text": "4", "media": null },
      { "key": "C", "text": "5", "media": null },
      { "key": "D", "text": "6", "media": null }
    ],
    "evaluationType": "exact"
  },
  "userAnswer": {
    "selectedOption": "B"
  }
}
```

### 2. MULTI_SELECT (Multiple Correct Answers)
```json
{
  "quizType": "MULTI_SELECT",
  "answer": {
    "correctOptions": ["A", "C"],
    "minCorrect": 2,
    "maxIncorrect": 1,
    "options": [
      { "key": "A", "text": "Prime number", "media": null },
      { "key": "B", "text": "Even number", "media": null },
      { "key": "C", "text": "Natural number", "media": null },
      { "key": "D", "text": "Negative", "media": null }
    ],
    "evaluationType": "partial"
  },
  "userAnswer": {
    "selectedOptions": ["A", "C"]
  }
}
```

### 3. TRUE_FALSE
```json
{
  "quizType": "TRUE_FALSE",
  "answer": {
    "correctAnswer": true,
    "evaluationType": "exact"
  },
  "userAnswer": {
    "answer": true
  }
}
```

### 4. FILL_BLANK (Fill in the Blanks)
```json
{
  "quizType": "FILL_BLANK",
  "question": {
    "text": "The capital of France is ___________"
  },
  "answer": {
    "correctAnswers": ["Paris", "paris", "PARIS"],
    "caseSensitive": false,
    "fuzzyMatch": true,
    "fuzzyThreshold": 0.85,
    "evaluationType": "fuzzy"
  },
  "userAnswer": {
    "text": "paris"
  }
}
```

### 5. MATCHING (Pair Matching)
```json
{
  "quizType": "MATCHING",
  "answer": {
    "pairs": [
      { "left": "item_1", "right": "item_a" },
      { "left": "item_2", "right": "item_b" },
      { "left": "item_3", "right": "item_c" }
    ],
    "leftItems": [
      { "id": "item_1", "text": "2 + 2", "media": null },
      { "id": "item_2", "text": "5 - 3", "media": null },
      { "id": "item_3", "text": "3 × 2", "media": null }
    ],
    "rightItems": [
      { "id": "item_a", "text": "4", "media": null },
      { "id": "item_b", "text": "2", "media": null },
      { "id": "item_c", "text": "6", "media": null }
    ],
    "evaluationType": "exact"
  },
  "userAnswer": {
    "pairs": [
      { "left": "item_1", "right": "item_a" },
      { "left": "item_2", "right": "item_b" },
      { "left": "item_3", "right": "item_c" }
    ]
  }
}
```

### 6. ORDERING (Arrange in Order)
```json
{
  "quizType": "ORDERING",
  "question": {
    "text": "Arrange these numbers in ascending order"
  },
  "answer": {
    "correctSequence": ["item_1", "item_2", "item_3", "item_4"],
    "items": [
      { "id": "item_1", "text": "10", "media": null },
      { "id": "item_2", "text": "25", "media": null },
      { "id": "item_3", "text": "50", "media": null },
      { "id": "item_4", "text": "100", "media": null }
    ],
    "evaluationType": "sequence"
  },
  "userAnswer": {
    "sequence": ["item_1", "item_2", "item_3", "item_4"]
  }
}
```

### 7. DRAG_DROP (Drag & Drop Categorization)
```json
{
  "quizType": "DRAG_DROP",
  "question": {
    "text": "Categorize the fruits and vegetables"
  },
  "answer": {
    "categories": [
      {
        "id": "cat_1",
        "label": "Fruits",
        "items": ["item_1", "item_2"]
      },
      {
        "id": "cat_2",
        "label": "Vegetables",
        "items": ["item_3", "item_4"]
      }
    ],
    "availableItems": [
      { "id": "item_1", "text": "Apple", "media": null },
      { "id": "item_2", "text": "Banana", "media": null },
      { "id": "item_3", "text": "Carrot", "media": null },
      { "id": "item_4", "text": "Broccoli", "media": null }
    ],
    "evaluationType": "exact"
  },
  "userAnswer": {
    "categories": [
      {
        "id": "cat_1",
        "items": ["item_1", "item_2"]
      },
      {
        "id": "cat_2",
        "items": ["item_3", "item_4"]
      }
    ]
  }
}
```

### 8. CODING (Code Submission)
```json
{
  "quizType": "CODING",
  "question": {
    "text": "Write a function to add two numbers"
  },
  "answer": {
    "language": "javascript",
    "template": "function add(a, b) {\n  // Write your code here\n}",
    "testCases": [
      {
        "input": { "a": 2, "b": 3 },
        "expectedOutput": 5,
        "points": 5
      },
      {
        "input": { "a": 10, "b": 20 },
        "expectedOutput": 30,
        "points": 5
      }
    ],
    "evaluationType": "test_cases"
  },
  "userAnswer": {
    "code": "function add(a, b) { return a + b; }",
    "language": "javascript"
  }
}
```

### 9. IMAGE_BASED (Image Selection/Marking)
```json
{
  "quizType": "IMAGE_BASED",
  "question": {
    "text": "Click on the cat in the image",
    "media": [
      {
        "type": "image",
        "url": "https://example.com/animals.jpg"
      }
    ]
  },
  "answer": {
    "type": "region",
    "region": {
      "shape": "rectangle|circle|polygon",
      "coordinates": {
        "x": 100,
        "y": 150,
        "width": 200,
        "height": 180
      },
      "tolerance": 10
    },
    "evaluationType": "coordinate_match"
  },
  "userAnswer": {
    "region": {
      "x": 105,
      "y": 155,
      "width": 195,
      "height": 175
    }
  }
}
```

### 10. PUZZLE (Image Puzzle/Reordering)
```json
{
  "quizType": "PUZZLE",
  "question": {
    "text": "Arrange the story parts in correct order"
  },
  "answer": {
    "pieces": [
      { "id": "p_1", "text": "Once upon a time...", "media": null },
      { "id": "p_2", "text": "There was a kingdom...", "media": null },
      { "id": "p_3", "text": "They lived happily ever after", "media": null }
    ],
    "correctSequence": ["p_1", "p_2", "p_3"],
    "evaluationType": "sequence"
  },
  "userAnswer": {
    "sequence": ["p_1", "p_2", "p_3"]
  }
}
```

### 11. AUDIO_BASED (Audio Listening)
```json
{
  "quizType": "AUDIO_BASED",
  "question": {
    "text": "Listen to the audio and answer the question",
    "media": [
      {
        "type": "audio",
        "url": "https://example.com/audio.mp3",
        "duration": 180
      }
    ]
  },
  "answer": {
    "correctOption": "B",
    "options": [
      { "key": "A", "text": "Option 1" },
      { "key": "B", "text": "Option 2" },
      { "key": "C", "text": "Option 3" }
    ],
    "evaluationType": "exact"
  },
  "userAnswer": {
    "selectedOption": "B"
  }
}
```

---

## Quiz Type Registry

| Type | Input | Complexity | Use Case |
|------|-------|-----------|----------|
| MCQ | Single choice | Simple | General knowledge, exams |
| MULTI_SELECT | Multiple choices | Medium | Assessments, multi-answer |
| TRUE_FALSE | Boolean | Simple | Quick tests |
| FILL_BLANK | Text input | Medium | Language, math, spelling |
| MATCHING | Pair mapping | Medium | Vocabulary, definitions |
| ORDERING | Sequence | Medium | Story arrangement, process |
| DRAG_DROP | Categorization | Complex | Classification, grouping |
| CODING | Code submission | Complex | Programming courses |
| IMAGE_BASED | Coordinate selection | Complex | Visual identification |
| PUZZLE | Piece arrangement | Complex | Games, comprehension |
| AUDIO_BASED | Audio + choice | Medium | Language learning |

---

## Evaluation Rules

### Evaluation Types
1. **exact** - Exact match required
2. **fuzzy** - Fuzzy string matching with threshold
3. **partial** - Partial credit for correct selections
4. **sequence** - Sequence/order matching
5. **test_cases** - Code execution against test cases
6. **coordinate_match** - Spatial coordinate matching

### Scoring
```json
{
  "totalPoints": 10,
  "evaluationType": "partial",
  "scoringRules": {
    "eachCorrect": 2,
    "eachWrong": 0,
    "partialCredit": true,
    "minCorrectForCredit": 1
  }
}
```

---

## Admin Creation Flow

### Step 1: Quiz Metadata
```json
{
  "title": "Quiz Title",
  "category": "Category",
  "level": "Beginner",
  "quizType": "MCQ"
}
```

### Step 2: Question Details
- Enter question text/media
- Select content type
- Add media files

### Step 3: Answer Definition
- Changes based on quizType
- MCQ: Define options and correct answer
- FILL_BLANK: Enter acceptable answers
- CODING: Provide template and test cases
- etc.

### Step 4: Publishing
- Set rules (shuffle, attempts)
- Set time limit
- Review and publish

---

## Database Collections

```
/quizzes
  /metadata (quiz info)
  /questions (question details)
  /userAttempts (user responses)
  /scores (performance data)
```

---

## Extensibility

To add a new quiz type:

1. Add to `QUIZ_TYPES` registry
2. Define answer structure in schema
3. Create renderer component
4. Create evaluator function
5. Register in plugin system

No modifications needed to core engine.

