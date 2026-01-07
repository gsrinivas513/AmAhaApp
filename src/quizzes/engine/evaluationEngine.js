/**
 * Universal Quiz Evaluation Engine
 * Evaluates all quiz types using unified logic
 */

export const EVALUATION_TYPES = {
  EXACT: "exact",
  FUZZY: "fuzzy",
  PARTIAL: "partial",
  SEQUENCE: "sequence",
  TEST_CASES: "test_cases",
  COORDINATE_MATCH: "coordinate_match",
};

/**
 * Calculate Levenshtein distance for fuzzy matching
 */
const levenshteinDistance = (str1, str2) => {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(0));

  for (let i = 0; i <= str1.length; i++) track[0][i] = i;
  for (let j = 0; j <= str2.length; j++) track[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }

  return track[str2.length][str1.length];
};

/**
 * Calculate similarity score (0-1) between two strings
 */
const calculateSimilarity = (str1, str2) => {
  const distance = levenshteinDistance(str1, str2);
  const maxLen = Math.max(str1.length, str2.length);
  return 1 - distance / maxLen;
};

/**
 * Exact match evaluation
 * Used for: MCQ, TRUE_FALSE
 */
const evaluateExactMatch = (userAnswer, correctAnswer) => {
  const isCorrect = userAnswer === correctAnswer;
  return {
    isCorrect,
    score: isCorrect ? 100 : 0,
    feedback: isCorrect ? "Correct!" : "Incorrect answer",
  };
};

/**
 * Fuzzy match evaluation
 * Used for: FILL_BLANK
 */
const evaluateFuzzyMatch = (userAnswer, correctAnswers, threshold = 0.85) => {
  if (!userAnswer || !correctAnswers || correctAnswers.length === 0) {
    return { isCorrect: false, score: 0, feedback: "Please provide an answer" };
  }

  const normalizedUser = userAnswer.toLowerCase().trim();
  let bestScore = 0;
  let matched = false;

  for (const correctAnswer of correctAnswers) {
    const normalizedCorrect = correctAnswer.toLowerCase().trim();

    // Exact match
    if (normalizedUser === normalizedCorrect) {
      return {
        isCorrect: true,
        score: 100,
        feedback: "Correct!",
      };
    }

    // Fuzzy match
    const similarity = calculateSimilarity(normalizedUser, normalizedCorrect);
    if (similarity > bestScore) {
      bestScore = similarity;
      if (similarity >= threshold) {
        matched = true;
      }
    }
  }

  return {
    isCorrect: matched,
    score: matched ? Math.round(bestScore * 100) : 0,
    feedback: matched
      ? "Good enough!"
      : `Close but not quite. Score: ${Math.round(bestScore * 100)}%`,
  };
};

/**
 * Partial credit evaluation
 * Used for: MULTI_SELECT
 */
const evaluatePartialCredit = (
  userAnswers,
  correctAnswers,
  options,
  minCorrect = 1
) => {
  if (
    !userAnswers ||
    !Array.isArray(userAnswers) ||
    userAnswers.length === 0
  ) {
    return {
      isCorrect: false,
      score: 0,
      feedback: "Please select at least one answer",
    };
  }

  const correctSet = new Set(correctAnswers || []);
  const userSet = new Set(userAnswers);

  // Count correct selections
  let correctCount = 0;
  let incorrectCount = 0;

  for (const answer of userSet) {
    if (correctSet.has(answer)) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  }

  // Count missed correct answers
  let missedCount = 0;
  for (const answer of correctSet) {
    if (!userSet.has(answer)) {
      missedCount++;
    }
  }

  const isFullyCorrect = correctCount === correctSet.size && incorrectCount === 0;
  const isPartiallyCorrect =
    correctCount >= minCorrect && incorrectCount === 0;

  let score = 0;
  if (isFullyCorrect) {
    score = 100;
  } else if (isPartiallyCorrect) {
    score = Math.round((correctCount / correctSet.size) * 100);
  }

  return {
    isCorrect: isFullyCorrect,
    isPartiallyCorrect: isPartiallyCorrect && !isFullyCorrect,
    score,
    correctCount,
    incorrectCount,
    missedCount,
    feedback: isFullyCorrect
      ? "Perfect!"
      : isPartiallyCorrect
        ? `Partially correct: ${correctCount}/${correctSet.size}`
        : "Incorrect selection",
  };
};

