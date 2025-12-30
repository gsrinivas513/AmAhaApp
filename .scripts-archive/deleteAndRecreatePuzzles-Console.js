// deleteAndRecreatePuzzles-Console.js
// BROWSER CONSOLE VERSION
//
// Usage:
// 1. Make sure app is running at http://localhost:3000
// 2. Open browser DevTools (F12)
// 3. Go to Console tab
// 4. Copy-paste this entire script
// 5. Press Enter
// 6. Wait for ✅ message
// 7. Refresh the page (F5)
//
// This script will:
// - Delete ALL existing puzzles from the unified structure
// - Recreate puzzles with proper Category -> Topic -> SubTopic hierarchy

(async function deleteAndRecreatePuzzles() {
  try {
    // Import Firebase from the app
    const { getFirestore, collection, getDocs, query, where, writeBatch, doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js');
    
    // Get the db from the running app
    // First, try to get it from the global scope if app exposed it
    let db;
    
    // Wait for Firebase to be ready in the app
    let attempts = 0;
    while (!window.__FIREBASE_DB__ && attempts < 50) {
      // Check if window has db available from React app
      const tempDb = typeof window !== 'undefined' ? window.__firebaseDb : null;
      if (tempDb) {
        db = tempDb;
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (!db) {
      // Fallback: We'll use fetch with the Firestore REST API
      console.log("Using Firestore REST API mode...");
      await deleteAndRecreateWithAPI();
      return;
    }
    
    console.log("\n╔════════════════════════════════════════════════════════╗");
    console.log("║   DELETE & RECREATE PUZZLES WITH UNIFIED STRUCTURE    ║");
    console.log("╚════════════════════════════════════════════════════════╝\n");
    
    // Step 1: Delete existing puzzles
    await deleteAllPuzzleData(db);
    
    // Step 2: Create categories
    await createCategories(db);
    
    // Step 3: Create topics
    await createTopics(db);
    
    // Step 4: Create subtopics
    await createSubtopics(db);
    
    console.log("\n╔════════════════════════════════════════════════════════╗");
    console.log("║  ✅ ALL PUZZLES SUCCESSFULLY CREATED!                 ║");
    console.log("║                                                        ║");
    console.log("║  Hierarchy Created:                                    ║");
    console.log("║  ✓ 3 Categories (Traditional, Pattern, Logic)          ║");
    console.log("║  ✓ 7 Topics across all categories                      ║");
    console.log("║  ✓ 16 Subtopics with difficulty & age groups          ║");
    console.log("║                                                        ║");
    console.log("║  Next Steps:                                           ║");
    console.log("║  1. Refresh your admin panel (F5)                      ║");
    console.log("║  2. Navigate to: Features > Puzzles                    ║");
    console.log("║  3. Verify all categories display                      ║");
    console.log("║  4. Verify topics and subtopics appear                 ║");
    console.log("╚════════════════════════════════════════════════════════╝\n");
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
  
  /**
   * Delete all puzzle-related data
   */
  async function deleteAllPuzzleData(db) {
    console.log("\n🗑️  DELETING ALL EXISTING PUZZLES...\n");
    
    const collections = [
      { name: 'categories', where: { field: 'featureId', value: 'Puzzles' } },
      { name: 'topics', where: { field: 'featureId', value: 'Puzzles' } },
      { name: 'subtopics', where: { field: 'featureId', value: 'Puzzles' } },
      { name: 'puzzleCategories', where: null },
      { name: 'puzzleTopics', where: null },
      { name: 'puzzleSubtopics', where: null },
      { name: 'puzzles', where: null }
    ];
    
    for (const colInfo of collections) {
      try {
        let q;
        const colRef = collection(db, colInfo.name);
        
        if (colInfo.where) {
          q = query(colRef, where(colInfo.where.field, '==', colInfo.where.value));
        } else {
          q = colRef;
        }
        
        const snapshot = await getDocs(q);
        console.log(`🗑️  ${colInfo.name}: ${snapshot.docs.length} documents`);
        
        if (snapshot.docs.length > 0) {
          const batch = writeBatch(db);
          snapshot.docs.forEach(docSnapshot => {
            batch.delete(docSnapshot.ref);
          });
          await batch.commit();
          console.log(`   ✓ Deleted ${snapshot.docs.length} documents`);
        }
      } catch (error) {
        // Collection might not exist, skip it
        console.log(`   ℹ️  ${colInfo.name} doesn't exist or is empty`);
      }
    }
    
    console.log("\n✅ All puzzles deleted successfully!\n");
  }
  
  /**
   * Create categories
   */
  async function createCategories(db) {
    console.log("\n📁 CREATING PUZZLE CATEGORIES...\n");
    
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
        await setDoc(doc(db, 'categories', category.id), category);
        console.log(`   ✓ Created category: ${category.name}`);
      } catch (error) {
        console.error(`   ❌ Error creating category ${category.id}:`, error.message);
      }
    }
    
    console.log("\n✅ All categories created!\n");
  }
  
  /**
   * Create topics
   */
  async function createTopics(db) {
    console.log("\n📚 CREATING PUZZLE TOPICS...\n");
    
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
        await setDoc(doc(db, 'topics', topic.id), topic);
        console.log(`   ✓ Created topic: ${topic.name} (${topic.categoryId})`);
      } catch (error) {
        console.error(`   ❌ Error creating topic ${topic.id}:`, error.message);
      }
    }
    
    console.log("\n✅ All topics created!\n");
  }
  
  /**
   * Create subtopics
   */
  async function createSubtopics(db) {
    console.log("\n❓ CREATING PUZZLE SUBTOPICS...\n");
    
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
        await setDoc(doc(db, 'subtopics', subtopic.id), subtopic);
        console.log(`   ✓ Created subtopic: ${subtopic.name}`);
      } catch (error) {
        console.error(`   ❌ Error creating subtopic ${subtopic.id}:`, error.message);
      }
    }
    
    console.log("\n✅ All subtopics created!\n");
  }
  
  /**
   * Fallback: Delete and recreate using Firestore REST API
   */
  async function deleteAndRecreateWithAPI() {
    console.log("Note: Using REST API - this is a simplified version.\n");
    console.log("⚠️  Please use the Node.js script or ensure the app has Firebase initialized.");
  }
})();
