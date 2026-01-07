---
sidebar_position: 3
title: Puzzle Types
---

# Puzzle Types

AmAha features 13+ distinct puzzle types across 5 categories. This page details each type with examples and specifications.

## Grid-Based Puzzles

### 1. Sudoku

**Description:** Fill a 9×9 grid with digits 1-9 so each row, column, and 3×3 box contains each digit exactly once.

**Rules:**
- Each row must contain 1-9 (no repeats)
- Each column must contain 1-9 (no repeats)
- Each 3×3 box must contain 1-9 (no repeats)
- Some cells are pre-filled (givens)

**Educational Value:**
- Logic and deduction
- Constraint satisfaction
- Pattern recognition
- Systematic elimination

**Difficulty Variants:**
| Variant | Grid | Givens | Est. Time |
|---------|------|--------|-----------|
| Easy | 4×4 | 8-10 | 5 min |
| Medium | 6×6 | 18-20 | 10 min |
| Hard | 9×9 | 20-25 | 15 min |
| Expert | 12×12 | 30-40 | 25+ min |

**Current Count:** 85 puzzles across all variants

**Popularity:** ⭐⭐⭐⭐⭐ (Most played grid puzzle)

---

### 2. Kakuro

**Description:** Numeric crossword puzzle where you fill cells with digits 1-9 creating sums in given clue boxes.

**Rules:**
- Fill blank cells with digits 1-9
- Across/Down numbers must sum to clue value
- No digit repeats in same across/down sequence
- Clues indicate required sums

**Educational Value:**
- Addition and number sense
- Constraint problem-solving
- Strategic planning
- Mathematical reasoning

**Difficulty Variants:**
| Variant | Grid Size | Complexity | Est. Time |
|---------|-----------|-----------|-----------|
| Easy | 7×7 | Simple sums | 8 min |
| Medium | 10×10 | Multiple constraints | 12 min |
| Hard | 12×12 | Complex sequences | 18 min |
| Expert | 15×15 | Intricate patterns | 25+ min |

**Current Count:** 45 puzzles across all variants

**Popularity:** ⭐⭐⭐ (Intermediate appeal)

---

### 3. Nonogram (Picross)

**Description:** Decode clues to create a pixel art image in a grid.

**Rules:**
- Clues show number sequences for filled cells per row/column
- "5 2" means 5 filled cells, gap, 2 filled cells
- Cells are either filled (■) or empty (□)
- Complete the image from clues alone

**Educational Value:**
- Logic and systematic thinking
- Pattern recognition
- Visual-spatial skills
- Attention to detail

**Difficulty Variants:**
| Variant | Grid | Clue Complexity | Est. Time |
|---------|------|-----------------|-----------|
| Easy | 10×10 | Simple patterns | 8 min |
| Medium | 15×15 | Moderate patterns | 12 min |
| Hard | 20×20 | Complex patterns | 18 min |
| Expert | 25×25 | Intricate designs | 30+ min |

**Current Count:** 40 puzzles across all variants

**Popularity:** ⭐⭐⭐⭐ (Strong visual appeal)

---

### 4. Killer Sudoku

**Description:** Sudoku variant where cells are grouped in "cages" with sum constraints.

**Rules:**
- Standard Sudoku rules (1-9 per row/column/box)
- Cages must sum to target value
- No digit repeats within cage
- Cells marked with cage sum

**Educational Value:**
- Enhanced logic
- Addition skills
- Multiple constraint handling
- Strategic planning

**Difficulty Variants:**
| Variant | Cages | Complexity | Est. Time |
|---------|-------|-----------|-----------|
| Easy | 8-10 | Simple | 8 min |
| Medium | 12-14 | Moderate | 12 min |
| Hard | 15-17 | Complex | 18 min |
| Expert | 18+ | Very complex | 25+ min |

**Current Count:** 30 puzzles across all variants

**Popularity:** ⭐⭐⭐⭐ (Growing)

---

### 5. Futoshiki

**Description:** Fill grid with digits and inequality symbols comparing adjacent cells.

**Rules:**
- Fill grid with 1-9 (no repeats per row/column)
- Respect inequality signs (< > symbols)
- Some cells pre-filled
- Some inequalities pre-placed

**Educational Value:**
- Comparison and ordering
- Logic with inequality
- Pattern recognition
- Constraint satisfaction