/**
 * Sequence/Order evaluation
 * Used for: ORDERING, PUZZLE
 */
const evaluateSequence = (userSequence, correctSequence, tolerance = 0) => {
  if (!userSequence || !Array.isArray(userSequence)) {
    return { isCorrect: false, score: 0, feedback: "Please arrange items" };
  }

  if (JSON.stringify(userSequence) === JSON.stringify(correctSequence)) {
    return {
      isCorrect: true,
      score: 100,
      feedback: "Perfect order!",
    };
  }

  // Calculate how many items are in correct position
  let correctPositions = 0;
  for (let i = 0; i < Math.min(userSequence.length, correctSequence.length); i++) {
    if (userSequence[i] === correctSequence[i]) {
      correctPositions++;
    }
  }

  const score = Math.round(
    (correctPositions / correctSequence.length) * 100
  );

  return {
    isCorrect: false,
    score,
    correctPositions,
    totalPositions: correctSequence.length,
    feedback: `${correctPositions}/${correctSequence.length} items in correct position`,
  };
};

/**
 * Pair matching evaluation
 * Used for: MATCHING
 */
const evaluatePairMatching = (userPairs, correctPairs) => {
  if (!userPairs || !Array.isArray(userPairs)) {
    return { isCorrect: false, score: 0, feedback: "Please match all pairs" };
  }

  const correctSet = new Set(correctPairs.map((p) => `${p.left}:${p.right}`));
  const userSet = new Set(userPairs.map((p) => `${p.left}:${p.right}`));

  let correctMatches = 0;
  for (const pair of userSet) {
    if (correctSet.has(pair)) {
      correctMatches++;
    }
  }

  const isFullyCorrect = correctMatches === correctPairs.length;
  const score = Math.round((correctMatches / correctPairs.length) * 100);

  return {
    isCorrect: isFullyCorrect,
    score,
    correctMatches,
    totalMatches: correctPairs.length,
    feedback: isFullyCorrect
      ? "All pairs matched correctly!"
      : `${correctMatches}/${correctPairs.length} pairs correct`,
  };
};

/**
 * Coordinate-based evaluation
 * Used for: IMAGE_BASED
 */
const evaluateCoordinateMatch = (userRegion, correctRegion, tolerance = 10) => {
  if (!userRegion || !correctRegion) {
    return { isCorrect: false, score: 0, feedback: "Please select a region" };
  }

  const dx = Math.abs(userRegion.x - correctRegion.x);
  const dy = Math.abs(userRegion.y - correctRegion.y);
  const dw = Math.abs(userRegion.width - correctRegion.width);
  const dh = Math.abs(userRegion.height - correctRegion.height);

  const totalDeviation = dx + dy + dw + dh;
  const maxTolerance = tolerance * 4;

  if (totalDeviation <= tolerance) {
    return {
      isCorrect: true,
      score: 100,
      feedback: "Perfect selection!",
    };
  }

  const score = Math.max(
    0,
    Math.round(((maxTolerance - totalDeviation) / maxTolerance) * 100)
  );

  return {
    isCorrect: score >= 80,
    score,
    deviation: totalDeviation,
    feedback: score >= 80 ? "Close enough!" : "Try to be more accurate",
  };
};

/**
 * Category/Drag-drop evaluation
 * Used for: DRAG_DROP
 */
const evaluateCategoryMatch = (userCategories, correctCategories) => {
  if (!userCategories || !Array.isArray(userCategories)) {
    return {
      isCorrect: false,
      score: 0,
      feedback: "Please categorize all items",
    };
  }

  let correctCategorizations = 0;
  let totalCategorizations = 0;

  // Count correct placements
  const correctMap = {};
  correctCategories.forEach((cat) => {
    cat.items.forEach((item) => {
      correctMap[item] = cat.id;
      totalCategorizations++;
    });
  });

  userCategories.forEach((cat) => {
    cat.items.forEach((item) => {
      if (correctMap[item] === cat.id) {
        correctCategorizations++;
      }
    });
  });

  const score = Math.round(
    (correctCategorizations / totalCategorizations) * 100
  );
  const isFullyCorrect = score === 100;

  return {
    isCorrect: isFullyCorrect,
    score,
    correctCategorizations,
    totalCategorizations,
    feedback: isFullyCorrect
      ? "All items categorized correctly!"
      : `${correctCategorizations}/${totalCategorizations} items correct`,
  };
};

