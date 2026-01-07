/**
 * Seed Script: Create 11 Sample Quizzes in Firebase
 * Populates Firebase Firestore with one quiz for each quiz type
 */

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const QUIZ_SEED_DATA = [
  // 1. MCQ
  {
    title: '🎯 Basic MCQ Quiz',
    description: 'Test your knowledge with multiple choice questions',
    category: 'science',
    difficulty: 'Easy',
    audience: 'all',
    quizType: 'MCQ',
    rating: 4.5,
    plays: 245,
    totalQuestions: 3,
    avgTime: '5 min',
    questions: [
      {
        id: 'q1',
        sequence: 1,
        quizType: 'MCQ',
        points: 10,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'What is the capital of France?',
              url: '',
            },
          ],
        },
        answer: {
          options: [
            { key: 'A', text: 'London', media: null },
            { key: 'B', text: 'Paris', media: null },
            { key: 'C', text: 'Berlin', media: null },
            { key: 'D', text: 'Madrid', media: null },
          ],
          correctOption: 'B',
        },
        hint: "It's known as the City of Light",
        explanation: 'Paris is the capital of France and one of the most visited cities in the world.',
      },
      {
        id: 'q2',
        sequence: 2,
        quizType: 'MCQ',
        points: 10,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'Which planet is known as the Red Planet?',
              url: '',
            },
          ],
        },
        answer: {
          options: [
            { key: 'A', text: 'Venus', media: null },
            { key: 'B', text: 'Mars', media: null },
            { key: 'C', text: 'Jupiter', media: null },
            { key: 'D', text: 'Saturn', media: null },
          ],
          correctOption: 'B',
        },
        hint: 'It has a reddish appearance due to iron oxide',
        explanation: 'Mars is known as the Red Planet because of the red iron oxide on its surface.',
      },
      {
        id: 'q3',
        sequence: 3,
        quizType: 'MCQ',
        points: 10,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'What is the largest ocean on Earth?',
              url: '',
            },
          ],
        },
        answer: {
          options: [
            { key: 'A', text: 'Atlantic Ocean', media: null },
            { key: 'B', text: 'Indian Ocean', media: null },
            { key: 'C', text: 'Pacific Ocean', media: null },
            { key: 'D', text: 'Arctic Ocean', media: null },
          ],
          correctOption: 'C',
        },
        hint: 'It covers about 46% of ocean surface',
        explanation: 'The Pacific Ocean is the largest ocean, covering approximately 165 million square kilometers.',
      },
    ],
  },

  // 2. MULTI_SELECT
  {
    title: '✓ Multiple Answer Quiz',
    description: 'Select all correct answers from the options',
    category: 'science',
    difficulty: 'Medium',
    audience: 'all',
    quizType: 'MULTI_SELECT',
    rating: 4.2,
    plays: 189,
    totalQuestions: 2,
    avgTime: '6 min',
    questions: [
      {
        id: 'q1',
        sequence: 1,
        quizType: 'MULTI_SELECT',
        points: 15,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'Which of these are planets in our solar system?',
              url: '',
            },
          ],
        },
        answer: {
          options: [
            { key: 'A', text: 'Mars', media: null },
            { key: 'B', text: 'Venus', media: null },
            { key: 'C', text: 'Moon', media: null },
            { key: 'D', text: 'Jupiter', media: null },
          ],
          correctOptions: ['A', 'B', 'D'],
          minCorrect: 1,
          maxIncorrect: 1,
        },
        hint: 'The Moon is not a planet',
        explanation: 'Mars, Venus, and Jupiter are planets. The Moon is Earth\'s natural satellite.',
      },
      {
        id: 'q2',
        sequence: 2,
        quizType: 'MULTI_SELECT',
        points: 15,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'Which of these are programming languages?',
              url: '',
            },
          ],
        },
        answer: {
          options: [
            { key: 'A', text: 'JavaScript', media: null },
            { key: 'B', text: 'Python', media: null },
            { key: 'C', text: 'HTML', media: null },
            { key: 'D', text: 'Java', media: null },
          ],
          correctOptions: ['A', 'B', 'D'],
          minCorrect: 1,
          maxIncorrect: 1,
        },
        hint: 'HTML is a markup language, not a programming language',
        explanation: 'JavaScript, Python, and Java are programming languages. HTML is a markup language.',
      },
    ],
  },

  // 3. TRUE_FALSE
  {
    title: '✓✗ True or False Quiz',
    description: 'Determine if statements are true or false',
    category: 'history',
    difficulty: 'Easy',
    audience: 'all',
    quizType: 'TRUE_FALSE',
    rating: 4.6,
    plays: 312,
    totalQuestions: 4,
    avgTime: '4 min',
    questions: [
      {
        id: 'q1',
        sequence: 1,
        quizType: 'TRUE_FALSE',
        points: 5,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'The Great Wall of China is visible from space.',
              url: '',
            },
          ],
        },
        answer: {
          correctAnswer: false,
        },
        hint: 'Think about the visibility from orbit',
        explanation: 'While massive, the Great Wall is too narrow to be clearly visible from space without magnification.',
      },
      {
        id: 'q2',
        sequence: 2,
        quizType: 'TRUE_FALSE',
        points: 5,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'Honey never spoils.',
              url: '',
            },
          ],
        },
        answer: {
          correctAnswer: true,
        },
        hint: 'Consider the properties of honey',
        explanation: 'Honey is a natural preservative that can last indefinitely due to its low water content and acidity.',
      },
      {
        id: 'q3',
        sequence: 3,
        quizType: 'TRUE_FALSE',
        points: 5,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'Dolphins are fish.',
              url: '',
            },
          ],
        },
        answer: {
          correctAnswer: false,
        },
        hint: 'Think about what animals nurse their young',
        explanation: 'Dolphins are mammals, not fish. They breathe air and nurse their young.',
      },
      {
        id: 'q4',
        sequence: 4,
        quizType: 'TRUE_FALSE',
        points: 5,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'Python is only used for web development.',
              url: '',
            },
          ],
        },
        answer: {
          correctAnswer: false,
        },
        hint: 'Think about data science and AI',
        explanation: 'Python is used for web development, data science, AI, automation, and many other applications.',
      },
    ],
  },

  // 4. FILL_BLANK
  {
    title: '📝 Fill in the Blank',
    description: 'Complete the sentence with the correct word',
    category: 'literature',
    difficulty: 'Medium',
    audience: 'all',
    quizType: 'FILL_BLANK',
    rating: 4.3,
    plays: 156,
    totalQuestions: 3,
    avgTime: '7 min',
    questions: [
      {
        id: 'q1',
        sequence: 1,
        quizType: 'FILL_BLANK',
        points: 20,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'The capital of Germany is ________.',
              url: '',
            },
          ],
        },
        answer: {
          correctAnswers: ['Berlin', 'berlin'],
          acceptFuzzyMatch: true,
          fuzzyThreshold: 0.8,
        },
        hint: 'It starts with B',
        explanation: 'Berlin is the capital and largest city of Germany.',
      },
      {
        id: 'q2',
        sequence: 2,
        quizType: 'FILL_BLANK',
        points: 20,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'Photosynthesis is the process by which plants convert ________ into chemical energy.',
              url: '',
            },
          ],
        },
        answer: {
          correctAnswers: ['light', 'Light', 'sunlight', 'Sunlight', 'solar energy'],
          acceptFuzzyMatch: true,
          fuzzyThreshold: 0.8,
        },
        hint: 'It comes from the sun',
        explanation: 'Plants use sunlight energy to produce glucose and oxygen through photosynthesis.',
      },
      {
        id: 'q3',
        sequence: 3,
        quizType: 'FILL_BLANK',
        points: 20,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'The largest mammal in the world is the ________ whale.',
              url: '',
            },
          ],
        },
        answer: {
          correctAnswers: ['blue', 'Blue', 'blue whale'],
          acceptFuzzyMatch: true,
          fuzzyThreshold: 0.8,
        },
        hint: 'It\'s named after a color',
        explanation: 'The blue whale is the largest animal ever known to exist.',
      },
    ],
  },

  // 5. MATCHING
  {
    title: '🔗 Matching Pairs',
    description: 'Match left items with correct right items',
    category: 'geography',
    difficulty: 'Medium',
    audience: 'all',
    quizType: 'MATCHING',
    rating: 4.4,
    plays: 198,
    totalQuestions: 1,
    avgTime: '8 min',
    questions: [
      {
        id: 'q1',
        sequence: 1,
        quizType: 'MATCHING',
        points: 50,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'Match countries with their capitals',
              url: '',
            },
          ],
        },
        answer: {
          pairs: [
            { leftId: '1', leftText: 'France', rightId: 'a', rightText: 'Paris' },
            { leftId: '2', leftText: 'Japan', rightId: 'b', rightText: 'Tokyo' },
            { leftId: '3', leftText: 'Brazil', rightId: 'c', rightText: 'Brasília' },
            { leftId: '4', leftText: 'Egypt', rightId: 'd', rightText: 'Cairo' },
          ],
          correctMatches: [
            { left: '1', right: 'a' },
            { left: '2', right: 'b' },
            { left: '3', right: 'c' },
            { left: '4', right: 'd' },
          ],
        },
        hint: 'Each country has one capital',
        explanation: 'These are the official capitals of each country.',
      },
    ],
  },

  // 6. ORDERING
  {
    title: '📊 Sequence Ordering',
    description: 'Arrange items in the correct order',
    category: 'history',
    difficulty: 'Hard',
    audience: 'all',
    quizType: 'ORDERING',
    rating: 4.1,
    plays: 134,
    totalQuestions: 2,
    avgTime: '10 min',
    questions: [
      {
        id: 'q1',
        sequence: 1,
        quizType: 'ORDERING',
        points: 30,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'Arrange these events in chronological order',
              url: '',
            },
          ],
        },
        answer: {
          items: [
            { id: '1', text: 'French Revolution' },
            { id: '2', text: 'American Revolution' },
            { id: '3', text: 'World War II' },
            { id: '4', text: 'Industrial Revolution' },
          ],
          correctOrder: ['2', '1', '4', '3'],
        },
        hint: 'Think about major historical events',
        explanation: 'The correct chronological order is: American Revolution (1776), French Revolution (1789), Industrial Revolution (1760-1840), World War II (1939-1945).',
      },
      {
        id: 'q2',
        sequence: 2,
        quizType: 'ORDERING',
        points: 30,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'Order these planets by distance from the Sun',
              url: '',
            },
          ],
        },
        answer: {
          items: [
            { id: '1', text: 'Earth' },
            { id: '2', text: 'Mercury' },
            { id: '3', text: 'Mars' },
            { id: '4', text: 'Venus' },
          ],
          correctOrder: ['2', '4', '1', '3'],
        },
        hint: 'Mercury is closest to the Sun',
        explanation: 'The correct order from closest to farthest is: Mercury, Venus, Earth, Mars.',
      },
    ],
  },

  // 7. PUZZLE
  {
    title: '🧩 Puzzle Assembly',
    description: 'Assemble puzzle pieces in correct arrangement',
    category: 'math',
    difficulty: 'Medium',
    audience: 'all',
    quizType: 'PUZZLE',
    rating: 4.3,
    plays: 167,
    totalQuestions: 1,
    avgTime: '12 min',
    questions: [
      {
        id: 'q1',
        sequence: 1,
        quizType: 'PUZZLE',
        points: 50,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'Assemble the equation puzzle: What equals 100?',
              url: '',
            },
          ],
        },
        answer: {
          pieces: [
            { id: 'p1', text: '50', position: 0 },
            { id: 'p2', text: '+', position: 1 },
            { id: 'p3', text: '50', position: 2 },
            { id: 'p4', text: '=', position: 3 },
            { id: 'p5', text: '100', position: 4 },
          ],
          correctSequence: ['p1', 'p2', 'p3', 'p4', 'p5'],
        },
        hint: 'Basic arithmetic puzzle',
        explanation: '50 + 50 = 100 is the correct mathematical equation.',
      },
    ],
  },

  // 8. DRAG_DROP
  {
    title: '🎯 Drag & Drop',
    description: 'Drag items into correct categories',
    category: 'science',
    difficulty: 'Medium',
    audience: 'all',
    quizType: 'DRAG_DROP',
    rating: 4.2,
    plays: 201,
    totalQuestions: 1,
    avgTime: '9 min',
    questions: [
      {
        id: 'q1',
        sequence: 1,
        quizType: 'DRAG_DROP',
        points: 50,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'Categorize animals by their habitat',
              url: '',
            },
          ],
        },
        answer: {
          categories: [
            { id: 'cat1', name: 'Water' },
            { id: 'cat2', name: 'Land' },
            { id: 'cat3', name: 'Air' },
          ],
          items: [
            { id: 'item1', text: 'Fish', correctCategory: 'cat1' },
            { id: 'item2', text: 'Eagle', correctCategory: 'cat3' },
            { id: 'item3', text: 'Lion', correctCategory: 'cat2' },
            { id: 'item4', text: 'Shark', correctCategory: 'cat1' },
            { id: 'item5', text: 'Parrot', correctCategory: 'cat3' },
          ],
        },
        hint: 'Think about where each animal lives',
        explanation: 'Water animals: Fish, Shark. Land animals: Lion. Air animals: Eagle, Parrot.',
      },
    ],
  },

  // 9. CODING
  {
    title: '💻 Code Challenge',
    description: 'Write JavaScript code to solve the challenge',
    category: 'technology',
    difficulty: 'Hard',
    audience: 'all',
    quizType: 'CODING',
    rating: 4.0,
    plays: 89,
    totalQuestions: 1,
    avgTime: '15 min',
    questions: [
      {
        id: 'q1',
        sequence: 1,
        quizType: 'CODING',
        points: 100,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'Write a function that returns the sum of two numbers',
              url: '',
            },
          ],
        },
        answer: {
          language: 'javascript',
          template: 'function addNumbers(a, b) {\n  // Write your code here\n  return 0;\n}',
          testCases: [
            {
              input: 'addNumbers(5, 3)',
              expectedOutput: '8',
              description: 'Sum of 5 and 3',
            },
            {
              input: 'addNumbers(10, 20)',
              expectedOutput: '30',
              description: 'Sum of 10 and 20',
            },
            {
              input: 'addNumbers(-5, 5)',
              expectedOutput: '0',
              description: 'Sum of negative and positive',
            },
          ],
        },
        hint: 'Use the + operator to add numbers',
        explanation: 'A simple function that adds two numbers using the + operator.',
      },
    ],
  },

  // 10. IMAGE_BASED
  {
    title: '🖼️ Image Selection',
    description: 'Click on the correct region in the image',
    category: 'geography',
    difficulty: 'Medium',
    audience: 'all',
    quizType: 'IMAGE_BASED',
    rating: 4.4,
    plays: 223,
    totalQuestions: 1,
    avgTime: '8 min',
    questions: [
      {
        id: 'q1',
        sequence: 1,
        quizType: 'IMAGE_BASED',
        points: 50,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'Click on where Africa is located',
              url: '',
            },
            {
              id: 'c2',
              type: 'image',
              value: 'World Map',
              url: 'https://via.placeholder.com/600x400?text=World+Map',
            },
          ],
        },
        answer: {
          regions: [
            {
              id: 'region1',
              label: 'Africa',
              x: 200,
              y: 250,
              width: 100,
              height: 120,
              tolerance: 30,
            },
          ],
          correctRegion: 'region1',
        },
        hint: 'It is a large continent on the eastern hemisphere',
        explanation: 'Africa is the second-largest continent, located south of Europe.',
      },
    ],
  },

  // 11. AUDIO_BASED
  {
    title: '🎵 Audio Listening',
    description: 'Listen to audio and answer the question',
    category: 'science',
    difficulty: 'Easy',
    audience: 'all',
    quizType: 'AUDIO_BASED',
    rating: 4.5,
    plays: 267,
    totalQuestions: 2,
    avgTime: '6 min',
    questions: [
      {
        id: 'q1',
        sequence: 1,
        quizType: 'AUDIO_BASED',
        points: 10,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'What animal sound did you hear?',
              url: '',
            },
            {
              id: 'c2',
              type: 'audio',
              value: 'Dog barking',
              url: 'https://example.com/dog-bark.mp3',
            },
          ],
        },
        answer: {
          options: [
            { key: 'A', text: 'Cat meowing', media: null },
            { key: 'B', text: 'Dog barking', media: null },
            { key: 'C', text: 'Bird chirping', media: null },
            { key: 'D', text: 'Cow mooing', media: null },
          ],
          correctOption: 'B',
        },
        hint: 'It sounds like woof woof',
        explanation: 'That was the sound of a dog barking.',
      },
      {
        id: 'q2',
        sequence: 2,
        quizType: 'AUDIO_BASED',
        points: 10,
        question: {
          contentItems: [
            {
              id: 'c1',
              type: 'text',
              value: 'What bird made this sound?',
              url: '',
            },
            {
              id: 'c2',
              type: 'audio',
              value: 'Owl hooting',
              url: 'https://example.com/owl-hoot.mp3',
            },
          ],
        },
        answer: {
          options: [
            { key: 'A', text: 'Parrot', media: null },
            { key: 'B', text: 'Crow', media: null },
            { key: 'C', text: 'Owl', media: null },
            { key: 'D', text: 'Sparrow', media: null },
          ],
          correctOption: 'C',
        },
        hint: 'This bird is known for nocturnal hooting',
        explanation: 'Owls are known for their distinctive hooting sound, especially at night.',
      },
    ],
  },
];

