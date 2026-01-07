---
sidebar_position: 6
title: Quiz Structure
---

# Quiz Structure

This page documents the technical structure and data model of quizzes in AmAha.

## Quiz Document Model

Quizzes are stored as JSON documents with the following structure:

```json
{
  "id": "audio-based-quiz-001",
  "title": "Audio-Based Quiz",
  "description": "Listen and answer audio questions",
  "category": "audio",
  "type": "AUDIO_BASED",
  "difficulty": "Medium",
  "audience": "all",
  "totalQuestions": 17,
  "avgTime": "12-18 min",
  "rating": 4.2,
  "plays": 145,
  "levelVariants": {
    "Easy": {
      "questionCount": 5,
      "questions": [...]
    },
    "Medium": {
      "questionCount": 3,
      "questions": [...]
    },
    "Hard": {
      "questionCount": 4,
      "questions": [...]
    },
    "Expert": {
      "questionCount": 5,
      "questions": [...]
    }
  }
}
```

## Top-Level Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | String | Yes | Unique identifier (lowercase-kebab-case) |
| `title` | String | Yes | Display name of quiz |
| `description` | String | Yes | Brief explanation of quiz |
| `category` | String | Yes | Quiz category (e.g., "audio", "science") |
| `type` | String | Yes | Quiz type (MCQ, PUZZLE, AUDIO_BASED, etc.) |
| `difficulty` | String | Yes | Primary difficulty (Easy/Medium/Hard/Expert) |
| `audience` | String | No | Target audience (e.g., "all", "kids", "students") |
| `totalQuestions` | Number | Yes | Total questions across all variants |
| `avgTime` | String | Yes | Estimated completion time |
| `rating` | Number | No | User rating (0-5 scale) |
| `plays` | Number | No | Total times played |
| `levelVariants` | Object | Yes | Variants for each difficulty |

## Level Variants

Each quiz has `levelVariants` object with up to 4 properties:

```json
"levelVariants": {
  "Easy": { ... },
  "Medium": { ... },
  "Hard": { ... },
  "Expert": { ... }
}
```

### Variant Structure

```json
"Easy": {
  "questionCount": 5,
  "questions": [
    {
      "text": "...",
      "options": [...],
      "correctAnswer": 0,
      ...
    },
    ...
  ]
}
```

| Property | Type | Description |
|----------|------|-------------|
| `questionCount` | Number | Number of questions in variant |
| `questions` | Array | Array of question objects |

## Question Structure

Standard question object used across variants:

```json
{
  "text": "What is the capital of France?",
  "options": [
    "London",
    "Paris",
    "Berlin",
    "Madrid"
  ],
  "correctAnswer": 1,
  "explanation": "Paris is the capital and largest city of France.",
  "hint": "Think of the city with the Eiffel Tower.",
  "image": "https://example.com/eiffel-tower.jpg",
  "audio": "https://example.com/paris-pronunciation.mp3"
}
```

### Question Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `text` | String | Yes | Question content |
| `options` | Array | Conditional | For MCQ/MULTI_SELECT questions |
| `correctAnswer` | Number/String/Array | Yes | Index or value(s) of correct answer |
| `explanation` | String | Yes | Why answer is correct |
| `hint` | String | No | Optional hint for user |
| `image` | URL | No | Optional image for question |
| `audio` | URL | No | Optional audio for question |
| `video` | URL | No | Optional video for question |

## Question Variations by Type

### MCQ Question
```json
{
  "text": "What is 2+2?",
  "options": ["3", "4", "5", "6"],
  "correctAnswer": 1,  // Index 1 = "4"
  "explanation": "2+2 equals 4"
}
```

### True/False Question
```json
{
  "text": "The Earth orbits the Sun.",
  "options": ["True", "False"],
  "correctAnswer": 0,  // Index 0 = "True"
  "explanation": "Earth is the third planet from the Sun"
}
```

### Fill Blank Question
```json
{
  "text": "The largest ocean is the ___________",
  "correctAnswers": ["Pacific Ocean", "Pacific", "Pacific ocean"],
  "explanation": "The Pacific Ocean is the largest ocean on Earth"
}
```

