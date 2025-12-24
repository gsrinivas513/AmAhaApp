#!/usr/bin/env node

/**
 * Sample Puzzles Creation Script
 * 
 * This script creates sample puzzles in Firestore for testing purposes.
 * Run this AFTER you have set up Firestore and Firebase config.
 * 
 * Usage:
 *   node createSamplePuzzles.js
 * 
 * Prerequisites:
 *   1. Firebase project initialized in src/firebase/firebaseConfig.js
 *   2. Firestore database created in Firebase Console
 *   3. Categories, Topics, and Subtopics already exist in Firestore
 * 
 * What it creates:
 *   - 5 sample puzzles (1 of each type)
 *   - Sample data for each puzzle type
 *   - Published status set to true
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
 * Sample data for each puzzle type
 */
const SAMPLE_PUZZLES = [
  {
    title: "Learn Basic Colors",
    description: "Match colors with their names - perfect for toddlers learning color vocabulary",
    type: "picture-word",
    difficulty: "easy",
    ageGroup: "3-5",
    categoryName: "Learning",
    topicName: "Colors",
    subtopicName: "Basic Colors",
    xpReward: 10,
    isPublished: true,
    data: {
      pairs: [
        {
          id: "pair-1",
          image: "https://via.placeholder.com/150?text=Red",
          word: "Red"
        },
        {
          id: "pair-2",
          image: "https://via.placeholder.com/150?text=Blue",
          word: "Blue"
        },
        {
          id: "pair-3",
          image: "https://via.placeholder.com/150?text=Yellow",
          word: "Yellow"
        },
        {
          id: "pair-4",
          image: "https://via.placeholder.com/150?text=Green",
          word: "Green"
        }
      ],
      layout: "grid-2x2"
    }
  },
  {
    title: "Find the Differences - Park Scene",
    description: "Can you find all 5 differences between the two park images?",
    type: "spot-difference",
    difficulty: "medium",
    ageGroup: "6-8",
    categoryName: "Games",
    topicName: "Observation",
    subtopicName: "Spot Differences",
    xpReward: 20,
    isPublished: true,
    data: {
      imageA: "https://via.placeholder.com/400x300?text=Park+Image+A",
      imageB: "https://via.placeholder.com/400x300?text=Park+Image+B",
      differences: [
        { id: "diff-1", x: 25, y: 30, radius: 20 },
        { id: "diff-2", x: 75, y: 45, radius: 18 },
        { id: "diff-3", x: 50, y: 70, radius: 22 },
        { id: "diff-4", x: 15, y: 60, radius: 20 },
        { id: "diff-5", x: 85, y: 80, radius: 19 }
      ]
    }
  },
  {
    title: "Animal Memory Game",
    description: "Find matching pairs of animals - classic memory game fun!",
    type: "find-pair",
    difficulty: "easy",
    ageGroup: "4-6",
    categoryName: "Games",
    topicName: "Memory",
    subtopicName: "Animal Pairs",
    xpReward: 15,
    isPublished: true,
    data: {
      cards: [
        {
          id: "card-1",
          image: "https://via.placeholder.com/120?text=🐱+Cat"
        },
        {
          id: "card-2",
          image: "https://via.placeholder.com/120?text=🐶+Dog"
        },
        {
          id: "card-3",
          image: "https://via.placeholder.com/120?text=🐱+Cat"
        },
        {
          id: "card-4",
          image: "https://via.placeholder.com/120?text=🐰+Bunny"
        },
        {
          id: "card-5",
          image: "https://via.placeholder.com/120?text=🐶+Dog"
        },
        {
          id: "card-6",
          image: "https://via.placeholder.com/120?text=🐰+Bunny"
        }
      ],
      layout: "grid-2x3"
    }
  },
  {
    title: "Shadow Matching - Fruits",
    description: "Match fruit images with their shadows",
    type: "picture-shadow",
    difficulty: "medium",
    ageGroup: "5-7",
    categoryName: "Learning",
    topicName: "Shapes",
    subtopicName: "Shadows",
    xpReward: 18,
    isPublished: true,
    data: {
      pairs: [
        {
          id: "pair-1",
          image: "https://via.placeholder.com/100?text=🍎+Apple",
          shadow: "https://via.placeholder.com/100?text=Shadow+1"
        },
        {
          id: "pair-2",
          image: "https://via.placeholder.com/100?text=🍊+Orange",
          shadow: "https://via.placeholder.com/100?text=Shadow+2"
        },
        {
          id: "pair-3",
          image: "https://via.placeholder.com/100?text=🍌+Banana",
          shadow: "https://via.placeholder.com/100?text=Shadow+3"
        }
      ]
    }
  },
  {
    title: "Count to 5 - Sequence",
    description: "Put the numbers in the correct order from 1 to 5",
    type: "ordering",
    difficulty: "easy",
    ageGroup: "3-5",
    categoryName: "Learning",
    topicName: "Numbers",
    subtopicName: "Counting",
    xpReward: 12,
    isPublished: true,
    data: {
      items: [
        {
          id: "item-1",
          image: "https://via.placeholder.com/80?text=1",
          label: "One",
          order: 1
        },
        {
          id: "item-2",
          image: "https://via.placeholder.com/80?text=2",
          label: "Two",
          order: 2
        },
        {
          id: "item-3",
          image: "https://via.placeholder.com/80?text=3",
          label: "Three",
          order: 3
        },
        {
          id: "item-4",
          image: "https://via.placeholder.com/80?text=4",
          label: "Four",
          order: 4
        },
        {
          id: "item-5",
          image: "https://via.placeholder.com/80?text=5",
          label: "Five",
          order: 5
        }
      ],
      itemType: "numbers"
    }
  }
];

