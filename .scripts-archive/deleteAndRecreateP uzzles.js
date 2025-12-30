#!/usr/bin/env node

/**
 * Delete and Recreate Puzzles Script
 * 
 * This script:
 * 1. Deletes ALL existing puzzles and puzzle-related data
 * 2. Recreates puzzles with the unified Feature -> Category -> Topic -> SubTopic hierarchy
 * 
 * Usage:
 *   node deleteAndRecreatePuzzles.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT || 
  path.join(__dirname, 'firebase-service-account.json');

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error('❌ Firebase service account not found');
  console.error('Please create firebase-service-account.json from your Firebase Console');
  process.exit(1);
}

const db = admin.firestore();

/**
 * Delete all documents from a collection
 */
async function deleteCollection(collectionName, whereCondition = null) {
  console.log(`🗑️  Deleting from ${collectionName}...`);
  
  try {
    let query = db.collection(collectionName);
    
    if (whereCondition) {
      query = query.where(whereCondition.field, whereCondition.operator, whereCondition.value);
    }
    
    const snapshot = await query.get();
    console.log(`   Found ${snapshot.docs.length} documents to delete`);
    
    if (snapshot.docs.length === 0) {
      console.log(`   ✓ No documents to delete`);
      return;
    }
    
    // Delete in batches of 500
    const batch = db.batch();
    let batchCount = 0;
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
      batchCount++;
      
      if (batchCount === 500) {
        batch.commit();
        batchCount = 0;
      }
    });
    
    if (batchCount > 0) {
      await batch.commit();
    }
    
    console.log(`   ✓ Successfully deleted ${snapshot.docs.length} documents`);
  } catch (error) {
    console.error(`   ❌ Error deleting from ${collectionName}:`, error.message);
  }
}

/**
 * Delete all puzzle-related data
 */
async function deleteAllPuzzles() {
  console.log('\n🗑️  DELETING ALL EXISTING PUZZLES...\n');
  
  // Delete from regular collections (featureId: "Puzzles")
  await deleteCollection('categories', { field: 'featureId', operator: '==', value: 'Puzzles' });
  await deleteCollection('topics', { field: 'featureId', operator: '==', value: 'Puzzles' });
  await deleteCollection('subtopics', { field: 'featureId', operator: '==', value: 'Puzzles' });
  
  // Also delete any old separate puzzle collections if they exist
  await deleteCollection('puzzleCategories');
  await deleteCollection('puzzleTopics');
  await deleteCollection('puzzleSubtopics');
  await deleteCollection('puzzles');
  
  console.log('\n✅ All puzzles deleted successfully!\n');
}

/**
 * Create categories with unified structure
 */
async function createCategories() {
  console.log('\n📁 CREATING PUZZLE CATEGORIES...\n');
  
  const categories = [
    {
      id: 'traditional-puzzles',
      name: 'Traditional Puzzles',
      description: 'Classic puzzle types for cognitive development',
      featureId: 'Puzzles',
      imageUrl: 'https://via.placeholder.com/300x200?text=Traditional+Puzzles',
      order: 1
    },
    {
      id: 'pattern-puzzles',
      name: 'Pattern Puzzles',
      description: 'Puzzles focused on pattern recognition and sequences',
      featureId: 'Puzzles',
      imageUrl: 'https://via.placeholder.com/300x200?text=Pattern+Puzzles',
      order: 2
    },
    {
      id: 'logic-puzzles',
      name: 'Logic Puzzles',
      description: 'Brain teasers that require logical thinking',
      featureId: 'Puzzles',
      imageUrl: 'https://via.placeholder.com/300x200?text=Logic+Puzzles',
      order: 3
    }
  ];
  
  for (const category of categories) {
    try {
      await db.collection('categories').doc(category.id).set(category);
      console.log(`   ✓ Created category: ${category.name}`);
    } catch (error) {
      console.error(`   ❌ Error creating category ${category.id}:`, error.message);
    }
  }
  
  console.log('\n✅ All categories created!\n');
  return categories;
}

/**
 * Create topics with unified structure
 */
