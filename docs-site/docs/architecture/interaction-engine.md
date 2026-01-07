---
sidebar_position: 3
title: Interaction Engine
---

# Interaction Engine

The Interaction Engine is the core puzzle-solving and interaction handling system that validates user moves, manages game state, and determines puzzle completion.

## Engine Architecture

```
User Input (Click, Drag, Type, etc.)
    ↓
Input Validation Layer
    ├─ Check: Is move valid?
    ├─ Check: Is piece placeable here?
    ├─ Check: Does it break rules?
    └─ Return: Valid/Invalid
    ↓
State Update Layer
    ├─ Update game board
    ├─ Update puzzle state
    ├─ Apply animations
    └─ Trigger callbacks
    ↓
Win Detection Layer
    ├─ Check: Is puzzle complete?
    ├─ Check: Are all rules satisfied?
    ├─ Calculate: Time & moves
    └─ Trigger: Completion event
    ↓
Feedback System
    ├─ Haptic feedback (mobile)
    ├─ Sound effects (if enabled)
    ├─ Visual animations
    └─ Update UI
```

---

## Puzzle Type Engines

### 1. Grid-Based Puzzles (Sudoku, Kakuro)

**State Structure:**
```javascript
{
  type: 'sudoku',
  difficulty: 'medium',
  gridSize: 9,
  grid: [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    // ... 7 more rows
  ],
  userGrid: [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    // User's current state
  ],
  conflictCells: [[1, 4], [2, 3]], // Cells with conflicts
  hints: 3, // Remaining hints
  startTime: 1704067200000,
  lastMoveTime: 1704067230000,
}
```

**Move Validation:**
```javascript
class SudokuValidator {
  isValidMove(grid, row, col, value) {
    // Check: Value 1-9
    if (value < 1 || value > 9) return false;

    // Check: Not already filled
    if (grid[row][col] !== 0) return false;

    // Check: Row constraint (no duplicates)
    if (this.hasInRow(grid, row, value)) return false;

    // Check: Column constraint
    if (this.hasInCol(grid, col, value)) return false;

    // Check: Box constraint (3x3)
    if (this.hasInBox(grid, row, col, value)) return false;

    return true; // Valid move!
  }

  hasInRow(grid, row, value) {
    return grid[row].includes(value);
  }

  hasInCol(grid, col, value) {
    return grid.map(r => r[col]).includes(value);
  }

  hasInBox(grid, row, col, value) {
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (grid[r][c] === value) return true;
      }
    }
    return false;
  }

  isComplete(grid) {
    // All cells filled + all constraints satisfied
    return grid.every(row => row.every(cell => cell !== 0));
  }
}
```

### 2. Tile-Based Puzzles (Jigsaw, Slider)

**State Structure:**
```javascript
{
  type: 'jigsaw',
  gridSize: 4, // 4x4 puzzle
  tiles: [
    { id: 1, imageUrl: 'tile1.jpg', position: { x: 0, y: 0 } },
    { id: 2, imageUrl: 'tile2.jpg', position: { x: 1, y: 0 } },
    // ... 14 more tiles
  ],
  slots: [
    { id: 1, x: 0, y: 0, occupied: true, occupiedBy: 1 },
    { id: 2, x: 1, y: 0, occupied: true, occupiedBy: 2 },
    // ... 14 more slots
  ],
  unplacedTiles: [], // Tiles not yet placed
  moves: 0,
}
```

**Move Validation (Jigsaw):**
```javascript
class JigsawEngine {
  canPlaceTile(tile, slot) {
    // Check: Slot is empty
    if (slot.occupied) return false;

    // Check: Tile fits (shape matching)
    if (!this.shapesMatch(tile, slot)) return false;

    // Check: No overlap with other tiles
    if (this.hasOverlap(tile, slot)) return false;

    return true;
  }

  shapesMatch(tile, slot) {
    // Compare edge pieces/shapes
    return tile.shapeId === slot.shapeId;
  }

  hasOverlap(tile, slot) {
    // Check adjacency constraints
    // Two pieces can't occupy overlapping space
    return false; // Simplified
  }

  placeTile(tile, slot) {
    tile.position = { x: slot.x, y: slot.y };
    slot.occupied = true;
    slot.occupiedBy = tile.id;
    this.moves++;
    return this.isComplete();
  }

  isComplete() {
    return this.slots.every(slot => slot.occupied) &&
           this.unplacedTiles.length === 0;
  }
}
```

