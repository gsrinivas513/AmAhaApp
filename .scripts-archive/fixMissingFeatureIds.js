// fixMissingFeatureIds.js
// This script fixes categories missing featureId by:
// 1. Finding which feature each category belongs to
// 2. Adding the correct featureId to the document
// 3. Logging all changes for verification

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://amaha-production.firebaseio.com"
  });
}

const db = admin.firestore();

// Feature IDs to use
const FEATURE_IDS = {
  QUIZZES: "quizzes",
  PUZZLES: "puzzles",
  STORIES: "stories",
  GAMES: "games"
};

async function fixMissingFeatureIds() {
  console.log("\n🔍 Starting to fix missing featureIds...\n");
  
  try {
    // 1. Get all categories from 'categories' collection
    console.log("📚 Loading categories from 'categories' collection...");
    const categoriesSnap = await db.collection("categories").getDocs();
    console.log(`Found ${categoriesSnap.size} documents\n`);

    let categoriesWithoutFeatureId = [];
    let categoriesWithFeatureId = [];
    let fixed = 0;
    let failed = [];

    // Analyze each category
    for (const doc of categoriesSnap.docs) {
      const data = doc.data();
      
      if (!data.featureId) {
        categoriesWithoutFeatureId.push({ id: doc.id, ...data });
      } else {
        categoriesWithFeatureId.push({ id: doc.id, featureId: data.featureId, name: data.name });
      }
    }

    console.log("📊 ANALYSIS RESULTS:");
    console.log(`   ✅ Categories WITH featureId: ${categoriesWithFeatureId.length}`);
    categoriesWithFeatureId.forEach(cat => {
      console.log(`      - ${cat.name} → ${cat.featureId}`);
    });

    console.log(`\n   ❌ Categories WITHOUT featureId: ${categoriesWithoutFeatureId.length}`);
    categoriesWithoutFeatureId.forEach(cat => {
      console.log(`      - ${cat.name} (ID: ${cat.id})`);
    });

    if (categoriesWithoutFeatureId.length === 0) {
      console.log("\n✅ All categories already have featureId set!");
      return;
    }

    // 2. Try to determine feature for categories without featureId
    console.log("\n🔧 Attempting to fix missing featureIds...\n");

    for (const cat of categoriesWithoutFeatureId) {
      try {
        // Check if this might be a quiz category (count questions)
        const questionsSnap = await db.collection("questions")
          .where("category", "==", cat.name)
          .limit(1)
          .getDocs();
        
        let assignedFeatureId = null;

        if (questionsSnap.size > 0) {
          // Has questions → likely a quiz category
          assignedFeatureId = FEATURE_IDS.QUIZZES;
        } else {
          // No questions → could be puzzle or game, default to QUIZZES for now
          // In production, you might need to manually specify
          assignedFeatureId = FEATURE_IDS.QUIZZES;
          console.warn(`⚠️  WARNING: Category "${cat.name}" has no questions. Defaulting to QUIZZES.`);
        }

        // Update the document
        await db.collection("categories").doc(cat.id).update({
          featureId: assignedFeatureId
        });

        console.log(`✅ Fixed: "${cat.name}" → ${assignedFeatureId}`);
        fixed++;

      } catch (error) {
        console.error(`❌ Failed to fix "${cat.name}":`, error.message);
        failed.push({ category: cat.name, error: error.message });
      }
    }

    // 3. Summary
    console.log("\n" + "=".repeat(60));
    console.log("📋 SUMMARY");
    console.log("=".repeat(60));
    console.log(`✅ Fixed: ${fixed} categories`);
    console.log(`❌ Failed: ${failed.length} categories`);

    if (failed.length > 0) {
      console.log("\n⚠️  FAILED CATEGORIES (Need manual fixing):");
      failed.forEach(f => {
        console.log(`   - ${f.category}: ${f.error}`);
      });
    }

    console.log("\n🎉 Migration complete!\n");

  } catch (error) {
    console.error("❌ Fatal error:", error);
  } finally {
    process.exit(0);
  }
}

// Run the migration
fixMissingFeatureIds();
