#!/usr/bin/env node

/**
 * Setup Test Quizzes Script
 * Creates all 9 test quizzes in Firestore for Phase 1 testing
 * 
 * Usage:
 *   node scripts/setupTestQuizzes.mjs
 * 
 * This script will:
 * - Connect to Firebase Firestore
 * - Create 9 test quiz documents
 * - All 8 question types + mixed quiz
 * - Ready for immediate testing
 */

import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: serviceAccountKey.json not found!');
  console.error(`   Expected at: ${serviceAccountPath}`);
  console.error('\n   To fix:');
  console.error('   1. Go to Firebase Console');
  console.error('   2. Project Settings → Service Accounts');
  console.error('   3. Generate new private key');
  console.error('   4. Save as serviceAccountKey.json in project root');
  process.exit(1);
}

try {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://amaha-app-aef30.firebaseio.com'
  });
} catch (error) {
  console.error('❌ Error initializing Firebase:', error.message);
  process.exit(1);
}

const db = admin.firestore();

// Test Quiz Data
const testQuizzes = [
  {
    id: 'test-mc-001',
    data: {
      title: 'Test Multiple Choice',
      description: 'Simple multiple choice quiz to verify question type works',
      category: 'Test',
      difficulty: 'Easy',
      avgTime: 5,
      questions: [
        {
          type: 'multiple-choice',
          text: 'What is the capital of France?',
          options: ['London', 'Berlin', 'Paris', 'Madrid'],
          correctAnswer: 2,
          explanation: 'Paris is the capital and largest city of France, famous for the Eiffel Tower.',
          difficulty: 'Easy'
        },
        {
          type: 'multiple-choice',
          text: 'Which planet is closest to the Sun?',
          options: ['Venus', 'Mercury', 'Mars', 'Earth'],
          correctAnswer: 1,
          explanation: 'Mercury is the closest planet to the Sun and also the smallest.',
          difficulty: 'Easy'
        }
      ],
      levelVariants: {
        Easy: {
          questions: [
            {
              type: 'multiple-choice',
              text: 'What is 2+2?',
              options: ['3', '4', '5', '6'],
              correctAnswer: 1,
              explanation: '2+2 equals 4.',
              difficulty: 'Easy'
            }
          ],
          questionCount: 1
        },
        Medium: {
          questions: [
            {
              type: 'multiple-choice',
              text: 'What is 5×7?',
              options: ['30', '35', '40', '45'],
              correctAnswer: 1,
              explanation: '5×7 equals 35.',
              difficulty: 'Medium'
            }
          ],
          questionCount: 1
        },
        Hard: {
          questions: [
            {
              type: 'multiple-choice',
              text: 'What is 12×8?',
              options: ['96', '104', '112', '120'],
              correctAnswer: 0,
              explanation: '12×8 equals 96.',
              difficulty: 'Hard'
            }
          ],
          questionCount: 1
        },
        Expert: {
          questions: [
            {
              type: 'multiple-choice',
              text: 'What is 15×15?',
              options: ['215', '220', '225', '230'],
              correctAnswer: 2,
              explanation: '15×15 equals 225.',
              difficulty: 'Expert'
            }
          ],
          questionCount: 1
        }
      }
    }
  },
  {
    id: 'test-tf-001',
    data: {
      title: 'Test True/False',
      description: 'True/False questions',
      category: 'Test',
      difficulty: 'Easy',
      avgTime: 5,
      questions: [
        {
          type: 'true-false',
          text: 'Paris is the capital of France.',
          correctAnswer: 0,
          explanation: 'True. Paris is the capital and largest city of France.',
          difficulty: 'Easy'
        },
        {
          type: 'true-false',
          text: 'The Earth is flat.',
          correctAnswer: 1,
          explanation: 'False. The Earth is an oblate spheroid (nearly spherical).',
          difficulty: 'Easy'
        }
      ],
      levelVariants: {
        Easy: {
          questions: [
            {
              type: 'true-false',
              text: 'Water boils at 100°C at sea level.',
              correctAnswer: 0,
              explanation: 'True. This is the standard boiling point of water.',
              difficulty: 'Easy'
            }
          ],
          questionCount: 1
        }
      }
    }
  },
  {
    id: 'test-fillblank-001',
    data: {
      title: 'Test Fill in the Blank',
      description: 'Fill in the blank questions',
      category: 'Test',
      difficulty: 'Easy',
      avgTime: 5,
      questions: [
        {
          type: 'fill-blank',
          text: 'The capital of France is ____.',
          answer: 'Paris',
          explanation: 'Paris is the capital and largest city of France.',
          difficulty: 'Easy'
        },
        {
          type: 'fill-blank',
          text: 'The largest planet in our solar system is ____.',
          answer: ['Jupiter', 'jupiter'],
          explanation: 'Jupiter is the largest planet in our solar system.',
          difficulty: 'Easy'
        }
      ],
      levelVariants: {
        Easy: {
          questions: [
            {
              type: 'fill-blank',
              text: '1+1 = ____',
              answer: ['2', 'two'],
              explanation: '1+1 equals 2.',
              difficulty: 'Easy'
            }
          ],
          questionCount: 1
        }
      }
    }
  },
  {
    id: 'test-matching-001',
    data: {
      title: 'Test Matching',
      description: 'Match items to their pairs',
      category: 'Test',
      difficulty: 'Easy',
      avgTime: 5,
      questions: [
        {
          type: 'matching',
          text: 'Match countries to their capitals:',
          pairs: [
            { id: 1, left: 'France', right: 'Paris' },
            { id: 2, left: 'Germany', right: 'Berlin' },
            { id: 3, left: 'Italy', right: 'Rome' }
          ],
          correctPairs: {
            '1': 1,
            '2': 2,
            '3': 3
          },
          explanation: 'These are the correct capital cities for each country.',
          difficulty: 'Easy'
        }
      ],
      levelVariants: {
        Easy: {
          questions: [
            {
              type: 'matching',
              text: 'Match numbers to words:',
              pairs: [
                { id: 1, left: '1', right: 'One' },
                { id: 2, left: '2', right: 'Two' }
              ],
              correctPairs: {
                '1': 1,
                '2': 2
              },
              explanation: 'These are the correct matches.',
              difficulty: 'Easy'
            }
          ],
          questionCount: 1
        }
      }
    }
  },
  {
    id: 'test-ordering-001',
    data: {
      title: 'Test Ordering',
      description: 'Put items in the correct order',
      category: 'Test',
      difficulty: 'Easy',
      avgTime: 5,
      questions: [
        {
          type: 'ordering',
          text: 'Put these numbers in order from smallest to largest:',
          items: [
            { id: 1, text: '5' },
            { id: 2, text: '2' },
            { id: 3, text: '8' },
            { id: 4, text: '1' }
          ],
          correctOrder: [4, 2, 1, 3],
          explanation: 'The correct order is 1, 2, 5, 8',
          difficulty: 'Easy'
        }
      ],
      levelVariants: {
        Easy: {
          questions: [
            {
              type: 'ordering',
              text: 'Put in correct order: A, B, C',
              items: [
                { id: 1, text: 'A' },
                { id: 2, text: 'B' },
                { id: 3, text: 'C' }
              ],
              correctOrder: [1, 2, 3],
              explanation: 'Alphabetical order.',
              difficulty: 'Easy'
            }
          ],
          questionCount: 1
        }
      }
    }
  },
  {
    id: 'test-imageselect-001',
    data: {
      title: 'Test Image Selection',
      description: 'Select the correct image',
      category: 'Test',
      difficulty: 'Easy',
      avgTime: 5,
      questions: [
        {
          type: 'image-select',
          text: 'Which is a cat?',
          options: [
            {
              imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg',
              label: 'Cat',
              isCorrect: true
            },
            {
              imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
              label: 'Painting',
              isCorrect: false
            }
          ],
          correctImages: [0],
          explanation: 'A cat is a domesticated feline mammal.',
          difficulty: 'Easy'
        }
      ],
      levelVariants: {
        Easy: {
          questions: [
            {
              type: 'image-select',
              text: 'Select apple:',
              options: [
                {
                  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/1280px-Red_Apple.jpg',
                  label: 'Apple',
                  isCorrect: true
                },
                {
                  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg',
                  label: 'Cat',
                  isCorrect: false
                }
              ],
              correctImages: [0],
              explanation: 'Apples are fruits.',
              difficulty: 'Easy'
            }
          ],
          questionCount: 1
        }
      }
    }
  },
  {
    id: 'test-multiselect-001',
    data: {
      title: 'Test Multi-Select',
      description: 'Select multiple correct answers',
      category: 'Test',
      difficulty: 'Easy',
      avgTime: 5,
      questions: [
        {
          type: 'multi-select',
          text: 'Which of these are fruits? (Select all that apply)',
          options: [
            { id: 0, text: 'Apple', isCorrect: true },
            { id: 1, text: 'Banana', isCorrect: true },
            { id: 2, text: 'Carrot', isCorrect: false },
            { id: 3, text: 'Orange', isCorrect: true }
          ],
          correctAnswers: [0, 1, 3],
          explanation: 'Apples, bananas, and oranges are fruits. Carrots are vegetables.',
          difficulty: 'Easy'
        }
      ],
      levelVariants: {
        Easy: {
          questions: [
            {
              type: 'multi-select',
              text: 'Which are colors?',
              options: [
                { id: 0, text: 'Red', isCorrect: true },
                { id: 1, text: 'Blue', isCorrect: true },
                { id: 2, text: 'Car', isCorrect: false }
              ],
              correctAnswers: [0, 1],
              explanation: 'Red and Blue are colors.',
              difficulty: 'Easy'
            }
          ],
          questionCount: 1
        }
      }
    }
  },
  {
    id: 'test-dragdrop-001',
    data: {
      title: 'Test Drag & Drop',
      description: 'Drag items to correct categories',
      category: 'Test',
      difficulty: 'Easy',
      avgTime: 5,
      questions: [
        {
          type: 'drag-drop',
          text: 'Drag animals to their habitats:',
          dropZones: [
            { id: 'z1', label: 'Land' },
            { id: 'z2', label: 'Water' }
          ],
          items: [
            { id: 'i1', text: 'Lion', correctZone: 'z1' },
            { id: 'i2', text: 'Fish', correctZone: 'z2' },
            { id: 'i3', text: 'Eagle', correctZone: 'z1' }
          ],
          correctPlacements: {
            i1: 'z1',
            i2: 'z2',
            i3: 'z1'
          },
          explanation: 'Lions and eagles live on land. Fish live in water.',
          difficulty: 'Easy'
        }
      ],
      levelVariants: {
        Easy: {
          questions: [
            {
              type: 'drag-drop',
              text: 'Sort by color:',
              dropZones: [
                { id: 'z1', label: 'Red' },
                { id: 'z2', label: 'Blue' }
              ],
              items: [
                { id: 'i1', text: 'Apple', correctZone: 'z1' },
                { id: 'i2', text: 'Sky', correctZone: 'z2' }
              ],
              correctPlacements: {
                i1: 'z1',
                i2: 'z2'
              },
              explanation: 'Apples are red, sky is blue.',
              difficulty: 'Easy'
            }
          ],
          questionCount: 1
        }
      }
    }
  },
  {
    id: 'test-all-types-001',
    data: {
      title: 'Test All Question Types',
      description: 'Quiz with all 8 question types combined',
      category: 'Test',
      difficulty: 'Medium',
      avgTime: 15,
      questions: [
        {
          type: 'multiple-choice',
          text: '1. What is the capital of France?',
          options: ['London', 'Berlin', 'Paris', 'Madrid'],
          correctAnswer: 2,
          explanation: 'Paris is the capital of France.',
          difficulty: 'Easy'
        },
        {
          type: 'true-false',
          text: '2. The Earth orbits the Sun.',
          correctAnswer: 0,
          explanation: 'True. The Earth orbits the Sun.',
          difficulty: 'Easy'
        },
        {
          type: 'fill-blank',
          text: '3. 5 + 3 = ____',
          answer: ['8', 'eight'],
          explanation: '5 + 3 = 8',
          difficulty: 'Easy'
        },
        {
          type: 'matching',
          text: '4. Match fruit to color:',
          pairs: [
            { id: 1, left: 'Banana', right: 'Yellow' },
            { id: 2, left: 'Apple', right: 'Red' }
          ],
          correctPairs: {
            '1': 1,
            '2': 2
          },
          explanation: 'Bananas are yellow, apples are red.',
          difficulty: 'Easy'
        },
        {
          type: 'ordering',
          text: '5. Put in size order (small to large):',
          items: [
            { id: 1, text: 'Planet' },
            { id: 2, text: 'Ant' },
            { id: 3, text: 'Mountain' }
          ],
          correctOrder: [2, 1, 3],
          explanation: 'Ant < Planet < Mountain',
          difficulty: 'Easy'
        }
      ],
      levelVariants: {
        Easy: {
          questions: [
            {
              type: 'multiple-choice',
              text: 'What is 1+1?',
              options: ['1', '2', '3'],
              correctAnswer: 1,
              explanation: '1+1=2',
              difficulty: 'Easy'
            }
          ],
          questionCount: 1
        }
      }
    }
  }
];

async function createQuizzes() {
  console.log('🚀 Starting test quiz creation...\n');
  
  let successCount = 0;
  let errorCount = 0;

  for (const quiz of testQuizzes) {
    try {
      await db.collection('quizzes').doc(quiz.id).set(quiz.data);
      console.log(`✅ Created: ${quiz.id}`);
      console.log(`   Title: ${quiz.data.title}`);
      console.log(`   Questions: ${quiz.data.questions.length}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed: ${quiz.id}`);
      console.error(`   Error: ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Created: ${successCount}/9`);
  console.log(`   ❌ Failed: ${errorCount}/9`);
  console.log(`\n🎉 All test quizzes ready for Phase 1 testing!\n`);

  if (successCount === 9) {
    console.log('📍 Next steps:');
    console.log('   1. Open http://localhost:3001');
    console.log('   2. Navigate to Quizzes');
    console.log('   3. Start with test-mc-001');
    console.log('   4. Follow PHASE1_TESTING_GUIDE.md');
  }

  process.exit(errorCount === 0 ? 0 : 1);
}

createQuizzes().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
