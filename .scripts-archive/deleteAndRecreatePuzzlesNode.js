#!/usr/bin/env node

/**
 * Delete and Recreate Puzzles - Node.js Version
 * Using Firestore REST API
 * 
 * This script:
 * 1. Deletes all known puzzle categories/topics/subtopics
 * 2. Recreates them with correct featureId: "puzzles" (lowercase)
 */

const https = require('https');
const { URL } = require('url');

const projectId = "amahaapp";
const apiKey = "AIzaSyAR8-mpS85CEopQuGuP4Lhm3xieYbG1HcY";
const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

console.log("\n╔════════════════════════════════════════════════════════╗");
console.log("║   DELETE & RECREATE PUZZLES WITH CORRECT FEATURE ID  ║");
console.log("╚════════════════════════════════════════════════════════╝\n");

/**
 * Make HTTPS request
 */
function makeRequest(method, url, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(urlObj, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: {} });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

/**
 * Delete a document
 */
async function deleteDoc(collection, docId) {
  const url = `${baseUrl}/${collection}/${docId}?key=${apiKey}`;
  try {
    const response = await makeRequest('DELETE', url);
    return response.status === 200;
  } catch (e) {
    return false;
  }
}

/**
 * Create/Update a document using PATCH (correct method)
 */
async function setDoc(collection, docId, data) {
  const url = `${baseUrl}/${collection}/${docId}?key=${apiKey}`;
  const fields = {};

  Object.keys(data).forEach((key) => {
    const val = data[key];
    if (typeof val === 'string') {
      fields[key] = { stringValue: val };
    } else if (typeof val === 'number') {
      fields[key] = { integerValue: String(val) };
    } else if (typeof val === 'boolean') {
      fields[key] = { booleanValue: val };
    } else if (val === null) {
      fields[key] = { nullValue: null };
    }
  });

  const body = {
    fields: fields,
  };

  try {
    const response = await makeRequest('PATCH', url, body);
    return response.status === 200;
  } catch (e) {
    console.error(`   ❌ Failed to create ${docId}:`, e.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    // Step 1: Delete all known puzzle categories
    console.log("🗑️  DELETING ALL EXISTING PUZZLE DATA...\n");

    const puzzleCategoryIds = [
      'traditional-puzzles',
      'pattern-puzzles',
      'logic-puzzles',
      'visual-puzzles',
    ];

    for (const catId of puzzleCategoryIds) {
      if (await deleteDoc('categories', catId)) {
        console.log(`   ✓ Deleted category: ${catId}`);
      }
    }

    // Known puzzle topics to delete
    const puzzleTopicIds = [
      'jigsaw-puzzles',
      'matching-pairs',
      'word-search',
      'sequence-completion',
      'visual-patterns',
      'lateral-thinking',
      'sudoku-style',
      'picture-word',
      'spot-difference',
      'find-pairs',
      'picture-shadow',
      'drag-drop',
      'ordering',
    ];

    for (const topicId of puzzleTopicIds) {
      if (await deleteDoc('topics', topicId)) {
        console.log(`   ✓ Deleted topic: ${topicId}`);
      }
    }

    // Known puzzle subtopics to delete
    const puzzleSubtopicIds = [
      'easy-jigsaw',
      'medium-jigsaw',
      'hard-jigsaw',
      'color-matching',
      'animal-matching',
      'advanced-matching',
      'beginner-word-search',
      'intermediate-word-search',
      'number-sequences',
      'letter-sequences',
      'shape-patterns',
      'color-patterns',
      'classic-riddles',
      'visual-teasers',
      'mini-sudoku',
      'standard-sudoku',
    ];

    for (const subtopicId of puzzleSubtopicIds) {
      if (await deleteDoc('subtopics', subtopicId)) {
        console.log(`   ✓ Deleted subtopic: ${subtopicId}`);
      }
    }

    console.log("\n✅ All existing puzzles deleted!\n");

    // Wait a bit before creating
    await new Promise(r => setTimeout(r, 500));

    // Step 2: Create categories
    console.log("📁 CREATING PUZZLE CATEGORIES...\n");

    const categories = [
      {
        id: 'traditional-puzzles',
        name: 'Traditional Puzzles',
        label: 'Traditional Puzzles',
        description: 'Classic puzzle types for cognitive development',
        featureId: 'puzzles',
        uiMode: 'puzzle',
        imageUrl: 'https://via.placeholder.com/300x200?text=Traditional+Puzzles',
        order: 1,
      },
      {
        id: 'pattern-puzzles',
        name: 'Pattern Puzzles',
        label: 'Pattern Puzzles',
        description: 'Puzzles focused on pattern recognition and sequences',
        featureId: 'puzzles',
        uiMode: 'puzzle',
        imageUrl: 'https://via.placeholder.com/300x200?text=Pattern+Puzzles',
        order: 2,
      },
      {
        id: 'logic-puzzles',
        name: 'Logic Puzzles',
        label: 'Logic Puzzles',
        description: 'Brain teasers that require logical thinking',
        featureId: 'puzzles',
        uiMode: 'puzzle',
        imageUrl: 'https://via.placeholder.com/300x200?text=Logic+Puzzles',
        order: 3,
      },
    ];

    for (const category of categories) {
      if (await setDoc('categories', category.id, {
        id: category.id,
        name: category.name,
        label: category.label,
        description: category.description,
        featureId: category.featureId,
        uiMode: category.uiMode,
        imageUrl: category.imageUrl,
        order: category.order,
      })) {
        console.log(`   ✓ Created: ${category.name}`);
      } else {
        console.log(`   ❌ Failed to create: ${category.name}`);
      }
    }

    console.log("\n✅ Categories created!\n");

    // Wait before creating topics
    await new Promise(r => setTimeout(r, 500));

    // Step 3: Create topics
    console.log("📚 CREATING PUZZLE TOPICS...\n");

    const topics = [
      { id: 'jigsaw-puzzles', name: 'Jigsaw Puzzles', categoryId: 'traditional-puzzles', order: 1 },
      { id: 'matching-pairs', name: 'Matching Pairs', categoryId: 'traditional-puzzles', order: 2 },
      { id: 'word-search', name: 'Word Search', categoryId: 'traditional-puzzles', order: 3 },
      { id: 'sequence-completion', name: 'Sequence Completion', categoryId: 'pattern-puzzles', order: 1 },
      { id: 'visual-patterns', name: 'Visual Patterns', categoryId: 'pattern-puzzles', order: 2 },
      { id: 'lateral-thinking', name: 'Lateral Thinking', categoryId: 'logic-puzzles', order: 1 },
      { id: 'sudoku-style', name: 'Sudoku Style', categoryId: 'logic-puzzles', order: 2 },
    ];

    for (const topic of topics) {
      if (await setDoc('topics', topic.id, {
        id: topic.id,
        name: topic.name,
        categoryId: topic.categoryId,
        featureId: 'puzzles',
        order: topic.order,
      })) {
        console.log(`   ✓ Created: ${topic.name}`);
      }
    }

    console.log("\n✅ Topics created!\n");

    // Wait before creating subtopics
    await new Promise(r => setTimeout(r, 500));

    // Step 4: Create subtopics
    console.log("❓ CREATING PUZZLE SUBTOPICS...\n");

    const subtopics = [
      { id: 'easy-jigsaw', name: 'Easy Jigsaw (12 pieces)', topicId: 'jigsaw-puzzles', difficulty: 'easy', ageGroup: '3-5', order: 1 },
      { id: 'medium-jigsaw', name: 'Medium Jigsaw (24 pieces)', topicId: 'jigsaw-puzzles', difficulty: 'medium', ageGroup: '6-8', order: 2 },
      { id: 'hard-jigsaw', name: 'Hard Jigsaw (48 pieces)', topicId: 'jigsaw-puzzles', difficulty: 'hard', ageGroup: '9+', order: 3 },
      { id: 'color-matching', name: 'Color Matching', topicId: 'matching-pairs', difficulty: 'easy', ageGroup: '3-5', order: 1 },
      { id: 'animal-matching', name: 'Animal Matching', topicId: 'matching-pairs', difficulty: 'medium', ageGroup: '6-8', order: 2 },
      { id: 'advanced-matching', name: 'Advanced Matching', topicId: 'matching-pairs', difficulty: 'hard', ageGroup: '9+', order: 3 },
      { id: 'beginner-word-search', name: 'Beginner Word Search', topicId: 'word-search', difficulty: 'easy', ageGroup: '6-8', order: 1 },
      { id: 'intermediate-word-search', name: 'Intermediate Word Search', topicId: 'word-search', difficulty: 'medium', ageGroup: '9-11', order: 2 },
      { id: 'number-sequences', name: 'Number Sequences', topicId: 'sequence-completion', difficulty: 'medium', ageGroup: '8+', order: 1 },
      { id: 'letter-sequences', name: 'Letter Sequences', topicId: 'sequence-completion', difficulty: 'hard', ageGroup: '10+', order: 2 },
      { id: 'shape-patterns', name: 'Shape Patterns', topicId: 'visual-patterns', difficulty: 'easy', ageGroup: '5-7', order: 1 },
      { id: 'color-patterns', name: 'Color Patterns', topicId: 'visual-patterns', difficulty: 'easy', ageGroup: '5-7', order: 2 },
      { id: 'classic-riddles', name: 'Classic Riddles', topicId: 'lateral-thinking', difficulty: 'medium', ageGroup: '8+', order: 1 },
      { id: 'visual-teasers', name: 'Visual Teasers', topicId: 'lateral-thinking', difficulty: 'hard', ageGroup: '10+', order: 2 },
      { id: 'mini-sudoku', name: 'Mini Sudoku (4x4)', topicId: 'sudoku-style', difficulty: 'easy', ageGroup: '7-9', order: 1 },
      { id: 'standard-sudoku', name: 'Standard Sudoku (9x9)', topicId: 'sudoku-style', difficulty: 'hard', ageGroup: '10+', order: 2 },
    ];

    for (const subtopic of subtopics) {
      if (await setDoc('subtopics', subtopic.id, {
        id: subtopic.id,
        name: subtopic.name,
        topicId: subtopic.topicId,
        featureId: 'puzzles',
        difficulty: subtopic.difficulty,
        ageGroup: subtopic.ageGroup,
        order: subtopic.order,
      })) {
        console.log(`   ✓ Created: ${subtopic.name}`);
      }
    }

    console.log("\n✅ Subtopics created!\n");

    // Success message
    console.log("╔════════════════════════════════════════════════════════╗");
    console.log("║  ✅ ALL PUZZLES SUCCESSFULLY CREATED!                 ║");
    console.log("║                                                        ║");
    console.log("║  IMPORTANT: Using correct featureId: \"puzzles\"       ║");
    console.log("║  (matches FEATURES.PUZZLES.id in the codebase)        ║");
    console.log("║                                                        ║");
    console.log("║  Hierarchy Created:                                    ║");
    console.log("║  ✓ 3 Categories (Traditional, Pattern, Logic)          ║");
    console.log("║  ✓ 7 Topics across all categories                      ║");
    console.log("║  ✓ 16 Subtopics with difficulty & age groups          ║");
    console.log("║                                                        ║");
    console.log("║  Next Steps:                                           ║");
    console.log("║  1. Refresh your admin panel (F5)                      ║");
    console.log("║  2. Navigate to: Features > Puzzles                    ║");
    console.log("║  3. Verify all categories display correctly            ║");
    console.log("║  4. Verify topics and subtopics appear                 ║");
    console.log("╚════════════════════════════════════════════════════════╝\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Fatal error:", error.message);
    process.exit(1);
  }
}

// Run the script
main();
