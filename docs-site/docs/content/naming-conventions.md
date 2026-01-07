---
sidebar_position: 3
title: Naming Conventions
---

# Naming Conventions

This page documents the naming standards used across AmAha content for consistency and clarity.

## ID Naming Conventions

### Quiz IDs

**Format:** `{type}-{category}-{number}`

**Examples:**
```
mcq-biology-001         (Multiple choice biology quiz #1)
true-false-history-005  (True/false history quiz #5)
fill-blank-english-003  (Fill-in-blank English quiz #3)
matching-geography-002  (Matching geography quiz #2)
puzzle-science-007      (Puzzle quiz science #7)
```

**Rules:**
- Use lowercase only
- Separate words with hyphens (kebab-case)
- Include quiz type (if specific)
- Zero-pad numbers (001, 002, etc.)
- No spaces or special characters

### Puzzle IDs

**Format:** `{puzzle-type}-{category}-{number}`

**Examples:**
```
sudoku-easy-045         (Sudoku puzzle, easy variant, #45)
jigsaw-animal-123       (Jigsaw puzzle, animal category, #123)
crossword-vocab-067     (Crossword puzzle, vocabulary, #67)
nonogram-nature-034     (Nonogram puzzle, nature, #34)
tangram-shapes-089      (Tangram puzzle, shapes, #89)
```

**Rules:**
- Use lowercase
- Kebab-case for multi-word names
- Include difficulty level (if variant-specific)
- Zero-pad numbers
- Match puzzle type naming exactly

### Activity IDs

**Format:** `activity-{type}-{subject}-{number}`

**Examples:**
```
activity-ordering-math-001        (Math ordering activity #1)
activity-matching-vocab-045       (Vocabulary matching activity #45)
activity-freeplay-writing-012     (Writing free-play activity #12)
activity-daily-challenge-2024-001 (Daily challenge, 2024, #1)
```

**Rules:**
- Include "activity" prefix
- Specify activity type
- Include subject/category
- Sequential numbering

---

## Title Naming Conventions

### Quiz Titles

**Format:** `{Subject} {Type}: {Topic}` or `{Topic} Quiz - {Level}`

**Examples:**
```
Biology MCQ: Photosynthesis
History True/False: American Revolution
English Fill-in-Blank: Shakespeare's Sonnets
Mathematics Matching: Geometric Shapes
Physics Quiz - Mechanics (Medium)
```