/**
 * Seed the database with sample quizzes
 * @param {Function} onProgress - Callback to report progress
 * @returns {Promise<object>} Result object with success/error details
 */
export async function seedSampleQuizzes(onProgress = null) {
  try {
    console.log('🌱 Starting quiz seed process...');

    const quizzesCollection = collection(db, 'quizzes');
    const results = {
      success: 0,
      failed: 0,
      errors: [],
      createdIds: [],
    };

    for (let i = 0; i < QUIZ_SEED_DATA.length; i++) {
      const quizData = QUIZ_SEED_DATA[i];

      try {
        const docRef = await addDoc(quizzesCollection, {
          ...quizData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          published: true,
        });

        results.success++;
        results.createdIds.push(docRef.id);
        console.log(`✅ Created quiz: ${quizData.title} (${docRef.id})`);

        if (onProgress) {
          onProgress({
            current: i + 1,
            total: QUIZ_SEED_DATA.length,
            title: quizData.title,
            status: 'success',
          });
        }
      } catch (error) {
        results.failed++;
        results.errors.push({
          title: quizData.title,
          error: error.message,
        });
        console.error(`❌ Failed to create quiz: ${quizData.title}`, error);

        if (onProgress) {
          onProgress({
            current: i + 1,
            total: QUIZ_SEED_DATA.length,
            title: quizData.title,
            status: 'error',
            error: error.message,
          });
        }
      }
    }

    console.log('🌱 Seed process completed:', results);
    return results;
  } catch (error) {
    console.error('❌ Seed operation failed:', error);
    throw error;
  }
}

