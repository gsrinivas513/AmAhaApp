---
sidebar_position: 1
title: Overview
---

# Puzzle System Overview

Puzzles are a core learning modality in AmAha that engage users through interactive problem-solving. Unlike quizzes (which test knowledge), puzzles develop logic, pattern recognition, and strategic thinking.

## What is a Puzzle?

A puzzle is a self-contained interactive challenge where users manipulate visual or logical elements to reach a specific goal state. Puzzles provide immediate visual feedback and require active problem-solving rather than recall.

**Key Characteristics:**
- **Visual Interaction** - Drag, rotate, place, or arrange elements
- **Logic-based** - Requires reasoning to solve
- **Progressive difficulty** - Easy to hard variations
- **Feedback system** - Hints and solution options
- **Time tracking** - Measures solve time for leaderboards

## Why Puzzles Matter

Puzzles serve different educational goals than quizzes:

| Aspect | Quizzes | Puzzles |
|--------|---------|---------|
| **Purpose** | Test knowledge | Develop logic |
| **Interaction** | Answer selection | Active manipulation |
| **Thinking** | Recall-based | Problem-solving |
| **Engagement** | Question-driven | Goal-driven |
| **Time** | Minutes | Variable |

## Puzzle Categories

AmAha includes **5 major puzzle categories**, each with multiple puzzle types:

### 1. **Grid-Based Puzzles**
Logic puzzles where you fill cells with numbers or symbols following rules.

**Types:**
- Sudoku (fill 3×3 grid with 1-9)
- Kakuro (cross-sum grid puzzle)
- Nonogram (pixel art grid)

**Best for:** Logic, pattern recognition, mathematics

### 2. **Tile-Based Puzzles**
Rearrange tiles to match a pattern or goal.

**Types:**
- Jigsaw puzzle (complete picture)
- Slider puzzle (arrange numbers in order)
- Tangram (arrange shapes to form picture)

**Best for:** Spatial reasoning, attention to detail

### 3. **Word Puzzles**
Word-based challenges combining language and logic.

**Types:**
- Crossword (fill grid with words)
- Word Search (find hidden words)
- Anagrams (rearrange letters)

**Best for:** Vocabulary, language skills, spelling

### 4. **Pattern Puzzles**
Identify and complete sequences or patterns.

**Types:**
- Sequence (continue number/shape pattern)
- Logic deduction (use clues to solve)
- Picture patterns (find the missing image)

**Best for:** Mathematical thinking, logical deduction

### 5. **Interactive Puzzles**
Real-time puzzles with physics, time, or special rules.

**Types:**
- Block puzzle (arrange falling blocks)
- Tower of Hanoi (move stacks following rules)
- Pipeline (connect pipes to route flow)

**Best for:** Strategic thinking, spatial planning

## Puzzle Progression

Most puzzles offer 3-4 difficulty levels:

| Level | Characteristics | Example |
|-------|-----------------|---------|
| **Easy** | 5×5 grid, 1-5 rules, clear goal | Sudoku 4×4 |
| **Medium** | 9×9 grid, 5-8 rules, some ambiguity | Standard Sudoku |
| **Hard** | 12×12 grid, 8+ rules, complex patterns | Super Sudoku |
| **Expert** | 16×16+ grid, 10+ rules, minimal guidance | Extreme Sudoku |

Each level has:
- **Different board size** or **more constraints**
- **Separate leaderboard** for fair comparison
- **Same core rules** with increased complexity

## User Flow

Typical puzzle-solving experience:

```
Browse Puzzles
    ↓
Select Category → View Puzzle Details
    ↓
Choose Difficulty
    ↓
Launch Puzzle Solver
    ↓
Interact with Puzzle (drag, click, type, etc.)
    ↓
Submit Solution
    ↓
View Results:
├─ ✅ Solved (Time, Hints Used, Score)
├─ ⏸️ Hint System (Show clue, Reveal solution)
└─ 📊 Leaderboard Position
```

## Puzzle-Specific Features

### 1. **Hint System**
Users can request help without giving up:

- **Hint 1** - General guidance (e.g., "Look at row 3")
- **Hint 2** - Specific clue (e.g., "Column 5 needs a 7")
- **Reveal** - Show one correct cell/piece
- **Solution** - Show complete answer

**Impact:**
- Using hints reduces score by % per hint
- Time still counts toward completion
- Leaderboard ranks by score (with hints), then time

### 2. **Auto-Save**
Puzzle progress auto-saves every move:

- If browser crashes → Resume from last save
- Cannot recover deleted moves
- Storage: Browser localStorage + Cloud backup

### 3. **Validation**
Real-time feedback as user solves:

- **Immediate** - Instant validation for each placement
- **Color feedback** - Green (correct), yellow (warning), red (error)
- **Partial credit** - Points for partially solved puzzles

### 4. **Solution Visualization**
After solving:

- **Step-by-step replay** - Watch solution animation
- **Explanation** - How/why this is the solution
- **Alternatives** - Other valid solutions (if any)

---

## Puzzle Statistics

AmAha currently features:

- **13+ puzzle types** across 5 categories
- **1,000+ puzzles** in database
- **Difficulty levels:** Easy → Medium → Hard → Expert
- **Avg completion:** 5-15 minutes per puzzle
- **Categories:** Word, Logic, Spatial, Pattern, Interactive

---

## Next Steps

Learn more about specific puzzle types:

1. [Puzzle Categories →](puzzle-categories)
2. [Available Puzzle Types →](puzzle-types)
3. [Interaction Methods →](interaction-types)
4. [Technical Structure →](puzzle-structure)

---

**Next:** [Puzzle Categories](puzzle-categories)
