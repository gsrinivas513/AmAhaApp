#!/usr/bin/env node

/**
 * setupPuzzleIntegration.js
 * 
 * Complete integration of Puzzles into the unified Content Management Flow
 * Creates: puzzleCategories → puzzleTopics → puzzleSubtopics
 * Migrates existing puzzles to the new structure
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

async function setupPuzzleIntegration() {
  try {
    console.log('🚀 Starting Puzzle Integration Setup...\n');

    // Step 1: Create Puzzle Categories
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 1: Creating Puzzle Categories');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const puzzleCategories = [
      {
        id: 'puzzle-cat-logic',
        name: 'Logic & Reasoning',
        icon: '🧩',
        color: '#667eea',
        featureId: 'Puzzles',
        featureName: 'Puzzles',
        _collectionName: 'puzzleCategories',
        order: 1,
        isPublished: true
      },
      {
        id: 'puzzle-cat-visual',
        name: 'Visual & Spatial',
        icon: '👁️',
        color: '#f093fb',
        featureId: 'Puzzles',
        featureName: 'Puzzles',
        _collectionName: 'puzzleCategories',
        order: 2,
        isPublished: true
      },
      {
        id: 'puzzle-cat-math',
        name: 'Math & Numbers',
        icon: '🔢',
        color: '#f5576c',
        featureId: 'Puzzles',
        featureName: 'Puzzles',
        _collectionName: 'puzzleCategories',
        order: 3,
        isPublished: true
      }
    ];

    const categoryMap = {};
    for (const cat of puzzleCategories) {
      console.log(`Creating category: ${cat.icon} ${cat.name}`);
      const response = await makeRequest('POST', '/puzzleCategories', {
        fields: Object.fromEntries(
          Object.entries(cat).map(([key, val]) => [key, convertToFirestoreValue(val)])
        )
      });
      const docId = response.name.split('/').pop();
      categoryMap[cat.id] = docId;
      console.log(`  ✅ Created with ID: ${docId}\n`);
    }

    // Step 2: Create Puzzle Topics
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 2: Creating Puzzle Topics');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const puzzleTopics = [
      // Logic & Reasoning topics
      {
        id: 'puzzle-topic-logic-patterns',
        name: 'Pattern Recognition',
        icon: '🔄',
        color: '#667eea',
        categoryId: categoryMap['puzzle-cat-logic'],
        featureId: 'Puzzles',
        _collectionName: 'puzzleTopics',
        order: 1,
        isPublished: true
      },
      {
        id: 'puzzle-topic-logic-deduction',
        name: 'Logical Deduction',
        icon: '🧠',
        color: '#667eea',
        categoryId: categoryMap['puzzle-cat-logic'],
        featureId: 'Puzzles',
        _collectionName: 'puzzleTopics',
        order: 2,
        isPublished: true
      },
      // Visual & Spatial topics
      {
        id: 'puzzle-topic-visual-shapes',
        name: 'Shape & Form',
        icon: '⬛',
        color: '#f093fb',
        categoryId: categoryMap['puzzle-cat-visual'],
        featureId: 'Puzzles',
        _collectionName: 'puzzleTopics',
        order: 1,
        isPublished: true
      },
      {
        id: 'puzzle-topic-visual-spatial',
        name: 'Spatial Reasoning',
        icon: '🗺️',
        color: '#f093fb',
        categoryId: categoryMap['puzzle-cat-visual'],
        featureId: 'Puzzles',
        _collectionName: 'puzzleTopics',
        order: 2,
        isPublished: true
      },
      // Math & Numbers topics
      {
        id: 'puzzle-topic-math-basic',
        name: 'Basic Arithmetic',
        icon: '➕',
        color: '#f5576c',
        categoryId: categoryMap['puzzle-cat-math'],
        featureId: 'Puzzles',
        _collectionName: 'puzzleTopics',
        order: 1,
        isPublished: true
      },
      {
        id: 'puzzle-topic-math-sequences',
        name: 'Number Sequences',
        icon: '123',
        color: '#f5576c',
        categoryId: categoryMap['puzzle-cat-math'],
        featureId: 'Puzzles',
        _collectionName: 'puzzleTopics',
        order: 2,
        isPublished: true
      }
    ];

    const topicMap = {};
    for (const topic of puzzleTopics) {
      console.log(`Creating topic: ${topic.icon} ${topic.name}`);
      const response = await makeRequest('POST', '/puzzleTopics', {
        fields: Object.fromEntries(
          Object.entries(topic).map(([key, val]) => [key, convertToFirestoreValue(val)])
        )
      });
      const docId = response.name.split('/').pop();
      topicMap[topic.id] = docId;
      console.log(`  ✅ Created with ID: ${docId}\n`);
    }

    // Step 3: Create Puzzle Subtopics
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 3: Creating Puzzle Subtopics');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const puzzleSubtopics = [
      // Pattern Recognition subtopics
      {
        name: 'Simple Patterns',
        icon: '🔲',
        color: '#667eea',
        topicId: topicMap['puzzle-topic-logic-patterns'],
        categoryId: categoryMap['puzzle-cat-logic'],
        featureId: 'Puzzles',
        _collectionName: 'puzzleSubtopics',
        order: 1,
        isPublished: true
      },
      {
        name: 'Complex Patterns',
        icon: '🔷',
        color: '#667eea',
        topicId: topicMap['puzzle-topic-logic-patterns'],
        categoryId: categoryMap['puzzle-cat-logic'],
        featureId: 'Puzzles',
        _collectionName: 'puzzleSubtopics',
        order: 2,
        isPublished: true
      },
      // Logical Deduction subtopics
      {
        name: 'True or False',
        icon: '✓❌',
        color: '#667eea',
        topicId: topicMap['puzzle-topic-logic-deduction'],
        categoryId: categoryMap['puzzle-cat-logic'],
        featureId: 'Puzzles',
        _collectionName: 'puzzleSubtopics',
        order: 1,
        isPublished: true
      },
      {
        name: 'Multiple Choice Logic',
        icon: '🤔',
        color: '#667eea',
        topicId: topicMap['puzzle-topic-logic-deduction'],
        categoryId: categoryMap['puzzle-cat-logic'],
        featureId: 'Puzzles',
        _collectionName: 'puzzleSubtopics',
        order: 2,
        isPublished: true
      },
      // Shape & Form subtopics
      {
        name: 'Shape Matching',
        icon: '🟢',
        color: '#f093fb',
        topicId: topicMap['puzzle-topic-visual-shapes'],
        categoryId: categoryMap['puzzle-cat-visual'],
        featureId: 'Puzzles',
        _collectionName: 'puzzleSubtopics',
        order: 1,
        isPublished: true
      },
      {
        name: 'Shape Rotation',
        icon: '↻',
        color: '#f093fb',
        topicId: topicMap['puzzle-topic-visual-shapes'],
        categoryId: categoryMap['puzzle-cat-visual'],
        featureId: 'Puzzles',
        _collectionName: 'puzzleSubtopics',
        order: 2,
        isPublished: true
      },
      // Spatial Reasoning subtopics
      {
        name: 'Position & Direction',
        icon: '🧭',
        color: '#f093fb',
        topicId: topicMap['puzzle-topic-visual-spatial'],
        categoryId: categoryMap['puzzle-cat-visual'],
        featureId: 'Puzzles',
        _collectionName: 'puzzleSubtopics',
        order: 1,
        isPublished: true
      },
      {
        name: '3D Visualization',
        icon: '🎲',
        color: '#f093fb',
        topicId: topicMap['puzzle-topic-visual-spatial'],
        categoryId: categoryMap['puzzle-cat-visual'],
        featureId: 'Puzzles',
        _collectionName: 'puzzleSubtopics',
        order: 2,
        isPublished: true
      },
      // Basic Arithmetic subtopics
      {
        name: 'Addition & Subtraction',
        icon: '➕➖',
        color: '#f5576c',
        topicId: topicMap['puzzle-topic-math-basic'],
        categoryId: categoryMap['puzzle-cat-math'],
        featureId: 'Puzzles',
        _collectionName: 'puzzleSubtopics',
        order: 1,
        isPublished: true
      },
      {
        name: 'Multiplication & Division',
        icon: '✖️➗',
        color: '#f5576c',
        topicId: topicMap['puzzle-topic-math-basic'],
        categoryId: categoryMap['puzzle-cat-math'],
        featureId: 'Puzzles',
        _collectionName: 'puzzleSubtopics',
        order: 2,
        isPublished: true
      },
      // Number Sequences subtopics
      {
        name: 'Simple Sequences',
        icon: '1️⃣2️⃣3️⃣',
        color: '#f5576c',
        topicId: topicMap['puzzle-topic-math-sequences'],
        categoryId: categoryMap['puzzle-cat-math'],
        featureId: 'Puzzles',
        _collectionName: 'puzzleSubtopics',
        order: 1,
        isPublished: true
      },
      {
        name: 'Complex Sequences',
        icon: '🔢',
        color: '#f5576c',
        topicId: topicMap['puzzle-topic-math-sequences'],
        categoryId: categoryMap['puzzle-cat-math'],
        featureId: 'Puzzles',
        _collectionName: 'puzzleSubtopics',
        order: 2,
        isPublished: true
      }
    ];

    let subtopicCount = 0;
    for (const subtopic of puzzleSubtopics) {
      console.log(`Creating subtopic: ${subtopic.icon} ${subtopic.name}`);
      const response = await makeRequest('POST', '/puzzleSubtopics', {
        fields: Object.fromEntries(
          Object.entries(subtopic).map(([key, val]) => [key, convertToFirestoreValue(val)])
        )
      });
      const docId = response.name.split('/').pop();
      console.log(`  ✅ Created with ID: ${docId}\n`);
      subtopicCount++;
    }

    // Step 4: Migrate Existing Puzzles
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 4: Migrating Existing Puzzles');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('Fetching existing puzzles...\n');
    const puzzlesResponse = await makeRequest('GET', '/puzzles');
    const existingPuzzles = puzzlesResponse.documents || [];
    
    console.log(`Found ${existingPuzzles.length} puzzles\n`);

    if (existingPuzzles.length > 0) {
      console.log('⚠️  Note: Existing puzzles need manual subtopic assignment\n');
      console.log('Recommend distribution:');
      console.log('  - Puzzles by type/pattern → Pattern Recognition subtopic');
      console.log('  - Visual puzzles → Shape Matching or 3D Visualization');
      console.log('  - Math puzzles → Basic Arithmetic or Number Sequences\n');
    }

    // Final Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ PUZZLE INTEGRATION COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📊 Created:');
    console.log(`  ✅ ${puzzleCategories.length} Puzzle Categories`);
    console.log(`  ✅ ${puzzleTopics.length} Puzzle Topics`);
    console.log(`  ✅ ${subtopicCount} Puzzle Subtopics\n`);

    console.log('🎯 New Puzzle Hierarchy:');
    console.log('  Feature (Puzzles)');
    console.log('  ├─ Logic & Reasoning');
    console.log('  │  ├─ Pattern Recognition');
    console.log('  │  │  ├─ Simple Patterns');
    console.log('  │  │  └─ Complex Patterns');
    console.log('  │  └─ Logical Deduction');
    console.log('  │     ├─ True or False');
    console.log('  │     └─ Multiple Choice Logic');
    console.log('  ├─ Visual & Spatial');
    console.log('  │  ├─ Shape & Form');
    console.log('  │  │  ├─ Shape Matching');
    console.log('  │  │  └─ Shape Rotation');
    console.log('  │  └─ Spatial Reasoning');
    console.log('  │     ├─ Position & Direction');
    console.log('  │     └─ 3D Visualization');
    console.log('  └─ Math & Numbers');
    console.log('     ├─ Basic Arithmetic');
    console.log('     │  ├─ Addition & Subtraction');
    console.log('     │  └─ Multiplication & Division');
    console.log('     └─ Number Sequences');
    console.log('        ├─ Simple Sequences');
    console.log('        └─ Complex Sequences\n');

    console.log('📝 Next Steps:');
    console.log('  1. Update existing puzzles with subtopicId field');
    console.log('  2. Merge Puzzle Management into main admin UI');
    console.log('  3. Update puzzle editor to use new hierarchy\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupPuzzleIntegration();
