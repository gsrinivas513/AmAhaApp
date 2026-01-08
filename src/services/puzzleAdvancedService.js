import { db } from '../firebase/firebaseConfig';
import { doc, setDoc, getDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore';

// ============================================================================
// PUZZLE CONFIGURATION & TEMPLATES
// ============================================================================

export const PUZZLE_TYPES = {
  CROSSWORD: 'crossword',
  SUDOKU: 'sudoku',
  WORD_SEARCH: 'word-search',
};

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert',
};

export const PUZZLE_CONFIGS = {
  crossword: {
    sizes: [
      { name: 'Mini', rows: 7, cols: 7 },
      { name: 'Small', rows: 11, cols: 11 },
      { name: 'Medium', rows: 15, cols: 15 },
      { name: 'Large', rows: 21, cols: 21 },
    ],
    difficultySettings: {
      easy: { fillPercentage: 0.6, wordLength: { min: 3, max: 8 } },
      medium: { fillPercentage: 0.7, wordLength: { min: 4, max: 10 } },
      hard: { fillPercentage: 0.75, wordLength: { min: 5, max: 12 } },
      expert: { fillPercentage: 0.8, wordLength: { min: 6, max: 15 } },
    },
    timeLimit: { easy: 1200, medium: 900, hard: 600, expert: 300 },
  },
  sudoku: {
    size: 9,
    boxSize: 3,
    difficultySettings: {
      easy: { cluesCount: 40, maxRetries: 3 },
      medium: { cluesCount: 32, maxRetries: 2 },
      hard: { cluesCount: 27, maxRetries: 1 },
      expert: { cluesCount: 17, maxRetries: 0 },
    },
    timeLimit: { easy: 1800, medium: 1200, hard: 600, expert: 300 },
  },
  'word-search': {
    sizes: [
      { name: 'Small', rows: 10, cols: 10 },
      { name: 'Medium', rows: 15, cols: 15 },
      { name: 'Large', rows: 20, cols: 20 },
    ],
    difficultySettings: {
      easy: { wordCount: 8, minWordLength: 4, directions: ['horizontal', 'vertical'] },
      medium: { wordCount: 12, minWordLength: 4, directions: ['horizontal', 'vertical', 'diagonal'] },
      hard: { wordCount: 16, minWordLength: 5, directions: ['horizontal', 'vertical', 'diagonal', 'backwards'] },
      expert: { wordCount: 20, minWordLength: 5, directions: ['horizontal', 'vertical', 'diagonal', 'backwards'] },
    },
    timeLimit: { easy: 1200, medium: 900, hard: 600, expert: 300 },
  },
};

// ============================================================================
// GRID GENERATION UTILITIES
// ============================================================================

/**
 * Creates an empty grid of specified dimensions
 */
export function createEmptyGrid(rows, cols, fillValue = null) {
  return Array(rows).fill(null).map(() => Array(cols).fill(fillValue));
}

/**
 * Creates a crossword grid with black and white cells
 */
export function generateCrosswordGrid(rows, cols, difficulty = 'medium') {
  const grid = createEmptyGrid(rows, cols, null);
  const config = PUZZLE_CONFIGS.crossword.difficultySettings[difficulty];

  // Create symmetric pattern for crossword
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const isMirror = Math.random() < (1 - config.fillPercentage);
      if (isMirror) {
        grid[i][j] = { type: 'black', value: '#', answer: '#' };
        grid[rows - 1 - i][cols - 1 - j] = { type: 'black', value: '#', answer: '#' };
      } else {
        grid[i][j] = { type: 'white', value: '', answer: '', number: null };
        grid[rows - 1 - i][cols - 1 - j] = { type: 'white', value: '', answer: '', number: null };
      }
    }
  }

  // Add numbers to clue positions
  let clueNumber = 1;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] && grid[i][j].type === 'white') {
        const isStartOfAcross = j === 0 || !grid[i][j - 1] || grid[i][j - 1].type === 'black';
        const isStartOfDown = i === 0 || !grid[i - 1] || grid[i - 1][j].type === 'black';

        if (isStartOfAcross || isStartOfDown) {
          grid[i][j].number = clueNumber++;
        }
      }
    }
  }

  return grid;
}

/**
 * Generates a solved Sudoku grid and removes cells based on difficulty
 */
