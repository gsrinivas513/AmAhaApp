// migrateTopics.js
// One-time migration script to convert topic strings to topic IDs
// Run with: node migrateTopics.js

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Predefined topics to create
const topicsToCreate = [
  { name: "Animals", icon: "🐾", sortOrder: 1, description: "Learn about animals and their sounds" },
  { name: "Nature", icon: "🌿", sortOrder: 2, description: "Birds, insects, and nature" },
  { name: "Food", icon: "🍎", sortOrder: 3, description: "Fruits, vegetables, and food items" },
  { name: "Learning Basics", icon: "🎨", sortOrder: 4, description: "Colors, shapes, and fundamentals" },
  { name: "Math", icon: "🧮", sortOrder: 5, description: "Numbers, counting, and math basics" },
  { name: "Body", icon: "🙋", sortOrder: 6, description: "Body parts and health" },
  { name: "Science", icon: "🔬", sortOrder: 7, description: "Science and exploration" },
];

async function migrateTopics() {
  try {
    console.log("🚀 Starting topic migration...\n");

    // Step 1: Get all categories
    const categoriesSnap = await db.collection("categories").get();
    console.log(`📂 Found ${categoriesSnap.size} categories\n`);

    for (const categoryDoc of categoriesSnap.docs) {
      const categoryData = categoryDoc.data();
      const categoryId = categoryDoc.id;
      console.log(`\n📁 Processing category: ${categoryData.label || categoryData.name} (${categoryId})`);

      // Step 2: Create topics for this category
      const topicMap = {}; // Map of topic name -> topic ID
      
      for (const topicData of topicsToCreate) {
        const topicRef = await db.collection("topics").add({
          ...topicData,
          label: topicData.name,
          categoryId: categoryId,
          isPublished: true,
          subcategoryCount: 0,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        topicMap[topicData.name] = topicRef.id;
        console.log(`  ✅ Created topic: ${topicData.icon} ${topicData.name} (${topicRef.id})`);
      }

      // Step 3: Get all subcategories for this category
      const subcategoriesSnap = await db.collection("subcategories")
        .where("categoryId", "==", categoryId)
        .get();
      
      console.log(`\n  📋 Found ${subcategoriesSnap.size} subcategories to migrate`);

      // Step 4: Update each subcategory with topicId
      let updated = 0;
      let skipped = 0;
      let noMatch = 0;

      for (const subcatDoc of subcategoriesSnap.docs) {
        const subcatData = subcatDoc.data();
        const oldTopic = subcatData.topic; // Old string-based topic

        if (subcatData.topicId) {
          // Already has topicId, skip
          skipped++;
          continue;
        }

        if (!oldTopic) {
          console.log(`  ⏭️  Skipping "${subcatData.name}" - no topic set`);
          noMatch++;
          continue;
        }

        // Try to match old topic string to new topic ID
        const topicId = topicMap[oldTopic];
        
        if (topicId) {
          await db.collection("subcategories").doc(subcatDoc.id).update({
            topicId: topicId,
            // Keep old 'topic' field for now as backup
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          console.log(`  ✅ Migrated "${subcatData.name}": "${oldTopic}" → ${topicId}`);
          updated++;
        } else {
          console.log(`  ⚠️  No matching topic for "${subcatData.name}": "${oldTopic}"`);
          noMatch++;
        }
      }

      // Step 5: Update topic subcategory counts
      for (const [topicName, topicId] of Object.entries(topicMap)) {
        const countSnap = await db.collection("subcategories")
          .where("categoryId", "==", categoryId)
          .where("topicId", "==", topicId)
          .get();
        
        await db.collection("topics").doc(topicId).update({
          subcategoryCount: countSnap.size,
        });
        console.log(`  📊 Updated count for "${topicName}": ${countSnap.size} subcategories`);
      }

      console.log(`\n  📊 Summary for ${categoryData.label}:`);
      console.log(`     ✅ Updated: ${updated}`);
      console.log(`     ⏭️  Skipped (already migrated): ${skipped}`);
      console.log(`     ⚠️  No match found: ${noMatch}`);
    }

    console.log("\n\n✅ Migration completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Check the admin panel at /admin/topics");
    console.log("   2. Verify topics are showing correctly");
    console.log("   3. Create new subcategories using the topic dropdown");
    console.log("   4. Optional: Remove old 'topic' string fields from subcategories\n");

  } catch (error) {
    console.error("❌ Migration error:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

// Run the migration
migrateTopics();