**Difficulty Variants:**
| Variant | Grid | Rules | Est. Time |
|---------|------|-------|-----------|
| Easy | 4×4 | Few inequalities | 5 min |
| Medium | 6×6 | Mixed | 10 min |
| Hard | 8×8 | Many constraints | 15 min |
| Expert | 10×10 | Complex | 20+ min |

**Current Count:** 25 puzzles across all variants

**Popularity:** ⭐⭐⭐ (Niche audience)

---

## Tile-Based Puzzles

### 6. Jigsaw Puzzle

**Description:** Classic picture reconstruction from irregular shaped pieces.

**Rules:**
- Pieces have unique interlocking shapes
- Must assemble to complete image
- Rotation allowed
- Picture reference shown

**Educational Value:**
- Spatial visualization
- Fine motor control
- Visual memory
- Persistence and patience

**Difficulty Variants:**
| Variant | Pieces | Est. Time | Audiences |
|---------|--------|-----------|-----------|
| Easy | 15-20 | 8 min | Kids, casual |
| Medium | 30-50 | 15 min | General |
| Hard | 75-150 | 25 min | Adults, enthusiasts |
| Expert | 200+ | 45+ min | Advanced |

**Current Count:** 95 puzzles across all variants

**Popularity:** ⭐⭐⭐⭐⭐ (All-time favorite)

---

### 7. Slider Puzzle (15-Puzzle)

**Description:** Arrange numbered tiles 1-9 (or 1-15) in correct order by sliding into empty space.

**Rules:**
- Slide tiles adjacent to empty space
- Only one tile moves per turn
- Goal: Arrange numbers in order
- Empty space ends in bottom-right

**Educational Value:**
- Spatial reasoning
- Strategic planning
- Problem decomposition
- Sequence optimization

**Difficulty Variants:**
| Variant | Grid | States | Est. Time |
|---------|------|--------|-----------|
| Easy | 3×3 | 100-200 | 5 min |
| Medium | 4×4 | 1,000+ | 10 min |
| Hard | 5×5 | 10,000+ | 20 min |
| Expert | Custom | 100,000+ | 30+ min |

**Current Count:** 55 puzzles across all variants

**Popularity:** ⭐⭐⭐⭐ (Classic appeal)

---

### 8. Tangram

**Description:** Arrange 7 geometric pieces to form target shapes.

**Rules:**
- Use all 7 pieces (5 triangles, 1 square, 1 parallelogram)
- Pieces cannot overlap
- Must match target silhouette
- Multiple target shapes per puzzle

**Educational Value:**
- Geometric thinking
- Spatial visualization
- Rotation skills
- Creative problem-solving

**Difficulty Variants:**
| Variant | Target Shapes | Complexity | Est. Time |
|---------|---------------|-----------|-----------|
| Easy | Simple (5-7) | Obvious placements | 8 min |
| Medium | Moderate (8-10) | Less obvious | 12 min |
| Hard | Complex (10-15) | Difficult fits | 18 min |
| Expert | Advanced (15+) | Very challenging | 25+ min |

**Current Count:** 60 puzzles (100+ target shapes total)

**Popularity:** ⭐⭐⭐⭐ (Great for learning)

---

### 9. Block Puzzle

**Description:** Stack geometric blocks to fill rows/columns, clearing completed lines.

**Rules:**
- Blocks fall like Tetris
- Complete rows/columns to score
- Blocks cannot overlap
- Game ends when no more moves

**Educational Value:**
- Spatial planning
- Real-time decision making
- Optimization
- Pattern completion

**Difficulty Variants:**
| Variant | Board | Blocks | Est. Time |
|---------|-------|--------|-----------|
| Easy | 5×5 | 3-5 types | 5 min |
| Medium | 8×8 | 6-8 types | 10 min |
| Hard | 10×10 | 8-10 types | 15 min |
| Expert | Custom | 10+ types | 20+ min |

**Current Count:** 50 puzzles with custom rules

**Popularity:** ⭐⭐⭐⭐⭐ (Highly addictive)

---

### 10. Rotational Puzzle

**Description:** Arrange rotating tiles/rings to match target pattern.

**Rules:**
- Each piece/ring rotates independently
- Match adjacent colors/symbols
- All pieces must align correctly
- Some pieces may be fixed

**Educational Value:**
- Rotation mental manipulation
- Spatial relationships
- Systematic trial
- Motor coordination