export function generateSudokuGrid(difficulty = 'medium') {
  const size = 9;
  const grid = createEmptyGrid(size, size, 0);
  const config = PUZZLE_CONFIGS.sudoku.difficultySettings[difficulty];

  // Generate valid solved grid
  const solvedGrid = createEmptyGrid(size, size, 0);
  fillSudokuGrid(solvedGrid);

  // Copy solved grid and remove cells
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      grid[i][j] = { value: solvedGrid[i][j], answer: solvedGrid[i][j], editable: true, conflict: false };
    }
  }

  // Remove cells based on difficulty
  let removed = 0;
  const totalToRemove = size * size - config.cluesCount;
  while (removed < totalToRemove) {
    const i = Math.floor(Math.random() * size);
    const j = Math.floor(Math.random() * size);
    if (grid[i][j].value !== 0) {
      grid[i][j].value = 0;
      grid[i][j].editable = true;
      removed++;
    }
  }

  return { grid, solvedGrid };
}

/**
 * Recursive backtracking to fill Sudoku grid
 */
function fillSudokuGrid(grid, row = 0, col = 0) {
  if (row === 9) return true;

  const nextRow = col === 8 ? row + 1 : row;
  const nextCol = col === 8 ? 0 : col + 1;

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

  for (const num of numbers) {
    if (isValidSudokuMove(grid, row, col, num)) {
      grid[row][col] = num;
      if (fillSudokuGrid(grid, nextRow, nextCol)) return true;
      grid[row][col] = 0;
    }
  }

  return false;
}

/**
 * Validates if a number can be placed in Sudoku cell
 */
function isValidSudokuMove(grid, row, col, num) {
  // Check row
  for (let j = 0; j < 9; j++) {
    if (grid[row][j] === num) return false;
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (grid[i][j] === num) return false;
    }
  }

  return true;
}

/**
 * Generates a word search grid with hidden words
 */
export function generateWordSearchGrid(words, rows, cols, difficulty = 'medium') {
  const grid = createEmptyGrid(rows, cols, { letter: '', wordIndices: [] });
  const config = PUZZLE_CONFIGS['word-search'].difficultySettings[difficulty];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Place words in grid
  const placedWords = [];
  const maxAttempts = 100;

  for (let wordIdx = 0; wordIdx < Math.min(words.length, config.wordCount); wordIdx++) {
    const word = words[wordIdx].toUpperCase();
    const direction = config.directions[Math.floor(Math.random() * config.directions.length)];
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < maxAttempts) {
      const startRow = Math.floor(Math.random() * rows);
      const startCol = Math.floor(Math.random() * cols);

      if (canPlaceWord(grid, word, startRow, startCol, direction, rows, cols)) {
        placeWord(grid, word, startRow, startCol, direction, wordIdx);
        placedWords.push({ word, startRow, startCol, direction });
        placed = true;
      }
      attempts++;
    }
  }

  // Fill empty cells with random letters
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!grid[i][j].letter) {
        grid[i][j].letter = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return { grid, words: placedWords };
}

/**
 * Checks if a word can be placed at a position
 */
function canPlaceWord(grid, word, row, col, direction, rows, cols) {
  for (let i = 0; i < word.length; i++) {
    let newRow = row;
    let newCol = col;

    if (direction === 'horizontal') newCol += i;
    else if (direction === 'vertical') newRow += i;
    else if (direction === 'diagonal') {
      newRow += i;
      newCol += i;
    } else if (direction === 'backwards') {
      newCol -= i;
    }

    if (newRow >= rows || newCol >= cols || newRow < 0 || newCol < 0) return false;

    const cell = grid[newRow][newCol];
    if (cell.letter && cell.letter !== word[i]) return false;
  }

  return true;
}

/**
 * Places a word in the grid
 */
function placeWord(grid, word, row, col, direction, wordIdx) {
  for (let i = 0; i < word.length; i++) {
    let newRow = row;
    let newCol = col;

    if (direction === 'horizontal') newCol += i;
    else if (direction === 'vertical') newRow += i;
    else if (direction === 'diagonal') {
      newRow += i;
      newCol += i;
    } else if (direction === 'backwards') {
      newCol -= i;
    }

    grid[newRow][newCol].letter = word[i];
    grid[newRow][newCol].wordIndices.push(wordIdx);
  }
}

// ============================================================================
// VALIDATION ENGINE
// ============================================================================

/**
 * Validates a crossword puzzle answer
 */
