/**
 * Game Mode Service
 * 
 * Manages game mode variations:
 * - Mode configuration & rules
 * - Score calculation formulas
 * - Time management
 * - Game state for active sessions
 * 
 * Supported Modes:
 * - "timed" - Rapid-fire with time pressure
 * - "memory" - Repeating patterns
 * - "speed" - One strike and out
 * - "practice" - Learning with hints
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Game mode configurations
 * Define rules, timing, scoring for each mode
 */
const GAME_MODES = {
  timed: {
    id: 'timed',
    name: 'Timed Mode',
    description: 'Answer as fast as you can!',
    icon: '⏱️',
    timePerQuestion: 30000, // 30 seconds per question
    totalTimeLimit: null, // No total limit, per-question only
    showTimer: true,
    showScore: true,
    showHints: false,
    allowSkip: false,
    penalizeWrong: true,
    strikeRule: null,
    scoringFormula: 'timedScore', // base * (timeRemaining / timeLimit)
    features: ['timer', 'score', 'leaderboard'],
    difficulty: 'hard',
    xpMultiplier: 1.5,
    enabled: true,
    targetAudience: ['general', 'programmers']
  },

  memory: {
    id: 'memory',
    name: 'Memory Mode',
    description: 'Remember the pattern',
    icon: '🧠',
    timePerQuestion: 60000, // 60 seconds to think
    totalTimeLimit: null,
    showTimer: true,
    showScore: true,
    showHints: false,
    allowSkip: true,
    penalizeWrong: false,
    strikeRule: null,
    scoringFormula: 'memoryScore', // base * (2 / attempts)
    features: ['memory_tracking', 'pattern_recognition', 'leaderboard'],
    difficulty: 'medium',
    xpMultiplier: 1.2,
    enabled: true,
    targetAudience: ['kids', 'general']
  },

  speed: {
    id: 'speed',
    name: 'Speed Mode',
    description: 'One wrong answer and game over!',
    icon: '⚡',
    timePerQuestion: 20000, // 20 seconds per question
    totalTimeLimit: null,
    showTimer: true,
    showScore: true,
    showHints: false,
    allowSkip: false,
    penalizeWrong: true,
    strikeRule: 'one_strike', // One wrong = game over
    scoringFormula: 'speedScore', // questionCount * 100 + timeBonus
    features: ['lives', 'combo_counter', 'leaderboard'],
    difficulty: 'extreme',
    xpMultiplier: 2,
    enabled: true,
    targetAudience: ['general', 'programmers']
  },

  practice: {
    id: 'practice',
    name: 'Practice Mode',
    description: 'Learn at your own pace',
    icon: '📚',
    timePerQuestion: null, // Unlimited
    totalTimeLimit: null,
    showTimer: false,
    showScore: false,
    showHints: true,
    allowSkip: true,
    penalizeWrong: false,
    strikeRule: null,
    scoringFormula: 'practiceScore', // noScore, just learning
    features: ['explanations', 'unlimited_attempts', 'hints'],
    difficulty: 'easy',
    xpMultiplier: 0.5, // Less XP for practice
    enabled: true,
    targetAudience: ['kids', 'general', 'programmers']
  },

  challenge: {
    id: 'challenge',
    name: 'Challenge Mode',
    description: 'Test your mastery!',
    icon: '🏆',
    timePerQuestion: 45000, // 45 seconds per question
    totalTimeLimit: 600000, // 10 minute total limit
    showTimer: true,
    showScore: true,
    showHints: false,
    allowSkip: false,
    penalizeWrong: true,
    strikeRule: null,
    scoringFormula: 'challengeScore', // base * difficultyMultiplier
    features: ['timer', 'score', 'badges', 'leaderboard'],
    difficulty: 'hard',
    xpMultiplier: 1.8,
    enabled: true,
    targetAudience: ['general', 'programmers']
  }
};

/**
 * Get configuration for a game mode
 */
export function getGameModeConfig(modeId) {
  return GAME_MODES[modeId] || GAME_MODES.practice;
}

/**
 * Get all available modes
 */
export function getAllGameModes() {
  return Object.values(GAME_MODES).filter(mode => mode.enabled);
}

/**
 * Get modes for target audience
 */
export function getModesForAudience(audience = 'general') {
  return Object.values(GAME_MODES).filter(
    mode => mode.enabled && mode.targetAudience.includes(audience)
  );
}

/**
 * Calculate score based on mode rules
 * @param {Object} gameState - Current game state
 * @returns {number} - Calculated score
 */
