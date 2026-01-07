---
sidebar_position: 5
title: Scoring & Validation
---

# Scoring & Validation

This section explains how AmAha validates answers and calculates scores.

## Answer Validation

### Single-Answer Questions

**True/False, MCQ, Image-Based, Audio-Based**

```
User selects: Option B
Correct answer: Option B (index 1)
Validation: Index match
Result: CORRECT ✓
```

### Multiple-Answer Questions

**Multi-Select, Matching, Ordering**

```
User selects: [A, B, C]
Correct answers: [A, B, C]
Validation: All selected must match, no more, no less
Result: CORRECT ✓
```

### Text Entry Questions

**Fill Blank, Short Answer**

```
Question: "The largest planet is _____"
User enters: "Jupiter"
Expected: "Jupiter"
Validation: String match (case-insensitive)
Result: CORRECT ✓
```

**Options for Text Validation:**
- Exact match (default)
- Case-insensitive (recommended)
- Fuzzy matching (≥90% similar)
- Multiple acceptable answers
- Regex pattern matching

### Drag/Drop Questions

**Puzzle, Drag-Drop**

```
User places piece at: (x: 100, y: 150)
Correct position: (x: 95-105, y: 145-155) [with tolerance]
Validation: Position within acceptable range
Result: CORRECT ✓
```

---

## Scoring System

### Point System

**Simple Model:**
- 1 point per correct answer
- 0 points for incorrect answer
- Final score = total correct / total questions

**Example:**

```
Quiz: 5 Questions
User answers:
  Q1: Correct ✓ (1 point)
  Q2: Correct ✓ (1 point)
  Q3: Incorrect ✗ (0 points)
  Q4: Correct ✓ (1 point)
  Q5: Correct ✓ (1 point)

Final Score: 4/5 (80%)
```

### Score Types

**Variant Scoring:**
- Each variant scored separately
- Easy variant: 5 question = max score 5
- Medium variant: 3 questions = max score 3
- Hard variant: 4 questions = max score 4
- Expert variant: 5 questions = max score 5

**Leaderboard Ranking:**
- Primary: Score (higher is better)
- Secondary: Time (lower is better for same score)
- Users can appear on multiple leaderboards (one per variant)

---

## Scoring Mechanics

### Instant Feedback

```
User answers Q1
System validates: CORRECT
Display: ✓ Correct! (immediately)
User sees explanation
User continues to Q2
```

### Real-Time Score

Users always see current progress:

```
Question 1 of 5
Score so far: 1/1 ✓
Time: 0:45
[Question content]
```

### Final Score Display

After completing all questions:

```
QUIZ COMPLETE!
Final Score: 4/5 (80%)
Time: 4:23
Leaderboard Rank: #8
Best Score: 4/5 (previous)
```

---

## Leaderboard Scoring

### Ranking Algorithm

1. **Sort by Score** (descending)
   - Higher score = better rank
2. **Sort by Time** (ascending)
   - For same score, faster time = better rank

**Example:**

```
Ranking (Easy Variant):
1. User A: 5/5 in 2:15
2. User B: 5/5 in 2:45
3. User C: 4/5 in 1:50
4. User D: 4/5 in 2:10
```

### Per-Variant Leaderboards

Each difficulty has independent ranking:

```
MCQ Quiz - Easy Leaderboard        MCQ Quiz - Medium Leaderboard
1. User A: 5/5 (2:15)               1. User C: 3/3 (1:10)
2. User B: 5/5 (2:45)               2. User A: 3/3 (1:30)
3. User C: 4/5 (1:50)               3. User B: 2/3 (2:00)
```

---

## Hint and Explanation System

### Hints

**Purpose:** Help stuck users without giving answer

**When Available:**
- During quiz solving
- Per question
- Can be disabled in contest mode

**How They Work:**
```
User clicks "Hint" on Q2
System shows: "Think about the largest planet in our solar system"
User continues solving
No penalty for using hint
Score still counts as correct if right answer given
```

**Hint Storage:**
- Optional field per question
- Can be empty if no hint available
- Different hints per difficulty possible

### Explanations

**Purpose:** Teach why answer is correct

**When Shown:**
- After user answers
- Always available
- Key learning component

**How They Work:**
```
User answers Q2
System displays:
  "Your answer: B (Jupiter) - CORRECT ✓"
  "Explanation: Jupiter is the largest planet in our 
   solar system, with a diameter 11 times Earth's."
```

**Explanation Structure:**
- Clear statement of correct answer
- Why it's correct
- Educational context
- Optional: Links to learn more

---

## Special Scoring Cases

### Partial Credit (Future)

**Currently:** All or nothing

**Future Possibility:**
- Matching: Points per correct pair
- Multi-select: Points per correct selection
- Ordering: Points per correctly placed item

### Time Bonuses (Future)

**Currently:** Time is tiebreaker

**Future Possibility:**
- Bonus points for fast completion
- Time multiplier for harder difficulties

### Difficulty Weighting (Future)

**Currently:** Same point value per question

**Future Possibility:**
- Hard/Expert questions worth more points
- Scaling: Easy=1pt, Hard=3pts
- Prevents score inflation

---

## Validation Rules

### Rules That Apply to All Questions

1. **Case-Insensitive Text** - "Paris" = "paris" = "PARIS"
2. **Single Submit** - Answer submitted once
3. **No Changing** - Can't change answer after submit
4. **Exact Match Priority** - Exact match checked before fuzzy
5. **Immediate Feedback** - Validation happens instantly

### Contest Mode Validation

**Additional Rules:**
- No hints available
- No redo/restart
- Server-side validation (not client-side)
- Timing locked to server time
- Submit button required

---

## Scoring Examples

### Example 1: Simple MCQ

```
Question: "What is 2+2?"
Options: A)3, B)4, C)5, D)6
User selects: B (4)
Validation: Index match
Result: CORRECT (1 point)
```

### Example 2: Multi-Select

```
Question: "Select all prime numbers"
Options: A)2, B)3, C)4, D)5
Correct: [A, B, D]
User selects: [A, B, D]
Validation: Set match
Result: CORRECT (1 point)
```

### Example 3: Text Entry

```
Question: "Name the largest ocean"
Expected: ["Pacific Ocean", "Pacific", "Pacific ocean"]
User enters: "pacific ocean"
Validation: Case-insensitive, accepted variation
Result: CORRECT (1 point)
```

### Example 4: Matching

```
Question: Match countries to capitals
Pairs: France-Paris, Germany-Berlin, Italy-Rome
User matches: F-P, G-B, I-R
Validation: All pairs correct
Result: CORRECT (1 point)
```

---

## Future Enhancements

- [ ] Partial credit for complex questions
- [ ] Adaptive difficulty based on performance
- [ ] Time-based bonuses
- [ ] Achievement badges
- [ ] Skill mastery tracking
- [ ] Confidence-based scoring

---

**Next:** Learn about [Quiz Structure](./quiz-structure)