export function validateCrosswordAnswer(userAnswer, correctAnswer) {
  const userClean = userAnswer.toUpperCase().trim();
  const correctClean = correctAnswer.toUpperCase().trim();
  return userClean === correctClean;
}

/**
 * Validates Sudoku constraints
 */
export function validateSudokuCell(grid, row, col, value) {
  if (!value || value < 1 || value > 9) return { valid: false, conflicts: [] };

  const conflicts = [];

  // Check row
  for (let j = 0; j < 9; j++) {
    if (j !== col && grid[row][j].value === value) {
      conflicts.push({ type: 'row', row, col: j });
    }
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (i !== row && grid[i][col].value === value) {
      conflicts.push({ type: 'col', row: i, col });
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if ((i !== row || j !== col) && grid[i][j].value === value) {
        conflicts.push({ type: 'box', row: i, col: j });
      }
    }
  }

  return {
    valid: conflicts.length === 0,
    conflicts,
  };
}

/**
 * Checks if Sudoku is completely solved
 */
export function isSudokuSolved(grid) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (!grid[i][j].value || grid[i][j].value === 0) return false;
      const validation = validateSudokuCell(grid, i, j, grid[i][j].value);
      if (!validation.valid) return false;
    }
  }
  return true;
}

/**
 * Validates word search completion
 */
export function validateWordSearchCompletion(foundWords, totalWords) {
  return foundWords.length === totalWords;
}

// ============================================================================
// HINTS SYSTEM
// ============================================================================

/**
 * Generates hints for crossword clue
 */
export function generateCrosswordHints(clueAnswer, clueText) {
  const hints = [];

  // Hint 1: Pattern hint
  const pattern = clueAnswer
    .split('')
    .map((char, idx) => (idx === 0 || idx === clueAnswer.length - 1 ? char : '_'))
    .join('');
  hints.push({ type: 'pattern', content: pattern, cost: 10 });

  // Hint 2: Word length
  hints.push({ type: 'length', content: `The answer is ${clueAnswer.length} letters long`, cost: 5 });

  // Hint 3: Full answer
  hints.push({ type: 'full_answer', content: clueAnswer, cost: 25 });

  return hints;
}

/**
 * Generates hints for Sudoku
 */
export function generateSudokuHints(grid, solvedGrid) {
  const hints = [];

  // Find empty cells that have low conflict potential
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (!grid[i][j].value || grid[i][j].value === 0) {
        const possibleValues = getPossibleSudokuValues(grid, i, j);
        if (possibleValues.length === 1) {
          hints.push({
            type: 'logical_hint',
            row: i,
            col: j,
            value: possibleValues[0],
            cost: 15,
          });
        }
      }
    }
  }

  // Add full cell reveal hint
  hints.push({
    type: 'cell_reveal',
    content: 'Reveals one cell',
    cost: 20,
  });

  // Add row/column reveal hint
  hints.push({
    type: 'row_reveal',
    content: 'Reveals one row',
    cost: 30,
  });

  return hints;
}

/**
 * Gets possible values for a Sudoku cell
 */
function getPossibleSudokuValues(grid, row, col) {
  const possible = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Check row
  for (let j = 0; j < 9; j++) {
    const idx = possible.indexOf(grid[row][j].value);
    if (idx > -1) possible.splice(idx, 1);
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    const idx = possible.indexOf(grid[i][col].value);
    if (idx > -1) possible.splice(idx, 1);
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      const idx = possible.indexOf(grid[i][j].value);
      if (idx > -1) possible.splice(idx, 1);
    }
  }

  return possible;
}

/**
 * Generates hints for word search
 */
export function generateWordSearchHints(placedWords) {
  const hints = [];

  placedWords.slice(0, 3).forEach((word, idx) => {
    hints.push({
      type: 'word_highlight',
      wordIdx: idx,
      content: `Highlights the word "${word.word}"`,
      cost: 10,
    });
  });

  hints.push({
    type: 'show_word',
    content: 'Reveals the location of a word',
    cost: 20,
  });

  return hints;
}

// ============================================================================
// FIRESTORE OPERATIONS
// ============================================================================

/**
 * Creates and saves a new puzzle to Firestore
 */