async function createTopics() {
  console.log('\n📚 CREATING PUZZLE TOPICS...\n');
  
  const topics = [
    // Traditional Puzzles topics
    {
      id: 'jigsaw-puzzles',
      name: 'Jigsaw Puzzles',
      description: 'Complete the jigsaw puzzle by placing pieces correctly',
      categoryId: 'traditional-puzzles',
      featureId: 'Puzzles',
      order: 1
    },
    {
      id: 'matching-pairs',
      name: 'Matching Pairs',
      description: 'Match pairs of identical or related items',
      categoryId: 'traditional-puzzles',
      featureId: 'Puzzles',
      order: 2
    },
    {
      id: 'word-search',
      name: 'Word Search',
      description: 'Find hidden words in a grid of letters',
      categoryId: 'traditional-puzzles',
      featureId: 'Puzzles',
      order: 3
    },
    
    // Pattern Puzzles topics
    {
      id: 'sequence-completion',
      name: 'Sequence Completion',
      description: 'Complete number and pattern sequences',
      categoryId: 'pattern-puzzles',
      featureId: 'Puzzles',
      order: 1
    },
    {
      id: 'visual-patterns',
      name: 'Visual Patterns',
      description: 'Identify and complete visual patterns',
      categoryId: 'pattern-puzzles',
      featureId: 'Puzzles',
      order: 2
    },
    
    // Logic Puzzles topics
    {
      id: 'lateral-thinking',
      name: 'Lateral Thinking',
      description: 'Solve puzzles that require creative thinking',
      categoryId: 'logic-puzzles',
      featureId: 'Puzzles',
      order: 1
    },
    {
      id: 'sudoku-style',
      name: 'Sudoku Style',
      description: 'Number placement puzzles',
      categoryId: 'logic-puzzles',
      featureId: 'Puzzles',
      order: 2
    }
  ];
  
  for (const topic of topics) {
    try {
      await db.collection('topics').doc(topic.id).set(topic);
      console.log(`   ✓ Created topic: ${topic.name} (${topic.categoryId})`);
    } catch (error) {
      console.error(`   ❌ Error creating topic ${topic.id}:`, error.message);
    }
  }
  
  console.log('\n✅ All topics created!\n');
  return topics;
}

/**
 * Create subtopics with unified structure
 */