export function calculateScore(gameState) {
  const { mode, answers, timeRemaining, timePerQuestion, difficulty = 'medium', questionsCount = 10 } = gameState;
  const config = getGameModeConfig(mode);

  let baseScore = calculateBaseScore(answers, difficulty);
  let finalScore = baseScore;

  // Apply mode-specific scoring formula
  if (config.scoringFormula === 'timedScore') {
    finalScore = scoreTimedMode(baseScore, timeRemaining, timePerQuestion);
  } else if (config.scoringFormula === 'memoryScore') {
    finalScore = scoreMemoryMode(baseScore, gameState.attempts);
  } else if (config.scoringFormula === 'speedScore') {
    finalScore = scoreSpeedMode(questionsCount, timeRemaining);
  } else if (config.scoringFormula === 'practiceScore') {
    finalScore = 0; // Practice mode doesn't award score
  } else if (config.scoringFormula === 'challengeScore') {
    finalScore = scoreChallengeMode(baseScore, difficulty);
  }

  return Math.round(finalScore * config.xpMultiplier);
}

/**
 * Calculate base score from answers
 * @param {Array} answers - User's answers
 * @param {string} difficulty - Difficulty level
 * @returns {number}
 */
function calculateBaseScore(answers = [], difficulty = 'medium') {
  if (!answers || answers.length === 0) return 0;

  const correct = answers.filter(a => a.correct).length;
  const total = answers.length;
  const percentage = (correct / total) * 100;

  // Difficulty multiplier
  const difficultyMultipliers = {
    easy: 1,
    medium: 1.2,
    hard: 1.5,
    extreme: 2
  };

  const multiplier = difficultyMultipliers[difficulty] || 1.2;
  const basePercentageScore = percentage * multiplier;

  return Math.round(basePercentageScore);
}

/**
 * Score for timed mode
 * Rewards speed: baseScore * (timeRemaining / timeLimit)
 */
function scoreTimedMode(baseScore, timeRemaining, timePerQuestion) {
  if (timeRemaining <= 0) return Math.round(baseScore * 0.5);
  
  const timeBonus = (timeRemaining / timePerQuestion) * 0.3; // 30% bonus max
  return Math.round(baseScore * (1 + timeBonus));
}

/**
 * Score for memory mode
 * Rewards fewer attempts: baseScore * (2 / attempts)
 */
function scoreMemoryMode(baseScore, attempts = 1) {
  const attemptPenalty = Math.min(2 / Math.max(1, attempts), 2);
  return Math.round(baseScore * attemptPenalty);
}

/**
 * Score for speed mode
 * Rewards combo: correctCount * 100 + timeBonus
 */
function scoreSpeedMode(correctCount, timeRemaining) {
  const comboBonus = correctCount * 100;
  const timeBonus = Math.max(0, timeRemaining / 1000); // Bonus in seconds
  return Math.round(comboBonus + timeBonus);
}

/**
 * Score for challenge mode
 * Standard score with difficulty multiplier
 */
function scoreChallengeMode(baseScore, difficulty) {
  const multipliers = {
    easy: 0.8,
    medium: 1,
    hard: 1.5,
    extreme: 2
  };
  return Math.round(baseScore * (multipliers[difficulty] || 1));
}

/**
 * Check if game should end
 * Returns reason if game should end, null otherwise
 */
export function shouldEndGame(gameState) {
  const { mode, timeRemaining, strikeCount, totalQuestions, answeredCount } = gameState;
  const config = getGameModeConfig(mode);

  // Time limit exceeded (total game time)
  if (config.totalTimeLimit && timeRemaining <= 0) {
    return { shouldEnd: true, reason: 'time_up' };
  }

  // Speed mode: one strike rule
  if (config.strikeRule === 'one_strike' && strikeCount >= 1) {
    return { shouldEnd: true, reason: 'strike_out' };
  }

  // All questions answered
  if (totalQuestions && answeredCount >= totalQuestions) {
    return { shouldEnd: true, reason: 'completed' };
  }

  // Time per question exceeded (only check if timer should work)
  if (config.showTimer && config.timePerQuestion && timeRemaining <= 0) {
    return { shouldEnd: true, reason: 'time_per_question_up' };
  }

  return { shouldEnd: false, reason: null };
}

/**
 * Get next question based on mode rules
 */
export function getNextQuestion(gameState, allQuestions) {
  const { mode, currentIndex, answeredQuestions = [] } = gameState;
  const config = getGameModeConfig(mode);

  if (currentIndex + 1 >= allQuestions.length) {
    return null; // No more questions
  }

  // For speed mode: find first non-answered question
  if (config.strikeRule === 'one_strike') {
    for (let i = currentIndex + 1; i < allQuestions.length; i++) {
      if (!answeredQuestions.includes(i)) {
        return { question: allQuestions[i], index: i };
      }
    }
  }

  // Standard progression
  const nextIndex = currentIndex + 1;
  return { question: allQuestions[nextIndex], index: nextIndex };
}

