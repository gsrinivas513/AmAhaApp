---
sidebar_position: 1
title: Content Hierarchy
---

# Content Hierarchy

This page explains how content is organized hierarchically in AmAha.

## Overview

Content in AmAha follows a clear organizational hierarchy from broad categories to specific learning items.

## Hierarchy Levels

### Level 1: Platforms/Products

**Top level organizational division**

- **AmAha Web** - Main learning platform
- **AmAha Mobile** - Mobile application
- **AmAha Admin** - Content creation tools

### Level 2: Content Types

**Major content categories**

```
AmAha
├── Quizzes
│   ├── Quiz Collections (grouped quizzes)
│   └── Individual Quizzes
├── Puzzles
│   ├── Puzzle Categories
│   └── Individual Puzzles
├── Activities
│   ├── Activity Types
│   └── Individual Activities
└── Learning Resources
    ├── Guides
    └── References
```

### Level 3: Collections/Subjects

**Grouped by subject or theme**

**Quiz Collections:**
- Biology Quizzes (collection)
  - Photosynthesis Quiz
  - Cell Structure Quiz
  - Evolution Quiz

**Puzzle Categories:**
- Grid-Based Puzzles (category)
  - Sudoku puzzles
  - Nonogram puzzles
  - Kakuro puzzles

**Activity Collections:**
- Vocabulary Building (collection)
  - Definition Matching
  - Word Ordering
  - Translation Challenge

### Level 4: Individual Items

**Specific, playable content**

- **Quiz:** "Biology Quiz #1 - Photosynthesis"
- **Puzzle:** "Sudoku Expert Puzzle #42"
- **Activity:** "Daily Vocabulary Challenge #215"

---

## Hierarchical Structure Diagram

```
Platform (AmAha)
    ↓
Content Type (Quizzes, Puzzles, Activities)
    ↓
Collection/Category (Subject, Type, Theme)
    ↓
Individual Item (Specific Quiz, Puzzle, Activity)
    ↓
Difficulty Level (Easy, Medium, Hard, Expert)
    ↓
Variant/Instance (Specific attempt)
```

---

## Subject-Based Organization

### Major Subject Areas

**STEM Subjects:**
- Biology
- Chemistry
- Physics
- Mathematics
- Computer Science

**Language Arts:**
- English Language
- Vocabulary
- Grammar
- Reading Comprehension
- Writing Skills

**Social Studies:**
- History
- Geography
- Civics
- Cultural Studies
- Economics

**Arts & Humanities:**
- Visual Arts
- Music
- Literature
- Philosophy

**Practical Skills:**
- Health & Wellness
- Life Skills
- Professional Development

### Subject-Content Mapping

**Biology Subject:**
```
Biology
├── Quizzes
│   ├── Cellular Biology
│   │   ├── Quiz: Cell Structure (Easy-Expert)
│   │   ├── Quiz: Cell Division (Easy-Expert)
│   │   └── Quiz: Genetics (Easy-Expert)
│   └── Ecology
│       ├── Quiz: Ecosystems (Easy-Expert)
│       └── Quiz: Food Chains (Easy-Expert)
├── Puzzles
│   ├── DNA Sequence Puzzles
│   └── Animal Classification Puzzles
└── Activities
    ├── Vocabulary: Biology Terms
    └── Ordering: Life Cycle Stages
```

---

## Grade Level Organization

Content organized by education level:

### Kindergarten - Grade 2
- **Topics:** Colors, shapes, basic counting
- **Content Type:** Mostly activities (interactive, visual)
- **Time:** 2-3 minutes per activity
- **Difficulty:** Only "Easy" level

### Grade 3 - Grade 5
- **Topics:** Math basics, science fundamentals
- **Content Type:** Mix of activities and quizzes
- **Time:** 5-10 minutes
- **Difficulty:** Easy, Medium

### Grade 6 - Grade 8
- **Topics:** Subject-specific (science, history, language)
- **Content Type:** All types (quizzes, puzzles, activities)
- **Time:** 10-20 minutes
- **Difficulty:** Easy, Medium, Hard

### Grade 9 - Grade 12
- **Topics:** Advanced subjects, standardized test prep
- **Content Type:** Complex quizzes, challenging puzzles
- **Time:** 15-30 minutes
- **Difficulty:** Medium, Hard, Expert

### College/Adult
- **Topics:** Professional, specialized subjects
- **Content Type:** In-depth quizzes, advanced puzzles
- **Time:** 20-45 minutes
- **Difficulty:** Hard, Expert

---

## Learning Path Organization

Content grouped into learning progressions:

### Linear Paths (Sequential Learning)

**Math Learning Path:**
```
1. Number Recognition (K)
2. Basic Addition (Grade 1)
3. Subtraction (Grade 1)
4. Multiplication (Grade 2)
5. Division (Grade 3)
6. Fractions (Grade 4)
7. Decimals (Grade 5)
8. Percentages (Grade 6)
9. Algebra (Grade 7-8)
10. Geometry (Grade 8-9)
11. Trigonometry (Grade 9-10)
12. Calculus (Grade 11-12)
```

