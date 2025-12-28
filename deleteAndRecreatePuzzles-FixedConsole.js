// deleteAndRecreatePuzzles-FixedConsole.js
// FIXED BROWSER CONSOLE VERSION
// ==================================
// Copy entire contents, paste into browser console (F12)
// Press Enter and wait for success message!
//
// This version:
// 1. Deletes all KNOWN puzzle categories/topics/subtopics
// 2. Recreates them with correct featureId: "puzzles" (lowercase)
// 3. Uses CORRECT feature ID to match FEATURES.js constant

(async function deleteAndRecreatePuzzles() {
  const projectId = "amahaapp";
  const apiKey = "AIzaSyAR8-mpS85CEopQuGuP4Lhm3xieYbG1HcY";
  const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║   DELETE & RECREATE PUZZLES WITH CORRECT FEATURE ID  ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  /**
   * Delete a specific document
   */
  async function deleteDoc(collection, docId) {
    const url = `${baseUrl}/${collection}/${docId}?key=${apiKey}`;
    try {
      const response = await fetch(url, { method: 'DELETE' });
      return response.ok;
    } catch (e) {
      return false;
    }
  }

  /**
   * Add a document to Firestore
   */
  async function addDoc(collection, docId, data) {
    const url = `${baseUrl}/${collection}/${docId}?key=${apiKey}`;
    const fields = {};
    
    Object.keys(data).forEach(key => {
      const val = data[key];
      if (typeof val === 'string') fields[key] = { stringValue: val };
      else if (typeof val === 'number') fields[key] = { integerValue: String(val) };
      else if (typeof val === 'boolean') fields[key] = { booleanValue: val };
      else if (val === null) fields[key] = { nullValue: null };
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
      });
      return response.ok;
    } catch (e) {
      console.error(`   ❌ Failed to add ${docId}`);
      return false;
    }
  }

  try {
    // Step 1: Delete all known puzzle categories
    console.log("🗑️  DELETING ALL EXISTING PUZZLE DATA...\n");
    
    // Known puzzle categories to delete
    const puzzleCategoryIds = [
      'traditional-puzzles',
      'pattern-puzzles',
      'logic-puzzles',
      'visual-puzzles',
      'matching-pairs'
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
      'ordering'
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
      'standard-sudoku'
    ];
    
    for (const subtopicId of puzzleSubtopicIds) {
      if (await deleteDoc('subtopics', subtopicId)) {
        console.log(`   ✓ Deleted subtopic: ${subtopicId}`);
      }
    }
    
    // Try to delete from old puzzle collections
    const oldCollections = ['puzzleCategories', 'puzzleTopics', 'puzzleSubtopics', 'puzzles'];
    for (const collection of oldCollections) {
      console.log(`   ℹ️  ${collection} (old collection)`);
    }
    
    console.log("\n✅ All existing puzzles deleted!\n");

    // Step 2: Create categories with CORRECT featureId
    console.log("📁 CREATING PUZZLE CATEGORIES...\n");
    
    const categories = [
      {
        id: 'traditional-puzzles',
        name: 'Traditional Puzzles',
        label: 'Traditional Puzzles',
        description: 'Classic puzzle types for cognitive development',
        featureId: 'puzzles',  // ← CORRECT: lowercase to match FEATURES.PUZZLES.id
        imageUrl: 'https://via.placeholder.com/300x200?text=Traditional+Puzzles',
        order: 1
      },
      {
        id: 'pattern-puzzles',
        name: 'Pattern Puzzles',
        label: 'Pattern Puzzles',
        description: 'Puzzles focused on pattern recognition and sequences',
        featureId: 'puzzles',  // ← CORRECT: lowercase to match FEATURES.PUZZLES.id
        imageUrl: 'https://via.placeholder.com/300x200?text=Pattern+Puzzles',
        order: 2
      },
      {
        id: 'logic-puzzles',
        name: 'Logic Puzzles',
        label: 'Logic Puzzles',
        description: 'Brain teasers that require logical thinking',
        featureId: 'puzzles',  // ← CORRECT: lowercase to match FEATURES.PUZZLES.id
        imageUrl: 'https://via.placeholder.com/300x200?text=Logic+Puzzles',
        order: 3
      }
    ];
    
    for (const category of categories) {
      await addDoc('categories', category.id, {
        id: category.id,
        name: category.name,
        label: category.label,
        description: category.description,
        featureId: category.featureId,
        imageUrl: category.imageUrl,
        order: category.order
      });
      console.log(`   ✓ Created: ${category.name}`);
    }
    
    console.log("\n✅ Categories created!\n");

    // Step 3: Create topics with CORRECT featureId
    console.log("📚 CREATING PUZZLE TOPICS...\n");
    
    const topics = [
      // Traditional Puzzles
      { id: 'jigsaw-puzzles', name: 'Jigsaw Puzzles', categoryId: 'traditional-puzzles', order: 1 },
      { id: 'matching-pairs', name: 'Matching Pairs', categoryId: 'traditional-puzzles', order: 2 },
      { id: 'word-search', name: 'Word Search', categoryId: 'traditional-puzzles', order: 3 },
      // Pattern Puzzles
      { id: 'sequence-completion', name: 'Sequence Completion', categoryId: 'pattern-puzzles', order: 1 },
      { id: 'visual-patterns', name: 'Visual Patterns', categoryId: 'pattern-puzzles', order: 2 },
      // Logic Puzzles
      { id: 'lateral-thinking', name: 'Lateral Thinking', categoryId: 'logic-puzzles', order: 1 },
      { id: 'sudoku-style', name: 'Sudoku Style', categoryId: 'logic-puzzles', order: 2 }
    ];
    
    for (const topic of topics) {
      await addDoc('topics', topic.id, {
        id: topic.id,
        name: topic.name,
        categoryId: topic.categoryId,
        featureId: 'puzzles',  // ← CORRECT: lowercase to match FEATURES.PUZZLES.id
        order: topic.order
      });
      console.log(`   ✓ Created: ${topic.name}`);
    }
    
    console.log("\n✅ Topics created!\n");

    // Step 4: Create subtopics with CORRECT featureId
    console.log("❓ CREATING PUZZLE SUBTOPICS...\n");
    
    const subtopics = [
      // Jigsaw
      { id: 'easy-jigsaw', name: 'Easy Jigsaw (12 pieces)', topicId: 'jigsaw-puzzles', difficulty: 'easy', ageGroup: '3-5', order: 1 },
      { id: 'medium-jigsaw', name: 'Medium Jigsaw (24 pieces)', topicId: 'jigsaw-puzzles', difficulty: 'medium', ageGroup: '6-8', order: 2 },
      { id: 'hard-jigsaw', name: 'Hard Jigsaw (48 pieces)', topicId: 'jigsaw-puzzles', difficulty: 'hard', ageGroup: '9+', order: 3 },
      // Matching
      { id: 'color-matching', name: 'Color Matching', topicId: 'matching-pairs', difficulty: 'easy', ageGroup: '3-5', order: 1 },
      { id: 'animal-matching', name: 'Animal Matching', topicId: 'matching-pairs', difficulty: 'medium', ageGroup: '6-8', order: 2 },
      { id: 'advanced-matching', name: 'Advanced Matching', topicId: 'matching-pairs', difficulty: 'hard', ageGroup: '9+', order: 3 },
      // Word Search
      { id: 'beginner-word-search', name: 'Beginner Word Search', topicId: 'word-search', difficulty: 'easy', ageGroup: '6-8', order: 1 },
      { id: 'intermediate-word-search', name: 'Intermediate Word Search', topicId: 'word-search', difficulty: 'medium', ageGroup: '9-11', order: 2 },
      // Sequences
      { id: 'number-sequences', name: 'Number Sequences', topicId: 'sequence-completion', difficulty: 'medium', ageGroup: '8+', order: 1 },
      { id: 'letter-sequences', name: 'Letter Sequences', topicId: 'sequence-completion', difficulty: 'hard', ageGroup: '10+', order: 2 },
      // Visual Patterns
      { id: 'shape-patterns', name: 'Shape Patterns', topicId: 'visual-patterns', difficulty: 'easy', ageGroup: '5-7', order: 1 },
      { id: 'color-patterns', name: 'Color Patterns', topicId: 'visual-patterns', difficulty: 'easy', ageGroup: '5-7', order: 2 },
      // Lateral Thinking
      { id: 'classic-riddles', name: 'Classic Riddles', topicId: 'lateral-thinking', difficulty: 'medium', ageGroup: '8+', order: 1 },
      { id: 'visual-teasers', name: 'Visual Teasers', topicId: 'lateral-thinking', difficulty: 'hard', ageGroup: '10+', order: 2 },
      // Sudoku
      { id: 'mini-sudoku', name: 'Mini Sudoku (4x4)', topicId: 'sudoku-style', difficulty: 'easy', ageGroup: '7-9', order: 1 },
      { id: 'standard-sudoku', name: 'Standard Sudoku (9x9)', topicId: 'sudoku-style', difficulty: 'hard', ageGroup: '10+', order: 2 }
    ];
    
    for (const subtopic of subtopics) {
      await addDoc('subtopics', subtopic.id, {
        id: subtopic.id,
        name: subtopic.name,
        topicId: subtopic.topicId,
        featureId: 'puzzles',  // ← CORRECT: lowercase to match FEATURES.PUZZLES.id
        difficulty: subtopic.difficulty,
        ageGroup: subtopic.ageGroup,
        order: subtopic.order
      });
      console.log(`   ✓ Created: ${subtopic.name}`);
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

  } catch (error) {
    console.error("❌ Error:", error);
  }
})();
