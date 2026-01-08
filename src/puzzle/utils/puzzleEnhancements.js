/**
 * Puzzle Enhancement Module
 * Provides advanced puzzle features and optimizations
 */

/**
 * Puzzle Type Variations
 */
export const PUZZLE_VARIATIONS = {
  // Jigsaw Puzzle Variations
  jigsaw: {
    classic: {
      name: 'Classic Jigsaw',
      difficulty: 'Medium',
      pieceCount: 12,
      rotationAllowed: false,
    },
    expert: {
      name: 'Expert Jigsaw',
      difficulty: 'Hard',
      pieceCount: 24,
      rotationAllowed: true,
      similarPieces: true,
    },
    speedRound: {
      name: 'Speed Jigsaw',
      difficulty: 'Medium',
      pieceCount: 8,
      timeLimit: 120, // seconds
      bonusPoints: true,
    },
  },

  // Memory/Matching Variations
  memory: {
    basic: {
      name: 'Basic Memory',
      difficulty: 'Easy',
      pairCount: 6,
    },
    advanced: {
      name: 'Advanced Memory',
      difficulty: 'Hard',
      pairCount: 12,
      timeLimit: 300,
    },
    soundMemory: {
      name: 'Sound Memory',
      difficulty: 'Medium',
      pairCount: 8,
      audioClues: true,
    },
  },

  // Pattern Recognition Variations
  pattern: {
    sequential: {
      name: 'Sequential Pattern',
      difficulty: 'Easy',
      sequenceLength: 5,
    },
    complex: {
      name: 'Complex Pattern',
      difficulty: 'Hard',
      sequenceLength: 10,
      multipleRules: true,
    },
    visual: {
      name: 'Visual Pattern',
      difficulty: 'Medium',
      sequenceLength: 7,
      visualElements: true,
    },
  },
};

/**
 * Generate puzzle instance with enhanced features
 */
export function createEnhancedPuzzle(puzzleData, variation) {
  return {
    ...puzzleData,
    id: `puzzle_${Date.now()}`,
    variation: variation,
    createdAt: new Date(),
    stats: {
      startTime: null,
      endTime: null,
      attempts: 0,
      hints: 0,
      score: 0,
    },
    features: {
      enableHints: true,
      enableTimer: true,
      enableLeaderboard: true,
      enableSocialShare: true,
    },
  };
}

/**
 * Calculate puzzle difficulty based on parameters
 */
export function calculatePuzzleDifficulty(parameters) {
  let score = 0;

  // Piece/pair count factor
  if (parameters.pieceCount || parameters.pairCount) {
    const count = parameters.pieceCount || parameters.pairCount;
    score += Math.ceil(count / 5);
  }

  // Time limit factor
  if (parameters.timeLimit) {
    score += parameters.timeLimit < 120 ? 2 : 1;
  }

  // Complexity factors
  if (parameters.rotationAllowed) score += 2;
  if (parameters.similarPieces) score += 2;
  if (parameters.multipleRules) score += 3;
  if (parameters.audioClues) score += 1;

  // Determine difficulty
  if (score <= 3) return 'Easy';
  if (score <= 6) return 'Medium';
  return 'Hard';
}

/**
 * Generate hint for puzzle
 */
export function generatePuzzleHint(puzzle, currentProgress) {
  const hints = {
    jigsaw: [
      'Look for edge pieces first - they only have one curved side',
      'Try grouping by color or pattern',
      'Start with distinctive areas',
      'Work on borders before filling in the middle',
    ],
    memory: [
      'Try to remember positions as you flip cards',
      'Look for patterns in placement',
      'Concentrate on positions you\'ve already seen',
      'Take your time, rushing leads to mistakes',
    ],
    pattern: [
      'Look at the differences between consecutive items',
      'Check if there\'s a mathematical relationship',
      'Try reversing the sequence',
      'Look for visual or positional patterns',
    ],
  };

  const puzzleType = puzzle.type || 'jigsaw';
  const availableHints = hints[puzzleType] || hints.jigsaw;
  const hintIndex = Math.min(
    Math.floor(currentProgress / 25),
    availableHints.length - 1
  );

  return availableHints[hintIndex];
}

