/**
 * Puzzle Evaluator Service
 * Validates and scores puzzle answers for Crossword, Word Search, and Sudoku
 */

/**
 * Evaluates a Crossword puzzle answer
 * Checks if filled grid matches the expected solution
 * 
 * @param {Array<Array<string>>} userGrid - User's filled grid (9x9)
 * @param {Array<Array<string>>} solutionGrid - Expected solution (9x9)
 * @returns {Object} {isCorrect, score, feedback, errorCount}
 */
export const evaluateCrossword = (userGrid, solutionGrid) => {
  try {
    if (!userGrid || !solutionGrid) {
      return {
        isCorrect: false,
        score: 0,
        feedback: 'Invalid puzzle data',
        errorCount: 0,
      };
    }

    let correctCells = 0;
    let totalCells = 0;
    const errors = [];

    // Compare each cell
    for (let r = 0; r < userGrid.length; r++) {
      for (let c = 0; c < userGrid[r].length; c++) {
        const userAnswer = (userGrid[r][c] || '').toUpperCase().trim();
        const expectedAnswer = (solutionGrid[r][c] || '').toUpperCase().trim();

        // Only count non-empty cells
        if (expectedAnswer && expectedAnswer !== '') {
          totalCells++;

          if (userAnswer === expectedAnswer) {
            correctCells++;
          } else if (userAnswer === '') {
            errors.push(`Cell (${r + 1}, ${c + 1}): Missing answer`);
          } else {
            errors.push(`Cell (${r + 1}, ${c + 1}): "${userAnswer}" is incorrect`);
          }
        }
      }
    }

    const percentage = totalCells > 0 ? (correctCells / totalCells) * 100 : 0;
    const isCorrect = percentage === 100;

    // Scoring: Award points based on accuracy
    // Full credit (100) for perfect, partial credit for attempts
    const baseScore = 25; // Max points for crossword
    const score = Math.round((percentage / 100) * baseScore);

    return {
      isCorrect,
      score,
      percentage: Math.round(percentage),
      correctCells,
      totalCells,
      errorCount: errors.length,
      feedback: isCorrect
        ? `Perfect! All ${totalCells} cells correct.`
        : `${correctCells}/${totalCells} cells correct (${Math.round(percentage)}%)`,
      errors: errors.slice(0, 5), // Return first 5 errors
    };
  } catch (error) {
    console.error('Crossword evaluation error:', error);
    return {
      isCorrect: false,
      score: 0,
      feedback: 'Error evaluating crossword',
      errorCount: 0,
    };
  }
};

/**
 * Evaluates a Word Search puzzle answer
 * Checks if all required words were found
 * 
 * @param {Array<string>} userFoundWords - Words found by user
 * @param {Array<string>} expectedWords - Words that should be found
 * @returns {Object} {isCorrect, score, feedback, foundCount, totalCount}
 */
export const evaluateWordSearch = (userFoundWords, expectedWords) => {
  try {
    if (!userFoundWords || !expectedWords) {
      return {
        isCorrect: false,
        score: 0,
        feedback: 'Invalid puzzle data',
        foundCount: 0,
        totalCount: 0,
      };
    }

    // Normalize words to uppercase
    const userWords = new Set(
      (userFoundWords || []).map((w) => w.toUpperCase().trim())
    );
    const expectedSet = new Set(
      (expectedWords || []).map((w) => w.toUpperCase().trim())
    );

    // Count matches
    let foundCount = 0;
    const missing = [];
    const incorrect = [];

    // Check expected words
    expectedSet.forEach((word) => {
      if (userWords.has(word)) {
        foundCount++;
      } else {
        missing.push(word);
      }
    });

    // Check for extra words (incorrect selections)
    userWords.forEach((word) => {
      if (!expectedSet.has(word)) {
        incorrect.push(word);
      }
    });

    const totalCount = expectedSet.size;
    const percentage =
      totalCount > 0 ? (foundCount / totalCount) * 100 : 0;
    const isCorrect = percentage === 100 && incorrect.length === 0;

    // Scoring: 15 points base, scaled by percentage found
    const baseScore = 15; // Max points for word search
    const score = Math.round((percentage / 100) * baseScore);

    return {
      isCorrect,
      score,
      percentage: Math.round(percentage),
      foundCount,
      totalCount,
      missingWords: missing,
      incorrectWords: incorrect,
      feedback: isCorrect
        ? `Excellent! Found all ${totalCount} words.`
        : `Found ${foundCount}/${totalCount} words (${Math.round(
            percentage
          )}%)${incorrect.length > 0 ? ` + ${incorrect.length} incorrect` : ''}`,
    };
  } catch (error) {
    console.error('Word search evaluation error:', error);
    return {
      isCorrect: false,
      score: 0,
      feedback: 'Error evaluating word search',
      foundCount: 0,
      totalCount: 0,
    };
  }
};

/**
 * Validates Sudoku rules for a completed grid
 * Checks: rows, columns, and 3x3 boxes for duplicates
 * 
 * @param {Array<number>} grid - 81-cell sudoku grid
 * @returns {Object} {isValid, violations}
 */
