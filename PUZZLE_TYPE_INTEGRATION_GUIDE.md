# Puzzle Type Integration Guide

This guide shows how to implement puzzle-specific UI components that render different puzzle types.

## Current Architecture

```
PuzzlePlayerPage.jsx (Entry point)
│
├── Loads puzzle from Firestore
├── Displays metadata
└── [NEXT] Route to type-specific player
```

## Step-by-Step Integration

### Step 1: Create Puzzle Type Player Components

For each puzzle type, create a component in `src/puzzles/puzzle-players/`:

#### Example: Picture-Word Puzzle Player
**File**: `src/puzzles/puzzle-players/PictureWordPuzzlePlayer.jsx`

```javascript
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function PictureWordPuzzlePlayer({ puzzle, onComplete }) {
  const { theme } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectWord = (index) => {
    setSelectedIndex(index);
    // Check if answer is correct
    if (index === puzzle.data.correctIndex) {
      setIsCorrect(true);
      // Call completion handler
      onComplete({
        correct: true,
        time: Date.now(),
        score: 100,
      });
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      {/* Display image */}
      <img 
        src={puzzle.data.imageUrl} 
        alt={puzzle.title}
        style={{
          maxWidth: '400px',
          maxHeight: '300px',
          borderRadius: '12px',
          marginBottom: '32px',
        }}
      />

      {/* Word options */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {puzzle.data.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectWord(index)}
            style={{
              padding: '12px 24px',
              background: selectedIndex === index ? theme.accentPrimary : theme.surfacePrimary,
              color: selectedIndex === index ? '#fff' : theme.textPrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            {option}
          </button>
        ))}
      </div>

      {isCorrect && <p style={{ color: 'green', marginTop: '16px' }}>Correct! ✅</p>}
    </div>
  );
}
```

#### Example: Matching Puzzle Player
**File**: `src/puzzles/puzzle-players/MatchingPuzzlePlayer.jsx`

```javascript
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function MatchingPuzzlePlayer({ puzzle, onComplete }) {
  const { theme } = useTheme();
  const [matches, setMatches] = useState({});
  const [selectedLeft, setSelectedLeft] = useState(null);

  const handleLeftClick = (index) => {
    setSelectedLeft(index);
  };

  const handleRightClick = (rightIndex) => {
    if (selectedLeft !== null) {
      const newMatches = { ...matches, [selectedLeft]: rightIndex };
      setMatches(newMatches);
      
      // Check if all matches are correct
      const allMatched = Object.keys(newMatches).length === puzzle.data.leftItems.length;
      const allCorrect = Object.entries(newMatches).every(
        ([left, right]) => puzzle.data.correctMatches[left] === right
      );

      if (allMatched && allCorrect) {
        onComplete({
          correct: true,
          time: Date.now(),
          score: 100,
        });
      }
      
      setSelectedLeft(null);
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Left side - Items to match */}
        <div>
          <h3 style={{ color: theme.textPrimary, marginBottom: '16px' }}>Select items</h3>
          {puzzle.data.leftItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleLeftClick(index)}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                margin: '8px 0',
                background: selectedLeft === index ? theme.accentPrimary : theme.surfacePrimary,
                color: selectedLeft === index ? '#fff' : theme.textPrimary,
                border: `2px solid ${theme.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right side - Match options */}
        <div>
          <h3 style={{ color: theme.textPrimary, marginBottom: '16px' }}>Match with</h3>
          {puzzle.data.rightItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleRightClick(index)}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                margin: '8px 0',
                background: theme.surfacePrimary,
                color: theme.textPrimary,
                border: `2px solid ${theme.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Step 2: Update PuzzlePlayerPage to Route to Type-Specific Players

**File**: `src/pages/PuzzlePlayerPage.jsx`

Replace the entire success state return with type-based routing:

```javascript
// Import all puzzle type players at the top
import PictureWordPuzzlePlayer from '../puzzles/puzzle-players/PictureWordPuzzlePlayer';
import MatchingPuzzlePlayer from '../puzzles/puzzle-players/MatchingPuzzlePlayer';
import OrderingPuzzlePlayer from '../puzzles/puzzle-players/OrderingPuzzlePlayer';
import FindPairPuzzlePlayer from '../puzzles/puzzle-players/FindPairPuzzlePlayer';
// ... etc

// In the success render section, add type-based rendering:
const renderPuzzlePlayer = (puzzle) => {
  switch (puzzle.type) {
    case 'picture-word':
      return <PictureWordPuzzlePlayer puzzle={puzzle} onComplete={handlePuzzleComplete} />;
    case 'matching':
      return <MatchingPuzzlePlayer puzzle={puzzle} onComplete={handlePuzzleComplete} />;
    case 'ordering':
      return <OrderingPuzzlePlayer puzzle={puzzle} onComplete={handlePuzzleComplete} />;
    case 'find-pair':
      return <FindPairPuzzlePlayer puzzle={puzzle} onComplete={handlePuzzleComplete} />;
    // ... add more types
    default:
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: theme.textPrimary, fontSize: '18px' }}>
            Puzzle type "{puzzle.type}" not yet implemented
          </p>
        </div>
      );
  }
};