/**
 * Test case evaluation (simplified)
 * Used for: CODING
 * Note: Full implementation requires code execution sandbox
 */
const evaluateTestCases = (userCode, testCases) => {
  if (!userCode || !testCases || testCases.length === 0) {
    return {
      isCorrect: false,
      score: 0,
      feedback: "Please submit code",
      passedTests: 0,
    };
  }

  // This is a simplified version. In production:
  // 1. Validate code syntax
  // 2. Execute in sandbox
  // 3. Compare output with expected
  // 4. Return pass/fail for each test case

  return {
    isCorrect: false,
    score: 0,
    feedback: "Code evaluation requires sandbox environment",
    passedTests: 0,
    totalTests: testCases.length,
  };
};

/**
 * Universal Evaluator Function
 * Single entry point for all quiz types
 */
export const evaluateQuizAnswer = (question, userAnswer) => {
  if (!question || !question.answer || !userAnswer) {
    return {
      isCorrect: false,
      score: 0,
      feedback: "Invalid input",
    };
  }

  const evaluationType = question.answer.evaluationType;

  try {
    let result;

    switch (evaluationType) {
      case EVALUATION_TYPES.EXACT:
        result = evaluateExactMatch(userAnswer.selectedOption, question.answer.correctOption);
        break;

      case EVALUATION_TYPES.FUZZY:
        result = evaluateFuzzyMatch(
          userAnswer.text,
          question.answer.correctAnswers,
          question.answer.fuzzyThreshold
        );
        break;

      case EVALUATION_TYPES.PARTIAL:
        result = evaluatePartialCredit(
          userAnswer.selectedOptions,
          question.answer.correctOptions,
          question.answer.options,
          question.answer.minCorrect
        );
        break;

      case EVALUATION_TYPES.SEQUENCE:
        result = evaluateSequence(
          userAnswer.sequence,
          question.answer.correctSequence
        );
        break;

      case EVALUATION_TYPES.COORDINATE_MATCH:
        result = evaluateCoordinateMatch(
          userAnswer.region,
          question.answer.region,
          question.answer.region?.tolerance
        );
        break;

      case "exact_pair": // Matching pairs
        result = evaluatePairMatching(
          userAnswer.pairs,
          question.answer.pairs
        );
        break;

      case "category": // Drag and drop
        result = evaluateCategoryMatch(
          userAnswer.categories,
          question.answer.categories
        );
        break;

      case EVALUATION_TYPES.TEST_CASES:
        result = evaluateTestCases(
          userAnswer.code,
          question.answer.testCases
        );
        break;

      default:
        result = { isCorrect: false, score: 0, feedback: "Unknown evaluation type" };
    }

    // Calculate actual points
    const maxPoints = question.points || 10;
    const earnedPoints = Math.round((result.score / 100) * maxPoints);

    return {
      ...result,
      maxPoints,
      earnedPoints,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      isCorrect: false,
      score: 0,
      feedback: `Evaluation error: ${error.message}`,
      error: true,
    };
  }
};

/**
 * Batch evaluate multiple answers
 */
export const evaluateQuizSession = (questions, userAnswers) => {
  if (!questions || !Array.isArray(questions)) {
    return { error: "Invalid questions" };
  }

  let totalPoints = 0;
  let earnedPoints = 0;
  const results = [];

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const userAnswer = userAnswers[i];

    const evaluation = evaluateQuizAnswer(question, userAnswer);
    results.push({
      questionId: question.id,
      ...evaluation,
    });

    totalPoints += evaluation.maxPoints;
    earnedPoints += evaluation.earnedPoints;
  }

  const finalScore = Math.round((earnedPoints / totalPoints) * 100);

  return {
    results,
    totalPoints,
    earnedPoints,
    finalScore,
    timestamp: new Date().toISOString(),
  };
};
