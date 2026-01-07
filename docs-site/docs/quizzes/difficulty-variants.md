---
sidebar_position: 3
title: Difficulty Variants
---

# Difficulty Variants

Every quiz in AmAha has 4 difficulty variants, allowing users to choose their challenge level.

## The Four Levels

### Easy

**Target Audience:** Beginners, younger users, new learners

**Characteristics:**
- Foundational concepts
- Clear, unambiguous answers
- Simple instructions
- Shorter content (typically 5 questions)
- Generous hints available

**Question Examples:**
- Basic definitions
- Simple facts
- Obvious answers
- Direct questions

**When to Use:**
- Introducing a topic
- Building confidence
- Teaching fundamentals
- For younger learners

---

### Medium

**Target Audience:** Students, regular learners

**Characteristics:**
- Standard difficulty
- Requires understanding
- Moderate complexity
- Typically 3 questions
- Some interpretation needed

**Question Examples:**
- Apply concepts
- Compare/contrast basics
- Moderate scenarios
- Some critical thinking

**When to Use:**
- Main learning path
- Balanced assessment
- General audience
- Most common difficulty

---

### Hard

**Target Audience:** Advanced learners, students studying deeply

**Characteristics:**
- Advanced concepts
- Requires synthesis
- Complex scenarios
- Typically 4 questions
- Multiple concepts combined

**Question Examples:**
- Apply knowledge to new situations
- Analyze information
- Problem-solving
- Advanced reasoning

**When to Use:**
- For advanced students
- Mastery assessment
- Competition
- In-depth learning

---

### Expert

**Target Audience:** Experts, highly motivated learners, competitive users

**Characteristics:**
- Expert-level difficulty
- Requires mastery
- Complex scenarios
- Typically 5 questions
- Edge cases and nuances

**Question Examples:**
- Expert scenarios
- Nuanced decisions
- Combined concepts
- Advanced problem-solving

**When to Use:**
- Competitive leaderboards
- Expert certification
- Mastery validation
- Challenge seekers

---

## Variant Structure

```
Quiz (Parent)
├── Easy Variant
│   ├── 5 Questions
│   ├── Own Leaderboard
│   └── Independent Scoring
├── Medium Variant
│   ├── 3 Questions
│   ├── Own Leaderboard
│   └── Independent Scoring
├── Hard Variant
│   ├── 4 Questions
│   ├── Own Leaderboard
│   └── Independent Scoring
└── Expert Variant
    ├── 5 Questions
    ├── Own Leaderboard
    └── Independent Scoring
```

## User Experience with Variants

### Discovery

Users see all variants available on the quiz card:

```
🎵 Audio-Based Quiz
Listen and answer audio questions

[Expert] [Easy] [Medium] [Hard]

Variants: 4
Questions: 17 (total across all)
Avg Time: 12-18 min
```

### Selection

Users click a difficulty badge to start immediately:

```
Click [Easy] → Start Easy variant instantly
Click [Medium] → Start Medium variant instantly
Click [Hard] → Start Hard variant instantly
Click [Expert] → Start Expert variant instantly
```

### Progression

Users can:

1. Try Easy first to learn concepts
2. Move to Medium for standard difficulty
3. Attempt Hard for advanced challenge
4. Push for Expert level to compete

### Independent Tracking

Each variant is tracked separately:

- Own leaderboard
- Own completion count
- Own best score
- Own play history

## Switching Variants

During a quiz, users can:

1. **Change Difficulty** - Access variant selector
2. **Restart** - Begin new difficulty variant
3. **Compare** - See leaderboards for all variants
4. **Progress** - Try harder variant after mastering easier one

## Scoring Per Variant

Each variant scores independently:

| Variant | Max Score | Completion | Tracked |
|---------|-----------|-----------|---------|
| Easy | 5 | Tracked | Yes |
| Medium | 3 | Tracked | Yes |
| Hard | 4 | Tracked | Yes |
| Expert | 5 | Tracked | Yes |

Users can earn top scores on multiple variants of same quiz.

## Design Principle: No Penalty for Starting Easy

- Starting with Easy doesn't diminish value
- All variants are valid achievements
- Progression is personal, not mandatory
- Users can return to Easy anytime

## Examples in Practice

### Example 1: Biology Quiz

```
Easy: 5 basic biology questions
  Q1: Name the powerhouse of the cell
  Q2-5: Basic organelle functions

Medium: 3 moderate questions
  Q1: How would cell function change if...
  Q2-3: Complex scenarios

Hard: 4 advanced questions
  Q1: Predict outcome of genetic mutation
  Q2-4: Multi-concept integration

Expert: 5 expert questions
  Q1-5: Research-level scenarios, edge cases
```

### Example 2: Math Quiz

```
Easy: 5 basic arithmetic
  5+3=?, 12/4=?, etc.

Medium: 3 algebra questions
  Solve for x, systems of equations

Hard: 4 calculus/advanced algebra
  Derivatives, complex proofs

Expert: 5 expert-level questions
  Advanced problem-solving, optimization
```

## Leaderboard Separation

Each variant has separate leaderboards:

```
Audio-Based Quiz - Easy Leaderboard
1. User A - 5/5 - 2:15
2. User B - 5/5 - 2:47
3. User C - 4/5 - 1:55

Audio-Based Quiz - Medium Leaderboard
1. User A - 3/3 - 1:30
2. User D - 3/3 - 1:45
3. User B - 2/3 - 2:10
```

---

**Next:** Learn about [Question Types](./question-types)