export async function createPuzzle(puzzleData) {
  try {
    const puzzleRef = doc(db, 'puzzles', puzzleData.id);
    await setDoc(puzzleRef, {
      ...puzzleData,
      createdAt: new Date(),
      updatedAt: new Date(),
      statistics: {
        totalAttempts: 0,
        completedAttempts: 0,
        averageTime: 0,
        averageScore: 0,
      },
    });
    return { success: true, puzzleId: puzzleData.id };
  } catch (error) {
    console.error('Error creating puzzle:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Saves puzzle progress for a user
 */
export async function savePuzzleProgress(userId, puzzleId, progress) {
  try {
    const progressRef = doc(db, `users/${userId}/puzzleProgress`, puzzleId);
    await setDoc(progressRef, {
      ...progress,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error saving puzzle progress:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Completes a puzzle and awards rewards
 */
export async function completePuzzle(userId, puzzleId, score, timeSpent, hintsUsed) {
  try {
    const userRef = doc(db, 'users', userId);
    const completionRef = doc(db, `users/${userId}/puzzleCompletions`, puzzleId);

    await setDoc(completionRef, {
      puzzleId,
      score,
      timeSpent,
      hintsUsed,
      completedAt: new Date(),
    });

    // Update user stats
    await updateDoc(userRef, {
      totalPuzzlesCompleted: increment(1),
      totalPuzzleXP: increment(Math.floor(score * timeSpent / 10)),
    });

    return { success: true };
  } catch (error) {
    console.error('Error completing puzzle:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Retrieves puzzle and user progress
 */
export async function getPuzzleWithProgress(userId, puzzleId) {
  try {
    const puzzleDoc = await getDoc(doc(db, 'puzzles', puzzleId));
    const progressDoc = await getDoc(doc(db, `users/${userId}/puzzleProgress`, puzzleId));

    return {
      puzzle: puzzleDoc.data(),
      progress: progressDoc.data(),
    };
  } catch (error) {
    console.error('Error retrieving puzzle:', error);
    return { error: error.message };
  }
}

/**
 * Gets user's puzzle statistics
 */
export async function getUserPuzzleStats(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();

    return {
      totalCompleted: userData?.totalPuzzlesCompleted || 0,
      totalXP: userData?.totalPuzzleXP || 0,
      averageScore: userData?.averagePuzzleScore || 0,
    };
  } catch (error) {
    console.error('Error retrieving puzzle stats:', error);
    return { error: error.message };
  }
}

// ============================================================================
// PUZZLE CUSTOMIZATION
// ============================================================================

/**
 * Validates puzzle customization parameters
 */
export function validateCustomization(puzzleType, customization) {
  const config = PUZZLE_CONFIGS[puzzleType];
  if (!config) return { valid: false, error: 'Invalid puzzle type' };

  const errors = [];

  if (customization.difficulty && !DIFFICULTY_LEVELS[customization.difficulty.toUpperCase()]) {
    errors.push('Invalid difficulty level');
  }

  if (puzzleType === 'crossword') {
    const sizeConfig = config.sizes.find((s) => s.name === customization.size);
    if (!sizeConfig) errors.push('Invalid grid size');
  }

  if (puzzleType === 'word-search') {
    if (customization.wordCount && customization.wordCount > 25) {
      errors.push('Word count cannot exceed 25');
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Applies theme customization to puzzle grid
 */
export function applyThemeToGrid(grid, theme = 'default') {
  const themes = {
    default: { cellBg: '#ffffff', textColor: '#000000', accentColor: '#4CAF50' },
    dark: { cellBg: '#1e1e1e', textColor: '#ffffff', accentColor: '#66BB6A' },
    blue: { cellBg: '#e3f2fd', textColor: '#0d47a1', accentColor: '#1976d2' },
    highContrast: { cellBg: '#000000', textColor: '#ffff00', accentColor: '#00ff00' },
  };

  return { grid, theme: themes[theme] || themes.default };
}

export default {
  PUZZLE_TYPES,
  DIFFICULTY_LEVELS,
  PUZZLE_CONFIGS,
  createEmptyGrid,
  generateCrosswordGrid,
  generateSudokuGrid,
  generateWordSearchGrid,
  validateCrosswordAnswer,
  validateSudokuCell,
  isSudokuSolved,
  validateWordSearchCompletion,
  generateCrosswordHints,
  generateSudokuHints,
  generateWordSearchHints,
  createPuzzle,
  savePuzzleProgress,
  completePuzzle,
  getPuzzleWithProgress,
  getUserPuzzleStats,
  validateCustomization,
  applyThemeToGrid,
};
