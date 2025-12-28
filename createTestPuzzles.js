/**
 * createTestPuzzles.js
 * Creates comprehensive test puzzles for all puzzle types
 * 
 * OPTION 1: Run with Firebase Admin SDK
 * Setup: Place serviceAccountKey.json in project root, then run:
 * $ node createTestPuzzles.js
 * 
 * OPTION 2: Run as Cloud Function
 * Navigate to: http://localhost:3000/admin/create-test-puzzles
 * 
 * OPTION 3: Use Firebase Console
 * Firestore > puzzles collection > Add Document
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Try to initialize Firebase Admin
let db = null;

try {
  const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://amaha-learning.firebaseio.com"
    });
    db = admin.firestore();
    console.log("✅ Firebase Admin SDK initialized with serviceAccountKey.json\n");
  } else {
    throw new Error("serviceAccountKey.json not found");
  }
} catch (error) {
  console.error("❌ Error initializing Firebase Admin:", error.message);
  console.log("\n📋 SETUP INSTRUCTIONS:");
  console.log("1. Download your Firebase serviceAccountKey.json from:");
  console.log("   Firebase Console > Project Settings > Service Accounts > Generate New Private Key");
  console.log("2. Place it in the project root: /Users/srini/Desktop/AmAha/AmAhaApp/amaha-web/");
  console.log("3. Run this script again\n");
  console.log("OR use the web UI instead:");
  console.log("   - Go to: http://localhost:3000/admin/create-test-puzzles");
  console.log("   - OR manually create puzzles in Firestore Console\n");
  process.exit(1);
}

async function createTestPuzzles() {
  console.log("🧩 Creating Test Puzzles for All Types...\n");

  try {
    // First, ensure categories and topics exist
    const categoryRef = db.collection('categories').doc('logic-puzzles');
    const categoryData = await categoryRef.get();
    
    if (!categoryData.exists) {
      console.log("Creating Logic Puzzles category...");
      await categoryRef.set({
        name: 'logic-puzzles',
        label: 'Logic Puzzles',
        icon: '🧩',
        featureId: 'puzzles',
        uiMode: 'puzzle',
        isPublished: true,
        createdAt: new Date(),
        quizCount: 0,
      });
    }

    // Create test puzzles for each type
    const puzzles = [
      // 1. Picture-Word Matching
      {
        title: "Match Animals with Names",
        description: "Match each animal picture with its correct name",
        type: "picture-word",
        difficulty: "easy",
        ageGroup: "6-8",
        category: "Logic Puzzles",
        categoryId: "logic-puzzles",
        topic: "Picture Word Matching",
        topicId: "picture-word",
        subtopic: "Animals",
        subtopicId: "picture-word-animals",
        isPublished: true,
        data: {
          pairs: [
            {
              id: "pair-1",
              image: "https://via.placeholder.com/100/0000FF/ffffff?text=🐱",
              word: "Cat"
            },
            {
              id: "pair-2",
              image: "https://via.placeholder.com/100/00FF00/ffffff?text=🐶",
              word: "Dog"
            },
            {
              id: "pair-3",
              image: "https://via.placeholder.com/100/FF0000/ffffff?text=🐭",
              word: "Mouse"
            },
            {
              id: "pair-4",
              image: "https://via.placeholder.com/100/FFFF00/000000?text=🦁",
              word: "Lion"
            }
          ],
          layout: "grid-2x2"
        },
        featureId: "puzzles"
      },

      // 2. Spot the Difference
      {
        title: "Find 3 Differences",
        description: "Find all the differences between the two images",
        type: "spot-difference",
        difficulty: "easy",
        ageGroup: "6-8",
        category: "Logic Puzzles",
        categoryId: "logic-puzzles",
        topic: "Spot Difference",
        topicId: "spot-difference",
        subtopic: "Beginner",
        subtopicId: "spot-diff-beginner",
        isPublished: true,
        data: {
          imageA: "https://via.placeholder.com/300x200/FF6B6B/ffffff?text=Image+A",
          imageB: "https://via.placeholder.com/300x200/4ECDC4/ffffff?text=Image+B",
          differences: [
            { x: 50, y: 50, radius: 30 },
            { x: 150, y: 75, radius: 25 },
            { x: 250, y: 120, radius: 20 }
          ],
          difficultyHint: 3
        },
        featureId: "puzzles"
      },

      // 3. Find Matching Pair (Memory Game)
      {
        title: "Memory Game - Colors",
        description: "Flip cards to find matching color pairs",
        type: "find-pair",
        difficulty: "easy",
        ageGroup: "6-8",
        category: "Logic Puzzles",
        categoryId: "logic-puzzles",
        topic: "Find Pairs",
        topicId: "find-pairs",
        subtopic: "Colors",
        subtopicId: "find-pairs-colors",
        isPublished: true,
        data: {
          cards: [
            {
              id: "card-1",
              image: "https://via.placeholder.com/80/FF0000/ffffff?text=Red",
              pairId: "pair-red"
            },
            {
              id: "card-2",
              image: "https://via.placeholder.com/80/00FF00/ffffff?text=Green",
              pairId: "pair-green"
            },
            {
              id: "card-3",
              image: "https://via.placeholder.com/80/0000FF/ffffff?text=Blue",
              pairId: "pair-blue"
            },
            {
              id: "card-4",
              image: "https://via.placeholder.com/80/FFFF00/000000?text=Yellow",
              pairId: "pair-yellow"
            },
            {
              id: "card-5",
              image: "https://via.placeholder.com/80/FF0000/ffffff?text=Red",
              pairId: "pair-red"
            },
            {
              id: "card-6",
              image: "https://via.placeholder.com/80/00FF00/ffffff?text=Green",
              pairId: "pair-green"
            },
            {
              id: "card-7",
              image: "https://via.placeholder.com/80/0000FF/ffffff?text=Blue",
              pairId: "pair-blue"
            },
            {
              id: "card-8",
              image: "https://via.placeholder.com/80/FFFF00/000000?text=Yellow",
              pairId: "pair-yellow"
            }
          ],
          layout: "grid-4x2"
        },
        featureId: "puzzles"
      },

      // 4. Picture-Shadow Matching
      {
        title: "Match Objects with Shadows",
        description: "Match each object with its correct shadow",
        type: "picture-shadow",
        difficulty: "medium",
        ageGroup: "6-8",
        category: "Logic Puzzles",
        categoryId: "logic-puzzles",
        topic: "Picture Shadow",
        topicId: "picture-shadow",
        subtopic: "Shapes",
        subtopicId: "picture-shadow-shapes",
        isPublished: true,
        data: {
          pairs: [
            {
              id: "shadow-pair-1",
              image: "https://via.placeholder.com/80/FF6B6B/ffffff?text=Cup",
              shadow: "https://via.placeholder.com/80/000000/ffffff?text=Shadow"
            },
            {
              id: "shadow-pair-2",
              image: "https://via.placeholder.com/80/4ECDC4/ffffff?text=Star",
              shadow: "https://via.placeholder.com/80/000000/ffffff?text=Shadow"
            },
            {
              id: "shadow-pair-3",
              image: "https://via.placeholder.com/80/45B7D1/ffffff?text=Tree",
              shadow: "https://via.placeholder.com/80/000000/ffffff?text=Shadow"
            },
            {
              id: "shadow-pair-4",
              image: "https://via.placeholder.com/80/96CEB4/ffffff?text=House",
              shadow: "https://via.placeholder.com/80/000000/ffffff?text=Shadow"
            }
          ]
        },
        featureId: "puzzles"
      },

      // 5. Ordering/Sequencing
      {
        title: "Order by Size - Small to Large",
        description: "Drag the apples from smallest to largest",
        type: "ordering",
        difficulty: "easy",
        ageGroup: "6-8",
        category: "Logic Puzzles",
        categoryId: "logic-puzzles",
        topic: "Ordering",
        topicId: "ordering",
        subtopic: "Size Sequencing",
        subtopicId: "ordering-size",
        isPublished: true,
        data: {
          items: [
            {
              id: "item-1",
              label: "Small Apple",
              image: "https://via.placeholder.com/60/FF0000/ffffff?text=Small",
              order: 1
            },
            {
              id: "item-2",
              label: "Medium Apple",
              image: "https://via.placeholder.com/90/FF0000/ffffff?text=Medium",
              order: 2
            },
            {
              id: "item-3",
              label: "Large Apple",
              image: "https://via.placeholder.com/120/FF0000/ffffff?text=Large",
              order: 3
            }
          ],
          correctOrder: [1, 2, 3]
        },
        featureId: "puzzles"
      },

      // Intermediate Level Puzzles
      {
        title: "Match Fruit Names",
        description: "Match each fruit picture with its name",
        type: "picture-word",
        difficulty: "medium",
        ageGroup: "6-8",
        category: "Logic Puzzles",
        categoryId: "logic-puzzles",
        topic: "Picture Word Matching",
        topicId: "picture-word",
        subtopic: "Fruits",
        subtopicId: "picture-word-fruits",
        isPublished: true,
        data: {
          pairs: [
            {
              id: "fruit-1",
              image: "https://via.placeholder.com/100/FF0000/ffffff?text=🍎",
              word: "Apple"
            },
            {
              id: "fruit-2",
              image: "https://via.placeholder.com/100/FFFF00/000000?text=🍌",
              word: "Banana"
            },
            {
              id: "fruit-3",
              image: "https://via.placeholder.com/100/FF7F00/ffffff?text=🍊",
              word: "Orange"
            },
            {
              id: "fruit-4",
              image: "https://via.placeholder.com/100/FF1493/ffffff?text=🍓",
              word: "Strawberry"
            },
            {
              id: "fruit-5",
              image: "https://via.placeholder.com/100/9370DB/ffffff?text=🍇",
              word: "Grapes"
            },
            {
              id: "fruit-6",
              image: "https://via.placeholder.com/100/00CED1/ffffff?text=🥥",
              word: "Coconut"
            }
          ],
          layout: "grid-3x2"
        },
        featureId: "puzzles"
      },

      // Advanced Ordering
      {
        title: "Number Sequence 1-5",
        description: "Arrange the numbers from 1 to 5 in correct order",
        type: "ordering",
        difficulty: "medium",
        ageGroup: "6-8",
        category: "Logic Puzzles",
        categoryId: "logic-puzzles",
        topic: "Ordering",
        topicId: "ordering",
        subtopic: "Number Sequences",
        subtopicId: "ordering-numbers",
        isPublished: true,
        data: {
          items: [
            { id: "num-1", label: "Five", image: "https://via.placeholder.com/100/0000FF/ffffff?text=5", order: 5 },
            { id: "num-2", label: "Two", image: "https://via.placeholder.com/100/0000FF/ffffff?text=2", order: 2 },
            { id: "num-3", label: "Four", image: "https://via.placeholder.com/100/0000FF/ffffff?text=4", order: 4 },
            { id: "num-4", label: "One", image: "https://via.placeholder.com/100/0000FF/ffffff?text=1", order: 1 },
            { id: "num-5", label: "Three", image: "https://via.placeholder.com/100/0000FF/ffffff?text=3", order: 3 }
          ],
          correctOrder: [1, 2, 3, 4, 5]
        },
        featureId: "puzzles"
      },

      // Hard Memory Game
      {
        title: "Memory Game - Objects",
        description: "Flip cards to find matching object pairs (harder version)",
        type: "find-pair",
        difficulty: "hard",
        ageGroup: "9-12",
        category: "Logic Puzzles",
        categoryId: "logic-puzzles",
        topic: "Find Pairs",
        topicId: "find-pairs",
        subtopic: "Objects",
        subtopicId: "find-pairs-objects",
        isPublished: true,
        data: {
          cards: [
            { id: "obj-1", image: "https://via.placeholder.com/80/FF6B6B/ffffff?text=🎸", pairId: "guitar" },
            { id: "obj-2", image: "https://via.placeholder.com/80/4ECDC4/ffffff?text=⚽", pairId: "ball" },
            { id: "obj-3", image: "https://via.placeholder.com/80/45B7D1/ffffff?text=🎮", pairId: "game" },
            { id: "obj-4", image: "https://via.placeholder.com/80/96CEB4/ffffff?text=📚", pairId: "book" },
            { id: "obj-5", image: "https://via.placeholder.com/80/FFEAA7/ffffff?text=🍕", pairId: "pizza" },
            { id: "obj-6", image: "https://via.placeholder.com/80/DFE6E9/ffffff?text=💻", pairId: "computer" },
            { id: "obj-7", image: "https://via.placeholder.com/80/FF6B6B/ffffff?text=🎸", pairId: "guitar" },
            { id: "obj-8", image: "https://via.placeholder.com/80/4ECDC4/ffffff?text=⚽", pairId: "ball" },
            { id: "obj-9", image: "https://via.placeholder.com/80/45B7D1/ffffff?text=🎮", pairId: "game" },
            { id: "obj-10", image: "https://via.placeholder.com/80/96CEB4/ffffff?text=📚", pairId: "book" },
            { id: "obj-11", image: "https://via.placeholder.com/80/FFEAA7/ffffff?text=🍕", pairId: "pizza" },
            { id: "obj-12", image: "https://via.placeholder.com/80/DFE6E9/ffffff?text=💻", pairId: "computer" }
          ],
          layout: "grid-4x3"
        },
        featureId: "puzzles"
      }
    ];

    // Add puzzles to Firestore
    console.log(`Creating ${puzzles.length} test puzzles...\n`);
    
    let createdCount = 0;
    for (const puzzle of puzzles) {
      try {
        const docRef = await db.collection('puzzles').add({
          ...puzzle,
          createdAt: new Date(),
          updatedAt: new Date(),
          xpReward: puzzle.difficulty === 'easy' ? 10 : puzzle.difficulty === 'medium' ? 20 : 30,
          timeLimit: null,
          hints: 2
        });

        console.log(`✅ Created: "${puzzle.title}" (${puzzle.type})`);
        createdCount++;
      } catch (error) {
        console.error(`❌ Failed to create "${puzzle.title}":`, error.message);
      }
    }

    console.log(`\n✨ Successfully created ${createdCount}/${puzzles.length} test puzzles!\n`);
    console.log("📍 Test Puzzles Location:");
    console.log("   Category: Logic Puzzles");
    console.log("   URL: http://localhost:3000/quiz/Logic%20Puzzles");
    console.log("\n📝 Available Puzzle Types:");
    console.log("   1. Picture-Word Matching (2 puzzles)");
    console.log("   2. Spot the Difference (1 puzzle)");
    console.log("   3. Find Matching Pair (2 puzzles)");
    console.log("   4. Picture-Shadow Matching (1 puzzle)");
    console.log("   5. Ordering/Sequencing (2 puzzles)");

    process.exit(0);
  } catch (error) {
    console.error("Fatal Error:", error);
    process.exit(1);
  }
}

// Run the script
createTestPuzzles();