### 3. Word Puzzles (Crossword, Word Search)

**State Structure (Crossword):**
```javascript
{
  type: 'crossword',
  gridSize: { width: 15, height: 15 },
  grid: [
    // 15x15 grid of cells
    [{ type: 'letter', value: '', clueId: 'A1' }, ...],
    // cells can be: 'letter', 'black', 'constraint'
  ],
  clues: {
    across: [
      { id: 'A1', number: 1, text: 'Computer', answer: 'MACHINE' },
      // ... more clues
    ],
    down: [
      { id: 'D1', number: 1, text: 'Kitchen tool', answer: 'PAN' },
      // ... more clues
    ],
  },
  userAnswers: {}, // { 'A1': 'MACHINE', 'D1': 'PAN' }
}
```

**Move Validation (Crossword):**
```javascript
class CrosswordValidator {
  setLetter(gridPos, row, col, letter) {
    // Check: Is alphanumeric
    if (!/^[A-Z0-9]$/i.test(letter)) return false;

    // Check: Cell is not black/blocked
    if (grid[row][col].type === 'black') return false;

    // Update cell
    grid[row][col].value = letter.toUpperCase();
    this.updateRelatedClues(row, col);
    return true;
  }

  updateRelatedClues(row, col) {
    // Find all clues this cell participates in
    const cellClues = this.getCluesAtCell(row, col);
    
    cellClues.forEach(clue => {
      const currentWord = this.getWordForClue(clue);
      this.validateClueAnswers(clue, currentWord);
    });
  }

  isComplete() {
    // All cells filled + all answers correct
    return this.areAllCellsFilled() && this.areAllAnswersCorrect();
  }

  areAllAnswersCorrect() {
    const allClues = [...this.clues.across, ...this.clues.down];
    return allClues.every(clue => {
      const answer = this.getWordForClue(clue);
      return answer === clue.answer;
    });
  }
}
```

### 4. Pattern Puzzles (Sequences, Deduction)

**State Structure:**
```javascript
{
  type: 'sequence',
  sequence: [2, 4, 6, 8, 10, '?', 18],
  userAnswer: null,
  hints: [
    'Even numbers',
    'Increment by 2 each time',
  ],
  correctAnswer: 12,
  timeLimit: 120, // seconds
}
```

**Validation:**
```javascript
class SequenceValidator {
  validateAnswer(userAnswer) {
    // Pattern recognition logic
    if (userAnswer === this.correctAnswer) {
      return { valid: true, message: 'Correct!' };
    }
    return { valid: false, message: 'Try again!' };
  }
}
```

### 5. Interactive Puzzles (Block, Pipe, Tower)

**State Structure (Block Puzzle):**
```javascript
{
  type: 'block',
  gridSize: { rows: 6, cols: 6 },
  grid: [
    [0, 0, 0, 0, 0, 0], // 0 = empty, >0 = block ID
    [0, 1, 1, 0, 0, 0],
    // ... more rows
  ],
  blocks: [
    { id: 1, shape: [[0,1], [1,1]], color: 'red', x: 1, y: 1 },
    { id: 2, shape: [[1,1,1]], color: 'blue', x: 0, y: 3 },
    // ... more blocks
  ],
  nextBlocks: [
    // Upcoming blocks to place
  ],
  score: 0,
  completedLines: [],
}
```

**Move Validation (Block Puzzle):**
```javascript
class BlockPuzzleEngine {
  canPlaceBlock(block, gridX, gridY) {
    // Check: Block fits within grid
    if (gridX + block.width > this.gridSize.cols) return false;
    if (gridY + block.height > this.gridSize.rows) return false;

    // Check: No overlaps
    for (let [dx, dy] of block.shape) {
      const cellX = gridX + dx;
      const cellY = gridY + dy;
      if (this.grid[cellY][cellX] !== 0) {
        return false; // Cell occupied
      }
    }

    return true;
  }

  placeBlock(block, gridX, gridY) {
    // Place block on grid
    for (let [dx, dy] of block.shape) {
      this.grid[gridY + dy][gridX + dx] = block.id;
    }

    // Check for completed lines
    this.checkForCompletedLines();

    // Get next block
    this.loadNextBlock();

    return this.isGameOver();
  }

  checkForCompletedLines() {
    let linesCleared = 0;
    let rowsToRemove = [];

    for (let row = 0; row < this.gridSize.rows; row++) {
      if (this.isRowComplete(row)) {
        rowsToRemove.push(row);
        linesCleared++;
      }
    }

    // Remove completed rows
    rowsToRemove.forEach(row => {
      this.grid.splice(row, 1);
      this.grid.unshift(Array(this.gridSize.cols).fill(0));
    });

    // Calculate score
    if (linesCleared > 0) {
      this.score += linesCleared * 10; // 10 pts per line
    }

    this.completedLines.push({
      timestamp: Date.now(),
      linesCleared,
      score: this.score,
    });
  }

  isGameOver() {
    // Can't place any remaining blocks
    return this.nextBlocks.every(block =>
      !this.canPlaceBlock(block, 0, 0)
    );
  }
}
```

