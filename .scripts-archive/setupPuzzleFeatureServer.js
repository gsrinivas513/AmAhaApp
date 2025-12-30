#!/usr/bin/env node

/**
 * setupPuzzleFeature.js - Server-side setup script
 * Run from terminal: node setupPuzzleFeature.js
 * Requires: Firebase Admin SDK (npm install firebase-admin)
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
// Make sure you have downloaded your Firebase service account key
const serviceAccountPath = path.join(__dirname, 'firebaseAdminKey.json');

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error('❌ Error: Cannot find firebaseAdminKey.json');
  console.error('Please download your Firebase service account key and save it as firebaseAdminKey.json');
  process.exit(1);
}

const db = admin.firestore();

async function setupPuzzleFeature() {
  try {
    console.log("🚀 Starting Puzzle Feature Setup...\n");

    // Step 1: Create or get Puzzle feature
    console.log("📝 Step 1: Creating Puzzle Feature...");
    const featuresRef = db.collection("features");
    const puzzleFeatureQuery = await featuresRef.where("featureType", "==", "puzzle").get();
    
    let puzzleFeatureId;
    if (puzzleFeatureQuery.empty) {
      const newFeature = {
        name: "Puzzles",
        label: "Puzzles",
        description: "Interactive visual and traditional puzzles for kids",
        icon: "🧩",
        enabled: true,
        featureType: "puzzle",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      const docRef = await featuresRef.add(newFeature);
      puzzleFeatureId = docRef.id;
      console.log("✅ Created Puzzle Feature:", puzzleFeatureId);
    } else {
      puzzleFeatureId = puzzleFeatureQuery.docs[0].id;
      console.log("✅ Puzzle Feature already exists:", puzzleFeatureId);
    }

    // Step 2: Create puzzle categories
    console.log("\n📁 Step 2: Creating Puzzle Categories...");
    const puzzleCategories = [
      {
        name: "Visual Puzzles",
        label: "Visual Puzzles",
        description: "Picture-based interactive puzzles",
        featureId: puzzleFeatureId,
        published: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        name: "Traditional Puzzles",
        label: "Traditional Puzzles",
        description: "Matching, ordering, and drag-drop puzzles",
        featureId: puzzleFeatureId,
        published: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }
    ];

    const categoryIds = {};
    const categoriesRef = db.collection("categories");
    
    for (const cat of puzzleCategories) {
      const existing = await categoriesRef
        .where("name", "==", cat.name)
        .where("featureId", "==", puzzleFeatureId)
        .get();
      
      if (existing.empty) {
        const catRef = await categoriesRef.add(cat);
        categoryIds[cat.name] = catRef.id;
        console.log(`  ✅ Created category: ${cat.name}`);
      } else {
        categoryIds[cat.name] = existing.docs[0].id;
        console.log(`  ✅ Category already exists: ${cat.name}`);
      }
    }

    // Step 3: Create topics for each category
    console.log("\n📚 Step 3: Creating Topics...");
    const topicsData = {
      "Visual Puzzles": [
        { name: "Picture Word", label: "Picture Word Matching" },
        { name: "Spot the Difference", label: "Spot the Difference" },
        { name: "Find Pairs", label: "Find Matching Pairs" },
        { name: "Picture Shadow", label: "Match Picture & Shadow" }
      ],
      "Traditional Puzzles": [
        { name: "Matching Pairs", label: "Matching Pairs" },
        { name: "Ordering", label: "Ordering Sequences" },
        { name: "Drag and Drop", label: "Drag and Drop Puzzles" }
      ]
    };

    const topicIds = {};
    const topicsRef = db.collection("topics");
    
    for (const [categoryName, topics] of Object.entries(topicsData)) {
      topicIds[categoryName] = {};
      const categoryId = categoryIds[categoryName];
      
      for (const topic of topics) {
        const existing = await topicsRef
          .where("name", "==", topic.name)
          .where("categoryId", "==", categoryId)
          .get();
        
        if (existing.empty) {
          const topicRef = await topicsRef.add({
            name: topic.name,
            label: topic.label,
            categoryId: categoryId,
            isPublished: true,
            sortOrder: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          topicIds[categoryName][topic.name] = topicRef.id;
          console.log(`  ✅ Created topic: ${topic.label}`);
        } else {
          topicIds[categoryName][topic.name] = existing.docs[0].id;
          console.log(`  ✅ Topic already exists: ${topic.label}`);
        }
      }
    }

    // Step 4: Create subtopics
    console.log("\n❓ Step 4: Creating SubTopics...");
    const subtopicsData = {
      "Visual Puzzles": {
        "Picture Word": [
          { name: "Level 1", label: "Beginner Level" },
          { name: "Level 2", label: "Intermediate Level" },
          { name: "Level 3", label: "Advanced Level" }
        ],
        "Spot the Difference": [
          { name: "Easy", label: "Easy Difficulty" },
          { name: "Medium", label: "Medium Difficulty" },
          { name: "Hard", label: "Hard Difficulty" }
        ],
        "Find Pairs": [
          { name: "Animals", label: "Animal Matching" },
          { name: "Numbers", label: "Number Matching" }
        ],
        "Picture Shadow": [
          { name: "Shape Matching", label: "Match Shadow to Shape" }
        ]
      },
      "Traditional Puzzles": {
        "Matching Pairs": [
          { name: "Basic", label: "Basic Matching" },
          { name: "Advanced", label: "Advanced Matching" }
        ],
        "Ordering": [
          { name: "Number Sequence", label: "Number Ordering" },
          { name: "Alphabet Sequence", label: "Alphabet Ordering" }
        ],
        "Drag and Drop": [
          { name: "Simple Drag", label: "Simple Drag Operations" },
          { name: "Complex Drag", label: "Complex Drag Scenarios" }
        ]
      }
    };

    const subtopicsRef = db.collection("subtopics");
    
    for (const [categoryName, topics] of Object.entries(subtopicsData)) {
      const categoryId = categoryIds[categoryName];
      
      for (const [topicName, subtopics] of Object.entries(topics)) {
        const topicId = topicIds[categoryName][topicName];
        
        for (const subtopic of subtopics) {
          const existing = await subtopicsRef
            .where("name", "==", subtopic.name)
            .where("categoryId", "==", categoryId)
            .where("topicId", "==", topicId)
            .get();
          
          if (existing.empty) {
            await subtopicsRef.add({
              name: subtopic.name,
              label: subtopic.label,
              categoryId: categoryId,
              topicId: topicId,
              published: true,
              quizCount: 0,
              puzzleCount: 0,
              createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`  ✅ Created subtopic: ${subtopic.label}`);
          } else {
            console.log(`  ✅ Subtopic already exists: ${subtopic.label}`);
          }
        }
      }
    }

    console.log("\n✅ Puzzle Feature Setup Complete!");
    console.log("\n📊 Created Structure:");
    console.log("Feature: Puzzles");
    console.log("├─ Visual Puzzles (Category)");
    console.log("│  ├─ Picture Word (Topic)");
    console.log("│  ├─ Spot the Difference (Topic)");
    console.log("│  ├─ Find Pairs (Topic)");
    console.log("│  └─ Picture Shadow (Topic)");
    console.log("└─ Traditional Puzzles (Category)");
    console.log("   ├─ Matching Pairs (Topic)");
    console.log("   ├─ Ordering (Topic)");
    console.log("   └─ Drag and Drop (Topic)");
    console.log("\n🎉 Database setup complete! Ready to create puzzles!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during setup:", error);
    process.exit(1);
  }
}

// Run the setup
setupPuzzleFeature();
