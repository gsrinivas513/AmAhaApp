#!/usr/bin/env node

/**
 * addSampleStoryData.js
 * 
 * Script to create a sample story with chapters, images, and assessments
 * Uses Firebase REST API (no service account key needed)
 * 
 * Usage:
 *   node addSampleStoryData.js
 */

const API_KEY = 'AIzaSyAR8-mpS85CEopQuGuP4Lhm3xieYbG1HcY';
const PROJECT_ID = 'amahaapp';

// Firebase REST API endpoints
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function makeRequest(method, path, data = null) {
  try {
    const url = `${FIRESTORE_URL}${path}?key=${API_KEY}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`API Error: ${error.message}`);
  }
}

function createFirestoreValue(value) {
  if (typeof value === 'string') {
    return { stringValue: value };
  } else if (typeof value === 'number') {
    return { integerValue: value.toString() };
  } else if (typeof value === 'boolean') {
    return { booleanValue: value };
  } else if (value === null) {
    return { nullValue: null };
  } else if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map(v => createFirestoreValue(v))
      }
    };
  } else if (typeof value === 'object') {
    const mapValues = {};
    for (const [key, val] of Object.entries(value)) {
      mapValues[key] = createFirestoreValue(val);
    }
    return { mapValue: { fields: mapValues } };
  }
}

async function addSampleStory() {
  try {
    console.log('📖 Creating sample story with chapters, images, and assessments...\n');

    // Create the story
    const storyId = 'story_' + Date.now();
    
    const storyData = {
      fields: createFirestoreValue({
        title: 'The Adventure Chronicles',
        description: 'Join Zara on an exciting journey through enchanted lands filled with puzzles and challenges!',
        targetAudience: 'kids',
        coverImage: 'https://images.unsplash.com/photo-1507842845185-35ab16fbb2b4?w=600&h=400&fit=crop',
        published: true,
        chapterCount: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).mapValue.fields
    };

    await makeRequest('PATCH', `/stories/${storyId}`, storyData);
    console.log(`✅ Story created: ${storyId}`);

    // Chapter 1: The Beginning
    const chapter1Id = 'chapter_' + Date.now() + '_1';
    
    const chapter1Data = {
      fields: createFirestoreValue({
        title: 'The Mysterious Forest',
        description: 'Our adventure begins at the edge of an ancient forest.',
        characterImage: '🧙‍♀️',
        order: 1,
        contentBlocks: [
          {
            id: Date.now() + 1,
            type: 'text',
            content: 'Once upon a time, in a land far away, there was a young adventurer named Zara. She stood at the edge of a mysterious forest, filled with ancient trees and magical creatures.',
            order: 1
          },
          {
            id: Date.now() + 2,
            type: 'image',
            content: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600&h=400&fit=crop',
            order: 2
          },
          {
            id: Date.now() + 3,
            type: 'text',
            content: 'As she entered the forest, a friendly owl appeared and said: "Welcome, brave traveler! To move forward, you must answer three questions about reading comprehension."',
            order: 3
          }
        ],
        assessment: {
          type: 'quiz',
          id: 'quiz_001_chapter1',
          required: true
        },
        createdAt: new Date().toISOString()
      }).mapValue.fields
    };

    await makeRequest('PATCH', `/stories/${storyId}/chapters/${chapter1Id}`, chapter1Data);
    console.log(`✅ Chapter 1 created: The Mysterious Forest`);

    // Chapter 2: The Puzzle Valley
    const chapter2Id = 'chapter_' + Date.now() + '_2';
    
    const chapter2Data = {
      fields: createFirestoreValue({
        title: 'The Puzzle Valley',
        description: 'Zara discovers a hidden valley filled with ancient puzzles.',
        characterImage: '🧗',
        order: 2,
        contentBlocks: [
          {
            id: Date.now() + 4,
            type: 'text',
            content: 'After answering the owl\'s questions, Zara discovered a hidden valley filled with colorful rocks and crystals. The ground beneath her feet sparkled with an otherworldly light.',
            order: 1
          },
          {
            id: Date.now() + 5,
            type: 'image',
            content: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
            order: 2
          },
          {
            id: Date.now() + 6,
            type: 'text',
            content: '"Welcome to the Puzzle Valley!" said a wise rock golem. "To cross this valley, you must solve the matching puzzle before you. Match the symbols with their meanings!"',
            order: 3
          }
        ],
        assessment: {
          type: 'quiz',
          id: 'quiz_002_chapter2',
          required: true
        },
        createdAt: new Date().toISOString()
      }).mapValue.fields
    };

    await makeRequest('PATCH', `/stories/${storyId}/chapters/${chapter2Id}`, chapter2Data);
    console.log(`✅ Chapter 2 created: The Puzzle Valley`);

    // Chapter 3: The Final Challenge
    const chapter3Id = 'chapter_' + Date.now() + '_3';
    
    const chapter3Data = {
      fields: createFirestoreValue({
        title: 'The Final Challenge',
        description: 'The climax of Zara\'s journey awaits!',
        characterImage: '🏆',
        order: 3,
        contentBlocks: [
          {
            id: Date.now() + 7,
            type: 'text',
            content: 'Zara finally reached the heart of the enchanted realm. Before her stood a magnificent crystal palace shimmering with mystical energy. The guardian of the realm appeared before her.',
            order: 1
          },
          {
            id: Date.now() + 8,
            type: 'image',
            content: 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=600&h=400&fit=crop',
            order: 2
          },
          {
            id: Date.now() + 9,
            type: 'text',
            content: '"You have come far, young adventurer," said the guardian. "But to claim your prize, you must face one final puzzle. This one will test all your knowledge and wisdom!"',
            order: 3
          }
        ],
        assessment: {
          type: 'quiz',
          id: 'quiz_003_chapter3',
          required: true
        },
        createdAt: new Date().toISOString()
      }).mapValue.fields
    };

    await makeRequest('PATCH', `/stories/${storyId}/chapters/${chapter3Id}`, chapter3Data);
    console.log(`✅ Chapter 3 created: The Final Challenge`);

    // Create sample quizzes
    const quiz1Data = {
      fields: createFirestoreValue({
        title: 'Forest Comprehension Quiz',
        description: 'Test your understanding of the forest adventure',
        difficulty: 'easy',
        xp: 100,
        coins: 20,
        questions: [
          {
            id: 'q1',
            text: 'What was the first creature Zara met in the forest?',
            options: ['A Wise Owl', 'A Fox', 'A Rabbit', 'A Deer'],
            correctAnswer: 0,
            explanation: 'The owl greeted Zara as she entered the forest.'
          },
          {
            id: 'q2',
            text: 'What did the owl ask Zara to do?',
            options: ['Fight a dragon', 'Answer three questions', 'Climb a mountain', 'Find a treasure'],
            correctAnswer: 1,
            explanation: 'The owl asked Zara to answer three questions about reading comprehension.'
          }
        ],
        createdAt: new Date().toISOString(),
        totalQuestions: 2
      }).mapValue.fields
    };

    await makeRequest('PATCH', '/quizzes/quiz_001_chapter1', quiz1Data);
    console.log('✅ Quiz created: Forest Comprehension Quiz (2 questions)');

    // Create quiz for chapter 2
    const quiz2Data = {
      fields: createFirestoreValue({
        title: 'Puzzle Valley Challenge Quiz',
        description: 'Test your understanding of the valley adventure',
        difficulty: 'medium',
        xp: 125,
        coins: 25,
        questions: [
          {
            id: 'q1',
            text: 'What did Zara find in the hidden valley?',
            options: ['A dark cave', 'Colorful rocks and crystals', 'A treasure chest', 'An ancient temple'],
            correctAnswer: 1,
            explanation: 'The valley was filled with colorful rocks and crystals that sparkled with otherworldly light.'
          },
          {
            id: 'q2',
            text: 'Who helped Zara in the Puzzle Valley?',
            options: ['The owl', 'A rock golem', 'A magical dragon', 'A wise old woman'],
            correctAnswer: 1,
            explanation: 'The wise rock golem helped Zara by presenting the matching puzzle.'
          },
          {
            id: 'q3',
            text: 'What kind of puzzle did Zara need to solve?',
            options: ['A number sequence', 'Symbol matching', 'Word puzzle', 'A riddle'],
            correctAnswer: 1,
            explanation: 'Zara had to match symbols with their meanings to cross the valley.'
          }
        ],
        createdAt: new Date().toISOString(),
        totalQuestions: 3
      }).mapValue.fields
    };

    await makeRequest('PATCH', '/quizzes/quiz_002_chapter2', quiz2Data);
    console.log('✅ Quiz created: Puzzle Valley Challenge Quiz (3 questions)');

    // Create quiz for chapter 3
    const quiz3Data = {
      fields: createFirestoreValue({
        title: 'Final Challenge Quiz',
        description: 'Test your knowledge of the complete adventure',
        difficulty: 'hard',
        xp: 150,
        coins: 30,
        questions: [
          {
            id: 'q1',
            text: 'What was the main theme of Zara\'s adventure?',
            options: ['Courage and perseverance', 'Running away', 'Finding treasure', 'Meeting friends'],
            correctAnswer: 0,
            explanation: 'Throughout her journey, Zara demonstrated courage by facing each challenge.'
          },
          {
            id: 'q2',
            text: 'Which puzzle did Zara solve in the valley?',
            options: ['Number sequence', 'Symbol matching', 'Word puzzle', 'Logic puzzle'],
            correctAnswer: 1,
            explanation: 'In the Puzzle Valley, Zara solved the symbol matching puzzle with the rock golem.'
          },
          {
            id: 'q3',
            text: 'What reward did Zara receive for completing her adventure?',
            options: ['A magical crystal', 'A treasure chest', 'A guardian\'s blessing', 'A map to new lands'],
            correctAnswer: 2,
            explanation: 'The guardian blessed Zara for completing all challenges with wisdom and courage.'
          }
        ],
        createdAt: new Date().toISOString(),
        totalQuestions: 3
      }).mapValue.fields
    };

    await makeRequest('PATCH', '/quizzes/quiz_003_chapter3', quiz3Data);
    console.log('✅ Quiz created: Final Challenge Quiz (3 questions)');

    // Create sample puzzles
    const puzzle1Data = {
      fields: createFirestoreValue({
        title: 'Symbol Matching',
        description: 'Match the symbols with their meanings',
        type: 'matching',
        difficulty: 'easy',
        xp: 80,
        coins: 15,
        pairs: [
          { id: 'pair1', left: '⭐', right: 'Hope' },
          { id: 'pair2', left: '❤️', right: 'Love' },
          { id: 'pair3', left: '🔥', right: 'Energy' },
          { id: 'pair4', left: '💎', right: 'Value' }
        ],
        createdAt: new Date().toISOString()
      }).mapValue.fields
    };

    await makeRequest('PATCH', '/puzzles/puzzle_001_matching', puzzle1Data);
    console.log('✅ Puzzle 1 created: Symbol Matching (4 pairs)');

    const puzzle2Data = {
      fields: createFirestoreValue({
        title: 'Number Sequence',
        description: 'Complete the sequence',
        type: 'sequence',
        difficulty: 'medium',
        xp: 120,
        coins: 25,
        sequence: [2, 4, 6, 8, null, 12, 14],
        options: [9, 10, 11, 12, 13],
        correctAnswer: 2,
        createdAt: new Date().toISOString()
      }).mapValue.fields
    };

    await makeRequest('PATCH', '/puzzles/puzzle_002_sequence', puzzle2Data);
    console.log('✅ Puzzle 2 created: Number Sequence Puzzle');

    console.log('\n' + '='.repeat(60));
    console.log('✅ SUCCESS! Sample story created!\n');
    console.log('Story Details:');
    console.log('  Title: "The Adventure Chronicles"');
    console.log('  Chapters: 3 (with images and text)');
    console.log('  Quiz: 1 (2 questions)');
    console.log('  Puzzles: 2 (matching + sequence)');
    console.log(`\n📖 View in Admin: http://localhost:3001/admin/stories`);
    console.log(`👁️  Preview Story: http://localhost:3001/story/${storyId}`);
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating sample story:', error.message);
    console.error('\nMake sure:');
    console.error('  ✓ You have internet connection');
    console.error('  ✓ Firebase project is active');
    console.error('  ✓ Firestore database exists');
    console.error('  ✓ API key has correct permissions\n');
    process.exit(1);
  }
}

addSampleStory();