---

## Movement Handling

### Drag & Drop System

```javascript
class DragDropManager {
  constructor() {
    this.draggedItem = null;
    this.startPos = null;
    this.currentPos = null;
  }

  onDragStart(item, event) {
    this.draggedItem = item;
    this.startPos = { x: event.clientX, y: event.clientY };
    item.isDragging = true;
    this.updateUI();
  }

  onDragMove(event) {
    this.currentPos = { x: event.clientX, y: event.clientY };
    const offset = {
      x: this.currentPos.x - this.startPos.x,
      y: this.currentPos.y - this.startPos.y,
    };
    this.renderPreview(this.draggedItem, offset);
  }

  onDragEnd(targetSlot) {
    if (targetSlot && this.isValidDrop(this.draggedItem, targetSlot)) {
      this.executeDrop(this.draggedItem, targetSlot);
    } else {
      this.animateReturnToOrigin(this.draggedItem);
    }
    this.draggedItem = null;
  }
}
```

### Touch/Mobile Support

```javascript
class TouchHandler {
  supportsTouchEvents = true;
  
  setupTouchListeners(element) {
    element.addEventListener('touchstart', this.onTouchStart.bind(this));
    element.addEventListener('touchmove', this.onTouchMove.bind(this));
    element.addEventListener('touchend', this.onTouchEnd.bind(this));
  }

  onTouchStart(event) {
    const touch = event.touches[0];
    const item = this.getItemAtTouch(touch);
    this.dragManager.onDragStart(item, touch);
  }

  onTouchMove(event) {
    const touch = event.touches[0];
    this.dragManager.onDragMove(touch);
  }

  onTouchEnd(event) {
    const touch = event.changedTouches[0];
    const dropTarget = this.getSlotAtTouch(touch);
    this.dragManager.onDragEnd(dropTarget);
  }
}
```

---

## Undo/Redo System

```javascript
class UndoRedoManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
    this.maxUndos = 20;
  }

  captureState(puzzleState) {
    // Save current state
    this.undoStack.push(JSON.parse(JSON.stringify(puzzleState)));
    this.redoStack = []; // Clear redo when new move made
    
    // Limit history size
    if (this.undoStack.length > this.maxUndos) {
      this.undoStack.shift();
    }
  }

  undo(currentState) {
    if (this.undoStack.length === 0) return null;
    
    this.redoStack.push(JSON.parse(JSON.stringify(currentState)));
    const previousState = this.undoStack.pop();
    return previousState;
  }

  redo() {
    if (this.redoStack.length === 0) return null;
    
    const nextState = this.redoStack.pop();
    this.undoStack.push(nextState);
    return nextState;
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }
}
```

---

## Hint System

```javascript
class HintManager {
  constructor(puzzle) {
    this.puzzle = puzzle;
    this.hintsUsed = 0;
    this.maxHints = 3;
  }

  getHint(type = 'general') {
    if (this.hintsUsed >= this.maxHints) {
      return { available: false, message: 'No hints remaining' };
    }

    let hint;
    switch (this.puzzle.type) {
      case 'sudoku':
        hint = this.getSudokuHint();
        break;
      case 'crossword':
        hint = this.getCrosswordHint();
        break;
      case 'jigsaw':
        hint = this.getJigsawHint();
        break;
      default:
        hint = this.getGeneralHint();
    }

    this.hintsUsed++;
    return { available: true, hint };
  }

  getSudokuHint() {
    // Find an empty cell with only one valid solution
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.puzzle.grid[r][c] === 0) {
          const validValues = this.getValidValues(r, c);
          if (validValues.length === 1) {
            return {
              type: 'cell',
              position: { r, c },
              value: validValues[0],
              text: `Row ${r + 1}, Column ${c + 1} must be ${validValues[0]}`,
            };
          }
        }
      }
    }
    
    // If no obvious answer, give category hint
    return { type: 'strategy', text: 'Look for rows/columns with only one empty cell' };
  }

  getGeneralHint() {
    return { type: 'generic', text: 'Try a different position' };
  }

  hintsRemaining() {
    return this.maxHints - this.hintsUsed;
  }
}
```

