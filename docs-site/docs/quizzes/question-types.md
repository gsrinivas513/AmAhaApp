---
sidebar_position: 4
title: Question Types
---

# Question Types

Questions are the building blocks of quizzes. Each question type has distinct characteristics and interaction models.

## Overview

A question consists of:

1. **Content** - The question text or prompt
2. **Media** - Optional images, audio, video
3. **Answer Format** - How user responds (multiple choice, text entry, drag, etc.)
4. **Validation** - How correctness is determined
5. **Feedback** - Explanations and hints

## Question Type Categories

### Selection-Based Questions

Users select from given options.

**Types:**
- Multiple Choice (MCQ)
- True/False
- Multiple Select (select all that apply)

**Features:**
- Quick to answer
- Clear right/wrong
- Can include images/multimedia
- Suitable for all ages

---

### Input-Based Questions

Users type or enter their own answer.

**Types:**
- Fill in the Blank
- Short Answer
- Text Entry

**Features:**
- Open-ended response
- Requires exact match (or fuzzy matching)
- Can accept multiple valid answers
- Good for vocabulary/spellingValidation:**
- Case-insensitive (usually)
- Exact match required
- Can accept variants (plurals, tenses, etc.)

---

### Matching Questions

Users connect related items.

**Type:** Matching Pairs

**Features:**
- Connect definitions to terms
- Match synonyms
- Match relationships
- Visual connection lines

**Validation:**
- All pairs must be correct
- Order independent
- Drag-based interface

---

### Ordering Questions

Users arrange items in sequence.

**Type:** Sequence/Order

**Features:**
- Arrange steps in process
- Timeline ordering
- Hierarchical ordering
- Drag to reorder

**Validation:**
- Specific sequence required
- All items must be in correct position
- No partial credit

---

### Interaction-Based Questions

Users interact with visual elements.

**Types:**
- Drag & Drop
- Puzzle
- Canvas Interaction

**Features:**
- Spatial reasoning
- Visual problem-solving
- Multi-step interactions
- Immediate visual feedback

**Validation:**
- Position-based correctness
- Constraint checking
- Multiple solution paths possible

---

### Media-Based Questions

Questions centered on multimedia content.

**Types:**
- Image-Based (identify image)
- Audio-Based (listen and answer)
- Video-Based (respond to video)

**Features:**
- Multimedia as question
- Enhanced engagement
- Accessibility considerations
- Can combine with selection/input

**Validation:**
- Same as underlying question type
- Multimedia is context, not answer

---

### Advanced Questions

Complex or specialized questions.

**Types:**
- Coding (code reading/prediction)
- Scenario-Based (complex situations)
- Cloze (fill multiple blanks)

**Features:**
- Multiple concepts
- Higher cognitive load
- Usually in Hard/Expert variants

---

## Question Structure in Code

```json
{
  "id": "q1",
  "type": "MCQ",
  "text": "What is the capital of France?",
  "options": [
    "London",
    "Paris",
    "Berlin",
    "Madrid"
  ],
  "correctAnswer": 1,
  "explanation": "Paris is the capital and largest city of France.",
  "hint": "Think of the city with the Eiffel Tower."
}
```

## Question Properties

| Property | Type | Purpose |
|----------|------|---------|
| **id** | String | Unique identifier |
| **type** | String | Question type (MCQ, TRUE_FALSE, etc.) |
| **text** | String | Question content |
| **options** | Array | Multiple choice options |
| **correctAnswer** | Various | Expected answer(s) |
| **explanation** | String | Why answer is correct |
| **hint** | String | Help for users |
| **image** | URL | Optional question image |
| **audio** | URL | Optional audio content |
| **difficulty** | String | Easy/Medium/Hard/Expert |

## Question Attributes

### Difficulty
- Part of variant (Easy, Medium, Hard, Expert)
- Determines placement
- Controls hint availability
- Affects scoring weight (optionally)

### Media
- Images (JPG, PNG)
- Audio (MP3, WAV)
- Video (MP4, embedded)
- Optional or required

### Hints
- Optional guidance
- May be disabled in contest mode
- Can be progressive
- Customizable per difficulty

### Explanations
- Always available after answering
- Explains correct answer
- Educational component
- Can include links

---

## Answer Validation

### Exact Match
```
User answers: "Paris"
Expected: "Paris"
Result: Correct ✓
```

### Case-Insensitive
```
User answers: "paris"
Expected: "Paris"
Result: Correct ✓
```

### Multiple Valid Answers
```
User answers: "France's capital" or "Paris"
Expected: ["Paris", "France's capital"]
Result: Correct ✓
```

### Fuzzy Matching (Optional)
```
User answers: "Pariss"
Expected: "Paris"
Result: Possibly correct (with similarity threshold)
```

---

## Question-Type Mapping

| Question Type | Best Suited | Typical Difficulty | Media Support |
|---|---|---|---|
| MCQ | Factual knowledge | All | Yes (image) |
| TRUE_FALSE | Simple concepts | Easy/Medium | Yes |
| MULTI_SELECT | Complex topics | Hard/Expert | Yes |
| FILL_BLANK | Vocabulary | All | Limited |
| MATCHING | Relationships | All | Yes |
| ORDERING | Processes/sequences | Medium-Expert | Limited |
| IMAGE_BASED | Visual recognition | All | Required (image) |
| AUDIO_BASED | Listening skills | All | Required (audio) |
| PUZZLE | Spatial reasoning | All | Visual |
| DRAG_DROP | Categorization | All | Visual |
| CODING | Programming logic | Hard/Expert | Code snippet |

---

**Next:** Learn about [Scoring & Validation](./scoring-validation)
