/**
 * API to setup test quizzes for Phase 1 testing
 * This connects to the backend to run the setupTestQuizzes.mjs script
 */

import { db } from '../../firebase/firebaseConfig';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';

/**
 * Test quiz templates with all 8 question types
 */
const TEST_QUIZZES = [
  {
    id: 'test-mc-001',
    title: 'Test Multiple Choice',
    description: 'Testing multiple choice question type',
    category: 'testing',
    difficulty: 'easy',
    questions: [
      {
        type: 'multiple-choice',
        question: 'What is 2 + 2?',
        options: ['2', '3', '4', '5'],
        correctAnswer: 2,
        explanation: '2 + 2 equals 4',
      },
      {
        type: 'multiple-choice',
        question: 'What is the capital of France?',
        options: ['London', 'Paris', 'Berlin', 'Madrid'],
        correctAnswer: 1,
        explanation: 'Paris is the capital of France',
      },
    ],
    levelVariants: {
      easy: {
        title: 'Test Multiple Choice - Easy',
        questions: [
          {
            type: 'multiple-choice',
            question: 'What is 2 + 2?',
            options: ['2', '3', '4', '5'],
            correctAnswer: 2,
            explanation: '2 + 2 equals 4',
          },
        ],
      },
      medium: {
        title: 'Test Multiple Choice - Medium',
        questions: [
          {
            type: 'multiple-choice',
            question: 'What is the capital of France?',
            options: ['London', 'Paris', 'Berlin', 'Madrid'],
            correctAnswer: 1,
            explanation: 'Paris is the capital of France',
          },
        ],
      },
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
  {
    id: 'test-tf-001',
    title: 'Test True/False',
    description: 'Testing true/false question type',
    category: 'testing',
    difficulty: 'easy',
    questions: [
      {
        type: 'true-false',
        question: 'The Earth is flat.',
        correctAnswer: false,
        explanation: 'The Earth is actually a sphere (approximately).',
      },
      {
        type: 'true-false',
        question: 'Paris is in France.',
        correctAnswer: true,
        explanation: 'Paris is indeed the capital of France.',
      },
    ],
    levelVariants: {
      easy: {
        title: 'Test True/False - Easy',
        questions: [
          {
            type: 'true-false',
            question: 'The Earth is flat.',
            correctAnswer: false,
            explanation: 'The Earth is actually a sphere (approximately).',
          },
        ],
      },
      medium: {
        title: 'Test True/False - Medium',
        questions: [
          {
            type: 'true-false',
            question: 'Paris is in France.',
            correctAnswer: true,
            explanation: 'Paris is indeed the capital of France.',
          },
        ],
      },
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
  {
    id: 'test-fillblank-001',
    title: 'Test Fill in the Blank',
    description: 'Testing fill-in-the-blank question type',
    category: 'testing',
    difficulty: 'easy',
    questions: [
      {
        type: 'fill-blank',
        question: 'The capital of France is _______.',
        correctAnswers: ['Paris', 'paris', 'PARIS'],
        explanation: 'The capital of France is Paris.',
      },
      {
        type: 'fill-blank',
        question: 'The largest planet in our solar system is _______.',
        correctAnswers: ['Jupiter', 'jupiter', 'JUPITER'],
        explanation: 'Jupiter is the largest planet in our solar system.',
      },
    ],
    levelVariants: {
      easy: {
        title: 'Test Fill in the Blank - Easy',
        questions: [
          {
            type: 'fill-blank',
            question: 'The capital of France is _______.',
            correctAnswers: ['Paris', 'paris', 'PARIS'],
            explanation: 'The capital of France is Paris.',
          },
        ],
      },
      medium: {
        title: 'Test Fill in the Blank - Medium',
        questions: [
          {
            type: 'fill-blank',
            question: 'The largest planet in our solar system is _______.',
            correctAnswers: ['Jupiter', 'jupiter', 'JUPITER'],
            explanation: 'Jupiter is the largest planet in our solar system.',
          },
        ],
      },
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
  {
    id: 'test-matching-001',
    title: 'Test Matching',
    description: 'Testing matching question type',
    category: 'testing',
    difficulty: 'easy',
    questions: [
      {
        type: 'matching',
        question: 'Match the countries with their capitals',
        pairs: [
          { left: 'France', right: 'Paris' },
          { left: 'Germany', right: 'Berlin' },
          { left: 'Spain', right: 'Madrid' },
        ],
        explanation: 'Capital cities correctly matched to their countries.',
      },
    ],
    levelVariants: {
      easy: {
        title: 'Test Matching - Easy',
        questions: [
          {
            type: 'matching',
            question: 'Match the countries with their capitals',
            pairs: [
              { left: 'France', right: 'Paris' },
              { left: 'Germany', right: 'Berlin' },
            ],
            explanation: 'Capital cities correctly matched to their countries.',
          },
        ],
      },
      medium: {
        title: 'Test Matching - Medium',
        questions: [
          {
            type: 'matching',
            question: 'Match the countries with their capitals',
            pairs: [
              { left: 'France', right: 'Paris' },
              { left: 'Germany', right: 'Berlin' },
              { left: 'Spain', right: 'Madrid' },
            ],
            explanation: 'Capital cities correctly matched to their countries.',
          },
        ],
      },
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
  {
    id: 'test-ordering-001',
    title: 'Test Ordering',
    description: 'Testing ordering question type',
    category: 'testing',
    difficulty: 'easy',
    questions: [
      {
        type: 'ordering',
        question: 'Order the planets from closest to farthest from the sun',
        items: ['Mercury', 'Venus', 'Earth', 'Mars'],
        correctOrder: [0, 1, 2, 3],
        explanation: 'The planets are ordered by their distance from the sun.',
      },
    ],
    levelVariants: {
      easy: {
        title: 'Test Ordering - Easy',
        questions: [
          {
            type: 'ordering',
            question: 'Order the planets from closest to farthest from the sun',
            items: ['Mercury', 'Venus', 'Earth', 'Mars'],
            correctOrder: [0, 1, 2, 3],
            explanation: 'The planets are ordered by their distance from the sun.',
          },
        ],
      },
      medium: {
        title: 'Test Ordering - Medium',
        questions: [
          {
            type: 'ordering',
            question: 'Order the planets from closest to farthest from the sun',
            items: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn'],
            correctOrder: [0, 1, 2, 3, 4, 5],
            explanation: 'The planets are ordered by their distance from the sun.',
          },
        ],
      },
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
  {
    id: 'test-imageselect-001',
    title: 'Test Image Selection',
    description: 'Testing image selection question type',
    category: 'testing',
    difficulty: 'easy',
    questions: [
      {
        type: 'image-select',
        question: 'Which of these is a cat?',
        images: [
          {
            url: 'https://via.placeholder.com/150?text=Cat',
            label: 'Cat',
            isCorrect: true,
          },
          {
            url: 'https://via.placeholder.com/150?text=Dog',
            label: 'Dog',
            isCorrect: false,
          },
          {
            url: 'https://via.placeholder.com/150?text=Bird',
            label: 'Bird',
            isCorrect: false,
          },
        ],
        explanation: 'The first image is a cat.',
      },
    ],
    levelVariants: {
      easy: {
        title: 'Test Image Selection - Easy',
        questions: [
          {
            type: 'image-select',
            question: 'Which of these is a cat?',
            images: [
              {
                url: 'https://via.placeholder.com/150?text=Cat',
                label: 'Cat',
                isCorrect: true,
              },
              {
                url: 'https://via.placeholder.com/150?text=Dog',
                label: 'Dog',
                isCorrect: false,
              },
            ],
            explanation: 'The first image is a cat.',
          },
        ],
      },
      medium: {
        title: 'Test Image Selection - Medium',
        questions: [
          {
            type: 'image-select',
            question: 'Which of these is a cat?',
            images: [
              {
                url: 'https://via.placeholder.com/150?text=Cat',
                label: 'Cat',
                isCorrect: true,
              },
              {
                url: 'https://via.placeholder.com/150?text=Dog',
                label: 'Dog',
                isCorrect: false,
              },
              {
                url: 'https://via.placeholder.com/150?text=Bird',
                label: 'Bird',
                isCorrect: false,
              },
            ],
            explanation: 'The first image is a cat.',
          },
        ],
      },
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
  {
    id: 'test-multiselect-001',
    title: 'Test Multi-Select',
    description: 'Testing multi-select question type',
    category: 'testing',
    difficulty: 'easy',
    questions: [
      {
        type: 'multi-select',
        question: 'Which of the following are fruits? (Select all that apply)',
        options: [
          { text: 'Apple', isCorrect: true },
          { text: 'Carrot', isCorrect: false },
          { text: 'Banana', isCorrect: true },
          { text: 'Broccoli', isCorrect: false },
        ],
        explanation: 'Apples and bananas are fruits. Carrots and broccoli are vegetables.',
      },
    ],
    levelVariants: {
      easy: {
        title: 'Test Multi-Select - Easy',
        questions: [
          {
            type: 'multi-select',
            question: 'Which of the following are fruits? (Select all that apply)',
            options: [
              { text: 'Apple', isCorrect: true },
              { text: 'Carrot', isCorrect: false },
              { text: 'Banana', isCorrect: true },
            ],
            explanation: 'Apples and bananas are fruits. Carrots are vegetables.',
          },
        ],
      },
      medium: {
        title: 'Test Multi-Select - Medium',
        questions: [
          {
            type: 'multi-select',
            question: 'Which of the following are fruits? (Select all that apply)',
            options: [
              { text: 'Apple', isCorrect: true },
              { text: 'Carrot', isCorrect: false },
              { text: 'Banana', isCorrect: true },
              { text: 'Broccoli', isCorrect: false },
            ],
            explanation: 'Apples and bananas are fruits. Carrots and broccoli are vegetables.',
          },
        ],
      },
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
  {
    id: 'test-dragdrop-001',
    title: 'Test Drag & Drop',
    description: 'Testing drag and drop question type',
    category: 'testing',
    difficulty: 'easy',
    questions: [
      {
        type: 'drag-drop',
        question: 'Drag each word to its correct category',
        items: ['Apple', 'Carrot', 'Banana', 'Broccoli'],
        zones: [
          { name: 'Fruits', correctItems: ['Apple', 'Banana'] },
          { name: 'Vegetables', correctItems: ['Carrot', 'Broccoli'] },
        ],
        explanation: 'Fruits include apples and bananas. Vegetables include carrots and broccoli.',
      },
    ],
    levelVariants: {
      easy: {
        title: 'Test Drag & Drop - Easy',
        questions: [
          {
            type: 'drag-drop',
            question: 'Drag each word to its correct category',
            items: ['Apple', 'Carrot', 'Banana'],
            zones: [
              { name: 'Fruits', correctItems: ['Apple', 'Banana'] },
              { name: 'Vegetables', correctItems: ['Carrot'] },
            ],
            explanation: 'Fruits include apples and bananas. Carrots are vegetables.',
          },
        ],
      },
      medium: {
        title: 'Test Drag & Drop - Medium',
        questions: [
          {
            type: 'drag-drop',
            question: 'Drag each word to its correct category',
            items: ['Apple', 'Carrot', 'Banana', 'Broccoli'],
            zones: [
              { name: 'Fruits', correctItems: ['Apple', 'Banana'] },
              { name: 'Vegetables', correctItems: ['Carrot', 'Broccoli'] },
            ],
            explanation: 'Fruits include apples and bananas. Vegetables include carrots and broccoli.',
          },
        ],
      },
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
  {
    id: 'test-all-types-001',
    title: 'Test All Question Types',
    description: 'Testing a combination of all 8 question types',
    category: 'testing',
    difficulty: 'medium',
    questions: [
      {
        type: 'multiple-choice',
        question: 'What is 5 + 3?',
        options: ['6', '7', '8', '9'],
        correctAnswer: 2,
        explanation: '5 + 3 equals 8',
      },
      {
        type: 'true-false',
        question: 'Water boils at 100 degrees Celsius.',
        correctAnswer: true,
        explanation: 'Water boils at 100°C at sea level.',
      },
      {
        type: 'fill-blank',
        question: 'The chemical symbol for gold is _______.',
        correctAnswers: ['Au', 'au', 'AU'],
        explanation: 'The chemical symbol for gold is Au.',
      },
      {
        type: 'matching',
        question: 'Match the elements with their symbols',
        pairs: [
          { left: 'Oxygen', right: 'O' },
          { left: 'Hydrogen', right: 'H' },
          { left: 'Nitrogen', right: 'N' },
        ],
        explanation: 'Chemical elements correctly matched to their symbols.',
      },
      {
        type: 'ordering',
        question: 'Order the numbers from smallest to largest',
        items: ['5', '2', '8', '1', '9'],
        correctOrder: [3, 1, 0, 2, 4],
        explanation: 'The correct order is 1, 2, 5, 8, 9.',
      },
    ],
    levelVariants: {
      easy: {
        title: 'Test All Types - Easy',
        questions: [
          {
            type: 'multiple-choice',
            question: 'What is 2 + 2?',
            options: ['2', '3', '4', '5'],
            correctAnswer: 2,
            explanation: '2 + 2 equals 4',
          },
          {
            type: 'true-false',
            question: 'The Earth is round.',
            correctAnswer: true,
            explanation: 'The Earth is approximately spherical.',
          },
        ],
      },
      medium: {
        title: 'Test All Types - Medium',
        questions: [
          {
            type: 'multiple-choice',
            question: 'What is 5 + 3?',
            options: ['6', '7', '8', '9'],
            correctAnswer: 2,
            explanation: '5 + 3 equals 8',
          },
          {
            type: 'true-false',
            question: 'Water boils at 100 degrees Celsius.',
            correctAnswer: true,
            explanation: 'Water boils at 100°C at sea level.',
          },
          {
            type: 'fill-blank',
            question: 'The chemical symbol for gold is _______.',
            correctAnswers: ['Au', 'au', 'AU'],
            explanation: 'The chemical symbol for gold is Au.',
          },
          {
            type: 'matching',
            question: 'Match the elements with their symbols',
            pairs: [
              { left: 'Oxygen', right: 'O' },
              { left: 'Hydrogen', right: 'H' },
            ],
            explanation: 'Chemical elements correctly matched to their symbols.',
          },
          {
            type: 'ordering',
            question: 'Order the numbers from smallest to largest',
            items: ['5', '2', '8', '1'],
            correctOrder: [3, 1, 0, 2],
            explanation: 'The correct order is 1, 2, 5, 8.',
          },
        ],
      },
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
];

/**
 * Create Phase 1 test quizzes in Firestore
 * @param {Function} onProgress - Callback for progress updates
 * @returns {Promise<Object>} Results object with success/failed counts and errors
 */
export const setupTestQuizzes = async (onProgress = null) => {
  try {
    const quizzesRef = collection(db, 'quizzes');
    let successCount = 0;
    let failedCount = 0;
    const errors = [];

    console.log('🚀 Starting Phase 1 test quiz creation...');

    // Delete existing test quizzes first
    try {
      const q = query(quizzesRef, where('category', '==', 'testing'));
      const snapshot = await getDocs(q);
      
      for (const document of snapshot.docs) {
        await deleteDoc(doc(db, 'quizzes', document.id));
      }
      console.log(`♻️ Deleted ${snapshot.docs.length} existing test quizzes`);
    } catch (error) {
      console.warn('Could not delete existing quizzes:', error.message);
    }

    // Create new test quizzes
    for (let i = 0; i < TEST_QUIZZES.length; i++) {
      const quiz = TEST_QUIZZES[i];
      
      try {
        const docRef = await addDoc(quizzesRef, quiz);
        console.log(`✅ Created: ${quiz.id} (${docRef.id})`);
        successCount++;
        
        if (onProgress) {
          onProgress({
            current: i + 1,
            total: TEST_QUIZZES.length,
            message: `Created ${quiz.title}`,
            successCount,
            failedCount,
          });
        }
      } catch (error) {
        console.error(`❌ Failed to create ${quiz.id}:`, error.message);
        failedCount++;
        errors.push({
          quizId: quiz.id,
          title: quiz.title,
          error: error.message,
        });
        
        if (onProgress) {
          onProgress({
            current: i + 1,
            total: TEST_QUIZZES.length,
            message: `Failed to create ${quiz.title}`,
            successCount,
            failedCount,
          });
        }
      }
    }

    const results = {
      success: successCount,
      failed: failedCount,
      total: TEST_QUIZZES.length,
      errors,
    };

    console.log(`\n📊 Summary:`);
    console.log(`✅ Created: ${successCount}/${TEST_QUIZZES.length}`);
    console.log(`❌ Failed: ${failedCount}/${TEST_QUIZZES.length}`);

    if (failedCount === 0) {
      console.log('\n🎉 All test quizzes created successfully!');
    }

    return results;
  } catch (error) {
    console.error('❌ Error setting up test quizzes:', error);
    throw error;
  }
};

/**
 * Check if test quizzes already exist
 * @returns {Promise<boolean>} True if test quizzes exist
 */
export const checkTestQuizzesExist = async () => {
  try {
    const quizzesRef = collection(db, 'quizzes');
    const q = query(quizzesRef, where('category', '==', 'testing'));
    const snapshot = await getDocs(q);
    return snapshot.docs.length > 0;
  } catch (error) {
    console.error('Error checking test quizzes:', error);
    return false;
  }
};