---

## Timer & Scoring

```javascript
class PuzzleTimer {
  constructor(timeLimit = null) {
    this.timeLimit = timeLimit; // null = unlimited
    this.startTime = Date.now();
    this.elapsed = 0;
    this.paused = false;
  }

  getElapsedTime() {
    if (this.paused) return this.elapsed;
    return Date.now() - this.startTime;
  }

  getRemainingTime() {
    if (!this.timeLimit) return null;
    const remaining = this.timeLimit - this.getElapsedTime();
    return Math.max(0, remaining);
  }

  isTimeUp() {
    if (!this.timeLimit) return false;
    return this.getRemainingTime() === 0;
  }

  pause() {
    this.paused = true;
    this.elapsed = this.getElapsedTime();
  }

  resume() {
    this.paused = false;
    this.startTime = Date.now() - this.elapsed;
  }

  stop() {
    return this.getElapsedTime();
  }
}

class ScoringEngine {
  calculateScore(puzzle, moves, timeSeconds) {
    const baseScore = 100;
    const movesPenalty = Math.max(0, (moves - puzzle.minMoves) * 2);
    const timeBenefit = Math.floor(Math.max(0, 60 - timeSeconds) / 2);
    
    const totalScore = Math.max(10, baseScore - movesPenalty + timeBenefit);
    
    return {
      baseScore,
      movesPenalty,
      timeBenefit,
      totalScore,
    };
  }
}
```

---

## Auto-Save System

```javascript
class AutoSaveManager {
  constructor(saveInterval = 30000) { // 30 seconds
    this.saveInterval = saveInterval;
    this.lastSaveTime = null;
    this.isDirty = false;
  }

  markDirty() {
    this.isDirty = true;
  }

  async autoSave(puzzleState, puzzleId) {
    const now = Date.now();
    if (!this.lastSaveTime || now - this.lastSaveTime >= this.saveInterval) {
      if (this.isDirty) {
        await this.saveToFirebase(puzzleState, puzzleId);
        this.lastSaveTime = now;
        this.isDirty = false;
      }
    }
  }

  async saveToFirebase(puzzleState, puzzleId) {
    try {
      await db.collection('puzzleSessions').doc(sessionId).update({
        state: puzzleState,
        lastSaved: new Date(),
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Fallback to localStorage
      this.saveToLocalStorage(puzzleState, puzzleId);
    }
  }

  saveToLocalStorage(puzzleState, puzzleId) {
    const key = `puzzle-session-${puzzleId}`;
    localStorage.setItem(key, JSON.stringify(puzzleState));
  }
}
```

---

## Events & Callbacks

```javascript
class PuzzleEventManager extends EventTarget {
  emitEvent(eventName, detail) {
    this.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  // Events fired:
  // - 'move' : User makes a move
  // - 'hint' : User requests hint
  // - 'undo' : User undoes move
  // - 'reset' : User resets puzzle
  // - 'complete' : Puzzle completed
  // - 'timeWarning' : 30s remaining
  // - 'timeUp' : Time limit reached
  // - 'invalid-move' : Attempted invalid move
}

puzzle.addEventListener('move', (e) => {
  console.log('Move:', e.detail);
  updateUI();
});

puzzle.addEventListener('complete', (e) => {
  const { time, score, moves } = e.detail;
  showCompletionScreen(time, score, moves);
});
```

---

## Performance Optimization

### Efficient Board Updates

```javascript
class EfficientStateUpdater {
  // Instead of full re-render, update only changed cells
  updateCell(row, col, value) {
    const key = `${row}-${col}`;
    
    if (this.previousState[key] !== value) {
      this.applyDOMUpdate(row, col, value);
      this.previousState[key] = value;
    }
  }

  applyDOMUpdate(row, col, value) {
    const cellElement = document.querySelector(
      `[data-row="${row}"][data-col="${col}"]`
    );
    if (cellElement) {
      cellElement.textContent = value;
      cellElement.classList.add('updated');
      setTimeout(() => cellElement.classList.remove('updated'), 300);
    }
  }
}
```

---

**Next:** [State Management](state-management) or [Backend Integration](firebase-integration)