async function createSubtopics() {
  console.log('\n❓ CREATING PUZZLE SUBTOPICS...\n');
  
  const subtopics = [
    // Jigsaw Puzzles subtopics
    {
      id: 'easy-jigsaw',
      name: 'Easy Jigsaw (12 pieces)',
      description: 'Large jigsaw pieces for younger children',
      topicId: 'jigsaw-puzzles',
      featureId: 'Puzzles',
      difficulty: 'easy',
      ageGroup: '3-5',
      order: 1
    },
    {
      id: 'medium-jigsaw',
      name: 'Medium Jigsaw (24 pieces)',
      description: 'Standard difficulty jigsaw puzzle',
      topicId: 'jigsaw-puzzles',
      featureId: 'Puzzles',
      difficulty: 'medium',
      ageGroup: '6-8',
      order: 2
    },
    {
      id: 'hard-jigsaw',
      name: 'Hard Jigsaw (48 pieces)',
      description: 'Challenging jigsaw puzzle',
      topicId: 'jigsaw-puzzles',
      featureId: 'Puzzles',
      difficulty: 'hard',
      ageGroup: '9+',
      order: 3
    },
    
    // Matching Pairs subtopics
    {
      id: 'color-matching',
      name: 'Color Matching',
      description: 'Match colors with names',
      topicId: 'matching-pairs',
      featureId: 'Puzzles',
      difficulty: 'easy',
      ageGroup: '3-5',
      order: 1
    },
    {
      id: 'animal-matching',
      name: 'Animal Matching',
      description: 'Match animals with their habitats',
      topicId: 'matching-pairs',
      featureId: 'Puzzles',
      difficulty: 'medium',
      ageGroup: '6-8',
      order: 2
    },
    {
      id: 'advanced-matching',
      name: 'Advanced Matching',
      description: 'Match objects with their uses',
      topicId: 'matching-pairs',
      featureId: 'Puzzles',
      difficulty: 'hard',
      ageGroup: '9+',
      order: 3
    },
    
    // Word Search subtopics
    {
      id: 'beginner-word-search',
      name: 'Beginner Word Search',
      description: 'Simple words in small grids',
      topicId: 'word-search',
      featureId: 'Puzzles',
      difficulty: 'easy',
      ageGroup: '6-8',
      order: 1
    },
    {
      id: 'intermediate-word-search',
      name: 'Intermediate Word Search',
      description: 'Moderate difficulty word search',
      topicId: 'word-search',
      featureId: 'Puzzles',
      difficulty: 'medium',
      ageGroup: '9-11',
      order: 2
    },
    
    // Sequence Completion subtopics
    {
      id: 'number-sequences',
      name: 'Number Sequences',
      description: 'Complete number patterns',
      topicId: 'sequence-completion',
      featureId: 'Puzzles',
      difficulty: 'medium',
      ageGroup: '8+',
      order: 1
    },
    {
      id: 'letter-sequences',
      name: 'Letter Sequences',
      description: 'Complete letter patterns',
      topicId: 'sequence-completion',
      featureId: 'Puzzles',
      difficulty: 'hard',
      ageGroup: '10+',
      order: 2
    },
    
    // Visual Patterns subtopics
    {
      id: 'shape-patterns',
      name: 'Shape Patterns',
      description: 'Identify shape sequences',
      topicId: 'visual-patterns',
      featureId: 'Puzzles',
      difficulty: 'easy',
      ageGroup: '5-7',
      order: 1
    },
    {
      id: 'color-patterns',
      name: 'Color Patterns',
      description: 'Identify color sequences',
      topicId: 'visual-patterns',
      featureId: 'Puzzles',
      difficulty: 'easy',
      ageGroup: '5-7',
      order: 2
    },
    
    // Lateral Thinking subtopics
    {
      id: 'classic-riddles',
      name: 'Classic Riddles',
      description: 'Traditional riddles and brain teasers',
      topicId: 'lateral-thinking',
      featureId: 'Puzzles',
      difficulty: 'medium',
      ageGroup: '8+',
      order: 1
    },
    {
      id: 'visual-teasers',
      name: 'Visual Teasers',
      description: 'Visual lateral thinking challenges',
      topicId: 'lateral-thinking',
      featureId: 'Puzzles',
      difficulty: 'hard',
      ageGroup: '10+',
      order: 2
    },
    
    // Sudoku Style subtopics
    {
      id: 'mini-sudoku',
      name: 'Mini Sudoku (4x4)',
      description: 'Small sudoku grids for beginners',
      topicId: 'sudoku-style',
      featureId: 'Puzzles',
      difficulty: 'easy',
      ageGroup: '7-9',
      order: 1
    },
    {
      id: 'standard-sudoku',
      name: 'Standard Sudoku (9x9)',
      description: 'Classic sudoku puzzles',
      topicId: 'sudoku-style',
      featureId: 'Puzzles',
      difficulty: 'hard',
      ageGroup: '10+',
      order: 2
    }
  ];
  
  for (const subtopic of subtopics) {
    try {
      await db.collection('subtopics').doc(subtopic.id).set(subtopic);
      console.log(`   ✓ Created subtopic: ${subtopic.name}`);
    } catch (error) {
      console.error(`   ❌ Error creating subtopic ${subtopic.id}:`, error.message);
    }
  }
  
  console.log('\n✅ All subtopics created!\n');
  return subtopics;
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║   DELETE & RECREATE PUZZLES WITH UNIFIED STRUCTURE    ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    // Step 1: Delete all existing puzzles
    await deleteAllPuzzles();
    
    // Step 2: Create new categories
    await createCategories();
    
    // Step 3: Create new topics
    await createTopics();
    
    // Step 4: Create new subtopics
    await createSubtopics();
    
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║  ✅ ALL PUZZLES SUCCESSFULLY CREATED!                 ║');
    console.log('║                                                        ║');
    console.log('║  Hierarchy Created:                                    ║');
    console.log('║  ✓ 3 Categories (Traditional, Pattern, Logic)          ║');
    console.log('║  ✓ 7 Topics across all categories                      ║');
    console.log('║  ✓ 16 Subtopics with difficulty & age groups          ║');
    console.log('║                                                        ║');
    console.log('║  Next Steps:                                           ║');
    console.log('║  1. Refresh your admin panel (F5)                      ║');
    console.log('║  2. Navigate to: Features > Puzzles                    ║');
    console.log('║  3. Verify all categories display                      ║');
    console.log('║  4. Verify topics and subtopics appear                 ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
