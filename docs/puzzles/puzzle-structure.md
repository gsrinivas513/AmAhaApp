---
sidebar_position: 5
title: Puzzle Structure
---

# Puzzle Structure

This page documents the technical structure and data model for puzzles in AmAha.

## Puzzle Document Model

Puzzles are stored as JSON documents with the following structure:

```json
{
  "id": "sudoku-001",
  "title": "Classic Sudoku #1",
  "description": "Traditional 9×9 Sudoku puzzle",
  "category": "Grid",
  "type": "Sudoku",
  "difficultyLevels": {
    "Easy": {
      "gridSize": 4,
      "givenCells": 8,
      "puzzle": [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ],
      "solution": [
        [1, 2, 3, 4],
        [3, 4, 1, 2],
        [2, 1, 4, 3],
        [4, 3, 2, 1]
      ],
      "hints": ["Focus on row 1", "Column 3 needs 1-4"]
    },
    "Medium": { ... },
    "Hard": { ... },
    "Expert": { ... }
  },
  "metadata": {
    "avgTime": "5-15 min",
    "rating": 4.5,
    "playCount": 245,
    "difficulty": "Medium",
    "author": "PuzzleCreator",
    "tags": ["logic", "numbers", "grid"],
    "created": "2024-01-15",
    "lastModified": "2024-01-15"
  }
}
```

## Top-Level Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | String | Yes | Unique identifier (lowercase-kebab-case) |
| `title` | String | Yes | Display name |
| `description` | String | Yes | Brief explanation |
| `category` | String | Yes | Category (Grid, Tile, Word, Pattern) |
| `type` | String | Yes | Puzzle type (Sudoku, Jigsaw, Crossword, etc.) |
| `difficultyLevels` | Object | Yes | Levels with puzzle data |
| `metadata` | Object | Yes | Statistics and information |

---

## Difficulty Levels Structure

Each puzzle has up to 4 difficulty variants:

```json
"difficultyLevels": {
  "Easy": {
    "gridSize": 4,
    "givenCells": 8,
    "puzzle": [...],
    "solution": [...],
    "hints": [...]
  },
  "Medium": { ... },
  "Hard": { ... },
  "Expert": { ... }
}
```

### Level Properties

| Property | Type | Description |
|----------|------|-------------|
| `gridSize` | Number | Grid dimensions (4x4, 6x6, 9x9, etc.) |
| `givenCells` | Number | Pre-filled cells count |
| `puzzle` | 2D Array | Initial puzzle state |
| `solution` | 2D Array | Complete solution |
| `hints` | Array | Hint texts for guidance |

### Representation

**Sudoku (filled cells as numbers, empty as 0):**
```json
"puzzle": [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  ...
]
```

**Jigsaw (filled cells by color/piece ID):**
```json
"puzzle": [
  [1, 1, 2, 2, 3, 3, 4, 4],
  [1, 2, 2, 3, 3, 4, 4, 5],
  [6, 6, 7, 7, 8, 8, 5, 5],
  ...
]
```

**Nonogram (clues instead of grid):**
```json
"puzzle": {
  "rows": [
    [5],
    [3, 2],
    [1, 1, 1],
    ...
  ],
  "cols": [
    [4],
    [3, 1],
    [1, 1, 1],
    ...
  ]
}
```

---

## Metadata Object

```json
"metadata": {
  "avgTime": "5-15 min",
  "rating": 4.5,
  "playCount": 245,
  "difficulty": "Medium",
  "author": "PuzzleCreator",
  "tags": ["logic", "numbers", "grid"],
  "minAge": 8,
  "audiences": ["all", "students", "adults"],
  "created": "2024-01-15",
  "lastModified": "2024-01-15",
  "imageUrl": "https://example.com/puzzle-preview.jpg",
  "rules": "Fill grid with 1-9, each row/column/box unique"
}
```

### Metadata Properties

| Property | Type | Description |
|----------|------|-------------|
| `avgTime` | String | Estimated completion range |
| `rating` | Number | User rating (0-5) |
| `playCount` | Number | Times played |
| `difficulty` | String | Primary difficulty level |
| `author` | String | Creator name |
| `tags` | Array | Search/categorization tags |
| `minAge` | Number | Minimum recommended age |
| `audiences` | Array | Target audiences |
| `created` | ISO Date | Creation timestamp |
| `lastModified` | ISO Date | Last update timestamp |
| `imageUrl` | URL | Puzzle preview image |
| `rules` | String | Rule explanation |

---

## Type-Specific Structures

### Sudoku

```json
{
  "id": "sudoku-easy-001",
  "type": "Sudoku",
  "difficultyLevels": {
    "Easy": {
      "gridSize": 4,
      "givenCells": 8,
      "puzzle": [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ],
      "solution": [
        [1, 2, 3, 4],
        [3, 4, 1, 2],
        [2, 1, 4, 3],
        [4, 3, 2, 1]
      ]
    }
  }
}
```

### Jigsaw Puzzle

