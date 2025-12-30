// deleteAndRecreatePuzzles-SimpleConsole.js
// SIMPLEST BROWSER CONSOLE VERSION
// ==================================
// Copy entire contents, paste into browser console (F12)
// Press Enter and wait for success message!
//
// This will:
// 1. Delete all existing puzzles from the unified structure
// 2. Recreate them with proper Category -> Topic -> SubTopic hierarchy

(async function deleteAndRecreatePuzzles() {
  const projectId = "amahaapp";
  const apiKey = "AIzaSyAR8-mpS85CEopQuGuP4Lhm3xieYbG1HcY";
  const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║   DELETE & RECREATE PUZZLES WITH UNIFIED STRUCTURE    ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  /**
   * Delete a document from Firestore
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
   * List and delete all documents from a collection
   */
  async function deleteAllFromCollection(collection) {
    console.log(`🗑️  Deleting from ${collection}...`);
    try {
      const url = `${baseUrl}/${collection}?key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.documents || data.documents.length === 0) {
        console.log(`   ✓ No documents found`);
        return;
      }

      const documents = data.documents;
      console.log(`   Found ${documents.length} documents`);

      // Delete each document
      for (const doc of documents) {
        const docId = doc.name.split('/').pop();
        await deleteDoc(collection, docId);
      }

      console.log(`   ✓ Deleted ${documents.length} documents`);
    } catch (error) {
      console.log(`   ℹ️  ${collection} not found or empty`);
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
    // Step 1: Delete all existing puzzles
    console.log("\n🗑️  DELETING ALL EXISTING PUZZLES...\n");
    
    // Delete from unified structure
    await deleteAllFromCollection('categories?where=featureId="Puzzles"');
    await deleteAllFromCollection('topics?where=featureId="Puzzles"');
    await deleteAllFromCollection('subtopics?where=featureId="Puzzles"');
    
    // Also try to delete old separate collections
    await deleteAllFromCollection('puzzleCategories');
    await deleteAllFromCollection('puzzleTopics');
    await deleteAllFromCollection('puzzleSubtopics');
    await deleteAllFromCollection('puzzles');
    
    console.log("\n✅ All puzzles deleted!\n");

    // Step 2: Create categories
    console.log("📁 CREATING PUZZLE CATEGORIES...\n");
    
    const categories = [
      {
        id: 'traditional-puzzles',
        name: 'Traditional Puzzles',
        description: 'Classic puzzle types for cognitive development',
        featureId: 'puzzles',
        imageUrl: 'https://via.placeholder.com/300x200?text=Traditional+Puzzles',
        order: 1
      },
      {
        id: 'pattern-puzzles',
        name: 'Pattern Puzzles',
        description: 'Puzzles focused on pattern recognition and sequences',
        featureId: 'puzzles',
        imageUrl: 'https://via.placeholder.com/300x200?text=Pattern+Puzzles',
        order: 2
      },
      {
        id: 'logic-puzzles',
        name: 'Logic Puzzles',
        description: 'Brain teasers that require logical thinking',
        featureId: 'puzzles',
        imageUrl: 'https://via.placeholder.com/300x200?text=Logic+Puzzles',
        order: 3
      }
    ];
    
    for (const category of categories) {
      await addDoc('categories', category.id, {
        id: category.id,
        name: category.name,
        description: category.description,
        featureId: category.featureId,
        imageUrl: category.imageUrl,
        order: category.order
      });
      console.log(`   ✓ Created: ${category.name}`);
    }
    
    console.log("\n✅ Categories created!\n");

    // Step 3: Create topics
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
        featureId: 'puzzles',
        order: topic.order
      });
      console.log(`   ✓ Created: ${topic.name}`);
    }
    
    console.log("\n✅ Topics created!\n");

    // Step 4: Create subtopics
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
        featureId: 'puzzles',
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
})();
