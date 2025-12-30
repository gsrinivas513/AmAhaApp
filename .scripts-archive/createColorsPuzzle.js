// Run this from: node createColorsPuzzle.js
// Make sure to run from the project root directory

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin (you may need to set up service account)
// For now, use this simplified version

async function createColorsPuzzle() {
  try {
    // Try to use the web SDK instead
    const { initializeApp } = require('firebase/app');
    const { getFirestore, collection, getDocs, query, where, setDoc, doc } = require('firebase/firestore');
    
    const firebaseConfig = require('./src/firebase/firebaseConfig.js').default || require('./src/firebase/firebaseConfig.js');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log("🔍 Checking if Colors puzzle exists in Firestore...");

    // Check if puzzle already exists
    const q = query(
      collection(db, "puzzles"),
      where("subtopicId", "==", "find-pairs-colors")
    );
    const snapshot = await getDocs(q);

    if (snapshot.docs.length > 0) {
      console.log("✅ Puzzle already exists!");
      console.log("Puzzle ID:", snapshot.docs[0].id);
      console.log("\nGo to edit it:");
      console.log(`http://localhost:3000/admin/create-visual-puzzle?id=${snapshot.docs[0].id}`);
      process.exit(0);
    }

    console.log("📝 Creating Colors puzzle...");

    const puzzleData = {
      title: "Memory Game - Colors",
      description: "Flip cards to find matching color pairs",
      type: "find-pair",
      difficulty: "easy",
      ageGroup: "6-8",
      categoryId: "logic-puzzles",
      categoryName: "Logic Puzzles",
      topicId: "find-pairs",
      topicName: "Find Pairs",
      subtopicId: "find-pairs-colors",
      subtopicName: "Colors",
      xpReward: 10,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: {
        layout: "grid-2x4",
        cards: [
          { id: "card-1", image: "" },
          { id: "card-2", image: "" },
          { id: "card-3", image: "" },
          { id: "card-4", image: "" },
          { id: "card-5", image: "" },
          { id: "card-6", image: "" },
          { id: "card-7", image: "" },
          { id: "card-8", image: "" }
        ]
      }
    };

    const docRef = doc(db, "puzzles", "find-pairs-colors");
    await setDoc(docRef, puzzleData);

    console.log("✅ Colors puzzle created successfully!");
    console.log("\nGo to edit it:");
    console.log("http://localhost:3000/admin/create-visual-puzzle?id=find-pairs-colors");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    
    // Fallback: provide manual instructions
    console.log("\n💡 Alternative: Create the puzzle manually:");
    console.log("1. Go to: http://localhost:3000/admin/create-visual-puzzle");
    console.log("2. Fill in:");
    console.log("   - Title: Memory Game - Colors");
    console.log("   - Type: Find Matching Pair");
    console.log("   - Category: Logic Puzzles");
    console.log("   - Topic: Find Pairs");
    console.log("   - Subtopic: Colors");
    console.log("   - Layout: 2x4 Grid");
    console.log("3. Upload color images");
    console.log("4. Click Save");
    
    process.exit(1);
  }
}

createColorsPuzzle();