**Rules:**
- Title case for main words
- Include type (unless context clear)
- Be specific about topic
- Add level if part of a series
- Avoid redundancy (don't say "Quiz" twice)

### Puzzle Titles

**Format:** `{Puzzle Type}: {Theme}` or `{Theme} {Difficulty} Puzzle`

**Examples:**
```
Sudoku: Number Logic
Jigsaw: Garden Scene
Crossword: Shakespeare's Works
Nonogram: Cat Portrait (Medium)
Tangram: Geometric Shapes (Expert)
```

**Rules:**
- Lead with puzzle type
- Include theme/subject
- Add difficulty if variant-specific
- Capitalize properly
- Keep reasonable length (under 50 chars)

### Activity Titles

**Format:** `{Type}: {Subject/Theme}` or `Daily {Type} Challenge`

**Examples:**
```
Ordering: Number Sequences
Matching: Capital Cities
Story Writing: Adventure Tales
Daily Matching Challenge
Weekly Sudoku Challenge
```

**Rules:**
- Include activity type
- Specify subject or theme
- For daily activities, include "Daily"
- Avoid special characters
- Clear and descriptive

---

## Collection Naming

### Static Collection Titles

**Format:** `{Subject} {Level/Type}` or `{Theme} Collection`

**Examples:**
```
Biology Fundamentals
Advanced Physics
High School History Essentials
Vocabulary Building Series
Daily Challenge Collection
Brain Training Bundle
```

**Rules:**
- Clear and descriptive
- Include difficulty level if relevant
- Use proper title case
- Avoid abbreviations
- 3-5 words typical length

### Collection IDs

**Format:** `collection-{slug}-{number}`

**Examples:**
```
collection-biology-fundamentals-001
collection-vocab-building-series-001
collection-daily-challenges-2024-001
collection-brain-training-bundle-001
```

**Rules:**
- "collection" prefix
- Use slug from title
- Lowercase, kebab-case
- Sequential numbering

---

## Subject Naming

### Standard Subjects

```
Biology
Chemistry
Physics
Mathematics
English Language Arts
History
Geography
Civics
Economics
Computer Science
Visual Arts
Music
Health & Wellness
Life Skills
Physical Education
```

**Rules:**
- Use full official names
- Maintain consistent capitalization
- Don't abbreviate in titles
- Use standard abbreviations in IDs only

---

## Category Naming

### Quiz Categories

```
Cellular Biology
Genetics
Ecology
American History
European History
Grammar
Vocabulary
Algebra
Geometry
Earth Science
```

**Rules:**
- Specific, not generic
- Title case
- Meaningful and clear
- Avoid one-word categories where possible

### Puzzle Categories

```
Grid-Based
Tile-Based
Word Puzzles
Pattern Puzzles
Interactive Puzzles
```

**Rules:**
- Consistent with puzzle type names
- Use exact category names from documentation
- Hyphenate compound words

### Activity Categories

```
Ordering Activities
Matching Activities
Free-Play Challenges
Memory & Reflex
```

**Rules:**
- Match documented activity type names
- Clear and descriptive

---

## Difficulty Level Naming

**Standard Levels:**
```
Easy
Medium
Hard
Expert
```

**Rules:**
- Always capitalize
- Use these exact names only
- No abbreviations in titles
- Use lowercase in IDs (easy, medium, etc.)

---

## Tag Naming Conventions

### Subject Tags

```
biology, chemistry, physics, mathematics,
english, history, geography, civics,
economics, computer-science, arts, music,
health-wellness, life-skills, pe
```

**Rules:**
- Lowercase only
- Hyphenate compound words
- No spaces
- Match standard subject names

### Skill Tags

```
logic, memory, pattern-recognition, vocabulary,
spelling, grammar, calculation, reasoning,
problem-solving, creativity, speed, accuracy,
spatial-awareness, analysis, synthesis
```

**Rules:**
- Lowercase
- Hyphenate for multi-word concepts
- Specific and measurable
- Avoid vague terms

### Duration Tags

```
2-5min, 5-10min, 10-15min, 15-20min, 20+min
```

**Rules:**
- Use standard format: "X-Xmin"
- Include "+" for open-ended
- Consistent across system

---

## Metadata Field Naming

### Standard Fields

```
title               (Display name)
description         (Brief explanation)
subject             (Primary subject)
grade_level         (Target grade)
difficulty          (Easy/Medium/Hard/Expert)
content_type        (Quiz/Puzzle/Activity)
duration            (Estimated time)
rating              (User rating)
play_count          (Times completed)
author              (Creator)
created_date        (Creation timestamp)
modified_date       (Last update timestamp)
tags                (Categorization array)
```

**Rules:**
- Use snake_case for field names
- Match exact field names in database
- No spaces in field names
- Consistent data types

---

## URL Slug Naming

### Content URLs

**Format:** `/content-type/category/slug`

**Examples:**
```
/quiz/biology/photosynthesis-quiz-001
/puzzle/sudoku/expert-puzzle-045
/activity/ordering/number-sequences
```

**Rules:**
- Lowercase only
- Hyphens separate words
- No special characters
- Match content IDs where possible
- Readable and SEO-friendly

---

## File/Document Naming

### Quiz Files (if exported)

```
quiz_[quiz-id]_[grade]_[subject].json
quiz_mcq-biology-001_6-8_biology.json
quiz_true-false-history-005_9-12_history.json
```

### Puzzle Files

```
puzzle_[puzzle-id]_[difficulty].json
puzzle_sudoku-045_expert.json
puzzle_jigsaw-animal-123_easy.json
```

### Export Files

```
export_quizzes_[date].json      (2024-01-15)
export_all-content_[date].csv   (2024-01-15)
backup_content_[timestamp].zip  (2024-01-15-143022)
```

**Rules:**
- Use underscores, not hyphens
- Include meaningful descriptors
- Add timestamp for backups
- Keep filenames under 50 chars

---

## Naming by User Type

### For Learners
Content appears as:
```
"Photosynthesis Quiz" (not: "mcq-biology-001")
"Sudoku Expert Puzzle" (not: "sudoku-045")
"Number Ordering Challenge" (not: "activity-ordering-math-001")
```

### For Educators
Content appears as:
```
ID: quiz-mcq-biology-001
Title: Biology MCQ: Photosynthesis
Grade: 6-8
Subject: Biology
Difficulty: Medium
```

### For Admins
Full metadata visible:
```
ID: quiz-mcq-biology-001
Title: Biology MCQ: Photosynthesis
Created: 2024-01-01
Modified: 2024-01-15
Rating: 4.5
PlayCount: 234
Tags: [biology, photosynthesis, grade-6-8, medium]
```

---

## Special Naming Cases

### Daily Challenges

**Naming:**
```
Daily Quiz Challenge - [Date]     (2024-01-15)
Daily Puzzle - [Type] [Date]      (2024-01-15)
Today's Skill Builder             (Date implied)
```

### Limited-Time Events

**Naming:**
```
New Year Challenge 2024
Winter Wellness Week
Holiday Brain Teaser Challenge
Spring Learning Sprint
```

**Rules:**
- Include timeframe if relevant
- Use event-appropriate language
- Archive with date after event

### Featured/Trending

**Naming:**
```
⭐ Featured: Biology Fundamentals
🔥 Trending: Sudoku Puzzles
🎯 Popular: Vocabulary Matching
```

**Rules:**
- Use emoji in UI only
- Don't put emoji in database
- Clear labeling in interface

---

## Best Practices Summary

✓ **DO:**
- Use consistent naming across system
- Keep IDs lowercase, kebab-case
- Use descriptive titles
- Match exact category names
- Use proper title case for displays
- Standardize difficulty levels
- Tag comprehensively

✗ **DON'T:**
- Mix naming conventions
- Use abbreviations in titles
- Create ambiguous category names
- Use inconsistent capitalization
- Abbreviate difficulty (no "adv" for "advanced")
- Use special characters in IDs
- Create IDs that are overly long

---

**Next:** Back to [Content Overview](hierarchy) or [UX Principles](../ux/design-principles)
