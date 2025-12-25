/**
 * Puzzle Validation Engine
 * Unified validation layer for all puzzle types
 * Provides consistent error handling and scoring across puzzle types
 * 
 * @module services/puzzleValidationService
 */

/**
 * Validation tolerance and thresholds
 */
const VALIDATION_TOLERANCES = {
  jigsaw: {
    positionTolerance: 15, // pixels
    minAccuracy: 80, // percentage
  },
  spotDifference: {
    positionTolerance: 20, // pixels
    minAccuracy: 70,
  },
  matchingPairs: {
    minAccuracy: 80,
  },
  ordering: {
    minAccuracy: 80,
  },
  wordSearch: {
    minAccuracy: 80,
  },
  dragDrop: {
    positionTolerance: 15,
    minAccuracy: 80,
  },
};

/**
 * Puzzle Validation Engine
 * Centralized validation for all puzzle types
 */
export class PuzzleValidationEngine {
  /**
   * Validate jigsaw puzzle solution
   * @param {Array<{pieceId: number, position: {x, y}}>} solution - User's piece placement
   * @param {Array<{id: number, correctPosition: {x, y}}>} answer - Correct positions
   * @returns {object} Validation result with accuracy and feedback
   */
  static validateJigsaw(solution, answer) {
    if (!Array.isArray(solution) || !Array.isArray(answer)) {
      return this.createInvalidResult('jigsaw', 'Invalid input format');
    }

    const tolerance = VALIDATION_TOLERANCES.jigsaw.positionTolerance;
    let correctPieces = 0;
    const matchDetails = [];

    for (const piece of solution) {
      const correct = answer.find(a => a.id === piece.pieceId);
      
      if (!correct) {
        matchDetails.push({
          pieceId: piece.pieceId,
          matched: false,
          reason: 'piece_not_found'
        });
        continue;
      }

      const dx = Math.abs(piece.position.x - correct.correctPosition.x);
      const dy = Math.abs(piece.position.y - correct.correctPosition.y);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < tolerance) {
        correctPieces++;
        matchDetails.push({
          pieceId: piece.pieceId,
          matched: true,
          distance
        });
      } else {
        matchDetails.push({
          pieceId: piece.pieceId,
          matched: false,
          distance,
          reason: 'position_incorrect'
        });
      }
    }

    const accuracy = (correctPieces / answer.length) * 100;
    const minAccuracy = VALIDATION_TOLERANCES.jigsaw.minAccuracy;

