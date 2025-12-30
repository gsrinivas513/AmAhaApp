# Visual Puzzles Schema

## Overview
Puzzles are visual, interactive, drag-and-drop based games designed for kids. They are completely separate from quizzes with their own schema and rendering system.

## Puzzle Collection Structure

### Collection: `puzzles`

```javascript
{
  // Basic Info
  id: "string (auto-generated)",
  title: "string (e.g., 'Match the Numbers')",
  description: "string (optional short description)",
  difficulty: "string (easy | medium | hard)",
  ageGroup: "string (3-5 | 6-8 | 9-12)",
  
  // Hierarchy
  categoryId: "string (reference to categories collection)",
  categoryName: "string (display name)",
  topicId: "string (reference to topics)",
  topicName: "string (display name)",
  subtopicId: "string (reference to subtopics)",
  subtopicName: "string (display name)",
  
  // Type & Content
  type: "string (enum: picture-word | spot-difference | find-pair | picture-shadow | ordering)",
  
  // Metadata
  isPublished: "boolean (true/false)",
  createdAt: "timestamp",
  updatedAt: "timestamp",
  xpReward: "number (default: 10)",
  timeLimit: "number (seconds, optional)",
  
  // Type-Specific Data
  data: {
    // For "picture-word" type:
    // {
    //   pairs: [
    //     { image: "url", word: "string", id: "unique-id" }
    //   ],
    //   layout: "grid-2x2 | grid-3x3 | grid-2x3"
    // }
    
    // For "spot-difference" type:
    // {
    //   imageA: "url",
    //   imageB: "url",
    //   differences: [
    //     { x: number (0-100%), y: number (0-100%), radius: number (pixels) }
    //   ]
    // }
    
    // For "find-pair" type (memory game):
    // {
    //   cards: [
    //     { id: "unique-id", image: "url" }
    //   ],
    //   layout: "grid-2x4 | grid-3x4 | grid-4x4"
    // }
    
    // For "picture-shadow" type:
    // {
    //   image: "url",
    //   shadows: [
    //     { id: "unique-id", image: "shadow-url" }
    //   ],
    //   correctMapping: { imageId: shadowId }
    // }
    
    // For "ordering" type:
    // {
    //   items: [
    //     { id: "unique-id", image: "url", label: "string", order: number }
    //   ],
    //   itemType: "numbers | sequence | steps"
    // }
  },
  
  // Thumbnail for display
  thumbnail: "url (generated from first image/preview)",
  
  // Tags for filtering
  tags: ["array", "of", "keywords"]
}
```

## Progress Collection

### Collection: `puzzleProgress/{userId}/puzzles`

```javascript
{
  id: "puzzleId",
  completed: "boolean",
  attempts: "number",
  firstCompletedAt: "timestamp",
  lastAttemptAt: "timestamp",
  score: "number (0-100, percentage)",
  hints: {
    used: "array of hint indices",
    count: "number"
  },
  timeSpent: "number (milliseconds)"
}
```

## localStorage Structure (Guest Users)

```javascript
{
  "amaha_puzzle_progress": {
    "puzzleId": {
      completed: boolean,
      attempts: number,
      firstCompletedAt: timestamp,
      score: number
    }
  }
}
```

## Puzzle Hierarchy (Same as Quiz)

```
Feature
├── Category (e.g., "Kids Puzzles")
│   ├── Topic (e.g., "Matching")
│   │   ├── Subtopic (e.g., "Picture-Word Matching")
│   │   │   └── Puzzle 1, 2, 3...
```

## UI Requirements

- **Colors**: Bright pastel palette (baby blue, soft pink, mint green, light yellow, lavender)
- **Layout**: Rounded cards with soft shadows
- **Text**: Minimal, large, readable fonts (kid-friendly)
- **Interactions**: Touch-friendly, visual feedback
- **Animations**: Celebration on correct, gentle shake on incorrect
- **Mobile**: Full mobile-first design, vertical orientation default
- **Accessibility**: WCAG AA compliant, keyboard accessible
