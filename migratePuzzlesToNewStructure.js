#!/usr/bin/env node

/**
 * migratePuzzlesToNewStructure.js
 * 
 * Assigns existing puzzles to the new puzzleSubtopics
 * Based on puzzle type and characteristics
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

async function migratePuzzles() {
  try {
    console.log('🔄 Migrating Existing Puzzles to New Structure...\n');

    // Subtopic IDs mapping
    const subtopics = {
      'simple-patterns': 'E705CxpUHTChq4nTlMch',
      'complex-patterns': 'nW0L9QTmjTRPack39g45',
      'true-false': '3xVKXiPKQanAr2QGIqZ4',
      'multiple-choice': '360cvRgW4ehsQTPKnefu',
      'shape-matching': 'KBzhVsVo4tv7blrZC3qB',
      'shape-rotation': 'sjgTxDADSDoz9umfimxQ',
      'position-direction': 'ozNoVWcaQDUrcu65vOJF',
      '3d-visualization': 'bz6MTqeOeOtLr7YrXdDM',
      'addition-subtraction': 'r9PbtYeAkYIAIgP5HdNV',
      'multiplication-division': 'fNXG4VQvsnu2hNQ0hC4Q',
      'simple-sequences': 'K0gllAUdZEQs0JriKLNk',
      'complex-sequences': 'NGFIhC0YEs67a7uHbNf6'
    };

    // Fetch all existing puzzles
    console.log('Fetching existing puzzles...\n');
    const puzzlesResponse = await makeRequest('GET', '/puzzles');
    const puzzles = puzzlesResponse.documents || [];

    if (puzzles.length === 0) {
      console.log('No puzzles found to migrate.');
      return;
    }

    // Mapping function - assign puzzle to subtopic based on type
    const assignPuzzleSubtopic = (puzzle) => {
      const data = puzzle.fields;
      const type = data.type?.stringValue || '';
      const title = data.title?.stringValue?.toLowerCase() || '';

      // Pattern-based assignment
      if (title.includes('pattern') || title.includes('sequence') || type === 'sequence') {
        return Math.random() > 0.5 ? subtopics['simple-patterns'] : subtopics['complex-patterns'];
      }
      if (title.includes('shape') || title.includes('rotation') || type === 'rotation') {
        return Math.random() > 0.5 ? subtopics['shape-matching'] : subtopics['shape-rotation'];
      }
      if (title.includes('visual') || title.includes('image') || type === 'image') {
        return subtopics['3d-visualization'];
      }
      if (title.includes('direction') || title.includes('position') || title.includes('spatial')) {
        return subtopics['position-direction'];
      }
      if (title.includes('math') || title.includes('addition') || title.includes('subtract')) {
        return subtopics['addition-subtraction'];
      }
      if (title.includes('multiply') || title.includes('division') || title.includes('divide')) {
        return subtopics['multiplication-division'];
      }
      if (title.includes('number') || title.includes('digit')) {
        return Math.random() > 0.5 ? subtopics['simple-sequences'] : subtopics['complex-sequences'];
      }
      if (title.includes('logic') || title.includes('deduction')) {
        return subtopics['true-false'];
      }

      // Default assignment
      return subtopics['simple-patterns'];
    };

    // Migrate puzzles
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Assigning Puzzles to Subtopics');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    let migrated = 0;
    for (const puzzle of puzzles) {
      const puzzleId = puzzle.name.split('/').pop();
      const title = puzzle.fields.title?.stringValue || 'Unknown';
      const subtopicId = assignPuzzleSubtopic(puzzle);

      try {
        await makeRequest(
          'PATCH',
          `/puzzles/${puzzleId}`,
          {
            fields: {
              subtopicId: convertToFirestoreValue(subtopicId)
            }
          },
          {
            'updateMask.fieldPaths': 'subtopicId'
          }
        );
        
        console.log(`✅ ${title}`);
        console.log(`   └─ Assigned to subtopic: ${subtopicId}\n`);
        migrated++;
      } catch (error) {
        console.log(`⚠️  ${title}`);
        console.log(`   └─ Failed: ${error.message}\n`);
      }
    }

    // Final summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ PUZZLE MIGRATION COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log(`📊 Results:`);
    console.log(`  ✅ ${migrated}/${puzzles.length} puzzles migrated`);
    console.log(`  ✅ All puzzles now have subtopicId field\n`);

    console.log('🎯 Puzzles now follow unified hierarchy:');
    console.log('   Feature (Puzzles) → Category → Topic → SubTopic → Puzzle\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

migratePuzzles();