    return {
      valid: accuracy >= minAccuracy,
      type: 'jigsaw',
      accuracy: Math.round(accuracy),
      correctPieces,
      totalPieces: answer.length,
      feedback: this.generateJigsawFeedback(accuracy, minAccuracy),
      details: matchDetails,
      score: Math.round(accuracy),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Validate spot-the-difference solution
   * @param {Array<{x, y}>} userSpots - Points marked by user
   * @param {Array<{x, y}>} correctSpots - Correct difference locations
   * @returns {object} Validation result
   */
  static validateSpotDifference(userSpots, correctSpots) {
    if (!Array.isArray(userSpots) || !Array.isArray(correctSpots)) {
      return this.createInvalidResult('spotDifference', 'Invalid input format');
    }

    const tolerance = VALIDATION_TOLERANCES.spotDifference.positionTolerance;
    let correctCount = 0;
    const foundSpots = [];

    for (const userSpot of userSpots) {
      const found = correctSpots.find(correct => {
        const dx = Math.abs(userSpot.x - correct.x);
        const dy = Math.abs(userSpot.y - correct.y);
        return Math.sqrt(dx * dx + dy * dy) < tolerance;
      });

      if (found) {
        correctCount++;
        foundSpots.push({
          userSpot,
          found: true,
          correct: found
        });
      } else {
        foundSpots.push({
          userSpot,
          found: false,
          correct: null,
          reason: 'not_a_difference'
        });
      }
    }

    const accuracy = (correctCount / correctSpots.length) * 100;
    const minAccuracy = VALIDATION_TOLERANCES.spotDifference.minAccuracy;

    return {
      valid: accuracy >= minAccuracy,
      type: 'spotDifference',
      accuracy: Math.round(accuracy),
      found: correctCount,
      total: correctSpots.length,
      missed: correctSpots.length - correctCount,
      feedback: this.generateSpotDifferenceFeedback(correctCount, correctSpots.length),
      details: foundSpots,
      score: Math.round(accuracy),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Validate matching pairs solution
   * @param {Array<{leftId, rightId}>} matches - Matched pairs
   * @param {Array<{leftId, rightId}>} correctMatches - Correct pairs
   * @returns {object} Validation result
   */
  static validateMatchingPairs(matches, correctMatches) {
    if (!Array.isArray(matches) || !Array.isArray(correctMatches)) {
      return this.createInvalidResult('matchingPairs', 'Invalid input format');
    }

    let correctCount = 0;
    const matchDetails = [];

    for (const match of matches) {
      const isCorrect = correctMatches.some(
        correct =>
          correct.leftId === match.leftId && correct.rightId === match.rightId
      );

      if (isCorrect) {
        correctCount++;
        matchDetails.push({
          match,
          correct: true
        });
      } else {
        matchDetails.push({
          match,
          correct: false,
          reason: 'pair_mismatch'
        });
      }
    }

    const accuracy = (correctCount / correctMatches.length) * 100;
    const minAccuracy = VALIDATION_TOLERANCES.matchingPairs.minAccuracy;

    return {
      valid: accuracy >= minAccuracy,
      type: 'matchingPairs',
      accuracy: Math.round(accuracy),
      matched: correctCount,
      total: correctMatches.length,
      mismatched: correctMatches.length - correctCount,
      feedback: this.generateMatchingPairsFeedback(correctCount, correctMatches.length),
      details: matchDetails,
      score: Math.round(accuracy),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Validate ordering puzzle solution
   * @param {Array<number>} userOrder - User's ordering
   * @param {Array<number>} correctOrder - Correct order
   * @returns {object} Validation result
   */
  static validateOrdering(userOrder, correctOrder) {
    if (!Array.isArray(userOrder) || !Array.isArray(correctOrder)) {
      return this.createInvalidResult('ordering', 'Invalid input format');
    }

    if (userOrder.length !== correctOrder.length) {
      return this.createInvalidResult(
        'ordering',
        'User order length does not match correct order'
      );
    }

    let correctPositions = 0;
    const positionDetails = [];

    for (let i = 0; i < userOrder.length; i++) {
      const isCorrect = userOrder[i] === correctOrder[i];
      if (isCorrect) correctPositions++;

      positionDetails.push({
        position: i,
        userValue: userOrder[i],
        correctValue: correctOrder[i],
        correct: isCorrect
      });
    }

    const accuracy = (correctPositions / correctOrder.length) * 100;
    const minAccuracy = VALIDATION_TOLERANCES.ordering.minAccuracy;

    return {
      valid: accuracy >= minAccuracy,
      type: 'ordering',
      accuracy: Math.round(accuracy),
      correctPositions,
      total: correctOrder.length,
      feedback: this.generateOrderingFeedback(correctPositions, correctOrder.length),
      details: positionDetails,
      score: Math.round(accuracy),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Validate word search solution
   * @param {Array<{word, positions: Array<{x, y, direction}>}>} foundWords - Found words
   * @param {Array<string>} targetWords - Target words to find
   * @returns {object} Validation result
   */
  static validateWordSearch(foundWords, targetWords) {
    if (!Array.isArray(foundWords) || !Array.isArray(targetWords)) {
      return this.createInvalidResult('wordSearch', 'Invalid input format');
    }

    const foundWordTexts = foundWords
      .map(w => (typeof w === 'string' ? w : w.word).toLowerCase())
      .filter(w => w);
    const targetWordTexts = targetWords.map(w => w.toLowerCase());

    let matched = 0;
    const matchDetails = [];

    for (const targetWord of targetWordTexts) {
      const found = foundWordTexts.includes(targetWord);
      if (found) matched++;

      matchDetails.push({
        word: targetWord,
        found,
        foundCount: foundWordTexts.filter(w => w === targetWord).length
      });
    }

    const accuracy = (matched / targetWords.length) * 100;
    const minAccuracy = VALIDATION_TOLERANCES.wordSearch.minAccuracy;

    return {
      valid: accuracy >= minAccuracy,
      type: 'wordSearch',
      accuracy: Math.round(accuracy),
      found: matched,
      total: targetWords.length,
      feedback: this.generateWordSearchFeedback(matched, targetWords.length),
      details: matchDetails,
      score: Math.round(accuracy),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Validate drag-and-drop solution
   * @param {Array<{itemId, targetId, position: {x, y}}>} placement - Item placements
   * @param {Array<{itemId, targetId, position: {x, y}}>} correctPlacement - Correct placements
   * @returns {object} Validation result
   */
  static validateDragDrop(placement, correctPlacement) {
    if (!Array.isArray(placement) || !Array.isArray(correctPlacement)) {
      return this.createInvalidResult('dragDrop', 'Invalid input format');
    }

    const tolerance = VALIDATION_TOLERANCES.dragDrop.positionTolerance;
    let correctCount = 0;
    const placementDetails = [];

    for (const item of placement) {
      const correct = correctPlacement.find(c => c.itemId === item.itemId);

      if (!correct) {
        placementDetails.push({
          itemId: item.itemId,
          correct: false,
          reason: 'item_not_found'
        });
        continue;
      }

      const targetCorrect = item.targetId === correct.targetId;
      const positionCorrect = this.positionWithinTolerance(
        item.position,
        correct.position,
        tolerance
      );

      const isCorrect = targetCorrect && positionCorrect;
      if (isCorrect) correctCount++;

      placementDetails.push({
        itemId: item.itemId,
        targetIdCorrect: targetCorrect,
        positionCorrect,
        correct: isCorrect
      });
    }

    const accuracy = (correctCount / correctPlacement.length) * 100;
    const minAccuracy = VALIDATION_TOLERANCES.dragDrop.minAccuracy;

    return {
      valid: accuracy >= minAccuracy,
      type: 'dragDrop',
      accuracy: Math.round(accuracy),
      correct: correctCount,
      total: correctPlacement.length,
      feedback: this.generateDragDropFeedback(correctCount, correctPlacement.length),
      details: placementDetails,
      score: Math.round(accuracy),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Universal validation method (dispatches to correct validator)
   * @param {string} puzzleType - Type of puzzle
   * @param {*} solution - User's solution
   * @param {*} answer - Correct answer
   * @returns {object} Validation result
   */
  static validate(puzzleType, solution, answer) {
    const validators = {
      jigsaw: this.validateJigsaw,
      spotDifference: this.validateSpotDifference,
      matchingPairs: this.validateMatchingPairs,
      ordering: this.validateOrdering,
      wordSearch: this.validateWordSearch,
      dragDrop: this.validateDragDrop
    };

    const validator = validators[puzzleType];
    if (!validator) {
      return this.createInvalidResult(puzzleType, `Unknown puzzle type: ${puzzleType}`);
    }

    try {
      return validator.call(this, solution, answer);
    } catch (e) {
      return this.createInvalidResult(
        puzzleType,
        `Validation error: ${e.message}`
      );
    }
  }

  /**
   * Check if position is within tolerance
   * @private
   */
  static positionWithinTolerance(pos1, pos2, tolerance) {
    if (!pos1 || !pos2) return false;
    const dx = Math.abs(pos1.x - pos2.x);
    const dy = Math.abs(pos1.y - pos2.y);
    return Math.sqrt(dx * dx + dy * dy) < tolerance;
  }

  /**
   * Create invalid result
   * @private
   */
  static createInvalidResult(type, error) {
    return {
      valid: false,
      type,
      error,
      accuracy: 0,
      score: 0,
      feedback: `Error: ${error}`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate feedback messages
   * @private
   */
  static generateJigsawFeedback(accuracy, minAccuracy) {
    if (accuracy >= 95) return 'Perfect! All pieces placed correctly! 🎉';
    if (accuracy >= minAccuracy) return `Great job! ${Math.round(accuracy)}% correct!`;
    return `Keep trying! You got ${Math.round(accuracy)}% correct. ${minAccuracy}% needed to pass.`;
  }

  static generateSpotDifferenceFeedback(found, total) {
    if (found === total) return `Excellent! Found all ${total} differences! 🎉`;
    if (found >= total * 0.7) return `Good job! Found ${found}/${total} differences.`;
    return `Keep looking! Found ${found}/${total} differences.`;
  }

  static generateMatchingPairsFeedback(matched, total) {
    if (matched === total) return `Perfect! All pairs matched correctly! 🎉`;
    if (matched >= total * 0.8) return `Great! Matched ${matched}/${total} pairs.`;
    return `Almost there! Matched ${matched}/${total} pairs.`;
  }

  static generateOrderingFeedback(correct, total) {
    if (correct === total) return `Perfect ordering! 🎉`;
    if (correct >= total * 0.8) return `Good sequence! ${correct}/${total} in correct order.`;
    return `Keep trying! ${correct}/${total} items in correct order.`;
  }

  static generateWordSearchFeedback(found, total) {
    if (found === total) return `Found all words! 🎉`;
    if (found >= total * 0.8) return `Great search! Found ${found}/${total} words.`;
    return `Keep searching! Found ${found}/${total} words.`;
  }

  static generateDragDropFeedback(correct, total) {
    if (correct === total) return `Perfect placement! 🎉`;
    if (correct >= total * 0.8) return `Good placement! ${correct}/${total} correct.`;
    return `Getting closer! ${correct}/${total} correctly placed.`;
  }
}

export default {
  PuzzleValidationEngine,
  VALIDATION_TOLERANCES
};