Each level contains:
- Foundational quizzes
- Practice activities
- Challenge puzzles
- Assessment tests

### Thematic Collections (Related Topics)

**Nutrition Theme:**
```
Nutrition Collection
├── Quiz: Food Groups
├── Quiz: Balanced Diet
├── Activity: Food Sorting
├── Activity: Calorie Estimation
├── Puzzle: Food Web Diagram
└── Resource: Nutrition Guide
```

---

## Metadata-Based Organization

Content tagged with multiple attributes for flexible access:

### Subject Tags
- `subject:biology`
- `subject:english`
- `subject:mathematics`

### Difficulty Tags
- `difficulty:easy`
- `difficulty:medium`
- `difficulty:hard`
- `difficulty:expert`

### Age/Grade Tags
- `grade:3-5`
- `grade:6-8`
- `grade:9-12`
- `age:5-7`

### Content Type Tags
- `type:quiz`
- `type:puzzle`
- `type:activity`

### Time Duration Tags
- `duration:2-5min`
- `duration:5-10min`
- `duration:10-20min`
- `duration:20+min`

### Skill Tags
- `skill:memory`
- `skill:logic`
- `skill:vocabulary`
- `skill:speed`

---

## Database Structure

### Firestore Collections

```
firestore-db/
├── quizzes/
│   ├── [quiz-id]: {
│   │   subject: "biology",
│   │   gradeLevel: "6-8",
│   │   category: "cellular-biology",
│   │   tags: [...],
│   │   ...
│   }
├── puzzles/
│   ├── [puzzle-id]: {
│   │   category: "grid-based",
│   │   type: "sudoku",
│   │   gradeLevel: "all",
│   │   tags: [...],
│   │   ...
│   }
├── activities/
│   ├── [activity-id]: {
│   │   type: "matching",
│   │   subject: "vocabulary",
│   │   tags: [...],
│   │   ...
│   }
├── collections/
│   ├── [collection-id]: {
│   │   name: "Biology Essentials",
│   │   type: "subject",
│   │   items: [...],
│   │   ...
│   }
└── learningPaths/
    ├── [path-id]: {
    │   name: "Math Fundamentals",
    │   sequence: [...],
    │   ...
    }
```

---

## Navigation Flows

### Discovery Flow

**User enters → Category → Subcategory → Item**

```
Home
├── Browse Quizzes
│   ├── By Subject
│   │   └── Biology → Cellular Biology → Quiz Selection
│   ├── By Grade
│   │   └── Grade 6 → Biology → Quiz Selection
│   └── By Difficulty
│       └── Medium → Biology Quizzes → Quiz Selection
├── Browse Puzzles
│   └── (Similar flow)
└── Browse Activities
    └── (Similar flow)
```

### Search Flow

**User searches → Filter results → Find content**

```
Search Bar: "Photosynthesis"
    ↓
Results:
- Quiz: Photosynthesis Quiz (Biology, Grade 7)
- Activity: Photosynthesis Vocabulary (Biology)
- Puzzle: Plant Cell Diagram (Biology)
    ↓
Select item → Start
```

### Personalized Flow

**User profile → Recommended content**

```
User Profile
├── Grade Level: 7
├── Interests: Biology
├── Completed: 45 quizzes
├── Current Focus: Photosynthesis
    ↓
Recommendations:
1. Related Quiz: Cellular Respiration
2. Challenge Puzzle: Photosynthesis Diagram
3. Activity: Biology Vocabulary
```

---

## Information Architecture

### Homepage Structure

```
Homepage
├── Featured
│   ├── New quizzes
│   ├── Popular puzzles
│   └── Today's activity
├── By Learning Goal
│   ├── Test Knowledge (Quizzes)
│   ├── Develop Logic (Puzzles)
│   └── Build Skills (Activities)
├── By Subject
│   ├── [Subject buttons]
│   └── View all subjects
├── Personalized For You
│   ├── Continue learning
│   ├── Recommended
│   └── Daily challenge
└── Leaderboards
    ├── Global
    ├── Friends
    └── Weekly
```

### Browse Structure

```
Browse
├── All Content
│   ├── Quizzes (with filters)
│   ├── Puzzles (with filters)
│   └── Activities (with filters)
├── By Subject
│   ├── Biology
│   ├── English
│   ├── Mathematics
│   └── More...
├── By Grade
│   ├── Elementary (K-5)
│   ├── Middle (6-8)
│   ├── High (9-12)
│   └── Adult
└── By Type
    ├── Single Items
    ├── Collections
    └── Learning Paths
```

---

## Summary

Content hierarchy provides:
- **Clear organization** - Easy to find content
- **Flexible access** - Multiple ways to discover
- **Scalability** - Add content without restructuring
- **Personalization** - Adapt to user needs
- **Consistency** - Predictable structure

---

**Next:** [Content Organization](organization)