/**
 * Calculate puzzle score based on completion stats
 */
export function calculatePuzzleScore(stats, maxScore = 100) {
  let score = maxScore;

  // Time-based deduction
  if (stats.timeSpent) {
    const timeMinutes = stats.timeSpent / 60;
    if (timeMinutes > 10) score -= Math.min(20, Math.ceil((timeMinutes - 10) * 2));
  }

  // Attempt-based deduction
  if (stats.attempts > 1) {
    score -= Math.min(15, (stats.attempts - 1) * 5);
  }

  // Hint-based deduction
  if (stats.hints > 0) {
    score -= Math.min(15, stats.hints * 5);
  }

  return Math.max(0, Math.ceil(score));
}

/**
 * Get achievement badges for puzzle completion
 */
export function getPuzzleAchievements(stats) {
  const achievements = [];

  // Speed achievements
  if (stats.timeSpent < 60) {
    achievements.push({
      id: 'speedster',
      name: 'Speedster',
      icon: '⚡',
      description: 'Completed in under 1 minute',
    });
  }

  // Perfect play
  if (stats.attempts === 1 && stats.hints === 0) {
    achievements.push({
      id: 'perfect',
      name: 'Perfect Play',
      icon: '✨',
      description: 'Completed without hints or retries',
    });
  }

  // Resilience
  if (stats.attempts >= 3) {
    achievements.push({
      id: 'resilient',
      name: 'Resilient',
      icon: '💪',
      description: 'Completed despite multiple attempts',
    });
  }

  return achievements;
}

/**
 * Optimize puzzle rendering with memoization
 */
export function memoizePuzzleComponent(Component) {
  return React.memo(Component, (prevProps, nextProps) => {
    // Only re-render if these props change
    const relevantKeys = ['puzzle', 'completed', 'onMove'];
    return relevantKeys.every(
      key => prevProps[key] === nextProps[key]
    );
  });
}

/**
 * Generate puzzle leaderboard data
 */
export function generatePuzzleLeaderboard(puzzleId, scores, limit = 10) {
  return scores
    .filter(s => s.puzzleId === puzzleId)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((score, index) => ({
      ...score,
      rank: index + 1,
      percentile: Math.round(((limit - index) / limit) * 100),
    }));
}

/**
 * Create puzzle session tracker
 */
export function createPuzzleSession(puzzleId, userId) {
  return {
    id: `session_${Date.now()}`,
    puzzleId,
    userId,
    startTime: new Date(),
    endTime: null,
    completed: false,
    score: 0,
    attempts: 0,
    hints: [],
    moves: [],
  };
}

/**
 * Track puzzle move/action
 */
export function recordPuzzleMove(session, moveData) {
  return {
    ...session,
    moves: [...(session.moves || []), {
      timestamp: new Date(),
      ...moveData,
    }],
    attempts: (session.attempts || 0) + 1,
  };
}

/**
 * Validate puzzle solution
 */
export function validatePuzzleSolution(puzzle, solution) {
  // Generic validation - can be extended for specific puzzle types
  if (!puzzle || !solution) return false;

  switch (puzzle.type) {
    case 'jigsaw':
      return validateJigsawSolution(puzzle, solution);
    case 'memory':
      return validateMemorySolution(puzzle, solution);
    case 'pattern':
      return validatePatternSolution(puzzle, solution);
    default:
      return solution.isComplete === true;
  }
}

function validateJigsawSolution(puzzle, solution) {
  // Check if all pieces are placed correctly
  return solution.pieces && solution.pieces.every(piece =>
    piece.x === piece.correctX &&
    piece.y === piece.correctY &&
    piece.rotation === piece.correctRotation
  );
}

function validateMemorySolution(puzzle, solution) {
  // Check if all pairs are matched
  return solution.matchedPairs && solution.matchedPairs.length === puzzle.pairCount;
}

function validatePatternSolution(puzzle, solution) {
  // Check if pattern is correctly identified
  return solution.patternRule && solution.nextElements &&
    solution.nextElements.every((elem, idx) =>
      elem === puzzle.expectedSequence[idx]
    );
}