### Image-Based Question
```json
{
  "text": "What is this building?",
  "image": "https://example.com/eiffel-tower.jpg",
  "options": ["Eiffel Tower", "Big Ben", "Colosseum"],
  "correctAnswer": 0,
  "explanation": "This is the Eiffel Tower, located in Paris, France"
}
```

### Audio-Based Question
```json
{
  "text": "Which language is this?",
  "audio": "https://example.com/bonjour.mp3",
  "options": ["Spanish", "French", "German"],
  "correctAnswer": 1,
  "explanation": "'Bonjour' is a French greeting meaning 'hello'"
}
```

### Matching Question
```json
{
  "text": "Match countries to their capitals",
  "pairs": [
    { "item": "France", "match": "Paris" },
    { "item": "Germany", "match": "Berlin" },
    { "item": "Italy", "match": "Rome" }
  ],
  "correctPairs": [[0,0], [1,1], [2,2]],  // Index mapping
  "explanation": "These are the capital cities of each country"
}
```

### Ordering Question
```json
{
  "text": "Arrange these steps in order",
  "items": ["Heat oven", "Add eggs", "Mix flour", "Bake"],
  "correctOrder": [2, 1, 0, 3],  // Indices in correct sequence
  "explanation": "First mix flour, then add eggs, heat oven, then bake"
}
```

### Puzzle Question
```json
{
  "text": "Complete the jigsaw puzzle",
  "image": "https://example.com/puzzle-complete.jpg",
  "pieceCount": 12,
  "correctAnswer": "solved",  // Solution validated by position
  "explanation": "All pieces are now correctly positioned"
}
```

### Drag & Drop Question
```json
{
  "text": "Categorize these animals",
  "items": ["Lion", "Apple", "Cow"],
  "zones": ["Animals", "Foods"],
  "correctPlacements": [0, 1, 0],  // Item -> Zone mapping
  "explanation": "Lion and Cow are animals, Apple is food"
}
```

---

## File Format

Quizzes are stored in:

**Database:** Firebase Firestore  
**Collection:** `quizzes`  
**Document:** One per quiz (ID-based)

```
FirestoreDB
└── quizzes (collection)
    ├── audio-based-quiz-001 (document)
    ├── crossword-quiz-001 (document)
    ├── mcq-quiz-001 (document)
    └── ... (more quizzes)
```

## Questions Collection

Some questions are also stored separately:

**Collection:** `questions`  
**Purpose:** Shared question bank for search/indexing

```
FirestoreDB
└── questions (collection)
    ├── q-audio-001 (question document)
    ├── q-cross-001 (question document)
    └── ... (more questions)
```

---

## Size & Scale

### Typical Quiz
- **Quiz document:** ~5-15 KB
- **Questions:** 12-20 total (across 4 variants)
- **Variants:** 4 (Easy, Medium, Hard, Expert)
- **Average variant size:** 3-5 questions

### Large Quiz
- **Questions:** 20+ total
- **File size:** 15-30 KB
- **Storage impact:** Minimal (per-document pricing)

---

## Backward Compatibility

### Original Questions Field

Older quizzes may have a flat `questions` array:

```json
{
  "id": "legacy-quiz-001",
  "title": "Old Quiz Format",
  "questions": [...]  // Flat array (deprecated)
}
```

**Handling:**
- System still loads flat questions
- Defaults all to "Easy" variant
- Migrated to `levelVariants` format

---

## Validation Rules

When creating/updating quizzes:

1. **ID must be unique** - Cannot duplicate
2. **Title is required** - Non-empty string
3. **Type must be valid** - One of 11 supported types
4. **Each variant needs questions** - Non-empty array
5. **Question counts must match** - `questionCount` = questions.length
6. **Correct answers must be valid** - Index/value must exist
7. **No undefined values** - All fields must have values

---

**Next:** Start with [Puzzles](../puzzles/overview) or [Architecture](../architecture/overview)
