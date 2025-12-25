/**
 * AI Service - Personalization, recommendations, adaptive difficulty
 * Note: Requires OpenAI API key in environment variables
 */

import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

/**
 * Generate personalized learning path
 */
export async function generatePersonalizedPath(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();

    // Detect learning style
    const learningStyle = detectLearningStyle(userData);

    // Generate recommendations based on style
    const recommendations = await generateRecommendations(userData, learningStyle);

    return {
      learningStyle,
      recommendations,
      nextChallenges: recommendations.slice(0, 5),
    };
  } catch (error) {
    console.error('Error generating personalized path:', error);
    return null;
  }
}

/**
 * Detect user's learning style
 */
function detectLearningStyle(userData) {
  const { stats = {} } = userData;

  // Analyze activity patterns
  const quizzes = stats.quizzesCompleted || 0;
  const puzzles = stats.puzzlesSolved || 0;
  const challenges = stats.challengesCompleted || 0;

  // Determine dominant learning style
  if (quizzes > puzzles && quizzes > challenges) {
    return 'kinesthetic'; // Active learning
  } else if (puzzles > quizzes && puzzles > challenges) {
    return 'visual'; // Visual problem solving
  } else if (challenges > quizzes && challenges > puzzles) {
    return 'logical'; // Sequential/logical
  } else {
    return 'balanced'; // Balanced approach
  }
}

/**
 * Generate AI recommendations
 */
export async function generateRecommendations(userData, learningStyle) {
  try {
    // In production, this would call OpenAI API
    // For now, return rule-based recommendations

    const recommendations = [];

    if (learningStyle === 'visual') {
      recommendations.push({
        type: 'puzzle',
        category: 'Spatial Reasoning',
        reason: 'You excel at visual problems',
        difficulty: 'medium',
      });
      recommendations.push({
        type: 'visual-puzzle',
        category: 'Pattern Recognition',
        reason: 'Your learning style matches',
        difficulty: 'hard',
      });
    } else if (learningStyle === 'kinesthetic') {
      recommendations.push({
        type: 'quiz',
        category: 'Interactive Learning',
        reason: 'You prefer active engagement',
        difficulty: 'medium',
      });
      recommendations.push({
        type: 'daily-challenge',
        category: 'Timed Challenges',
        reason: 'Your strength area',
        difficulty: 'hard',
      });
    } else if (learningStyle === 'logical') {
      recommendations.push({
        type: 'puzzle',
        category: 'Logic Puzzles',
        reason: 'Sequential thinking is your strength',
        difficulty: 'hard',
      });
      recommendations.push({
        type: 'quiz',
        category: 'Advanced Topics',
        reason: 'Challenge yourself',
        difficulty: 'expert',
      });
    }

    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
}

/**
 * Adaptive difficulty adjustment
 */
export async function adjustDifficulty(userId, currentDifficulty, performance) {
  try {
    const userRef = doc(db, 'users', userId);

    // Calculate difficulty change based on performance
    let newDifficulty = currentDifficulty;
    const scorePercentage = (performance.correct / performance.total) * 100;

    if (scorePercentage >= 90) {
      // User is excelling, increase difficulty
      newDifficulty = increaseDifficulty(currentDifficulty);
    } else if (scorePercentage < 60) {
      // User is struggling, decrease difficulty
      newDifficulty = decreaseDifficulty(currentDifficulty);
    }

    await updateDoc(userRef, {
      currentDifficulty: newDifficulty,
      performanceHistory: {
        ...performance,
        timestamp: new Date(),
      },
    });

    return newDifficulty;
  } catch (error) {
    console.error('Error adjusting difficulty:', error);
    return currentDifficulty;
  }
}

/**
 * Generate AI hints
 */
export async function generateHint(questionData) {
  try {
    // In production, would call OpenAI API
    // For now, return contextual hint

    const { question, type, category } = questionData;

    return {
      hint: `Think about ${category.toLowerCase()} concepts related to this question`,
      type: 'conceptual',
      confidence: 0.85,
    };
  } catch (error) {
    console.error('Error generating hint:', error);
    return null;
  }
}

/**
 * Generate explanations
 */
export async function generateExplanation(questionData, answer) {
  try {
    // In production, would call OpenAI API

    return {
      explanation: `The answer to "${questionData.question}" is ${answer}. This relates to ${questionData.category} because...`,
      references: ['Related concept 1', 'Related concept 2'],
      relatedTopics: ['Topic A', 'Topic B'],
    };
  } catch (error) {
    console.error('Error generating explanation:', error);
    return null;
  }
}

/**
 * AI Mentor Chat
 */
export async function chatWithMentor(userId, message) {
  try {
    // In production, would call OpenAI API with conversation history

    // For now, return simple responses
    const responses = {
      'how am i doing': 'You are doing great! Keep it up.',
      'what should i study': 'Based on your progress, try visual puzzles next.',
      'give me a hint': 'Think about the core concept and how it applies here.',
      'explain this': 'This concept is important because...',
      default: 'I can help you with learning. Ask me anything!',
    };

    const lowerMessage = message.toLowerCase();
    const response = Object.keys(responses).find((key) =>
      lowerMessage.includes(key)
    );

    return {
      message: responses[response] || responses.default,
      timestamp: new Date(),
      helpful: null, // User can rate
    };
  } catch (error) {
    console.error('Error in mentor chat:', error);
    return null;
  }
}

/**
 * Predict next level
 */
export async function predictNextLevel(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();

    const currentXP = userData.totalXP || 0;
    const currentLevel = userData.currentLevel || 1;

    // Simple prediction based on current rate
    const dailyXPRate = await calculateDailyXPRate(userId);
    const xpNeededForNext = (currentLevel * 100);
    const daysToNextLevel = Math.ceil(xpNeededForNext / dailyXPRate);

    return {
      currentLevel,
      nextLevel: currentLevel + 1,
      currentXP,
      xpNeeded: xpNeededForNext,
      daysToNextLevel: Math.max(1, daysToNextLevel),
      estimatedDate: new Date(Date.now() + daysToNextLevel * 24 * 60 * 60 * 1000),
    };
  } catch (error) {
    console.error('Error predicting next level:', error);
    return null;
  }
}

/**
 * Helper functions
 */
function increaseDifficulty(current) {
  const levels = ['easy', 'medium', 'hard', 'expert'];
  const index = levels.indexOf(current);
  return levels[Math.min(index + 1, levels.length - 1)];
}

function decreaseDifficulty(current) {
  const levels = ['easy', 'medium', 'hard', 'expert'];
  const index = levels.indexOf(current);
  return levels[Math.max(index - 1, 0)];
}

async function calculateDailyXPRate(userId) {
  // In production, calculate from historical data
  return 50; // Default: 50 XP per day
}

export default {
  generatePersonalizedPath,
  generateRecommendations,
  adjustDifficulty,
  generateHint,
  generateExplanation,
  chatWithMentor,
  predictNextLevel,
};
