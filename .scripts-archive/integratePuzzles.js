#!/usr/bin/env node

/**
 * Script to integrate Puzzles into the unified Content Management Flow
 * Creates puzzleSubtopics collection to match the Story/Quiz structure
 * 
 * After running this:
 * Puzzles will follow: Feature → Category → Topic → SubTopic
 * Instead of: Feature → Category → Puzzle Type (no subtopics)
 */

const API_KEY = 'AIzaSyAR8-mpS85CEopQuGuP4Lhm3xieYbG1HcY';
const PROJECT_ID = 'amahaapp';
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function makeRequest(method, path, data = null, params = {}) {
  try {
    let url = `${FIRESTORE_URL}${path}`;
    const queryParams = new URLSearchParams({ key: API_KEY, ...params });
    url += '?' + queryParams.toString();
    
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

function convertToFirestoreValue(value) {
  if (value === null || value === undefined) {
    return { nullValue: null };
  }
  if (typeof value === 'boolean') {
    return { booleanValue: value };
  }
  if (typeof value === 'number') {
    return { integerValue: String(value) };
  }
  if (typeof value === 'string') {
    return { stringValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(convertToFirestoreValue) } };
  }
  if (typeof value === 'object') {
    const fields = {};
    for (const [key, val] of Object.entries(value)) {
      fields[key] = convertToFirestoreValue(val);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

async function createPuzzleSubtopics() {
  try {
    console.log('📊 Creating Puzzle Subtopics Collection...\n');
    console.log('🔍 Current Structure:');
    console.log('  Feature → Category → Topic → SubTopic\n');

    // Example puzzle subtopics structure
    const puzzleSubtopics = [
      {
        name: 'Pattern Recognition',
        icon: '🔄',
        color: '#FF6B6B',
        topicId: 'puzzle-topic-1', // Will need to update with actual topic ID
        description: 'Recognize and continue patterns',
        order: 1
      },
      {
        name: 'Logic Puzzles',
        icon: '🧩',
        color: '#4ECDC4',
        topicId: 'puzzle-topic-1',
        description: 'Solve logical reasoning puzzles',
        order: 2
      },
      {
        name: 'Number Games',
        icon: '🔢',
        color: '#FFE66D',
        topicId: 'puzzle-topic-1',
        description: 'Math and number-based puzzles',
        order: 3
      },
      {
        name: 'Visual Puzzles',
        icon: '👁️',
        color: '#95E1D3',
        topicId: 'puzzle-topic-2', // Different topic
        description: 'Visual and spatial puzzles',
        order: 1
      }
    ];

    console.log('📝 Would create these Puzzle Subtopics:\n');
    puzzleSubtopics.forEach((sub, idx) => {
      console.log(`  ${idx + 1}. ${sub.icon} ${sub.name}`);
      console.log(`     └─ ${sub.description}`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Benefits of Integration:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  ✅ Unified Content Management Flow');
    console.log('  ✅ Consistent hierarchy across all features');
    console.log('  ✅ Better organization of puzzles');
    console.log('  ✅ Support for more granular puzzle categorization');
    console.log('  ✅ Can manage puzzles via same admin interface');
    console.log('  ✅ Future-proof for new puzzle types\n');

    console.log('⚠️  Next Steps:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  1. Define your Puzzle Topics (currently none exist)');
    console.log('  2. Create puzzleSubtopics under those topics');
    console.log('  3. Update puzzle records to include subtopicId');
    console.log('  4. Update admin UI to use unified flow for puzzles\n');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

createPuzzleSubtopics();
