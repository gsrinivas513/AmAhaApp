// BROWSER CONSOLE VERSION - FIRESTORE REST API
// ============================================
// Usage:
// 1. Make sure app is running at http://localhost:3000
// 2. Open browser DevTools (F12)
// 3. Go to Console tab
// 4. Copy-paste THIS ENTIRE FILE into console
// 5. Press Enter and wait for setup to complete
// 6. Refresh the page (F5)

(async function setupPuzzleFeature() {
  try {
    console.log("🚀 Starting Puzzle Feature Setup via REST API...\n");

    // Get Firebase config from React app (stored in window)
    // Or you can hardcode it from your Firebase Console
    const firebaseConfig = {
      apiKey: "AIzaSyBDJx8mG6N5cK2xL9pQ4rT6uV7wX8yZ1aB",
      authDomain: "amaha-quiz-app.firebaseapp.com",
      projectId: "amaha-quiz-app",
      storageBucket: "amaha-quiz-app.appspot.com",
      messagingSenderId: "123456789000",
      appId: "1:123456789000:web:abcdef1234567890"
    };

    const projectId = firebaseConfig.projectId;
    const apiKey = firebaseConfig.apiKey;
    const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

    // Helper function to make REST calls to Firestore
    async function firestoreAdd(collectionPath, data) {
      try {
        const response = await fetch(`${baseUrl}/${collectionPath}?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: convertToFirestoreFormat(data)
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          console.error(`Error adding to ${collectionPath}:`, error);
          throw error;
        }
        
        const result = await response.json();
        return result;
      } catch (error) {
        console.error(`Failed to add to ${collectionPath}:`, error);
        throw error;
      }
    }

    // Helper function to check if document exists
    async function firestoreGet(docPath) {
      try {
        const response = await fetch(`${baseUrl}/${docPath}?key=${apiKey}`);
        if (response.status === 404) return null;
        if (!response.ok) throw new Error(await response.text());
        return await response.json();
      } catch (error) {
        console.error(`Error fetching ${docPath}:`, error);
        return null;
      }
    }

    // Convert JS objects to Firestore REST format
    function convertToFirestoreFormat(obj) {
      const fields = {};
      for (const [key, value] of Object.entries(obj)) {
        fields[key] = valueToFirestoreValue(value);
      }
      return fields;
    }

    function valueToFirestoreValue(value) {
      if (value === null || value === undefined) {
        return { nullValue: null };
      } else if (typeof value === 'boolean') {
        return { booleanValue: value };
      } else if (typeof value === 'number') {
        return { integerValue: String(value) };
      } else if (typeof value === 'string') {
        return { stringValue: value };
      } else if (Array.isArray(value)) {
        return {
          arrayValue: {
            values: value.map(v => valueToFirestoreValue(v))
          }
        };
      } else if (typeof value === 'object') {
        return {
          mapValue: {
            fields: convertToFirestoreFormat(value)
          }
        };
      }
      return { stringValue: String(value) };
    }

    // Check Puzzle feature exists
    console.log("📝 Step 1: Checking Puzzle Feature...");
    const puzzleFeatureDoc = await firestoreGet("features/Puzzles");
    
    if (!puzzleFeatureDoc) {
      console.log("   Creating Puzzle Feature...");
      await firestoreAdd("features", {
        id: "Puzzles",
        featureName: "Puzzles",
        featureType: "puzzle",
        status: "enabled",
        createdAt: new Date().toISOString(),
        description: "Visual and traditional puzzle games"
      });
      console.log("   ✅ Puzzle feature created");
    } else {
      console.log("   ✅ Puzzle feature already exists");
    }

    // Create puzzle categories
    console.log("\n📁 Step 2: Setting up Puzzle Categories...");
    
    const categories = [
      {
        id: "visual-puzzles",
        categoryName: "Visual Puzzles",
        featureName: "Puzzles",
        featureType: "puzzle",
        description: "Interactive visual puzzle games"
      },
      {
        id: "traditional-puzzles",
        categoryName: "Traditional Puzzles",
        featureName: "Puzzles",
        featureType: "puzzle",
        description: "Word matching, ordering, and drag-drop games"
      }
    ];

    for (const cat of categories) {
      const exists = await firestoreGet(`categories/${cat.id}`);
      if (!exists) {
        console.log(`   Creating category: ${cat.categoryName}...`);
        await firestoreAdd("categories", cat);
      }
    }
    console.log("   ✅ Categories ready");

    // Create visual puzzle types
    console.log("\n🎨 Step 3: Setting up Visual Puzzle Types...");
    
    const visualTypes = [
      {
        id: "picture-word",
        topicName: "Picture Word",
        categoryName: "Visual Puzzles",
        description: "Identify words from pictures"
      },
      {
        id: "spot-difference",
        topicName: "Spot Difference",
        categoryName: "Visual Puzzles",
        description: "Find differences between images"
      },
      {
        id: "find-pairs",
        topicName: "Find Pairs",
        categoryName: "Visual Puzzles",
        description: "Match pairs of images"
      },
      {
        id: "picture-shadow",
        topicName: "Picture Shadow",
        categoryName: "Visual Puzzles",
        description: "Match pictures to shadows"
      },
      {
        id: "matching-pairs",
        topicName: "Matching Pairs",
        categoryName: "Visual Puzzles",
        description: "Traditional matching game"
      }
    ];

    for (const type of visualTypes) {
      const exists = await firestoreGet(`topics/${type.id}`);
      if (!exists) {
        console.log(`   Creating type: ${type.topicName}...`);
        await firestoreAdd("topics", type);
      }
    }
    console.log("   ✅ Visual types ready");

    // Create traditional puzzle types
    console.log("\n📝 Step 4: Setting up Traditional Puzzle Types...");
    
    const traditionalTypes = [
      {
        id: "ordering",
        topicName: "Ordering",
        categoryName: "Traditional Puzzles",
        description: "Arrange items in correct order"
      },
      {
        id: "drag-drop",
        topicName: "Drag & Drop",
        categoryName: "Traditional Puzzles",
        description: "Drag items to drop zones"
      }
    ];

    for (const type of traditionalTypes) {
      const exists = await firestoreGet(`topics/${type.id}`);
      if (!exists) {
        console.log(`   Creating type: ${type.topicName}...`);
        await firestoreAdd("topics", type);
      }
    }
    console.log("   ✅ Traditional types ready");

    console.log("\n✅ PUZZLE FEATURE SETUP COMPLETE!");
    console.log("\n📌 Next steps:");
    console.log("   1. Refresh the page (F5 or Cmd+R)");
    console.log("   2. Go to Admin → Puzzles section");
    console.log("   3. Create sample puzzles using the guides");
    console.log("\n📚 Guides available:");
    console.log("   • QUICK_START_PUZZLES.md (fastest)");
    console.log("   • PUZZLE_TESTING_GUIDE.md (detailed)");

  } catch (error) {
    console.error("❌ Setup failed:", error);
    console.log("\n💡 Troubleshooting:");
    console.log("   1. Make sure the app is fully loaded");
    console.log("   2. Check browser console for network errors");
    console.log("   3. Verify your firebaseConfig matches your project");
    console.log("   4. Try the server-side version: node setupPuzzleFeatureServer.js");
  }
})();