export const validateSudokuRules = (grid) => {
  const violations = [];

  if (!grid || grid.length !== 81) {
    return { isValid: false, violations: ['Invalid grid size'] };
  }

  // Helper to convert index to row/col
  const getCell = (idx) => ({
    row: Math.floor(idx / 9),
    col: idx % 9,
  });

  // Check rows
  for (let r = 0; r < 9; r++) {
    const rowValues = new Set();
    for (let c = 0; c < 9; c++) {
      const val = grid[r * 9 + c];
      if (val === 0) continue;
      if (rowValues.has(val)) {
        violations.push(`Duplicate ${val} in row ${r + 1}`);
      }
      rowValues.add(val);
    }
  }

  // Check columns
  for (let c = 0; c < 9; c++) {
    const colValues = new Set();
    for (let r = 0; r < 9; r++) {
      const val = grid[r * 9 + c];
      if (val === 0) continue;
      if (colValues.has(val)) {
        violations.push(`Duplicate ${val} in column ${c + 1}`);
      }
      colValues.add(val);
    }
  }

  // Check 3x3 boxes
  for (let box = 0; box < 9; box++) {
    const boxValues = new Set();
    const startRow = Math.floor(box / 3) * 3;
    const startCol = (box % 3) * 3;

    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        const val = grid[r * 9 + c];
        if (val === 0) continue;
        if (boxValues.has(val)) {
          violations.push(`Duplicate ${val} in box ${box + 1}`);
        }
        boxValues.add(val);
      }
    }
  }

  return {
    isValid: violations.length === 0,
    violations: violations.slice(0, 5), // Return first 5 violations
  };
};

/**
 * Evaluates a Sudoku puzzle answer
 * Checks: completion, rule validity, and solution match
 * 
 * @param {Array<number>} userGrid - User's filled grid (81 cells)
 * @param {Array<number>} solutionGrid - Expected solution (81 cells)
 * @returns {Object} {isCorrect, score, feedback, isComplete, isValid}
 */
export const evaluateSudoku = (userGrid, solutionGrid) => {
  try {
    if (!userGrid || !solutionGrid) {
      return {
        isCorrect: false,
        score: 0,
        feedback: 'Invalid puzzle data',
        isComplete: false,
        isValid: false,
      };
    }

    // Check completion
    const isComplete = !userGrid.includes(0);

    // Validate sudoku rules
    const ruleValidation = validateSudokuRules(userGrid);
    const isValid = ruleValidation.isValid;

    // Check solution match
    let matchCount = 0;
    let totalCells = 0;

    for (let i = 0; i < 81; i++) {
      if (solutionGrid[i] > 0) {
        totalCells++;
        if (userGrid[i] === solutionGrid[i]) {
          matchCount++;
        }
      }
    }

    const matchPercentage =
      totalCells > 0 ? (matchCount / totalCells) * 100 : 0;

    // Determine correctness
    // Must be complete, valid, and match solution
    const isCorrect = isComplete && isValid && matchPercentage === 100;

    // Scoring: 30 points base
    // Full credit only if perfect (complete + valid + matching)
    // Partial credit for partial solutions
    const baseScore = 30; // Max points for sudoku
    let score = 0;

    if (isCorrect) {
      score = baseScore;
    } else if (isComplete && isValid) {
      // If complete and valid but not matching - shouldn't happen but just in case
      score = Math.round((matchPercentage / 100) * baseScore);
    } else if (isComplete) {
      // Complete but invalid - some credit
      score = Math.round(baseScore * 0.3);
    } else {
      // Incomplete - partial credit based on completion
      const completionPercentage =
        (userGrid.filter((v) => v > 0).length / 81) * 100;
      score = Math.round((completionPercentage / 100) * baseScore * 0.2);
    }

    // Generate feedback
    let feedback = '';
    if (isCorrect) {
      feedback = 'Perfect! Sudoku solved correctly.';
    } else if (!isComplete) {
      const filled = userGrid.filter((v) => v > 0).length;
      feedback = `Incomplete. ${filled}/81 cells filled.`;
    } else if (!isValid) {
      const violations = ruleValidation.violations.length;
      feedback = `Found ${violations} rule violation${violations !== 1 ? 's' : ''}.`;
    } else {
      feedback = `Valid but incorrect solution.`;
    }

    return {
      isCorrect,
      score,
      feedback,
      isComplete,
      isValid,
      matchPercentage: Math.round(matchPercentage),
      filledCells: userGrid.filter((v) => v > 0).length,
      violations: ruleValidation.violations,
    };
  } catch (error) {
    console.error('Sudoku evaluation error:', error);
    return {
      isCorrect: false,
      score: 0,
      feedback: 'Error evaluating sudoku',
      isComplete: false,
      isValid: false,
    };
  }
};

/**
 * Generic puzzle evaluator
 * Routes to appropriate evaluator based on puzzle type
 * 
 * @param {string} puzzleType - Type of puzzle (CROSSWORD, WORD_SEARCH, SUDOKU)
 * @param {Object} userAnswer - User's answer object
 * @param {Object} questionData - Question data with expected answers
 * @returns {Object} Evaluation result with score
 */
export const evaluatePuzzle = (puzzleType, userAnswer, questionData) => {
  try {
    const type = (puzzleType || '').toUpperCase();

    switch (type) {
      case 'CROSSWORD':
        return evaluateCrossword(
          userAnswer?.filled_grid,
          questionData?.solution_grid
        );

      case 'WORD_SEARCH':
        return evaluateWordSearch(
          userAnswer?.found_words,
          questionData?.words
        );

      case 'SUDOKU':
        return evaluateSudoku(
          userAnswer?.filled_grid,
          questionData?.solution
        );

      default:
        return {
          isCorrect: false,
          score: 0,
          feedback: `Unknown puzzle type: ${puzzleType}`,
        };
    }
  } catch (error) {
    console.error('Puzzle evaluation error:', error);
    return {
      isCorrect: false,
      score: 0,
      feedback: 'Error evaluating puzzle',
    };
  }
};

export default {
  evaluateCrossword,
  evaluateWordSearch,
  evaluateSudoku,
  validateSudokuRules,
  evaluatePuzzle,
};