/**
 * Create sample puzzles
 */
async function createSamplePuzzles() {
  try {
    console.log('📝 Starting sample puzzle creation...\n');

    // First, get category/topic/subtopic IDs from Firestore
    const categoriesSnapshot = await db.collection('categories').get();
    const categories = {};
    categoriesSnapshot.forEach(doc => {
      categories[doc.data().name] = doc.id;
    });

    console.log('📂 Found categories:', Object.keys(categories).join(', '));

    if (Object.keys(categories).length === 0) {
      console.error('❌ No categories found in Firestore');
      console.error('Please create categories first in Firestore');
      process.exit(1);
    }

    let createdCount = 0;

    for (const puzzle of SAMPLE_PUZZLES) {
      try {
        // Get category ID
        const categoryId = categories[puzzle.categoryName];
        if (!categoryId) {
          console.warn(`⚠️  Category "${puzzle.categoryName}" not found, skipping puzzle "${puzzle.title}"`);
          continue;
        }

        // Get topic ID
        const topicsSnapshot = await db.collection('topics')
          .where('categoryId', '==', categoryId)
          .where('name', '==', puzzle.topicName)
          .get();

        if (topicsSnapshot.empty) {
          console.warn(`⚠️  Topic "${puzzle.topicName}" not found, skipping puzzle "${puzzle.title}"`);
          continue;
        }

        const topicId = topicsSnapshot.docs[0].id;

        // Get subtopic ID
        const subtopicsSnapshot = await db.collection('subtopics')
          .where('topicId', '==', topicId)
          .where('name', '==', puzzle.subtopicName)
          .get();

        if (subtopicsSnapshot.empty) {
          console.warn(`⚠️  Subtopic "${puzzle.subtopicName}" not found, skipping puzzle "${puzzle.title}"`);
          continue;
        }

        const subtopicId = subtopicsSnapshot.docs[0].id;

        // Create puzzle document
        const puzzleData = {
          ...puzzle,
          categoryId,
          topicId,
          subtopicId,
          createdAt: admin.firestore.Timestamp.now(),
          updatedAt: admin.firestore.Timestamp.now(),
          createdBy: 'admin@example.com'
        };

        const docRef = await db.collection('puzzles').add(puzzleData);

        console.log(`✅ Created: ${puzzle.title}`);
        console.log(`   ID: ${docRef.id}`);
        console.log(`   Type: ${puzzle.type}`);
        console.log(`   Difficulty: ${puzzle.difficulty}`);
        console.log(`   Age Group: ${puzzle.ageGroup}`);
        console.log(`   Path: ${puzzle.categoryName} → ${puzzle.topicName} → ${puzzle.subtopicName}\n`);

        createdCount++;
      } catch (error) {
        console.error(`❌ Error creating puzzle "${puzzle.title}":`, error.message);
      }
    }

    console.log(`\n🎉 Summary: Created ${createdCount} sample puzzles`);
    console.log('\n📝 Next steps:');
    console.log('1. Visit http://localhost:3000/admin/create-visual-puzzle');
    console.log('2. Browse categories to see your sample puzzles');
    console.log('3. Edit puzzles to use real images instead of placeholders');
    console.log('4. Test the puzzle gameplay\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await admin.app().delete();
    process.exit(0);
  }
}

// Run the script
createSamplePuzzles();