// Update the return statement to use this function
return (
  <SiteLayout>
    {/* ... existing breadcrumb and header ... */}
    
    {/* Puzzle Player */}
    <div style={{
      background: theme.surfacePrimary,
      border: `1px solid ${theme.border}`,
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '40px',
    }}>
      {renderPuzzlePlayer(puzzle)}
    </div>
    
    {/* ... existing metadata and buttons ... */}
  </SiteLayout>
);
```

### Step 3: Implement Puzzle Completion Handler

Add this function to `PuzzlePlayerPage.jsx`:

```javascript
const handlePuzzleComplete = async (result) => {
  try {
    console.log('🎉 [PuzzlePlayerPage] Puzzle completed!', result);
    
    // Save completion to Firestore
    const completionRef = collection(db, 'users', currentUser.uid, 'puzzle_completions');
    await addDoc(completionRef, {
      puzzleId: id,
      puzzleTitle: puzzle.title,
      correct: result.correct,
      score: result.score,
      time: result.time,
      timestamp: new Date(),
    });

    // Show completion screen
    setIsCompleted(true);
    setCompletionResult(result);
    
  } catch (error) {
    console.error('❌ [PuzzlePlayerPage] Error saving completion:', error);
  }
};
```

### Step 4: Add Completion Screen

Add this state to `PuzzlePlayerPage.jsx`:

```javascript
const [isCompleted, setIsCompleted] = useState(false);
const [completionResult, setCompletionResult] = useState(null);

// In the return, add completion screen before the main player:
if (isCompleted && completionResult) {
  return (
    <SiteLayout>
      <div style={{
        background: theme.background,
        minHeight: '100vh',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>
            {completionResult.correct ? '🎉' : '❌'}
          </div>
          <p style={{
            color: theme.textPrimary,
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '16px',
          }}>
            {completionResult.correct ? 'Great Job!' : 'Try Again!'}
          </p>
          <p style={{
            color: theme.textSecondary,
            fontSize: '18px',
            marginBottom: '32px',
          }}>
            Score: {completionResult.score}/100
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setIsCompleted(false);
                setCompletionResult(null);
              }}
              style={{
                padding: '12px 32px',
                background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/puzzle')}
              style={{
                padding: '12px 32px',
                background: 'transparent',
                color: theme.accentPrimary,
                border: `2px solid ${theme.accentPrimary}`,
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              Back to Puzzles
            </button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
```

## Puzzle Data Structure Reference

Each puzzle type has different `data` field structure:

### Picture-Word Puzzle
```javascript
{
  type: 'picture-word',
  data: {
    imageUrl: string,
    options: string[],      // Word options
    correctIndex: number,   // Index of correct answer
  }
}
```

### Matching Puzzle
```javascript
{
  type: 'matching',
  data: {
    leftItems: string[],           // Items to match
    rightItems: string[],          // Options to match with
    correctMatches: {              // {leftIndex: rightIndex}
      '0': 1,
      '1': 0,
      // ...
    }
  }
}
```

### Ordering Puzzle
```javascript
{
  type: 'ordering',
  data: {
    items: string[],              // Items in wrong order
    correctOrder: number[],       // Indices in correct order
  }
}
```

### Find-Pair Puzzle
```javascript
{
  type: 'find-pair',
  data: {
    imageUrl: string,
    pairs: [
      { x: number, y: number, w: number, h: number }, // Box 1
      { x: number, y: number, w: number, h: number }, // Box 2
      // ... more pairs
    ]
  }
}
```

## Testing the Integration

1. Create a test puzzle of each type in Firestore
2. Navigate to `/puzzle` and click on the puzzle
3. You should see the type-specific player UI
4. Interact with the puzzle and verify completion tracking

## Files to Create

```
src/
└── puzzles/
    └── puzzle-players/
        ├── PictureWordPuzzlePlayer.jsx
        ├── MatchingPuzzlePlayer.jsx
        ├── OrderingPuzzlePlayer.jsx
        ├── FindPairPuzzlePlayer.jsx
        ├── DragPuzzlePlayer.jsx
        ├── SpotDifferencePuzzlePlayer.jsx
        └── JigsawPuzzlePlayer.jsx
```

## Integration Checklist

- [ ] Create puzzle type player components
- [ ] Update `PuzzlePlayerPage.jsx` with type-based routing
- [ ] Implement `handlePuzzleComplete` function
- [ ] Add completion screen UI
- [ ] Add Firestore completion tracking
- [ ] Test with sample puzzles of each type
- [ ] Implement leaderboard integration
- [ ] Add achievement/badge system
- [ ] Implement time tracking
- [ ] Add hint system (if applicable)

## Next: Puzzle Type Implementations

Each puzzle type requires specific UI logic. Here's the typical flow:

1. **Render puzzle content** - Display images, text, interactive elements
2. **Capture user input** - Click handlers, drag handlers, text input
3. **Validate answer** - Compare user input against correct answer
4. **Provide feedback** - Show right/wrong, highlight errors
5. **Track completion** - Save result to Firestore with score and time

Refer to existing puzzle implementations in the codebase for reference patterns.