/**
 * Delete all sample quizzes (by ID)
 * @param {Array<string>} quizIds - IDs of quizzes to delete
 * @param {Function} onProgress - Callback to report progress
 * @returns {Promise<object>} Result object
 */
export async function deleteSampleQuizzes(quizIds, onProgress = null) {
  try {
    console.log('🗑️ Starting quiz deletion process...');

    const { deleteDoc, doc } = await import('firebase/firestore');
    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (let i = 0; i < quizIds.length; i++) {
      const quizId = quizIds[i];

      try {
        await deleteDoc(doc(db, 'quizzes', quizId));
        results.success++;
        console.log(`✅ Deleted quiz: ${quizId}`);

        if (onProgress) {
          onProgress({
            current: i + 1,
            total: quizIds.length,
            status: 'success',
          });
        }
      } catch (error) {
        results.failed++;
        results.errors.push({
          quizId,
          error: error.message,
        });
        console.error(`❌ Failed to delete quiz: ${quizId}`, error);

        if (onProgress) {
          onProgress({
            current: i + 1,
            total: quizIds.length,
            status: 'error',
            error: error.message,
          });
        }
      }
    }

    console.log('🗑️ Deletion process completed:', results);
    return results;
  } catch (error) {
    console.error('❌ Deletion operation failed:', error);
    throw error;
  }
}