**Difficulty Variants:**
| Variant | Pieces | Rotations | Est. Time |
|---------|--------|-----------|-----------|
| Easy | 3-4 | Limited | 5 min |
| Medium | 5-6 | More complex | 10 min |
| Hard | 7-8 | Very complex | 15 min |
| Expert | 9+ | Extreme | 20+ min |

**Current Count:** 35 puzzles across all variants

**Popularity:** ⭐⭐⭐ (Satisfying mechanics)

---

## Word Puzzles

### 11. Crossword

**Description:** Fill grid with words using across and down clues.

**Rules:**
- Each clue indicates one word
- Words share letters at intersections
- All grid cells must be filled
- Black cells separate words

**Educational Value:**
- Vocabulary expansion
- Spelling mastery
- Clue interpretation
- Lateral thinking

**Difficulty Variants:**
| Variant | Grid Size | Clues | Est. Time |
|---------|-----------|-------|-----------|
| Easy | 8×8 | Direct definitions | 8 min |
| Medium | 12×12 | Some indirect | 12 min |
| Hard | 15×15 | Cryptic clues | 18 min |
| Expert | 20×20 | Very cryptic | 30+ min |

**Current Count:** 75 puzzles across all variants

**Popularity:** ⭐⭐⭐⭐⭐ (Timeless favorite)

---

### 12. Word Search

**Description:** Find hidden words in a letter grid.

**Rules:**
- Words can be horizontal, vertical, diagonal
- Forward or backward
- Words overlap (share letters)
- Circle/highlight found words

**Educational Value:**
- Vocabulary recognition
- Pattern scanning
- Attention to detail
- Spelling by sight

**Difficulty Variants:**
| Variant | Grid | Words | Est. Time |
|---------|------|-------|-----------|
| Easy | 8×8 | 10-12 | 5 min |
| Medium | 12×12 | 15-18 | 10 min |
| Hard | 16×16 | 20-25 | 15 min |
| Expert | 20×20 | 25-30 | 20+ min |

**Current Count:** 70 puzzles across all variants

**Popularity:** ⭐⭐⭐⭐ (Relaxing, accessible)

---

## Pattern Puzzles

### 13. Number Sequence

**Description:** Identify pattern rule and continue sequence.

**Rules:**
- Examine given numbers
- Determine the rule
- Continue sequence with correct next numbers
- Multiple solution types

**Types:**
- Arithmetic (2, 4, 6, 8...)
- Fibonacci-like (1, 1, 2, 3, 5...)
- Compound operations
- Digit-based patterns

**Educational Value:**
- Pattern recognition
- Mathematical thinking
- Inductive reasoning
- Sequence understanding

**Difficulty Variants:**
| Variant | Pattern Type | Complexity | Est. Time |
|---------|-------------|-----------|-----------|
| Easy | Simple arithmetic | +/- only | 3 min |
| Medium | Compound | Multiple operations | 5 min |
| Hard | Complex | Hidden patterns | 8 min |
| Expert | Cryptic | Obscure rules | 12+ min |

**Current Count:** 120 patterns across all variants

**Popularity:** ⭐⭐⭐⭐ (IQ test appeal)

---

## Summary Table

| Puzzle | Category | Type | Count | Popularity |
|--------|----------|------|-------|------------|
| Sudoku | Grid | Logic | 85 | ⭐⭐⭐⭐⭐ |
| Kakuro | Grid | Numeric | 45 | ⭐⭐⭐ |
| Nonogram | Grid | Logical Art | 40 | ⭐⭐⭐⭐ |
| Killer Sudoku | Grid | Logic+Math | 30 | ⭐⭐⭐⭐ |
| Futoshiki | Grid | Inequality | 25 | ⭐⭐⭐ |
| Jigsaw | Tile | Assembly | 95 | ⭐⭐⭐⭐⭐ |
| Slider | Tile | Sequencing | 55 | ⭐⭐⭐⭐ |
| Tangram | Tile | Geometric | 60 | ⭐⭐⭐⭐ |
| Block | Tile | Interactive | 50 | ⭐⭐⭐⭐⭐ |
| Rotational | Tile | 3D Thinking | 35 | ⭐⭐⭐ |
| Crossword | Word | Language | 75 | ⭐⭐⭐⭐⭐ |
| Word Search | Word | Scanning | 70 | ⭐⭐⭐⭐ |
| Sequences | Pattern | Deduction | 120 | ⭐⭐⭐⭐ |
| **TOTAL** | | | **885+** | |

---

**Next:** [Interaction Types](interaction-types) to learn how users interact with puzzles.
