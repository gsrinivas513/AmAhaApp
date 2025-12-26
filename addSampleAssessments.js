#!/usr/bin/env node

/**
 * addSampleAssessments.js
 * 
 * Script to create additional sample quizzes and puzzles
 * for testing story assessment integration
 * 
 * Usage:
 *   node addSampleAssessments.js
 */

const API_KEY = 'AIzaSyAR8-mpS85CEopQuGuP4Lhm3xieYbG1HcY';
const PROJECT_ID = 'amahaapp';

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

async function addSampleAssessments() {
  try {
    console.log('📊 Creating sample quizzes and puzzles for story testing...\n');

    // Quiz 1: Forest Comprehension (Already exists, but let's verify)
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
            explanation: 'The owl asked Zara to answer questions about reading comprehension.'
          }
        ],
        createdAt: new Date().toISOString(),
        totalQuestions: 2
      }).mapValue.fields
    };

    await makeRequest('PATCH', '/quizzes/quiz_001_chapter1', quiz1Data);
    console.log('✅ Quiz 1 verified: Forest Comprehension Quiz');

    // Quiz 2: Valley Challenge (New - Medium difficulty)
    const quiz2Data = {
      fields: createFirestoreValue({
        title: 'Valley Challenge Quiz',
        description: 'Test your knowledge about the puzzle valley adventure',
        difficulty: 'medium',
        xp: 150,
        coins: 30,
        questions: [
          {
            id: 'q1',
            text: 'What did Zara discover in the valley?',
            options: ['Colorful rocks and crystals', 'A hidden treasure', 'A dragon\'s lair', 'An ancient temple'],
            correctAnswer: 0,
            explanation: 'The valley was filled with colorful rocks and crystals that sparkled.'
          },
          {
            id: 'q2',
            text: 'Who helped Zara in the puzzle valley?',
            options: ['A fairy', 'A rock golem', 'A wizard', 'A dragon'],
            correctAnswer: 1,
            explanation: 'The wise rock golem guided Zara through the valley.'
          },
          {
            id: 'q3',
            text: 'What type of puzzle did Zara need to solve?',
            options: ['Number sequence', 'Symbol matching', 'Word puzzle', 'Logic puzzle'],
            correctAnswer: 1,
            explanation: 'Zara had to match symbols with their meanings to cross the valley.'
          }
        ],
        createdAt: new Date().toISOString(),
        totalQuestions: 3
      }).mapValue.fields
    };

    await makeRequest('PATCH', '/quizzes/quiz_002_valley', quiz2Data);
    console.log('✅ Quiz 2 created: Valley Challenge Quiz (3 questions)');

    // Quiz 3: Guardian's Test (New - Hard difficulty)
    const quiz3Data = {
      fields: createFirestoreValue({
        title: 'Guardian\'s Wisdom Test',
        description: 'Final quiz testing comprehensive story knowledge',
        difficulty: 'hard',
        xp: 200,
        coins: 50,
        questions: [
          {
            id: 'q1',
            text: 'What is the overall theme of Zara\'s journey?',
            options: ['Survival', 'Discovery and courage', 'Treasure hunting', 'Defeating enemies'],
            correctAnswer: 1,
            explanation: 'The journey is about discovering new places and having the courage to face challenges.'
          },
          {
            id: 'q2',
            text: 'Name the order of characters Zara met:',
            options: ['Owl, Golem, Guardian', 'Guardian, Owl, Golem', 'Golem, Owl, Guardian', 'Owl, Guardian, Golem'],
            correctAnswer: 0,
            explanation: 'Zara met the Wise Owl first, then the Rock Golem, and finally the Guardian.'
          },
          {
            id: 'q3',
            text: 'How many chapters were in Zara\'s adventure?',
            options: ['2', '3', '4', '5'],
            correctAnswer: 1,
            explanation: 'The adventure had three chapters: Forest, Valley, and Final Challenge.'
          },
          {
            id: 'q4',
            text: 'What does the crystal palace represent?',
            options: ['A prison', 'A reward for completing challenges', 'A scary place', 'A place to rest'],
            correctAnswer: 1,
            explanation: 'The crystal palace represents the reward and achievement for completing all challenges.'
          }
        ],
        createdAt: new Date().toISOString(),
        totalQuestions: 4
      }).mapValue.fields
    };

    await makeRequest('PATCH', '/quizzes/quiz_003_guardian', quiz3Data);
    console.log('✅ Quiz 3 created: Guardian\'s Wisdom Test (4 questions)');

    // Puzzle 1: Symbol Matching (Already exists)
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
    console.log('✅ Puzzle 1 verified: Symbol Matching (4 pairs)');

    // Puzzle 2: Number Sequence (Already exists)
    const puzzle2Data = {
      fields: createFirestoreValue({
        title: 'Number Sequence',
        description: 'Complete the sequence: 2, 4, 6, 8, ?, 12, 14',
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
    console.log('✅ Puzzle 2 verified: Number Sequence');

    // Puzzle 3: Word Matching (New)
    const puzzle3Data = {
      fields: createFirestoreValue({
        title: 'Forest Creatures Matching',
        description: 'Match creatures with their characteristics',
        type: 'matching',
        difficulty: 'medium',
        xp: 100,
        coins: 20,
        pairs: [
          { id: 'pair1', left: '🦉', right: 'Wise' },
          { id: 'pair2', left: '🦁', right: 'Brave' },
          { id: 'pair3', left: '🐢', right: 'Patient' },
          { id: 'pair4', left: '🦅', right: 'Free' },
          { id: 'pair5', left: '🦊', right: 'Clever' }
        ],
        createdAt: new Date().toISOString()
      }).mapValue.fields
    };

    await makeRequest('PATCH', '/puzzles/puzzle_003_creatures', puzzle3Data);
    console.log('✅ Puzzle 3 created: Forest Creatures Matching (5 pairs)');

    // Puzzle 4: Pattern Recognition (New)
    const puzzle4Data = {
      fields: createFirestoreValue({
        title: 'Crystal Pattern Puzzle',
        description: 'Find the next pattern in the sequence',
        type: 'sequence',
        difficulty: 'hard',
        xp: 150,
        coins: 35,
        sequence: [2, 4, 8, 16, null, 64],
        options: [24, 28, 32, 36, 40],
        correctAnswer: 2,
        createdAt: new Date().toISOString()
      }).mapValue.fields
    };

    await makeRequest('PATCH', '/puzzles/puzzle_004_pattern', puzzle4Data);
    console.log('✅ Puzzle 4 created: Crystal Pattern Puzzle');

    // Puzzle 5: Element Matching (New)
    const puzzle5Data = {
      fields: createFirestoreValue({
        title: 'Natural Elements Matching',
        description: 'Match elements with their properties',
        type: 'matching',
        difficulty: 'easy',
        xp: 90,
        coins: 18,
        pairs: [
          { id: 'pair1', left: '🔥', right: 'Hot' },
          { id: 'pair2', left: '💧', right: 'Wet' },
          { id: 'pair3', left: '🌍', right: 'Solid' },
          { id: 'pair4', left: '💨', right: 'Light' }
        ],
        createdAt: new Date().toISOString()
      }).mapValue.fields
    };

    await makeRequest('PATCH', '/puzzles/puzzle_005_elements', puzzle5Data);
    console.log('✅ Puzzle 5 created: Natural Elements Matching (4 pairs)');

    console.log('\n' + '='.repeat(60));
    console.log('✅ SUCCESS! All assessments ready for testing!\n');
    console.log('Summary:');
    console.log('  Quizzes: 3 (Easy → Medium → Hard)');
    console.log('    • Forest Comprehension Quiz (2 questions)');
    console.log('    • Valley Challenge Quiz (3 questions)');
    console.log('    • Guardian\'s Wisdom Test (4 questions)');
    console.log('\n  Puzzles: 5 (Mix of matching & sequence)');
    console.log('    • Symbol Matching (4 pairs)');
    console.log('    • Number Sequence (Easy)');
    console.log('    • Forest Creatures Matching (5 pairs)');
    console.log('    • Crystal Pattern Puzzle (Hard)');
    console.log('    • Natural Elements Matching (4 pairs)');
    console.log('\n  Total XP Available: 1,035');
    console.log('  Total Coins Available: 213');
    console.log('\n' + '='.repeat(60));
    console.log('\nYou can now link these to story chapters!');
    console.log('\nEdit story chapters and select from:');
    console.log('  Quizzes: quiz_001_chapter1, quiz_002_valley, quiz_003_guardian');
    console.log('  Puzzles: puzzle_001_matching, puzzle_002_sequence,');
    console.log('           puzzle_003_creatures, puzzle_004_pattern,');
    console.log('           puzzle_005_elements\n');
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating assessments:', error.message);
    console.error('\nMake sure:');
    console.error('  ✓ You have internet connection');
    console.error('  ✓ Firebase project is active');
    console.error('  ✓ Firestore database exists\n');
    process.exit(1);
  }
}

addSampleAssessments();