```json
{
  "id": "jigsaw-landscape-001",
  "type": "Jigsaw",
  "difficultyLevels": {
    "Easy": {
      "pieceCount": 15,
      "gridSize": 5,
      "image": "https://example.com/landscape.jpg",
      "pieces": [
        { "id": 1, "x": 0, "y": 0, "shape": [...] },
        { "id": 2, "x": 1, "y": 0, "shape": [...] }
      ],
      "solution": [
        { "id": 1, "x": 0, "y": 0 },
        { "id": 2, "x": 1, "y": 0 }
      ]
    }
  }
}
```

### Crossword

```json
{
  "id": "crossword-001",
  "type": "Crossword",
  "difficultyLevels": {
    "Medium": {
      "gridSize": 12,
      "grid": [
        [1, 2, 3, 0, 4, 5, 0, 6, 7, 0, 8, 9],
        [10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ...
      ],
      "clues": {
        "across": [
          { "number": 1, "clue": "Famous artist (5)", "answer": "PICASSO" },
          { "number": 4, "clue": "Primary color (3)", "answer": "RED" }
        ],
        "down": [
          { "number": 1, "clue": "Type of cheese (5)", "answer": "PIZZA" }
        ]
      }
    }
  }
}
```

### Nonogram

```json
{
  "id": "nonogram-easy-001",
  "type": "Nonogram",
  "difficultyLevels": {
    "Easy": {
      "gridSize": 10,
      "rowClues": [
        [5],
        [3, 2],
        [1, 1, 1],
        ...
      ],
      "colClues": [
        [4],
        [3, 1],
        [2, 2],
        ...
      ],
      "solution": [
        [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 1, 1, 0, 0, 0],
        ...
      ]
    }
  }
}
```

---

## Storage Structure

Puzzles are stored in Firebase Firestore:

```
FirestoreDB
└── puzzles (collection)
    ├── sudoku-easy-001 (document)
    │   ├── id: "sudoku-easy-001"
    │   ├── title: "Classic Sudoku #1"
    │   ├── type: "Sudoku"
    │   ├── difficultyLevels: { Easy, Medium, Hard, Expert }
    │   └── metadata: { ... }
    │
    ├── jigsaw-animal-045 (document)
    │   └── ...
    │
    └── [More puzzles...]
```

### Document Size Guidelines

| Puzzle Type | Avg Size | Max Size |
|-----------|----------|----------|
| Sudoku | 8 KB | 20 KB |
| Jigsaw | 50-100 KB | 200 KB |
| Crossword | 15 KB | 40 KB |
| Nonogram | 5 KB | 15 KB |
| Word Search | 8 KB | 20 KB |

---

## Progress/State Tracking

User progress is stored separately:

```json
{
  "userId": "user-123",
  "puzzleId": "sudoku-001",
  "difficulty": "Easy",
  "state": "in-progress",
  "currentGrid": [
    [1, 2, 0, 0],
    [3, 4, 1, 0],
    [2, 0, 4, 3],
    [4, 3, 2, 1]
  ],
  "hintsUsed": 1,
  "startTime": "2024-01-20T10:30:00Z",
  "lastUpdate": "2024-01-20T10:42:30Z",
  "solved": false
}
```

### Progress Properties

| Property | Type | Description |
|----------|------|-------------|
| `userId` | String | User identifier |
| `puzzleId` | String | Puzzle identifier |
| `difficulty` | String | Difficulty level played |
| `state` | String | "not-started" \| "in-progress" \| "solved" |
| `currentGrid` | 2D Array | Current puzzle state |
| `hintsUsed` | Number | Number of hints requested |
| `startTime` | ISO Date | When user started |
| `lastUpdate` | ISO Date | Last move timestamp |
| `solved` | Boolean | Completion status |
| `solveTime` | Number | Seconds to complete (if solved) |
| `score` | Number | Points earned |

---

## Validation Rules

### Puzzle Creation

1. **Unique ID** - Cannot duplicate existing puzzle
2. **Valid Type** - Must be recognized puzzle type
3. **Complete Variants** - Need puzzle + solution for each level
4. **Solution Correctness** - Solution must match puzzle rules
5. **Consistent Grid** - All grids same size within variant

### Grid Validation

- **Sudoku:** 1-9 in rows/columns/boxes, 0 = empty
- **Jigsaw:** Piece count matches cell count
- **Crossword:** Black cells separate words, all cells filled
- **Nonogram:** Clues match actual row/column pattern

---

## File Format

**Database:** Firebase Firestore  
**Format:** JSON documents  
**Indexing:** By ID, type, category, difficulty  
**Versioning:** Timestamp-based updates  

---

## Backward Compatibility

Older puzzle formats may lack:
- `difficultyLevels` object (use single grid)
- `metadata` object (auto-generate defaults)
- `hints` array (leave empty)

**Migration:** System auto-converts on load to current format.

---

**Next:** [Activities Overview](../activities/overview) or back to [Puzzles Overview](overview)