/**
 * Get game mode rules summary
 * For display in UI
 */
export function getGameModeSummary(modeId) {
  const config = getGameModeConfig(modeId);

  return {
    name: config.name,
    description: config.description,
    icon: config.icon,
    difficulty: config.difficulty,
    rules: [
      config.showTimer && `⏱️ ${config.timePerQuestion ? (config.timePerQuestion / 1000) + 's per question' : 'Unlimited time'}`,
      config.strikeRule === 'one_strike' && '⚡ One wrong answer = game over',
      config.showHints && '💡 Hints available',
      config.allowSkip && '⏭️ Can skip questions'
    ].filter(Boolean)
  };
}

/**
 * Get time display for mode
 */
export function getTimeDisplayFormat(mode) {
  const config = getGameModeConfig(mode);

  if (!config.showTimer) return null;

  return {
    timePerQuestion: config.timePerQuestion,
    totalTimeLimit: config.totalTimeLimit,
    format: config.totalTimeLimit ? 'total' : 'per_question'
  };
}

/**
 * Initialize game session state
 */
export function initializeGameSession(mode, contentId, difficulty = 'medium') {
  const config = getGameModeConfig(mode);

  return {
    sessionId: generateSessionId(),
    mode,
    contentId,
    difficulty,
    startTime: new Date(),
    startedAt: Timestamp.now(),
    endedAt: null,
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    completed: false,
    strikeCount: 0,
    correctCount: 0,
    timedOutQuestions: [],
    hints: {
      used: 0,
      available: config.allowSkip ? 3 : 0
    },
    totalTimeRemaining: config.totalTimeLimit
  };
}

/**
 * Record answer in session
 */
export function recordAnswer(gameSession, questionIndex, answer, isCorrect, timeSpent) {
  gameSession.answers.push({
    questionIndex,
    answer,
    correct: isCorrect,
    timeSpent
  });

  if (isCorrect) {
    gameSession.correctCount++;
  } else {
    gameSession.strikeCount++;
  }

  return gameSession;
}

/**
 * Finalize game session
 */
export function finalizeGameSession(gameSession, finalScore, metadata = {}) {
  gameSession.endedAt = new Date();
  gameSession.endTime = Timestamp.now();
  gameSession.score = finalScore;
  gameSession.completed = true;
  gameSession.accuracy = 
    gameSession.answers.length > 0 
      ? Math.round((gameSession.correctCount / gameSession.answers.length) * 100)
      : 0;
  gameSession.metadata = metadata;

  return gameSession;
}

/**
 * Get leaderboard bonus
 * Some modes contribute to leaderboard, some don't
 */
export function shouldContributeToLeaderboard(mode) {
  const config = getGameModeConfig(mode);
  return config.features.includes('leaderboard');
}

/**
 * Helper: Generate unique session ID
 */
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Helper: Get difficulty multiplier for scoring
 */
export function getDifficultyMultiplier(difficulty) {
  const multipliers = {
    easy: 1,
    medium: 1.2,
    hard: 1.5,
    extreme: 2
  };
  return multipliers[difficulty] || 1.2;
}

/**
 * Helper: Validate game state
 */
export function isGameStateValid(gameState) {
  return (
    gameState &&
    gameState.sessionId &&
    gameState.mode &&
    gameState.contentId &&
    GAME_MODES[gameState.mode]
  );
}

/**
 * Get mode-specific UI hints for frontend
 */
export function getModeUIConfig(mode) {
  const config = getGameModeConfig(mode);

  return {
    showProgressBar: true,
    showScore: config.showScore,
    showTimer: config.showTimer,
    timerColor: config.difficulty === 'extreme' ? 'red' : 'orange',
    showCombo: config.id === 'speed',
    showLives: config.id === 'speed',
    allowSkip: config.allowSkip,
    showHints: config.showHints,
    backgroundColor: getModeBackground(mode),
    accentColor: getModeAccent(mode)
  };
}

/**
 * Get mode-specific theme colors
 */
function getModeBackground(mode) {
  const backgrounds = {
    timed: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    memory: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    speed: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    practice: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    challenge: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  };
  return backgrounds[mode] || backgrounds.practice;
}

/**
 * Get mode-specific accent color
 */
function getModeAccent(mode) {
  const accents = {
    timed: '#667eea',
    memory: '#f093fb',
    speed: '#fa709a',
    practice: '#4facfe',
    challenge: '#43e97b'
  };
  return accents[mode] || '#667eea';
}
